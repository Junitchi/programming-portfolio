<template>
  <div class="project-portfolio">
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading projects…</span>
      </div>
    </div>
    <div v-else-if="loadError" class="alert alert-danger">{{ loadError }}</div>
    <div v-else class="row g-4">
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
  methods: {
    onView (slug) {
      this.$emit('view-project', slug)
    }
  }
}
</script>
