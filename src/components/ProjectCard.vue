<template>
  <div class="col-12 col-lg-6 col-xxl-4">
    <div class="card card-outline card-primary h-100 shadow-sm">
      <div v-if="hasHeaderContent" class="card-header">
        <h3 v-if="project.title" class="card-title mb-1">{{ project.title }}</h3>
        <p v-if="project.subtitle" class="text-muted mb-0 small">{{ project.subtitle }}</p>
      </div>
      <div class="card-body pt-3 d-flex flex-column">
        <div v-if="error" class="alert alert-warning">{{ error }}</div>
        <template v-else>
          <div class="mb-3">
            <ProjectMedia :slug="slug" :project="project" />
          </div>
          <p
            v-if="project.description"
            class="card-text text-body-secondary project-description"
          >
            {{ project.description }}
          </p>
          <div v-if="hasLinks" class="mb-3">
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
          <div class="mt-auto d-grid gap-2">
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
    }
  }
}
</script>

<style scoped>
.project-description {
  white-space: pre-wrap;
}
</style>
