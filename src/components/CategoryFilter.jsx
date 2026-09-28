import { CATEGORIES } from '../api/jokes'

export default function CategoryFilter({ selected, onToggle }) {
  return (
    <div className="category-filter" role="group" aria-label="Joke categories">
      {CATEGORIES.map((cat) => {
        const active = selected.includes(cat.id)
        return (
          <button
            key={cat.id}
            type="button"
            className={`chip ${active ? 'chip-active' : ''}`}
            aria-pressed={active}
            onClick={() => onToggle(cat.id)}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
