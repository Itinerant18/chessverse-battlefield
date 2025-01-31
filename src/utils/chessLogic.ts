import { ChessPiece, Position, PieceType, PieceColor } from '@/types/chess';

export const isValidMove = (
  from: Position,
  to: Position,
  piece: ChessPiece,
  board: Map<string, ChessPiece>
): boolean => {
  const dx = Math.abs(to.x - from.x);
  const dy = Math.abs(to.y - from.y);
  
  // Basic boundary check
  if (to.x < 0 || to.x > 7 || to.y < 0 || to.y > 7) {
    return false;
  }

  // Check if destination has a piece of the same color
  const destPiece = board.get(`${to.x},${to.y}`);
  if (destPiece && destPiece.color === piece.color) {
    return false;
  }

  // Check path obstruction for all pieces except knights
  if (piece.type !== 'knight' && isPathObstructed(from, to, board)) {
    return false;
  }

  switch (piece.type) {
    case 'pawn':
      return isValidPawnMove(from, to, piece.color, board);
    case 'rook':
      return isValidRookMove(from, to);
    case 'knight':
      return dx * dy === 2; // L-shape movement
    case 'bishop':
      return dx === dy; // Diagonal movement
    case 'queen':
      return dx === dy || dx === 0 || dy === 0;
    case 'king':
      return dx <= 1 && dy <= 1;
    default:
      return false;
  }
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

const isValidPawnMove = (
  from: Position,
  to: Position,
  color: PieceColor,
  board: Map<string, ChessPiece>
): boolean => {
  const direction = color === 'white' ? -1 : 1;
  const startRow = color === 'white' ? 6 : 1;
  
  // Forward movement
  if (to.x === from.x) {
    if (to.y === from.y + direction) {
      return !board.has(`${to.x},${to.y}`);
    }
    // First move can be 2 squares
    if (from.y === startRow && to.y === from.y + 2 * direction) {
      return !board.has(`${to.x},${to.y}`) && !board.has(`${to.x},${from.y + direction}`);
    }
  }
  
  // Capture movement
  if (Math.abs(to.x - from.x) === 1 && to.y === from.y + direction) {
    return board.has(`${to.x},${to.y}`);
  }
  
  return false;
};

const isValidRookMove = (from: Position, to: Position): boolean => {
  return from.x === to.x || from.y === to.y;
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