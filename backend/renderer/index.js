import LRU from 'lru-cache'
import Renderer from 'vue-server-renderer'

export default createRenderer = (bundle) => {
    return Renderer.createBundleRenderer(bundle, {
        cache: LRU({
            max: 1000,
            maxAge: 1000 * 60 * 15
        })
    })
}