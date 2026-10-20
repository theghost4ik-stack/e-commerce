<template>
  <div class="catalog">
    <h1 class="page-title">Catalog</h1>

    <div class="catalog__controls">
      <CustomInput v-model="search" class="catalog__search" icon="mdi-magnify" placeholder="Search by name" />
      <CustomSelect v-model="tier" class="catalog__select" :options="tierOptions" />
      <CustomSelect v-model="sort" class="catalog__select" :options="sortOptions" />
    </div>

    <div v-if="products.length" class="catalog__grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <EmptyState v-else icon="mdi-cellphone-off" title="Nothing found" text="Try another name or tier">
      <CustomButton variant="secondary" @click="$store.commit('products/resetFilters')">Reset filters</CustomButton>
    </EmptyState>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import CustomInput from '@/components/custom-kit/CustomInput.vue'
import CustomSelect from '@/components/custom-kit/CustomSelect.vue'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ProductCard from '@/components/product/ProductCard.vue'
import { getTierLabel } from '@/utils/product'

const store = useStore()

const products = computed(() => store.getters['products/filtered'])

const search = computed({
  get: () => store.state.products.search,
  set: value => store.commit('products/setSearch', value)
})

const tier = computed({
  get: () => store.state.products.tier,
  set: value => store.commit('products/setTier', value)
})

const sort = computed({
  get: () => store.state.products.sort,
  set: value => store.commit('products/setSort', value)
})

const tierOptions = [{ value: 'all', label: 'All tiers' }]
store.getters['products/tiers'].forEach(item => {
  tierOptions.push({ value: item, label: item + ' - ' + getTierLabel(item) })
})

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'score-desc', label: 'Best specs first' },
  { value: 'name', label: 'Name A-Z' }
]
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.catalog {
  &__controls {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
  }

  &__search {
    flex: 1;
  }

  &__select {
    width: 210px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  @media (max-width: $breakpoint-md) {
    &__controls {
      flex-direction: column;
    }

    &__select {
      width: 100%;
    }
  }
}
</style>
