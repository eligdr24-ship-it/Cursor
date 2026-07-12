import { RoughDiamond } from './JewelryVisuals'

export function RoughDiamondScene() {
  return (
    <div
      className="scene scene-rough absolute inset-0 flex items-center justify-center px-6 md:px-12"
      data-scene="rough"
      aria-hidden="true"
    >
      <div className="rough-beam light-beam" />

      <div className="relative z-10 grid w-full max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="scene-copy rough-copy order-2 mx-auto text-center opacity-0 md:order-1 md:mx-0 md:text-left will-change-transform">
          <p className="scene-eyebrow mb-4">Chapter I</p>
          <h2 className="scene-headline mb-5 text-balance">
            Every Masterpiece Begins Untouched
          </h2>
          <p className="scene-body text-balance">
            Before brilliance, there is possibility. A rare form shaped by nature
            and waiting to be revealed.
          </p>
        </div>

        <div className="rough-stage order-1 relative mx-auto flex h-[42vh] w-full max-w-md items-center justify-center md:order-2 md:h-[55vh] preserve-3d will-change-transform">
          <div className="rough-dust absolute inset-0 opacity-0">
            <span className="absolute left-[20%] top-[30%] h-1 w-1 rounded-full bg-soft-ivory/40" />
            <span className="absolute left-[70%] top-[25%] h-0.5 w-0.5 rounded-full bg-champagne/50" />
            <span className="absolute left-[40%] top-[60%] h-0.5 w-0.5 rounded-full bg-soft-ivory/30" />
            <span className="absolute left-[55%] top-[45%] h-1 w-1 rounded-full bg-muted-beige/30" />
            <span className="absolute left-[25%] top-[70%] h-0.5 w-0.5 rounded-full bg-champagne/40" />
          </div>
          <div className="rough-diamond relative w-[min(70%,280px)] md:w-[min(80%,340px)] will-change-transform">
            <RoughDiamond className="h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.65)]" />
            <span className="sr-only">
              A rough, uncut diamond emerging from darkness with natural mineral texture
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoughDiamondScene
