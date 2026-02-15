import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@environments/environment';
import { CrudOperations } from '@models/crud-operations.model';
import { PagedResponse } from '@models/paged-response.model';
import { catchError, throwError } from 'rxjs';

export class CrudBase<T, ID> implements CrudOperations<T, ID> {
  protected baseUrl: string;

  private readonly _http = inject(HttpClient);

  constructor(protected _endPoint: string) {
    this.baseUrl = `${environment.baseUrl.scheme}://${environment.baseUrl.ip}/${this._endPoint}`;
  }

  findOne(id: ID, params?: HttpParams) {
    const sourceUrl = id ? `${this.baseUrl}/${id}` : this.baseUrl;
    return this._http
      .get<T>(sourceUrl, { params })
      .pipe(catchError((error) => throwError(() => error)));
  }

  findAllPaged(params?: HttpParams) {
    return this._http
      .get<PagedResponse<T>>(this.baseUrl, { params })
      .pipe(catchError((error) => throwError(() => error)));
  }

  create(o: T, params?: HttpParams) {
    return this._http
      .post<T>(this.baseUrl, o, { params })
      .pipe(catchError((error) => throwError(() => error)));
  }
}
