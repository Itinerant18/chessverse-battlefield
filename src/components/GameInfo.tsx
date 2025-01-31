import React from 'react';

const GameInfo = ({ currentTurn }: { currentTurn: 'white' | 'black' }) => {
  return (
    <div className="w-full max-w-md p-6 bg-white/10 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-primary/80">Current Turn</span>
          <span className={cn(
            "px-4 py-2 text-sm font-medium rounded-full animate-pulse",
            currentTurn === 'white' ? 'bg-white text-black' : 'bg-black text-white'
          )}>
            {currentTurn === 'white' ? "White's Turn" : "Black's Turn"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;