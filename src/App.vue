<template>
  <div id="app">
    <handwrite></handwrite>
  </div>
</template>

<script>
import Handwrite from '@/views/Handwrite'
export default {
  name: 'App',
  components: {
    Handwrite
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
