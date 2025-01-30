import React from 'react';
import { cn } from '@/lib/utils';
import { ChessPiece } from '@/types/chess';

interface SquareProps {
  isWhite: boolean;
  piece?: ChessPiece;
  isSelected?: boolean;
  isValidMove?: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({
  isWhite,
  piece,
  isSelected,
  isValidMove,
  onClick,
}) => {
  const getPieceSymbol = (type: string) => {
    const symbols: { [key: string]: string } = {
      pawn: '♟',
      rook: '♜',
      knight: '♞',
      bishop: '♝',
      queen: '♛',
      king: '♚',
    };
    return symbols[type] || '';
  };

  return (
    <div
      className={cn(
        'aspect-square flex items-center justify-center transition-colors duration-200 relative',
        isWhite ? 'bg-[#F1F1F1] shadow-inner' : 'bg-[#0006] shadow-md',
        isSelected && 'bg-accent/20',
        isValidMove && 'bg-green-500/20',
        'hover:bg-accent/10'
      )}
      onClick={onClick}
    >
      {piece && (
        <span
          className={cn(
            'text-4xl transition-transform duration-300',
            piece.color === 'white' ? 'text-[#222222]' : 'text-[#333333]',
            isSelected && 'scale-110'
          )}
        >
          {getPieceSymbol(piece.type)}
        </span>
      )}
      {isValidMove && !piece && (
        <div className="absolute w-3 h-3 rounded-full bg-green-500/40" />
      )}
    </div>
  );
};

export default Square;