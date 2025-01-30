import React from 'react';
import { cn } from '@/lib/utils';

interface SquareProps {
  isWhite: boolean;
  piece?: { type: string; color: string };
  isSelected?: boolean;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({
  isWhite,
  piece,
  isSelected,
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
        'aspect-square flex items-center justify-center transition-colors duration-200',
        isWhite ? 'bg-surface' : 'bg-primary/10',
        isSelected && 'bg-accent/20',
        'hover:bg-accent/10'
      )}
      onClick={onClick}
    >
      {piece && (
        <span
          className={cn(
            'text-4xl transition-transform duration-300',
            piece.color === 'white' ? 'text-primary' : 'text-primary/80',
            isSelected && 'scale-110'
          )}
        >
          {getPieceSymbol(piece.type)}
        </span>
      )}
    </div>
  );
};

export default Square;