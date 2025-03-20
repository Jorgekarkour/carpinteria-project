import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

const MATERIAL_MODULES = [MatDialogModule, MatButton];

@Component({
  selector: 'app-confirmation-dialog',
  imports: [MATERIAL_MODULES],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  private readonly _dialogRef = inject(
    MatDialogRef<ConfirmationDialogComponent>
  );
  readonly data = inject(MAT_DIALOG_DATA);

  onCancel(): void {
    this._dialogRef.close(false);
  }

  onConfirm(): void {
    this._dialogRef.close(true);
  }
}
