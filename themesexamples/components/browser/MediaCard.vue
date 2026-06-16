<template>
  <article
    class="media-card"
    tabindex="0"
    @click="$emit('open', item)"
    @keydown.enter="$emit('open', item)"
  >
    <div class="media-thumb">
      <img v-if="item.thumbnail" :src="item.thumbnail" :alt="item.title" />
      <div v-else class="media-thumb__placeholder" aria-hidden="true">
        <i :class="item.icon || 'fas fa-photo-film'"></i>
      </div>
      <span v-if="item.badge" class="media-badge">{{ item.badge }}</span>
      <div class="media-thumb-hover">
        <i class="fas fa-play"></i>
      </div>
    </div>
    <div class="media-meta">
      <span class="media-title" :title="item.title">{{ item.title }}</span>
      <span v-if="item.subtitle" class="media-subtitle">{{ item.subtitle }}</span>
    </div>
  </article>
</template>

<script>
export default {
  name: 'MediaCard',
  props: {
    item: { type: Object, required: true }
  },
  emits: ['open']
}
</script>

<style scoped>
.media-card {
  display: flex;
  flex-direction: column;
  background: var(--vido-bg-panel);
  border: 1px solid var(--vido-border-default);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.14s ease, transform 0.08s ease, box-shadow 0.14s ease;
}
.media-card:hover {
  border-color: var(--vido-accent);
  transform: translateY(-1px);
  box-shadow: var(--vido-shadow-drop);
}
.media-card:focus-visible {
  outline: none;
  border-color: var(--vido-accent);
  box-shadow: var(--vido-accent-glow);
}

.media-thumb {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--vido-bg-elevated);
  overflow: hidden;
}
.media-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.media-thumb__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: var(--vido-text-muted);
  background: radial-gradient(
    circle at 50% 40%,
    var(--vido-bg-elevated),
    var(--vido-bg-page)
  );
}

.media-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  font-family: var(--vido-font-mono);
  font-size: 10px;
  color: #fff;
  background: rgba(0, 0, 0, 0.75);
  padding: 1px 6px;
  border-radius: 999px;
}

.media-thumb-hover {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  color: #fff;
  font-size: 22px;
  opacity: 0;
  transition: opacity 0.14s ease;
}
.media-card:hover .media-thumb-hover,
.media-card:focus-visible .media-thumb-hover {
  opacity: 1;
}

.media-meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  min-width: 0;
}
.media-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--vido-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.media-subtitle {
  font-size: 10px;
  color: var(--vido-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
