import Vue from 'vue'
import helpers from './helpers'

const plugin = {
  install() {
    Vue.helpers = helpers
    Vue.prototype.$helpers = helpers
  }
}

Vue.use(plugin)
export default plugin