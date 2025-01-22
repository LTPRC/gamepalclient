<template>
  <div class="gameoverComponent">
    <h1>{{ msg }}</h1>
    <button @click="goBackLogin()">Exit</button><br/>
    <br/>
  </div>
</template>

<script>
export default {
  name: 'gameoverComponent',
  data () {
    return {
      msg: 'Losers always whine about their best. Winners go home and fuck the prom queen.',
      api_path: 'api/v1'
    }
  },
  mounted () {
  },
  methods: {
    goBackLogin () {
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
#bottom_layer {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    height: 20px;
    padding-top: 0px;
    overflow: hidden;
    zoom: 1;
    margin: 0;
    line-height: 20px;
    background: #000;
}
#bottom_layer .lh {
    display: inline;
    margin-right: 20px;
    font-size:12px;
}
    .hello input{
        font-size:16px;
        width: 100px;
    }
</style>
