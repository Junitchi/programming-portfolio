<template>
  <div class="segment-group" role="tablist">
    <button
      v-for="(opt, idx) in options"
      :key="opt.value"
      type="button"
      role="tab"
      class="segment"
      :class="{ 'segment--active': opt.value === modelValue, 'segment--divided': idx > 0 }"
      :aria-selected="opt.value === modelValue"
      @click="$emit('update:modelValue', opt.value)"
    >
      <i v-if="opt.icon" :class="opt.icon"></i>
      <span>{{ opt.label }}</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'MediaFilterSegmentGroup',
  props: {
    modelValue: { type: [String, Number], default: '' },
    options: { type: Array, required: true }
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
.segment-group {
  display: inline-flex;
  border: 1px solid var(--vido-segment-border);
  border-radius: 8px;
  overflow: hidden;
  background: var(--vido-segment-bg);
}

.segment {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: transparent;
  border: none;
  color: var(--vido-text-secondary);
  font-size: 11px;
  font-weight: 600;
  padding: 5px 12px;
  cursor: pointer;
  transition: background 0.14s ease, color 0.14s ease;
}
.segment i {
  font-size: 10px;
}
.segment--divided {
  border-left: 1px solid var(--vido-segment-divider);
}
.segment:hover:not(.segment--active) {
  background: var(--vido-segment-hover-bg);
  color: var(--vido-text-primary);
}
.segment--active {
  background: var(--vido-segment-active-bg);
  color: var(--vido-segment-active-text);
}
.segment:focus-visible {
  outline: 2px solid var(--vido-accent-ring);
  outline-offset: -2px;
}
</style>
