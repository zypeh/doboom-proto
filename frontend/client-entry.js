import 'es6-promise/auto'
import { app, store } from './app'

// Update the store with server-initialized state
// the state is determined during SSR and inlined in the page markup.
// store.replaceState(window.__INITIAL_STATE__)

// Mount the app DOM tree
app.$mount('#app')

// Service worker anyone ?
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log(`ServiceWorker registration successful: ${reg.scope}`))
            .catch(err => console.log(`ServiceWorker registration failed: ${err}`))
    })
}
