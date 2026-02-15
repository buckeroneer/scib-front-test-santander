import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CandidatesService } from '@services/candidates.service';
import { map, switchMap } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-view-candidate',
  imports: [CommonModule, MatCardModule],
  templateUrl: './view-candidate.component.html',
  styleUrl: './view-candidate.component.scss',
})
export class ViewCandidateComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly candidatesService = inject(CandidatesService);

  id$ = this.route.paramMap.pipe(
    map((params: ParamMap) => {
      return params.get('id') as string;
    }),
  );

  candidateData$;

  constructor() {
    this.candidateData$ = this.id$.pipe(
      switchMap((id) => this.candidatesService.findOne(Number(id))),
    );

    this.candidateData$
      .pipe(takeUntilDestroyed())
      .subscribe((x) => console.log(x));
  }
}
