import { cn } from "@/lib/utils";

interface CoinProps {
  isFlipping: boolean;
  result?: 'heads' | 'tails';
  className?: string;
}

export const Coin = ({ isFlipping, result, className }: CoinProps) => {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div 
        className={cn(
          "relative w-32 h-32 rounded-full transform-gpu transition-all duration-300",
          isFlipping && "coin-flip",
          !isFlipping && result && "coin-bounce"
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Coin Front (Heads) */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full gold-shimmer flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-game-accent/30",
            "backface-hidden",
            result === 'heads' && !isFlipping && "pulse-glow"
          )}
          style={{ 
            transform: 'rotateY(0deg)',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, hsl(var(--coin-gold)), hsl(var(--game-accent)))'
          }}
        >
          ₹
        </div>
        
        {/* Coin Back (Tails) */}
        <div 
          className={cn(
            "absolute inset-0 rounded-full gold-shimmer flex items-center justify-center text-2xl font-bold text-white shadow-2xl border-4 border-game-accent/30",
            "backface-hidden",
            result === 'tails' && !isFlipping && "pulse-glow"
          )}
          style={{ 
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(145deg, hsl(var(--game-accent)), hsl(var(--coin-gold)))'
          }}
        >
          TAIL
        </div>
        
        {/* Shadow */}
        <div 
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-coin-shadow/30 rounded-full blur-sm"
          style={{
            transform: `translateX(-50%) ${isFlipping ? 'scale(1.2)' : 'scale(1)'}`,
            transition: 'transform 0.3s ease'
          }}
        />
      </div>
    </div>
  );
};