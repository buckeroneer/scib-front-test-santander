import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Router } from '@angular/router';
import { Candidate } from '@models/candidate.model';
import { CandidatesService } from '@services/candidates/candidates.service';
import { CandidateDataSource } from './data-definitions/candidate-data-source';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerService } from '@services/progress-spinner.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  headerRowsDef = ['name', 'seniority', 'years', 'availability'];
  pageSizeOptions = [5, 10, 20, 50, 100];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: CandidateDataSource;

  private readonly router = inject(Router);
  private readonly candidatesService = inject(CandidatesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly spinnerService = inject(ProgressSpinnerService);

  constructor() {
    this.dataSource = new CandidateDataSource(this.candidatesService);
    this.dataSource.loadCandidates();
    this.dataSource.loading$.pipe(takeUntilDestroyed()).subscribe((loading) => {
      if (loading) {
        this.spinnerService.openLoadDialog();
      } else {
        this.spinnerService.closeLoadDialog();
      }
    });
  }
  navigateToCreateCandidate() {
    this.router.navigate(['/candidate']);
  }

  viewCandidateDetails(candidate: Candidate) {
    this.router.navigate([`/candidate/${candidate.id}`]);
  }

  ngAfterViewInit() {
    this.paginator.page
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadCandidatesPage());
  }

  loadCandidatesPage() {
    this.dataSource.loadCandidates(
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
    );
  }
}
