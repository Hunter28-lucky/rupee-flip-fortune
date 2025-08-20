import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface BettingPanelProps {
  minBet: number;
  maxBet: number;
  currentBet: number;
  selectedAmount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Hardcore';
  onMinChange: (value: number) => void;
  onMaxChange: (value: number) => void;
  onAmountSelect: (amount: number) => void;
  onDifficultySelect: (difficulty: 'Easy' | 'Medium' | 'Hard' | 'Hardcore') => void;
  onPlay: () => void;
  isPlaying: boolean;
  balance: number;
}

const betAmounts = [0.5, 1, 2, 7];
const difficulties = ['Easy', 'Medium', 'Hard', 'Hardcore'] as const;

export const BettingPanel = ({
  minBet,
  maxBet,
  currentBet,
  selectedAmount,
  difficulty,
  onMinChange,
  onMaxChange,
  onAmountSelect,
  onDifficultySelect,
  onPlay,
  isPlaying,
  balance
}: BettingPanelProps) => {
  const getChanceOfCollision = () => {
    switch (difficulty) {
      case 'Easy': return '10%';
      case 'Medium': return '25%';
      case 'Hard': return '45%';
      case 'Hardcore': return '70%';
      default: return '10%';
    }
  };

  const getMultiplier = () => {
    switch (difficulty) {
      case 'Easy': return 1.8;
      case 'Medium': return 2.5;
      case 'Hard': return 3.2;
      case 'Hardcore': return 4.5;
      default: return 1.8;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-game-surface rounded-2xl border border-game-border shadow-2xl">
      {/* Min/Max Section */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">MIN</span>
          <div className="bg-game-bg px-3 py-2 rounded-lg border border-game-border">
            <span className="text-white font-bold">{minBet}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">MAX</span>
          <div className="bg-game-bg px-3 py-2 rounded-lg border border-game-border">
            <span className="text-white font-bold">{maxBet}</span>
          </div>
        </div>
        
        <div className="ml-auto">
          <span className="text-lg font-bold text-muted-foreground">Difficulty</span>
        </div>
      </div>

      {/* Bet Amounts */}
      <div className="flex gap-3 mb-6">
        {betAmounts.map((amount) => (
          <Button
            key={amount}
            variant={selectedAmount === amount ? "default" : "secondary"}
            size="sm"
            onClick={() => onAmountSelect(amount)}
            disabled={isPlaying || amount > balance}
            className={cn(
              "px-4 py-2 font-bold transition-all duration-200",
              selectedAmount === amount && "bg-game-accent text-game-bg hover:bg-game-accent/90",
              amount > balance && "opacity-50 cursor-not-allowed"
            )}
          >
            {amount} ₹
          </Button>
        ))}
      </div>

      {/* Difficulty and Chance Section */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {difficulties.map((diff) => (
            <Button
              key={diff}
              variant={difficulty === diff ? "default" : "ghost"}
              size="sm"
              onClick={() => onDifficultySelect(diff)}
              disabled={isPlaying}
              className={cn(
                "px-4 py-2 font-medium transition-all duration-200",
                difficulty === diff && "bg-game-accent text-game-bg hover:bg-game-accent/90",
                difficulty !== diff && "text-muted-foreground hover:text-white hover:bg-game-bg"
              )}
            >
              {diff}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Chance of collision</span>
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
            <span className="text-white font-bold">{getChanceOfCollision()}</span>
          </div>
        </div>
      </div>

      {/* Game Info */}
      <div className="flex items-center justify-between mb-6 p-4 bg-game-bg rounded-lg border border-game-border">
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Balance</div>
          <div className="text-xl font-bold text-game-accent">₹{balance.toFixed(2)}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Bet Amount</div>
          <div className="text-xl font-bold text-white">₹{selectedAmount}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Win Multiplier</div>
          <div className="text-xl font-bold text-game-success">{getMultiplier()}x</div>
        </div>
      </div>

      {/* Play Button */}
      <Button
        onClick={onPlay}
        disabled={isPlaying || selectedAmount > balance || selectedAmount === 0}
        size="lg"
        className={cn(
          "w-full h-14 text-xl font-bold rounded-xl transition-all duration-300 transform",
          "bg-game-success hover:bg-game-success/90 text-white",
          "hover:scale-105 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          isPlaying && "animate-pulse"
        )}
      >
        {isPlaying ? (
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Playing...
          </div>
        ) : (
          'Play'
        )}
      </Button>
    </div>
  );
};