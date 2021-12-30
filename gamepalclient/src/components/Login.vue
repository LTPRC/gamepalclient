<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    Username <input id="username" name="username" type="text" value="" autocomplete="off" style="width: 100px;">
    Password <input id="password" name="password" type="password" value="" autocomplete="off" style="width: 100px;">
    <button @click="switchTo('/world')">Sign In</button>
    <button @click="register()">Sign Up</button>
    <br/>
    <div id='sign_up_result'>
      {{data}}
      <div id='sign_up_result_success' style='display: none;'>Sign Up Suceeded!</div>
      <div id='sign_up_result_failed' style='display: none;'>Sign Up Failed!</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus',
      status: []
    }
  },
  methods: {
    switchTo (path) {
      this.$router.replace(path)
    },
    loadFetch (url){
        fetch( url )
            .then( function( response ){
                if( response.status != 200 ){
                    throw response.status
                }else{
                    return response.json()
                }
            }.bind(this))
            .then( function( data ){
                this.fetchResponse = data
            }.bind(this))
            .catch( function( error ){
                this.fetchError = error
            }.bind(this));
    },
    register () {
      var username = document.getElementById('username').value
      var password = document.getElementById('password').value
      // Simple POST request with a JSON body using fetch
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({ username: username, password: password })
        // ,mode: 'no-cors'
      }
      // fetch('http://127.0.0.1:8080/v1/register', requestOptions)
          // .then(response => response.json())
          // .then(data => console.log('data is', data))
          // .catch(error => console.log('error is', error))
      this.$axios.post("/v1/register", requestOptions).then(res => {
        console.log('proxy:', res)
      })
      if (data === '200') {
        this.document.getElementById('sign_up_result_success').style.display = 'inline'
        this.document.getElementById('sign_up_result_failed').style.display = 'none'
      } else {
        this.document.getElementById('sign_up_result_success').style.display = 'none'
        this.document.getElementById('sign_up_result_failed').style.display = 'inline'
      }
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
</style>
