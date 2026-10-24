import { useCallback, useEffect, useState } from 'react'
import CategoryFilter from './components/CategoryFilter.jsx'
import JokeCard from './components/JokeCard.jsx'
import FavoritesPanel from './components/FavoritesPanel.jsx'
import { CATEGORIES, fetchJokes } from './lib/jokes.js'
import { useFavorites } from './hooks/useFavorites.js'

export default function App() {
  const [category, setCategory] = useState('Any')
  const [jokes, setJokes] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState(null)
  const { favorites, toggle, has } = useFavorites()

  const load = useCallback(async (cat) => {
    setStatus('loading')
    setError(null)
    try {
      const next = await fetchJokes(cat)
      setJokes(next)
      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load('Any')
  }, [load])

  const handleCategory = (cat) => {
    setCategory(cat)
    load(cat)
  }

  const handleShared = (result) => {
    setNotice(result === 'copied' ? 'Joke copied to clipboard' : null)
  }

  const loading = status === 'loading'
  const showGrid = jokes.length > 0

  return (
    <main className="page">
      <header className="header">
        <h1>Joke Generator</h1>
        <p className="tagline">Random jokes from the web — filter, favorite, share.</p>
      </header>

      <div className="toolbar">
        <CategoryFilter categories={CATEGORIES} selected={category} onSelect={handleCategory} />
        <button className="primary-btn" onClick={() => load(category)} disabled={loading}>
          {loading ? 'Loading…' : 'New jokes'}
        </button>
      </div>

      {notice && (
        <p className="notice" role="status">
          {notice}
        </p>
      )}

      {status === 'error' && (
        <div className="error" role="alert">
          <p>Couldn't load jokes: {error}</p>
          <button className="primary-btn" onClick={() => load(category)}>
            Try again
          </button>
        </div>
      )}

      {loading && <p className="empty">Fetching jokes…</p>}
      {!loading && status === 'ready' && !showGrid && (
        <p className="empty">No jokes found for “{category}” — try another category.</p>
      )}

      {showGrid && !loading && (
        <section>
          <h2>Jokes</h2>
          <div className="joke-grid">
            {jokes.map((joke) => (
              <JokeCard
                key={joke.id}
                joke={joke}
                isFavorite={has(joke.id)}
                onToggleFavorite={toggle}
                onShared={handleShared}
              />
            ))}
          </div>
        </section>
      )}

      <FavoritesPanel favorites={favorites} onToggleFavorite={toggle} />
    </main>
  )
}
