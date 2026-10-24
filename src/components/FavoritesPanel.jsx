import JokeCard from './JokeCard.jsx'

export default function FavoritesPanel({ favorites, onToggleFavorite }) {
  return (
    <section className="favorites">
      <h2>Favorites ({favorites.length})</h2>
      {favorites.length === 0 ? (
        <p className="empty">No favorites yet — tap the star on a joke to save it.</p>
      ) : (
        <div className="joke-grid">
          {favorites.map((joke) => (
            <JokeCard key={joke.id} joke={joke} isFavorite onToggleFavorite={onToggleFavorite} />
          ))}
        </div>
      )}
    </section>
  )
}
