import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 全局样式表
import './assets/css/global.css'
// 导入字体图标
import './assets/fonts/iconfont.css'

import axios from 'axios'
// axios.defaults.baseURL = 'http://www.tangxiaoyang.vip:8888/api/v2/'
// axios.defaults.baseURL = 'http://192.168.3.14:5001/api/v2/'
axios.defaults.baseURL = 'http://localhost:5001/api/v2/'
// 拦截所有请求，为请求头添加token认证
axios.interceptors.request.use(config => {
  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  config.headers.Authorization = userInfo ? userInfo.token : ''
  return config
})
// 工具库
import utils from './libs/utils'
Vue.prototype.$utils = utils

Vue.prototype.$http = axios

import ZKTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', ZKTable)


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
