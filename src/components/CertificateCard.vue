<template>
  <div class="col-12 col-lg-6 col-xxl-4">
    <div class="card card-outline card-success h-100 shadow-sm certificate-card">
      <div class="card-header py-2">
        <h3 class="card-title mb-0 fs-5">{{ title }}</h3>
      </div>
      <div class="card-body p-0">
        <div class="certificate-embed-wrap">
          <iframe
            :src="pdfUrl"
            class="certificate-iframe border-0 rounded-bottom"
            :title="title"
          />
        </div>
      </div>
      <div class="card-footer py-2 bg-body-secondary">
        <a
          :href="pdfUrl"
          class="btn btn-sm btn-outline-success"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i class="bi bi-box-arrow-up-right me-1"></i>Open PDF
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { certificatePdfUrl } from '../services/certificates'

export default {
  name: 'CertificateCard',
  props: {
    title: {
      type: String,
      required: true
    },
    relativePath: {
      type: String,
      required: true
    }
  },
  computed: {
    pdfUrl () {
      return certificatePdfUrl(this.relativePath)
    }
  }
}
</script>

<style scoped>
.certificate-embed-wrap {
  min-height: 280px;
  background: var(--bs-secondary-bg);
}

.certificate-iframe {
  width: 100%;
  height: 100%;
  min-height: 280px;
}
</style>
