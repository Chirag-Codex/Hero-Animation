
const VARIANTS = {
  lime:   { background: '#dcff4f', color: '#111111' },
  dark:   { background: '#2e2e2e', color: '#ffffff' },
  sky:    { background: '#74d0ff', color: '#111111' },
  orange: { background: '#ee6a2b', color: '#111111' },
}

const StatCard = ({ value, label, variant = 'lime', style, innerRef }) => {
  const { background, color } = VARIANTS[variant] ?? VARIANTS.lime

  return (
    <article
      ref={innerRef}
      className="stat-card"
      style={{ background, color, ...style }}
      aria-label={`${value} — ${label}`}
    >
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </article>
  )
}

export default StatCard
