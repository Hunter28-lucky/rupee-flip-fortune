import { cn } from "@/lib/utils";

interface CoinProps {
  isFlipping: boolean;
  result?: 'heads' | 'tails';
  className?: string;
}

export const Coin = ({ isFlipping, result, className }: CoinProps) => {
  return (
    <div className={cn("flex items-center justify-center perspective-1000", className)}>
      <div
        className={cn(
          "relative w-[320px] h-[320px] rounded-full transform-gpu",
          isFlipping && "coin-flip-enhanced",
          !isFlipping && result && "coin-land-bounce"
        )}
        style={{ transformOrigin: "50% 50%" }}
      >
        {/* 3D Spline Coin */}
        <spline-viewer
          url="https://prod.spline.design/DUtd9ZOj-pinxtW0/scene.splinecode"
          style={{ width: "320px", height: "320px", borderRadius: "9999px", overflow: "hidden", display: "block" } as any}
        />

        {/* Optional overlays to keep existing effects during flip */}
        {isFlipping && (
          <div className="pointer-events-none absolute inset-0 rounded-full blur-md" />
        )}
      </div>
    </div>
  );
};