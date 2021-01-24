import Vue from 'vue'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.use(ElementUI)

new Vue({
  render: (h) => h(App)
}).$mount('#app')
