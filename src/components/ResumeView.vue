<template>
  <article class="resume-view">
    <div class="resume-actions">
      <button
        type="button"
        class="btn btn-outline-primary"
        :disabled="exporting"
        @click="downloadStyledPdf('landscape')"
      >
        <span
          v-if="exporting && exportLayout === 'landscape'"
          class="spinner-border spinner-border-sm me-1"
          role="status"
          aria-hidden="true"
        ></span>
        <i v-else class="bi bi-download me-1"></i>
        Download landscape PDF
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary"
        :disabled="exporting"
        @click="downloadStyledPdf('portrait')"
      >
        <span
          v-if="exporting && exportLayout === 'portrait'"
          class="spinner-border spinner-border-sm me-1"
          role="status"
          aria-hidden="true"
        ></span>
        <i v-else class="bi bi-download me-1"></i>
        Download portrait PDF
      </button>
    </div>

    <ResumeDocument layout="landscape" />

    <div v-if="exporting" ref="pdfExportRoot" class="resume-pdf-export" aria-hidden="true">
      <div
        class="resume-pdf-export__frame"
        :class="`resume-pdf-export__frame--${exportLayout}`"
      >
        <ResumeDocument :layout="exportLayout" for-export />
      </div>
    </div>
  </article>
</template>

<script>
import ResumeDocument from './ResumeDocument.vue'
import { exportStyledResumePdf, resumePdfFilename } from '@/utils/exportResumePdf'

export default {
  name: 'ResumeView',
  components: {
    ResumeDocument
  },
  data () {
    return {
      exporting: false,
      exportLayout: 'landscape'
    }
  },
  methods: {
    async downloadStyledPdf (orientation) {
      if (this.exporting) return

      this.exporting = true
      this.exportLayout = orientation

      try {
        await this.$nextTick()
        await this.$nextTick()
        const root = this.$refs.pdfExportRoot
        const frame = root?.querySelector('.resume-pdf-export__frame')
        const element = frame?.querySelector('.resume-page')
        if (!frame || !element) {
          throw new Error('Resume export element not found')
        }
        await exportStyledResumePdf({
          element,
          frame,
          orientation,
          filename: resumePdfFilename(orientation)
        })
      } catch (err) {
        console.error(err)
      } finally {
        this.exporting = false
      }
    }
  }
}
</script>

<style scoped>
.resume-view {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
  padding: clamp(0.75rem, 2.5vh, 1.5rem) clamp(0.75rem, 3vw, 2rem) clamp(1.25rem, 3vh, 2rem);
}

.resume-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 1rem;
}

.resume-pdf-export {
  position: fixed;
  left: -12000px;
  top: 0;
  pointer-events: none;
  z-index: -1;
}

.resume-pdf-export__frame {
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.resume-pdf-export__frame > * {
  flex: 1;
  min-height: 0;
}

.resume-pdf-export__frame--landscape {
  width: 1056px;
  height: 816px;
}

.resume-pdf-export__frame--portrait {
  width: 816px;
  height: 1056px;
}

@media (min-width: 768px) {
  .resume-view {
    padding-left: clamp(1rem, 3vw, 2rem);
    padding-right: clamp(1rem, 3vw, 2rem);
  }
}

@media (orientation: landscape) and (max-height: 520px) {
  .resume-view {
    padding-top: 0.5rem;
    padding-bottom: 0.75rem;
  }

  .resume-actions {
    margin-bottom: 0.65rem;
  }
}
</style>
