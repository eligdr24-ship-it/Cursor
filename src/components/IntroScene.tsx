import { AlmaderyLogo } from './Logo'

export function IntroScene() {
  return (
    <div
      className="scene scene-intro absolute inset-0 flex flex-col items-center justify-center px-6"
      data-scene="intro"
      aria-hidden="false"
    >
      <div className="intro-light absolute left-1/2 top-[38%] h-[min(42vw,280px)] w-[min(42vw,280px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.12)_0%,rgba(232,226,217,0.04)_35%,transparent_70%)] blur-2xl will-change-transform" />

      <div className="intro-logo relative z-10 opacity-0 will-change-transform">
        <AlmaderyLogo
          variant="full"
          emblemClassName="w-[4.5rem] h-[4.5rem] md:w-24 md:h-24 mx-auto mb-6 text-champagne"
          wordmarkClassName="text-[1.65rem] md:text-4xl font-light tracking-[0.48em]"
          subtitleClassName="text-[0.6rem] md:text-[0.7rem] tracking-[0.32em]"
        />
      </div>

      <p className="intro-scroll absolute bottom-10 left-1/2 z-10 -translate-x-1/2 font-body text-[0.625rem] font-light uppercase tracking-[0.35em] text-muted-beige opacity-0">
        Scroll to Discover
        <span className="intro-scroll-line mx-auto mt-4 block h-10 w-px origin-top bg-gradient-to-b from-champagne/60 to-transparent" />
      </p>
    </div>
  )
}

export default IntroScene
