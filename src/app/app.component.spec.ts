import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Dialog } from '@angular/cdk/dialog';

import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { SudokuService } from './data/services/sudoku.service';
import { Difficulty } from './data/enum/difficulty';
import { Status } from './data/enum/status';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { ValidateStatus } from './data/enum/validate';

describe('AppComponent', () => {
  let sudokuServiceSpy: jasmine.SpyObj<SudokuService>;
  let dialogSpy: jasmine.SpyObj<Dialog>;

  beforeEach(async () => {
    sudokuServiceSpy = jasmine.createSpyObj('SudokuService', ['generate', 'grade', 'solve', 'validate']);
    dialogSpy = jasmine.createSpyObj('Dialog', ['open']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: SudokuService, useValue: sudokuServiceSpy },
        { provide: Dialog, useValue: dialogSpy }
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should call getBoard on ngOnInit', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    spyOn(app, 'getBoard');
    app.ngOnInit();
    expect(app.getBoard).toHaveBeenCalled();
  });

  it('should get a new board and set grade', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const board = { board: Array(9).fill(Array(9).fill(0)) };
    const grade = { difficulty: Difficulty.EASY };
    sudokuServiceSpy.generate.and.returnValue(of(board));
    sudokuServiceSpy.grade.and.returnValue(of(grade));

    app.getBoard(Difficulty.EASY);
    tick();

    expect(sudokuServiceSpy.generate).toHaveBeenCalledWith(Difficulty.EASY);
    expect(sudokuServiceSpy.grade).toHaveBeenCalledWith(board);
    expect(app.board()).toEqual(board);
    expect(app.grade()).toBe(Difficulty.EASY);
    expect(app.status()).toBe(Status.UNSOLVED);
  }));

  it('should update cell and set valid state', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const board = { board: Array(9).fill(null).map(() => Array(9).fill(0)) };
    app.board.set(board);

    const validation = { invalid: false } as OnlyNumbersDirective;
    app.updateCell(0, 0, { value: '5', validation });

    expect(app.board().board[0][0]).toBe(5);
    expect(validation.invalid).toBe(false);
    expect(app.valid()).toBe(true);
  });

  it('should validate board and update status', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    const response = { status: ValidateStatus.SOLVED };
    sudokuServiceSpy.validate.and.returnValue(of(response));

    app.validate();
    tick();

    expect(sudokuServiceSpy.validate).toHaveBeenCalled();
    expect(app.status()).toBe(Status.SOLVED);
  }));
});
