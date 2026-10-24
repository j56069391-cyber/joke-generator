import { jokeToText, shareJoke } from '../lib/jokes.js'

export default function JokeCard({ joke, isFavorite, onToggleFavorite, onShared }) {
  const handleShare = async () => {
    const result = await shareJoke(joke)
    if (onShared) onShared(result)
  }

  return (
    <article className="joke-card">
      <span className="joke-category">{joke.category}</span>
      {joke.setup ? (
        <div className="joke-body">
          <p className="joke-setup">{joke.setup}</p>
          <p className="joke-delivery">{joke.delivery}</p>
        </div>
      ) : (
        <p className="joke-body">{joke.delivery}</p>
      )}
      <div className="joke-actions">
        <button
          className={`icon-btn ${isFavorite ? 'icon-btn-active' : ''}`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={() => onToggleFavorite(joke)}
        >
          {isFavorite ? '★' : '☆'}
        </button>
        <button className="icon-btn" title={jokeToText(joke)} aria-label="Share joke" onClick={handleShare}>
          ↗
        </button>
      </div>
    </article>
  )
}
