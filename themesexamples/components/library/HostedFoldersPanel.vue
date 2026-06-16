<template>
  <section class="card card-outline vido-card panel">
    <div class="card-header">
      <h3 class="card-title">
        <i class="fas fa-folder-tree"></i>
        <span>Library</span>
      </h3>
      <div class="card-tools">
        <button type="button" class="hf-sync-btn" @click="$emit('add-folder')">
          <i class="fas fa-plus"></i>
          <span>Add</span>
        </button>
      </div>
    </div>

    <div class="panel__controls">
      <MediaFilterSegmentGroup v-model="filter" :options="filterOptions" />
      <div class="hf-media-tabs">
        <button
          v-for="tab in mediaTabs"
          :key="tab.id"
          type="button"
          class="hf-media-tab"
          :class="{ 'hf-media-tab--active': activeTabs.includes(tab.id) }"
          :title="tab.label"
          @click="toggleTab(tab.id)"
        >
          <i :class="tab.icon"></i>
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <div class="card-body panel__body">
      <ul v-if="visibleFolders.length" class="hf-list">
        <li
          v-for="folder in visibleFolders"
          :key="folder.id"
          class="hf-item"
          tabindex="0"
          @click="$emit('select-folder', folder)"
          @keydown.enter="$emit('select-folder', folder)"
        >
          <i class="fas fa-folder hf-item__icon"></i>
          <span class="hf-item__name">{{ folder.name }}</span>
          <span class="hf-item__count">{{ folder.count }}</span>
        </li>
      </ul>

      <div v-else class="empty-state">
        <i class="fas fa-folder-open empty-state__icon"></i>
        <p class="empty-state__title">No folders yet</p>
        <p class="empty-state__subtitle">Add a folder to start building your library.</p>
        <button type="button" class="hf-sync-btn" @click="$emit('add-folder')">
          <i class="fas fa-plus"></i>
          <span>Add folder</span>
        </button>
      </div>
    </div>

    <div class="card-footer panel__footer">
      <span>{{ visibleFolders.length }} of {{ folders.length }} folders</span>
    </div>
  </section>
</template>

<script>
import MediaFilterSegmentGroup from '@/components/library/MediaFilterSegmentGroup.vue'

export default {
  name: 'HostedFoldersPanel',
  components: { MediaFilterSegmentGroup },
  props: {
    folders: { type: Array, default: () => [] }
  },
  emits: ['add-folder', 'select-folder'],
  data() {
    return {
      filter: 'all',
      filterOptions: [
        { value: 'all', label: 'All', icon: 'fas fa-list' },
        { value: 'recent', label: 'Recent', icon: 'fas fa-clock' },
        { value: 'pinned', label: 'Pinned', icon: 'fas fa-thumbtack' }
      ],
      mediaTabs: [
        { id: 'video', label: 'Video', icon: 'fas fa-film' },
        { id: 'audio', label: 'Audio', icon: 'fas fa-music' },
        { id: 'image', label: 'Images', icon: 'fas fa-image' }
      ],
      activeTabs: ['video', 'audio', 'image']
    }
  },
  computed: {
    visibleFolders() {
      if (this.filter === 'all') return this.folders
      return this.folders.filter((f) => f.tag === this.filter)
    }
  },
  methods: {
    toggleTab(id) {
      const idx = this.activeTabs.indexOf(id)
      if (idx === -1) this.activeTabs.push(id)
      else this.activeTabs.splice(idx, 1)
    }
  }
}
</script>

<style scoped>
.panel.vido-card {
  display: grid;
  grid-template-rows: auto auto minmax(0, 1fr) auto;
  height: 100%;
}

.hf-sync-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--vido-export);
  border: 1px solid var(--vido-export);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.14s ease;
}
.hf-sync-btn:hover {
  background: var(--vido-export-hover);
}

.panel__controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 14px;
  border-bottom: 1px solid var(--vido-border-muted);
  background: var(--vido-bg-panel);
}

.hf-media-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.hf-media-tab {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  max-width: 160px;
  border: 1px solid var(--vido-media-tab-border);
  border-radius: 8px;
  background: var(--vido-media-tab-gradient);
  color: var(--vido-text-secondary);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 9px;
  cursor: pointer;
  transition: color 0.14s ease, border-color 0.14s ease;
}
.hf-media-tab i {
  font-size: 10px;
}
.hf-media-tab span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hf-media-tab--active {
  background: var(--vido-media-tab-active-gradient);
  color: var(--vido-accent);
  border-color: var(--vido-accent-tint-strong);
}

.panel__body {
  min-height: 0;
  overflow-y: auto;
}

.hf-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.hf-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s ease;
}
.hf-item:hover {
  background: var(--vido-bg-hover);
}
.hf-item__icon {
  color: var(--vido-text-secondary);
  font-size: 12px;
}
.hf-item__name {
  flex: 1 1 auto;
  font-size: 13px;
  color: var(--vido-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.hf-item__count {
  font-family: var(--vido-font-mono);
  font-size: 10px;
  color: var(--vido-text-muted);
  background: var(--vido-bg-page);
  border: 1px solid var(--vido-border-muted);
  padding: 1px 6px;
  border-radius: 999px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 100%;
  text-align: center;
  padding: 24px;
}
.empty-state__icon {
  font-size: 34px;
  color: var(--vido-text-muted);
  opacity: 0.6;
}
.empty-state__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vido-text-primary);
  margin: 4px 0 0;
}
.empty-state__subtitle {
  font-size: 12px;
  color: var(--vido-text-muted);
  margin: 0 0 6px;
}

.panel__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
