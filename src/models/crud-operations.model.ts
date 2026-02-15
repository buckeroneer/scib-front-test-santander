import { HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { PagedResponse } from "./paged-response.model";

export interface CrudOperations<T, ID> {
    findOne(id?: ID): Observable<T>;
    findAllPaged(params?: HttpParams): Observable<PagedResponse<T>>
    create(o: T, params?: HttpParams): Observable<T>;
}