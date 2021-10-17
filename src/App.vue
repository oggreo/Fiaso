<template>
  <div class="ml-10 mr-10 mt-5 mb-5 navbar flex border-solid border-b-2 border-light-blue-200">
    <h1 class="pb-2 text-2xl font-black leading-7 text-gray-900 sm:text-3xl sm:truncate">Viaso</h1>
  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
