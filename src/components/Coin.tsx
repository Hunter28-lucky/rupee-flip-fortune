import { cn } from "@/lib/utils";

interface CoinProps {
  isFlipping: boolean;
  result?: 'heads' | 'tails';
  won?: boolean;
  className?: string;
}

export const Coin = ({ isFlipping, result, won, className }: CoinProps) => {
  return (
    <div className={cn("flex items-center justify-center perspective-1000", className)}>
      {/* Enhanced 3D Coin Container */}
      <div className="relative">
        {/* Motion Blur Effect During Flip */}
        {isFlipping && (
          <div className="absolute inset-0 w-40 h-40 -m-4 rounded-full bg-gradient-to-r from-transparent via-game-accent/20 to-transparent blur-md animate-spin-blur" />
        )}
        
        {/* Particle Effects */}
        {isFlipping && (
          <div className="absolute inset-0 w-40 h-40 -m-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-game-accent/60 rounded-full animate-particle-burst"
                style={{
                  top: '50%',
                  left: '50%',
                  animationDelay: `${i * 0.1}s`,
                  '--particle-angle': `${i * 45}deg`
                } as any}
              />
            ))}
          </div>
        )}
        
        {/* Main Coin */}
        <div 
          className={cn(
            "relative w-36 h-36 rounded-full transform-gpu transition-all duration-500",
            isFlipping && "coin-flip-enhanced",
            !isFlipping && result && "coin-land-bounce",
            "preserve-3d",
            !isFlipping && result && won === false && "opacity-80 saturate-75"
          )}
        >
          {/* Coin Edge (3D Thickness) */}
          <div 
            className="absolute inset-1 rounded-full bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-700 transform-gpu"
            style={{ 
              transform: 'translateZ(-8px)',
              filter: 'brightness(0.7)'
            }}
          />
          
          {/* Coin Front (Heads) */}
          <div 
            className={cn(
              "absolute inset-0 rounded-full coin-face-gradient flex items-center justify-center text-5xl font-black text-white shadow-2xl border-2 border-yellow-400/50",
              "backface-hidden transform-gpu",
              result === 'heads' && !isFlipping && "winner-glow"
            )}
            style={{ 
              transform: 'rotateY(0deg) translateZ(4px)',
              backfaceVisibility: 'hidden',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            <EmbossedRupee />
          </div>
          
          {/* Coin Back (Tails) */}
          <div 
            className={cn(
              "absolute inset-0 rounded-full coin-face-gradient-alt flex items-center justify-center text-5xl font-black text-white shadow-2xl border-2 border-yellow-400/50",
              "backface-hidden transform-gpu",
              result === 'tails' && !isFlipping && "winner-glow"
            )}
            style={{ 
              transform: 'rotateY(180deg) translateZ(4px)',
              backfaceVisibility: 'hidden',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
            }}
          >
            <EmbossedRupee />
          </div>
          
          {/* Reflective Surface */}
          <div 
            className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent transform-gpu pointer-events-none"
            style={{ transform: 'translateZ(5px)' }}
          />
        </div>
        
        {/* Enhanced Shadow */}
        <div 
          className={cn(
            "absolute -bottom-6 left-1/2 transform -translate-x-1/2 transition-all duration-500",
            isFlipping ? "w-32 h-8 bg-black/40" : "w-28 h-6 bg-black/30",
            "rounded-full blur-lg"
          )}
        />
        
        {/* Ground Reflection */}
        <div 
          className={cn(
            "absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-36 h-36 rounded-full opacity-20 transition-all duration-500",
            "bg-gradient-radial from-game-accent/30 via-transparent to-transparent",
            isFlipping && "animate-pulse"
          )}
        />
      </div>
    </div>
  );
};

const EmbossedRupee = () => (
  <div className="relative select-none">
    <span className="text-yellow-50/95">₹</span>
    <span className="absolute inset-0 flex items-center justify-center text-5xl font-black text-yellow-200/30 blur-sm pointer-events-none">₹</span>
    <span className="absolute left-1 top-1 text-yellow-900/30">₹</span>
  </div>
);