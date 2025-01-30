import React, { useState } from 'react';
import Square from './Square';
import { cn } from '@/lib/utils';

interface Position {
  x: number;
  y: number;
}

const Chessboard = () => {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [pieces, setPieces] = useState(initializeBoard());

  function initializeBoard() {
    const initialPieces = new Map();
    // Set up pawns
    for (let i = 0; i < 8; i++) {
      initialPieces.set(`${i},1`, { type: 'pawn', color: 'black' });
      initialPieces.set(`${i},6`, { type: 'pawn', color: 'white' });
    }
    
    // Set up other pieces
    const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      initialPieces.set(`${i},0`, { type: backRow[i], color: 'black' });
      initialPieces.set(`${i},7`, { type: backRow[i], color: 'white' });
    }
    
    return initialPieces;
  }

  const handleSquareClick = (x: number, y: number) => {
    if (!selectedSquare) {
      if (pieces.has(`${x},${y}`)) {
        setSelectedSquare({ x, y });
      }
    } else {
      // Handle piece movement here
      if (selectedSquare.x !== x || selectedSquare.y !== y) {
        const newPieces = new Map(pieces);
        const piece = newPieces.get(`${selectedSquare.x},${selectedSquare.y}`);
        if (piece) {
          newPieces.delete(`${selectedSquare.x},${selectedSquare.y}`);
          newPieces.set(`${x},${y}`, piece);
          setPieces(newPieces);
        }
      }
      setSelectedSquare(null);
    }
  };

  return (
    <div className="w-full max-w-2xl aspect-square p-4">
      <div className="grid grid-cols-8 gap-0 w-full h-full border border-primary/20 rounded-lg overflow-hidden shadow-xl">
        {Array.from({ length: 8 }, (_, y) =>
          Array.from({ length: 8 }, (_, x) => {
            const isWhite = (x + y) % 2 === 0;
            const piece = pieces.get(`${x},${y}`);
            const isSelected = selectedSquare?.x === x && selectedSquare?.y === y;

            return (
              <Square
                key={`${x},${y}`}
                isWhite={isWhite}
                piece={piece}
                isSelected={isSelected}
                onClick={() => handleSquareClick(x, y)}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Chessboard;