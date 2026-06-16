# Project folders

Each **subfolder** of `public/projects/` is one project. The sync script `scripts/sync-projects-index.js` runs before dev/build and:

1. Writes `public/projects/_index.json` (every subfolder name = one project slug).
2. Writes `public/projects/<slug>/_images.json` listing **every image file** in that folder (by extension), sorted by filename.

The app loads `project.json` and merges in images from `_images.json` **unless** you set `media.images` yourself (see below).

Supported image extensions: **.png, .jpg, .jpeg, .gif, .webp, .svg, .bmp, .ico**

---

## `project.json` fields

All fields are optional unless noted. **If `title`, `subtitle`, `description`, or `links` are omitted, that section is hidden.**

| Field | Type | Purpose |
| --- | --- | --- |
| `title` | string | Card heading |
| `subtitle` | string | Muted line under the title |
| `description` | string | Body text (line breaks preserved) |
| `links` | array | Buttons below the description; see below |
| `media` | object | Layout options and optional image override; see below |

### `links`

Each item:

```json
{ "label": "GitHub", "url": "https://github.com/org/repo" }
```

Only items with non-empty `label` and `url` are shown. Use full URLs (including `https://`).

### `media`

| Field | Purpose |
| --- | --- |
| `images` | **Optional override.** Omit this key to use **all images from the folder** (via generated `_images.json`). If you set `images` to a list, only those files are used. Use `images: []` to show **no** images even when files exist. |
| `display` | How to show images. If omitted, the app picks a default (see below) |

#### Default `display` if omitted

- **0 images:** nothing to show (helper text in the card body).
- **1 image:** `single`.
- **2+ images:** `grid`.

#### `display` values

| Value | Behavior |
| --- | --- |
| `carousel` | Bootstrap carousel; optional `media.carousel` (below) |
| `grid` | Responsive grid; optional `media.grid` (below) |
| `stack` | Full-width images stacked vertically |
| `single` | First image only, centered |
| `masonry` | CSS column layout; optional `media.masonry` (below) |
| `filmstrip` | Horizontal scroll row; optional `media.filmstrip` (below) |

##### `media.carousel` (only for `display: "carousel"`)

| Field | Type | Default | Notes |
| --- | --- | --- | --- |
| `interval` | number | `5000` | Milliseconds between slides. Use `0` to disable autoplay. |
| `indicators` | boolean | `true` | Dots under the carousel |
| `controls` | boolean | `true` | Prev / next arrows |
| `ride` | boolean | `true` | `false` disables automatic initialization of autoplay |

##### `media.grid` (only for `display: "grid"`)

| Field | Type | Default |
| --- | --- | --- |
| `columns` | number (1–4) | `2` |

Maps to Bootstrap `row-cols-md-<columns>` (one column on extra-small screens).

##### `media.masonry` (only for `display: "masonry"`)

| Field | Type | Default |
| --- | --- | --- |
| `columns` | number | `2` |
| `gap` | string | `"0.5rem"` | Any valid CSS length |

##### `media.filmstrip` (only for `display: "filmstrip"`)

| Field | Type | Default |
| --- | --- | --- |
| `thumbHeight` | number or string | `140` | If number, treated as **px**; otherwise used as a CSS length (e.g. `"8rem"`). |

##### `media.single` (only useful for `display: "single"` or the default single-image mode)

| Field | Type | Default |
| --- | --- | --- |
| `maxHeight` | number or string | — | Max height of the image (`maxHeight: 400` → `400px`) |
| `objectFit` | string | `"contain"` | Passed to CSS `object-fit` |

When `display` is `single` but several filenames are in the effective list, only the **first** is shown.

---

## Workflow

1. Add a folder: `public/projects/my-app/`.
2. Add `project.json` and drop image files into that folder (same level as `project.json`).
3. Run `npm run serve` or `npm run build` (each runs the sync script first), or `npm run projects:index`, or `node scripts/sync-projects-index.js`.
4. The script refreshes `_index.json` and each `_images.json`. Reload the site.

If you add or remove images **without** restarting the dev server, run `npm run projects:index` so `_images.json` stays in sync.

---

## Example `project.json` (images from folder — no `images` key)

```json
{
  "title": "My app",
  "subtitle": "Vue 3 + AdminLTE",
  "description": "Short summary.\n\nSecond paragraph.",
  "links": [
    { "label": "Live demo", "url": "https://example.com" },
    { "label": "Source", "url": "https://github.com/me/my-app" }
  ],
  "media": {
    "display": "carousel",
    "carousel": { "interval": 5000, "indicators": true, "controls": true }
  }
}
```

## Override: only some files, or none

```json
"media": {
  "images": ["screenshot1.png", "screenshot2.png"]
}
```

```json
"media": {
  "images": []
}
```

The second example forces **no** images in the UI even if the folder contains files.
