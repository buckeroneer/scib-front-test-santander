import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCandidateComponent } from './create-candidate.component';
import { CandidatesService } from '@services/candidates/candidates.service';
import { SnackbarService } from '@services/snackbar/snackbar.service';
import { Router } from '@angular/router';
import { Candidate } from '@models/candidate.model';
import { of, subscribeOn, throwError } from 'rxjs';

describe('CreateCandidateComponent', () => {
  let mockCandidatesService: {
    create: jest.Mock;
  };
  let mockSnackbarService: {
    displaySnackBar: jest.Mock;
  };
  let mockRouter: {
    navigate: jest.Mock;
  };
  let candidate: Candidate = {
    id: 1,
    name: 'John',
    surname: 'Doe',
    seniority: 'senior',
    years: 10,
    availability: false,
  };

  let component: CreateCandidateComponent;
  let fixture: ComponentFixture<CreateCandidateComponent>;

  beforeEach(async () => {
    mockCandidatesService = {
      create: jest.fn(),
    };
    mockSnackbarService = {
      displaySnackBar: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };

    mockCandidatesService.create.mockReturnValue(of(candidate));

    await TestBed.configureTestingModule({
      imports: [CreateCandidateComponent],
      providers: [
        { provide: CandidatesService, useValue: mockCandidatesService },
        { provide: SnackbarService, useValue: mockSnackbarService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should have invalid form initially', () => {
    expect(component.candidateForm.valid).toBe(false);
    expect(component.uploadedFile).toBeUndefined();
  });

  it('should reject invalid file type', () => {
    const invalidFile = new File(['dummy'], 'test.txt', {
      type: 'text/plain',
    });

    const event = {
      target: {
        files: [invalidFile],
      },
    } as any;

    component.csvInputChange(event);

    expect(component.uploadedFile).toBeNull();
    expect(mockSnackbarService.displaySnackBar).toHaveBeenCalledWith(
      expect.stringContaining('Invalid'),
      expect.anything(),
    );
  });

  it('should call service and navigate on successful submit', () => {
    const validFile = new File(['dummy'], 'candidate.csv', {
      type: 'text/csv',
    });

    const event = {
      target: {
        files: [validFile],
      },
    } as any;

    component.csvInputChange(event);
    component.candidateForm.patchValue({
      name: candidate.name,
      surname: candidate.surname,
    });

    expect(component.uploadedFile).toStrictEqual(validFile);
    expect(component.candidateForm.value).toStrictEqual({
      name: candidate.name,
      surname: candidate.surname,
    });

    component.submit();
    expect(mockCandidatesService.create).toHaveBeenCalled();
    expect(mockSnackbarService.displaySnackBar).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should call snackbar service when backend fails', () => {
    const validFile = new File(['dummy'], 'candidate.csv', {
      type: 'text/csv',
    });

    const event = {
      target: {
        files: [validFile],
      },
    } as any;

    mockCandidatesService.create.mockReturnValue(
      throwError(() => new Error('Error during creation')),
    );

    component.csvInputChange(event);
    component.candidateForm.patchValue({
      name: candidate.name,
      surname: candidate.surname,
    });

    expect(component.uploadedFile).toStrictEqual(validFile);
    expect(component.candidateForm.value).toStrictEqual({
      name: candidate.name,
      surname: candidate.surname,
    });

    component.submit();
    expect(mockCandidatesService.create).toHaveBeenCalled();
    expect(mockSnackbarService.displaySnackBar).toHaveBeenCalledWith(
      expect.stringContaining('Error'),
      expect.anything(),
    );
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
