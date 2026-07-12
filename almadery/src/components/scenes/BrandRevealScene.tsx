import Emblem from "../brand/Emblem";
import Wordmark from "../brand/Wordmark";

export default function BrandRevealScene() {
  return (
    <section
      data-scene="reveal"
      aria-label="ALMADERY brand reveal"
      className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 [transform-style:preserve-3d]"
    >
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 h-[100vmin] w-[100vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(208,179,132,0.08) 0%, rgba(208,179,132,0.03) 36%, transparent 64%)",
        }}
      />

      <div className="relative flex flex-col items-center px-6 text-center">
        <div data-reveal-emblem="" className="text-champagne">
          <Emblem
            drawable
            strokeWidth={2}
            className="h-28 w-auto md:h-40"
            title="ALMADERY emblem, drawn in gold line"
          />
        </div>

        <div data-reveal-word="" className="mt-10 text-ivory">
          <Wordmark className="h-10 w-auto md:h-14" />
        </div>

        <p
          data-reveal-sub=""
          className="mt-4 text-[10px] font-light uppercase tracking-[0.5em] text-warmgray md:text-xs"
        >
          Fine Diamonds &amp; Gold Jewellery
        </p>

        <p
          data-reveal-statement=""
          className="mt-10 max-w-md font-serif text-xl leading-snug font-light text-balance text-ivory/85 italic md:text-2xl"
        >
          From Nature&rsquo;s Rarest Form to a Symbol That Lasts Forever
        </p>

        <p
          data-reveal-soon=""
          className="mt-9 border border-champagne/35 px-7 py-2.5 text-[10px] font-light uppercase tracking-[0.5em] text-champagne md:text-xs"
        >
          Coming Soon
        </p>
      </div>

      {/* A final pass of reflected light */}
      <div
        data-sweep=""
        aria-hidden="true"
        className="svg-texture absolute inset-y-0 left-0 w-[26%] -skew-x-12 opacity-0 mix-blend-screen"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(241,235,224,0.16) 50%, transparent)",
        }}
      />
    </section>
  );
}
