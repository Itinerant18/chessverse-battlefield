import React, { useState } from 'react';
import Square from './Square';
import { cn } from '@/lib/utils';
import { ChessPiece, Position } from '@/types/chess';
import { isValidMove, getValidMoves } from '@/utils/chessLogic';
import { useToast } from '@/components/ui/use-toast';

const Chessboard = () => {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null);
  const [pieces, setPieces] = useState(initializeBoard());
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white');
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const { toast } = useToast();

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
    const clickedPiece = pieces.get(`${x},${y}`);
    
    // If no square is selected and we clicked on a piece of the current turn's color
    if (!selectedSquare) {
      if (clickedPiece && clickedPiece.color === currentTurn) {
        setSelectedSquare({ x, y });
        setValidMoves(getValidMoves({ x, y }, clickedPiece, pieces));
      }
    } else {
      const selectedPiece = pieces.get(`${selectedSquare.x},${selectedSquare.y}`);
      
      // If clicking on a different square
      if (selectedSquare.x !== x || selectedSquare.y !== y) {
        if (selectedPiece && isValidMove(selectedSquare, { x, y }, selectedPiece, pieces)) {
          // Make the move
          const newPieces = new Map(pieces);
          newPieces.delete(`${selectedSquare.x},${selectedSquare.y}`);
          newPieces.set(`${x},${y}`, selectedPiece);
          
          setPieces(newPieces);
          setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
          
          // Show move notification
          toast({
            title: `${selectedPiece.color.charAt(0).toUpperCase() + selectedPiece.color.slice(1)} moved ${selectedPiece.type}`,
            duration: 2000,
          });
        }
      }
      
      // Reset selection
      setSelectedSquare(null);
      setValidMoves([]);
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
            const isValidMove = validMoves.some(move => move.x === x && move.y === y);

            return (
              <Square
                key={`${x},${y}`}
                isWhite={isWhite}
                piece={piece}
                isSelected={isSelected}
                isValidMove={isValidMove}
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