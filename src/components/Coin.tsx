import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface CoinProps {
  isFlipping: boolean;
  result?: 'heads' | 'tails';
  won?: boolean;
  className?: string;
  splineUrl?: string;
}

export const Coin = ({ isFlipping, result, won, className, splineUrl }: CoinProps) => {
  useEffect(() => {
    const id = "spline-viewer-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.type = "module";
      s.src = "https://unpkg.com/@splinetool/viewer@1.10.48/build/spline-viewer.js";
      s.id = id;
      document.head.appendChild(s);
    }
  }, []);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className={cn(
          "relative transition-transform duration-500",
          isFlipping && "coin-flip-enhanced",
          !isFlipping && result && "coin-land-bounce",
          !isFlipping && result && won === false && "opacity-80 saturate-75"
        )}
        style={{ width: "clamp(150px, 28vw, 220px)", height: "clamp(150px, 28vw, 220px)" }}
      >
        {splineUrl ? (
          // @ts-ignore custom element
          <spline-viewer
            url={splineUrl}
            style={{ width: "100%", height: "100%", borderRadius: 9999, overflow: "hidden" as any }}
          />
        ) : (
          <div className="w-full h-full rounded-full bg-secondary/30 grid place-items-center border border-game-border">
            <span className="text-xs text-muted-foreground px-4 text-center">Add Spline URL to render 3D coin</span>
          </div>
        )}
      </div>
    </div>
  );
};