import products from '@/data/products.json'
import { getScore } from '@/utils/product'

export default {
  namespaced: true,
  state: () => ({
    items: products,
    search: '',
    tier: 'all',
    sort: 'default'
  }),
  getters: {
    byId: state => id => state.items.find(item => item.id === Number(id)),
    tiers: state => {
      const result = []
      state.items.forEach(item => {
        if (!result.includes(item.tier)) {
          result.push(item.tier)
        }
      })
      return result.sort()
    },
    filtered: state => {
      const query = state.search.trim().toLowerCase()

      const list = state.items.filter(item => {
        const matchTier = state.tier === 'all' || item.tier === state.tier
        const matchSearch = item.name.toLowerCase().includes(query)
        return matchTier && matchSearch
      })

      if (state.sort === 'price-asc') {
        list.sort((a, b) => a.price - b.price)
      } else if (state.sort === 'price-desc') {
        list.sort((a, b) => b.price - a.price)
      } else if (state.sort === 'score-desc') {
        list.sort((a, b) => getScore(b) - getScore(a))
      } else if (state.sort === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name))
      }

      return list
    }
  },
  mutations: {
    setSearch(state, value) {
      state.search = value
    },
    setTier(state, value) {
      state.tier = value
    },
    setSort(state, value) {
      state.sort = value
    },
    resetFilters(state) {
      state.search = ''
      state.tier = 'all'
      state.sort = 'default'
    }
  }
}