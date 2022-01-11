<template>
  <div class="initialization">
    <div class="initialization-canvas">
	    <canvas
            id="canvas"
            ref="canvas"
        >
            抱歉，您的浏览器暂不支持canvas元素
        </canvas>
		<br/>
	<row>
	    姓
		<input id="lastName" type="text"/>
		名
		<input id="firstName" type="text"/>
		<br/>
		昵称
		<input id="nickname" type="text"/>
		个性化颜色
		<select id="nameColor">
		    <option value="white">白色（默认）</option>
		</select>
		<br/>
		模型
		<select id="model">
		    <option value="1">人物（默认）</option>
		</select>
		性别
		<select id="model">
		    <option value="1">阳光男孩（默认）</option>
		    <option value="2">快乐女孩</option>
		</select>
		体表特征
		<select id="skinColor">
		    <option value="1">香草（默认）</option>
		    <option value="2">拿铁</option>
		    <option value="3">美式</option>
		    <option value="4">可可</option>
		</select>
		<br/>
		发型
		<select id="hairstyle">
		    <option value="0">光头（默认）</option>
		</select>
		发色
		<select id="hairColor">
		    <option value="1">乌黑（默认）</option>
		</select>
		眼睛
		<select id="eyes">
		    <option value="1">I型（默认）</option>
		</select>
		<br/>
        <button id="enter" @click="random()">随机</button>
        <button id="enter" @click="start()">提交</button>
	</row>
    </div>

    <div style="display:none">
        <img id="c0" src="../assets/image/characters/c0.png">
        <img id="avatars" src="../assets/image/avatars.png">
        <img id="floors" src="../assets/image/floors.png">
        <img id="decorations" src="../assets/image/decorations.png">
        <img id="doors" src="../assets/image/doors.png">
        <img id="buttons" src="../assets/image/buttons.png">
    </div>
  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const canvasSizeX = 1
const canvasSizeY = 1
let blockSize = 100
const imageBlockSize = 100
const avatarSize = 100

var intervalTimer20
var intervalTimer1000

export default {
  name: 'Initialization',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus',
      api_path: '/api/v1'
    }
  },
  components: {
    PulseLoader
  },
  mounted () {
    this.$nextTick(()=>{
      this.init()
    });
  },
  beforeDestroy () {
    this.shutdown()
  },
  methods: {
    async init () {
      this.canvas = this.$refs.canvas // 指定canvas
      canvas.addEventListener('contextmenu', function(e){
        e.preventDefault();
      }) // 防止长按复制
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
      this.ctx = this.canvas.getContext('2d') // 设置2D渲染区域

      if (sessionStorage['token'] !== null) {
        this.uuid = sessionStorage['uuid'].substr(1, sessionStorage['uuid'].length - 2)
      }

      // 需要定时执行的代码
      intervalTimer20 = setInterval(() => {
        this.show()
      }, 20)
      intervalTimer1000 = setInterval(() => {
        this.checkLogin()
      }, 1000)
	  
	  this.getUserCharacter()
    },
    switchTo (path) {
      this.$router.push(path)
    },
    async getUserCharacter () {
      if (sessionStorage['uuid'] !== null) {
        var uuid = sessionStorage['uuid'].substr(1, sessionStorage['uuid'].length - 2)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: uuid })
        }
        await this.$axios.post(this.api_path + "/get-user-character", requestOptions)
          .then(res => {
            if (res.status === 200) {
              this.shutdown()
			  this.switchTo ('/world')
            }
        })
        .catch(error => {
        })
      }
    },
    async checkLogin () {
      if (sessionStorage['uuid'] !== null && sessionStorage['token'] !== null) {
        var uuid = sessionStorage['uuid'].substr(1, sessionStorage['uuid'].length - 2)
        var token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: uuid, token: token })
        }
        await this.$axios.post(this.api_path + "/checkToken", requestOptions)
          .then(res => {
            if (res.status === 200) {
              return
            } else {
              this.logoff()
            }
        })
        .catch(error => {
          this.logoff()
        })
      }
    },
    logoff () {
      this.shutdown()
      var token = ''
      if (sessionStorage['token'] !== null) {
        var token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: this.uuid, token: token })
      }
      this.$axios.post(this.api_path + "/logoff", requestOptions)
      this.switchTo ('/')
    },
    show () {
      var timestamp = (new Date()).valueOf()
      this.printCharacter (document.getElementById('nickname').value, 0, 0, 0.1, 0.1, Math.floor((timestamp / 5000) % 4) * 2 + 1, 0, 0)
    },
    printCharacter (uuid, x, y, speedX, speedY, playerDirection, deltaWidth, deltaHeight) {
      // Show individual
      var offsetX
      var offsetY
      if (playerDirection == 1 || playerDirection == 2) {
        offsetY = 2
      } else if (playerDirection == 3 || playerDirection == 4) {
        offsetY = 3
      } else if (playerDirection == 5 || playerDirection == 6) {
        offsetY = 1
      } else if (playerDirection == 7 || playerDirection == 8) {
        offsetY = 0
      } else {
        offsetY = 0
      }
      var timestamp = (new Date()).valueOf()
      var speed = Math.sqrt(Math.pow(speedX, 2) + Math.pow(speedY, 2))
      var maxSpeed = Math.sqrt(Math.pow(playerMaxSpeedX, 2) + Math.pow(playerMaxSpeedY, 2))
      if (speed !== 0 && timestamp % (1000 / speed * maxSpeed) < (250 / speed * maxSpeed)) {
        offsetX = 0
      } else if (speed !== 0 && timestamp % (1000 / speed * maxSpeed) >= (500 / speed * maxSpeed) && timestamp % (1000 / speed * maxSpeed) < (750 / speed * maxSpeed)) {
        offsetX = 2
      } else {
        offsetX = 1
      }
      this.ctx.drawImage(c0, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
    },
    isDef (v) {
      return v !== undefined && v !== null
    },
    isPromise (val) {
      return this.isDef(val)
      && typeof val.then === 'function'
      && typeof val.catch === 'function'
    },
    shutdown () {
      clearInterval(intervalTimer20)
      clearInterval(intervalTimer1000)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
    *{
    }
    .initialization-canvas{
        display: flex;
        flex-direction: column;
        padding: 0px 0px;
    }
    .initialization-canvas canvas{
        -webkit-touch-callout:none; /*系统默认菜单被禁用*/
        -webkit-user-select:none; /*webkit浏览器*/
        -khtml-user-select:none; /*早期浏览器*/
        -moz-user-select:none;/*火狐*/
        -ms-user-select:none; /*IE10*/
        user-select:none;
        background-color: #000000;
        width: 100px;
        height: 100px;
		display: block;
		margin: 0 auto;
    }
    .initialization-canvas input{
        text-align: left;
        opacity:0.5;
        font-size:16px;
		width: 50px;
    }
    .initialization-canvas button{
        font-size:16px;
		width: 50px;
    }
</style>
