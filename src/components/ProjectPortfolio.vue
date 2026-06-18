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
      rowLayoutTimer: null,
      rowLayoutUpdating: false,
      lastLayoutKey: ''
    }
  },
  watch: {
    items: {
      handler () {
        this.lastLayoutKey = ''
        this.scheduleRowLayout()
      },
      deep: true
    },
    loading (isLoading) {
      if (!isLoading) {
        this.lastLayoutKey = ''
        this.scheduleRowLayout()
      }
    }
  },
  mounted () {
    this.scheduleRowLayout()
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.onWindowResize)
    if (this.rowLayoutTimer) {
      clearTimeout(this.rowLayoutTimer)
      this.rowLayoutTimer = null
    }
  },
  methods: {
    onWindowResize () {
      this.lastLayoutKey = ''
      this.scheduleRowLayout()
    },
    bindImageLoadListeners () {
      const grid = this.$refs.grid
      if (!grid) return

      grid.querySelectorAll('.project-card__media img').forEach((img) => {
        if (img.dataset.rowLayoutBound === '1') return
        img.dataset.rowLayoutBound = '1'
        if (img.complete) return
        img.addEventListener('load', this.onImageLoaded, { once: true })
        img.addEventListener('error', this.onImageLoaded, { once: true })
      })
    },
    onImageLoaded () {
      this.lastLayoutKey = ''
      this.scheduleRowLayout()
    },
    scheduleRowLayout () {
      if (this.rowLayoutTimer) {
        clearTimeout(this.rowLayoutTimer)
      }
      this.rowLayoutTimer = setTimeout(() => {
        this.rowLayoutTimer = null
        this.updateRowLayout()
      }, 120)
    },
    clearRowLayout (cols) {
      cols.forEach((col) => {
        col.classList.remove('project-card-col--row-aligned')
        const media = col.querySelector('.project-card__media')
        if (media) {
          media.style.height = ''
          media.style.minHeight = ''
        }
        const description = col.querySelector('.project-card__description')
        if (description) {
          description.style.height = ''
          description.style.minHeight = ''
        }
        const links = col.querySelector('.project-card__links')
        if (links) {
          links.style.height = ''
          links.style.minHeight = ''
        }
      })
    },
    measureNaturalHeight (el) {
      if (!el) return 0
      return Math.max(el.scrollHeight, el.getBoundingClientRect().height)
    },
    measureMediaContentHeight (col) {
      const inner = col.querySelector('.project-card__media .project-media')
      return this.measureNaturalHeight(inner)
    },
    measureDescriptionHeight (col) {
      const text = col.querySelector('.project-card__description .project-description')
      return this.measureNaturalHeight(text)
    },
    measureLinksHeight (col) {
      const links = col.querySelector('.project-card__links')
      if (!links) return 0
      const savedMinHeight = links.style.minHeight
      links.style.minHeight = ''
      const height = this.measureNaturalHeight(links)
      links.style.minHeight = savedMinHeight
      return height
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
    buildLayoutPlan (cols) {
      const groups = this.groupColsByRow(cols)
      const plan = []

      groups.forEach((groupCols) => {
        if (groupCols.length < 2) return

        let maxMediaHeight = 0
        let maxDescriptionHeight = 0
        let maxLinksHeight = 0

        groupCols.forEach((col) => {
          maxMediaHeight = Math.max(maxMediaHeight, this.measureMediaContentHeight(col))
          maxDescriptionHeight = Math.max(maxDescriptionHeight, this.measureDescriptionHeight(col))
          maxLinksHeight = Math.max(maxLinksHeight, this.measureLinksHeight(col))
        })

        plan.push({
          cols: groupCols,
          mediaHeight: maxMediaHeight > 0 ? Math.ceil(maxMediaHeight) : 0,
          descriptionHeight: maxDescriptionHeight > 0 ? Math.ceil(maxDescriptionHeight) : 0,
          linksHeight: maxLinksHeight > 0 ? Math.ceil(maxLinksHeight) : 0
        })
      })

      return plan
    },
    layoutPlanKey (plan) {
      return plan.map((row) => (
        `${row.cols.length}:${row.mediaHeight}:${row.descriptionHeight}:${row.linksHeight}`
      )).join('|')
    },
    applyLayoutPlan (plan) {
      plan.forEach((row) => {
        const mediaHeightPx = row.mediaHeight ? `${row.mediaHeight}px` : null
        const descriptionHeightPx = row.descriptionHeight ? `${row.descriptionHeight}px` : null
        const linksHeightPx = row.linksHeight ? `${row.linksHeight}px` : null

        row.cols.forEach((col) => {
          col.classList.add('project-card-col--row-aligned')

          const media = col.querySelector('.project-card__media')
          if (media && mediaHeightPx) {
            if (media.style.height !== mediaHeightPx) {
              media.style.height = mediaHeightPx
              media.style.minHeight = mediaHeightPx
            }
          }

          const description = col.querySelector('.project-card__description')
          if (description && descriptionHeightPx) {
            if (description.style.minHeight !== descriptionHeightPx) {
              description.style.minHeight = descriptionHeightPx
            }
          }

          const links = col.querySelector('.project-card__links')
          if (links && linksHeightPx) {
            if (links.style.minHeight !== linksHeightPx) {
              links.style.minHeight = linksHeightPx
            }
          }
        })
      })
    },
    updateRowLayout () {
      const grid = this.$refs.grid
      if (!grid || this.rowLayoutUpdating) return

      const cols = [...grid.querySelectorAll('.project-card-col')]
      if (!cols.length || window.innerWidth < 992) {
        if (this.lastLayoutKey) {
          this.clearRowLayout(cols)
          this.lastLayoutKey = ''
        }
        return
      }

      const previewPlan = this.buildLayoutPlan(cols)
      const previewKey = this.layoutPlanKey(previewPlan)
      this.bindImageLoadListeners()

      if (previewKey === this.lastLayoutKey) {
        return
      }

      this.rowLayoutUpdating = true
      this.clearRowLayout(cols)

      requestAnimationFrame(() => {
        try {
          const plan = this.buildLayoutPlan(cols)
          this.applyLayoutPlan(plan)
          this.lastLayoutKey = this.layoutPlanKey(plan)
        } finally {
          this.rowLayoutUpdating = false
        }
      })
    },
    onView (slug) {
      this.$emit('view-project', slug)
    }
  }
}
</script>
