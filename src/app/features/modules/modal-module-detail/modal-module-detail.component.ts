import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ModalService } from '../../../services/modal.service';
import { MatButton } from '@angular/material/button';
import {
  MatLabel,
  MatFormField,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Despiece, Module, ModuleType } from '../module.interface';
import { DespieceService } from '../../../services/despiece.service';
import { MatTableModule } from '@angular/material/table';
import { GridComponent } from '../../../components/grid/grid.component';
import { ColumnsKeys } from '../../projects/project.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

const MATERIAL_MODULES = [
  MatLabel,
  MatFormField,
  MatInput,
  MatButton,
  MatDialogModule,
  MatSelectModule,
  MatOptionModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatInputModule,
  CommonModule,
  MatTableModule,
];

@Component({
  selector: 'app-modal-module-detail',
  standalone: true,
  imports: [MATERIAL_MODULES, ReactiveFormsModule, GridComponent],
  templateUrl: './modal-module-detail.component.html',
  styleUrl: './modal-module-detail.component.scss',
})
export class ModalModuleDetailComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);
  private readonly _modalService = inject(ModalService);
  private readonly _matDialog = inject(MAT_DIALOG_DATA);
  private readonly _dialogRef = inject(
    MatDialogRef<ModalModuleDetailComponent>
  );
  private readonly _despieceService = inject(DespieceService);
  private readonly _snackBar = inject(MatSnackBar);

  moduleForm!: FormGroup;
  isEditMode = signal(false);
  module = signal<Module>({} as Module);
  displayedColumns: ColumnsKeys<Despiece> = [
    'cantidad',
    'tipo',
    'altura',
    'ancho',
  ];

  despiece = signal<Despiece[]>([]);

  moduleTypes = [
    { label: 'Estantería', value: ModuleType.ESTANTERIA },
    { label: 'Encimera', value: ModuleType.ENCIMERA },
  ];

  ModuleType = ModuleType;

  ngOnInit(): void {
    this._buildForm();

    if (this._matDialog.data) {
      this.module.set(this._matDialog.data);
      this.moduleForm.patchValue(this._matDialog.data);
      this.isEditMode.set(false);
      this.moduleForm.disable();
      this._calculateDespiece();
    } else {
      this.isEditMode.set(true);
    }

    this._handleModuleTypeChanges();
    this._handleDoorsChanges();
  }

  private _buildForm(): void {
    this.moduleForm = this._fb.group({
      moduleType: ['', Validators.required],
      height: [{ value: '', disabled: true }, Validators.required],
      width: ['', [Validators.required, Validators.min(30)]],
      hasDoors: [{ value: false, disabled: true }],
      doorCount: [{ value: '', disabled: true }],
      shelfCount: [{ value: '', disabled: true }],
    });
  }

  private _handleModuleTypeChanges(): void {
    this.moduleForm.get('moduleType')?.valueChanges.subscribe((moduleType) => {
      if (moduleType === ModuleType.ENCIMERA) {
        this.moduleForm.patchValue({
          height: 70,
          width: Math.max(this.moduleForm.value.width, 45),
        });
        this.moduleForm.get('height')?.disable();
        this.moduleForm
          .get('width')
          ?.setValidators([Validators.required, Validators.min(45)]);
        this.moduleForm.get('shelfCount')?.disable();
        this.moduleForm.get('hasDoors')?.enable();
      } else if (moduleType === ModuleType.ESTANTERIA) {
        const currentShelfCount = this.moduleForm.get('shelfCount')?.value || 2;
        this.moduleForm.patchValue({
          height: 90,
          width: Math.max(this.moduleForm.value.width, 30),
          shelfCount: currentShelfCount,
        });
        this.moduleForm.get('height')?.disable();
        this.moduleForm
          .get('width')
          ?.setValidators([Validators.required, Validators.min(30)]);
        this.moduleForm.get('shelfCount')?.enable();
        this.moduleForm.get('hasDoors')?.disable();
        this.moduleForm.patchValue({ hasDoors: false, doorCount: '' });
      } else {
        this.moduleForm.get('height')?.enable();
        this.moduleForm.get('width')?.setValidators([Validators.required]);
        this.moduleForm.get('shelfCount')?.disable();
      }

      this.moduleForm.get('width')?.updateValueAndValidity();
    });
  }

  private _handleDoorsChanges(): void {
    this.moduleForm.get('hasDoors')?.valueChanges.subscribe((hasDoors) => {
      if (hasDoors) {
        const currentDoorCount = this.moduleForm.get('doorCount')?.value;
        this.moduleForm.patchValue({ doorCount: currentDoorCount || 1 }); // ✅ Mantener el valor si existe
        this.moduleForm.get('doorCount')?.enable();
      } else {
        this.moduleForm.get('doorCount')?.disable();
        this.moduleForm.patchValue({ doorCount: '' });
      }
    });
  }

  private _calculateDespiece(): void {
    const { moduleType, width, hasDoors, doorCount, shelfCount } =
      this.moduleForm.value;
    this.despiece.set(
      this._despieceService.getDespiece(
        moduleType,
        width,
        hasDoors,
        doorCount,
        shelfCount
      )
    );
  }

  getMinWidthMessage(): number {
    const moduleType = this.moduleForm.get('moduleType')?.value;
    return moduleType === ModuleType.ENCIMERA ? 45 : 30;
  }

  toggleEdit(): void {
    this.isEditMode.set(!this.isEditMode());

    if (this.isEditMode()) {
      this.moduleForm.enable();
      if (this.moduleForm.value.moduleType === ModuleType.ENCIMERA) {
        this.moduleForm.get('height')?.disable();
      } else if (this.moduleForm.value.moduleType === ModuleType.ESTANTERIA) {
        this.moduleForm.get('height')?.disable();
        this.moduleForm.get('hasDoors')?.disable();
        this.moduleForm.patchValue({ hasDoors: false, doorCount: '' });
      }
    } else {
      this.moduleForm.disable();
    }
  }

  save(): void {
    if (this.moduleForm.valid) {
      this.module.update((currentModule) => ({
        ...currentModule,
        ...this.moduleForm.getRawValue(),
      }));
      this._dialogRef.close(this.module());
      this.openSnackBar('Modulo actualizado correctamente');
    }
  }

  close(): void {
    this._modalService.closeModal();
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}
