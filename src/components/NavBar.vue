<template>
  <div class="ml-10 mr-10 mt-5 mb-5 navbar flex justify-between border-solid border-b-2
              border-light-blue-200">
    <h1 class="pb-2 text-2xl font-black leading-7 text-gray-900 sm:text-3xl sm:truncate">Viaso</h1>
    <router-link v-if="!user.loggedIn" to="/login" class="button">
      Login
    </router-link>
    <button v-if="user.loggedIn" @click="signOutUser">Sign Out</button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { getAuth, signOut } from 'firebase/auth';

export default {
  name: 'NavBar',
  computed: {
    ...mapState({
      convertedAmounts: 'convertedAmounts',
    }),
    ...mapGetters({
      user: 'user',
    }),
  },
  methods: {
    signOutUser() {
      const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
        // initialise storage.
        this.$store.commit('INIT_CONVERTED_AMOUNTS');
        this.$store.commit('SET_DEFAULT_DATA');
      }).catch((error) => {
        console.log('error', error);
        // An error happened.
      });
    },
  },
};
</script>

<style scoped>

</style>
