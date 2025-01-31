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
    const initialPieces = new Map<string, ChessPiece>();
    
    // Set up pawns
    for (let i = 0; i < 8; i++) {
      initialPieces.set(`${i},1`, { type: 'pawn', color: 'black' });
      initialPieces.set(`${i},6`, { type: 'pawn', color: 'white' });
    }
    
    // Set up other pieces
    const backRow: PieceType[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
    for (let i = 0; i < 8; i++) {
      initialPieces.set(`${i},0`, { type: backRow[i], color: 'black' });
      initialPieces.set(`${i},7`, { type: backRow[i], color: 'white' });
    }
    
    return initialPieces;
  }

  const handleSquareClick = (x: number, y: number) => {
    const clickedPiece = pieces.get(`${x},${y}`);
    
    if (!selectedSquare) {
      // Selecting a piece
      if (clickedPiece && clickedPiece.color === currentTurn) {
        setSelectedSquare({ x, y });
        const moves = getValidMoves({ x, y }, clickedPiece, pieces);
        setValidMoves(moves);
        
        new Audio('/sounds/select.mp3').play().catch(() => {});
      }
    } else {
      const selectedPiece = pieces.get(`${selectedSquare.x},${selectedSquare.y}`);
      
      if (selectedPiece) {
        // Moving a piece
        if (isValidMove(selectedSquare, { x, y }, selectedPiece, pieces)) {
          const newPieces = new Map(pieces);
          newPieces.delete(`${selectedSquare.x},${selectedSquare.y}`);
          newPieces.set(`${x},${y}`, selectedPiece);
          
          setPieces(newPieces);
          setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
          
          new Audio('/sounds/move.mp3').play().catch(() => {});
          
          toast({
            title: `${selectedPiece.color.charAt(0).toUpperCase() + selectedPiece.color.slice(1)} moved ${selectedPiece.type}`,
            duration: 2000,
          });
        }
      }
      
      setSelectedSquare(null);
      setValidMoves([]);
    }
  };

  return (
    <div className="w-full max-w-2xl aspect-square p-4">
      <div className="grid grid-cols-8 gap-0 w-full h-full border-4 border-primary/20 rounded-lg overflow-hidden shadow-2xl transform perspective-[1000px] rotate-x-1 hover:rotate-x-2 transition-transform duration-500 bg-gradient-to-br from-surface to-surface/80">
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