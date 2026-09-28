import { formatJokeText } from './jokes'

export async function shareJoke(joke) {
  const text = formatJokeText(joke)
  if (!text) return 'failed'

  if (navigator.share) {
    try {
      await navigator.share({ title: 'Joke Generator', text })
      return 'shared'
    } catch (err) {
      if (err && err.name === 'AbortError') return 'cancelled'
      // Share can be blocked inside an embedded preview — fall back to clipboard
    }
  }

  try {
    await navigator.clipboard.writeText(text)
    return 'copied'
  } catch {
    // Clipboard API may also be restricted in cross-origin iframes
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    let copied = false
    try {
      copied = document.execCommand('copy')
    } catch {
      copied = false
    }
    textarea.remove()
    return copied ? 'copied' : 'failed'
  }
}
