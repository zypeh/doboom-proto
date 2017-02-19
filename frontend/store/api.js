// This is aliased in webpack config based on server/client build
import config from 'create-api'

if (config.onServer && !api.warmCacheStarted) {
    api.warmCacheStarted = true
    warmCache()
}

const warmCache = () => {
    fetchItems((api.cachedIds.top || []).slice(0, 30))
    setTimeout(warmCache, 1000 * 60 * 15) // 15 minutes
}

const fetch = (item: String) => {
    
}