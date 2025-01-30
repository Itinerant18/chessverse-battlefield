import React from 'react';

const GameInfo = () => {
  return (
    <div className="w-full max-w-md p-6 bg-surface rounded-lg shadow-lg animate-fade-in">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-primary/60">White's Turn</span>
          <span className="px-3 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
            In Progress
          </span>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-primary">Move History</h3>
          <div className="h-40 overflow-y-auto space-y-1 p-2 bg-primary/5 rounded">
            <div className="text-sm text-primary/70">1. e4 e5</div>
            <div className="text-sm text-primary/70">2. Nf3 Nc6</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameInfo;