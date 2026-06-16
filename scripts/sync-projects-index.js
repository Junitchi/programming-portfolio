/**
 * Scans public/projects/ for subfolders and:
 *  - writes public/projects/_index.json (project slugs)
 *  - writes public/projects/<slug>/_images.json (image filenames in that folder)
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

const projectsDir = path.join(__dirname, '..', 'public', 'projects')
const indexPath = path.join(projectsDir, '_index.json')

if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir, { recursive: true })
}

const slugs = fs
  .readdirSync(projectsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) => !name.startsWith('.'))
  .sort()

fs.writeFileSync(indexPath, JSON.stringify({ projects: slugs }, null, 2))
console.log(`[sync-projects-index] Wrote ${slugs.length} project folder(s) to ${path.relative(process.cwd(), indexPath)}`)

for (const slug of slugs) {
  const dir = path.join(projectsDir, slug)
  const images = listImagesInFolder(dir)
  const manifestPath = path.join(dir, '_images.json')
  fs.writeFileSync(manifestPath, JSON.stringify({ images }, null, 2))
  console.log(`[sync-projects-index]   ${slug}/_images.json (${images.length} image(s))`)
}

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
