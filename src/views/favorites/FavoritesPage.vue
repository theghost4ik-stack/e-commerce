<template>
  <div class="favorites">
    <h1 class="page-title">Favorites</h1>

    <div v-if="list.length" class="favorites__grid">
      <ProductCard v-for="product in list" :key="product.id" :product="product" />
    </div>

    <EmptyState v-else icon="mdi-heart-outline" title="No favorites yet" text="Tap the heart on a phone to keep it here">
      <CustomButton @click="$router.push({ name: 'catalog' })">Open catalog</CustomButton>
    </EmptyState>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import ProductCard from '@/components/product/ProductCard.vue'

const store = useStore()

const list = computed(() => store.getters['favorites/list'])
</script>

<style lang="scss" scoped>
.favorites {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}
</style>
