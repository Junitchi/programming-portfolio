<template>
  <div class="project-viewer">
    <div class="card card-primary card-outline shadow">
      <div class="card-header">
        <h2 class="card-title mb-1">{{ displayTitle }}</h2>
        <p v-if="project.subtitle" class="text-muted mb-0">{{ project.subtitle }}</p>
      </div>
      <div class="card-body">
        <div v-if="error" class="alert alert-warning">{{ error }}</div>
        <template v-else>
          <div class="project-viewer-media mb-4">
            <ProjectMedia :slug="slug" :project="project" :base-path="basePath" />
          </div>
          <p
            v-if="project.description"
            class="text-body-secondary project-description fs-6 mb-4"
          >
            {{ project.description }}
          </p>
          <div v-if="hasLinks" class="d-flex flex-wrap gap-2">
            <a
              v-for="(link, i) in normalizedLinks"
              :key="'vl-' + i"
              :href="link.url"
              class="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i class="bi bi-box-arrow-up-right me-1"></i>{{ link.label }}
            </a>
          </div>
        </template>
      </div>
      <div v-if="slug" class="card-footer text-muted">
        <i class="bi bi-folder2 me-1"></i>{{ slug }}
      </div>
    </div>
  </div>
</template>

<script>
import ProjectMedia from './ProjectMedia.vue'

export default {
  name: 'ProjectViewer',
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
    displayTitle () {
      return this.project?.title || this.slug
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
    }
  }
}
</script>

<style scoped>
.project-description {
  white-space: pre-wrap;
}

.project-viewer-media {
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
}
</style>
