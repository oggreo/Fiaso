import { createApp, reactive } from 'vue';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';

const GStore = reactive([]);

const firebaseConfig = {
  apiKey: 'AIzaSyCGZZiPmLcNaMSkLITXBKz4R4tOtyzK4Rw',
  authDomain: 'fiaso-80806.firebaseapp.com',
  projectId: 'fiaso-80806',
  storageBucket: 'fiaso-80806.appspot.com',
  messagingSenderId: '84629356338',
  appId: '1:84629356338:web:7270ae1976758bbec1612b',
};

// Initialize Firebase
initializeApp(firebaseConfig);

const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  store.dispatch('getUser', user)
    .then(() => {
    })
    .catch((err) => {
      console.log('error', err);
    });
});

createApp(App)
  .provide('GStore', GStore)
  .use(store)
  .use(router)
  .mount('#app');
