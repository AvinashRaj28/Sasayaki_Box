"use client";
import React from "react";
import Lottie from "lottie-react";
import sakuraAnimation from "@/animations/Sakura fall.json";
import type { LottieRefCurrentProps } from "lottie-react";

export default function Background() {
  const lottieRef = React.useRef<LottieRefCurrentProps | null>(null);


  // tweak animation speed here
  React.useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.4); // slow & soft 🌸
    }
  }, []);

  const SCALE = 1.1;
  const LEFT_SHIFT = -30;
  const HEIGHT_VH = 120;

  return (
    <div
      aria-hidden
      className="fixed inset-0 overflow-hidden -z-10 pointer-events-none"
      style={{ background: "transparent" }}
    >
      <div
        className="absolute inset-0 z-20"
        style={{ background: "rgba(255,255,255,0.40)", backdropFilter: "blur(1.5px)" }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${LEFT_SHIFT}vw`,
          width: `${100 + Math.abs(LEFT_SHIFT) * 2}vw`,
          height: `${HEIGHT_VH}vh`,
          transform: `scale(${SCALE})`,
          transformOrigin: "center top",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <Lottie
          lottieRef={lottieRef}
          animationData={sakuraAnimation}
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            objectFit: "cover",
          }}
        />
      </div>
    </div>
  );
}
