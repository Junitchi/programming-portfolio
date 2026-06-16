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

    <!-- Carousel (Bootstrap) -->
    <div
      v-else-if="displayType === 'carousel'"
      :id="'carousel-' + slug"
      class="carousel slide"
      :data-bs-ride="carouselOptions.ride"
      :data-bs-interval="carouselOptions.interval"
    >
      <div v-if="carouselOptions.indicators" class="carousel-indicators">
        <button
          v-for="(src, i) in imageUrls"
          :key="'ci-' + i"
          type="button"
          :data-bs-target="'#carousel-' + slug"
          :data-bs-slide-to="i"
          :class="{ active: i === 0 }"
          :aria-current="i === 0 ? 'true' : undefined"
          :aria-label="'Slide ' + (i + 1)"
        ></button>
      </div>
      <div class="carousel-inner rounded shadow-sm">
        <div
          v-for="(src, i) in imageUrls"
          :key="'cs-' + i"
          class="carousel-item"
          :class="{ active: i === 0 }"
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
          :data-bs-target="'#carousel-' + slug"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          :data-bs-target="'#carousel-' + slug"
          data-bs-slide="next"
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
export default {
  name: 'ProjectMedia',
  data () {
    return {
      lightboxOpen: false,
      lightboxIndex: 0
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
    }
  },
  computed: {
    baseUrl () {
      return process.env.BASE_URL || '/'
    },
    imageUrls () {
      const names = this.project?.media?.images
      if (!Array.isArray(names)) return []
      const base = this.baseUrl.replace(/\/?$/, '/')
      return names.map((f) => `${base}projects/${this.slug}/${encodeURIComponent(f)}`)
    },
    displayType () {
      const explicit = this.project?.media?.display
      const n = this.imageUrls.length
      if (n === 0) return 'none'
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
  beforeUnmount () {
    this.teardownLightboxListeners()
  },
  methods: {
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
