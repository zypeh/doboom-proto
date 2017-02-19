import Vue from 'vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'

// Sync `vue-router`'s state with vuex's store, this is to
// allow us to manipulate change of view via status.
sync(store, router)

const app = new Vue({
    router,
    stores,
    ...App
})

// expose the app, so we can bootstrap depends on the NODE_ENV
export { app, router, store }
