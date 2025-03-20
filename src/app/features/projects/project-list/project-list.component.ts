import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { GridComponent } from '../../../components/grid/grid.component';
import { ColumnsKeys, Project } from '../project.interface';
import { ProjectService } from '../../../services/project.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ModalService } from '../../../services/modal.service';
import { ConfirmationDialogComponent } from '../../../components/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list',
  imports: [GridComponent],
  template: `
    <section>
      @if(projects()) {
      <app-grid
        (onViewEvent)="onViewProject($event)"
        (onDeleteEvent)="onDeleteProject($event)"
        [displayedColumns]="displayedColumns"
        [data]="projects()"
        [sortableColumns]="sortableColumns"
        [columnHeaders]="columnHeaders"
      />
      }
    </section>
  `,
  styles: ``,
})
export class ProjectListComponent implements OnInit {
  private readonly _projectService = inject(ProjectService);
  private readonly _modalService = inject(ModalService);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);

  projects = signal<Project[]>([]);
  displayedColumns: ColumnsKeys<Project> = [
    'id',
    'projectName',
    'clientName',
    'modules',
    'action',
  ];
  sortableColumns: ColumnsKeys<Project> = [
    'id',
    'projectName',
    'clientName',
    'modules',
  ];
  columnHeaders: Record<string, string> = {
    id: 'Id',
    clientName: 'Nombre del cliente',
    projectName: 'Nombre del Proyecto',
    modules: 'Nº de Modulos',
    action: 'Acciones',
  };

  constructor() {
    effect(() => {
      this.projects.set(this._projectService.projects());
    });
  }

  ngOnInit(): void {
    const persistedProjects = this._projectService.getProjects();

    if (persistedProjects.length > 0) {
      this._projectService.projects.set(persistedProjects);
    } else {
      this._projectService
        .fetchProjectsFromJson()
        .pipe(
          takeUntilDestroyed(this._destroyRef),
          tap((projects: Project[]) => {
            this._projectService.projects.set(projects);
            this._projectService.saveProjects(projects);
          })
        )
        .subscribe();
    }
  }

  onViewProject(project: Project) {
    this._router.navigate([`/projects/project-detail/${project.id}`]);
  }

  onDeleteProject(project: Project) {
    this._modalService
      .openModal(
        ConfirmationDialogComponent,
        null,
        'Vas a eliminar el proyecto:' + project.projectName
      )
      .subscribe((confirmed) => {
        confirmed ? this._projectService.deleteProject(project.id) : null;
        this.openSnackBar('Proyecto eliminado correctamente');
      });
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}
