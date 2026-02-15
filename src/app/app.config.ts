import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CandidatesService } from '@services/candidates/candidates.service';
import { provideHttpClient } from '@angular/common/http';
import { SnackbarService } from '@services/snackbar/snackbar.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    CandidatesService,
    SnackbarService
  ],
};
