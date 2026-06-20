/**
 * Scans public/projects/ and public/highlights/ for subfolders and:
 *  - writes <dir>/_index.json (folder slugs)
 *  - writes <dir>/<slug>/_images.json (image filenames in that folder)
 *
 * Browsers cannot list directories at runtime; the manifest enables loading all images without
 * listing them in project.json.
 */
const fs = require('fs')
const path = require('path')

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp', '.ico'])

function listImagesInFolder (absDir) {
  if (!fs.existsSync(absDir)) return []
  return fs
    .readdirSync(absDir, { withFileTypes: true })
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => {
      const ext = path.extname(name).toLowerCase()
      return IMAGE_EXT.has(ext)
    })
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
}

function readExistingSlugs (indexPath, indexKey) {
  if (!fs.existsSync(indexPath)) return []
  try {
    const data = JSON.parse(fs.readFileSync(indexPath, 'utf8'))
    const slugs = data[indexKey]
    return Array.isArray(slugs) ? slugs : []
  } catch {
    return []
  }
}

/** Keep existing order; drop missing folders; append new folders at the bottom. */
function mergeSlugOrder (existingSlugs, folderSlugs) {
  const folderSet = new Set(folderSlugs)
  const merged = []
  const seen = new Set()

  for (const slug of existingSlugs) {
    if (typeof slug === 'string' && folderSet.has(slug) && !seen.has(slug)) {
      merged.push(slug)
      seen.add(slug)
    }
  }

  const newSlugs = folderSlugs
    .filter((slug) => !seen.has(slug))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

  return merged.concat(newSlugs)
}

function syncContentDir (contentDir, indexKey, label) {
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true })
  }

  const folderSlugs = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !name.startsWith('.'))

  const indexPath = path.join(contentDir, '_index.json')
  const existingSlugs = readExistingSlugs(indexPath, indexKey)
  const slugs = existingSlugs.length > 0
    ? mergeSlugOrder(existingSlugs, folderSlugs)
    : folderSlugs.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

  fs.writeFileSync(indexPath, JSON.stringify({ [indexKey]: slugs }, null, 2))
  console.log(
    `[sync-projects-index] Wrote ${slugs.length} ${label} folder(s) to ${path.relative(process.cwd(), indexPath)}`
  )

  for (const slug of folderSlugs) {
    const dir = path.join(contentDir, slug)
    const images = listImagesInFolder(dir)
    const manifestPath = path.join(dir, '_images.json')
    fs.writeFileSync(manifestPath, JSON.stringify({ images }, null, 2))
    console.log(`[sync-projects-index]   ${label}/${slug}/_images.json (${images.length} image(s))`)
  }
}

const publicDir = path.join(__dirname, '..', 'public')
syncContentDir(path.join(publicDir, 'projects'), 'projects', 'projects')
syncContentDir(path.join(publicDir, 'highlights'), 'highlights', 'highlights')

/**
 * Certificates: recursively scan public/certificates/ for .pdf files and write _manifest.json.
 * Title for each entry is the PDF filename without extension.
 */
function walkPdfFiles (dir, relPrefix = '') {
  const out = []
  if (!fs.existsSync(dir)) return out
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const ent of entries) {
    const rel = relPrefix ? `${relPrefix}/${ent.name}` : ent.name
    const abs = path.join(dir, ent.name)
    if (ent.isDirectory()) {
      if (!ent.name.startsWith('.')) {
        out.push(...walkPdfFiles(abs, rel))
      }
    } else if (ent.isFile() && path.extname(ent.name).toLowerCase() === '.pdf') {
      const title = path.basename(ent.name, path.extname(ent.name))
      out.push({
        relativePath: rel.replace(/\\/g, '/'),
        title
      })
    }
  }
  return out
}

const certificatesDir = path.join(__dirname, '..', 'public', 'certificates')
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true })
}
const certificates = walkPdfFiles(certificatesDir)
  .sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath, undefined, { sensitivity: 'base' })
  )
const certManifestPath = path.join(certificatesDir, '_manifest.json')
fs.writeFileSync(certManifestPath, JSON.stringify({ certificates }, null, 2))
console.log(
  `[sync-projects-index] Wrote ${certificates.length} certificate PDF(s) to ${path.relative(process.cwd(), certManifestPath)}`
)
