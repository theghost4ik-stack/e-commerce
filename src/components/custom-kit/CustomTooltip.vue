<template>
  <span class="custom-tooltip">
    <slot />
    <span
      v-if="text"
      class="custom-tooltip__bubble"
      :class="`custom-tooltip__bubble--${position}`"
      role="tooltip"
    >
      {{ text }}
    </span>
  </span>
</template>

<script setup>
defineProps({
  text: { type: String, default: '' },
  position: { type: String, default: 'top' }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.custom-tooltip {
  position: relative;
  display: inline-flex;

  &__bubble {
    position: absolute;
    z-index: 30;
    padding: 6px 10px;
    border-radius: $radius-sm;
    background-color: rgb(52, 60, 74);
    color: $color-surface;
    font-size: 0.78rem;
    font-weight: 500;
    line-height: 1.3;
    white-space: nowrap;
    pointer-events: none;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.15s;

    &--top {
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
    }

    &--bottom {
      top: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
    }

    &--left {
      right: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%);
    }

    &--right {
      left: calc(100% + 8px);
      top: 50%;
      transform: translateY(-50%);
    }
  }

  &:hover &__bubble,
  &:focus-within &__bubble {
    opacity: 1;
    visibility: visible;
  }
}
</style>
