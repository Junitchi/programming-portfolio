<template>
  <div class="app-shell">
    <AppNavbar
      app-title="Factor-E"
      project-label="Streamspace Style Kit"
      :active-nav="activeNav"
      @navigate="activeNav = $event"
      @open-settings="settingsOpen = true"
    />

    <main class="main-layout">
      <div
        class="main-row"
        :class="{ 'main-row--collapsed': libraryCollapsed }"
      >
        <!-- Library pane (left) -->
        <section
          class="pane library-pane"
          :class="{ 'pane--mobile-hidden': mobilePane !== 'library' }"
        >
          <button
            type="button"
            class="library-pane__split-toggle"
            :title="libraryCollapsed ? 'Expand library' : 'Collapse library'"
            @click="libraryCollapsed = !libraryCollapsed"
          >
            <i :class="libraryCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
          </button>

          <div v-show="!libraryCollapsed" class="pane__content">
            <HostedFoldersPanel
              :folders="folders"
              @add-folder="addFolder"
              @select-folder="onSelectFolder"
            />
          </div>
        </section>

        <!-- Player / content pane (right) -->
        <section
          class="pane player-pane"
          :class="{ 'pane--mobile-hidden': mobilePane !== 'player' }"
        >
          <section class="card card-outline vido-card content-card">
            <div class="card-header">
              <h3 class="card-title">
                <i class="fas fa-compass"></i>
                <span>{{ selectedFolder ? selectedFolder.name : 'Browse' }}</span>
              </h3>
              <div class="card-tools">
                <MediaFilterSegmentGroup v-model="sort" :options="sortOptions" />
              </div>
            </div>
            <div class="card-body content-card__body">
              <div class="media-grid">
                <MediaCard
                  v-for="item in media"
                  :key="item.id"
                  :item="item"
                  @open="onOpenMedia"
                />
              </div>
            </div>
            <div class="card-footer">
              <span>{{ media.length }} items</span>
            </div>
          </section>
        </section>
      </div>
    </main>

    <!-- Mobile FAB toggles between panes -->
    <button
      type="button"
      class="pane-toggle-fab"
      :title="mobilePane === 'library' ? 'Show content' : 'Show library'"
      @click="toggleMobilePane"
    >
      <i :class="mobilePane === 'library' ? 'fas fa-photo-film' : 'fas fa-folder-open'"></i>
    </button>

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
import AppNavbar from '@/components/layout/AppNavbar.vue'
import HostedFoldersPanel from '@/components/library/HostedFoldersPanel.vue'
import MediaFilterSegmentGroup from '@/components/library/MediaFilterSegmentGroup.vue'
import MediaCard from '@/components/browser/MediaCard.vue'
import SettingsDialog from '@/components/settings/SettingsDialog.vue'
import { THEMES } from '@/constants/themes'
import { getStoredTheme, applyTheme, applyAccent } from '@/utils/applyTheme'

export default {
  name: 'App',
  components: {
    AppNavbar,
    HostedFoldersPanel,
    MediaFilterSegmentGroup,
    MediaCard,
    SettingsDialog
  },
  data() {
    return {
      activeNav: 'library',
      settingsOpen: false,
      libraryCollapsed: false,
      mobilePane: 'library',
      theme: getStoredTheme(),
      accent: '#58a6ff',
      themes: THEMES,
      sort: 'recent',
      sortOptions: [
        { value: 'recent', label: 'Recent', icon: 'fas fa-clock' },
        { value: 'name', label: 'Name', icon: 'fas fa-font' },
        { value: 'size', label: 'Size', icon: 'fas fa-database' }
      ],
      selectedFolder: null,
      folders: [
        { id: 1, name: 'Documentaries', count: 42, tag: 'pinned' },
        { id: 2, name: 'Home Videos', count: 18, tag: 'recent' },
        { id: 3, name: 'Music Library', count: 311, tag: 'all' },
        { id: 4, name: 'Photography', count: 87, tag: 'recent' }
      ],
      media: [
        { id: 1, title: 'Aurora Timelapse', subtitle: '4K · 12:04', badge: '4K', icon: 'fas fa-film' },
        { id: 2, title: 'Coastline Drone Pass', subtitle: '1080p · 03:21', badge: 'HD', icon: 'fas fa-helicopter' },
        { id: 3, title: 'Studio Session', subtitle: 'FLAC · 48:10', badge: 'FLAC', icon: 'fas fa-music' },
        { id: 4, title: 'City Lights', subtitle: 'JPG · 6000×4000', badge: 'RAW', icon: 'fas fa-image' },
        { id: 5, title: 'Forest Walk', subtitle: '4K · 21:55', badge: '4K', icon: 'fas fa-tree' },
        { id: 6, title: 'Interview Cut', subtitle: '1080p · 33:02', badge: 'HD', icon: 'fas fa-microphone' }
      ]
    }
  },
  methods: {
    toggleMobilePane() {
      this.mobilePane = this.mobilePane === 'library' ? 'player' : 'library'
    },
    addFolder() {
      const id = this.folders.length + 1
      this.folders.push({ id, name: `New Folder ${id}`, count: 0, tag: 'recent' })
    },
    onSelectFolder(folder) {
      this.selectedFolder = folder
      this.mobilePane = 'player'
    },
    onOpenMedia(item) {
      // placeholder: hook for opening the player
      console.log('open media', item.title)
    },
    onThemeChange(themeId) {
      this.theme = applyTheme(themeId)
      const found = this.themes.find((t) => t.id === themeId)
      if (found) this.accent = found.accent
      applyAccent(null)
    },
    onAccentChange(value) {
      this.accent = value
      applyAccent(value)
    }
  }
}
</script>

<style>
/* App shell — global (unscoped) so it controls html/body/#app sizing. */
html,
body,
#app {
  height: 100%;
  overflow: hidden;
}

.app-shell {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  height: 100vh;
}

.main-layout {
  min-height: 0;
  overflow: hidden;
}

/* Custom CSS Grid (NOT bootstrap .row) to avoid flex height bugs. */
.main-row {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: minmax(0, 1fr);
  height: 100%;
  gap: 10px;
  padding: 10px;
}

.pane {
  min-height: 0;
  min-width: 0;
  overflow: hidden;
}

.pane__content {
  height: 100%;
  min-height: 0;
}

.library-pane {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}

/* Desktop collapse strip — accent gradient with chevron. */
.library-pane__split-toggle {
  display: none;
}

/* Mobile: single column, one pane at a time. */
@media (max-width: 767.98px) {
  .pane--mobile-hidden {
    display: none;
  }
}

/* Tablet/Desktop: two-column grid. */
@media (min-width: 768px) {
  .main-row {
    grid-template-columns: 3.5fr 8.5fr;
  }
  .main-row--collapsed {
    grid-template-columns: 28px minmax(0, 1fr);
  }
  .pane--mobile-hidden {
    display: block;
  }

  .library-pane {
    grid-template-columns: minmax(0, 1fr) 22px;
  }
  .library-pane__split-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    grid-column: 2;
    width: 22px;
    border: none;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(
      180deg,
      var(--vido-navbar-gradient-start),
      var(--vido-navbar-gradient-end)
    );
    border-left: 1px solid var(--vido-border-default);
    font-size: 10px;
  }
  .library-pane__split-toggle:hover {
    background: var(--vido-accent-tint-strong);
    color: var(--vido-accent);
  }
  .main-row--collapsed .library-pane {
    grid-template-columns: 28px;
  }
  .main-row--collapsed .library-pane__split-toggle {
    grid-column: 1;
    width: 28px;
  }
}

@media (min-width: 992px) {
  .main-row:not(.main-row--collapsed) {
    grid-template-columns: 3.25fr 8.75fr;
  }
}

/* Content card fills its pane with header + scroll body + footer. */
.content-card.vido-card {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  height: 100%;
}
.content-card__body {
  min-height: 0;
  overflow-y: auto;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

/* Mobile FAB. */
.pane-toggle-fab {
  position: fixed;
  bottom: 18px;
  right: 18px;
  width: 52px;
  height: 52px;
  border-radius: 999px;
  border: none;
  background: var(--vido-accent);
  color: var(--vido-accent-text);
  font-size: 18px;
  cursor: pointer;
  box-shadow: var(--vido-accent-glow), var(--vido-shadow-drop);
  z-index: 4000;
  transition: transform 0.12s ease;
}
.pane-toggle-fab:hover {
  transform: translateY(-1px);
}
@media (min-width: 768px) {
  .pane-toggle-fab {
    display: none;
  }
}
</style>
