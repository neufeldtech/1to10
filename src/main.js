import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import helpers from './plugins/helperPlugin'
import store from './plugins/vuex'

Vue.config.productionTip = false

new Vue({
  vuetify,
  store,
  helpers,
  beforeCreate() {
    this.$store.commit('initialiseStore');
  },
  render: h => h(App)
}).$mount('#app')
