<template>
  <div class="empty-state">
    <i class="mdi empty-state__icon" :class="icon"></i>
    <h3 class="empty-state__title">{{ title }}</h3>
    <p v-if="text" class="empty-state__text">{{ text }}</p>
    <div v-if="$slots.default" class="empty-state__action">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'mdi-package-variant' },
  title: { type: String, default: '' },
  text: { type: String, default: '' }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 56px 20px;
  background-color: $color-surface;
  border: 1px dashed $color-border;
  border-radius: $radius-lg;
  text-align: center;

  &__icon {
    font-size: 3rem;
    color: $color-border;
  }

  &__title {
    font-size: 1.1rem;
  }

  &__text {
    color: $color-muted;
    font-size: 0.95rem;
  }

  &__action {
    margin-top: 12px;
  }
}
</style>
