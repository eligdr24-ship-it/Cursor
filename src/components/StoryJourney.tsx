import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IntroScene } from './IntroScene'
import { RoughDiamondScene } from './RoughDiamondScene'
import { PolishedDiamondScene } from './PolishedDiamondScene'
import { GoldCraftScene } from './GoldCraftScene'
import { DiamondSettingScene } from './DiamondSettingScene'
import { FinalRingScene } from './FinalRingScene'
import { BrandRevealScene } from './BrandRevealScene'

gsap.registerPlugin(ScrollTrigger)

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function isMobileViewport() {
  return window.matchMedia('(max-width: 768px)').matches
}

export function StoryJourney() {
  const pinRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const pin = pinRef.current
    const viewport = viewportRef.current
    if (!pin || !viewport) return

    const ctx = gsap.context(() => {
      const reduced = prefersReducedMotion()
      const mobile = isMobileViewport()
      const depthScale = mobile ? 0.45 : 1

      // Initial hidden states for all scenes except intro setup
      gsap.set('.scene-rough, .scene-polished, .scene-gold, .scene-setting, .scene-final, .scene-brand', {
        autoAlpha: 0,
      })
      gsap.set('.scene-intro', { autoAlpha: 1 })
      gsap.set('.intro-logo, .intro-scroll, .intro-light', { autoAlpha: 0 })
      gsap.set('.intro-scroll-line', { scaleY: 0, transformOrigin: 'top center' })
      gsap.set(
        '.rough-diamond, .polished-diamond, .gold-ring, .final-ring, .brand-content, .rough-stage, .polished-stage, .gold-stage, .setting-stage, .final-stage',
        {
          transformPerspective: mobile ? 800 : 1200,
          force3D: true,
        },
      )

      // Opening entrance plays on load — not gated behind scroll.
      const introEntrance = gsap.timeline({ defaults: { ease: 'power2.out' } })
      introEntrance.fromTo(
        '.intro-light',
        { autoAlpha: 0, scale: 0.55 },
        { autoAlpha: 1, scale: 1, duration: reduced ? 0.6 : 1.8 },
        0,
      )
      introEntrance.fromTo(
        '.intro-logo',
        { autoAlpha: 0, y: 24, filter: reduced ? 'none' : 'blur(10px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: reduced ? 0.5 : 1.6,
        },
        0.25,
      )
      introEntrance.fromTo(
        '.intro-scroll',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 0.75, y: 0, duration: 0.7 },
        1.1,
      )
      introEntrance.fromTo(
        '.intro-scroll-line',
        { scaleY: 0 },
        { scaleY: 1, duration: 0.8, transformOrigin: 'top center' },
        1.3,
      )

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * (reduced ? 4.5 : mobile ? 6.5 : 8.5))}`,
          pin: true,
          scrub: reduced ? 0.4 : mobile ? 0.8 : 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Brief hold, then leave the opening screen
      tl.to({}, { duration: 0.35 })
      tl.to(
        '.intro-logo, .intro-scroll, .intro-light',
        { autoAlpha: 0, y: -20, filter: reduced ? 'none' : 'blur(6px)', duration: 0.8 },
      )
      tl.to('.scene-intro', { autoAlpha: 0, duration: 0.4 }, '<0.3')

      // Atmosphere shift helper
      const setAtmosphere = (bg: string, at = '>') => {
        tl.to(viewport, { backgroundColor: bg, duration: 1.2 }, at)
      }

      // ── Chapter 1: Rough Diamond ───────────────────────────
      setAtmosphere('#050505', '-=0.2')
      tl.fromTo(
        '.scene-rough',
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.6 },
        '-=0.3',
      )
      tl.fromTo(
        '.rough-diamond',
        {
          autoAlpha: 0,
          scale: reduced ? 0.92 : 0.55,
          z: reduced ? 0 : -400 * depthScale,
          filter: 'blur(12px)',
          rotateY: reduced ? 0 : -18,
          rotateX: reduced ? 0 : 8,
        },
        {
          autoAlpha: 1,
          scale: 1,
          z: 0,
          filter: 'blur(0px)',
          rotateY: reduced ? 0 : 8,
          rotateX: 0,
          duration: 2.2,
        },
        '-=0.4',
      )
      tl.fromTo(
        '.rough-copy',
        { autoAlpha: 0, y: 40, z: reduced ? 0 : -120 * depthScale },
        { autoAlpha: 1, y: 0, z: 0, duration: 1.2 },
        '-=1.4',
      )
      tl.fromTo('.rough-beam', { autoAlpha: 0 }, { autoAlpha: 0.7, duration: 1 }, '-=1.2')
      tl.fromTo('.rough-dust', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, '-=0.8')
      tl.to('.rough-diamond', {
        rotateY: reduced ? 0 : 22,
        scale: reduced ? 1.02 : 1.08,
        duration: 1.4,
      })
      tl.to({}, { duration: 0.4 })

      // Exit rough
      tl.to('.rough-copy', { autoAlpha: 0, y: -30, filter: 'blur(4px)', duration: 0.7 })
      tl.to(
        '.rough-diamond',
        {
          autoAlpha: 0,
          scale: reduced ? 1.1 : 1.45,
          z: reduced ? 0 : 200 * depthScale,
          filter: 'blur(10px)',
          duration: 1,
        },
        '-=0.4',
      )
      tl.to('.rough-beam, .rough-dust', { autoAlpha: 0, duration: 0.5 }, '<')
      tl.to('.scene-rough', { autoAlpha: 0, duration: 0.4 }, '-=0.2')

      // ── Chapter 2: Polished Diamond ────────────────────────
      setAtmosphere('#0c0c0e', '-=0.3')
      tl.fromTo('.scene-polished', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.2')
      tl.fromTo(
        '.polished-diamond',
        {
          autoAlpha: 0,
          scale: reduced ? 0.9 : 0.4,
          z: reduced ? 0 : -500 * depthScale,
          filter: 'blur(14px)',
          rotateZ: reduced ? 0 : -12,
        },
        {
          autoAlpha: 1,
          scale: 1,
          z: 0,
          filter: 'blur(0px)',
          rotateZ: 0,
          duration: 2,
        },
        '-=0.3',
      )
      tl.fromTo('.polished-glow', { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 1.4 }, '-=1.6')
      tl.fromTo(
        '.polished-copy',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 1.1 },
        '-=1.2',
      )
      tl.fromTo(
        '.polished-sweep',
        { autoAlpha: 0, x: '-30%' },
        { autoAlpha: 1, x: '130%', duration: 1.6, ease: 'power1.inOut' },
        '-=0.6',
      )
      tl.to('.polished-diamond', {
        rotateY: reduced ? 0 : 15,
        scale: 1.06,
        duration: 1.2,
      })
      tl.to({}, { duration: 0.35 })

      tl.to('.polished-copy', { autoAlpha: 0, y: -24, duration: 0.6 })
      tl.to(
        '.polished-diamond, .polished-glow',
        {
          autoAlpha: 0,
          x: reduced ? 0 : '18%',
          scale: 0.85,
          filter: 'blur(8px)',
          duration: 0.9,
        },
        '-=0.3',
      )
      tl.to('.scene-polished', { autoAlpha: 0, duration: 0.35 }, '-=0.2')

      // ── Chapter 3: Gold Craft ──────────────────────────────
      setAtmosphere('#100e0b', '-=0.25')
      tl.fromTo('.scene-gold', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.15')
      tl.fromTo('.gold-warmth', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, '-=0.3')
      tl.fromTo(
        '.gold-ring',
        {
          autoAlpha: 0,
          scale: reduced ? 0.92 : 0.6,
          z: reduced ? 0 : -320 * depthScale,
          rotateX: reduced ? 0 : 25,
          filter: 'blur(8px)',
        },
        {
          autoAlpha: 1,
          scale: 1,
          z: 0,
          rotateX: reduced ? 0 : 8,
          filter: 'blur(0px)',
          duration: 1.8,
        },
        '-=0.4',
      )
      tl.fromTo(
        '.gold-tools',
        { autoAlpha: 0, y: 20 },
        { autoAlpha: mobile ? 0 : 0.7, y: 0, duration: 1 },
        '-=1.2',
      )
      tl.fromTo(
        '.gold-copy',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 1.1 },
        '-=1.2',
      )
      tl.to('.gold-ring', {
        rotateY: reduced ? 0 : -18,
        rotateX: reduced ? 0 : 4,
        duration: 1.3,
      })
      tl.to({}, { duration: 0.35 })

      tl.to('.gold-copy, .gold-tools', { autoAlpha: 0, y: -20, duration: 0.6 })
      tl.to(
        '.gold-ring',
        {
          autoAlpha: 0,
          scale: 0.9,
          y: 40,
          filter: 'blur(6px)',
          duration: 0.8,
        },
        '-=0.3',
      )
      tl.to('.gold-warmth', { autoAlpha: 0, duration: 0.5 }, '<')
      tl.to('.scene-gold', { autoAlpha: 0, duration: 0.35 }, '-=0.15')

      // ── Chapter 4: Setting ─────────────────────────────────
      setAtmosphere('#0d0c0a', '-=0.2')
      tl.fromTo('.scene-setting', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.1')
      tl.fromTo(
        '.setting-band',
        { autoAlpha: 0, y: 50, rotateX: reduced ? 0 : 20 },
        { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2 },
        '-=0.2',
      )
      tl.fromTo(
        '.setting-diamond',
        {
          autoAlpha: 0,
          y: reduced ? -40 : -120,
          scale: 0.7,
          filter: 'blur(6px)',
        },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 1.6,
        },
        '-=0.6',
      )
      tl.fromTo('.setting-lines', { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 1 }, '-=1.2')
      tl.fromTo(
        '.setting-copy',
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1 },
        '-=1',
      )
      // Union moment
      tl.to('.setting-diamond', { y: 36, scale: 0.55, duration: 1.1, ease: 'power2.inOut' })
      tl.to('.setting-band', { scale: 0.92, autoAlpha: 0.35, duration: 0.8 }, '<0.3')
      tl.to('.setting-diamond', { autoAlpha: 0, duration: 0.4 }, '-=0.2')
      tl.fromTo(
        '.setting-united',
        { autoAlpha: 0, scale: 0.88, filter: 'blur(4px)' },
        { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 1 },
        '-=0.2',
      )
      tl.to({}, { duration: 0.45 })

      tl.to('.setting-copy, .setting-lines', { autoAlpha: 0, duration: 0.6 })
      tl.to(
        '.setting-united',
        {
          autoAlpha: 0,
          scale: reduced ? 1.05 : 1.25,
          filter: 'blur(8px)',
          duration: 0.9,
        },
        '-=0.3',
      )
      tl.to('.scene-setting', { autoAlpha: 0, duration: 0.35 }, '-=0.2')

      // ── Chapter 5: Finished Ring ───────────────────────────
      setAtmosphere('#1a1713', '-=0.25')
      tl.fromTo('.scene-final', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.15')
      tl.fromTo('.final-backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, '-=0.3')
      tl.fromTo('.final-spot', { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 1.2 }, '-=1')
      tl.fromTo(
        '.final-ring',
        {
          autoAlpha: 0,
          scale: reduced ? 0.9 : 0.5,
          z: reduced ? 0 : -280 * depthScale,
          filter: 'blur(10px)',
          rotateY: reduced ? 0 : -25,
        },
        {
          autoAlpha: 1,
          scale: 1,
          z: 0,
          filter: 'blur(0px)',
          rotateY: 0,
          duration: 2,
        },
        '-=0.5',
      )
      tl.fromTo(
        '.final-copy',
        { autoAlpha: 0, y: 36 },
        { autoAlpha: 1, y: 0, duration: 1.1 },
        '-=1.2',
      )
      tl.to('.final-ring', {
        rotateY: reduced ? 0 : 20,
        rotateX: reduced ? 0 : -4,
        duration: 1.6,
      })
      tl.to({}, { duration: 0.5 })

      tl.to('.final-copy', { autoAlpha: 0, y: -24, duration: 0.7 })
      tl.to(
        '.final-ring, .final-spot',
        {
          autoAlpha: 0,
          scale: 1.15,
          filter: 'blur(12px)',
          duration: 1,
        },
        '-=0.3',
      )
      tl.to('.final-backdrop', { autoAlpha: 0, duration: 0.8 }, '-=0.6')
      tl.to('.scene-final', { autoAlpha: 0, duration: 0.4 }, '-=0.3')

      // ── Chapter 6: Brand Reveal ────────────────────────────
      setAtmosphere('#050505', '-=0.3')
      tl.fromTo('.scene-brand', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, '-=0.2')
      tl.fromTo(
        '.brand-mask',
        { autoAlpha: 0, scale: 0.6 },
        { autoAlpha: 1, scale: 1.2, duration: 1.6 },
        '-=0.2',
      )
      tl.fromTo(
        '.brand-content',
        {
          autoAlpha: 0,
          scale: reduced ? 0.96 : 0.85,
          z: reduced ? 0 : -200 * depthScale,
          filter: 'blur(8px)',
        },
        {
          autoAlpha: 1,
          scale: 1,
          z: 0,
          filter: 'blur(0px)',
          duration: 1.6,
        },
        '-=1',
      )
      tl.fromTo(
        '.brand-emblem-shine',
        { x: '-120%' },
        { x: '120%', duration: 1.4, ease: 'power2.inOut' },
        '-=0.6',
      )
      tl.to({}, { duration: 1.2 })

      // Soft hold before unpin into CTA
      tl.to('.brand-content', { autoAlpha: 0.95, duration: 0.4 })
    }, pin)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={pinRef} className="story-pin relative h-screen w-full">
      <div
        ref={viewportRef}
        className="story-viewport relative h-screen w-full overflow-hidden bg-obsidian perspective-scene"
        style={{ backgroundColor: '#050505' }}
      >
        <div className="grain-overlay" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />

        <IntroScene />
        <RoughDiamondScene />
        <PolishedDiamondScene />
        <GoldCraftScene />
        <DiamondSettingScene />
        <FinalRingScene />
        <BrandRevealScene />
      </div>
    </div>
  )
}

export default StoryJourney
