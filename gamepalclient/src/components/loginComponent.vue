<template>
  <div class="loginComponent">
    <h1>{{ msg }}</h1>
    Username <input id="username" name="username" type="text" value="" autocomplete="off"><br/>
    Password <input id="password" name="password" type="password" value="" autocomplete="off"><br/>
    <button @click="login()">Sign In</button>
    <button @click="register()">Sign Up</button><br/>
    World <select id="world-list" class="world-list"></select>
    <br/>
    <div id='result'>
      <div id='sign_up_result_success' style='display: none;'>Sign Up Suceeded!</div>
      <div id='sign_up_result_failed' style='display: none;'>Sign Up Failed!</div>
      <div id='sign_in_result_success' style='display: none;'>Sign In Suceeded!</div>
      <div id='sign_in_result_failed' style='display: none;'>Sign In Failed!</div>
    </div>
    <!-- <div id="bottom_layer" class="s-bottom-layer s-isindex-wrap">
       <div class="s-bottom-layer-content">
        <p class="lh"><a class="text-color" href="//home.baidu.com" target="_blank">关于百度</a></p>
        <p class="lh"><a class="text-color" href="http://ir.baidu.com" target="_blank">About Baidu</a></p>
        <p class="lh"><a class="text-color" href="//www.baidu.com/duty" target="_blank">使用百度前必读</a></p>
        <p class="lh"><a class="text-color" href="//help.baidu.com" target="_blank">帮助中心</a></p>
        <p class="lh"><a class="text-color" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11000002000001" target="_blank">京公网安备11000002000001号</a></p>
        <p class="lh"><a class="text-color" href="https://beian.miit.gov.cn" target="_blank">京ICP证030173号</a></p>
        <p class="lh"><span class="text-color">&copy;2021&nbsp;Baidu&nbsp;</span></p>
        <p class="lh"><span class="text-color">互联网药品信息服务资格证书 (京)-经营性-2017-0020</span></p>
        <p class="lh"><a class="text-color" href="//www.baidu.com/licence/" target="_blank">信息网络传播视听节目许可证 0110516</a></p>
       </div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'loginComponent',
  data () {
    return {
      msg: 'Welcome to GamePal-Lobby',
      api_path: 'api/v1'
    }
  },
  mounted () {
    sessionStorage.setItem('userCode', '')
    sessionStorage.setItem('token', '')
    this.getWorldNames()
  },
  methods: {
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
      await this.axios.post(this.api_path + '/register', requestOptions)
        .then((res) => {
          console.log(res)
          document.getElementById('sign_up_result_success').style.display = 'inline'
          document.getElementById('sign_up_result_failed').style.display = 'none'
          document.getElementById('sign_in_result_success').style.display = 'none'
          document.getElementById('sign_in_result_failed').style.display = 'none'
        })
        .catch((error) => {
          console.error(error)
          document.getElementById('sign_up_result_success').style.display = 'none'
          document.getElementById('sign_up_result_failed').style.display = 'inline'
          document.getElementById('sign_in_result_success').style.display = 'none'
          document.getElementById('sign_in_result_failed').style.display = 'none'
        })
    },
    async login () {
      var username = document.getElementById('username').value
      var password = this.$md5(document.getElementById('password').value)
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          password: password,
          worldIndex: document.getElementById('world-list').value
        })
      }
      await this.axios.post(this.api_path + '/login', requestOptions)
        .then(res => {
          console.log(res)
          document.getElementById('sign_up_result_success').style.display = 'none'
          document.getElementById('sign_up_result_failed').style.display = 'none'
          if (res.data.code == '0200') {
            document.getElementById('sign_in_result_success').style.display = 'inline'
            document.getElementById('sign_in_result_failed').style.display = 'none'
            sessionStorage.clear()
            // 保存返回的uuid 以下为同一设置功能的两种实现
            sessionStorage.setItem('userCode', JSON.stringify(res.data.userCode))
            sessionStorage.setItem('token', JSON.stringify(res.data.token))
            this.$router.push('/world')
          } else {
            document.getElementById('sign_in_result_success').style.display = 'none'
            document.getElementById('sign_in_result_failed').style.display = 'inline'
          }
          document.getElementById('sign_in_result_success').style.display = 'none'
          document.getElementById('sign_in_result_failed').style.display = 'none'
        })
        .catch((error) => {
          console.error(error)
          document.getElementById('sign_up_result_success').style.display = 'none'
          document.getElementById('sign_up_result_failed').style.display = 'none'
          document.getElementById('sign_in_result_success').style.display = 'none'
          document.getElementById('sign_in_result_failed').style.display = 'inline'
        })
    },
    async getWorldNames () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
      await this.axios.post(this.api_path + '/getworldnames', requestOptions)
        .then(res => {
          console.log(res)
          var worldNames = res.data.worldNames
          for (let i in worldNames) {
            document.getElementById('world-list').options.add(new Option(worldNames[i], i))
          }
        })
        .catch((error) => {
          console.error(error)
          document.getElementById('world-list').options.add(new Option('默认', 0))
        })
      document.getElementById('world-list').options[0].selected = true
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
