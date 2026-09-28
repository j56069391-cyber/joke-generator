import { useState } from 'react'

export default function JokeCard({
  joke,
  loading,
  error,
  isFavorite,
  onToggleFavorite,
  onShare,
  onRetry,
}) {
  const [revealed, setRevealed] = useState(false)

  if (loading) {
    return (
      <article className="joke-card" data-testid="joke-card">
        <p className="joke-loading">Fetching a fresh joke…</p>
      </article>
    )
  }

  if (error) {
    return (
      <article className="joke-card" data-testid="joke-card">
        <p className="joke-error">{error}</p>
        <button className="btn btn-primary" onClick={onRetry}>
          Try again
        </button>
      </article>
    )
  }

  if (!joke) return null

  return (
    <article className="joke-card" data-testid="joke-card">
      <div className="joke-meta">
        <span className="badge">{joke.category}</span>
      </div>

      {joke.type === 'twopart' ? (
        <>
          <p className="joke-setup">{joke.setup}</p>
          {revealed ? (
            <p className="joke-delivery">{joke.delivery}</p>
          ) : (
            <button className="btn-reveal" onClick={() => setRevealed(true)}>
              Reveal punchline 😄
            </button>
          )}
        </>
      ) : (
        <p className="joke-single">{joke.joke}</p>
      )}

      <div className="joke-actions">
        <button
          className={`btn btn-favorite ${isFavorite(joke) ? 'btn-favorited' : ''}`}
          onClick={() => onToggleFavorite(joke)}
        >
          {isFavorite(joke) ? '❤️ Favorited' : '🤍 Favorite'}
        </button>
        <button className="btn" onClick={() => onShare(joke)}>
          🔗 Share
        </button>
      </div>
    </article>
  )
}
