import React from 'react';

const GameInfo = () => {
  return (
    <div className="w-full max-w-md p-6 bg-surface rounded-lg shadow-lg animate-fade-in backdrop-blur-sm bg-white/30">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-primary/80">Current Turn</span>
          <span className="px-4 py-2 text-sm font-medium bg-accent text-accent-foreground rounded-full animate-pulse">
            White's Turn
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;