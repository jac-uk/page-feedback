import Vue from 'vue';
import App from './App.vue';
import setIframeHeight from '@/mixins/setIframeHeight';

Vue.config.productionTip = false;

Vue.mixin(setIframeHeight);

new Vue({
  render: h => h(App),
}).$mount('#app');
