<template>
  <div class="settings-overlay" @click.self="$emit('close')">
    <div class="settings-dialog card vido-card" role="dialog" aria-modal="true" aria-label="Settings">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-gear"></i>
          <span>Settings</span>
        </h3>
        <button type="button" class="close-btn" title="Close" @click="$emit('close')">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <div class="settings-content">
        <div class="form-row">
          <label class="form-label">Theme</label>
          <select
            class="form-control"
            :value="theme"
            @change="$emit('update:theme', $event.target.value)"
          >
            <option v-for="t in themes" :key="t.id" :value="t.id">{{ t.label }}</option>
          </select>
          <p class="form-hint">Switches the global color palette.</p>
        </div>
        <div class="form-row">
          <label class="form-label">Accent override</label>
          <input
            type="color"
            class="form-control form-control--color"
            :value="accent"
            @input="$emit('update:accent', $event.target.value)"
          />
          <p class="form-hint">Optional accent color override.</p>
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
  mounted () {
    window.addEventListener('keydown', this.onKeydown)
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.onKeydown)
  },
  methods: {
    onKeydown (e) {
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
  width: 420px;
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
