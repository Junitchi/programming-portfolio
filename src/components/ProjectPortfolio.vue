<template>
  <div class="project-portfolio">
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading projects…</span>
      </div>
    </div>
    <div v-else-if="loadError" class="alert alert-danger">{{ loadError }}</div>
    <div v-else ref="grid" class="row g-4 align-items-stretch project-portfolio__grid">
      <ProjectCard
        v-for="item in items"
        :key="item.slug"
        :slug="item.slug"
        :project="item.project || {}"
        :error="item.error"
        :base-path="basePath"
        @view="onView"
      />
    </div>
  </div>
</template>

<script>
import ProjectCard from './ProjectCard.vue'

const ROW_TOP_TOLERANCE_PX = 16

export default {
  name: 'ProjectPortfolio',
  components: { ProjectCard },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadError: {
      type: String,
      default: null
    },
    basePath: {
      type: String,
      default: 'projects'
    }
  },
  data () {
    return {
      rowLayoutObserver: null,
      rowLayoutTimer: null,
      rowLayoutUpdating: false
    }
  },
  watch: {
    items: {
      handler () {
        this.scheduleRowLayout()
      },
      deep: true
    },
    loading (isLoading) {
      if (!isLoading) {
        this.scheduleRowLayout()
        this.scheduleRowLayoutDelayed()
      }
    }
  },
  mounted () {
    this.setupRowLayoutObserver()
    this.scheduleRowLayout()
    this.scheduleRowLayoutDelayed()
    window.addEventListener('resize', this.scheduleRowLayout)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.scheduleRowLayout)
    if (this.rowLayoutTimer) {
      clearTimeout(this.rowLayoutTimer)
      this.rowLayoutTimer = null
    }
    if (this.rowLayoutObserver) {
      this.rowLayoutObserver.disconnect()
      this.rowLayoutObserver = null
    }
  },
  methods: {
    setupRowLayoutObserver () {
      if (typeof ResizeObserver === 'undefined') return
      this.rowLayoutObserver = new ResizeObserver(() => {
        if (this.rowLayoutUpdating) return
        this.scheduleRowLayout()
      })
      this.$nextTick(() => {
        if (this.$refs.grid) {
          this.rowLayoutObserver.observe(this.$refs.grid)
        }
      })
    },
    bindImageLoadListeners () {
      const grid = this.$refs.grid
      if (!grid) return

      grid.querySelectorAll('.project-card__media img').forEach((img) => {
        if (img.dataset.rowLayoutBound === '1') return
        img.dataset.rowLayoutBound = '1'
        if (img.complete) return
        img.addEventListener('load', this.scheduleRowLayout, { once: true })
        img.addEventListener('error', this.scheduleRowLayout, { once: true })
      })
    },
    scheduleRowLayout () {
      if (this.rowLayoutTimer) {
        clearTimeout(this.rowLayoutTimer)
      }
      this.rowLayoutTimer = setTimeout(() => {
        this.rowLayoutTimer = null
        this.updateRowLayout()
      }, 80)
    },
    scheduleRowLayoutDelayed () {
      setTimeout(() => {
        this.updateRowLayout()
      }, 400)
    },
    clearRowLayout (cols) {
      cols.forEach((col) => {
        col.classList.remove('project-card-col--row-aligned')
        const media = col.querySelector('.project-card__media')
        if (media) {
          media.style.height = ''
          media.style.minHeight = ''
        }
      })
    },
    measureMediaContentHeight (col) {
      const inner = col.querySelector('.project-card__media .project-media')
      if (!inner) return 0
      return Math.max(inner.scrollHeight, inner.getBoundingClientRect().height)
    },
    groupColsByRow (cols) {
      const sorted = cols
        .map((col) => ({ col, top: col.getBoundingClientRect().top }))
        .sort((a, b) => a.top - b.top || a.col.offsetLeft - b.col.offsetLeft)

      const groups = []
      let current = []
      let anchorTop = null

      sorted.forEach(({ col, top }) => {
        if (anchorTop === null || Math.abs(top - anchorTop) <= ROW_TOP_TOLERANCE_PX) {
          current.push(col)
          if (anchorTop === null) anchorTop = top
        } else {
          if (current.length) groups.push(current)
          current = [col]
          anchorTop = top
        }
      })

      if (current.length) groups.push(current)
      return groups
    },
    updateRowLayout () {
      const grid = this.$refs.grid
      if (!grid) return

      const cols = [...grid.querySelectorAll('.project-card-col')]
      this.clearRowLayout(cols)

      if (!cols.length || window.innerWidth < 992) {
        return
      }

      this.rowLayoutUpdating = true
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          try {
            this.applyRowLayout(cols)
            this.bindImageLoadListeners()
          } finally {
            this.rowLayoutUpdating = false
          }
        })
      })
    },
    applyRowLayout (cols) {
      const groups = this.groupColsByRow(cols)

      groups.forEach((groupCols) => {
        if (groupCols.length < 2) return

        let maxMediaHeight = 0
        groupCols.forEach((col) => {
          maxMediaHeight = Math.max(maxMediaHeight, this.measureMediaContentHeight(col))
        })

        if (maxMediaHeight <= 0) return

        const heightPx = `${Math.ceil(maxMediaHeight)}px`

        groupCols.forEach((col) => {
          col.classList.add('project-card-col--row-aligned')
          const media = col.querySelector('.project-card__media')
          if (media && media.style.height !== heightPx) {
            media.style.height = heightPx
            media.style.minHeight = heightPx
          }
        })
      })
    },
    onView (slug) {
      this.$emit('view-project', slug)
    }
  }
}
</script>
