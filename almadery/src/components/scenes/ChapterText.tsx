type ChapterTextProps = {
  chapter: string;
  headline: string;
  body: string;
  tone?: "light" | "dark";
};

/** Shared editorial text block. Each [data-line] is staggered by the master timeline. */
export default function ChapterText({
  chapter,
  headline,
  body,
  tone = "light",
}: ChapterTextProps) {
  const dark = tone === "dark";
  return (
    <div data-text="" className="relative z-10 max-w-2xl px-6 text-center">
      <p
        data-line=""
        className={`text-[10px] md:text-[11px] font-light uppercase tracking-[0.45em] ${
          dark ? "text-antique" : "text-champagne/90"
        }`}
      >
        {chapter}
      </p>
      <h2
        data-line=""
        className={`mt-5 font-serif text-4xl leading-[1.08] font-light text-balance md:text-6xl ${
          dark ? "text-inkbrown" : "text-ivory"
        }`}
      >
        {headline}
      </h2>
      <p
        data-line=""
        className={`mx-auto mt-6 max-w-md text-sm leading-relaxed font-light tracking-wide md:text-base ${
          dark ? "text-[#6d6252]" : "text-warmgray"
        }`}
      >
        {body}
      </p>
    </div>
  );
}
