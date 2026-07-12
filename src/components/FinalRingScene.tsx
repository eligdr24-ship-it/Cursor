import { FinishedRing } from './JewelryVisuals'

export function FinalRingScene() {
  return (
    <div
      className="scene scene-final absolute inset-0 flex items-center justify-center px-6 md:px-12"
      data-scene="final"
      aria-hidden="true"
    >
      <div className="final-backdrop absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_48%,#2a2620_0%,#141210_45%,#050505_100%)] opacity-0 will-change-transform" />
      <div className="final-spot absolute left-1/2 top-[40%] h-[min(50vw,380px)] w-[min(50vw,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(240,235,227,0.12)_0%,rgba(196,165,116,0.06)_40%,transparent_70%)] opacity-0 blur-2xl" />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="final-stage relative mx-auto flex h-[40vh] w-full max-w-md items-center justify-center md:h-[55vh] preserve-3d will-change-transform">
          <div className="final-pedestal absolute bottom-[18%] h-2 w-[55%] rounded-full bg-gradient-to-r from-transparent via-stone/20 to-transparent blur-sm" />
          <div className="final-ring relative w-[min(70%,300px)] will-change-transform">
            <FinishedRing className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]" />
            <span className="sr-only">
              A finished gold engagement ring with a brilliant diamond, lit by a soft gallery spotlight
            </span>
          </div>
        </div>

        <div className="scene-copy final-copy mx-auto text-center opacity-0 md:mx-0 md:text-left will-change-transform">
          <p className="scene-eyebrow mb-4">Chapter V</p>
          <h2 className="scene-headline mb-5 text-balance">
            A Timeless Promise, Perfected
          </h2>
          <p className="scene-body text-balance">
            Created to hold a moment, express a promise, and endure beyond
            generations.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FinalRingScene
