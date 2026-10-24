export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <div className="filter-row" role="group" aria-label="Joke category">
      {categories.map((cat) => (
        <button
          key={cat}
          className={`chip ${cat === selected ? 'chip-active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
