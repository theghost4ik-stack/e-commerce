import { createRouter, createWebHistory } from 'vue-router'

import CatalogPage from '@/views/catalog/CatalogPage.vue'
import ProductDetailPage from '@/views/product-detail/ProductDetailPage.vue'
import CartPage from '@/views/cart/CartPage.vue'
import CheckoutPage from '@/views/checkout/CheckoutPage.vue'
import FavoritesPage from '@/views/favorites/FavoritesPage.vue'
import ComparePage from '@/views/compare/ComparePage.vue'
import LoginPage from '@/views/login/LoginPage.vue'
import ProfilePage from '@/views/profile/ProfilePage.vue'
import AboutPage from '@/views/about/AboutPage.vue'

const routes = [
  { path: '/', name: 'catalog', component: CatalogPage },
  { path: '/product/:id', name: 'product-detail', component: ProductDetailPage, props: true },
  { path: '/cart', name: 'cart', component: CartPage },
  { path: '/checkout', name: 'checkout', component: CheckoutPage },
  { path: '/favorites', name: 'favorites', component: FavoritesPage },
  { path: '/compare', name: 'compare', component: ComparePage },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/profile', name: 'profile', component: ProfilePage },
  { path: '/about', name: 'about', component: AboutPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
