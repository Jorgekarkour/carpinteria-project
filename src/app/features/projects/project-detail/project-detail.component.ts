import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ColumnsKeys, Project } from '../project.interface';
import { MatCardActions, MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { GridComponent } from '../../../components/grid/grid.component';
import { Despiece, Module } from '../../modules/module.interface';
import { MatButton } from '@angular/material/button';
import { ModalService } from '../../../services/modal.service';
import { ModalModuleDetailComponent } from '../../modules/modal-module-detail/modal-module-detail.component';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { DespieceService } from '../../../services/despiece.service';
import { ProjectDespieceComponent } from '../project-despiece/project-despiece.component';
import { MatSnackBar } from '@angular/material/snack-bar';

const MATERIAL_MODULE = [MatCardModule, MatTableModule, MatButton];

@Component({
  selector: 'app-project-detail',
  imports: [MATERIAL_MODULE, GridComponent, RouterModule],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent implements OnInit {
  private readonly _projectService = inject(ProjectService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _modalService = inject(ModalService);
  private readonly _despieceService = inject(DespieceService);
  private readonly _snackBar = inject(MatSnackBar);

  project = signal<Project>({} as Project);
  totalDespiece = signal<Despiece[]>([]);
  displayedColumns: ColumnsKeys<Module> = [
    'id',
    'moduleType',
    'height',
    'width',
    'action',
  ];
  columnHeaders: Record<string, string> = {
    id: 'Id',
    moduleType: 'Módulo',
    height: 'Alto',
    width: 'Ancho',
    action: 'Acciones',
  };
  sortableColumns: ColumnsKeys<Module> = ['moduleType'];

  ngOnInit(): void {
    const id = Number(this._route.snapshot.paramMap.get('id'));
    this.project.set(this._projectService.getProjectById(id));
  }

  viewModuleDetail(module: Module) {
    this._modalService
      .openModal<ModalModuleDetailComponent, Module>(
        ModalModuleDetailComponent,
        module
      )
      .subscribe((updatedModule) => {
        if (updatedModule) {
          this.project.update((currentProject) => ({
            ...currentProject,
            modules: currentProject.modules.map((CurrentProjectModules) =>
              CurrentProjectModules.id === updatedModule.id
                ? updatedModule
                : CurrentProjectModules
            ),
          }));
          this._projectService.updateProject(this.project());
        }
      });
  }

  deleteModule(module: Module): void {
    this._modalService
      .openModal(
        ConfirmationDialogComponent,
        null,
        'Vas a eliminar el modulo:' + module.id
      )
      .subscribe((confirmed) => {
        if (confirmed) {
          const moduleId = module.id;
          this.project.update((currentProject) => ({
            ...currentProject,
            modules: currentProject.modules.filter(
              (module) => module.id !== moduleId
            ),
          }));
          this._projectService.updateProject(this.project());
          this.openSnackBar('Modulo eliminado correctamente');
        }
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  addNewModule() {
    this._modalService
      .openModal<ModalModuleDetailComponent, Module>(ModalModuleDetailComponent)
      .subscribe((newModule) => {
        if (newModule) {
          this.project.update((currentProject) => ({
            ...currentProject,
            modules: [
              ...currentProject.modules,
              { ...newModule, id: this.generateModuleId() },
            ],
          }));
          this._projectService.updateProject(this.project());
          this.openSnackBar('Modulo agregado correctamente');
        }
      });
  }

  showTotalDespiece() {
    this.getTotalDespiece();
    this._modalService.openModal(
      ProjectDespieceComponent,
      this.totalDespiece()
    );
  }

  getTotalDespiece() {
    const projectData = this.project();

    let totalDespiece: Despiece[] = [];

    projectData.modules.forEach((module) => {
      const moduleDespiece = this._despieceService.getDespiece(
        module.moduleType,
        module.width,
        !!module.hasDoors,
        module.doorCount || 0,
        module.shelfCount || 0
      );

      moduleDespiece.forEach((piece) => {
        const existingPiece = totalDespiece.find(
          (p) =>
            p.tipo === piece.tipo &&
            p.altura === piece.altura &&
            p.ancho === piece.ancho
        );

        if (existingPiece) {
          existingPiece.cantidad += piece.cantidad;
        } else {
          totalDespiece.push({ ...piece });
        }
      });
    });

    return this.totalDespiece.set(totalDespiece);
  }

  generateModuleId(): number {
    const maxId = this.project().modules.reduce(
      (max, module) => (module.id > max ? module.id : max),
      0
    );
    return maxId + 1;
  }
}
