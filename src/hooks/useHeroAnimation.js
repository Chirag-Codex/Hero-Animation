import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const useHeroAnimation = ({
  heroRef,
  greenRef,
  headlineWrapRef,
  carRef,
  cardRefs,   
  letterRefs,
}) => {
  useEffect(() => {
    if (!heroRef.current) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

    
      function getCarW() {
        const isMobile = window.matchMedia('(max-width: 639px)').matches
        const carEl = carRef.current
        if (carEl) {
          const r = carEl.getBoundingClientRect()
          if (r.width > 0) return r.width
        }
       
        return window.innerHeight * (isMobile ? 0.20 : 0.25) * (602 / 274)
      }

    
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

    
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const startX = 0
        const carW = getCarW()
        const vw = window.innerWidth

     
        gsap.set(carRef.current, { x: startX, opacity: 1 })

     
        const initScaleX = Math.max(0, Math.min(1, (startX + 0.18 * carW) / vw))
        gsap.set(greenRef.current, { scaleX: initScaleX })
        gsap.set(headlineWrapRef.current, {
          clipPath: `inset(0 ${((1 - initScaleX) * 100).toFixed(3)}% 0 0)`,
        })

        if (cardRefs[0]?.current) gsap.set(cardRefs[0].current, { opacity: 0, y: 30, scale: 0.95 })
        if (cardRefs[1]?.current) gsap.set(cardRefs[1].current, { opacity: 0, y: 30, scale: 0.95 })
        if (cardRefs[2]?.current) gsap.set(cardRefs[2].current, { opacity: 0, y: -30, scale: 0.95 })
        if (cardRefs[3]?.current) gsap.set(cardRefs[3].current, { opacity: 0, y: -30, scale: 0.95 })

        if (letterRefs?.current) {
          letterRefs.current.filter(Boolean).forEach(l => gsap.set(l, { opacity: 1, y: 0 }))
        }

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

        if (cardRefs[0]?.current) {
          tl.to(
            cardRefs[0].current,
            { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.12 },
            0.12
          )
        }

     
        if (cardRefs[2]?.current) {
          tl.to(
            cardRefs[2].current,
            { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.12 },
            0.24
          )
        }


        if (cardRefs[1]?.current) {
          tl.to(
            cardRefs[1].current,
            { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.12 },
            0.38
          )
        }

      
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
  }, [])
}

export default useHeroAnimation
