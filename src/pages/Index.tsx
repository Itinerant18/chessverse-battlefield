import React from 'react';
import Chessboard from '@/components/Chessboard';
import GameInfo from '@/components/GameInfo';

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-primary mb-2">Chess</h1>
          <p className="text-primary/60">Local Multiplayer</p>
        </header>

        <div className="grid lg:grid-cols-[1fr,auto] gap-8 items-start">
          <div className="flex justify-center">
            <Chessboard />
          </div>
          <div className="lg:w-80">
            <GameInfo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;