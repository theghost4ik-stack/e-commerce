<template>
  <div class="cart">
    <h1 class="page-title">Cart</h1>

    <EmptyState
      v-if="!items.length"
      icon="mdi-cart-outline"
      title="Your cart is empty"
      text="Pick a phone in the catalog"
    >
      <CustomButton @click="$router.push({ name: 'catalog' })">Open catalog</CustomButton>
    </EmptyState>

    <div v-else class="cart__layout">
      <div class="cart__list">
        <div v-for="entry in items" :key="entry.product.id" class="cart__item">
          <router-link :to="{ name: 'product-detail', params: { id: entry.product.id } }">
            <img class="cart__image" :src="entry.product.image" :alt="entry.product.name" />
          </router-link>

          <div class="cart__info">
            <router-link class="cart__name" :to="{ name: 'product-detail', params: { id: entry.product.id } }">
              {{ entry.product.name }}
            </router-link>
            <span class="cart__unit">{{ formatPrice(entry.product.price) }} each</span>
          </div>

          <div class="cart__qty">
            <CustomButton
              size="sm"
              variant="secondary"
              icon="mdi-minus"
              :disabled="entry.qty <= 1"
              @click="changeQty(entry.product.id, -1)"
            />
            <span class="cart__qty-value">{{ entry.qty }}</span>
            <CustomButton
              size="sm"
              variant="secondary"
              icon="mdi-plus"
              @click="changeQty(entry.product.id, 1)"
            />
          </div>

          <span class="cart__line-total">{{ formatPrice(entry.product.price * entry.qty) }}</span>

          <CustomTooltip text="Remove">
            <CustomButton variant="ghost" size="sm" icon="mdi-close" @click="removeId = entry.product.id" />
          </CustomTooltip>
        </div>
      </div>

      <aside class="cart__aside">
        <h2 class="cart__aside-title">Order summary</h2>

        <div class="cart__promo">
          <div class="cart__promo-row">
            <CustomInput
              v-model="promoInput"
              class="cart__promo-input"
              icon="mdi-ticket-percent-outline"
              placeholder="Promo code"
            />
            <CustomButton variant="secondary" @click="onApplyPromo">Apply</CustomButton>
          </div>
          <p v-if="promoMessage" class="cart__promo-message" :class="{ 'cart__promo-message--error': !promoOk }">
            {{ promoMessage }}
          </p>
        </div>

        <OrderSummary
          :subtotal="subtotal"
          :discount="discount"
          :discount-percent="discountPercent"
          :total="total"
        />

        <CustomButton size="lg" block icon="mdi-credit-card-outline" @click="$router.push({ name: 'checkout' })">
          Checkout
        </CustomButton>
      </aside>
    </div>

    <CustomDialog :model-value="removeId !== null" title="Remove item?" @update:model-value="removeId = null">
      This phone will be removed from your cart.
      <template #footer>
        <CustomButton variant="secondary" @click="removeId = null">Cancel</CustomButton>
        <CustomButton variant="danger" @click="onRemove">Remove</CustomButton>
      </template>
    </CustomDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import CustomInput from '@/components/custom-kit/CustomInput.vue'
import CustomDialog from '@/components/custom-kit/CustomDialog.vue'
import CustomTooltip from '@/components/custom-kit/CustomTooltip.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import OrderSummary from '@/components/cart/OrderSummary.vue'
import { formatPrice } from '@/utils/format'

const store = useStore()

const items = computed(() => store.getters['cart/detailed'])
const subtotal = computed(() => store.getters['cart/subtotal'])
const discount = computed(() => store.getters['cart/discount'])
const discountPercent = computed(() => store.getters['cart/discountPercent'])
const total = computed(() => store.getters['cart/total'])

const removeId = ref(null)
const promoInput = ref('')
const promoMessage = ref('')
const promoOk = ref(true)

function changeQty(productId, delta) {
  store.dispatch('cart/changeQty', { productId, delta })
}

async function onApplyPromo() {
  const result = await store.dispatch('cart/applyPromo', promoInput.value)
  promoOk.value = result.ok
  promoMessage.value = result.message
  if (result.ok) {
    promoInput.value = ''
  }
}

function onRemove() {
  store.dispatch('cart/remove', removeId.value)
  removeId.value = null
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.cart {
  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 340px;
    gap: 24px;
    align-items: start;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__item {
    display: grid;
    grid-template-columns: 80px minmax(0, 1fr) auto 90px auto;
    align-items: center;
    gap: 14px;
    padding: 12px 14px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
  }

  &__image {
    width: 80px;
    height: 80px;
    border-radius: $radius-md;
    object-fit: cover;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__name {
    font-weight: 700;

    &:hover {
      color: $color-primary;
    }
  }

  &__unit {
    font-size: 0.85rem;
    color: $color-muted;
  }

  &__qty {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__qty-value {
    min-width: 22px;
    text-align: center;
    font-weight: 700;
  }

  &__line-total {
    font-weight: 700;
    text-align: right;
  }

  &__aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
  }

  &__aside-title {
    font-size: 1.1rem;
  }

  &__promo {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__promo-row {
    display: flex;
    gap: 8px;
  }

  &__promo-input {
    flex: 1;
  }

  &__promo-message {
    font-size: 0.85rem;
    color: $color-success;

    &--error {
      color: $color-danger;
    }
  }

  &__promo-hint {
    font-size: 0.8rem;
    color: $color-muted;
  }

  @media (max-width: $breakpoint-md) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }

    &__item {
      grid-template-columns: 64px minmax(0, 1fr) auto;
    }

    &__image {
      width: 64px;
      height: 64px;
    }
  }
}
</style>
