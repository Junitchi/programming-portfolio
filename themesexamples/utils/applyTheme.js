import {
  DEFAULT_THEME,
  THEME_IDS,
  THEME_STORAGE_KEY,
  ACCENT_STORAGE_KEY
} from '@/constants/themes'

/**
 * Read the persisted theme id (falls back to DEFAULT_THEME).
 */
export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && THEME_IDS.includes(stored)) return stored
  } catch (e) {
    /* localStorage unavailable (SSR / sandbox) */
  }
  return DEFAULT_THEME
}

/**
 * Set the active theme by writing `html[data-theme]`. Persists the choice.
 */
export function applyTheme(themeId) {
  const id = THEME_IDS.includes(themeId) ? themeId : DEFAULT_THEME
  document.documentElement.setAttribute('data-theme', id)
  try {
    localStorage.setItem(THEME_STORAGE_KEY, id)
  } catch (e) {
    /* ignore persistence failures */
  }
  return id
}

/**
 * White-label branding hook: override --vido-accent at runtime.
 * Pass a falsy value to clear the override and fall back to the theme accent.
 */
export function applyAccent(accent) {
  const root = document.documentElement
  if (accent) {
    root.style.setProperty('--vido-accent', accent)
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, accent)
    } catch (e) {
      /* ignore */
    }
  } else {
    root.style.removeProperty('--vido-accent')
    try {
      localStorage.removeItem(ACCENT_STORAGE_KEY)
    } catch (e) {
      /* ignore */
    }
  }
}

/**
 * Call once on boot, before paint, to set the initial theme + any saved accent.
 */
export function initTheme() {
  const theme = applyTheme(getStoredTheme())
  try {
    const accent = localStorage.getItem(ACCENT_STORAGE_KEY)
    if (accent) applyAccent(accent)
  } catch (e) {
    /* ignore */
  }
  return theme
}

/**
 * Toggle TV / large-display density mode via html[data-medio-ui='tv'].
 */
export function setTvMode(enabled) {
  if (enabled) {
    document.documentElement.setAttribute('data-medio-ui', 'tv')
  } else {
    document.documentElement.removeAttribute('data-medio-ui')
  }
}
