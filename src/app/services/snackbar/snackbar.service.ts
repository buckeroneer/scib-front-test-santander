import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackBarPanelTypes } from '@models/snackbar-types.model';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private _snackBar = inject(MatSnackBar);

  displaySnackBar(
    message: string,
    snackbarPanelType: SnackBarPanelTypes,
    horizontalPosition: MatSnackBarHorizontalPosition = 'center',
    verticalPosition: MatSnackBarVerticalPosition = 'top',
  ) {
    this._snackBar.open(message, '', {
      horizontalPosition,
      verticalPosition,
      panelClass: snackbarPanelType,
      duration: 5000,
    });
  }
}
