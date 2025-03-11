import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'
import Identity from '@/components/main/identity.vue'


Vue.config.productionTip = false
Vue.component("identity",Identity);

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
