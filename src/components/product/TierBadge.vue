<template>
  <CustomTooltip :text="label" position="bottom">
    <span class="tier-badge" :class="`tier-badge--${tier}`">{{ tier }}</span>
  </CustomTooltip>
</template>

<script setup>
import { computed } from 'vue'
import CustomTooltip from '@/components/custom-kit/CustomTooltip.vue'
import { getTierLabel } from '@/utils/product'

const props = defineProps({
  tier: { type: String, required: true }
})

const label = computed(() => getTierLabel(props.tier))
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.tier-badge {
  display: inline-block;
  min-width: 34px;
  padding: 2px 8px;
  border-radius: 999px;
  border: 1px solid $color-border;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;

  @each $name, $color in $tier-colors {
    &--#{$name} {
      color: $color;
      background-color: rgba($color, 0.14);
      border-color: rgba($color, 0.4);
    }
  }
}
</style>
