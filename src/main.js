import { createApp, reactive } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';

const GStore = reactive([]);

createApp(App)
  .provide('GStore', GStore)
  .use(store)
  .use(router)
  .mount('#app');
