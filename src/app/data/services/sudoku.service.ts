import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { SUDOKU_API_URL } from '../../constants/sudoku-api';
import { Difficulty } from '../enum/difficulty';
import { BoardBody } from '../model/board-response';
import { ValidateResponse } from '../model/validate-response';
import { SolveResponse } from '../model/solve-response';
import { GradeResponse } from '../model/grade-response';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {

  private readonly http = inject(HttpClient);

  generate(difficulty: Difficulty): Observable<BoardBody> {
    const params = {
      difficulty: `${difficulty}`,
    };
    return this.http.get<BoardBody>(`${SUDOKU_API_URL}/board`, { params });
  }

  grade(board: BoardBody): Observable<GradeResponse> {
    const formData = new FormData();
    formData.append('board', JSON.stringify(board.board));
    return this.http.post<GradeResponse>(`${SUDOKU_API_URL}/grade`, formData);
  }

  validate(board: BoardBody): Observable<ValidateResponse> {
    const formData = new FormData();
    formData.append('board', JSON.stringify(board.board));
    return this.http.post<ValidateResponse>(`${SUDOKU_API_URL}/validate`, formData);
  }

  solve(board: BoardBody): Observable<SolveResponse> {
    const formData = new FormData();
    formData.append('board', JSON.stringify(board.board));
    return this.http.post<SolveResponse>(`${SUDOKU_API_URL}/solve`, formData);
  }
}
