import { AlmaderyLogo } from './Logo'

export function BrandRevealScene() {
  return (
    <div
      className="scene scene-brand absolute inset-0 flex flex-col items-center justify-center px-6"
      data-scene="brand"
      aria-hidden="true"
    >
      <div className="brand-mask absolute left-1/2 top-1/2 h-[min(70vmin,480px)] w-[min(70vmin,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(196,165,116,0.1)_0%,transparent_65%)] opacity-0 will-change-transform" />

      <div className="brand-content relative z-10 flex flex-col items-center text-center opacity-0 will-change-transform">
        <div className="brand-emblem-wrap relative mb-8 overflow-hidden">
          <div className="brand-emblem-shine absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-soft-ivory/25 to-transparent skew-x-12" />
          <AlmaderyLogo
            variant="emblem"
            className="brand-emblem text-champagne"
            emblemClassName="w-20 h-20 md:w-28 md:h-28"
          />
        </div>

        <p className="brand-wordmark font-display text-3xl font-light tracking-[0.48em] text-soft-ivory uppercase md:text-5xl">
          ALMADERY
        </p>
        <p className="brand-subtitle mt-4 font-body text-[0.65rem] font-light uppercase tracking-[0.32em] text-muted-beige md:text-xs">
          Fine Diamonds &amp; Gold Jewellery
        </p>

        <div className="brand-divider my-8 h-px w-16 bg-gradient-to-r from-transparent via-champagne/60 to-transparent" />

        <p className="brand-statement max-w-md font-display text-xl font-light italic leading-snug tracking-wide text-soft-ivory/90 md:text-2xl text-balance">
          From Nature&apos;s Rarest Form to a Symbol That Lasts Forever
        </p>

        <p className="brand-soon mt-10 font-body text-[0.7rem] font-light uppercase tracking-[0.4em] text-champagne">
          Coming Soon
        </p>
      </div>
    </div>
  )
}

export default BrandRevealScene
