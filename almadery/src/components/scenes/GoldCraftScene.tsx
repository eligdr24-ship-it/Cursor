import GoldCraftSVG from "../svg/GoldCraftSVG";
import ChapterText from "./ChapterText";

export default function GoldCraftScene() {
  return (
    <section
      data-scene="gold"
      aria-label="Chapter three — gold craftsmanship"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 [transform-style:preserve-3d]"
    >
      {/* Warm bench light */}
      <div
        data-glow=""
        aria-hidden="true"
        className="absolute top-[40%] left-1/2 h-[90vmin] w-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(208,179,132,0.13) 0%, rgba(138,107,59,0.05) 40%, transparent 68%)",
        }}
      />

      <div data-art="" className="relative will-change-transform">
        <GoldCraftSVG
          className="h-[36vh] w-auto md:h-[46vh]"
          label="A champagne-gold ring band taking shape on the jeweller's bench, surrounded by fine artisan tools"
        />
      </div>

      <div className="mt-4 md:mt-8">
        <ChapterText
          chapter="Chapter III — The Craft"
          headline="Gold, Shaped by the Human Hand"
          body="Craftsmanship transforms precious material into form, balance, and lasting beauty."
        />
      </div>
    </section>
  );
}
