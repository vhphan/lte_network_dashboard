import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store';
import http from './plugins/http.js'
import myFunctions from './utilities';
import '@/globalComponents'

// Vue.component('v-chart ', () => import('vue-echarts'));
Vue.use(http);
Vue.config.productionTip = false
Vue.mixin({
    methods: {...myFunctions}
});

new Vue({
    store,
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')
