import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'candidate',
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('./components/view-candidate/view-candidate.component').then(
            (m) => m.ViewCandidateComponent,
          ),
      },
      {
        path: '',
        loadComponent: () =>
          import('./components/create-candidate/create-candidate.component').then(
            (m) => m.CreateCandidateComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
