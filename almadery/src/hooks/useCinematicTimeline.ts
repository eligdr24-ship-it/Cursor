import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type MotionOpts = {
  /** True Z-axis camera movement (desktop only). */
  depth: boolean;
  /** Blur-to-focus pulls on scene artwork (desktop only). */
  blur: boolean;
  /** Subtle object rotation. */
  rotate: boolean;
  /** prefers-reduced-motion: crossfades only. */
  reduced: boolean;
};

const SCENES = ["rough", "polished", "gold", "setting", "final", "reveal"] as const;

/**
 * One centralized master timeline drives the whole ALMADERY story.
 * The stage stays pinned while scroll progress plays the film:
 * intro -> rough diamond -> polished diamond -> gold craft ->
 * setting -> finished ring -> brand reveal.
 */
export function useCinematicTimeline(rootRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        full: "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        lite: "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const c = ctx.conditions as Record<string, boolean>;
        buildJourney(root, {
          depth: !!c.full,
          blur: !!c.full,
          rotate: !c.reduced,
          reduced: !!c.reduced,
        });
        buildStaticReveals(!!c.reduced);
      },
    );

    return () => mm.revert();
  }, [rootRef]);
}

function buildJourney(root: HTMLElement, o: MotionOpts) {
  const q = gsap.utils.selector(root);
  const S = (name: string, sel = "") => q(`[data-scene="${name}"] ${sel}`.trim());
  const scene = (name: string) => q(`[data-scene="${name}"]`);

  /* ---------- initial states ---------- */
  gsap.set(
    SCENES.flatMap((n) => scene(n)),
    { opacity: 0, visibility: "hidden" },
  );

  if (o.reduced) {
    // Story elements rest in their completed state; only crossfades remain.
    gsap.set(S("setting", "[data-prong]"), { strokeDashoffset: 0 });
  } else {
    gsap.set(S("gold", "[data-band-arc], [data-band-edge]"), { strokeDashoffset: 100 });
    gsap.set(S("setting", "[data-stone]"), { y: -104 });
    gsap.set(S("reveal", "[data-draw]"), { strokeDashoffset: 100 });
    gsap.set(S("reveal", "[data-reveal-word] text"), { attr: { "letter-spacing": 34 } });
  }

  /* ---------- entrance on load (not scroll-driven) ---------- */
  if (window.scrollY < window.innerHeight / 2) {
    const enter = gsap.timeline({ defaults: { ease: "power2.out" } });
    if (o.reduced) {
      enter.from(S("intro", "[data-intro-block], [data-intro-hint]"), {
        opacity: 0,
        duration: 1.4,
        stagger: 0.3,
      });
    } else {
      enter
        .from(S("intro", "[data-intro-light]"), { opacity: 0, scale: 0.6, duration: 2.2 }, 0)
        .from(
          S("intro", "[data-intro-emblem]"),
          { opacity: 0, scale: 0.86, y: 14, duration: 1.6 },
          0.35,
        )
        .from(S("intro", "[data-intro-word]"), { opacity: 0, y: 16, duration: 1.2 }, 1.0)
        .from(S("intro", "[data-intro-sub]"), { opacity: 0, y: 10, duration: 1.0 }, 1.35)
        .from(S("intro", "[data-intro-hint]"), { opacity: 0, duration: 1.0 }, 1.9);
    }
  }

  /* ---------- master scroll timeline ---------- */
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: () => "+=" + window.innerHeight * (o.reduced ? 7 : 10.5),
      scrub: o.reduced ? true : 0.9,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  const blurOf = (px: number) => (o.blur ? `blur(${px}px)` : "blur(0px)");

  /** Wake a scene right before it enters; put it to sleep after it exits. */
  const wake = (name: string, at: gsap.Position) =>
    tl.set(scene(name), { visibility: "visible", opacity: 1 }, at);
  const sleep = (name: string, at: gsap.Position) =>
    tl.set(scene(name), { visibility: "hidden" }, at);

  /** Typography emerging from distance. */
  const textIn = (name: string, at: gsap.Position) => {
    tl.fromTo(
      S(name, "[data-line]"),
      o.reduced ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.965 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.15, ease: "power2.out" },
      at,
    );
  };

  /** Artwork approaching the viewer out of darkness, pulling into focus. */
  const artIn = (name: string, at: gsap.Position, fromRotate = 0) => {
    tl.fromTo(
      S(name, "[data-art]"),
      o.reduced
        ? { opacity: 0 }
        : {
            opacity: 0,
            scale: o.depth ? 0.72 : 0.86,
            z: o.depth ? -620 : 0,
            rotation: o.rotate ? fromRotate : 0,
            filter: blurOf(9),
          },
      {
        opacity: 1,
        scale: 1,
        z: 0,
        rotation: 0,
        filter: "blur(0px)",
        duration: 1.5,
        ease: "power2.out",
      },
      at,
    );
  };

  /** The camera moves through and past the scene. */
  const sceneOut = (name: string, at: gsap.Position) => {
    tl.to(
      scene(name),
      o.reduced
        ? { opacity: 0, duration: 0.8, ease: "power1.inOut" }
        : {
            opacity: 0,
            scale: o.depth ? 1.32 : 1.12,
            z: o.depth ? 340 : 0,
            duration: 1.05,
            ease: "power2.in",
          },
      at,
    );
  };

  const backdrop = q("[data-backdrop]");
  const coolLight = q("[data-keylight-cool]");
  const warmLight = q("[data-keylight-warm]");

  /* ================= INTRO departs (0 – 1.7) ================= */
  tl.to(S("intro", "[data-intro-hint]"), { opacity: 0, duration: 0.35, ease: "power1.out" }, 0.05);
  tl.to(
    S("intro", "[data-intro-block]"),
    o.reduced
      ? { opacity: 0, duration: 1.0 }
      : { opacity: 0, scale: 1.16, z: o.depth ? 260 : 0, duration: 1.25, ease: "power2.in" },
    0.3,
  );
  tl.to(S("intro", "[data-intro-light]"), { opacity: 0, scale: 1.5, duration: 1.2 }, 0.4);
  sleep("intro", 1.7);

  /* ================= CHAPTER I — ROUGH (1.5 – 6.1) ================= */
  wake("rough", 1.4);
  tl.to(backdrop, { backgroundColor: "#0d0d10", duration: 1.2 }, 1.5);
  artIn("rough", 1.5, -9);
  tl.fromTo(
    S("rough", "[data-beam]"),
    { opacity: 0, scaleY: 0.25 },
    { opacity: 1, scaleY: 1, duration: 1.1, ease: "power2.out" },
    2.15,
  );
  textIn("rough", 2.5);
  if (o.rotate) {
    tl.to(S("rough", "[data-art] svg"), { rotation: 5, duration: 2.2, ease: "sine.inOut" }, 2.9);
  }
  if (!o.reduced) {
    tl.fromTo(
      S("rough", "[data-dust] span"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: -22, duration: 2.6, stagger: 0.12, ease: "sine.out" },
      2.2,
    );
    tl.to(S("rough", "[data-beam]"), { opacity: 0, duration: 0.7 }, 4.7);
  }
  sceneOut("rough", 5.0);
  sleep("rough", 6.15);

  /* ============ CHAPTER II — POLISHED (5.5 – 10.1) ============ */
  wake("polished", 5.4);
  tl.to(backdrop, { backgroundColor: "#101015", duration: 1.4 }, 5.5);
  tl.to(coolLight, { opacity: 1, duration: 1.6 }, 5.6);
  artIn("polished", 5.5, 7);
  textIn("polished", 6.5);
  if (!o.reduced) {
    tl.fromTo(
      S("polished", "[data-sweep]"),
      { xPercent: -160, opacity: 0 },
      {
        keyframes: [
          { opacity: 1, duration: 0.25 },
          { opacity: 0, duration: 0.3, delay: 0.75 },
        ],
        xPercent: 320,
        duration: 1.3,
        ease: "power1.inOut",
      },
      7.3,
    );
  }
  if (o.rotate) {
    tl.to(S("polished", "[data-art] svg"), { scale: 1.06, duration: 2.0, ease: "sine.inOut" }, 7.2);
  }
  tl.to(coolLight, { opacity: 0, duration: 1.0 }, 8.9);
  sceneOut("polished", 9.0);
  sleep("polished", 10.15);

  /* ============== CHAPTER III — GOLD (9.5 – 14.1) ============== */
  wake("gold", 9.4);
  tl.to(backdrop, { backgroundColor: "#14100a", duration: 1.5 }, 9.5);
  tl.to(warmLight, { opacity: 0.55, duration: 1.6 }, 9.6);
  artIn("gold", 9.5);
  if (!o.reduced) {
    tl.to(
      S("gold", "[data-band-arc]"),
      { strokeDashoffset: 0, duration: 2.3, ease: "power1.inOut" },
      10.3,
    );
    tl.to(
      S("gold", "[data-band-edge]"),
      { strokeDashoffset: 0, duration: 2.3, ease: "power1.inOut" },
      10.55,
    );
    tl.fromTo(
      S("gold", "[data-tool-tweezers]"),
      { x: 40, y: -34, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
      10.6,
    );
    tl.fromTo(
      S("gold", "[data-tool-file]"),
      { x: -30, y: 22, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration: 1.2, ease: "power2.out" },
      10.75,
    );
    tl.fromTo(
      S("gold", "[data-gold-dust] circle"),
      { opacity: 0 },
      { opacity: 1, duration: 1.4, stagger: 0.1 },
      10.9,
    );
  }
  textIn("gold", 10.5);
  sceneOut("gold", 13.0);
  sleep("gold", 14.15);

  /* ============ CHAPTER IV — SETTING (13.5 – 18.3) ============ */
  wake("setting", 13.4);
  tl.to(backdrop, { backgroundColor: "#191309", duration: 1.4 }, 13.5);
  artIn("setting", 13.5);
  textIn("setting", 14.4);
  if (!o.reduced) {
    // The diamond descends into the setting…
    tl.to(
      S("setting", "[data-stone]"),
      { y: 0, duration: 1.4, ease: "power2.inOut" },
      14.7,
    );
    // …and the prongs close around it.
    tl.to(
      S("setting", "[data-prong]"),
      { strokeDashoffset: 0, duration: 0.9, stagger: 0.1, ease: "power1.inOut" },
      16.0,
    );
    if (o.rotate) {
      tl.fromTo(
        S("setting", "[data-art] svg"),
        { rotation: -3 },
        { rotation: 0, duration: 2.4, ease: "sine.out" },
        14.7,
      );
    }
  }
  // The completed ring holds its place while the scene dissolves around it —
  // the identical ring in the final chapter takes over seamlessly.
  tl.to(scene("setting"), { opacity: 0, duration: 1.0, ease: "power1.inOut" }, 17.6);
  sleep("setting", 18.65);

  /* ============= CHAPTER V — FINAL RING (17.5 – 22.5) ============= */
  wake("final", 17.5);
  tl.to(warmLight, { opacity: 0, duration: 1.0 }, 17.5);
  // Darkness gives way to the warm gallery.
  tl.to(backdrop, { backgroundColor: "#e7dfcf", duration: 1.8, ease: "power1.inOut" }, 17.5);
  tl.fromTo(
    S("final", "[data-spot]"),
    { opacity: 0, scale: 0.7 },
    { opacity: 1, scale: 1, duration: 1.8, ease: "power2.out" },
    17.6,
  );
  tl.fromTo(
    S("final", "[data-art]"),
    { opacity: 0 },
    { opacity: 1, duration: 1.3, ease: "power1.inOut" },
    17.6,
  );
  textIn("final", 18.9);
  if (o.rotate) {
    // Starts from rest so the handover from the setting scene stays seamless.
    tl.to(S("final", "[data-art] svg"), { rotation: -2.5, duration: 3.0, ease: "sine.inOut" }, 19.0);
  }
  sceneOut("final", 21.4);
  sleep("final", 22.5);

  /* ============= CHAPTER VI — BRAND REVEAL (21.9 – 26) ============= */
  wake("reveal", 21.8);
  tl.to(backdrop, { backgroundColor: "#070708", duration: 1.6, ease: "power1.inOut" }, 21.9);
  if (o.reduced) {
    tl.fromTo(
      S("reveal", "[data-reveal-emblem], [data-reveal-word], [data-reveal-sub], [data-reveal-statement], [data-reveal-soon]"),
      { opacity: 0 },
      { opacity: 1, duration: 1.2, stagger: 0.35 },
      22.3,
    );
  } else {
    // The emblem constructs itself from gold lines.
    tl.fromTo(
      S("reveal", "[data-reveal-emblem]"),
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      22.3,
    );
    tl.to(
      S("reveal", "[data-draw]"),
      { strokeDashoffset: 0, duration: 1.9, stagger: 0.16, ease: "power1.inOut" },
      22.4,
    );
    // The wordmark settles out of wide tracking.
    tl.fromTo(
      S("reveal", "[data-reveal-word]"),
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 1.1, ease: "power2.out" },
      23.4,
    );
    tl.to(
      S("reveal", "[data-reveal-word] text"),
      { attr: { "letter-spacing": 17 }, duration: 1.3, ease: "power2.out" },
      23.4,
    );
    tl.fromTo(
      S("reveal", "[data-reveal-sub], [data-reveal-statement], [data-reveal-soon]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.9, stagger: 0.25, ease: "power2.out" },
      24.0,
    );
    tl.fromTo(
      S("reveal", "[data-sweep]"),
      { xPercent: -140, opacity: 0 },
      {
        keyframes: [
          { opacity: 1, duration: 0.3 },
          { opacity: 0, duration: 0.35, delay: 0.8 },
        ],
        xPercent: 500,
        duration: 1.45,
        ease: "power1.inOut",
      },
      24.6,
    );
  }
  // A quiet hold on the finished identity before the pin releases.
  tl.to({}, { duration: o.reduced ? 0.8 : 1.4 });
}

/** Gentle entrances for the calm sections after the film (form + footer). */
function buildStaticReveals(reduced: boolean) {
  gsap.utils.toArray<HTMLElement>("[data-fade-up]").forEach((el) => {
    gsap.fromTo(
      el,
      reduced ? { opacity: 0 } : { opacity: 0, y: 36 },
      {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      },
    );
  });
}
