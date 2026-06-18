<template>
  <div class="project-media">
    <!-- Fullscreen lightbox (all layouts) -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="project-media-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Enlarged image"
        @click.self="closeLightbox"
      >
        <button
          type="button"
          class="project-media-lightbox__close btn btn-light rounded-circle shadow"
          aria-label="Close"
          @click="closeLightbox"
        >
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
        <button
          v-if="imageUrls.length > 1"
          type="button"
          class="project-media-lightbox__nav project-media-lightbox__nav--prev btn btn-light rounded-circle shadow"
          aria-label="Previous image"
          @click.stop="lightboxPrev"
        >
          <i class="bi bi-chevron-left" aria-hidden="true"></i>
        </button>
        <button
          v-if="imageUrls.length > 1"
          type="button"
          class="project-media-lightbox__nav project-media-lightbox__nav--next btn btn-light rounded-circle shadow"
          aria-label="Next image"
          @click.stop="lightboxNext"
        >
          <i class="bi bi-chevron-right" aria-hidden="true"></i>
        </button>
        <div class="project-media-lightbox__frame" @click.stop>
          <img
            :src="imageUrls[lightboxIndex]"
            class="project-media-lightbox__img"
            alt=""
          />
        </div>
        <p v-if="imageUrls.length > 1" class="project-media-lightbox__counter text-white-50 small mb-0">
          {{ lightboxIndex + 1 }} / {{ imageUrls.length }}
        </p>
      </div>
    </Teleport>

    <div v-if="displayType === 'none'" class="text-muted small">
      Add image files to this project folder, then run <code>npm run projects:index</code> (or
      <code>npm run serve</code> / <code>npm run build</code>) to refresh <code>_images.json</code>.
      Optionally set <code>media.images</code> in <code>project.json</code> to override the folder list.
    </div>

    <div v-else-if="displayType === 'video-invalid'" class="text-muted small">
      Could not embed video from <code>media.video</code>. Use a YouTube or Vimeo watch or embed URL.
    </div>

    <!-- Embedded video (YouTube / Vimeo) -->
    <div v-else-if="displayType === 'video'" class="project-media__embed rounded shadow-sm overflow-hidden">
      <div class="project-media__embed-ratio">
        <div
          v-if="!videoLoaded"
          class="project-media__embed-loader"
          role="status"
          aria-live="polite"
        >
          <span class="project-media__spinner" aria-hidden="true"></span>
          <span class="visually-hidden">Loading video…</span>
        </div>
        <iframe
          :src="videoEmbedUrl"
          :title="videoTitle"
          class="project-media__embed-iframe"
          :class="{ 'project-media__embed-iframe--loading': !videoLoaded }"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          @load="onVideoLoaded"
        />
      </div>
    </div>

    <!-- Carousel -->
    <div
      v-else-if="displayType === 'carousel'"
      ref="carousel"
      :id="carouselId"
      class="carousel slide carousel-fade"
      @mouseenter="pauseCarouselAutoplay"
      @mouseleave="resumeCarouselAutoplay"
    >
      <div v-if="carouselOptions.indicators" class="carousel-indicators">
        <button
          v-for="(src, i) in imageUrls"
          :key="'ci-' + i"
          type="button"
          :class="{ active: carouselSlide === i }"
          :aria-current="carouselSlide === i ? 'true' : undefined"
          :aria-label="'Slide ' + (i + 1)"
          @click="goToSlide(i)"
        ></button>
      </div>
      <div class="carousel-inner rounded shadow-sm">
        <div
          v-for="(src, i) in imageUrls"
          :key="'cs-' + i"
          class="carousel-item"
          :class="{ active: carouselSlide === i }"
        >
          <img
            :src="src"
            class="d-block w-100 project-media__zoomable"
            alt=""
            role="button"
            tabindex="0"
            :aria-label="'Enlarge image ' + (i + 1)"
            @click.stop="openLightbox(i)"
            @keydown.enter.prevent="openLightbox(i)"
            @keydown.space.prevent="openLightbox(i)"
          />
        </div>
      </div>
      <template v-if="carouselOptions.controls">
        <button
          class="carousel-control-prev"
          type="button"
          aria-label="Previous slide"
          @click="carouselPrev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          aria-label="Next slide"
          @click="carouselNext"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </template>
    </div>

    <!-- Grid -->
    <div v-else-if="displayType === 'grid'" class="row row-cols-1 g-2" :class="gridRowClass">
      <div v-for="(src, i) in imageUrls" :key="'g-' + i" class="col">
        <img
          :src="src"
          class="img-fluid rounded border project-media__zoomable"
          alt=""
          role="button"
          tabindex="0"
          :aria-label="'Enlarge image ' + (i + 1)"
          @click="openLightbox(i)"
          @keydown.enter.prevent="openLightbox(i)"
          @keydown.space.prevent="openLightbox(i)"
        />
      </div>
    </div>

    <!-- Stack: vertical -->
    <div v-else-if="displayType === 'stack'" class="d-flex flex-column gap-2">
      <img
        v-for="(src, i) in imageUrls"
        :key="'st-' + i"
        :src="src"
        class="img-fluid rounded shadow-sm project-media__zoomable"
        alt=""
        role="button"
        tabindex="0"
        :aria-label="'Enlarge image ' + (i + 1)"
        @click="openLightbox(i)"
        @keydown.enter.prevent="openLightbox(i)"
        @keydown.space.prevent="openLightbox(i)"
      />
    </div>

    <!-- Single: first image emphasized -->
    <div v-else-if="displayType === 'single'" class="text-center">
      <img
        :src="imageUrls[0]"
        class="img-fluid rounded shadow project-media__zoomable"
        :style="singleStyle"
        alt=""
        role="button"
        tabindex="0"
        aria-label="Enlarge image"
        @click="openLightbox(0)"
        @keydown.enter.prevent="openLightbox(0)"
        @keydown.space.prevent="openLightbox(0)"
      />
    </div>

    <!-- Masonry: CSS columns -->
    <div
      v-else-if="displayType === 'masonry'"
      class="masonry-wrap"
      :style="masonryStyle"
    >
      <img
        v-for="(src, i) in imageUrls"
        :key="'m-' + i"
        :src="src"
        class="masonry-img rounded mb-2 project-media__zoomable"
        alt=""
        role="button"
        tabindex="0"
        :aria-label="'Enlarge image ' + (i + 1)"
        @click="openLightbox(i)"
        @keydown.enter.prevent="openLightbox(i)"
        @keydown.space.prevent="openLightbox(i)"
      />
    </div>

    <!-- Filmstrip: horizontal scroll -->
    <div
      v-else-if="displayType === 'filmstrip'"
      class="filmstrip d-flex flex-nowrap gap-2 overflow-auto pb-1"
      :style="filmstripStyle"
    >
      <img
        v-for="(src, i) in imageUrls"
        :key="'f-' + i"
        :src="src"
        class="rounded border flex-shrink-0 filmstrip-thumb project-media__zoomable"
        alt=""
        role="button"
        tabindex="0"
        :aria-label="'Enlarge image ' + (i + 1)"
        @click="openLightbox(i)"
        @keydown.enter.prevent="openLightbox(i)"
        @keydown.space.prevent="openLightbox(i)"
      />
    </div>
  </div>
</template>

<script>
/**
 * Normalizes a YouTube or Vimeo watch/embed URL to an iframe-safe embed URL.
 * Returns null when the URL is missing or not recognized.
 */
function toVideoEmbedUrl (url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const parsed = new URL(trimmed)
    const host = parsed.hostname.replace(/^www\./, '')

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      let id = null
      if (parsed.pathname.startsWith('/embed/')) {
        id = parsed.pathname.split('/').filter(Boolean)[1]
      } else if (parsed.pathname.startsWith('/shorts/')) {
        id = parsed.pathname.split('/').filter(Boolean)[1]
      } else {
        id = parsed.searchParams.get('v')
      }
      if (id) {
        const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`)
        const start = parsed.searchParams.get('t') || parsed.searchParams.get('start')
        if (start) embed.searchParams.set('start', String(start).replace(/s$/i, ''))
        return embed.toString()
      }
    }

    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      if (id) {
        const embed = new URL(`https://www.youtube-nocookie.com/embed/${id}`)
        const start = parsed.searchParams.get('t') || parsed.searchParams.get('start')
        if (start) embed.searchParams.set('start', String(start).replace(/s$/i, ''))
        return embed.toString()
      }
    }

    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      if (id && /^\d+$/.test(id)) {
        return `https://player.vimeo.com/video/${id}`
      }
    }

    if (host === 'player.vimeo.com') {
      const match = parsed.pathname.match(/\/video\/(\d+)/)
      if (match) return `https://player.vimeo.com/video/${match[1]}`
    }

    return null
  } catch {
    return null
  }
}

export default {
  name: 'ProjectMedia',
  data () {
    return {
      lightboxOpen: false,
      lightboxIndex: 0,
      videoLoaded: false,
      carouselSlide: 0,
      carouselTimer: null,
      carouselAutoplayPaused: false,
      carouselVisible: true,
      carouselObserver: null
    }
  },
  props: {
    slug: {
      type: String,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    basePath: {
      type: String,
      default: 'projects'
    },
    imageLimit: {
      type: Number,
      default: null
    }
  },
  computed: {
    baseUrl () {
      return process.env.BASE_URL || '/'
    },
    carouselId () {
      const safe = String(this.slug).replace(/[^a-zA-Z0-9_-]+/g, '-').replace(/^-+|-+$/g, '')
      return `carousel-${safe || 'item'}`
    },
    imageUrls () {
      const urls = this.allImageUrls
      const limit = this.imageLimit
      if (limit == null || !Number.isFinite(limit) || limit <= 0) return urls
      return urls.slice(0, Math.floor(limit))
    },
    allImageUrls () {
      const names = this.project?.media?.images
      if (!Array.isArray(names)) return []
      const base = this.baseUrl.replace(/\/?$/, '/')
      return names.map((f) => `${base}${this.basePath}/${this.slug}/${encodeURIComponent(f)}`)
    },
    rawVideoUrl () {
      const v = this.project?.media?.video
      return typeof v === 'string' ? v.trim() : ''
    },
    videoEmbedUrl () {
      return toVideoEmbedUrl(this.rawVideoUrl)
    },
    videoTitle () {
      return this.project?.title ? `${this.project.title} video` : 'Project video'
    },
    displayType () {
      if (this.videoEmbedUrl) return 'video'

      const n = this.imageUrls.length
      if (this.rawVideoUrl && !this.videoEmbedUrl && n === 0) return 'video-invalid'
      if (n === 0) return 'none'

      const explicit = this.project?.media?.display
      if (explicit) return explicit
      if (n === 1) return 'single'
      return 'grid'
    },
    carouselOptions () {
      const c = this.project?.media?.carousel || {}
      return {
        interval: c.interval !== undefined ? c.interval : 5000,
        indicators: c.indicators !== false,
        controls: c.controls !== false,
        ride: c.ride === false ? false : 'carousel'
      }
    },
    gridColumns () {
      const g = this.project?.media?.grid || {}
      const n = Number(g.columns)
      return Number.isFinite(n) && n > 0 ? Math.min(4, n) : 2
    },
    gridRowClass () {
      return `row-cols-md-${this.gridColumns}`
    },
    singleStyle () {
      const s = this.project?.media?.single || {}
      const o = {}
      if (s.maxHeight) o.maxHeight = typeof s.maxHeight === 'number' ? `${s.maxHeight}px` : s.maxHeight
      if (s.objectFit) o.objectFit = s.objectFit
      else o.objectFit = 'contain'
      return o
    },
    masonryStyle () {
      const m = this.project?.media?.masonry || {}
      const cols = Number(m.columns) || 2
      return {
        columnCount: cols,
        columnGap: m.gap || '0.5rem'
      }
    },
    filmstripStyle () {
      const f = this.project?.media?.filmstrip || {}
      const h = f.thumbHeight || 140
      return {
        '--filmstrip-thumb-height': typeof h === 'number' ? `${h}px` : h
      }
    }
  },
  watch: {
    videoEmbedUrl () {
      this.videoLoaded = false
    },
    displayType () {
      this.resetCarousel()
    },
    imageUrls () {
      this.resetCarousel()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.setupCarouselVisibility()
      this.startCarouselAutoplay()
    })
  },
  beforeUnmount () {
    this.teardownLightboxListeners()
    this.teardownCarousel()
  },
  methods: {
    resetCarousel () {
      this.carouselSlide = 0
      this.$nextTick(() => {
        this.setupCarouselVisibility()
        this.startCarouselAutoplay()
      })
    },
    setupCarouselVisibility () {
      this.teardownCarouselVisibility()
      if (this.displayType !== 'carousel') return
      const el = this.$refs.carousel
      if (!el || typeof IntersectionObserver === 'undefined') return
      this.carouselObserver = new IntersectionObserver((entries) => {
        this.carouselVisible = entries.some((entry) => entry.isIntersecting)
      })
      this.carouselObserver.observe(el)
    },
    teardownCarouselVisibility () {
      if (this.carouselObserver) {
        this.carouselObserver.disconnect()
        this.carouselObserver = null
      }
      this.carouselVisible = true
    },
    startCarouselAutoplay () {
      this.stopCarouselAutoplay()
      if (this.displayType !== 'carousel') return
      const { interval, ride } = this.carouselOptions
      if (ride !== 'carousel' || interval === 0 || this.imageUrls.length <= 1) return
      this.carouselTimer = setInterval(() => {
        if (!this.carouselAutoplayPaused && this.carouselVisible) {
          this.carouselNext()
        }
      }, interval)
    },
    stopCarouselAutoplay () {
      if (this.carouselTimer) {
        clearInterval(this.carouselTimer)
        this.carouselTimer = null
      }
    },
    teardownCarousel () {
      this.stopCarouselAutoplay()
      this.teardownCarouselVisibility()
    },
    pauseCarouselAutoplay () {
      this.carouselAutoplayPaused = true
    },
    resumeCarouselAutoplay () {
      this.carouselAutoplayPaused = false
    },
    goToSlide (index) {
      const n = this.imageUrls.length
      if (!n) return
      this.carouselSlide = Math.max(0, Math.min(Number(index) || 0, n - 1))
    },
    carouselPrev () {
      const n = this.imageUrls.length
      if (n <= 1) return
      this.carouselSlide = (this.carouselSlide - 1 + n) % n
    },
    carouselNext () {
      const n = this.imageUrls.length
      if (n <= 1) return
      this.carouselSlide = (this.carouselSlide + 1) % n
    },
    onVideoLoaded () {
      this.videoLoaded = true
    },
    openLightbox (index) {
      const n = this.imageUrls.length
      if (!n) return
      const i = Math.max(0, Math.min(Number(index) || 0, n - 1))
      this.lightboxIndex = i
      const wasOpen = this.lightboxOpen
      this.lightboxOpen = true
      if (!wasOpen) {
        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', this.onLightboxKeydown)
      }
    },
    closeLightbox () {
      this.lightboxOpen = false
      this.teardownLightboxListeners()
    },
    teardownLightboxListeners () {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', this.onLightboxKeydown)
    },
    lightboxNext () {
      const n = this.imageUrls.length
      if (n <= 1) return
      this.lightboxIndex = (this.lightboxIndex + 1) % n
    },
    lightboxPrev () {
      const n = this.imageUrls.length
      if (n <= 1) return
      this.lightboxIndex = (this.lightboxIndex - 1 + n) % n
    },
    onLightboxKeydown (e) {
      if (e.key === 'Escape') {
        this.closeLightbox()
      } else if (e.key === 'ArrowRight') {
        this.lightboxNext()
      } else if (e.key === 'ArrowLeft') {
        this.lightboxPrev()
      }
    }
  }
}
</script>

<style scoped>
.project-media__zoomable {
  cursor: zoom-in;
}

.masonry-img {
  width: 100%;
  break-inside: avoid;
  display: block;
}

.filmstrip-thumb {
  height: var(--filmstrip-thumb-height, 140px);
  width: auto;
  object-fit: cover;
}

.project-media__embed-ratio {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  background: #000;
}

.project-media__embed-iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.project-media__embed-iframe--loading {
  opacity: 0;
}

.project-media__embed-loader {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.project-media__spinner {
  width: 2.75rem;
  height: 2.75rem;
  border: 0.25rem solid rgba(255, 255, 255, 0.2);
  border-top-color: #fff;
  border-radius: 50%;
  animation: project-media-spin 0.8s linear infinite;
}

@keyframes project-media-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-media__spinner {
    animation-duration: 1.6s;
  }
}
</style>

<style>
/* Teleported to body — not scoped */
.project-media-lightbox {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 4rem 2rem;
  background: rgba(0, 0, 0, 0.88);
  box-sizing: border-box;
}

.project-media-lightbox__frame {
  flex: 1 1 auto;
  min-height: 0;
  width: 100%;
  max-width: min(96vw, 1400px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.project-media-lightbox__img {
  max-width: 100%;
  max-height: calc(100vh - 6rem);
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 2rem rgba(0, 0, 0, 0.45);
}

.project-media-lightbox__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.project-media-lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.project-media-lightbox__nav--prev {
  left: 1rem;
}

.project-media-lightbox__nav--next {
  right: 1rem;
}

.project-media-lightbox__counter {
  flex-shrink: 0;
  margin-top: 0.75rem;
}

@media (max-width: 576px) {
  .project-media-lightbox {
    padding: 3rem 0.5rem 1rem;
  }

  .project-media-lightbox__nav--prev {
    left: 0.35rem;
  }

  .project-media-lightbox__nav--next {
    right: 0.35rem;
  }
}
</style>
