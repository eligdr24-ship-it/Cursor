import { useRef } from "react";
import { useCinematicTimeline } from "../hooks/useCinematicTimeline";
import IntroScene from "./scenes/IntroScene";
import RoughDiamondScene from "./scenes/RoughDiamondScene";
import PolishedDiamondScene from "./scenes/PolishedDiamondScene";
import GoldCraftScene from "./scenes/GoldCraftScene";
import DiamondSettingScene from "./scenes/DiamondSettingScene";
import FinalRingScene from "./scenes/FinalRingScene";
import BrandRevealScene from "./scenes/BrandRevealScene";

/**
 * The pinned cinematic stage. While it is pinned, scroll progress plays the
 * ALMADERY creation story through one centralized GSAP timeline.
 */
export default function CinematicJourney() {
  const stageRef = useRef<HTMLDivElement>(null);
  useCinematicTimeline(stageRef);

  return (
    <div
      ref={stageRef}
      className="relative h-screen overflow-hidden [perspective:1200px]"
    >
      {/* Backdrop colour travels dark -> warm -> ivory -> dark across the story */}
      <div data-backdrop="" aria-hidden="true" className="absolute inset-0 bg-ink" />
      <div
        data-keylight-cool=""
        aria-hidden="true"
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(90vmin 90vmin at 50% 42%, rgba(220,226,238,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        data-keylight-warm=""
        aria-hidden="true"
        className="absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(100vmin 100vmin at 50% 45%, rgba(208,179,132,0.10) 0%, transparent 66%)",
        }}
      />

      <IntroScene />
      <RoughDiamondScene />
      <PolishedDiamondScene />
      <GoldCraftScene />
      <DiamondSettingScene />
      <FinalRingScene />
      <BrandRevealScene />
    </div>
  );
}
