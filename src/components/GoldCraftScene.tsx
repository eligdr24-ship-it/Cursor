import { CraftTools, GoldRingBand } from './JewelryVisuals'

export function GoldCraftScene() {
  return (
    <div
      className="scene scene-gold absolute inset-0 flex items-center justify-center px-6 md:px-12"
      data-scene="gold"
      aria-hidden="true"
    >
      <div className="gold-warmth absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_55%_45%,rgba(154,123,79,0.14)_0%,rgba(10,10,10,0)_70%)] opacity-0 will-change-transform" />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="scene-copy gold-copy order-2 mx-auto text-center opacity-0 md:order-1 md:mx-0 md:text-left will-change-transform">
          <p className="scene-eyebrow mb-4">Chapter III</p>
          <h2 className="scene-headline mb-5 text-balance">
            Gold, Shaped by the Human Hand
          </h2>
          <p className="scene-body text-balance">
            Craftsmanship transforms precious material into form, balance, and
            lasting beauty.
          </p>
        </div>

        <div className="gold-stage order-1 relative mx-auto flex h-[42vh] w-full max-w-md flex-col items-center justify-center md:order-2 md:h-[55vh] preserve-3d will-change-transform">
          <div className="gold-tools mb-4 w-[70%] max-w-[220px] opacity-0 will-change-transform md:mb-6">
            <CraftTools className="h-auto w-full" />
          </div>
          <div className="gold-ring relative w-[min(75%,300px)] will-change-transform">
            <GoldRingBand className="h-auto w-full drop-shadow-[0_25px_40px_rgba(154,123,79,0.2)]" />
            <span className="sr-only">
              A gold ring band being shaped with refined artisan craftsmanship
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoldCraftScene
