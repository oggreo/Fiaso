import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

const GStore = reactive([]);

createApp(App)
  .provide('GStore', GStore)
  .use(store).use(router)
  .mount('#app');
