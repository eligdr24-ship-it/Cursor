import BrilliantDiamondSVG from "../svg/BrilliantDiamondSVG";
import ChapterText from "./ChapterText";

export default function PolishedDiamondScene() {
  return (
    <section
      data-scene="polished"
      aria-label="Chapter two — the polished diamond"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 [transform-style:preserve-3d]"
    >
      {/* Controlled white light behind the stone */}
      <div
        data-glow=""
        aria-hidden="true"
        className="absolute top-[42%] left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(241,235,224,0.10) 0%, rgba(241,235,224,0.04) 38%, transparent 66%)",
        }}
      />

      <div data-art="" className="relative overflow-visible will-change-transform">
        <BrilliantDiamondSVG
          className="h-[32vh] w-auto md:h-[42vh]"
          label="A polished round brilliant diamond with precise symmetrical facets"
        />
        {/* Light sweep passing across the stone */}
        <div
          data-sweep=""
          aria-hidden="true"
          className="svg-texture absolute inset-y-[-12%] left-0 w-[34%] -skew-x-12 opacity-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.32) 50%, transparent)",
          }}
        />
      </div>

      <div className="mt-6 md:mt-10">
        <ChapterText
          chapter="Chapter II — The Cut"
          headline="Precision Reveals the Light Within"
          body="Each facet is refined with purpose, allowing light, clarity, and brilliance to emerge."
        />
      </div>
    </section>
  );
}
