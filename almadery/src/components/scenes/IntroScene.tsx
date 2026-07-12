import Emblem from "../brand/Emblem";
import Wordmark from "../brand/Wordmark";

export default function IntroScene() {
  return (
    <section
      data-scene="intro"
      aria-label="ALMADERY — introduction"
      className="pointer-events-none absolute inset-0 flex items-center justify-center [transform-style:preserve-3d]"
    >
      {/* A single controlled source of light in near-darkness */}
      <div
        data-intro-light=""
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[110vmin] w-[110vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(208,179,132,0.10) 0%, rgba(208,179,132,0.035) 32%, transparent 62%)",
        }}
      />

      <div data-intro-block="" className="relative flex flex-col items-center will-change-transform">
        <div data-intro-emblem="" className="text-champagne">
          <Emblem className="h-24 w-auto md:h-32" title="ALMADERY emblem" />
        </div>
        <div data-intro-word="" className="mt-9 text-ivory">
          <Wordmark className="h-9 w-auto md:h-12" />
        </div>
        <p
          data-intro-sub=""
          className="mt-4 text-[10px] font-light uppercase tracking-[0.5em] text-warmgray md:text-xs"
        >
          Fine Diamonds &amp; Gold Jewellery
        </p>
      </div>

      <div
        data-intro-hint=""
        className="absolute bottom-9 left-1/2 flex -translate-x-1/2 flex-col items-center gap-4"
      >
        <span className="text-[9px] font-light uppercase tracking-[0.45em] text-beige">
          Scroll to Discover
        </span>
        <span aria-hidden="true" className="scroll-hint-line block h-12 w-px bg-champagne/60" />
      </div>
    </section>
  );
}
