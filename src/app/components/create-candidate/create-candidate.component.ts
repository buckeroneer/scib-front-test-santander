import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  excelAcceptTypes,
} from '@shared/utils/constants';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { SnackBarPanelTypes } from '@models/snackbar-types.model';
import { CandidatesService } from '@services/candidates/candidates.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ProgressSpinnerService } from '@services/progress-spinner.service';

@Component({
  selector: 'app-create-candidate',
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './create-candidate.component.html',
  styleUrl: './create-candidate.component.scss',
})
export class CreateCandidateComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly candidatesService = inject(CandidatesService);
  private readonly snackBarService = inject(SnackbarService);
  private readonly spinnerService = inject(ProgressSpinnerService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if(this.loadingExcelUpload()) {
        this.spinnerService.openLoadDialog();
      } else {
        this.spinnerService.closeLoadDialog();
      }
    })
  }

  uploadedFile: File | null;

  candidateForm = this.fb.group({
    name: this.fb.control('', [Validators.required]),
    surname: this.fb.control('', [Validators.required]),
  });

  loadingExcelUpload = signal(false);

  errorMessage = 'This field is mandatory';
  excelAcceptTypes = excelAcceptTypes;

  getFormControl(controlName: string): FormControl {
    return this.candidateForm.get(controlName) as FormControl;
  }

  csvInputChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.loadingExcelUpload.set(false);
      return;
    }

    const file = input.files[0];

    const fileName = file.name.toLowerCase();
    const fileType = file.type;

    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.endsWith(ext),
    );

    const hasValidMimeType = !fileType || ALLOWED_MIME_TYPES.includes(fileType);

    if (!hasValidExtension || !hasValidMimeType) {
      this.snackBarService.displaySnackBar(
        'Invalid file type. Please upload a valid Excel or CSV file.',
        SnackBarPanelTypes.ERROR,
      );

      this.uploadedFile = null;
      this.loadingExcelUpload.set(false);
      return;
    }

    this.uploadedFile = file;

    this.snackBarService.displaySnackBar(
      'File uploaded successfully!',
      SnackBarPanelTypes.SUCCESS,
    );

    this.loadingExcelUpload.set(false);
  }

  checkActiveSubmitButton() {
    return this.candidateForm.invalid || !this.uploadedFile;
  }

  submit() {
    if (this.candidateForm.invalid || !this.uploadedFile) {
      this.candidateForm.markAllAsTouched();
      return;
    }

    const formData: FormData = new FormData();
    formData.append('name', this.candidateForm.value.name!);
    formData.append('surname', this.candidateForm.value.surname!);
    formData.append('file', this.uploadedFile!);

    this.candidatesService
      .create(formData)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(async () =>
          this.snackBarService.displaySnackBar(
            'Error during candidate creation',
            SnackBarPanelTypes.ERROR,
          ),
        ),
      )
      .subscribe((candidate) => {
        if (candidate) {
          this.snackBarService.displaySnackBar(
            `Candidate ${candidate.name} ${candidate.surname} created successfully`,
            SnackBarPanelTypes.SUCCESS,
          );
          this.router.navigate(['/']);
        }
      });
  }
}
