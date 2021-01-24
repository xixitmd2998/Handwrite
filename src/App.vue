<template>
  <div id="app">
    <h1>手写板</h1>
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
