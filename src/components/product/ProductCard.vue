<template>
  <article class="product-card">
    <router-link
      class="product-card__image"
      :to="{ name: 'product-detail', params: { id: product.id } }"
    >
      <img :src="product.image" :alt="product.name" loading="lazy" />
    </router-link>

    <div class="product-card__actions">
      <CustomTooltip :text="favoriteText" position="left">
        <CustomButton
          class="product-card__action"
          variant="secondary"
          size="sm"
          :icon="favorite ? 'mdi-heart' : 'mdi-heart-outline'"
          :class="{ 'product-card__action--active': favorite }"
          @click="toggleFavorite"
        />
      </CustomTooltip>
      <CustomTooltip :text="compareText" position="left">
        <CustomButton
          class="product-card__action"
          variant="secondary"
          size="sm"
          icon="mdi-compare-horizontal"
          :class="{ 'product-card__action--active': inCompare }"
          :disabled="!inCompare && isFull"
          @click="toggleCompare"
        />
      </CustomTooltip>
    </div>

    <div class="product-card__body">
      <TierBadge :tier="product.tier" />
      <router-link
        class="product-card__name"
        :to="{ name: 'product-detail', params: { id: product.id } }"
      >
        {{ product.name }}
      </router-link>
      <p class="product-card__text">{{ product.shortDescription }}</p>
      <div class="product-card__footer">
        <span class="product-card__price">{{ formatPrice(product.price) }}</span>
        <CustomButton
          size="sm"
          :variant="inCart ? 'secondary' : 'primary'"
          :icon="inCart ? 'mdi-cart-check' : 'mdi-cart-plus'"
          @click="onCartClick"
        >
          {{ inCart ? 'In cart' : 'Add' }}
        </CustomButton>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import CustomTooltip from '@/components/custom-kit/CustomTooltip.vue'
import TierBadge from '@/components/product/TierBadge.vue'
import { formatPrice } from '@/utils/format'

const props = defineProps({
  product: { type: Object, required: true }
})

const router = useRouter()
const store = useStore()

const inCart = computed(() => store.getters['cart/inCart'](props.product.id))
const favorite = computed(() => store.getters['favorites/isFavorite'](props.product.id))
const inCompare = computed(() => store.getters['compare/isInCompare'](props.product.id))
const isFull = computed(() => store.getters['compare/isFull'])

const favoriteText = computed(() => {
  return favorite.value ? 'Remove from favorites' : 'Add to favorites'
})

const compareText = computed(() => {
  if (inCompare.value) {
    return 'Remove from compare'
  }
  if (isFull.value) {
    return 'Compare is full'
  }
  return 'Add to compare'
})

function toggleFavorite() {
  store.dispatch('favorites/toggle', props.product.id)
}

function toggleCompare() {
  store.dispatch('compare/toggle', props.product.id)
}

function onCartClick() {
  if (inCart.value) {
    router.push({ name: 'cart' })
  } else {
    store.dispatch('cart/add', props.product.id)
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: $color-surface;
  border: 1px solid $color-border;
  border-radius: $radius-lg;
  overflow: hidden;
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 8px 24px $color-shadow;
  }

  &__image {
    display: block;
    height: 200px;
    background-color: $color-surface-soft;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__actions {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__action--active {
    color: $color-primary;
    border-color: $color-primary;
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 14px 16px 16px;
  }

  &__name {
    font-size: 1.05rem;
    font-weight: 700;

    &:hover {
      color: $color-primary;
    }
  }

  &__text {
    flex: 1;
    font-size: 0.88rem;
    color: $color-muted;
    line-height: 1.4;
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 6px;
  }

  &__price {
    font-size: 1.15rem;
    font-weight: 700;
  }
}
</style>
