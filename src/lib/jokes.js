const API_BASE = 'https://v2.jokeapi.dev/joke'
const BLACKLIST = 'nsfw,racist,sexist,explicit,religious,political'

export const CATEGORIES = ['Any', 'Programming', 'Misc', 'Pun', 'Spooky']

export async function fetchJokes(category = 'Any', count = 10) {
  const url = `${API_BASE}/${encodeURIComponent(category)}?blacklistFlags=${BLACKLIST}&amount=${count}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Joke API error (${res.status})`)
  const data = await res.json()
  if (data.error) throw new Error(data.message || 'Could not load jokes')
  return (data.jokes || []).map(normalizeJoke)
}

function normalizeJoke(raw) {
  return {
    id: `${raw.category}-${raw.id}`,
    category: raw.category,
    type: raw.type,
    setup: raw.type === 'twopart' ? raw.setup : null,
    delivery: raw.type === 'twopart' ? raw.delivery : raw.joke,
  }
}

export function jokeToText(joke) {
  return joke.setup ? `${joke.setup} — ${joke.delivery}` : joke.delivery
}

export async function shareJoke(joke) {
  const text = jokeToText(joke)
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return 'shared'
    } catch {
      return 'cancelled'
    }
  }
  await navigator.clipboard.writeText(text)
  return 'copied'
}
