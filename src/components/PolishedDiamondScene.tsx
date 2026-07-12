import { PolishedDiamond } from './JewelryVisuals'

export function PolishedDiamondScene() {
  return (
    <div
      className="scene scene-polished absolute inset-0 flex items-center justify-center px-6 md:px-12"
      data-scene="polished"
      aria-hidden="true"
    >
      <div className="polished-glow absolute left-1/2 top-[42%] h-[min(55vw,420px)] w-[min(55vw,420px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,rgba(232,226,217,0.04)_40%,transparent_70%)] opacity-0 blur-3xl will-change-transform" />
      <div className="polished-sweep absolute left-[-20%] top-0 h-full w-[40%] skew-x-12 bg-gradient-to-r from-transparent via-soft-ivory/10 to-transparent opacity-0 will-change-transform" />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="polished-stage relative mx-auto flex h-[42vh] w-full max-w-md items-center justify-center md:h-[55vh] preserve-3d will-change-transform">
          <div className="polished-diamond relative w-[min(65%,260px)] md:w-[min(75%,320px)] will-change-transform">
            <PolishedDiamond className="h-auto w-full drop-shadow-[0_20px_50px_rgba(255,255,255,0.08)]" />
            <span className="sr-only">
              A precisely faceted polished diamond catching controlled white light
            </span>
          </div>
        </div>

        <div className="scene-copy polished-copy mx-auto text-center opacity-0 md:mx-0 md:text-left will-change-transform">
          <p className="scene-eyebrow mb-4">Chapter II</p>
          <h2 className="scene-headline mb-5 text-balance">
            Precision Reveals the Light Within
          </h2>
          <p className="scene-body text-balance">
            Each facet is refined with purpose, allowing light, clarity, and
            brilliance to emerge.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PolishedDiamondScene
