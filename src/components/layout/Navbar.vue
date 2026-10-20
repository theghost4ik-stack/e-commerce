<template>
  <div class="navbar-container">
    <div class="navbar-container__links">
      <router-link
        v-for="link in links"
        :key="link.name"
        :to="{ name: link.name }"
        class="navbar-container__links--link"
        active-class="navbar-container__links--active"
        exact-active-class="navbar-container__links--active"
      >
        <i class="mdi" :class="link.icon"></i>
        <span class="navbar-container__label">{{ link.label }}</span>
        <span v-if="link.count" class="navbar-container__badge">{{ link.count }}</span>
      </router-link>
    </div>

    <div class="navbar-container__menus">
      <CustomTooltip
        v-for="menu in menus"
        :key="menu.name"
        :text="menu.label"
        position="bottom"
      >
        <router-link
          :to="{ name: menu.name }"
          class="navbar-container__menus--link"
          active-class="navbar-container__menus--active"
        >
          <i class="mdi" :class="menu.icon"></i>
          <span class="navbar-container__label">{{ menu.label }}</span>
          <span v-if="menu.count" class="navbar-container__badge">{{ menu.count }}</span>
        </router-link>
      </CustomTooltip>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import CustomTooltip from '@/components/custom-kit/CustomTooltip.vue'

const store = useStore()

const links = computed(() => [
  { name: 'catalog', label: 'Catalog', icon: 'mdi-storefront-outline', count: 0 },
  { name: 'compare', label: 'Compare', icon: 'mdi-compare-horizontal', count: store.getters['compare/count'] },
  { name: 'about', label: 'About us', icon: 'mdi-information-outline', count: 0 }
])

const menus = computed(() => {
  const list = [
    { name: 'cart', label: 'Cart', icon: 'mdi-cart-outline', count: store.getters['cart/count'] },
    { name: 'favorites', label: 'Favorites', icon: 'mdi-heart-outline', count: store.getters['favorites/count'] }
  ]

  if (store.getters['auth/isAuthenticated']) {
    list.push({ name: 'profile', label: 'Profile', icon: 'mdi-account-circle-outline', count: 0 })
  } else {
    list.push({ name: 'login', label: 'Login', icon: 'mdi-login', count: 0 })
  }

  return list
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.navbar-container {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 20;
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid $color-border;
  padding: 0px 16px;

  &__links,
  &__menus {
    display: flex;
    gap: 6px;

    &--link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 34px;
      padding: 0 10px;
      border-radius: $radius-sm;
      text-decoration: none;
      color: inherit;
      font-size: 0.92rem;
      font-weight: 500;
      transition: background-color 0.15s, color 0.15s;

      &:hover {
        background-color: $color-primary-soft;
      }
    }

    &--active {
      background-color: $color-primary-soft;
      color: $color-primary;
    }
  }

  &__badge {
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    border-radius: 999px;
    background-color: $color-primary;
    color: $color-surface;
    font-size: 0.7rem;
    font-weight: 700;
    line-height: 18px;
  }

  .mdi {
    font-size: 1.25rem;
    line-height: 1;
  }

  @media (max-width: $breakpoint-sm) {
    padding: 0 8px;

    &__label {
      display: none;
    }
  }
}
</style>
