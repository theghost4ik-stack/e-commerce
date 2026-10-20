import { loadState } from '@/utils/storage'
import { specList, getScore } from '@/utils/product'

const MAX_COMPARE = 3

export default {
  namespaced: true,
  state: () => loadState('compare', { ids: [] }),
  getters: {
    limit: () => MAX_COMPARE,
    count: state => state.ids.length,
    isFull: state => state.ids.length >= MAX_COMPARE,
    isInCompare: state => id => state.ids.includes(Number(id)),
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
    rows: (state, getters) => {
      if (getters.list.length === 0) {
        return []
      }

      return specList.map(spec => {
        const cells = getters.list.map(product => {
          const item = product.specs[spec.key]
          return {
            productId: product.id,
            value: item ? item.value : '-',
            rank: item ? item.rank : 0
          }
        })

        const ranks = cells.map(cell => cell.rank)
        const values = cells.map(cell => cell.value)
        const maxRank = Math.max(...ranks)
        const minRank = Math.min(...ranks)

        const hasBest = maxRank !== minRank

        cells.forEach(cell => {
          cell.isBest = hasBest && cell.rank === maxRank
        })

        return {
          key: spec.key,
          label: spec.label,
          different: hasBest || new Set(values).size > 1,
          cells
        }
      })
    },
    summary: (state, getters) => {
      const scores = getters.list.map(product => getScore(product))
      const prices = getters.list.map(product => product.price)

      const maxScore = Math.max(...scores)
      const minScore = Math.min(...scores)
      const maxPrice = Math.max(...prices)
      const minPrice = Math.min(...prices)

      return getters.list.map((product, index) => ({
        productId: product.id,
        score: scores[index],
        isBestScore: maxScore !== minScore && scores[index] === maxScore,
        isCheapest: maxPrice !== minPrice && prices[index] === minPrice
      }))
    }
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
    toggle({ state, getters, commit }, id) {
      id = Number(id)
      if (state.ids.includes(id)) {
        commit('removeId', id)
      } else if (!getters.isFull) {
        commit('addId', id)
      }
    },
    remove({ commit }, id) {
      commit('removeId', Number(id))
    }
  }
}