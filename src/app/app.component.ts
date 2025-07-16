import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Dialog, DialogModule } from '@angular/cdk/dialog';

import { switchMap, tap, Subscription, finalize } from 'rxjs';

import { SudokuService } from './data/services/sudoku.service';
import { Difficulty } from './data/enum/difficulty';
import { BoardBody } from './data/model/board-response';
import { SolveResponse } from './data/model/solve-response';
import { OnlyNumbersDirective } from './directives/only-numbers.directive';
import { Status } from './data/enum/status';
import { ValidateResponse } from './data/model/validate-response';
import { GradeResponse } from './data/model/grade-response';
import { isValidSudoku } from './utils/sudoku-validator';
import { SolveDialogComponent } from './components/solve-dialog/solve-dialog.component';
import { LoadingService } from './components/loading/loading.service';

@Component({
  selector: 'app-root',
  imports: [OnlyNumbersDirective, NgClass, DialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy, OnInit {
  board = signal<BoardBody>({
    board: Array(9).fill(Array(9).fill(0))
  });
  status = signal<string>(`${Status.UNSOLVED}`);
  grade = signal<Difficulty | ''>('');
  valid = signal<boolean>(true);

  difficulty = Difficulty
  originalBoard: BoardBody | null = null;

  private readonly sudokuService = inject(SudokuService);
  private readonly dialog = inject(Dialog);
  private readonly loadingService = inject(LoadingService);
  private readonly subscription = new Subscription();

  ngOnInit() {
    this.getBoard();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getBoard(difficulty = Difficulty.RANDOM): void {
    this.loadingService.show();
    const sub = this.sudokuService.generate(difficulty).pipe(
      tap((board: BoardBody) => {
        this.board.set(board);
        this.originalBoard = board;
        this.status.set(`${Status.UNSOLVED}`);
      }),
      switchMap((board: BoardBody) => {
        return this.sudokuService.grade(board);
      }),
      tap((grade: GradeResponse) => {
        this.grade.set(grade.difficulty);
        this.loadingService.hide();
      }),
      finalize(() => this.loadingService.hide())
    ).subscribe();
    this.subscription.add(sub);
  }

  solve(): void {
    const result = this.dialog.open<{ confirm: boolean }>(SolveDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        mainText: 'Are you sure you want to solve the Sudoku puzzle? This action will overwrite your current board.',
        subText: 'Note: The current board will be replaced with the solution'
      }
    });

    const sub = result.closed.pipe(
      switchMap((result) => {
        if (result?.confirm) {
          this.loadingService.show();
          return this.sudokuService.solve(this.board());
        }
        return [];
      }),
      tap((solved: SolveResponse) => {
        if (solved) {
          this.board.set({ board: solved.solution } as BoardBody);
          this.status.set(solved.status);
        }
      }),
      finalize(() => this.loadingService.hide())
    ).subscribe();
    this.subscription.add(sub);
  }

  updateCell(row: number, col: number, input: { value: string, validation: OnlyNumbersDirective }): void {
    const newBoard = this.board().board.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? parseInt(input.value, 10) || 0 : c)) : r
    );
    this.board.set({ board: newBoard });
    const valid = isValidSudoku(this.board());
    input.validation.invalid = !valid;
    this.valid.set(valid);
  }

  validate(): void {
    this.loadingService.show();
    const sub = this.sudokuService.validate(this.board()).pipe(
      tap((response: ValidateResponse) => {
        this.status.set(response.status);
      }),
      finalize(() => this.loadingService.hide())
    ).subscribe();
    this.subscription.add(sub);
  }

  reset(): void {
    if (this.originalBoard) {
      const result = this.dialog.open<{ confirm: boolean }>(SolveDialogComponent, {
        width: '400px',
        disableClose: true,
        data: {
          mainText: 'Are you sure you want reset Sudoku puzzle? This action will overwrite your current board.',
          subText: 'Note: The current board will be replaced with the initial one'
        }
      });

      const sub = result.closed.pipe(
        tap((result) => {
          if (result?.confirm) {
            this.board.set(this.originalBoard as BoardBody);
            this.status.set(`${Status.UNSOLVED}`);
            this.valid.set(true);
          }
        }),
      ).subscribe();
      this.subscription.add(sub);
    }
  }
}
