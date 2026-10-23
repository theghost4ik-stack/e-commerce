import defaultDb from '@/data/defaultDb.json'
import { loadState } from '@/utils/storage'
import { getLast4 } from '@/utils/card'

export default {
  namespaced: true,
  state: () =>
    loadState('payment', {
      cards: [...defaultDb.cards],
      orders: []
    }),
  getters: {
    userCards: (state, getters, rootState) =>
      state.cards.filter(card => card.userId === rootState.auth.currentUserId),
    defaultCard: (state, getters) => getters.userCards[0] || null,
    userOrders: (state, getters, rootState) =>
      state.orders.filter(order => order.userId === rootState.auth.currentUserId).reverse()
  },
  mutations: {
    addCard(state, card) {
      state.cards.push(card)
    },
    removeCard(state, id) {
      state.cards = state.cards.filter(card => card.id !== id)
    },
    addOrder(state, order) {
      state.orders.push(order)
    }
  },
  actions: {
    deleteCard({ commit }, cardId) {
      commit('removeCard', cardId)
    },
    purchase({ state, commit, dispatch, getters, rootState, rootGetters }, { cardId, newCard, saveNewCard, address }) {
      const userId = rootState.auth.currentUserId
      const entries = rootGetters['cart/detailed']

      if (userId === null) {
        return { ok: false, message: 'Login required' }
      }
      if (entries.length === 0) {
        return { ok: false, message: 'Cart is empty' }
      }

      let cardLast4 = ''

      if (cardId) {
        const card = getters.userCards.find(item => item.id === cardId)
        cardLast4 = card.last4
      } else {
        cardLast4 = getLast4(newCard.number)

        if (saveNewCard) {
          commit('addCard', {
            id: Date.now(),
            userId,
            holder: newCard.holder.trim().toUpperCase(),
            last4: cardLast4,
            expiry: newCard.expiry
          })
        }
      }

      const promo = rootGetters['cart/promo']

      const order = {
        id: state.orders.length + 1001,
        userId,
        createdAt: new Date().toISOString(),
        items: entries.map(entry => ({
          productId: entry.product.id,
          name: entry.product.name,
          image: entry.product.image,
          price: entry.product.price,
          qty: entry.qty
        })),
        subtotal: rootGetters['cart/subtotal'],
        discount: rootGetters['cart/discount'],
        promoCode: promo ? promo.code : '',
        total: rootGetters['cart/total'],
        cardLast4,
        address
      }

      commit('addOrder', order)
      dispatch('cart/clear', null, { root: true })
      return { ok: true, order }
    }
  }
}