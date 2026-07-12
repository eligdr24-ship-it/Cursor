import RingAssemblySVG from "../svg/RingAssemblySVG";
import ChapterText from "./ChapterText";

export default function FinalRingScene() {
  return (
    <section
      data-scene="final"
      aria-label="Chapter five — the finished engagement ring"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 [transform-style:preserve-3d]"
    >
      {/* Gallery spotlight on warm stone */}
      <div
        data-spot=""
        aria-hidden="true"
        className="absolute top-[38%] left-1/2 h-[95vmin] w-[95vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,253,247,0.9) 0%, rgba(255,253,247,0.35) 38%, transparent 66%)",
        }}
      />

      <div data-art="" className="relative will-change-transform">
        <RingAssemblySVG
          state="complete"
          softShadow
          className="h-[36vh] w-auto md:h-[46vh] drop-shadow-[0_24px_34px_rgba(43,37,28,0.18)]"
          label="The finished ALMADERY engagement ring — a round brilliant diamond held by four champagne-gold prongs"
        />
      </div>

      <div className="mt-4 md:mt-8">
        <ChapterText
          tone="dark"
          chapter="Chapter V — The Promise"
          headline="A Timeless Promise, Perfected"
          body="Created to hold a moment, express a promise, and endure beyond generations."
        />
      </div>
    </section>
  );
}
