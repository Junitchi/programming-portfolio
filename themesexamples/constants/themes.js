/**
 * Built-in theme registry.
 * Each entry maps to an `html[data-theme='<id>']` block in styles/themes.css.
 * `mode` is informational (drives any JS that needs to know light vs dark).
 */
export const THEMES = [
  { id: 'default', label: 'Default Dark', mode: 'dark', accent: '#58a6ff' },
  { id: 'light', label: 'Light', mode: 'light', accent: '#0969da' },
  { id: 'oat', label: 'Oat', mode: 'light', accent: '#b5651d' },
  { id: 'slate', label: 'Slate', mode: 'dark', accent: '#6ea8fe' },
  { id: 'mint', label: 'Mint', mode: 'dark', accent: '#3fcaa0' },
  { id: 'lilac', label: 'Lilac', mode: 'dark', accent: '#b083f0' },
  { id: 'creator', label: 'Creator', mode: 'dark', accent: '#ff5fa2' },
  { id: 'family', label: 'Family', mode: 'light', accent: '#ff7a59' }
]

export const DEFAULT_THEME = 'default'

export const THEME_IDS = THEMES.map((t) => t.id)

export const THEME_STORAGE_KEY = 'medio.theme'
export const ACCENT_STORAGE_KEY = 'medio.accent'
