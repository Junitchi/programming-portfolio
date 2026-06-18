<template>
  <div class="col-6 col-sm-4 col-md-3 col-lg-2">
    <div
      class="skill-badge"
      :style="{ '--skill-color': color }"
    >
      <span class="skill-badge__accent" aria-hidden="true" />
      <span class="skill-badge__name">{{ name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SkillBadge',
  props: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.skill-badge {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 2.75rem;
  padding: 0.5rem 0.75rem 0.5rem 0.875rem;
  border-radius: 0.375rem;
  border: 1px solid var(--vido-border-default, #30363d);
  background: color-mix(in srgb, var(--skill-color) 22%, var(--vido-bg-panel, #161b22));
  color: var(--vido-text-heading, #f0f6fc);
  overflow: hidden;
}

.skill-badge__accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--skill-color);
}

.skill-badge__name {
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25;
  word-break: break-word;
}
</style>
