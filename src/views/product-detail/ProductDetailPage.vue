<template>
  <div v-if="product" class="detail">
    <router-link class="detail__back" :to="{ name: 'catalog' }">
      <i class="mdi mdi-arrow-left"></i>
      Back to catalog
    </router-link>

    <div class="detail__top">
      <div class="detail__image">
        <img :src="product.image" :alt="product.name" />
      </div>

      <div class="detail__info">
        <TierBadge :tier="product.tier" />
        <h1 class="detail__name">{{ product.name }}</h1>
        <p class="detail__short">{{ product.shortDescription }}</p>
        <p class="detail__description">{{ product.description }}</p>

        <div class="detail__price">{{ formatPrice(product.price) }}</div>

        <div class="detail__actions">
          <CustomButton
            size="lg"
            :variant="inCart ? 'secondary' : 'primary'"
            :icon="inCart ? 'mdi-cart-check' : 'mdi-cart-plus'"
            @click="onCartClick"
          >
            {{ inCart ? 'Go to cart' : 'Add to cart' }}
          </CustomButton>
          <CustomTooltip :text="favorite ? 'Remove from favorites' : 'Add to favorites'">
            <CustomButton
              size="lg"
              variant="secondary"
              :icon="favorite ? 'mdi-heart' : 'mdi-heart-outline'"
              @click="$store.dispatch('favorites/toggle', id)"
            />
          </CustomTooltip>
          <CustomTooltip :text="inCompare ? 'Remove from compare' : 'Add to compare'">
            <CustomButton
              size="lg"
              variant="secondary"
              icon="mdi-compare-horizontal"
              :disabled="!inCompare && isFull"
              @click="$store.dispatch('compare/toggle', id)"
            />
          </CustomTooltip>
        </div>
      </div>
    </div>

    <section class="detail__specs">
      <h2 class="detail__specs-title">Specifications</h2>
      <template v-for="spec in specList" :key="spec.key">
        <div v-if="product.specs[spec.key]" class="detail__spec">
          <span class="detail__spec-label">{{ spec.label }}</span>
          <span class="detail__spec-value">{{ product.specs[spec.key].value }}</span>
          <RankBar :rank="product.specs[spec.key].rank" />
        </div>
      </template>
    </section>
  </div>

  <EmptyState v-else icon="mdi-cellphone-off" title="Product not found">
    <CustomButton @click="$router.push({ name: 'catalog' })">Back to catalog</CustomButton>
  </EmptyState>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import CustomTooltip from '@/components/custom-kit/CustomTooltip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TierBadge from '@/components/product/TierBadge.vue'
import RankBar from '@/components/product/RankBar.vue'
import { formatPrice } from '@/utils/format'
import { specList } from '@/utils/product'

const props = defineProps({
  id: { type: String, required: true }
})

const router = useRouter()
const store = useStore()

const product = computed(() => store.getters['products/byId'](props.id))
const inCart = computed(() => store.getters['cart/inCart'](props.id))
const favorite = computed(() => store.getters['favorites/isFavorite'](props.id))
const inCompare = computed(() => store.getters['compare/isInCompare'](props.id))
const isFull = computed(() => store.getters['compare/isFull'])

function onCartClick() {
  if (inCart.value) {
    router.push({ name: 'cart' })
  } else {
    store.dispatch('cart/add', props.id)
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.detail {
  &__back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 18px;
    color: $color-muted;
    font-size: 0.9rem;

    &:hover {
      color: $color-primary;
    }
  }

  &__top {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 32px;
    padding: 24px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
  }

  &__image {
    height: 380px;
    border-radius: $radius-md;
    overflow: hidden;
    background-color: $color-surface-soft;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  &__name {
    font-size: 1.8rem;
  }

  &__short {
    font-weight: 600;
  }

  &__description {
    color: $color-muted;
    line-height: 1.5;
  }

  &__price {
    font-size: 2rem;
    font-weight: 700;
  }

  &__actions {
    display: flex;
    gap: 10px;
    margin-top: auto;
  }

  &__specs {
    margin-top: 24px;
    padding: 24px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
  }

  &__specs-title {
    margin-bottom: 8px;
    font-size: 1.25rem;
  }

  &__spec {
    display: grid;
    grid-template-columns: 180px 1fr auto;
    align-items: center;
    gap: 12px;
    padding: 9px 0;
    border-bottom: 1px solid $color-surface-soft;
    font-size: 0.95rem;
  }

  &__spec-label {
    color: $color-muted;
  }

  &__spec-value {
    font-weight: 600;
  }

  @media (max-width: $breakpoint-md) {
    &__top {
      grid-template-columns: minmax(0, 1fr);
    }

    &__image {
      height: 260px;
    }

    &__spec {
      grid-template-columns: 120px 1fr auto;
    }
  }
}
</style>
