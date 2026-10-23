<template>
  <div v-if="user" class="profile">
    <div class="profile__header">
      <div class="profile__avatar">
        <i class="mdi mdi-account"></i>
      </div>
      <div class="profile__who">
        <h1 class="profile__name">{{ user.name }}</h1>
        <span class="profile__login">@{{ user.login }}</span>
      </div>
      <CustomButton variant="secondary" icon="mdi-logout" @click="onLogout">Logout</CustomButton>
    </div>

    <section>
      <h2 class="profile__section-title">Saved cards</h2>
      <div v-if="cards.length" class="profile__cards">
        <div v-for="card in cards" :key="card.id" class="profile__card">
          <i class="mdi mdi-credit-card-outline profile__card-icon"></i>
          <div class="profile__card-main">
            <strong>**** {{ card.last4 }}</strong>
            <span>{{ card.holder }} - {{ card.expiry }}</span>
          </div>
          <CustomTooltip text="Delete card">
            <CustomButton size="sm" variant="ghost" icon="mdi-delete-outline" @click="cardToDelete = card" />
          </CustomTooltip>
        </div>
      </div>
      <EmptyState
        v-else
        icon="mdi-credit-card-off-outline"
        title="No saved cards"
        text="Tick Save this card during checkout to keep it here"
      />
    </section>

    <section>
      <h2 class="profile__section-title">Orders</h2>
      <div v-if="orders.length" class="profile__orders">
        <div v-for="order in orders" :key="order.id" class="profile__order">
          <div class="profile__order-head">
            <strong>Order #{{ order.id }}</strong>
            <span class="profile__order-date">{{ formatDate(order.createdAt) }}</span>
            <span class="profile__order-total">{{ formatPrice(order.total) }}</span>
          </div>
          <ul class="profile__order-items">
            <li v-for="item in order.items" :key="item.productId">
              {{ item.name }} x {{ item.qty }}
              <span>{{ formatPrice(item.price * item.qty) }}</span>
            </li>
          </ul>
          <div v-if="order.address" class="profile__order-address">
            <i class="mdi mdi-map-marker-outline"></i>
            {{ formatAddress(order.address) }} · {{ order.address.phone }}
          </div>
          <div class="profile__order-foot">
            <span>Card **** {{ order.cardLast4 }}</span>
            <span v-if="order.promoCode">Promo {{ order.promoCode }}: -{{ formatPrice(order.discount) }}</span>
          </div>
        </div>
      </div>
      <EmptyState v-else icon="mdi-package-variant-closed" title="No orders yet" text="Your purchases will appear here">
        <CustomButton @click="$router.push({ name: 'catalog' })">Open catalog</CustomButton>
      </EmptyState>
    </section>

    <CustomDialog :model-value="cardToDelete !== null" title="Delete card?" @update:model-value="cardToDelete = null">
      Card **** {{ cardToDelete.last4 }} will be removed from your profile.
      <template #footer>
        <CustomButton variant="secondary" @click="cardToDelete = null">Cancel</CustomButton>
        <CustomButton variant="danger" @click="onDeleteCard">Delete</CustomButton>
      </template>
    </CustomDialog>
  </div>

  <EmptyState v-else icon="mdi-account-off-outline" title="You are not logged in">
    <CustomButton @click="$router.push({ name: 'login' })">Login</CustomButton>
  </EmptyState>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import CustomDialog from '@/components/custom-kit/CustomDialog.vue'
import CustomTooltip from '@/components/custom-kit/CustomTooltip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import { formatDate, formatPrice } from '@/utils/format'
import { formatAddress } from '@/utils/address'

const router = useRouter()
const store = useStore()

const user = computed(() => store.getters['auth/currentUser'])
const cards = computed(() => store.getters['payment/userCards'])
const orders = computed(() => store.getters['payment/userOrders'])

const cardToDelete = ref(null)

function onDeleteCard() {
  store.dispatch('payment/deleteCard', cardToDelete.value.id)
  cardToDelete.value = null
}

function onLogout() {
  store.dispatch('auth/logout')
  router.push({ name: 'catalog' })
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.profile {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
  }

  &__avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: $color-primary-soft;
    color: $color-primary;
    font-size: 1.8rem;
  }

  &__who {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-size: 1.3rem;
  }

  &__login {
    font-size: 0.9rem;
    color: $color-muted;
  }

  &__section-title {
    margin-bottom: 12px;
    font-size: 1.15rem;
  }

  &__cards,
  &__orders {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
  }

  &__card-icon {
    font-size: 1.6rem;
    color: $color-primary;
  }

  &__card-main {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    font-size: 0.85rem;
    color: $color-muted;

    strong {
      font-size: 0.98rem;
      color: $color-text;
    }
  }

  &__order {
    padding: 14px 16px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-md;
  }

  &__order-head {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  &__order-date {
    flex: 1;
    font-size: 0.85rem;
    color: $color-muted;
  }

  &__order-total {
    font-weight: 700;
  }

  &__order-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 10px 0;
    padding-top: 10px;
    border-top: 1px solid $color-surface-soft;
    list-style: none;
    font-size: 0.9rem;

    li {
      display: flex;
      justify-content: space-between;
    }
  }

  &__order-address {
    margin-bottom: 8px;
    font-size: 0.85rem;
    color: $color-muted;
  }

  &__order-foot {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: $color-muted;
  }

  @media (max-width: $breakpoint-sm) {
    &__card {
      flex-wrap: wrap;
    }
  }
}
</style>
