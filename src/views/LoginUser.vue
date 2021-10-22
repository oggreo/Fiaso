<template>
  <div class="flex flex-row justify-around">
    <div class="w-full max-w-xl">
      <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
            Email
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700
                        leading-tight focus:outline-none focus:shadow-outline"
                 v-model="email"
                 type="email"
                 name="email"
                 value
                 placeholder="Username">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input class="shadow appearance-none border rounded w-full py-2 px-3
                        text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                 value
                 v-model="password"
                 id="password"
                 type="password"
                 name="password"
                 placeholder="******************">
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded
                         focus:outline-none focus:shadow-outline"
                  type="submit"
                  name="button"
                  >
            Sign In
          </button>

          <router-link to="/register"
                       class="inline-block align-baseline font-bold text-sm text-blue-500
                              hover:text-blue-800"
          >
            Don't have an account? Register.
          </router-link>
        </div>
      </form>
      <p class="text-center text-gray-500 text-xs">
        &copy;2021 Reo Ogusu All rights reserved.
      </p>
    </div>
  </div>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: null,
    };
  },
  methods: {
    login() {
      this.$store.commit('INIT_CONVERTED_AMOUNTS');
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userData) => {
          // load user board from firebase
          const { uid } = userData.user;
          //  this.$store.commit('SET_USER_STORED_DATA', { uid });
          this.$store.commit('INIT_BALANCE');
          return this.$store.dispatch('getUserData', { uid });
        })
        .then(() => {
          this.$router.push({ name: 'MainBalance' });
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
  },
};
</script>

<style scoped>
</style>
