import LRU from 'lru-cache'
import { fetchItems } from './api'

const config = {
    site: 'https://', // our API site
    version: '/v1'
}

let api
if (process.__API__)
    api = process.__API__
else {
    new IO()
    api = process.__API__ = IO()
    api.onServer = true

    api.cachedItems = LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15 // 15 min cache
    })
    
}
export default api
