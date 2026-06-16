<template>
  <div class="app-wrapper">
    <nav class="app-header navbar navbar-expand border-bottom">
      <div class="container-fluid">
        <ul class="navbar-nav">
          <li class="nav-item">
            <a
              class="nav-link"
              data-lte-toggle="sidebar"
              href="#"
              role="button"
              aria-label="Toggle sidebar"
            >
              <i class="bi bi-list fs-4"></i>
            </a>
          </li>
          <li class="nav-item d-none d-md-flex align-items-center">
            <span class="nav-link mb-0 fw-semibold">Programming portfolio</span>
          </li>
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <button
              type="button"
              class="nav-link btn btn-link border-0"
              title="Theme settings"
              aria-label="Theme settings"
              @click="settingsOpen = true"
            >
              <i class="bi bi-gear fs-5"></i>
            </button>
          </li>
        </ul>
      </div>
    </nav>

    <aside class="app-sidebar shadow">
      <div class="sidebar-brand">
        <a href="#main" class="brand-link" @click.prevent="goHome">
          <span class="brand-text fw-light">Home</span>
        </a>
      </div>
      <div class="sidebar-wrapper">
        <nav class="mt-2">
          <ul
            class="nav sidebar-menu flex-column"
            role="navigation"
            aria-label="Section navigation"
          >
            <li class="nav-item">
              <a
                href="#projects"
                class="nav-link"
                :class="{ active: activeTab === 'projects' && !selectedSlug }"
                @click.prevent="openProjects"
              >
                <i class="nav-icon bi bi-collection"></i>
                <p>Projects</p>
              </a>
            </li>
            <li v-if="activeTab === 'projects' && selectedSlug" class="nav-item">
              <a href="#viewer" class="nav-link active" @click.prevent>
                <i class="nav-icon bi bi-eye"></i>
                <p>Viewer</p>
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#certificates"
                class="nav-link"
                :class="{ active: activeTab === 'certificates' }"
                @click.prevent="openCertificates"
              >
                <i class="nav-icon bi bi-award"></i>
                <p>Certificates</p>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>

    <main id="main" class="app-main">
      <div class="app-content-header">
        <div class="container-fluid">
          <div class="row mb-2 align-items-start">
            <div class="col">
              <h3 class="mb-0">{{ contentTitle }}</h3>
              <p v-if="activeTab === 'projects' && !selectedSlug" class="text-muted small mb-0">
                Highlights and projects are loaded from folders under
                <code>public/highlights/</code> and <code>public/projects/</code>. See
                <code>public/projects/CONFIGURATION.md</code> for the JSON schema.
              </p>
              <p v-else-if="activeTab === 'projects' && selectedSlug" class="text-muted small mb-0">
                Full-size project view. Use <strong>All projects</strong> to return to the grid.
              </p>
              <p v-else class="text-muted small mb-0">
                PDF files under <code>public/certificates/</code> are listed by the same sync script as
                projects. Filename (without <code>.pdf</code>) is the card title.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="app-content pb-4">
        <div class="container-fluid">
          <template v-if="activeTab === 'projects'">
            <div v-if="selectedSlug && selectedEntry" id="viewer">
              <div class="mb-3">
                <button type="button" class="btn btn-outline-secondary" @click="clearViewer">
                  <i class="bi bi-arrow-left me-1"></i>{{ selectedKind === 'highlight' ? 'All highlights' : 'All projects' }}
                </button>
              </div>
              <ProjectViewer
                :slug="selectedEntry.slug"
                :project="selectedEntry.project || {}"
                :error="selectedEntry.error"
                :base-path="viewerBasePath"
              />
            </div>
            <div v-else-if="selectedSlug" class="alert alert-warning">
              {{ selectedKind === 'highlight' ? 'Highlight' : 'Project' }} not found.
              <button type="button" class="btn btn-link alert-link p-0 ms-1" @click="clearViewer">
                Back to list
              </button>
            </div>
            <template v-else>
              <section v-if="highlights.length || highlightsLoading || highlightsError" id="highlights" class="mb-5">
                <h4 class="mb-3">Highlights</h4>
                <ProjectPortfolio
                  :items="highlights"
                  :loading="highlightsLoading"
                  :load-error="highlightsError"
                  base-path="highlights"
                  @view-project="onViewHighlight"
                />
              </section>
              <section id="projects">
                <h4 v-if="highlights.length || highlightsLoading || highlightsError" class="mb-3">Projects</h4>
                <ProjectPortfolio
                  :items="items"
                  :loading="loading"
                  :load-error="loadError"
                  @view-project="onViewProject"
                />
              </section>
            </template>
          </template>
          <div v-else id="certificates">
            <CertificatePortfolio />
          </div>
        </div>
      </div>
    </main>

    <ThemeWelcomeModal
      v-if="welcomeOpen"
      :themes="themes"
      :theme="theme"
      @update:theme="onThemeChange"
      @confirm="onWelcomeConfirm"
    />

    <SettingsDialog
      v-if="settingsOpen"
      :theme="theme"
      :accent="accent"
      :themes="themes"
      @close="settingsOpen = false"
      @update:theme="onThemeChange"
      @update:accent="onAccentChange"
    />
  </div>
</template>

<script>
import { loadAllProjects, loadAllHighlights } from './services/portfolio'
import ProjectPortfolio from './components/ProjectPortfolio.vue'
import ProjectViewer from './components/ProjectViewer.vue'
import CertificatePortfolio from './components/CertificatePortfolio.vue'
import SettingsDialog from './components/SettingsDialog.vue'
import ThemeWelcomeModal from './components/ThemeWelcomeModal.vue'
import { THEMES } from '@/constants/themes'
import {
  getStoredTheme,
  getThemeAccent,
  applyTheme,
  applyAccent,
  hasPickedTheme,
  markThemePicked
} from '@/utils/applyTheme'

export default {
  name: 'App',
  components: {
    ProjectPortfolio,
    ProjectViewer,
    CertificatePortfolio,
    SettingsDialog,
    ThemeWelcomeModal
  },
  data () {
    const theme = getStoredTheme()
    return {
      activeTab: 'projects',
      items: [],
      loading: true,
      loadError: null,
      highlights: [],
      highlightsLoading: true,
      highlightsError: null,
      selectedSlug: null,
      selectedKind: 'project',
      theme,
      accent: getThemeAccent(theme),
      themes: THEMES,
      settingsOpen: false,
      welcomeOpen: false
    }
  },
  computed: {
    selectedEntry () {
      if (!this.selectedSlug) return null
      const list = this.selectedKind === 'highlight' ? this.highlights : this.items
      return list.find((i) => i.slug === this.selectedSlug) || null
    },
    viewerBasePath () {
      return this.selectedKind === 'highlight' ? 'highlights' : 'projects'
    },
    contentTitle () {
      if (this.activeTab === 'certificates') {
        return 'Certificates'
      }
      if (this.selectedSlug && this.selectedEntry?.project?.title) {
        return this.selectedEntry.project.title
      }
      if (this.selectedSlug) {
        return this.selectedSlug
      }
      return 'Projects'
    }
  },
  async mounted () {
    if (!hasPickedTheme()) {
      this.welcomeOpen = true
    }

    try {
      this.items = await loadAllProjects()
    } catch (e) {
      this.loadError = e.message || String(e)
    } finally {
      this.loading = false
    }

    try {
      this.highlights = await loadAllHighlights()
    } catch (e) {
      this.highlightsError = e.message || String(e)
    } finally {
      this.highlightsLoading = false
    }
  },
  methods: {
    onThemeChange (themeId) {
      this.theme = applyTheme(themeId)
      this.accent = getThemeAccent(themeId)
      applyAccent(null)
    },
    onAccentChange (value) {
      this.accent = value
      applyAccent(value)
    },
    onWelcomeConfirm (themeId) {
      this.onThemeChange(themeId)
      markThemePicked()
      this.welcomeOpen = false
    },
    goHome () {
      this.activeTab = 'projects'
      this.selectedSlug = null
      this.selectedKind = 'project'
    },
    openProjects () {
      this.activeTab = 'projects'
      this.selectedSlug = null
      this.selectedKind = 'project'
    },
    openCertificates () {
      this.activeTab = 'certificates'
      this.selectedSlug = null
      this.selectedKind = 'project'
    },
    clearViewer () {
      this.selectedSlug = null
      this.selectedKind = 'project'
    },
    onViewProject (slug) {
      this.selectedKind = 'project'
      this.selectedSlug = slug
    },
    onViewHighlight (slug) {
      this.selectedKind = 'highlight'
      this.selectedSlug = slug
    }
  }
}
</script>
