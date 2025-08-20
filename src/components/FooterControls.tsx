import { cn } from "@/lib/utils";
import { RotateCw } from "lucide-react";

interface FooterControlsProps {
  selectedAmount: number;
  onAmountSelect: (amount: number) => void;
  onFlip: () => void;
  isFlipping: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Hardcore';
  onDifficultySelect: (d: 'Easy' | 'Medium' | 'Hard' | 'Hardcore') => void;
}

const AMOUNTS = [10, 50, 100, 250, 500, 1000];

export const FooterControls = ({
  selectedAmount,
  onAmountSelect,
  onFlip,
  isFlipping,
  difficulty,
  onDifficultySelect
}: FooterControlsProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-game-border bg-game-surface/90 backdrop-blur supports-[backdrop-filter]:bg-game-surface/70">
      <div className="container mx-auto px-4 py-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] items-center">
        {/* Bet pills */}
        <div className="flex flex-wrap gap-2">
          {AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => onAmountSelect(amt)}
              disabled={isFlipping}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-semibold border transition-all",
                selectedAmount === amt
                  ? "bg-game-accent text-game-bg border-transparent shadow"
                  : "bg-game-bg/60 border-game-border text-white hover:border-game-accent"
              )}
            >
              ₹{new Intl.NumberFormat('en-IN').format(amt)}
            </button>
          ))}
        </div>

        {/* Flip button and autoplay */}
        <div className="flex items-center justify-center gap-2">
          <button
            aria-label="Auto Play"
            className="h-11 w-11 rounded-xl border border-game-border bg-game-bg/70 hover:border-game-accent grid place-items-center"
            disabled={isFlipping}
          >
            <RotateCw className="h-5 w-5" />
          </button>
          <button
            onClick={onFlip}
            disabled={isFlipping}
            className={cn(
              "h-12 min-w-[160px] sm:min-w-[220px] px-8 rounded-xl text-lg font-extrabold text-game-bg",
              "bg-green-500 hover:bg-green-500/90 active:scale-[0.99] transition-all shadow-lg",
              isFlipping && "opacity-70 cursor-not-allowed"
            )}
          >
            {isFlipping ? "Flipping" : "Flip"}
          </button>
        </div>

        {/* Mode selector */}
        <div className="flex flex-wrap justify-end gap-2">
          {(['Easy','Medium','Hard'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onDifficultySelect(mode)}
              disabled={isFlipping}
              className={cn(
                "px-3 py-2 rounded-full text-xs font-semibold border",
                difficulty === mode
                  ? "bg-game-accent text-game-bg border-transparent"
                  : "bg-game-bg/60 border-game-border text-white hover:border-game-accent"
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

