import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { HttpParams } from '@angular/common/http';
import { Candidate } from '@candidate/models/candidate.model';
import { CandidatesService } from '@services/candidates/candidates.service';
import {
  BehaviorSubject,
  catchError,
  finalize,
  Observable,
  throwError,
} from 'rxjs';

export class CandidateDataSource implements DataSource<Candidate> {
  private candidatesSubject = new BehaviorSubject<Candidate[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private candidatesLength = new BehaviorSubject<number>(0);

  constructor(private readonly candidatesService: CandidatesService) {}

  loading$ = this.loadingSubject.asObservable();
  candidatesLength$ = this.candidatesLength.asObservable();

  connect(collectionViewer: CollectionViewer): Observable<Candidate[]> {
    return this.candidatesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.candidatesSubject.complete();
    this.loadingSubject.complete();
  }

  loadCandidates(pageIndex: number = 1, pageSize: number = 5) {
    this.loadingSubject.next(true);

    const params = new HttpParams()
      .set('page', pageIndex)
      .set('limit', pageSize);

    this.candidatesService
      .findAllPaged(params)
      .pipe(
        catchError((error) => throwError(() => error)),
        finalize(() => this.loadingSubject.next(false)),
      )
      .subscribe((pagedResponse) => {
        this.candidatesSubject.next(pagedResponse.data);
        this.candidatesLength.next(pagedResponse.total);
      });
  }
}
