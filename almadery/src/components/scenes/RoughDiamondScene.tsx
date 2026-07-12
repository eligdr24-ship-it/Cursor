import RoughDiamondSVG from "../svg/RoughDiamondSVG";
import ChapterText from "./ChapterText";

export default function RoughDiamondScene() {
  return (
    <section
      data-scene="rough"
      aria-label="Chapter one — the rough diamond"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 [transform-style:preserve-3d]"
    >
      {/* Narrow beam of light falling from above */}
      <div
        data-beam=""
        aria-hidden="true"
        className="absolute top-0 left-1/2 h-[72vh] w-[26vmin] origin-top -translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, rgba(241,235,224,0.09) 0%, rgba(241,235,224,0.045) 45%, transparent 100%)",
          clipPath: "polygon(38% 0, 62% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* Suspended mineral dust — decorative, removed on mobile */}
      <div data-dust="" aria-hidden="true" className="svg-texture absolute inset-0">
        <span className="absolute top-[28%] left-[30%] h-1 w-1 rounded-full bg-warmgray/40" />
        <span className="absolute top-[42%] left-[68%] h-[3px] w-[3px] rounded-full bg-warmgray/30" />
        <span className="absolute top-[60%] left-[24%] h-[2px] w-[2px] rounded-full bg-warmgray/35" />
        <span className="absolute top-[22%] left-[58%] h-[2px] w-[2px] rounded-full bg-warmgray/25" />
        <span className="absolute top-[68%] left-[62%] h-1 w-1 rounded-full bg-warmgray/30" />
      </div>

      <div data-art="" className="relative will-change-transform">
        <RoughDiamondSVG
          className="h-[34vh] w-auto md:h-[44vh]"
          label="A rough, uncut diamond crystal emerging from darkness"
        />
      </div>

      <div className="mt-6 md:mt-10">
        <ChapterText
          chapter="Chapter I — The Origin"
          headline="Every Masterpiece Begins Untouched"
          body="Before brilliance, there is possibility. A rare form shaped by nature and waiting to be revealed."
        />
      </div>
    </section>
  );
}
