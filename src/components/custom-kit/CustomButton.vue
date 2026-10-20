<template>
  <button
    class="custom-button"
    :class="[
      `custom-button--${variant}`,
      `custom-button--${size}`,
      { 'custom-button--block': block, 'custom-button--icon-only': !$slots.default }
    ]"
    :type="type"
    :disabled="disabled"
  >
    <i v-if="icon" class="mdi" :class="icon"></i>
    <span v-if="$slots.default" class="custom-button__label">
      <slot />
    </span>
  </button>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  icon: { type: String, default: '' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  block: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.custom-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid $color-transparent;
  border-radius: $radius-sm;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.15s, border-color 0.15s, color 0.15s;

  &--sm {
    height: 30px;
    padding: 0 10px;
    font-size: 0.85rem;
  }

  &--md {
    height: 38px;
    padding: 0 16px;
    font-size: 0.95rem;
  }

  &--lg {
    height: 46px;
    padding: 0 22px;
    font-size: 1rem;
  }

  &--icon-only {
    padding: 0;
    aspect-ratio: 1;
  }

  &--block {
    width: 100%;
  }

  &--primary {
    background-color: $color-primary;
    color: $color-surface;

    &:hover:not(:disabled) {
      background-color: $color-primary-hover;
    }
  }

  &--secondary {
    background-color: $color-surface;
    border-color: $color-border;
    color: $color-text;

    &:hover:not(:disabled) {
      border-color: $color-primary;
      color: $color-primary;
    }
  }

  &--ghost {
    background-color: $color-transparent;
    color: $color-muted;

    &:hover:not(:disabled) {
      background-color: $color-primary-soft;
      color: $color-primary;
    }
  }

  &--danger {
    background-color: $color-danger-soft;
    color: $color-danger;

    &:hover:not(:disabled) {
      background-color: $color-danger;
      color: $color-surface;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .mdi {
    font-size: 1.15em;
    line-height: 1;
  }
}
</style>
