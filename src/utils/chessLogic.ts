import { ChessPiece, Position, PieceType, PieceColor } from '@/types/chess';

export const isValidMove = (
  from: Position,
  to: Position,
  piece: ChessPiece,
  board: Map<string, ChessPiece>
): boolean => {
  // Basic boundary check
  if (to.x < 0 || to.x > 7 || to.y < 0 || to.y > 7) {
    return false;
  }

  // Check if destination has a piece of the same color
  const destPiece = board.get(`${to.x},${to.y}`);
  if (destPiece && destPiece.color === piece.color) {
    return false;
  }

  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(from, to, piece.color, board);
    case 'rook':
      return isValidRookMove(from, to, board);
    case 'knight':
      return isValidKnightMove(absDx, absDy);
    case 'bishop':
      return isValidBishopMove(from, to, board);
    case 'queen':
      return isValidQueenMove(from, to, board);
    case 'king':
      return isValidKingMove(absDx, absDy);
    default:
      return false;
  }
};

const isValidPawnMove = (
  from: Position,
  to: Position,
  color: PieceColor,
  board: Map<string, ChessPiece>
): boolean => {
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Forward movement
  if (dx === 0) {
    if (dy === direction) {
      return !board.has(`${to.x},${to.y}`);
    }
    // First move can be 2 squares
    if (from.y === startRow && dy === 2 * direction) {
      const intermediateY = from.y + direction;
      return !board.has(`${to.x},${to.y}`) && !board.has(`${to.x},${intermediateY}`);
    }
  }

  // Capture movement
  if (Math.abs(dx) === 1 && dy === direction) {
    return board.has(`${to.x},${to.y}`);
  }

  return false;
};

const isValidRookMove = (
  from: Position,
  to: Position,
  board: Map<string, ChessPiece>
): boolean => {
  return (from.x === to.x || from.y === to.y) && !isPathObstructed(from, to, board);
};

const isValidKnightMove = (absDx: number, absDy: number): boolean => {
  return (absDx === 2 && absDy === 1) || (absDx === 1 && absDy === 2);
};

const isValidBishopMove = (
  from: Position,
  to: Position,
  board: Map<string, ChessPiece>
): boolean => {
  const absDx = Math.abs(to.x - from.x);
  const absDy = Math.abs(to.y - from.y);
  return absDx === absDy && !isPathObstructed(from, to, board);
};

const isValidQueenMove = (
  from: Position,
  to: Position,
  board: Map<string, ChessPiece>
): boolean => {
  const absDx = Math.abs(to.x - from.x);
  const absDy = Math.abs(to.y - from.y);
  return ((absDx === absDy) || (from.x === to.x || from.y === to.y)) && !isPathObstructed(from, to, board);
};

const isValidKingMove = (absDx: number, absDy: number): boolean => {
  return absDx <= 1 && absDy <= 1;
};

const isPathObstructed = (
  from: Position,
  to: Position,
  board: Map<string, ChessPiece>
): boolean => {
  const dx = Math.sign(to.x - from.x);
  const dy = Math.sign(to.y - from.y);
  let x = from.x + dx;
  let y = from.y + dy;

  while (x !== to.x || y !== to.y) {
    if (board.has(`${x},${y}`)) {
      return true;
    }
    x += dx;
    y += dy;
  }

  return false;
};

export const getValidMoves = (
  position: Position,
  piece: ChessPiece,
  board: Map<string, ChessPiece>
): Position[] => {
  const validMoves: Position[] = [];

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      if (isValidMove(position, { x, y }, piece, board)) {
        validMoves.push({ x, y });
      }
    }
  }

  return validMoves;
};