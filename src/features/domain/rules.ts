import type { Position } from "./game.types";

export function areAdjacent(first: Position, second: Position): boolean {
  const rowDistance = Math.abs(first.row - second.row);
  const colDistance = Math.abs(first.col - second.col);

  return (
    rowDistance <= 1 && colDistance <= 1 && (rowDistance > 0 || colDistance > 0)
  );
}
