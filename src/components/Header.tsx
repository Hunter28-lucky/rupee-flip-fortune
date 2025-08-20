import { cn } from "@/lib/utils";

interface HeaderProps {
  balance: number;
  onlineCount?: number;
  className?: string;
}

export const Header = ({ balance, onlineCount = 34286, className }: HeaderProps) => {
  const formatINR = (value: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(value);

  return (
    <header
      className={cn(
        "w-full sticky top-0 z-40 bg-game-surface/80 backdrop-blur supports-[backdrop-filter]:bg-game-surface/60 border-b border-game-border",
        className
      )}
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-full shadow-inner overflow-hidden">
            <div className="absolute inset-0 rounded-full" style={{
              background:
                "linear-gradient(135deg, #ffd700 0%, #ffed4e 25%, #ffd700 45%, #b8860b 65%, #ffd700 85%, #daa520 100%)"
            }} />
            <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-yellow-100/90" style={{
              textShadow: "0 1px 0 rgba(0,0,0,0.6), 0 -1px 0 rgba(255,255,255,0.2)"
            }}>₹</div>
          </div>
          <div className="text-lg font-extrabold tracking-tight">
            Rupee <span className="text-game-accent">Flip</span> Fortune
          </div>
        </div>

        {/* Center stats (hidden on very small) */}
        <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Online: {new Intl.NumberFormat("en-IN").format(onlineCount)}
          </div>
        </div>

        {/* Balance */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-game-bg border border-game-border text-sm">
            ₹ {formatINR(balance)}
          </span>
        </div>
      </div>
    </header>
  );
};

