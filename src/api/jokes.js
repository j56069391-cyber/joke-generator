const JOKE_API_BASE = 'https://v2.jokeapi.dev/joke'

export const CATEGORIES = [
  { id: 'Programming', label: 'Programming' },
  { id: 'Misc', label: 'Misc' },
  { id: 'Pun', label: 'Puns' },
  { id: 'Spooky', label: 'Spooky' },
  { id: 'Christmas', label: 'Christmas' },
]

export function formatJokeText(joke) {
  if (!joke) return ''
  if (joke.type === 'twopart') {
    return `${joke.setup}\n\n${joke.delivery}`
  }
  return joke.joke || ''
}

export async function fetchRandomJoke(categories = []) {
  const category = categories.length > 0 ? categories.join(',') : 'Any'
  const response = await fetch(`${JOKE_API_BASE}/${category}?safe-mode`)
  if (!response.ok) {
    throw new Error(`Joke API responded with status ${response.status}`)
  }
  const data = await response.json()
  if (data.error) {
    throw new Error('The Joke API returned an error. Try again in a moment.')
  }
  return data
}
