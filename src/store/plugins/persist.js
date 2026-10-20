import { saveState } from '@/utils/storage'

export default function persist(store) {
  store.subscribe(() => {
    saveState('auth', store.state.auth)
    saveState('cart', store.state.cart)
    saveState('favorites', store.state.favorites)
    saveState('compare', store.state.compare)
    saveState('payment', store.state.payment)
  })
}