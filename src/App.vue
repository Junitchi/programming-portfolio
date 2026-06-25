<template>
  <div class="app-wrapper">
    <nav class="app-header navbar navbar-expand border-bottom">
      <div class="container-fluid">
        <ul class="navbar-nav align-items-center">
          <li class="nav-item">
            <button
              type="button"
              class="nav-link btn btn-link border-0 sidebar-toggle"
              :aria-label="sidebarOpen ? 'Close navigation menu' : 'Open navigation menu'"
              :aria-expanded="sidebarOpen"
              @click="toggleSidebar"
            >
              <i class="bi bi-list fs-4"></i>
              <span class="sidebar-toggle__label d-lg-none">Menu</span>
            </button>
          </li>
          <li class="nav-item d-none d-md-flex align-items-center">
            <span class="nav-link mb-0 fw-semibold">Programming portfolio</span>
          </li>
          <li class="nav-item d-md-none">
            <span class="nav-link mb-0 fw-semibold mobile-header-title">{{ contentTitle }}</span>
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

    <div
      v-if="sidebarOpen && isMobileLayout"
      class="sidebar-overlay"
      aria-hidden="true"
      @click="closeSidebar"
    ></div>

    <aside class="app-sidebar shadow">
      <div class="sidebar-brand">
        <a href="#main" class="brand-link" @click.prevent="onSidebarNav(goHome)">
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
                @click.prevent="onSidebarNav(openProjects)"
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
                href="#resume"
                class="nav-link"
                :class="{ active: activeTab === 'resume' }"
                @click.prevent="onSidebarNav(openResume)"
              >
                <i class="nav-icon bi bi-file-earmark-person"></i>
                <p>Resume</p>
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#certificates"
                class="nav-link"
                :class="{ active: activeTab === 'certificates' }"
                @click.prevent="onSidebarNav(openCertificates)"
              >
                <i class="nav-icon bi bi-award"></i>
                <p>Certificates</p>
              </a>
            </li>
            <li class="nav-item">
              <a
                href="#tech"
                class="nav-link"
                :class="{ active: activeTab === 'tech' }"
                @click.prevent="onSidebarNav(openTechStack)"
              >
                <i class="nav-icon bi bi-code-slash"></i>
                <p>Tech Stack</p>
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
                Highlights feature my cross-platform side projects—Vido Editor, a creator-focused video editor,
                and Medio Streamspace, a personal LAN media server—with promo videos and tech stacks.
                Projects showcase professional work at Multisystems: logistics and warehouse platforms
                (MultiRoute, WDCS, MS-SRI), internal business tools (MS Logbook, MS Geolocator), and
                developer utilities I built (clipboard managers, SQL test-data generator, scanner simulator).
                Open any card for screenshots, descriptions, and links.
              </p>
              <p v-else-if="activeTab === 'projects' && selectedSlug" class="text-muted small mb-0">
                Full-size project view. Use <strong>All projects</strong> to return to the grid.
              </p>
              <p v-else-if="activeTab === 'resume'" class="text-muted small mb-0">
                Professional background, experience, education, and skills. Use the gear icon to change the
                theme and accent color—the resume updates with your choices, so you can preview different
                styles before downloading a PDF.
              </p>
              <p v-else-if="activeTab === 'certificates'" class="text-muted small mb-0">
                PDF files under <code>public/certificates/</code> are listed by the same sync script as
                projects. Filename (without <code>.pdf</code>) is the card title.
              </p>
              <p v-else-if="activeTab === 'tech'" class="text-muted small mb-0">
                Languages, frameworks, data tools, and related concepts grouped by category.
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
          <div v-else-if="activeTab === 'resume'" id="resume">
            <ResumeView />
          </div>
          <div v-else-if="activeTab === 'certificates'" id="certificates">
            <CertificatePortfolio />
          </div>
          <div v-else-if="activeTab === 'tech'" id="tech">
            <TechStackPortfolio />
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

    <nav class="mobile-bottom-nav d-lg-none" aria-label="Primary navigation">
      <button
        v-for="item in mobileNavItems"
        :key="item.id"
        type="button"
        class="mobile-bottom-nav__item"
        :class="{ active: mobileNavActiveId === item.id }"
        :aria-current="mobileNavActiveId === item.id ? 'page' : undefined"
        @click="onMobileNav(item.id)"
      >
        <i :class="item.icon" aria-hidden="true"></i>
        <span>{{ item.label }}</span>
      </button>
    </nav>
  </div>
</template>

<script>
import { loadAllProjects, loadAllHighlights } from './services/portfolio'
import ProjectPortfolio from './components/ProjectPortfolio.vue'
import ProjectViewer from './components/ProjectViewer.vue'
import CertificatePortfolio from './components/CertificatePortfolio.vue'
import TechStackPortfolio from './components/TechStackPortfolio.vue'
import ResumeView from './components/ResumeView.vue'
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

const SIDEBAR_BREAKPOINT = 992

export default {
  name: 'App',
  components: {
    ProjectPortfolio,
    ProjectViewer,
    CertificatePortfolio,
    TechStackPortfolio,
    ResumeView,
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
      canHistoryBackToList: false,
      theme,
      accent: getThemeAccent(theme),
      themes: THEMES,
      settingsOpen: false,
      welcomeOpen: false,
      sidebarOpen: false,
      isMobileLayout: false
    }
  },
  computed: {
    mobileNavItems () {
      return [
        { id: 'projects', label: 'Projects', icon: 'bi bi-collection' },
        { id: 'resume', label: 'Resume', icon: 'bi bi-file-earmark-person' },
        { id: 'certificates', label: 'Certs', icon: 'bi bi-award' },
        { id: 'tech', label: 'Tech', icon: 'bi bi-code-slash' }
      ]
    },
    mobileNavActiveId () {
      return this.activeTab
    },
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
      if (this.activeTab === 'resume') {
        return 'Resume'
      }
      if (this.activeTab === 'tech') {
        return 'Tech Stack'
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
    window.addEventListener('popstate', this.onPopState)
    window.addEventListener('resize', this.syncLayoutMode)
    this.syncLayoutMode()

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

    this.applyRouteFromHash()
    if (!window.location.hash) {
      this.syncHistory({ replace: true })
    }
  },
  beforeUnmount () {
    window.removeEventListener('popstate', this.onPopState)
    window.removeEventListener('resize', this.syncLayoutMode)
  },
  methods: {
    syncLayoutMode () {
      const mobile = window.innerWidth < SIDEBAR_BREAKPOINT
      this.isMobileLayout = mobile
      if (mobile) {
        if (!this.sidebarOpen) {
          this.applySidebarState(false)
        } else {
          this.applySidebarState(true)
        }
      } else {
        this.sidebarOpen = false
        document.body.classList.remove('sidebar-open')
      }
    },
    applySidebarState (open) {
      document.body.classList.toggle('sidebar-open', open)
      document.body.classList.toggle('sidebar-collapse', !open)
    },
    toggleSidebar () {
      if (this.isMobileLayout) {
        this.sidebarOpen = !this.sidebarOpen
        this.applySidebarState(this.sidebarOpen)
        return
      }
      document.body.classList.toggle('sidebar-collapse')
    },
    closeSidebar () {
      if (!this.sidebarOpen) return
      this.sidebarOpen = false
      this.applySidebarState(false)
    },
    onSidebarNav (handler) {
      handler.call(this)
      this.closeSidebar()
    },
    onMobileNav (tabId) {
      if (tabId === 'projects') {
        this.openProjects()
      } else if (tabId === 'resume') {
        this.openResume()
      } else if (tabId === 'certificates') {
        this.openCertificates()
      } else if (tabId === 'tech') {
        this.openTechStack()
      }
      this.closeSidebar()
    },
    parseRouteFromHash () {
      const raw = window.location.hash.replace(/^#/, '').trim()
      const parts = raw.split('/').filter(Boolean)
      const section = parts[0] || 'projects'

      if (section === 'certificates') {
        return { activeTab: 'certificates', selectedSlug: null, selectedKind: 'project' }
      }
      if (section === 'resume') {
        return { activeTab: 'resume', selectedSlug: null, selectedKind: 'project' }
      }
      if (section === 'tech') {
        return { activeTab: 'tech', selectedSlug: null, selectedKind: 'project' }
      }
      if (section === 'highlights') {
        return {
          activeTab: 'projects',
          selectedSlug: parts[1] ? decodeURIComponent(parts[1]) : null,
          selectedKind: 'highlight'
        }
      }
      return {
        activeTab: 'projects',
        selectedSlug: parts[1] ? decodeURIComponent(parts[1]) : null,
        selectedKind: 'project'
      }
    },
    buildHashFromState () {
      if (this.activeTab === 'certificates') return 'certificates'
      if (this.activeTab === 'resume') return 'resume'
      if (this.activeTab === 'tech') return 'tech'
      if (this.selectedSlug) {
        const prefix = this.selectedKind === 'highlight' ? 'highlights' : 'projects'
        return `${prefix}/${encodeURIComponent(this.selectedSlug)}`
      }
      return 'projects'
    },
    syncHistory ({ replace = false } = {}) {
      const hash = this.buildHashFromState()
      const url = `${window.location.pathname}${window.location.search}#${hash}`
      if (replace) {
        history.replaceState({ appRoute: hash }, '', url)
      } else {
        history.pushState({ appRoute: hash }, '', url)
      }
    },
    applyRouteFromHash () {
      const route = this.parseRouteFromHash()
      this.activeTab = route.activeTab
      this.selectedSlug = route.selectedSlug
      this.selectedKind = route.selectedKind
      this.canHistoryBackToList = false
    },
    onPopState () {
      this.applyRouteFromHash()
    },
    navigateToProjectsList ({ replace = false } = {}) {
      this.activeTab = 'projects'
      this.selectedSlug = null
      this.selectedKind = 'project'
      this.canHistoryBackToList = false
      this.syncHistory({ replace })
    },
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
      if (this.selectedSlug && this.canHistoryBackToList) {
        this.clearViewer()
        return
      }
      this.navigateToProjectsList({ replace: false })
    },
    openProjects () {
      if (this.selectedSlug && this.canHistoryBackToList) {
        this.clearViewer()
        return
      }
      this.navigateToProjectsList({ replace: false })
    },
    openCertificates () {
      this.activeTab = 'certificates'
      this.selectedSlug = null
      this.selectedKind = 'project'
      this.canHistoryBackToList = false
      this.syncHistory()
    },
    openResume () {
      this.activeTab = 'resume'
      this.selectedSlug = null
      this.selectedKind = 'project'
      this.canHistoryBackToList = false
      this.syncHistory()
    },
    openTechStack () {
      this.activeTab = 'tech'
      this.selectedSlug = null
      this.selectedKind = 'project'
      this.canHistoryBackToList = false
      this.syncHistory()
    },
    clearViewer () {
      if (this.canHistoryBackToList) {
        this.canHistoryBackToList = false
        history.back()
        return
      }
      this.navigateToProjectsList({ replace: true })
    },
    onViewProject (slug) {
      this.selectedKind = 'project'
      this.selectedSlug = slug
      this.canHistoryBackToList = true
      this.syncHistory()
    },
    onViewHighlight (slug) {
      this.selectedKind = 'highlight'
      this.selectedSlug = slug
      this.canHistoryBackToList = true
      this.syncHistory()
    }
  }
}
</script>

<style scoped>
.sidebar-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  color: inherit;
  text-decoration: none;
}

.sidebar-toggle:hover,
.sidebar-toggle:focus-visible {
  color: var(--vido-accent);
  background-color: var(--vido-accent-tint);
}

.sidebar-toggle__label {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
}

.mobile-header-title {
  max-width: 52vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 0;
}

.mobile-bottom-nav {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1040;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.15rem;
  padding: 0.35rem 0.5rem calc(0.35rem + env(safe-area-inset-bottom, 0px));
  background-color: var(--vido-bg-panel, #fff);
  border-top: 1px solid var(--vido-border-muted, rgba(0, 0, 0, 0.08));
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(12px);
}

.mobile-bottom-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.15rem;
  min-height: 3.25rem;
  padding: 0.35rem 0.25rem;
  border: 0;
  border-radius: 0.75rem;
  background: transparent;
  color: var(--vido-text-secondary, #6c757d);
  font-size: 0.68rem;
  font-weight: 600;
  line-height: 1.1;
  transition: color 0.15s ease, background-color 0.15s ease;
}

.mobile-bottom-nav__item i {
  font-size: 1.2rem;
  line-height: 1;
}

.mobile-bottom-nav__item.active {
  color: var(--vido-accent, #0d6efd);
  background-color: var(--vido-accent-tint, rgba(13, 110, 253, 0.12));
}

.mobile-bottom-nav__item:focus-visible {
  outline: 2px solid var(--vido-accent, #0d6efd);
  outline-offset: 2px;
}

@media (max-width: 991.98px) {
  :deep(.app-main) {
    padding-bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px));
  }
}
</style>

<style>
@media (max-width: 991.98px) {
  .sidebar-overlay {
    position: fixed;
    inset: 0;
    z-index: 1037;
    background-color: rgba(0, 0, 0, 0.35);
    animation: mobile-sidebar-fade-in 0.2s ease;
  }

  body.sidebar-open .app-sidebar {
    z-index: 1038;
  }
}

@keyframes mobile-sidebar-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
