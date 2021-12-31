<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    Username <input id="username" name="username" type="text" value="" autocomplete="off" style="width: 100px;">
    Password <input id="password" name="password" type="password" value="" autocomplete="off" style="width: 100px;">
    <button @click="login()">Sign In</button>
    <button @click="register()">Sign Up</button>
    <br/>
    <div id='sign_up_result'>
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
	  api_path: '/api/v1'
    }
  },
  methods: {
    switchTo (path) {
      this.$router.replace(path)
    },
    async register () {
      var username = document.getElementById('username').value
      var password = this.$md5(document.getElementById('password').value)
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({ username: username, password: password })
        // ,mode: 'no-cors'
      }
      await this.$axios.post(this.api_path + "/register", requestOptions)
        .then(res => {
          this.status = res.status
        })
        .catch(error => {
          // this.status = 500
        })
      if (this.status === '200') {
        document.getElementById('sign_up_result_success').style.display = 'inline'
        document.getElementById('sign_up_result_failed').style.display = 'none'
      } else {
        document.getElementById('sign_up_result_success').style.display = 'none'
        document.getElementById('sign_up_result_failed').style.display = 'inline'
      }
    },
    async login () {
      var username = document.getElementById('username').value
      var password = this.$md5(document.getElementById('password').value)
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
      }
      await this.$axios.post(this.api_path + "/login", requestOptions)
        .then(res => {
          this.switchTo('/world')
        })
        .catch(error => {
          // this.status = 500
        })
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
