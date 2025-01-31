import React from 'react';
import { cn } from '@/lib/utils';
import { ChessPiece } from '../types/chess';

interface SquareProps {
  isWhite: boolean;
  piece?: ChessPiece;
  isSelected?: boolean;
  isValidMove?: boolean;
  isCapture?: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({
  isWhite,
  piece,
  isSelected,
  isValidMove,
  isCapture,
  onClick,
}) => {
  const getPieceSymbol = (type: string, color: string) => {
    if (color === 'white') {
      const symbols: { [key: string]: string } = {
        king: '♔',
        queen: '♕',
        rook: '♖',
        bishop: '♗',
        knight: '♘',
        pawn: '♙',
      };
      return symbols[type] || '';
    } else {
      const symbols: { [key: string]: string } = {
        king: '♚',
        queen: '♛',
        rook: '♜',
        bishop: '♝',
        knight: '♞',
        pawn: '♟',
      };
      return symbols[type] || '';
    }
  };

  return (
    <div
      className={cn(
        'aspect-square flex items-center justify-center transition-all duration-200 relative',
        isWhite 
          ? 'bg-[#F1F1F1] shadow-inner' 
          : 'bg-[#0006] shadow-md',
        isSelected && 'bg-accent/20 transform scale-[0.98]',
        isValidMove && 'bg-green-500/20',
        isCapture && 'bg-red-500/30',
        'hover:bg-accent/10 hover:transform hover:scale-[0.98]',
        'before:absolute before:inset-0 before:pointer-events-none',
        isWhite 
          ? 'before:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]' 
          : 'before:shadow-[inset_0_-2px_4px_rgba(255,255,255,0.1)]'
      )}
      onClick={onClick}
    >
      {piece && (
        <span
          className={cn(
            'text-4xl transition-all duration-300 animate-fade-in',
            piece.color === 'white' 
              ? 'text-[#222222] drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]' 
              : 'text-[#333333] drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]',
            isSelected && 'scale-110 transform-gpu',
            isCapture && 'text-red-600',
            'hover:scale-105 transform-gpu'
          )}
        >
          {getPieceSymbol(piece.type, piece.color)}
        </span>
      )}
      {isValidMove && !piece && (
        <div className="absolute w-3 h-3 rounded-full bg-green-500/40 animate-pulse" />
      )}
    </div>
  );
};

export default Square;
