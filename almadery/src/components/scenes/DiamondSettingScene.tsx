import RingAssemblySVG from "../svg/RingAssemblySVG";
import ChapterText from "./ChapterText";

export default function DiamondSettingScene() {
  return (
    <section
      data-scene="setting"
      aria-label="Chapter four — setting the diamond"
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center opacity-0 [transform-style:preserve-3d]"
    >
      <div
        data-glow=""
        aria-hidden="true"
        className="absolute top-[40%] left-1/2 h-[86vmin] w-[86vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(208,179,132,0.11) 0%, rgba(241,235,224,0.04) 42%, transparent 68%)",
        }}
      />

      <div data-art="" className="relative will-change-transform">
        <RingAssemblySVG
          state="open"
          className="h-[36vh] w-auto md:h-[46vh]"
          label="A polished diamond descending into the gold ring setting as the prongs close around it"
        />
      </div>

      <div className="mt-4 md:mt-8">
        <ChapterText
          chapter="Chapter IV — The Union"
          headline="Two Rare Elements. One Timeless Form."
          body="Diamond and gold come together through proportion, precision, and restraint."
        />
      </div>
    </section>
  );
}
