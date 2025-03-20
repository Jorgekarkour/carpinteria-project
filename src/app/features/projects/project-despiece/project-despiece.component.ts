import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Despiece } from '../../modules/module.interface';
import { ColumnsKeys } from '../project.interface';
import { GridComponent } from '../../../components/grid/grid.component';

const MATERIAL_MODULES = [MatDialogModule];

@Component({
  selector: 'app-project-despiece',
  imports: [MATERIAL_MODULES, GridComponent],
  templateUrl: './project-despiece.component.html',
  styleUrl: './project-despiece.component.scss',
})
export class ProjectDespieceComponent implements OnInit {
  private readonly _modalService = inject(ModalService);
  private readonly _matDialog = inject(MAT_DIALOG_DATA);

  displayedColumns: ColumnsKeys<Despiece> = [
    'cantidad',
    'tipo',
    'altura',
    'ancho',
  ];

  despiece = signal<Despiece[]>([]);

  ngOnInit(): void {
    this.despiece.set(this._matDialog.data);
  }
}
