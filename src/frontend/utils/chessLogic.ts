import { Position, ChessPiece, PieceType } from '../types/chess';

export const isValidMove = (
  from: Position,
  to: Position,
  piece: ChessPiece,
  pieces: Map<string, ChessPiece>
): boolean => {
  // For now, allow all moves (you can implement proper chess rules later)
  return true;
};

export const getValidMoves = (
  position: Position,
  piece: ChessPiece,
  pieces: Map<string, ChessPiece>
): Position[] => {
  // For now, return all adjacent squares (you can implement proper chess rules later)
  const validMoves: Position[] = [];
  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [dx, dy] of directions) {
    const newX = position.x + dx;
    const newY = position.y + dy;
    if (newX >= 0 && newX < 8 && newY >= 0 && newY < 8) {
      validMoves.push({ x: newX, y: newY });
    }
  }

  return validMoves;
};