<template>
  <span class="rank-bar" :title="`${rank} / ${max}`">
    <span
      v-for="n in max"
      :key="n"
      class="rank-bar__segment"
      :class="{ 'rank-bar__segment--filled': n <= rank, 'rank-bar__segment--best': best && n <= rank }"
    ></span>
  </span>
</template>

<script setup>
defineProps({
  rank: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  best: { type: Boolean, default: false }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.rank-bar {
  display: inline-flex;
  gap: 3px;

  &__segment {
    width: 16px;
    height: 6px;
    border-radius: 3px;
    background-color: $color-border;

    &--filled {
      background-color: $color-primary;
    }

    &--best {
      background-color: $color-success;
    }
  }
}
</style>
