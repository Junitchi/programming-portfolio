import {
  DEFAULT_THEME,
  THEMES,
  THEME_IDS,
  THEME_STORAGE_KEY,
  ACCENT_STORAGE_KEY,
  FIRST_VISIT_KEY
} from '@/constants/themes'

function getThemeMeta(themeId) {
  return THEMES.find((t) => t.id === themeId) || THEMES.find((t) => t.id === DEFAULT_THEME)
}

/**
 * Read the persisted theme id (falls back to DEFAULT_THEME).
 */
export function getStoredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && THEME_IDS.includes(stored)) return stored
  } catch (e) {
    /* localStorage unavailable */
  }
  return DEFAULT_THEME
}

/**
 * Whether the user has completed first-visit theme selection.
 */
export function hasPickedTheme() {
  try {
    return localStorage.getItem(FIRST_VISIT_KEY) === '1'
  } catch (e) {
    return false
  }
}

/**
 * Mark first-visit theme selection as complete.
 */
export function markThemePicked() {
  try {
    localStorage.setItem(FIRST_VISIT_KEY, '1')
  } catch (e) {
    /* ignore */
  }
}

/**
 * Set the active theme by writing `html[data-theme]` and syncing Bootstrap mode.
 */
export function applyTheme(themeId) {
  const id = THEME_IDS.includes(themeId) ? themeId : DEFAULT_THEME
  const meta = getThemeMeta(id)
  const root = document.documentElement

  root.setAttribute('data-theme', id)
  root.setAttribute('data-bs-theme', meta.mode)

  try {
    localStorage.setItem(THEME_STORAGE_KEY, id)
  } catch (e) {
    /* ignore persistence failures */
  }
  return id
}

/**
 * Override --vido-accent at runtime. Pass falsy to clear and use theme accent.
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

export function getThemeAccent(themeId) {
  return getThemeMeta(themeId).accent
}

export function getThemeMode(themeId) {
  return getThemeMeta(themeId).mode
}
