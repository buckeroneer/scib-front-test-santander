import { Injectable } from '@angular/core';
import { CrudBase } from '@shared/classes/crud-base';
import { Candidate } from '../../../models/candidate.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatesService extends CrudBase<Candidate, number> {
  private static ENDPOINT = 'candidates';
  constructor() { 
    super(CandidatesService.ENDPOINT)
  }
}
