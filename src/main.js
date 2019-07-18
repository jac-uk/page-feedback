import Vue from 'vue';
import App from './App.vue';
import setIframeHeight from '@/mixins/setIframeHeight';
import 'url-search-params-polyfill';

Vue.config.productionTip = false;

Vue.mixin(setIframeHeight);

new Vue({
  render: h => h(App),
}).$mount('#app');
