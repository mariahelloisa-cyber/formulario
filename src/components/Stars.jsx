export function Stars({ value, max = 5, size = 18 }) {
  return (
    <span className="stars" style={{ fontSize: size }}>
      {'★'.repeat(value)}<span className="star-empty">{'★'.repeat(max - value)}</span>
    </span>
  )
}

export function StarPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            fontSize: 36,
            background: 'none',
            border: 'none',
            color: n <= value ? '#EF9F27' : '#ddd',
            cursor: 'pointer',
            transition: 'color 0.1s, transform 0.1s',
            padding: 0,
            lineHeight: 1,
          }}
          onMouseEnter={e => (e.target.style.transform = 'scale(1.15)')}
          onMouseLeave={e => (e.target.style.transform = 'scale(1)')}
          aria-label={`${n} estrelas`}
        >★</button>
      ))}
    </div>
  )
}

export const LABELS = ['', 'Muito ruim', 'Ruim', 'Regular', 'Bom', 'Excelente!']
