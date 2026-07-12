import { FinishedRing, GoldRingBand, PolishedDiamond } from './JewelryVisuals'

export function DiamondSettingScene() {
  return (
    <div
      className="scene scene-setting absolute inset-0 flex items-center justify-center px-6 md:px-12"
      data-scene="setting"
      aria-hidden="true"
    >
      <div className="setting-lines absolute left-1/2 top-1/2 h-[50vmin] w-[50vmin] -translate-x-1/2 -translate-y-1/2 opacity-0">
        <div className="absolute inset-[18%] rounded-full border border-champagne/20" />
        <div className="absolute inset-[28%] rounded-full border border-champagne/10" />
      </div>

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-8 md:gap-12">
        <div className="setting-stage relative flex h-[38vh] w-full max-w-lg items-center justify-center preserve-3d md:h-[48vh] will-change-transform">
          <div className="setting-diamond absolute top-[8%] z-20 w-[min(28%,110px)] will-change-transform">
            <PolishedDiamond className="h-auto w-full" />
          </div>
          <div className="setting-band absolute bottom-[12%] z-10 w-[min(70%,280px)] will-change-transform">
            <GoldRingBand className="h-auto w-full" />
          </div>
          <div className="setting-united absolute inset-0 z-30 flex items-center justify-center opacity-0 will-change-transform">
            <FinishedRing className="w-[min(65%,260px)] drop-shadow-[0_20px_50px_rgba(196,165,116,0.15)]" />
          </div>
          <span className="sr-only">
            Polished diamond settling into a gold ring setting
          </span>
        </div>

        <div className="scene-copy setting-copy mx-auto max-w-xl text-center opacity-0 will-change-transform">
          <p className="scene-eyebrow mb-4">Chapter IV</p>
          <h2 className="scene-headline mb-5 text-balance">
            Two Rare Elements. One Timeless Form.
          </h2>
          <p className="scene-body text-balance">
            Diamond and gold come together through proportion, precision, and
            restraint.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DiamondSettingScene
