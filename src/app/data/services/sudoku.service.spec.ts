import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { SUDOKU_API_URL } from '../../constants/sudoku-api';
import { SudokuService } from './sudoku.service';
import { Difficulty } from '../enum/difficulty';
import { Status } from '../enum/status';
import { ValidateStatus } from '../enum/validate';

describe('SudokuService', () => {
  let service: SudokuService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SudokuService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SudokuService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a board', (done) => {
    service.generate(Difficulty.EASY).subscribe(board => {
      expect(board).toEqual({ board: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] });
      done();
    });

    const req = httpTestingController.expectOne(`${SUDOKU_API_URL}/board?difficulty=easy`);
    expect(req.request.method).toBe('GET');
    req.flush({ board: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] });
  });

  it('should grade a board', (done) => {
    const fakeBoard = { board: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] };
    service.grade(fakeBoard).subscribe(grade => {
      expect(grade).toEqual({ difficulty: Difficulty.EASY });
      done();
    });

    const req = httpTestingController.expectOne(`${SUDOKU_API_URL}/grade`);
    expect(req.request.method).toBe('POST');
    req.flush({ difficulty: Difficulty.EASY });
  });

  it('should solve a board', (done) => {
    const fakeBoard = { board: [[1, 2, 0], [4, 5, 0], [7, 8, 0]] };
    service.solve(fakeBoard).subscribe(solution => {
      expect(solution).toEqual({
        solution: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
        status: Status.SOLVED,
        difficulty: Difficulty.EASY
      });
      done();
    });

    const req = httpTestingController.expectOne(`${SUDOKU_API_URL}/solve`);
    req.flush({
      solution: [[1, 2, 3], [4, 5, 6], [7, 8, 9]],
      status: 'solved',
      difficulty: 'easy'
    });
    expect(req.request.method).toBe('POST');
  });


  it('should validate a board', (done) => {
    const fakeBoard = { board: [[1, 2, 0], [4, 5, 0], [7, 8, 0]] };
    service.validate(fakeBoard).subscribe(validation => {
      expect(validation).toEqual({ status: ValidateStatus.BROKEN });
      done();
    });

    const req = httpTestingController.expectOne(`${SUDOKU_API_URL}/validate`);
    expect(req.request.method).toBe('POST');
    req.flush({ status: ValidateStatus.BROKEN });
  });
});
