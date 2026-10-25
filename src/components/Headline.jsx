
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
