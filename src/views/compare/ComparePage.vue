<template>
  <div class="compare">
    <h1 class="page-title">Compare</h1>

    <EmptyState
      v-if="!list.length"
      icon="mdi-compare-horizontal"
      title="Nothing to compare"
      text="Add up to 3 phones from the catalog"
    >
      <CustomButton @click="$router.push({ name: 'catalog' })">Open catalog</CustomButton>
    </EmptyState>

    <div v-else class="compare__table">
      <div class="compare__grid" :style="{ '--cols': list.length }">
        <div class="compare__cell--label">
          <CustomCheckbox v-model="onlyDifferences">Differences only</CustomCheckbox>
        </div>

        <div v-for="(product, index) in list" :key="product.id" class="compare__product">
          <router-link :to="{ name: 'product-detail', params: { id: product.id } }">
            <img class="compare__image" :src="product.image" :alt="product.name" />
          </router-link>
          <TierBadge :tier="product.tier" />
          <router-link class="compare__name" :to="{ name: 'product-detail', params: { id: product.id } }">
            {{ product.name }}
          </router-link>
          <span class="compare__price">{{ formatPrice(product.price) }}</span>
          <span class="compare__score">Score {{ summary[index].score }}%</span>
          <div class="compare__badges">
            <span v-if="summary[index].isBestScore" class="compare__badge">Best specs</span>
            <span v-if="summary[index].isCheapest" class="compare__badge">Lowest price</span>
          </div>
          <div class="compare__buttons">
            <CustomButton
              size="sm"
              :variant="isInCart(product.id) ? 'secondary' : 'primary'"
              :icon="isInCart(product.id) ? 'mdi-cart-check' : 'mdi-cart-plus'"
              @click="onCartClick(product.id)"
            >
              {{ isInCart(product.id) ? 'In cart' : 'Add' }}
            </CustomButton>
            <CustomTooltip text="Remove from compare">
              <CustomButton
                size="sm"
                variant="secondary"
                icon="mdi-close"
                @click="$store.dispatch('compare/remove', product.id)"
              />
            </CustomTooltip>
          </div>
        </div>
      </div>

      <div v-for="row in visibleRows" :key="row.key" class="compare__grid compare__row" :style="{ '--cols': list.length }">
        <div class="compare__cell--label">{{ row.label }}</div>
        <div
          v-for="cell in row.cells"
          :key="cell.productId"
          class="compare__value"
          :class="{ 'compare__value--best': cell.isBest }"
        >
          <span class="compare__value-text">{{ cell.value }}</span>
          <RankBar :rank="cell.rank" :best="cell.isBest" />
        </div>
      </div>

      <EmptyState
        v-if="!visibleRows.length"
        icon="mdi-equal"
        title="No differences"
        text="These phones have identical specifications"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import CustomCheckbox from '@/components/custom-kit/CustomCheckbox.vue'
import CustomTooltip from '@/components/custom-kit/CustomTooltip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import TierBadge from '@/components/product/TierBadge.vue'
import RankBar from '@/components/product/RankBar.vue'
import { formatPrice } from '@/utils/format'

const router = useRouter()
const store = useStore()

const list = computed(() => store.getters['compare/list'])
const summary = computed(() => store.getters['compare/summary'])

const onlyDifferences = ref(false)

const visibleRows = computed(() => {
  const rows = store.getters['compare/rows']
  if (onlyDifferences.value) {
    return rows.filter(row => row.different)
  }
  return rows
})

function isInCart(id) {
  return store.getters['cart/inCart'](id)
}

function onCartClick(id) {
  if (isInCart(id)) {
    router.push({ name: 'cart' })
  } else {
    store.dispatch('cart/add', id)
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.compare {
  &__table {
    display: flex;
    flex-direction: column;
    gap: 4px;
    overflow-x: auto;
  }

  &__grid {
    display: grid;
    grid-template-columns: 170px repeat(var(--cols), minmax(180px, 1fr));
    gap: 12px;
  }

  &__cell--label {
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    color: $color-muted;
  }

  &__product {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 16px;
    padding: 14px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
  }

  &__image {
    width: 100%;
    height: 140px;
    border-radius: $radius-md;
    object-fit: cover;
  }

  &__name {
    font-weight: 700;

    &:hover {
      color: $color-primary;
    }
  }

  &__price {
    font-size: 1.15rem;
    font-weight: 700;
  }

  &__score {
    font-size: 0.85rem;
    color: $color-muted;
  }

  &__badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 22px;
  }

  &__badge {
    padding: 2px 8px;
    border-radius: 999px;
    background-color: $color-success-soft;
    color: $color-success;
    font-size: 0.72rem;
    font-weight: 700;
  }

  &__buttons {
    display: flex;
    gap: 8px;
    margin-top: auto;
  }

  &__row {
    align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid $color-border;
  }

  &__value {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 6px 10px;
    border-radius: $radius-sm;

    &--best {
      background-color: $color-success-soft;
    }
  }

  &__value-text {
    font-size: 0.92rem;
    font-weight: 600;
  }
}
</style>
