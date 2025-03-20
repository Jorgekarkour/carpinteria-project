import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent } from '../components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly _dialog = inject(MatDialog);

  openModal<CT, T>(
    componentRef: ComponentType<CT>,
    data?: T,
    message?: string,
    isEditing = false
  ): Observable<T | undefined> {
    const config = { data, isEditing, message };
    const dialogRef: MatDialogRef<CT, T | undefined> = this._dialog.open(
      componentRef,
      {
        data: config,
        width: '800px',
      }
    );
    return dialogRef.afterClosed();
  }

  openConfirmDialog(message: string): Observable<boolean> {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: { message },
      width: '800px',
      height: '250px',
    });
    return dialogRef.afterClosed();
  }

  closeModal(): void {
    this._dialog.closeAll();
  }
}
