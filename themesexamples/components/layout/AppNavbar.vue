<template>
  <header class="app-navbar">
    <div class="app-navbar__left">
      <div class="app-navbar__logo" aria-hidden="true">
        <i class="fas fa-layer-group"></i>
      </div>
      <span class="app-navbar__title">{{ appTitle }}</span>
      <span v-if="projectLabel" class="app-navbar__project" :title="projectLabel">
        {{ projectLabel }}
      </span>
    </div>

    <nav class="app-navbar__center">
      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        class="nav-btn"
        :class="{ 'nav-btn--active': item.id === activeNav }"
        @click="$emit('navigate', item.id)"
      >
        <i :class="item.icon"></i>
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="app-navbar__right">
      <button type="button" class="nav-btn nav-btn--icon" title="Settings" @click="$emit('open-settings')">
        <i class="fas fa-cog"></i>
      </button>

      <template v-if="showWindowControls">
        <button type="button" class="win-btn" title="Minimize" @click="$emit('window', 'minimize')">
          <i class="fas fa-window-minimize"></i>
        </button>
        <button type="button" class="win-btn" title="Maximize" @click="$emit('window', 'maximize')">
          <i class="far fa-square"></i>
        </button>
        <button type="button" class="win-btn win-btn--close" title="Close" @click="$emit('window', 'close')">
          <i class="fas fa-times"></i>
        </button>
      </template>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppNavbar',
  props: {
    appTitle: { type: String, default: 'Factor-E' },
    projectLabel: { type: String, default: '' },
    activeNav: { type: String, default: 'library' },
    showWindowControls: { type: Boolean, default: false }
  },
  emits: ['navigate', 'open-settings', 'window'],
  data() {
    return {
      navItems: [
        { id: 'library', label: 'Library', icon: 'fas fa-folder-open' },
        { id: 'browse', label: 'Browse', icon: 'fas fa-compass' },
        { id: 'activity', label: 'Activity', icon: 'fas fa-wave-square' }
      ]
    }
  }
}
</script>

<style scoped>
.app-navbar {
  -webkit-app-region: drag;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 6px 0 12px;
  background: linear-gradient(
    180deg,
    var(--vido-navbar-gradient-start),
    var(--vido-navbar-gradient-end)
  );
  border-bottom: 1px solid var(--vido-border-default);
  user-select: none;
}

.app-navbar__left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.app-navbar__logo {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--vido-accent-tint);
  color: var(--vido-accent);
  font-size: 12px;
  flex: 0 0 auto;
}

.app-navbar__title {
  font-size: 13px;
  font-weight: 600;
  color: var(--vido-text-heading);
  white-space: nowrap;
}

.app-navbar__project {
  font-size: 12px;
  color: var(--vido-text-muted);
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-left: 8px;
  border-left: 1px solid var(--vido-border-default);
}

.app-navbar__center {
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 auto;
}

.app-navbar__right {
  -webkit-app-region: no-drag;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: auto;
}

.nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid transparent;
  color: var(--vido-text-secondary);
  font-size: 12px;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.14s ease, color 0.14s ease, border-color 0.14s ease;
}
.nav-btn i {
  font-size: 11px;
}
.nav-btn:hover {
  background: var(--vido-bg-elevated);
  color: var(--vido-text-primary);
}
.nav-btn--active {
  background: var(--vido-accent-tint);
  color: var(--vido-accent);
  border-color: var(--vido-accent-tint-strong);
}
.nav-btn--icon {
  padding: 6px 8px;
}

.win-btn {
  width: 44px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--vido-text-secondary);
  font-size: 11px;
  cursor: pointer;
  transition: background 0.12s ease, color 0.12s ease;
}
.win-btn:hover {
  background: var(--vido-bg-elevated);
  color: var(--vido-text-primary);
}
.win-btn--close:hover {
  background: var(--vido-win-close-hover);
  color: #fff;
}
</style>
