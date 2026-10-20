import { createStore } from 'vuex'
import persist from './plugins/persist'
import products from './modules/products'
import cart from './modules/cart'
import favorites from './modules/favorites'
import compare from './modules/compare'
import auth from './modules/auth'
import payment from './modules/payment'

export default createStore({
  modules: {
    products,
    cart,
    favorites,
    compare,
    auth,
    payment
  },
  plugins: [persist]
})
