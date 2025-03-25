import Vue from 'vue'
import App from './App'
import uView from 'uview-ui'
import './uni.promisify.adaptor'


Vue.config.productionTip = false
Vue.use(uView)
Vue.mixin({
  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  }
});

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
