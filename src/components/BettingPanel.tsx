import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

interface BettingPanelProps {
  minBet: number;
  maxBet: number;
  currentBet: number;
  selectedAmount: number;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Hardcore';
  rtp: number;
  onMinChange: () => void;
  onMaxChange: () => void;
  onAmountSelect: (amount: number) => void;
  onDifficultySelect: (difficulty: 'Easy' | 'Medium' | 'Hard' | 'Hardcore') => void;
  onRtpChange: (rtp: number) => void;
  onPlay: () => void;
  isPlaying: boolean;
  balance: number;
}

export const BettingPanel = ({
  minBet,
  maxBet,
  currentBet,
  selectedAmount,
  difficulty,
  rtp,
  onMinChange,
  onMaxChange,
  onAmountSelect,
  onDifficultySelect,
  onRtpChange,
  onPlay,
  isPlaying,
  balance
}: BettingPanelProps) => {
  const presetAmounts = [0.5, 1, 2, 7];
  
  const getMultiplier = () => {
    switch (difficulty) {
      case 'Easy': return 1.8;
      case 'Medium': return 2.5;
      case 'Hard': return 3.2;
      case 'Hardcore': return 4.5;
      default: return 1.8;
    }
  };

  const getWinChance = () => {
    const multiplier = getMultiplier();
    return (rtp / 100) / multiplier;
  };

  return (
    <Card className="p-6 bg-game-surface border-game-border">
      <div className="space-y-6">
        {/* Balance Display */}
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-1">Balance</div>
          <div className="text-3xl font-bold text-game-success">₹{balance.toFixed(2)}</div>
        </div>

        {/* Betting Amount Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Bet Amount</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAmountSelect(Math.max(minBet, selectedAmount - 0.1))}
                disabled={isPlaying || selectedAmount <= minBet}
                className="h-8 w-8 p-0 border-game-border hover:border-game-accent"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <div className="w-20 text-center">
                <input
                  type="number"
                  value={selectedAmount}
                  onChange={(e) => onAmountSelect(Math.max(minBet, Math.min(maxBet, parseFloat(e.target.value) || minBet)))}
                  disabled={isPlaying}
                  className="w-full text-center bg-game-bg border border-game-border rounded px-2 py-1 text-sm focus:border-game-accent focus:outline-none"
                  step="0.1"
                  min={minBet}
                  max={maxBet}
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAmountSelect(Math.min(maxBet, selectedAmount + 0.1))}
                disabled={isPlaying || selectedAmount >= maxBet}
                className="h-8 w-8 p-0 border-game-border hover:border-game-accent"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Min/Max Controls */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAmountSelect(minBet)}
              disabled={isPlaying}
              className="flex-1 border-game-border hover:border-game-accent text-xs"
            >
              Min (₹{minBet})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAmountSelect(maxBet)}
              disabled={isPlaying}
              className="flex-1 border-game-border hover:border-game-accent text-xs"
            >
              Max (₹{maxBet})
            </Button>
          </div>

          {/* Preset Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {presetAmounts.map((amount) => (
              <Button
                key={amount}
                variant={selectedAmount === amount ? "default" : "outline"}
                size="sm"
                onClick={() => onAmountSelect(amount)}
                disabled={isPlaying}
                className={cn(
                  "text-xs font-semibold",
                  selectedAmount === amount
                    ? "bg-game-accent text-game-bg hover:bg-game-accent/90"
                    : "border-game-border hover:border-game-accent"
                )}
              >
                ₹{amount}
              </Button>
            ))}
          </div>
        </div>

        {/* RTP Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Return to Player (RTP)</span>
            <Badge variant="outline" className="border-game-border text-game-accent">
              {rtp}%
            </Badge>
          </div>
          
          <div className="space-y-2">
            <input
              type="range"
              min="70"
              max="99"
              step="1"
              value={rtp}
              onChange={(e) => onRtpChange(parseInt(e.target.value))}
              disabled={isPlaying}
              className="w-full h-2 bg-game-bg rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>70% (House Edge: 30%)</span>
              <span>99% (House Edge: 1%)</span>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            Win Chance: {(getWinChance() * 100).toFixed(1)}%
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="space-y-3">
          <span className="text-sm font-medium">Difficulty</span>
          <div className="grid grid-cols-2 gap-2">
            {(['Easy', 'Medium', 'Hard', 'Hardcore'] as const).map((diff) => (
              <Button
                key={diff}
                variant={difficulty === diff ? "default" : "outline"}
                size="sm"
                onClick={() => onDifficultySelect(diff)}
                disabled={isPlaying}
                className={cn(
                  "text-xs font-semibold",
                  difficulty === diff
                    ? "bg-game-accent text-game-bg hover:bg-game-accent/90"
                    : "border-game-border hover:border-game-accent"
                )}
              >
                {diff}
                <span className="ml-1 text-xs opacity-70">
                  {diff === 'Easy' && '1.8x'}
                  {diff === 'Medium' && '2.5x'}
                  {diff === 'Hard' && '3.2x'}
                  {diff === 'Hardcore' && '4.5x'}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Play Button */}
        <Button
          onClick={onPlay}
          disabled={isPlaying || selectedAmount > balance || selectedAmount <= 0}
          className={cn(
            "w-full h-12 text-lg font-bold transition-all duration-200",
            "bg-game-accent hover:bg-game-accent/90 text-game-bg",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isPlaying && "animate-pulse"
          )}
        >
          {isPlaying ? "Flipping..." : `Flip Coin - ₹${selectedAmount.toFixed(2)}`}
        </Button>

        {/* Potential Payout Display */}
        <div className="text-center p-3 bg-game-bg rounded-lg border border-game-border">
          <div className="text-sm text-muted-foreground mb-1">Potential Payout</div>
          <div className="text-xl font-bold text-game-success">
            ₹{(selectedAmount * getMultiplier()).toFixed(2)}
          </div>
        </div>
      </div>
    </Card>
  );
};