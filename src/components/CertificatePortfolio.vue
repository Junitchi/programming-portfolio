<template>
  <div class="certificate-portfolio">
    <div v-if="loading" class="d-flex justify-content-center py-5">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading certificates…</span>
      </div>
    </div>
    <div v-else-if="loadError" class="alert alert-danger">{{ loadError }}</div>
    <div v-else-if="!items.length" class="alert alert-light border text-muted">
      No PDF certificates found. Add <code>.pdf</code> files under
      <code>public/certificates/</code> (any subfolder), then run
      <code>npm run projects:index</code> or <code>npm run serve</code>.
    </div>
    <div v-else class="row g-4">
      <CertificateCard
        v-for="c in items"
        :key="c.relativePath"
        :title="c.title"
        :relative-path="c.relativePath"
      />
    </div>
  </div>
</template>

<script>
import { loadCertificatesManifest } from '../services/certificates'
import CertificateCard from './CertificateCard.vue'

export default {
  name: 'CertificatePortfolio',
  components: { CertificateCard },
  data () {
    return {
      loading: true,
      loadError: null,
      items: []
    }
  },
  async mounted () {
    try {
      const { certificates } = await loadCertificatesManifest()
      this.items = certificates
    } catch (e) {
      this.loadError = e.message || String(e)
    } finally {
      this.loading = false
    }
  }
}
</script>
