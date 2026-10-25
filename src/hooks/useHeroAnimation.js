import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * useHeroAnimation
 *
 * ─── SINGLE SCRUBBED MASTER TIMELINE ─────────────────────────────────────────
 *   ONE gsap.timeline({ scrollTrigger }) drives EVERYTHING from scroll progress.
 *   NO on-load intro timeline for cards.
 *
 *   Timeline duration = 1.0, so time position directly equals progress fraction (0 → 1).
 *
 *   1. Car movement (0 → 1):
 *      carX starts at 0 (left edge flush).
 *      carX ends at `window.innerWidth - 0.30 * carW`:
 *      At the end of scrolling, 70% of the car has passed off the right edge of
 *      the viewport, leaving 30% of the rear visible (matching the reference).
 *      greenEdgeX = carX + 0.18 × carW (18% under car body, no gap visible).
 *      scaleX = clamp(greenEdgeX / vw, 0, 1).
 *      headline clipPath = inset(0 (1 - scaleX)*100% 0 0).
 *
 *   2. Stat Cards (scrubbed, reversible):
 *      Order: 58% (lime, card0) → 23% (sky, card2) → 27% (dark, card1) → 40% (orange, card3)
 *      Entry points:
 *        - 58% (card0, top-left)     at 0.12 (duration 0.12)
 *        - 23% (card2, bottom-left)  at 0.24 (duration 0.12)
 *        - 27% (card1, top-right)    at 0.38 (duration 0.12)
 *        - 40% (card3, bottom-right) at 0.52 (duration 0.12)
 *      All 4 cards are fully visible by 0.64 and remain visible through 1.0.
 *      Scrolling in reverse animates them back out in exact reverse order to opacity 0.
 *
 * ─── PERFORMANCE & RELIABILITY ───────────────────────────────────────────────
 *   ✓ Only transform, opacity, and clip-path animated (zero layout reflows).
 *   ✓ Scoped to heroRef via gsap.context for React 18 StrictMode safety.
 *   ✓ invalidateOnRefresh: true ensures measurements update on window resize.
 */
const useHeroAnimation = ({
  heroRef,
  greenRef,
  headlineWrapRef,
  carRef,
  cardRefs,   // [card0=lime58, card1=dark27, card2=sky23, card3=orange40]
  letterRefs,
}) => {
  useEffect(() => {
    if (!heroRef.current) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      /* ── Helper: Measure rendered car width ──────────────────────────── */
      function getCarW() {
        const isMobile = window.matchMedia('(max-width: 639px)').matches
        const carEl = carRef.current
        if (carEl) {
          const r = carEl.getBoundingClientRect()
          if (r.width > 0) return r.width
        }
        // Fallback based on 602x274 aspect ratio
        return window.innerHeight * (isMobile ? 0.20 : 0.25) * (602 / 274)
      }

      /* ── Reduced-motion: show final state instantly ──────────────────── */
      mm.add('(prefers-reduced-motion: reduce)', () => {
        const cW = getCarW()
        const endX = window.innerWidth - 0.30 * cW
        const scaleX = Math.max(0, Math.min(1, (endX + 0.18 * cW) / window.innerWidth))
        gsap.set(headlineWrapRef.current, { clipPath: `inset(0 ${((1 - scaleX) * 100).toFixed(3)}% 0 0)` })
        gsap.set(greenRef.current, { scaleX })
        gsap.set(carRef.current, { x: endX, opacity: 1 })
        cardRefs.forEach(r => {
          if (r.current) gsap.set(r.current, { opacity: 1, y: 0, scale: 1 })
        })
        if (letterRefs?.current) {
          letterRefs.current.filter(Boolean).forEach(l => gsap.set(l, { opacity: 1, y: 0 }))
        }
      })

      /* ── Full scroll-driven animation ────────────────────────────────── */
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const startX = 0
        const carW = getCarW()
        const vw = window.innerWidth

        /* ── Initial state (progress 0) ────────────────────────────────── */
        // Car parked at left edge
        gsap.set(carRef.current, { x: startX, opacity: 1 })

        // Green sliver peeking out from under the car
        const initScaleX = Math.max(0, Math.min(1, (startX + 0.18 * carW) / vw))
        gsap.set(greenRef.current, { scaleX: initScaleX })
        gsap.set(headlineWrapRef.current, {
          clipPath: `inset(0 ${((1 - initScaleX) * 100).toFixed(3)}% 0 0)`,
        })

        // Cards initially hidden before first paint (no flash):
        // Top cards start shifted +30px down (slide up into place away from road)
        // Bottom cards start shifted -30px up (slide down into place away from road)
        if (cardRefs[0]?.current) gsap.set(cardRefs[0].current, { opacity: 0, y: 30, scale: 0.95 })
        if (cardRefs[1]?.current) gsap.set(cardRefs[1].current, { opacity: 0, y: 30, scale: 0.95 })
        if (cardRefs[2]?.current) gsap.set(cardRefs[2].current, { opacity: 0, y: -30, scale: 0.95 })
        if (cardRefs[3]?.current) gsap.set(cardRefs[3].current, { opacity: 0, y: -30, scale: 0.95 })

        // Headline letters
        if (letterRefs?.current) {
          letterRefs.current.filter(Boolean).forEach(l => gsap.set(l, { opacity: 1, y: 0 }))
        }

        /* ── Helper to sync green strip and headline mask ──────────────── */
        function updateGreenAndHeadline(currentCarX) {
          const currentVw = window.innerWidth
          const currentCarW = getCarW()
          const greenEdgeX = currentCarX + 0.18 * currentCarW
          const scaleX = Math.max(0, Math.min(1, greenEdgeX / currentVw))
          gsap.set(greenRef.current, { scaleX })
          gsap.set(headlineWrapRef.current, {
            clipPath: `inset(0 ${((1 - scaleX) * 100).toFixed(3)}% 0 0)`,
          })
        }

        /* ─────────────────────────────────────────────────────────────────
           MASTER SCRUBBED TIMELINE
           Driven by single ScrollTrigger across 250vh of scroll distance.
        ───────────────────────────────────────────────────────────────── */
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=250%',
            pin: true,
            pinSpacing: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,

            onLeave() {
              const max = ScrollTrigger.maxScroll(window)
              if (window.scrollY > max) {
                window.scrollTo({ top: max, behavior: 'instant' })
              }
            },

            onRefresh() {
              const currentCarX = gsap.getProperty(carRef.current, 'x') || startX
              updateGreenAndHeadline(currentCarX)
            },
          },
          onUpdate() {
            const currentCarX = gsap.getProperty(carRef.current, 'x')
            updateGreenAndHeadline(currentCarX)
          },
        })

        /* ── 1. Car movement (duration: 1.0, 0 → 1) ───────────────────────
           Stops when 70% of the car has passed off the right edge of the screen:
           visible width remaining = 0.30 * carW
           car.x = window.innerWidth - 0.30 * carW                             */
        tl.fromTo(
          carRef.current,
          { x: startX },
          {
            x: () => window.innerWidth - 0.30 * getCarW(),
            ease: 'none',
            duration: 1,
          },
          0
        )

        /* ── 2. Stat cards entry (scroll-driven, scrubbed) ────────────────
           cardRefs mapping:
             cardRefs[0]: lime 58% (top-left)
             cardRefs[1]: dark 27% (top-right)
             cardRefs[2]: sky 23% (bottom-left)
             cardRefs[3]: orange 40% (bottom-right)

           Entry order & trigger points (duration 0.12 each):
             1st: 58% (lime, card0)     at 0.12 (car near "WELCOM")
             2nd: 23% (sky, card2)      at 0.24 (car near "WELCOME")
             3rd: 27% (dark, card1)     at 0.38 (car near "WELCOME IT")
             4th: 40% (orange, card3)   at 0.52 (car near "WELCOME ITZFIZ")
        ───────────────────────────────────────────────────────────────── */

        // 1st: Lime 58% (top-left)
        if (cardRefs[0]?.current) {
          tl.to(
            cardRefs[0].current,
            { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.12 },
            0.12
          )
        }

        // 2nd: Sky 23% (bottom-left)
        if (cardRefs[2]?.current) {
          tl.to(
            cardRefs[2].current,
            { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.12 },
            0.24
          )
        }

        // 3rd: Dark 27% (top-right)
        if (cardRefs[1]?.current) {
          tl.to(
            cardRefs[1].current,
            { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.12 },
            0.38
          )
        }

        // 4th: Orange 40% (bottom-right)
        if (cardRefs[3]?.current) {
          tl.to(
            cardRefs[3].current,
            { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.12 },
            0.52
          )
        }
      })
    }, heroRef)

    return () => ctx.revert()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

export default useHeroAnimation
