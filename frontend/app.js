import Vue from 'vue'
/* TODO: router, stores */
import { sync } from 'vuex-router-sync'

// Sync `vue-router`'s state with vuex's store, this is to
// allow us to manipulate change of view via statas.
sync(store, router)

const app = new Vue({
    router,
    stores,
    ...App
})

// expose the app, so we can bootstrap depends on the NODE_ENV
export { app, router, store }
