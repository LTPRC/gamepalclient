<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  meta: {
	name: 'viewport',
	content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, minimal-ui, viewport-fit=cover,user-scalable=no'
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin:-8px;
}
</style>
