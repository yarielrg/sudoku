import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import {Dialog, DialogModule} from '@angular/cdk/dialog';

import { switchMap, tap } from 'rxjs';

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

@Component({
  selector: 'app-root',
  imports: [OnlyNumbersDirective, NgClass, DialogModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
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

  ngOnInit() {
    this.getBoard();
  }

  getBoard(difficulty = Difficulty.RANDOM): void {
    this.sudokuService.generate(difficulty).pipe(
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
      })).subscribe();
  }

  solve(): void {
    const result = this.dialog.open<{ confirm: boolean }>(SolveDialogComponent, {
      width: '400px',
      disableClose: true,
    });

    result.closed.pipe(
      switchMap((result) => {
        if (result?.confirm) {
          return this.sudokuService.solve(this.board());
        }
        return [];
      }),
      tap((solved: SolveResponse) => {
        if (solved) {
          this.board.set({ board: solved.solution } as BoardBody);
          this.status.set(solved.status);
        }
      })
    ).subscribe();
  }

  updateCell(row: number, col: number, input: { value: string, validation: OnlyNumbersDirective }): void {
    const newBoard = this.board().board;
    newBoard[row][col] = parseInt(input.value, 10) || 0;
    this.board.set({ board: newBoard });
    const valid = isValidSudoku(this.board());
    input.validation.invalid = !valid;
    this.valid.set(valid);
  }

  validate(): void {
    this.sudokuService.validate(this.board()).pipe(tap((response: ValidateResponse) => {
      this.status.set(response.status);
    })).subscribe();
  }
}
