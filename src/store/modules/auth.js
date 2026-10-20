import { loadState } from '@/utils/storage'

const DEFAULT_LOGIN = import.meta.env.VITE_AUTH_LOGIN || 'admin'
const DEFAULT_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || '12345'

const defaultUser = {
  id: 1,
  name: 'Demo User',
  login: DEFAULT_LOGIN,
  password: DEFAULT_PASSWORD
}

export default {
  namespaced: true,
  state: () => loadState('auth', { users: [defaultUser], currentUserId: null }),
  getters: {
    currentUser: state => state.users.find(user => user.id === state.currentUserId) || null,
    isAuthenticated: state => state.currentUserId !== null,
    userId: state => state.currentUserId,
    defaultLogin: () => DEFAULT_LOGIN,
    defaultPassword: () => DEFAULT_PASSWORD
  },
  mutations: {
    addUser(state, user) {
      state.users.push(user)
    },
    setCurrentUser(state, id) {
      state.currentUserId = id
    }
  },
  actions: {
    login({ state, commit }, { login, password }) {
      const user = state.users.find(item => item.login === login.trim() && item.password === password)
      if (!user) {
        return { ok: false, message: 'Invalid login or password' }
      }
      commit('setCurrentUser', user.id)
      return { ok: true }
    },
    register({ state, commit }, { name, login, password }) {
      if (!name.trim() || !login.trim() || !password) {
        return { ok: false, message: 'Fill in all fields' }
      }
      if (password.length < 5) {
        return { ok: false, message: 'Password must have at least 5 characters' }
      }
      const exists = state.users.some(item => item.login === login.trim())
      if (exists) {
        return { ok: false, message: 'This login is already taken' }
      }
      const newUser = { id: Date.now(), name: name.trim(), login: login.trim(), password }
      commit('addUser', newUser)
      commit('setCurrentUser', newUser.id)
      return { ok: true }
    },
    logout({ commit }) {
      commit('setCurrentUser', null)
    }
  }
}