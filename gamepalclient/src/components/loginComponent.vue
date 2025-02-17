<template>
  <div class="loginComponent">
    <h1>{{ msg }}</h1>
    Username <input id="username" name="username" type="text" value="" autocomplete="off"><br/>
    Password <input id="password" name="password" type="password" value="" autocomplete="off"><br/>
    <br/>
    World <select id="world-list" class="world-list"></select>
    <button @click="login()">Sign In</button>
    <button @click="register()">Sign Up</button><br/>
    <br/>
    <div id='result'>
      <div id='sign_up_result_success' style='display: none;'>Sign Up Suceeded!</div>
      <div id='sign_up_result_failed' style='display: none;'>Sign Up Failed!</div>
      <div id='sign_in_result_success' style='display: none;'>Sign In Suceeded!</div>
      <div id='sign_in_result_failed' style='display: none;'>Sign In Failed!</div>
    </div>
    <br/>
    <div id='userAgreement' style="height: 400px; overflow-y: auto; border: 1px solid #ccc">
      <h1>GamePal玩家行为准则与服务协议</h1>
    <div class="section">
        <p>欢迎加入GamePal社区！在开始您的冒险之前，请仔细阅读并同意以下《玩家行为准则与服务协议》。</p>
    </div>
    
    <div class="section">
        <h2>一、账号安全与管理</h2>
        <ul>
            <li><strong>法律遵从：</strong>GamePal用户必须遵守所在国家和地区的所有适用法律、法规以及本平台的相关规定。</li>
            <li><strong>年龄限制：</strong>GamePal用户要求年满18周岁，未满18周岁请勿使用本服务。</li>
            <li><strong>账号保密：</strong>GamePal用户有责任保护自己的账号信息（包括但不限于用户名、密码）不被泄露。</li>
        </ul>
    </div>

    <div class="section">
        <h2>二、行为规范</h2>
        <ul>
            <li><strong>文明游戏：</strong>提倡健康和谐的游戏环境，请勿在游戏中发布任何违法不良信息。</li>
            <li><strong>公平竞争：</strong>严格禁止任何形式的作弊行为，如利用漏洞、第三方软件等破坏游戏平衡性。</li>
            <li><strong>尊重他人：</strong>游戏中应相互尊重，不得骚扰其他玩家，避免恶意组队拒绝、妨碍他人正常游戏体验。</li>
            <li><strong>正面交流：</strong>鼓励玩家之间进行积极正面的交流，共同维护良好的社区氛围。</li>
        </ul>
    </div>

    <div class="section">
        <h2>三、服务变更与终止</h2>
        <ul>
            <li><strong>规则更新：</strong>游戏作者保留根据实际情况调整本守则的权利，并会在GamePal服务器官网主页公告修改详情。</li>
            <li><strong>账号封禁：</strong>严重违反上述规定的用户，我们有权不经事先通知直接采取封号措施。</li>
            <li><strong>退出机制：</strong>用户可随时申请注销账号，但需保证在此之前已解决所有争议事项。</li>
        </ul>
    </div>

    <p>感谢您的理解和支持，让我们一起创造一个更加美好的GamePal世界！</p>
    </div>
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
          worldId: document.getElementById('world-list').value
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
          for (var index in res.data.worldNames) {
            document.getElementById('world-list').options.add(new Option(res.data.worldNames[index].name, res.data.worldNames[index].id))
          }
        })
        .catch((error) => {
          console.error(error)
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
