<template>
  <div class="order-summary">
    <div class="order-summary__row">
      <span>Subtotal</span>
      <span>{{ formatPrice(subtotal) }}</span>
    </div>
    <div v-if="discountPercent > 0" class="order-summary__row order-summary__row--discount">
      <span>Discount ({{ discountPercent }}%)</span>
      <span>-{{ formatPrice(discount) }}</span>
    </div>
    <div class="order-summary__row order-summary__row--total">
      <span>Total</span>
      <span>{{ formatPrice(total) }}</span>
    </div>
  </div>
</template>

<script setup>
import { formatPrice } from '@/utils/format'

defineProps({
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.order-summary {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    color: $color-muted;

    &--discount {
      color: $color-success;
    }

    &--total {
      padding-top: 12px;
      border-top: 1px solid $color-border;
      font-size: 1.15rem;
      font-weight: 700;
      color: $color-text;
    }
  }
}
</style>
