import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// Using webpack code splitting here so that each route's associated
// component code is loaded on-demand (lazily) when the route is visited.

// Babel is supported via plugin: `babel-plugin-syntax-dynamic-import`
const HomeView = () => import('')
const UserProfile = () => import('')

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/', component: HomeView },
    { path: '/user/:user_id', component: UserProfile }
})
