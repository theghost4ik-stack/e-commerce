const PREFIX = 'shop_'

export function loadState(name, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + name)
    if (raw === null) {
      return fallback
    }
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...fallback, ...parsed }
    }
    return fallback
  } catch (error) {
    return fallback
  }
}

export function saveState(name, value) {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(value))
  } catch (error) {
    return
  }
}
