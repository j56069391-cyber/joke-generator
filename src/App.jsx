import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchRandomJoke, formatJokeText } from './api/jokes'
import { shareJoke } from './api/share'
import { useFavorites } from './hooks/useFavorites'
import CategoryFilter from './components/CategoryFilter'
import JokeCard from './components/JokeCard'
import FavoritesList from './components/FavoritesList'

export default function App() {
  const [joke, setJoke] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])
  const [notice, setNotice] = useState(null)
  const [shareText, setShareText] = useState(null)
  const noticeTimer = useRef(null)
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites()

  const showNotice = useCallback((message) => {
    clearTimeout(noticeTimer.current)
    setNotice(message)
    noticeTimer.current = setTimeout(() => setNotice(null), 2500)
  }, [])

  const getJoke = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setJoke(await fetchRandomJoke(categories))
    } catch (err) {
      setError(err.message || 'Something went wrong fetching a joke.')
    } finally {
      setLoading(false)
    }
  }, [categories])

  useEffect(() => {
    getJoke()
  }, [getJoke])

  const toggleCategory = (id) => {
    setCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const handleShare = useCallback(
    async (target) => {
      const result = await shareJoke(target)
      if (result === 'copied') showNotice('Joke copied to clipboard!')
      else if (result === 'shared') showNotice('Thanks for sharing!')
      else if (result === 'failed') setShareText(formatJokeText(target))
    },
    [showNotice]
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1>😂 Joke Generator</h1>
        <p className="subtitle">
          Fresh jokes, filtered your way. Save your favorites and share the laughs.
        </p>
      </header>

      <main>
        <div className="controls">
          <CategoryFilter selected={categories} onToggle={toggleCategory} />
          <button className="btn btn-primary btn-new" onClick={getJoke} disabled={loading}>
            {loading ? 'Fetching…' : '🎲 New joke'}
          </button>
        </div>

        <JokeCard
          key={joke?.id ?? 'empty'}
          joke={joke}
          loading={loading}
          error={error}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          onShare={handleShare}
          onRetry={getJoke}
        />

        <FavoritesList favorites={favorites} onRemove={removeFavorite} onShare={handleShare} />
      </main>

      <footer className="app-footer">
        Jokes courtesy of{' '}
        <a href="https://v2.jokeapi.dev" target="_blank" rel="noreferrer">
          JokeAPI
        </a>
      </footer>

      {notice && (
        <div className="notice" role="status" aria-live="polite">
          {notice}
        </div>
      )}

      {shareText && (
        <div className="share-fallback" data-testid="share-fallback">
          <div className="share-box">
            <p className="share-hint">One-tap sharing is blocked here — copy your joke from below:</p>
            <textarea
              className="share-text"
              readOnly
              value={shareText}
              ref={(el) => {
                if (el) {
                  el.focus()
                  el.select()
                }
              }}
            />
            <button className="btn" onClick={() => setShareText(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
