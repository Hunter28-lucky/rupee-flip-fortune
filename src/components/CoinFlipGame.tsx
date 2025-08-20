import { useState, useCallback } from "react";
import { Coin } from "./Coin";
import { BettingPanel } from "./BettingPanel";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Header } from "./Header";
import { FooterControls } from "./FooterControls";

export const CoinFlipGame = () => {
  const [balance, setBalance] = useState(100000);
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [minBet] = useState(0.6);
  const [maxBet] = useState(100);
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Hardcore'>('Easy');
  const [rtp, setRtp] = useState(85);
  const [prediction, setPrediction] = useState<'heads' | 'tails'>('heads');
  const [lastOutcomeWon, setLastOutcomeWon] = useState<boolean | null>(null);
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
    const multiplier = getMultiplier();
    return (rtp / 100) / multiplier;
  }, [rtp, getMultiplier]);

  const flipCoin = useCallback(async () => {
    if (selectedAmount > balance || selectedAmount <= 0) {
      toast({ title: "Invalid Bet", description: "Please check your bet amount and balance.", variant: "destructive" });
      return;
    }

    setIsFlipping(true);
    setResult(null);
    try { if (navigator.vibrate) navigator.vibrate(20); } catch {}

    setBalance(prev => prev - selectedAmount);
    await new Promise(resolve => setTimeout(resolve, 2200));

    const random = Math.random();
    const winChance = getWinChance();
    const willWin = random < winChance;
    const coinResult: 'heads' | 'tails' = willWin ? prediction : (prediction === 'heads' ? 'tails' : 'heads');

    setResult(coinResult);
    setIsFlipping(false);
    try { if (navigator.vibrate) navigator.vibrate([0, 30]); } catch {}

    const won = coinResult === prediction;
    const multiplier = getMultiplier();
    const payout = won ? selectedAmount * multiplier : 0;

    setLastOutcomeWon(won);
    if (won) {
      setBalance(prev => prev + payout);
      toast({ title: "🎉 You Won!", description: `You won ₹${payout.toFixed(2)}! The coin landed on ${coinResult}.`, variant: "default" });
    } else {
      toast({ title: "😔 You Lost", description: `The coin landed on ${coinResult}. Better luck next time!`, variant: "destructive" });
    }

    setGameHistory(prev => [...prev.slice(-9), { bet: selectedAmount, result: coinResult, prediction, won, payout }]);
  }, [selectedAmount, balance, prediction, rtp, getWinChance, getMultiplier, toast]);

  return (
    <div className="min-h-screen bg-game-bg text-white">
      <Header balance={balance} />
      {/* Space above sticky footer with safe area padding */}
      <div className="container mx-auto px-4 pt-6 pb-[calc(84px+env(safe-area-inset-bottom))]">
        {/* Vertically centers coin + controls in remaining viewport height */}
        <div className="grid grid-rows-[1fr_auto_auto] gap-6 min-h-[calc(100vh-6rem-84px-env(safe-area-inset-bottom))]">
          {/* Coin + prediction */}
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <Coin isFlipping={isFlipping} result={result || undefined} won={lastOutcomeWon ?? undefined} className="transform" />
            </div>
            <div className="flex gap-3 mb-2">
              <button
                onClick={() => setPrediction('heads')}
                disabled={isFlipping}
                className={cn(
                  "px-6 py-4 rounded-xl font-bold transition-all duration-300 transform",
                  "border-2 hover:scale-105 active:scale-95 shadow-lg",
                  prediction === 'heads' ? "bg-game-accent text-game-bg border-game-accent shadow-game-accent/30" : "bg-game-surface/80 text-white border-game-border hover:border-game-accent backdrop-blur-sm",
                  isFlipping && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">₹</span>
                  <span className="text-sm">Heads</span>
                </div>
              </button>
              <button
                onClick={() => setPrediction('tails')}
                disabled={isFlipping}
                className={cn(
                  "px-6 py-4 rounded-xl font-bold transition-all duration-300 transform",
                  "border-2 hover:scale-105 active:scale-95 shadow-lg",
                  prediction === 'tails' ? "bg-game-accent text-game-bg border-game-accent shadow-game-accent/30" : "bg-game-surface/80 text-white border-game-border hover:border-game-accent backdrop-blur-sm",
                  isFlipping && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className="flex flex-col items-center">
                  <span className="text-2xl mb-1">₹</span>
                  <span className="text-sm">Tails</span>
                </div>
              </button>
            </div>

            {result && !isFlipping && (
              <div className="text-center mt-2">
                <div className="text-3xl font-bold mb-2">
                  Result: <span className="text-game-accent">{result.toUpperCase()}</span>
                </div>
                {gameHistory.length > 0 && (
                  <div className={cn(
                    "text-2xl font-bold px-6 py-2 rounded-lg border-2",
                    gameHistory[gameHistory.length - 1].won ? "text-game-success border-game-success/30 bg-game-success/10 shadow-[0_0_20px_hsl(var(--game-success)/0.4)]" : "text-game-error/80 border-game-error/30 bg-game-error/10 opacity-90"
                  )}>
                    {gameHistory[gameHistory.length - 1].won ? "🎉 YOU WON!" : "😔 YOU LOST"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Betting panel for desktops */}
          <div className="hidden lg:block flex-1 w-full max-w-2xl self-center">
            <BettingPanel
              minBet={minBet}
              maxBet={maxBet}
              currentBet={selectedAmount}
              selectedAmount={selectedAmount}
              difficulty={difficulty}
              rtp={rtp}
              onMinChange={() => {}}
              onMaxChange={() => {}}
              onAmountSelect={setSelectedAmount}
              onDifficultySelect={setDifficulty}
              onRtpChange={setRtp}
              onPlay={flipCoin}
              isPlaying={isFlipping}
              balance={balance}
            />
          </div>

          {/* Recent Games scroll area */}
          {gameHistory.length > 0 && (
            <div className="max-w-6xl mx-auto overflow-y-auto pr-1" style={{ maxHeight: "28vh" }}>
              <h3 className="text-2xl font-bold mb-6 text-center">Recent Games</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {gameHistory.slice(-8).reverse().map((game, index) => (
                  <div key={index} className={cn("p-4 rounded-lg border-2 transition-all duration-200 backdrop-blur-sm", game.won ? "bg-game-success/10 border-game-success/30 shadow-game-success/20" : "bg-game-error/10 border-game-error/30 shadow-game-error/20")}> 
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg">₹{game.bet}</span>
                      <span className={cn("font-bold text-lg", game.won ? "text-game-success" : "text-game-error")}>
                        {game.won ? "+₹" + game.payout.toFixed(2) : "-₹" + game.bet}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Predicted: <span className="font-medium">{game.prediction}</span> | Result: <span className="font-medium">{game.result}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <FooterControls selectedAmount={selectedAmount} onAmountSelect={setSelectedAmount} onFlip={flipCoin} isFlipping={isFlipping} difficulty={difficulty} onDifficultySelect={setDifficulty} />
    </div>
  );
};