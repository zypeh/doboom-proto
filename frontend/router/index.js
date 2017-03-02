import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [{
        path: '/',
        component: require('../views/Home')
    }, {
        path: '/user/:id',
        component: require('../views/User'),
        children: [
            { path: '', component: require('../views/UserHome') },
            { path: '', component: require('../views/UserProfile') },
            { path: '', component: require('../views/UserPosts') }
        ]

    }, {
        path: '/login',
        component: require('../views/Login')
    }, {
        path: '/register',
        component: require('../views/Register')
    }]
})
