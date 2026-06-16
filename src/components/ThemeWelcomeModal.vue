<template>
  <div class="welcome-overlay" role="dialog" aria-modal="true" aria-label="Choose your theme">
    <div class="welcome-dialog card vido-card">
      <div class="card-header">
        <h3 class="card-title">
          <i class="bi bi-palette"></i>
          <span>Welcome</span>
        </h3>
      </div>

      <div class="welcome-body">
        <p class="welcome-lead">Choose a theme for your portfolio. You can change it anytime from the settings icon.</p>

        <div class="theme-grid">
          <button
            v-for="t in themes"
            :key="t.id"
            type="button"
            class="theme-swatch"
            :class="{ 'theme-swatch--active': t.id === selected }"
            @click="selectTheme(t.id)"
          >
            <span class="theme-swatch__dot" :style="{ background: t.accent }"></span>
            <span class="theme-swatch__label">{{ t.label }}</span>
            <span class="theme-swatch__mode">{{ t.mode }}</span>
          </button>
        </div>
      </div>

      <div class="card-footer welcome-footer">
        <button type="button" class="confirm-btn" @click="confirm">
          Continue
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ThemeWelcomeModal',
  props: {
    themes: { type: Array, default: () => [] },
    theme: { type: String, default: 'default' }
  },
  emits: ['confirm', 'update:theme'],
  data () {
    return {
      selected: this.theme
    }
  },
  watch: {
    theme (value) {
      this.selected = value
    }
  },
  methods: {
    selectTheme (id) {
      this.selected = id
      this.$emit('update:theme', id)
    },
    confirm () {
      this.$emit('confirm', this.selected)
    }
  }
}
</script>

<style scoped>
.welcome-overlay {
  position: fixed;
  inset: 0;
  background: var(--vido-overlay);
  z-index: 6000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.welcome-dialog.vido-card {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  width: 520px;
  max-width: 100%;
  max-height: 85vh;
}

.welcome-body {
  padding: 20px;
  overflow-y: auto;
}

.welcome-lead {
  font-size: 14px;
  color: var(--vido-text-secondary);
  margin: 0 0 18px;
  line-height: 1.5;
}

.theme-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 10px;
}

.theme-swatch {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  text-align: left;
  background: var(--vido-bg-page);
  border: 1px solid var(--vido-border-default);
  border-radius: var(--vido-radius-control);
  padding: 12px;
  cursor: pointer;
  transition: border-color 0.14s ease, box-shadow 0.14s ease, background 0.14s ease;
}

.theme-swatch:hover {
  border-color: var(--vido-accent);
  background: var(--vido-bg-hover);
}

.theme-swatch--active {
  border-color: var(--vido-accent);
  box-shadow: var(--vido-accent-glow);
  background: var(--vido-accent-tint);
}

.theme-swatch__dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--vido-border-strong);
  flex-shrink: 0;
}

.theme-swatch__label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vido-text-heading);
}

.theme-swatch__mode {
  font-size: 11px;
  text-transform: capitalize;
  color: var(--vido-text-muted);
}

.welcome-footer {
  display: flex;
  justify-content: flex-end;
}

.confirm-btn {
  background: var(--vido-accent);
  border: 1px solid var(--vido-accent);
  color: var(--vido-accent-text);
  font-size: 13px;
  font-weight: 600;
  padding: 8px 18px;
  border-radius: var(--vido-radius-control);
  cursor: pointer;
  transition: background 0.14s ease, border-color 0.14s ease;
}

.confirm-btn:hover {
  background: var(--vido-accent-hover);
  border-color: var(--vido-accent-hover);
}
</style>
