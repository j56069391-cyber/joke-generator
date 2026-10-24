const API_BASE = 'https://v2.jokeapi.dev/joke'
const BLACKLIST = 'nsfw,racist,sexist,explicit,religious,political'

export const CATEGORIES = ['Any', 'Programming', 'Misc', 'Pun', 'Spooky', 'Minecraft']

// JokeAPI has no Minecraft category, so this category is served from a
// curated local list. Ids are stable so favoriting a joke survives reloads.
const MINECRAFT_JOKES = [
  'Why did the creeper cross the road?|Because he was looking for a friend to blow up.',
  "What's a skeleton's least favorite room?|The living room.",
  'Why did the player sleep in the Nether?|It was a bed decision.',
  'How do trees access the internet in Minecraft?|They log in.',
  'What do you call a polite Enderman?|A gentleman.',
  'Why did the zombie stay inside all day?|He heard the sun was out.',
  "What's Steve's favorite type of music?|Block and roll.",
  'What do you call a Minecraft pig with a karate belt?|A pork chop.',
  'Why was the villager such a good trader?|He always had emerald intentions.',
  'Why did the slime fail the test?|It could not stick to the plan.',
  "Why don't minecarts ever get lost?|They always stay on track.",
  "Why can't you beat the Warden at hide-and-seek?|It hears everything.",
].map((raw, index) => {
  const [setup, delivery] = raw.split('|')
  return { id: `minecraft-${index}`, category: 'Minecraft', type: 'twopart', setup, delivery }
})

export async function fetchJokes(category = 'Any', count = 10) {
  if (category === 'Minecraft') return pickMinecraftJokes(count)
  const url = `${API_BASE}/${encodeURIComponent(category)}?blacklistFlags=${BLACKLIST}&amount=${count}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Joke API error (${res.status})`)
  const data = await res.json()
  if (data.error) throw new Error(data.message || 'Could not load jokes')
  return (data.jokes || []).map(normalizeJoke)
}

function pickMinecraftJokes(count) {
  return shuffle(MINECRAFT_JOKES).slice(0, count)
}

function shuffle(list) {
  const copy = [...list]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
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
