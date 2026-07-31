const PAGE = {
  landscape: { widthIn: 11, heightIn: 8.5, widthPx: 1056, heightPx: 816 },
  portrait: { widthIn: 8.5, heightIn: 11, widthPx: 816, heightPx: 1056 }
}

const COLOR_PROPS = [
  'color',
  'backgroundColor',
  'borderColor',
  'borderTopColor',
  'borderRightColor',
  'borderBottomColor',
  'borderLeftColor'
]

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
  element.style.width = `${page.widthPx}px`
  element.style.maxWidth = `${page.widthPx}px`
  element.style.height = `${page.heightPx}px`
  element.style.minHeight = `${page.heightPx}px`
  element.style.maxHeight = `${page.heightPx}px`
  element.style.transform = 'none'
  element.style.transformOrigin = 'top left'
  element.style.overflow = 'visible'
}

/**
 * html2canvas drops regular spaces at some line-wrap boundaries.
 * Split text into word spans with explicit gap spans so lines wrap normally.
 */
function hardenCloneText (root, pageWidthPx) {
  root.style.transform = 'none'
  root.style.fontFamily = "'Segoe UI', Arial, Helvetica, sans-serif"
  root.style.boxSizing = 'border-box'
  root.style.width = `${pageWidthPx}px`
  root.style.maxWidth = `${pageWidthPx}px`
  root.style.overflow = 'visible'

  root.querySelectorAll('*').forEach((el) => {
    el.style.letterSpacing = 'normal'
    el.style.overflow = 'visible'
  })

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode (node) {
        if (!node.textContent || !/\S/.test(node.textContent)) {
          return NodeFilter.FILTER_REJECT
        }
        const parent = node.parentElement
        if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
          return NodeFilter.FILTER_REJECT
        }
        return NodeFilter.FILTER_ACCEPT
      }
    }
  )

  const textNodes = []
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode)
  }

  textNodes.forEach((node) => {
    const words = node.textContent.trim().split(/\s+/).filter(Boolean)
    if (words.length <= 1) return

    const fragment = document.createDocumentFragment()
    words.forEach((word, index) => {
      const span = document.createElement('span')
      span.textContent = word
      span.style.display = 'inline'
      fragment.appendChild(span)

      if (index < words.length - 1) {
        const gap = document.createElement('span')
        gap.style.display = 'inline-block'
        gap.style.width = '0.28em'
        gap.style.height = '0'
        gap.style.verticalAlign = 'baseline'
        gap.setAttribute('aria-hidden', 'true')
        fragment.appendChild(gap)
      }
    })

    node.parentNode.replaceChild(fragment, node)
  })
}

/**
 * Fit overflowing export content by scaling root rem units.
 */
async function shrinkIfOverflow (element, page) {
  await waitForLayout()

  const html = document.documentElement
  const previousRootFontSize = html.style.fontSize
  const baseFontSize = parseFloat(getComputedStyle(html).fontSize) || 16

  if (element.scrollHeight > page.heightPx) {
    let scale = 1
    const minScale = 0.72
    const step = 0.015

    while (element.scrollHeight > page.heightPx && scale > minScale) {
      scale -= step
      html.style.fontSize = `${baseFontSize * scale}px`
      await waitForLayout()
    }
  }

  return () => {
    html.style.fontSize = previousRootFontSize
  }
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
  element.style.overflow = previous.overflow
}

/**
 * Render the styled on-page resume to a single-page letter PDF.
 * Theme colors come from the live document (html[data-theme], --vido-* tokens).
 */
export async function exportStyledResumePdf ({ element, frame, orientation, filename }) {
  if (!element || !frame) {
    throw new Error('exportStyledResumePdf requires element and frame')
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
    transformOrigin: element.style.transformOrigin,
    overflow: element.style.overflow
  }

  prepareExportContent(element, page)
  inlineResolvedColors(element)
  const resetRootFontSize = await shrinkIfOverflow(element, page)
  await waitForLayout()

  const surfaceColor = getComputedStyle(element).backgroundColor
  const backgroundColor = surfaceColor || '#ffffff'

  try {
    const [{ jsPDF }, html2canvas] = await Promise.all([
      import('jspdf'),
      import('html2canvas').then((mod) => mod.default)
    ])

    const canvas = await html2canvas(element, {
      useCORS: true,
      backgroundColor,
      logging: false,
      scale: 2,
      windowWidth: page.widthPx,
      windowHeight: page.heightPx,
      scrollX: 0,
      scrollY: 0,
      onclone: (_doc, clone) => {
        hardenCloneText(clone, page.widthPx)
      }
    })

    const pdf = new jsPDF({
      unit: 'in',
      format: 'letter',
      orientation: resolvedOrientation,
      compress: true
    })

    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, page.widthIn, page.heightIn, undefined, 'FAST')
    pdf.save(filename)
  } finally {
    resetExportContent(element, previous)
    clearInlineColors(element)
    resetRootFontSize?.()
  }
}

export function resumePdfFilename (orientation) {
  return `Jonathan-Roman-Velez-Resume-${orientation}.pdf`
}
