const PAGE = {
  landscape: { widthIn: 11, heightIn: 8.5, widthPx: 1056, heightPx: 816 },
  portrait: { widthIn: 8.5, heightIn: 11, widthPx: 816, heightPx: 1056 }
}

const CANVAS_SCALE = 2

const COLOR_PROPS = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor'
]

function parseRgb (color) {
  const match = String(color).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!match) return null
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) }
}

function inlineResolvedColors (root) {
  const nodes = [root, ...root.querySelectorAll('*')]

  nodes.forEach((node) => {
    const computed = getComputedStyle(node)
    COLOR_PROPS.forEach((prop) => {
      const value = computed[prop]
      if (value && value !== 'rgba(0, 0, 0, 0)') {
        node.style[prop] = value
      }
    })
  })
}

function clearInlineColors (root) {
  const nodes = [root, ...root.querySelectorAll('*')]

  nodes.forEach((node) => {
    COLOR_PROPS.forEach((prop) => {
      node.style[prop] = ''
    })
  })
}

function waitForLayout () {
  return new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve))
  })
}

function prepareExportContent (element, page) {
  element.style.boxSizing = 'border-box'
  element.style.width = '100%'
  element.style.maxWidth = '100%'
  element.style.height = `${page.heightPx}px`
  element.style.minHeight = `${page.heightPx}px`
  element.style.maxHeight = `${page.heightPx}px`
  element.style.transform = 'none'
  element.style.transformOrigin = 'top left'
}

async function shrinkIfOverflow (element, page) {
  await waitForLayout()

  if (element.scrollHeight <= page.heightPx) return

  const contentHeight = element.scrollHeight
  const scale = page.heightPx / contentHeight

  element.style.height = `${contentHeight}px`
  element.style.minHeight = `${contentHeight}px`
  element.style.maxHeight = 'none'
  element.style.width = `${page.widthPx / scale}px`
  element.style.transform = `scale(${scale})`
  element.style.transformOrigin = 'top left'
}

function resetExportContent (element, previous) {
  element.style.boxSizing = previous.boxSizing
  element.style.width = previous.width
  element.style.maxWidth = previous.maxWidth
  element.style.height = previous.height
  element.style.minHeight = previous.minHeight
  element.style.maxHeight = previous.maxHeight
  element.style.transform = previous.transform
  element.style.transformOrigin = previous.transformOrigin
}

/**
 * Render a resume DOM node to a single-page letter PDF with no margins.
 * Theme colors come from the live document (html[data-theme], --vido-* tokens).
 */
export async function exportResumePdf ({ element, frame, orientation, filename }) {
  if (!element || !frame) {
    throw new Error('exportResumePdf requires element and frame')
  }

  const resolvedOrientation = orientation === 'portrait' ? 'portrait' : 'landscape'
  const page = PAGE[resolvedOrientation]

  const previous = {
    boxSizing: element.style.boxSizing,
    width: element.style.width,
    maxWidth: element.style.maxWidth,
    height: element.style.height,
    minHeight: element.style.minHeight,
    maxHeight: element.style.maxHeight,
    transform: element.style.transform,
    transformOrigin: element.style.transformOrigin
  }

  prepareExportContent(element, page)
  inlineResolvedColors(element)
  await shrinkIfOverflow(element, page)
  await waitForLayout()

  const surfaceColor = getComputedStyle(element).backgroundColor
  const bgRgb = parseRgb(surfaceColor)

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ])

    const canvas = await html2canvas(frame, {
      scale: CANVAS_SCALE,
      useCORS: true,
      backgroundColor: surfaceColor || null,
      logging: false,
      width: page.widthPx,
      height: page.heightPx,
      windowWidth: page.widthPx,
      windowHeight: page.heightPx,
      scrollX: 0,
      scrollY: 0
    })

    const pdf = new jsPDF({
      unit: 'in',
      format: 'letter',
      orientation: resolvedOrientation,
      compress: true
    })

    if (bgRgb) {
      pdf.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b)
      pdf.rect(0, 0, page.widthIn, page.heightIn, 'F')
    }

    pdf.addImage(
      canvas.toDataURL('image/jpeg', 0.98),
      'JPEG',
      0,
      0,
      page.widthIn,
      page.heightIn,
      undefined,
      'FAST'
    )

    pdf.save(filename)
  } finally {
    resetExportContent(element, previous)
    clearInlineColors(element)
  }
}

export function resumePdfFilename (orientation) {
  return `Jonathan-Roman-Velez-Resume-${orientation}.pdf`
}
