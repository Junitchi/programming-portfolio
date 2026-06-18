<template>
  <div class="col-12 col-lg-6 col-xxl-4 project-card-col" :data-slug="slug">
    <div class="card card-outline card-primary h-100 shadow-sm project-card">
      <div v-if="hasHeaderContent" class="card-header">
        <h3 v-if="project.title" class="card-title mb-1">{{ project.title }}</h3>
        <p v-if="project.subtitle" class="text-muted mb-0 small">{{ project.subtitle }}</p>
      </div>
      <div class="card-body pt-3 project-card__body">
        <div v-if="error" class="alert alert-warning">{{ error }}</div>
        <template v-else>
          <div class="project-card__media">
            <ProjectMedia
              :slug="slug"
              :project="project"
              :base-path="basePath"
              :image-limit="previewImageLimit"
            />
          </div>
          <div class="project-card__details">
            <p
              v-if="project.description"
              class="card-text text-body-secondary project-description mb-0"
            >
              {{ project.description }}
            </p>
            <div v-if="hasLinks" class="project-card__links">
              <a
                v-for="(link, i) in normalizedLinks"
                :key="'l-' + i"
                :href="link.url"
                class="btn btn-sm btn-outline-primary me-1 mb-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ link.label }}
              </a>
            </div>
          </div>
          <div class="project-card__actions mt-auto d-grid gap-2">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm"
              @click="$emit('view', slug)"
            >
              <i class="bi bi-arrows-fullscreen me-1"></i>View project
            </button>
          </div>
        </template>
      </div>
      <div v-if="slug" class="card-footer text-muted small d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span><i class="bi bi-folder2 me-1"></i>{{ slug }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import ProjectMedia from './ProjectMedia.vue'

export default {
  name: 'ProjectCard',
  components: { ProjectMedia },
  props: {
    slug: {
      type: String,
      required: true
    },
    project: {
      type: Object,
      required: true
    },
    error: {
      type: String,
      default: null
    },
    basePath: {
      type: String,
      default: 'projects'
    }
  },
  computed: {
    hasHeaderContent () {
      return !!(this.project?.title || this.project?.subtitle)
    },
    hasLinks () {
      return this.normalizedLinks.length > 0
    },
    normalizedLinks () {
      const raw = this.project?.links
      if (!Array.isArray(raw)) return []
      return raw
        .filter((l) => l && typeof l.url === 'string' && l.url && typeof l.label === 'string' && l.label)
        .map((l) => ({ label: l.label, url: l.url }))
    },
    previewImageLimit () {
      const v = this.project?.media?.previewLimit
      if (v == null) return null
      const n = Number(v)
      return Number.isFinite(n) && n > 0 ? Math.floor(n) : null
    }
  }
}
</script>

<style scoped>
.project-description {
  white-space: pre-wrap;
}

.project-card {
  display: flex;
  flex-direction: column;
}

.project-card__body {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

.project-card__media {
  margin-bottom: 1rem;
}

.project-card__details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-card__links:not(:empty) {
  margin-top: 0.25rem;
}
</style>

<style>
/* Applied by ProjectPortfolio when cards share a row (lg+ only) */
@media (min-width: 992px) {
  .project-card-col--row-aligned .project-card__media {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    overflow: hidden;
    flex-shrink: 0;
  }

  .project-card-col--row-aligned .project-card__media .project-media {
    width: 100%;
    max-height: 100%;
    overflow: hidden;
  }

  .project-card-col--row-aligned .project-card__media .carousel,
  .project-card-col--row-aligned .project-card__media .carousel-inner,
  .project-card-col--row-aligned .project-card__media .carousel-item,
  .project-card-col--row-aligned .project-card__media .carousel-item.active {
    max-height: 100%;
  }

  .project-card-col--row-aligned .project-card__media img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    margin-left: auto;
    margin-right: auto;
    object-fit: contain;
  }
}
</style>
