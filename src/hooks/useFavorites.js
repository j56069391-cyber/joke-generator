import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'joke-generator-favorites'

function load() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggle = useCallback((joke) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === joke.id)
        ? prev.filter((f) => f.id !== joke.id)
        : [...prev, joke],
    )
  }, [])

  const has = useCallback((id) => favorites.some((f) => f.id === id), [favorites])

  return { favorites, toggle, has }
}
