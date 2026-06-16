<template>
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="settings-dialog card vido-card" role="dialog" aria-modal="true" aria-label="Settings">
      <div class="card-header">
        <h3 class="card-title">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </h3>
        <button type="button" class="close-btn" title="Close" @click="$emit('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="settings-body">
        <nav class="settings-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="settings-tab"
            :class="{ 'settings-tab--active': tab.id === activeTab }"
            @click="activeTab = tab.id"
          >
            <i :class="tab.icon"></i>
            <span>{{ tab.label }}</span>
          </button>
        </nav>

        <div class="settings-content">
          <template v-if="activeTab === 'appearance'">
            <div class="form-row">
              <label class="form-label">Theme</label>
              <select
                class="form-control"
                :value="theme"
                @change="$emit('update:theme', $event.target.value)"
              >
                <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.label }}</option>
              </select>
              <p class="form-hint">Switches the global token palette.</p>
            </div>
            <div class="form-row">
              <label class="form-label">Accent override</label>
              <input
                type="color"
                class="form-control form-control--color"
                :value="accent"
                @input="$emit('update:accent', $event.target.value)"
              />
              <p class="form-hint">White-label hook — overrides --vido-accent at runtime.</p>
            </div>
          </template>

          <template v-else-if="activeTab === 'shortcuts'">
            <table class="kb-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Binding</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in bindings" :key="b.action">
                  <td>{{ b.action }}</td>
                  <td><kbd>{{ b.keys }}</kbd></td>
                </tr>
              </tbody>
            </table>
          </template>

          <template v-else>
            <div class="form-row">
              <label class="form-label">Display name</label>
              <input type="text" class="form-control" placeholder="Your name" />
              <p class="form-hint">Shown in the navbar project label.</p>
            </div>
          </template>
        </div>
      </div>

      <div class="card-footer settings-footer">
        <button type="button" class="change-btn" @click="$emit('close')">Done</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsDialog',
  props: {
    theme: { type: String, default: 'default' },
    accent: { type: String, default: '#58a6ff' },
    themes: { type: Array, default: () => [] }
  },
  emits: ['close', 'update:theme', 'update:accent'],
  data() {
    return {
      activeTab: 'appearance',
      tabs: [
        { id: 'appearance', label: 'Appearance', icon: 'fas fa-palette' },
        { id: 'shortcuts', label: 'Shortcuts', icon: 'fas fa-keyboard' },
        { id: 'general', label: 'General', icon: 'fas fa-sliders-h' }
      ],
      bindings: [
        { action: 'Toggle library', keys: 'Ctrl + B' },
        { action: 'Open settings', keys: 'Ctrl + ,' },
        { action: 'Focus search', keys: '/' },
        { action: 'Close dialog', keys: 'Esc' }
      ]
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onKeydown(e) {
      if (e.key === 'Escape') this.$emit('close')
    }
  }
}
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  inset: 0;
  background: var(--vido-overlay);
  z-index: 5000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.settings-dialog.vido-card {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: 620px;
  max-width: 100%;
  max-height: 80vh;
}

.close-btn {
  background: transparent;
  border: 1px solid transparent;
  color: var(--vido-text-secondary);
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}
.close-btn:hover {
  background: var(--vido-bg-elevated);
  color: var(--vido-text-primary);
}

.settings-body {
  display: flex;
  min-height: 0;
}

.settings-tabs {
  flex: 0 0 150px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 8px;
  border-right: 1px solid var(--vido-border-muted);
  background: var(--vido-bg-page);
}
.settings-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  background: transparent;
  border: none;
  color: var(--vido-text-secondary);
  font-size: 13px;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}
.settings-tab i {
  width: 14px;
  font-size: 12px;
}
.settings-tab:hover {
  background: var(--vido-bg-hover);
  color: var(--vido-text-primary);
}
.settings-tab--active {
  background: var(--vido-bg-elevated);
  color: var(--vido-accent);
  font-weight: 600;
}

.settings-content {
  flex: 1 1 auto;
  min-width: 0;
  overflow-y: auto;
  padding: 16px;
}

.form-row {
  margin-bottom: 16px;
}
.form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--vido-text-secondary);
  margin-bottom: 5px;
}
.form-hint {
  font-size: 12px;
  color: var(--vido-text-muted);
  margin: 5px 0 0;
}
.form-control--color {
  width: 56px;
  height: 30px;
  padding: 2px;
}

.kb-table {
  width: 100%;
  border-collapse: collapse;
}
.kb-table th {
  text-align: left;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--vido-text-muted);
  padding: 6px 8px;
  border-bottom: 1px solid var(--vido-border-default);
}
.kb-table td {
  font-size: 12px;
  color: var(--vido-text-primary);
  padding: 8px;
  border-bottom: 1px solid var(--vido-border-default);
}
.kb-table kbd {
  font-family: var(--vido-font-mono);
  font-size: 11px;
  color: var(--vido-text-secondary);
  background: var(--vido-bg-page);
  border: 1px solid var(--vido-border-default);
  border-radius: 4px;
  padding: 2px 6px;
}

.settings-footer {
  display: flex;
  justify-content: flex-end;
}
.change-btn {
  background: var(--vido-bg-elevated);
  border: 1px solid var(--vido-border-default);
  color: var(--vido-text-primary);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: border-color 0.14s ease, background 0.14s ease;
}
.change-btn:hover {
  border-color: var(--vido-accent);
}
</style>
