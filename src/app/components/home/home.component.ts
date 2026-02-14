import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Candidate } from '@models/candidate.model';

@Component({
  selector: 'app-home',
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  headerRowsDef = ['name', 'seniority', 'years', 'availability'];
  pageSizeOptions = [5, 10, 20, 50, 100];

  private readonly router = inject(Router);

  CANDIDATE_DUMMY: Candidate[] = [
    {
      id: 1,
      name: 'Michael',
      surname: 'Sánchez',
      seniority: 'senior',
      years: 4,
      availability: true,
    },
    {
      id: 2,
      name: 'John',
      surname: 'Doe',
      seniority: 'senior',
      years: 4,
      availability: true,
    },
    {
      id: 3,
      name: 'John',
      surname: 'Doe',
      seniority: 'junior',
      years: 1,
      availability: false,
    },
  ];

  navigateToCreateCandidate() {
    this.router.navigate(['/candidate']);
  }

  viewCandidateDetails(candidate: Candidate) {
    this.router.navigate([
      '/candidate',
      {
        id: candidate.id,
      },
    ]);
  }
}
