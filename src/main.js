import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://www.tangxiaoyang.vip:8888/api/v2/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
