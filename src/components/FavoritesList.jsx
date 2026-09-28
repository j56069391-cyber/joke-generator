import { formatJokeText } from '../api/jokes'

export default function FavoritesList({ favorites, onRemove, onShare }) {
  if (!favorites.length) {
    return null
  }

  return (
    <section className="favorites" data-testid="favorites">
      <h2>Your favorites ({favorites.length})</h2>
      <ul>
        {favorites.map((fav) => (
          <li key={fav.id} className="favorite-item">
            <span className="favorite-category">{fav.category}</span>
            <p>{formatJokeText(fav)}</p>
            <div className="favorite-actions">
              <button className="btn" onClick={() => onShare(fav)}>
                🔗 Share
              </button>
              <button className="btn" onClick={() => onRemove(fav.id)}>
                🗑️ Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
