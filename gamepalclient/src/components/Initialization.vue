<template>
  <div class="initialization">
    <div id="loading">
		<p></p>
    </div>
    <div class="initialization-canvas">
      <div>
        <canvas
            id="canvas"
            ref="canvas"
            style="display:none"
            width="200"
            height="100"
        >
            抱歉，您的浏览器暂不支持canvas元素
        </canvas>
        <br/>
        姓
        <input id="lastName" type="text"/>
        名
        <input id="firstName" type="text"/>
        昵称
        <input id="nickname" type="text"/>
        <br/>
        头像
        <select id="avatar">
            <option value="1">泡芙（默认）</option>
            <option value="2">熊仔</option>
            <option value="3">卡斯</option>
            <option value="4">猪傻傻</option>
            <option value="5">小刘鸭</option>
            <option value="6">辐射小子</option>
            <option value="7">欢乐马</option>
            <option value="8">Ted</option>
            <option value="9">哆啦A梦</option>
        </select>
        个性化颜色
        <select id="nameColor">
            <option value="white">白色（默认）</option>
            <option value="red">红色</option>
            <option value="yellow">黄色</option>
            <option value="blue">蓝色</option>
            <option value="green">绿色</option>
        </select>
        <br/>
        模型
        <select id="creature">
            <option value="1">标准人物（默认）</option>
            <option value="2">香香软软的小泡芙</option>
        </select>
        性别
        <select id="gender">
            <option value="1">♂（默认）</option>
            <option value="2">♀</option>
        </select>
        肤色
        <select id="skinColor">
            <option value="1">香草（默认）</option>
            <option value="2">拿铁</option>
            <option value="3">可可</option>
            <option value="4">美式</option>
        </select>
        <br/>
        发型
        <select id="hairstyle">
            <option value="0">法师（默认）</option>
            <option value="1">暴走族</option>
            <option value="2">音乐家</option>
            <option value="3">演艺新星</option>
            <option value="4">程序员</option>
            <option value="5">模特</option>
            <option value="6">社会青年</option>
            <option value="7">律政先锋</option>
            <option value="8">二次元</option>
            <option value="9">学习委员</option>
            <option value="10">女明星</option>
            <option value="11">田园少女</option>
            <option value="12">女牛仔</option>
        </select>
        发色
        <select id="hairColor">
            <option value="1">乌黑（默认）</option>
            <option value="2">银灰</option>
            <option value="3">橙黄</option>
        </select>
        眼睛
        <select id="eyes">
            <option value="1">平凡（默认）</option>
            <option value="2">入神</option>
            <option value="3">对峙</option>
            <option value="4">惊讶</option>
            <option value="5">直面</option>
            <option value="6">怒视</option>
            <option value="7">恐慌</option>
            <option value="8">警惕</option>
            <option value="9">决战</option>
            <option value="10">天真</option>
            <option value="11">动情</option>
            <option value="12">震撼</option>
        </select>
        <br/>
        <button id="enter" @click="setUserCharacter()">提交</button>
      </div>
    </div>

    <div style="display:none">
        <img id="bear" src="../assets/image/animals/bear.png" />
        <img id="birds" src="../assets/image/animals/birds.png" />
        <img id="buffalo" src="../assets/image/animals/buffalo.png" />
        <img id="camel" src="../assets/image/animals/camel.png" />
        <img id="chicken" src="../assets/image/animals/chicken.png" />
        <img id="cobra" src="../assets/image/animals/cobra.png" />
        <img id="fox" src="../assets/image/animals/fox.png" />
        <img id="frog" src="../assets/image/animals/frog.png" />
        <img id="lionfemale" src="../assets/image/animals/paofu.png" />
        <img id="lionmale" src="../assets/image/animals/lionfemale.png" />
        <img id="monkey" src="../assets/image/animals/monkey.png" />
        <img id="paofu" src="../assets/image/animals/paofu.png" />
        <img id="polarbear" src="../assets/image/animals/polarbear.png" />
        <img id="racoon" src="../assets/image/animals/racoon.png" />
        <img id="seagull" src="../assets/image/animals/seagull.png" />
        <img id="sheep" src="../assets/image/animals/sheep.png" />
        <img id="tiger" src="../assets/image/animals/tiger.png" />
        <img id="avatars" src="../assets/image/avatars.png" @load="prepareResource">
        <img id="characters" src="../assets/image/characters.png" @load="prepareResource">
        <img id="hairstyle" src="../assets/image/hairstyle.png" @load="prepareResource">
        <img id="hairstyle_black" src="../assets/image/hairstyle_black.png" @load="prepareResource">
        <img id="hairstyle_grey" src="../assets/image/hairstyle_grey.png" @load="prepareResource">
        <img id="hairstyle_orange" src="../assets/image/hairstyle_orange.png" @load="prepareResource">
        <img id="eyesImage" src="../assets/image/eyes.png" @load="prepareResource">
        <img id="outfits" src="../assets/image/outfits.png" @load="prepareResource">
        <img id="floors" src="../assets/image/floors.png" @load="prepareResource">
    </div>
  </div>
</template>

<script>
const canvasSizeX = 1
const canvasSizeY = 1
let blockSize = 100
const imageBlockSize = 100
let offsetX = 0
let offsetY = 0
let outfitNo = 1

var intervalTimerInit
var intervalTimer500

export default {
  name: 'Initialization',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus',
      api_path: '/api/v1'
    }
  },
  components: {
  },
  mounted () {
    intervalTimerInit = setInterval(() => {
	  document.getElementById('loading').style.display = 'inline'
	  let toLoad = 0
	  let loaded = 0
	  let imgIds = ['bear', 'birds', 'buffalo', 'camel', 'chicken', 'cobra', 'fox', 'frog', 'lionfemale', 'lionmale', 'monkey', 'paofu', 'polarbear', 'racoon', 'seagull', 'sheep', 'tiger', 'avatars', 'characters', 'hairstyle', 'hairstyle_black', 'hairstyle_grey', 'hairstyle_orange', 'eyesImage', 'outfits', 'floors', 'decorations', 'doors', 'buttons']
	  for (let i = 0; i < imgIds.length; i++) {
        if (document.getElementById(imgIds[i]).complete) {
	      toLoad++
	      loaded++
        } else {
	      toLoad++
	    }
	  }
	  document.querySelector('p').innerHTML = '加载中...' + loaded + '/' + toLoad
	  if (toLoad === loaded) {
        document.querySelector('p').innerHTML = '加载完毕'
	    document.getElementById('loading').style.display = 'none'
	    clearInterval(intervalTimerInit)
		document.getElementById('canvas').style.display = 'inline'
		this.init()
	  }
    }, 1000)
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
        this.uuid = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
      }

      // 需要定时执行的代码
      intervalTimer500 = setInterval(() => {
        this.show()
        if (++offsetX >= 3) {
          offsetX -= 3
          if (++offsetY >= 4) {
            offsetY -= 4
          }
        }
      }, 500)
      
      this.getUserCharacter()
    },
    async getUserCharacter () {
      if (sessionStorage['userCode'] !== null) {
        var uuid = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: uuid })
        }
        await this.$axios.post(this.api_path + "/get-user-character", requestOptions)
          .then(res => {
            if (res.data.characters.length > 0) {
              this.shutdown()
              this.$router.push('/world')
            }
        })
        .catch(error => {
        })
      }
    },
    async setUserCharacter () {
      if (sessionStorage['userCode'] !== null) {
        var uuid = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uuid: uuid,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            nickname: document.getElementById('nickname').value,
            nameColor: document.getElementById('nameColor').value,
            creature: document.getElementById('creature').value,
            gender: document.getElementById('gender').value,
            skinColor: document.getElementById('skinColor').value,
            hairstyle: document.getElementById('hairstyle').value,
            hairColor: document.getElementById('hairColor').value,
            eyes: document.getElementById('eyes').value,
            outfit: outfitNo,
            avatar: document.getElementById('avatar').value})
        }
        await this.$axios.post(this.api_path + "/set-user-character", requestOptions)
          .then(res => {
            if (res.status === 200) {
              this.shutdown()
              this.$router.push('/world')
            }
        })
        .catch(error => {
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
      this.$router.push('/')
    },
    show () {
      // Avatar
      this.ctx.drawImage(avatars, document.getElementById('avatar').value * imageBlockSize, 0, imageBlockSize, imageBlockSize, blockSize, 0, blockSize, blockSize)
    
      var timestamp = (new Date()).valueOf()
      this.ctx.drawImage(floors, 0, 0, imageBlockSize, imageBlockSize, 0, 0, blockSize, blockSize)
      // Show individual
      if (document.getElementById('creature').value == 1) {
	    document.getElementById('gender').style.display = 'inline'
	    document.getElementById('skinColor').style.display = 'inline'
	    document.getElementById('hairstyle').style.display = 'inline'
	    document.getElementById('hairColor').style.display = 'inline'
	    document.getElementById('eyes').style.display = 'inline'
        var adderX
        var adderY
        if (document.getElementById('gender').value == 1) {
          adderY = 4
        } else if (document.getElementById('gender').value == 2) {
          adderY = 0
        }
        if (document.getElementById('skinColor').value == 1) {
          adderX = 0
        } else if (document.getElementById('skinColor').value == 2) {
          adderX = 3
        } else if (document.getElementById('skinColor').value == 3) {
          adderX = 6
        } else if (document.getElementById('skinColor').value == 4) {
          adderX = 9
        }
        this.ctx.drawImage(characters, (offsetX + adderX) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, 0, 0, blockSize, blockSize)
        this.ctx.drawImage(eyesImage, (document.getElementById('eyes').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 0, 0, blockSize, blockSize)
        this.ctx.drawImage(outfits, (offsetX + (outfitNo - 1) * 3) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, 0, 0, blockSize, blockSize)
        if (document.getElementById('hairColor').value == 1) {
          this.ctx.drawImage(hairstyle_black, (document.getElementById('hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 0, 0, blockSize, blockSize)
        } else if (document.getElementById('hairColor').value == 2) {
          this.ctx.drawImage(hairstyle_grey, (document.getElementById('hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 0, 0, blockSize, blockSize)
        } else if (document.getElementById('hairColor').value == 3) {
          this.ctx.drawImage(hairstyle_orange, (document.getElementById('hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 0, 0, blockSize, blockSize)
        }
      } else {
	    document.getElementById('gender').style.display = 'none'
	    document.getElementById('skinColor').style.display = 'none'
	    document.getElementById('hairstyle').style.display = 'none'
	    document.getElementById('hairColor').style.display = 'none'
	    document.getElementById('eyes').style.display = 'none'
	    if (document.getElementById('creature').value == 2) {
          this.ctx.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 0, 0, blockSize, blockSize)
		}
      }
      // Show name
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.textAlign = 'center'
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = document.getElementById('nameColor').value
      this.ctx.fillText(document.getElementById('nickname').value, blockSize / 2, blockSize * 0.12, Math.min(document.documentElement.clientWidth - screenX, blockSize))
      this.ctx.fillStyle = '#000000' // 阴影颜色
      this.ctx.shadowBlur = 0 // 阴影模糊范围
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.textAlign = 'left'
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
      clearInterval(intervalTimer500)
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
