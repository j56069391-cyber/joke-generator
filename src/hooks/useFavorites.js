import { useEffect, useState } from 'react'

const STORAGE_KEY = 'joke-generator:favorites'

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(loadFavorites)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const isFavorite = (joke) => favorites.some((f) => f.id === joke?.id)

  const toggleFavorite = (joke) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === joke.id)
        ? prev.filter((f) => f.id !== joke.id)
        : [joke, ...prev]
    )
  }

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id))
  }

  return { favorites, isFavorite, toggleFavorite, removeFavorite }
}
