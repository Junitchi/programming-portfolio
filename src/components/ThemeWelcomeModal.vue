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

        <ThemePicker
          :themes="themes"
          :theme="selected"
          @update:theme="selectTheme"
        />
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
import ThemePicker from './ThemePicker.vue'

export default {
  name: 'ThemeWelcomeModal',
  components: {
    ThemePicker
  },
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
