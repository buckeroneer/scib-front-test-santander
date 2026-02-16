import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ProgressSpinnerComponent } from '@shared/components/progress-spinner/progress-spinner';

@Injectable({
  providedIn: 'root',
})
export class ProgressSpinnerService {
  private readonly matDialog = inject(MatDialog);
  dialogRef: MatDialogRef<ProgressSpinnerComponent>;

  openLoadDialog() {
    this.dialogRef = this.matDialog.open(ProgressSpinnerComponent, {
      panelClass: 'transparent',
      disableClose: true,
    });
  }

  closeLoadDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
