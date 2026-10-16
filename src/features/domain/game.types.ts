export type Position = {
  row: number;
  col: number;
};

export type Cell = {
  id: string;
  position: Position;
  regionId: string;
};

export type Region = {
  id: string;
  color: string;
};

export type Puzzle = {
  id: string;
  size: number;
  cells: Cell[];
  regions: Region[];
  solution: Position[];
};

export type GameStatus = "playing" | "won" | "lost";

export type GameState = {
  puzzle: Puzzle;
  foundChimos: string[];
  selectedEmptyCells: string[];
  lives: number;
  status: GameStatus;
};
