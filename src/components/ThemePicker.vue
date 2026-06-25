<template>
  <div class="theme-grid">
    <button
      v-for="t in themes"
      :key="t.id"
      type="button"
      class="theme-swatch"
      :class="{ 'theme-swatch--active': t.id === theme }"
      @click="$emit('update:theme', t.id)"
    >
      <span class="theme-swatch__dot" :style="{ background: t.accent }"></span>
      <span class="theme-swatch__label">{{ t.label }}</span>
      <span class="theme-swatch__mode">{{ t.mode }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'ThemePicker',
  props: {
    themes: { type: Array, default: () => [] },
    theme: { type: String, default: 'default' }
  },
  emits: ['update:theme']
}
</script>

<style scoped>
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
</style>
