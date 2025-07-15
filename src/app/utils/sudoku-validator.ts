import { BoardBody } from "../data/model/board-response";

export const isValidSudoku = (board: BoardBody): boolean => {
    const size = 9;
    const blockSize = 3;

    // Check rows and columns
    for (let i = 0; i < size; i++) {
        const rowSet = new Set<number>();
        const colSet = new Set<number>();

        for (let j = 0; j < size; j++) {
            // Check row
            const rowVal = board.board[i][j];
            if (rowVal !== 0 && rowSet.has(rowVal)){
                return false;
            }
            rowSet.add(rowVal);

            // Check column
            const colVal = board.board[j][i];
            if (colVal !== 0 && colSet.has(colVal)) {
                return false;
            }
            colSet.add(colVal);
        }
    }

    // Check 3x3 blocks
    for (let blockRow = 0; blockRow < blockSize; blockRow++) {
        for (let blockCol = 0; blockCol < blockSize; blockCol++) {
            const blockSet = new Set<number>();

            for (let i = 0; i < blockSize; i++) {
                for (let j = 0; j < blockSize; j++) {
                    const row = blockRow * blockSize + i;
                    const col = blockCol * blockSize + j;
                    const val = board.board[row][col];

                    if (val !== 0 && blockSet.has(val)) {
                        return false;
                    }
                    blockSet.add(val);
                }
            }
        }
    }

    return true;
}