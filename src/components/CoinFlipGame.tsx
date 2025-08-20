import { useState, useCallback } from "react";
import { Coin } from "./Coin";
import { BettingPanel } from "./BettingPanel";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export const CoinFlipGame = () => {
  const [balance, setBalance] = useState(1000);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [minBet] = useState(0.6);
  const [maxBet] = useState(100);
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Hardcore'>('Easy');
  const [prediction, setPrediction] = useState<'heads' | 'tails'>('heads');
  const [gameHistory, setGameHistory] = useState<Array<{
    bet: number;
    result: 'heads' | 'tails';
    prediction: 'heads' | 'tails';
    won: boolean;
    payout: number;
  }>>([]);

  const { toast } = useToast();

  const getMultiplier = useCallback(() => {
    switch (difficulty) {
      case 'Easy': return 1.8;
      case 'Medium': return 2.5;
      case 'Hard': return 3.2;
      case 'Hardcore': return 4.5;
      default: return 1.8;
    }
  }, [difficulty]);

  const getWinChance = useCallback(() => {
    switch (difficulty) {
      case 'Easy': return 0.9; // 90% win rate
      case 'Medium': return 0.75; // 75% win rate
      case 'Hard': return 0.55; // 55% win rate
      case 'Hardcore': return 0.3; // 30% win rate
      default: return 0.9;
    }
  }, [difficulty]);

  const flipCoin = useCallback(async () => {
    if (selectedAmount > balance || selectedAmount <= 0) {
      toast({
        title: "Invalid Bet",
        description: "Please check your bet amount and balance.",
        variant: "destructive"
      });
      return;
    }

    setIsFlipping(true);
    setResult(null);
    
    // Deduct bet amount immediately
    setBalance(prev => prev - selectedAmount);

    // Simulate coin flip delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine result based on difficulty
    const random = Math.random();
    const winChance = getWinChance();
    const willWin = random < winChance;
    
    // If player should win, match their prediction, otherwise don't
    const coinResult: 'heads' | 'tails' = willWin ? prediction : (prediction === 'heads' ? 'tails' : 'heads');
    
    setResult(coinResult);
    setIsFlipping(false);

    const won = coinResult === prediction;
    const multiplier = getMultiplier();
    const payout = won ? selectedAmount * multiplier : 0;

    if (won) {
      setBalance(prev => prev + payout);
      toast({
        title: "🎉 You Won!",
        description: `You won ₹${payout.toFixed(2)}! The coin landed on ${coinResult}.`,
        variant: "default"
      });
    } else {
      toast({
        title: "😔 You Lost",
        description: `The coin landed on ${coinResult}. Better luck next time!`,
        variant: "destructive"
      });
    }

    // Add to game history
    setGameHistory(prev => [...prev.slice(-9), {
      bet: selectedAmount,
      result: coinResult,
      prediction,
      won,
      payout
    }]);

  }, [selectedAmount, balance, prediction, difficulty, getWinChance, getMultiplier, toast]);

  return (
    <div className="min-h-screen bg-game-bg text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-game-accent to-game-success bg-clip-text text-transparent">
            Coin Flip Casino
          </h1>
          <p className="text-xl text-muted-foreground">
            Test your luck with our high-graphics coin flipping game!
          </p>
        </div>

        {/* Game Area */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Coin Display */}
          <div className="flex-1 flex flex-col items-center">
            <div className="mb-8">
              <Coin 
                isFlipping={isFlipping} 
                result={result || undefined}
                className="transform scale-125"
              />
            </div>
            
            {/* Prediction Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setPrediction('heads')}
                disabled={isFlipping}
                className={cn(
                  "px-6 py-3 rounded-xl font-bold transition-all duration-200 transform",
                  "border-2 hover:scale-105 active:scale-95",
                  prediction === 'heads' 
                    ? "bg-game-accent text-game-bg border-game-accent shadow-lg" 
                    : "bg-game-surface text-white border-game-border hover:border-game-accent",
                  isFlipping && "opacity-50 cursor-not-allowed"
                )}
              >
                Heads (₹)
              </button>
              <button
                onClick={() => setPrediction('tails')}
                disabled={isFlipping}
                className={cn(
                  "px-6 py-3 rounded-xl font-bold transition-all duration-200 transform",
                  "border-2 hover:scale-105 active:scale-95",
                  prediction === 'tails' 
                    ? "bg-game-accent text-game-bg border-game-accent shadow-lg" 
                    : "bg-game-surface text-white border-game-border hover:border-game-accent",
                  isFlipping && "opacity-50 cursor-not-allowed"
                )}
              >
                Tails
              </button>
            </div>

            {/* Result Display */}
            {result && !isFlipping && (
              <div className="text-center mb-6">
                <div className="text-2xl font-bold mb-2">
                  Result: <span className="text-game-accent">{result.toUpperCase()}</span>
                </div>
                {gameHistory.length > 0 && (
                  <div className={cn(
                    "text-xl font-semibold",
                    gameHistory[gameHistory.length - 1].won ? "text-game-success" : "text-game-error"
                  )}>
                    {gameHistory[gameHistory.length - 1].won ? "🎉 YOU WON!" : "😔 YOU LOST"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Betting Panel */}
          <div className="flex-1 w-full max-w-2xl">
            <BettingPanel
              minBet={minBet}
              maxBet={maxBet}
              currentBet={selectedAmount}
              selectedAmount={selectedAmount}
              difficulty={difficulty}
              onMinChange={() => {}}
              onMaxChange={() => {}}
              onAmountSelect={setSelectedAmount}
              onDifficultySelect={setDifficulty}
              onPlay={flipCoin}
              isPlaying={isFlipping}
              balance={balance}
            />
          </div>
        </div>

        {/* Game History */}
        {gameHistory.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Recent Games</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameHistory.slice(-6).reverse().map((game, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200",
                    game.won 
                      ? "bg-game-success/10 border-game-success/30" 
                      : "bg-game-error/10 border-game-error/30"
                  )}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">₹{game.bet}</span>
                    <span className={cn(
                      "font-bold",
                      game.won ? "text-game-success" : "text-game-error"
                    )}>
                      {game.won ? "+₹" + game.payout.toFixed(2) : "-₹" + game.bet}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Predicted: {game.prediction} | Result: {game.result}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};