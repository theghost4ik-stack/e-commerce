import promos from '@/data/promos.json'
import { loadState } from '@/utils/storage'
import { roundMoney } from '@/utils/format'

export default {
  namespaced: true,
  state: () => loadState('cart', { items: [], promoCode: '' }),
  getters: {
    detailed: (state, getters, rootState, rootGetters) => {
      const result = []
      state.items.forEach(item => {
        const product = rootGetters['products/byId'](item.productId)
        if (product) {
          result.push({ product, qty: item.qty })
        }
      })
      return result
    },
    count: state => {
      let sum = 0
      state.items.forEach(item => {
        sum += item.qty
      })
      return sum
    },
    inCart: state => id => state.items.some(item => item.productId === Number(id)),
    subtotal: (state, getters) => {
      let sum = 0
      getters.detailed.forEach(entry => {
        sum += entry.product.price * entry.qty
      })
      return sum
    },
    promo: state => promos.find(promo => promo.code === state.promoCode) || null,
    discountPercent: (state, getters) => (getters.promo ? getters.promo.percent : 0),
    discount: (state, getters) => roundMoney((getters.subtotal * getters.discountPercent) / 100),
    total: (state, getters) => roundMoney(getters.subtotal - getters.discount),
    promoCodes: () => promos.map(promo => promo.code)
  },
  mutations: {
    addItem(state, productId) {
      const item = state.items.find(entry => entry.productId === productId)
      if (item) {
        item.qty++
      } else {
        state.items.push({ productId, qty: 1 })
      }
    },
    changeQty(state, { productId, delta }) {
      const item = state.items.find(entry => entry.productId === productId)
      if (item && item.qty + delta >= 1) {
        item.qty += delta
      }
    },
    removeItem(state, productId) {
      state.items = state.items.filter(entry => entry.productId !== productId)
    },
    clearItems(state) {
      state.items = []
      state.promoCode = ''
    },
    setPromoCode(state, code) {
      state.promoCode = code
    }
  },
  actions: {
    add({ commit }, productId) {
      commit('addItem', Number(productId))
    },
    changeQty({ commit }, payload) {
      commit('changeQty', payload)
    },
    remove({ commit }, productId) {
      commit('removeItem', productId)
    },
    clear({ commit }) {
      commit('clearItems')
    },
    applyPromo({ commit }, code) {
      const promo = promos.find(item => item.code === code.trim().toUpperCase())
      if (!promo) {
        return { ok: false, message: 'Promo code not found' }
      }
      commit('setPromoCode', promo.code)
      return { ok: true, message: 'Promo ' + promo.code + ' applied: -' + promo.percent + '%' }
    }
  }
}