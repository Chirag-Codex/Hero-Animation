/**
 * Headline
 * Splits text into individual letter <span>s for:
 *   1. GSAP intro stagger (y: 30→0, opacity 0→1)
 *   2. clip-path on the wrapper div reveals them as car passes
 *
 * Accessibility: <h1> has aria-label; letter spans are aria-hidden.
 */
const Headline = ({ text = 'WELCOME ITZFIZZ', letterRefs }) => {
  const chars = text.split('')

  return (
    <h1
      className="headline"
      aria-label={text}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="letter"
          aria-hidden="true"
          ref={el => {
            if (letterRefs) letterRefs.current[i] = el
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  )
}

export default Headline
