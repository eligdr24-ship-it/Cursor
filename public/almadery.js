(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  const form = document.getElementById("accessForm");
  const email = document.getElementById("email");
  const status = document.getElementById("emailStatus");

  function setStatus(message, type) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
  }

  function bindPrivateAccessForm() {
    if (!form || !email) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = email.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      if (!isValid) {
        email.setAttribute("aria-invalid", "true");
        setStatus("Please enter a valid email address to request private access.", "error");
        email.focus();
        return;
      }

      email.removeAttribute("aria-invalid");
      form.classList.add("is-loading");
      setStatus("Securing your private request...", "");

      window.setTimeout(function () {
        form.classList.remove("is-loading");
        setStatus("Thank you. Your private access request has been received.", "success");
        form.reset();
      }, 850);
    });
  }

  function revealStaticFallback() {
    document.body.classList.add("reduced-motion");
    document.querySelectorAll(".scene").forEach(function (scene) {
      scene.classList.add("is-visible");
    });
  }

  function initReducedMotionGsap() {
    if (!window.gsap || !window.ScrollTrigger) return;
    window.gsap.registerPlugin(window.ScrollTrigger);
    window.gsap.utils.toArray(".scene:not(.scene-intro)").forEach(function (scene) {
      window.gsap.fromTo(
        scene,
        { opacity: 0.72, scale: 0.985 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: scene,
            start: "top 72%",
            end: "top 35%",
            scrub: 0.6
          }
        }
      );
    });
  }

  function initCinematicTimeline() {
    if (!window.gsap || !window.ScrollTrigger) {
      revealStaticFallback();
      return;
    }

    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    const travel = isMobile ? 80 : 180;
    const deepTravel = isMobile ? 140 : 320;
    const rotateSoft = isMobile ? 3 : 8;
    const scenes = {
      intro: ".scene-intro",
      rough: ".scene-rough",
      polished: ".scene-polished",
      gold: ".scene-gold",
      setting: ".scene-setting",
      final: ".scene-final",
      brand: ".scene-brand"
    };

    gsap.set(".scene", { autoAlpha: 0, z: -deepTravel, scale: 0.92, filter: "blur(10px)" });
    gsap.set(scenes.intro, { autoAlpha: 1, z: 0, scale: 1, filter: "blur(0px)" });
    gsap.set(".intro-lockup", { autoAlpha: 0, y: 22, scale: 0.96 });
    gsap.set(".intro-light", { scale: 0.64, autoAlpha: 0.6 });
    gsap.set(".scene-copy", { autoAlpha: 0, y: 38 });
    gsap.set(".visual-stage", { autoAlpha: 0, z: -travel, rotateY: 0, rotateX: 0 });
    gsap.set(".rough-diamond.diamond-primary", { rotate: -10, scale: 0.82, z: -travel });
    gsap.set(".rough-diamond.diamond-secondary", { rotate: 16, scale: 0.8, z: -deepTravel });
    gsap.set(".polished-diamond", { scale: 0.76, rotate: 4, z: -deepTravel });
    gsap.set(".gold-band", { scale: 0.76, rotateX: 18, rotateZ: -7, z: -travel });
    gsap.set(".tool-one", { autoAlpha: 0.5, xPercent: -8, rotate: -18 });
    gsap.set(".setting-ring", { scale: 0.78, y: 44, rotateX: 13 });
    gsap.set(".setting-diamond", { scale: 0.72, y: -70, z: isMobile ? 60 : 180 });
    gsap.set(".finished-ring", { scale: 0.72, rotateY: -10, rotateX: 8 });
    gsap.set(".brand-reveal-card", { autoAlpha: 0, scale: 0.92, y: 28 });
    gsap.set(".brand-lockup", { clipPath: "inset(0 100% 0 0)" });
    gsap.set(".constructed-lines", { scaleX: 0 });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".story-space",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          gsap.set(".progress-line span", { height: (self.progress * 100).toFixed(2) + "%" });
        }
      }
    });

    tl.to(".intro-lockup", { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out" }, 0)
      .to(".intro-light", { scale: 1, autoAlpha: 0.9, duration: 0.7 }, 0)
      .to(".scroll-cue", { autoAlpha: 0, y: 24, duration: 0.22 }, 0.52)
      .to(scenes.intro, { autoAlpha: 0, z: deepTravel, scale: 1.18, filter: "blur(14px)", duration: 0.55 }, 0.7);

    enterScene(tl, scenes.rough, 0.9);
    tl.to(".scene-rough .visual-stage", { autoAlpha: 1, z: 0, rotateY: rotateSoft * -1, duration: 0.5 }, 0.96)
      .to(".scene-rough .scene-copy", { autoAlpha: 1, y: 0, duration: 0.46 }, 1.06)
      .to(".rough-diamond.diamond-primary", { scale: 1.06, rotate: 5, z: isMobile ? 20 : 120, duration: 0.9 }, 1.1)
      .to(".rough-diamond.diamond-secondary", { scale: 0.95, rotate: -5, xPercent: -14, duration: 0.9 }, 1.12)
      .to(".light-blade", { autoAlpha: 0.58, xPercent: 230, duration: 0.75 }, 1.18)
      .to(".ambient-one", { x: isMobile ? 60 : 180, y: 40, autoAlpha: 0.34, duration: 0.9 }, 1.1)
      .to(scenes.rough, { autoAlpha: 0, z: deepTravel, scale: 1.14, filter: "blur(14px)", duration: 0.46 }, 1.85);

    enterScene(tl, scenes.polished, 2.02);
    tl.to(".scene-polished .visual-stage", { autoAlpha: 1, z: 0, rotateY: rotateSoft, duration: 0.5 }, 2.08)
      .to(".scene-polished .scene-copy", { autoAlpha: 1, y: 0, duration: 0.48 }, 2.18)
      .to(".polished-diamond", { scale: 1.08, rotate: -2, z: isMobile ? 30 : 160, duration: 0.9 }, 2.12)
      .to(".sharp-sweep", { xPercent: -360, autoAlpha: 0.68, duration: 0.72 }, 2.24)
      .to(".facet-aura", { scale: 1.16, autoAlpha: 0.88, duration: 0.75 }, 2.2)
      .to(scenes.polished, { autoAlpha: 0, z: deepTravel, scale: 1.1, filter: "blur(12px)", duration: 0.46 }, 2.95);

    enterScene(tl, scenes.gold, 3.12);
    tl.to(".scene-gold .visual-stage", { autoAlpha: 1, z: 0, rotateY: rotateSoft * -0.7, duration: 0.5 }, 3.18)
      .to(".scene-gold .scene-copy", { autoAlpha: 1, y: 0, duration: 0.48 }, 3.27)
      .to(".gold-band", { scale: 1.08, rotateX: 6, rotateZ: 2, z: isMobile ? 20 : 140, duration: 0.95 }, 3.2)
      .to(".tool-one", { autoAlpha: 0.88, xPercent: 10, rotate: -9, duration: 0.65 }, 3.28)
      .to(".warm-orbit", { rotate: 4, scale: 1.08, duration: 0.92 }, 3.24)
      .to(".ambient-two", { autoAlpha: 0.38, x: isMobile ? -35 : -140, y: -60, duration: 0.9 }, 3.2)
      .to(scenes.gold, { autoAlpha: 0, z: deepTravel, scale: 1.1, filter: "blur(12px)", duration: 0.46 }, 4.08);

    enterScene(tl, scenes.setting, 4.25);
    tl.to(".scene-setting .visual-stage", { autoAlpha: 1, z: 0, rotateY: rotateSoft * 0.8, duration: 0.5 }, 4.31)
      .to(".scene-setting .scene-copy", { autoAlpha: 1, y: 0, duration: 0.48 }, 4.4)
      .to(".setting-ring", { scale: 1.02, y: 0, rotateX: 2, duration: 0.78 }, 4.34)
      .to(".setting-diamond", { scale: 1, y: 26, z: 0, duration: 0.9, ease: "power1.inOut" }, 4.45)
      .to(".gold-lines", { rotate: 18, scale: 0.74, autoAlpha: 0.88, duration: 0.72 }, 4.44)
      .to(".union-light", { scale: 1.4, autoAlpha: 0.9, duration: 0.55 }, 4.78)
      .to(scenes.setting, { autoAlpha: 0, z: deepTravel, scale: 1.1, filter: "blur(12px)", duration: 0.46 }, 5.22);

    enterScene(tl, scenes.final, 5.38);
    tl.to(".scene-final .visual-stage", { autoAlpha: 1, z: 0, rotateY: rotateSoft * -0.5, duration: 0.5 }, 5.44)
      .to(".scene-final .scene-copy", { autoAlpha: 1, y: 0, duration: 0.48 }, 5.54)
      .to(".finished-ring", { scale: 1.04, rotateY: 8, rotateX: 0, z: isMobile ? 15 : 120, duration: 1.05 }, 5.45)
      .to(".gallery-plinth", { scale: 1.08, autoAlpha: 0.95, duration: 0.8 }, 5.48)
      .to(".macro-glint", { x: isMobile ? 44 : 110, y: isMobile ? -50 : -92, rotate: 42, autoAlpha: 0.9, duration: 0.65 }, 5.72)
      .to(".pin-shell", { backgroundColor: "#22190f", duration: 0.9 }, 5.42)
      .to(scenes.final, { autoAlpha: 0, z: deepTravel, scale: 1.08, filter: "blur(10px)", duration: 0.48 }, 6.42);

    enterScene(tl, scenes.brand, 6.58);
    tl.to(".brand-reveal-card", { autoAlpha: 1, scale: 1, y: 0, duration: 0.5 }, 6.68)
      .to(".constructed-lines", { scaleX: 1, duration: 0.46 }, 6.75)
      .to(".brand-lockup", { clipPath: "inset(0 0% 0 0)", duration: 0.62, ease: "power2.inOut" }, 6.92)
      .to(".scene-brand .chapter", { autoAlpha: 1, y: 0, duration: 0.24 }, 7.04)
      .to(".scene-brand h2", { autoAlpha: 1, y: 0, duration: 0.38 }, 7.12)
      .to(".brand-reveal-card", { scale: 1.02, duration: 0.55 }, 7.34);

    gsap.set(".private-access .access-card", { y: 32, autoAlpha: 0 });
    gsap.to(".private-access .access-card", {
      y: 0,
      autoAlpha: 1,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".private-access",
        start: "top 72%",
        once: true
      }
    });
  }

  function enterScene(tl, selector, at) {
    tl.to(selector, { autoAlpha: 1, z: 0, scale: 1, filter: "blur(0px)", duration: 0.38 }, at);
  }

  function init() {
    bindPrivateAccessForm();

    if (prefersReduced) {
      revealStaticFallback();
      initReducedMotionGsap();
      return;
    }

    initCinematicTimeline();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
