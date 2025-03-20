import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ProjectService } from '../../../services/project.service';
import { ModalService } from '../../../services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Project } from '../project.interface';

const MATERIAL_MODULES = [
  MatLabel,
  MatFormField,
  MatInput,
  MatButton,
  MatDialogModule,
];

@Component({
  selector: 'app-modal-project-form',
  imports: [MATERIAL_MODULES, ReactiveFormsModule],
  templateUrl: './modal-project-form.component.html',
  styleUrl: './modal-project-form.component.scss',
})
export class ModalProjectFormComponent implements OnInit {
  projectForm!: FormGroup;

  private readonly _fb = inject(FormBuilder);
  private readonly _matDialog = inject(MAT_DIALOG_DATA);
  private readonly _projectService = inject(ProjectService);
  private readonly _modalService = inject(ModalService);
  private readonly _snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this._buildForm();
    if (this._matDialog.isEditing) {
      this.projectForm.patchValue(this._matDialog.data);
      console.log(this.projectForm.value);
    }
  }

  async onSubmit() {
    let message = 'Proyecto creado correctamente';
    const project: Project = {
      ...this.projectForm.value,
      modules: [],
    };
    this._projectService.addProject(project);
    this.openSnackBar(message);
    this._modalService.closeModal();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  getTitle(): string {
    return this._matDialog.data ? 'Editar Proyecto' : 'Nuevo Proyecto';
  }

  private _buildForm(): void {
    this.projectForm = this._fb.nonNullable.group({
      projectName: ['', Validators.required],
      clientName: ['', Validators.required],
    });
  }
}
