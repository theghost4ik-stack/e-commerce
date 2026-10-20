import { loadState } from '@/utils/storage'

export default {
  namespaced: true,
  state: () => loadState('favorites', { ids: [] }),
  getters: {
    list: (state, getters, rootState, rootGetters) => {
      const result = []
      state.ids.forEach(id => {
        const product = rootGetters['products/byId'](id)
        if (product) {
          result.push(product)
        }
      })
      return result
    },
    count: state => state.ids.length,
    isFavorite: state => id => state.ids.includes(Number(id))
  },
  mutations: {
    addId(state, id) {
      state.ids.push(id)
    },
    removeId(state, id) {
      state.ids = state.ids.filter(item => item !== id)
    }
  },
  actions: {
    toggle({ state, commit }, id) {
      id = Number(id)
      if (state.ids.includes(id)) {
        commit('removeId', id)
      } else {
        commit('addId', id)
      }
    }
  }
}