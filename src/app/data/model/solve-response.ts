import { Board } from "./board";
import { Status } from "../enum/status";
import { Difficulty } from "../enum/difficulty";

export type SolveResponse = {
    difficulty: Difficulty;
    solution: Board;
    status: Status;
}
