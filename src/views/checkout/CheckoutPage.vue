<template>
  <div class="checkout">
    <h1 class="page-title">Checkout</h1>

    <div v-if="items.length" class="checkout__layout">
      <div class="checkout__main">
        <section class="checkout__payment">
          <h2 class="checkout__section-title">Delivery address</h2>

          <CustomInput
            v-model="address.recipient"
            label="Recipient"
            icon="mdi-account-outline"
            placeholder="Full name"
            :error="addressErrors.recipient"
          />
          <CustomInput
            :model-value="address.phone"
            label="Phone"
            icon="mdi-phone-outline"
            placeholder="+998 90 123 45 67"
            :error="addressErrors.phone"
            @update:model-value="address.phone = formatPhone($event)"
          />
          <CustomSelect v-model="address.city" label="City" :options="cityOptions" />
          <CustomInput
            v-model="address.street"
            label="Street"
            icon="mdi-map-marker-outline"
            placeholder="Amir Temur street"
            :error="addressErrors.street"
          />
          <div class="checkout__form-row">
            <CustomInput v-model="address.house" label="House" placeholder="15" :error="addressErrors.house" />
            <CustomInput v-model="address.apartment" label="Apartment" placeholder="Optional" />
          </div>
          <CustomInput v-model="address.comment" label="Comment for courier" placeholder="Optional" />
        </section>

        <section class="checkout__payment">
          <h2 class="checkout__section-title">Payment method</h2>

          <CustomSelect v-model="selectedCardId" label="Card" :options="cardOptions" />

          <div v-if="selectedCardId === 'new'" class="checkout__form">
            <CustomInput
              v-model="form.holder"
              label="Name on card"
              placeholder="JOHN SMITH"
              :error="errors.holder"
            />
            <CustomInput
              :model-value="form.number"
              label="Card number"
              icon="mdi-credit-card-outline"
              placeholder="0000 0000 0000 0000"
              :error="errors.number"
              @update:model-value="form.number = formatCardNumber($event)"
            />
            <div class="checkout__form-row">
              <CustomInput
                :model-value="form.expiry"
                label="Expiry"
                placeholder="MM/YY"
                :error="errors.expiry"
                @update:model-value="form.expiry = formatExpiry($event)"
              />
              <CustomInput
                :model-value="form.cvv"
                label="CVV"
                type="password"
                placeholder="***"
                :error="errors.cvv"
                @update:model-value="form.cvv = formatCvv($event)"
              />
            </div>

            <CustomCheckbox v-model="saveCard">Save this card for future purchases</CustomCheckbox>
          </div>

          <p v-if="errorMessage" class="checkout__error">{{ errorMessage }}</p>
        </section>
      </div>

      <aside class="checkout__aside">
        <h2 class="checkout__section-title">Your order</h2>
        <div class="checkout__items">
          <div v-for="entry in items" :key="entry.product.id" class="checkout__item">
            <img class="checkout__item-image" :src="entry.product.image" :alt="entry.product.name" />
            <span class="checkout__item-name">{{ entry.product.name }} x {{ entry.qty }}</span>
            <span class="checkout__item-price">{{ formatPrice(entry.product.price * entry.qty) }}</span>
          </div>
        </div>

        <OrderSummary
          :subtotal="subtotal"
          :discount="discount"
          :discount-percent="discountPercent"
          :total="total"
        />

        <CustomButton size="lg" block icon="mdi-lock-outline" @click="onPay">
          Pay {{ formatPrice(total) }}
        </CustomButton>
        <router-link class="checkout__back" :to="{ name: 'cart' }">Back to cart</router-link>
      </aside>
    </div>

    <EmptyState v-else-if="!placedOrder" icon="mdi-cart-outline" title="Nothing to pay for" text="Your cart is empty">
      <CustomButton @click="$router.push({ name: 'catalog' })">Open catalog</CustomButton>
    </EmptyState>

    <CustomDialog :model-value="placedOrder !== null" title="Order placed" :closable="false">
      <p>
        Thank you! Order <strong>#{{ placedOrder.id }}</strong> for
        <strong>{{ formatPrice(placedOrder.total) }}</strong> was paid with card
        <strong>**** {{ placedOrder.cardLast4 }}</strong>.
      </p>
      <p>Delivery to: <strong>{{ formatAddress(placedOrder.address) }}</strong></p>
      <template #footer>
        <CustomButton variant="secondary" @click="$router.push({ name: 'catalog' })">Continue shopping</CustomButton>
        <CustomButton @click="$router.push({ name: 'profile' })">View orders</CustomButton>
      </template>
    </CustomDialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import CustomButton from '@/components/custom-kit/CustomButton.vue'
import CustomInput from '@/components/custom-kit/CustomInput.vue'
import CustomCheckbox from '@/components/custom-kit/CustomCheckbox.vue'
import CustomSelect from '@/components/custom-kit/CustomSelect.vue'
import CustomDialog from '@/components/custom-kit/CustomDialog.vue'
import EmptyState from '@/components/common/EmptyState.vue'
import OrderSummary from '@/components/cart/OrderSummary.vue'
import { formatPrice } from '@/utils/format'
import { formatCardNumber, formatExpiry, formatCvv, validateCard } from '@/utils/card'
import { cities, formatPhone, validateAddress, formatAddress } from '@/utils/address'

const store = useStore()

const items = computed(() => store.getters['cart/detailed'])
const subtotal = computed(() => store.getters['cart/subtotal'])
const discount = computed(() => store.getters['cart/discount'])
const discountPercent = computed(() => store.getters['cart/discountPercent'])
const total = computed(() => store.getters['cart/total'])

const cards = store.getters['payment/userCards']

const cardOptions = cards.map(card => ({ value: card.id, label: `**** ${card.last4} - ${card.holder}` }))
cardOptions.push({ value: 'new', label: 'New card' })

const selectedCardId = ref(cards.length ? cards[0].id : 'new')
const saveCard = ref(false)
const errorMessage = ref('')
const errors = ref({})
const placedOrder = ref(null)

const form = reactive({
  holder: '',
  number: '',
  expiry: '',
  cvv: ''
})

const cityOptions = cities.map(city => ({ value: city, label: city }))

const lastOrder = store.getters['payment/userOrders'][0]

const address = reactive({
  recipient: '',
  phone: '+998 ',
  city: 'Tashkent',
  street: '',
  house: '',
  apartment: '',
  comment: ''
})

if (lastOrder && lastOrder.address) {
  Object.assign(address, lastOrder.address)
}

const addressErrors = ref({})

async function onPay() {
  errorMessage.value = ''
  errors.value = {}

  const isNewCard = selectedCardId.value === 'new'

  addressErrors.value = validateAddress(address)
  if (isNewCard) {
    errors.value = validateCard(form)
  }

  if (Object.keys(addressErrors.value).length > 0 || Object.keys(errors.value).length > 0) {
    return
  }

  const result = await store.dispatch('payment/purchase', {
    cardId: isNewCard ? null : selectedCardId.value,
    newCard: form,
    saveNewCard: saveCard.value,
    address: { ...address }
  })

  if (!result.ok) {
    errorMessage.value = result.message
    return
  }
  placedOrder.value = result.order
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.checkout {
  &__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    gap: 24px;
    align-items: start;
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__payment,
  &__aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    background-color: $color-surface;
    border: 1px solid $color-border;
    border-radius: $radius-lg;
  }

  &__section-title {
    font-size: 1.1rem;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  &__save-hint {
    margin: 6px 0 0 30px;
    font-size: 0.8rem;
    color: $color-muted;
  }

  &__error {
    padding: 10px 12px;
    border-radius: $radius-sm;
    background-color: $color-danger-soft;
    color: $color-danger;
    font-size: 0.9rem;
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
  }

  &__item-image {
    width: 44px;
    height: 44px;
    border-radius: $radius-sm;
    object-fit: cover;
  }

  &__item-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__item-price {
    font-weight: 600;
  }

  &__back {
    text-align: center;
    font-size: 0.88rem;
    color: $color-muted;

    &:hover {
      color: $color-primary;
    }
  }

  @media (max-width: $breakpoint-md) {
    &__layout {
      grid-template-columns: minmax(0, 1fr);
    }
  }
}
</style>
