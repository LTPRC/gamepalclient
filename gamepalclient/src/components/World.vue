<template>
    <div class="world">
        <div id="loading">
            <p></p>
        </div>
        <div class="world-canvas">
            <canvas
                id="canvas"
                @mousedown="canvasDownPC($event)"
                @mousemove="canvasMovePC($event)"
                @mouseup="canvasUp()"
                @mouseleave="canvasLeave()"
                @touchstart="canvasDownPhone($event)"
                @touchend="canvasUp()"
                @touchmove="canvasMovePhone($event)"
                ref="canvas"
                style="display:none; overflow:hidden;"
            >
                抱歉，您的浏览器暂不支持canvas元素
            </canvas>
            <div id="chat" class="chat">
                <input id="chat-content" class="chat-content" type="text" value=""/>
                <button id="chat-enter" class="chat-enter" @click="sendChat(1, '')">Enter</button>
            </div>
            <div id="items" class="items">
                <select id="items-type" class="items-type" @change="updateItems()">
                    <option value="0">全部</option>
                    <option value="1">工具</option>
                    <option value="2">装备</option>
                    <option value="3">用品</option>
                    <option value="4">材料</option>
                    <option value="5">笔记</option>
                    <option value="6">录音</option>
                </select>
                <select id="items-name" class="items-name" @dblclick="clickItem()">
                    <option style="display:none"></option>
                </select>
                <button id="items-enter" class="items-enter" @click="sendChat(1, '')">Enter</button>
                <div id="items-next" class="items-next">
                    <select id="items-next-name" class="items-next-name" @dblclick="exchangeItemBackward()">
                        <!--<option style="display:none"></option>-->
                    </select>
                    <button id="items-next-enter" class="items-next-enter" @click="sendChat(1, '')">Enter</button>
                </div>
            </div>
            <div id="initialization" class="initialization">
                昵称
                <input id="initialization-nickname" type="text"/>
                <br/>
                姓
                <input id="initialization-lastName" type="text"/>
                名
                <input id="initialization-firstName" type="text"/>
                <br/>
                个性化颜色
                <select id="initialization-nameColor">
                    <option value="white">白色</option>
                    <option value="red">红色</option>
                    <option value="yellow">黄色</option>
                    <option value="blue">蓝色</option>
                    <option value="green">绿色</option>
                </select>
                <br/>
                头像
                <select id="initialization-avatar">
                    <option value="1">泡芙</option>
                    <option value="2">熊仔</option>
                    <option value="3">卡斯</option>
                    <option value="4">猪傻傻</option>
                    <option value="5">小刘鸭</option>
                    <option value="6">辐射小子</option>
                    <option value="7">欢乐马</option>
                    <option value="8">Ted</option>
                    <option value="9">哆啦A梦</option>
                </select>
                <br/>
                模型
                <select id="initialization-creature">
                    <option value="1">标准人物</option>
                    <option value="2">香香软软的小泡芙</option>
                </select>
                <br/>
                性别
                <select id="initialization-gender">
                    <option value="1">♂</option>
                    <option value="2">♀</option>
                </select>
                <br/>
                肤色
                <select id="initialization-skinColor">
                    <option value="1">香草</option>
                    <option value="2">拿铁</option>
                    <option value="3">可可</option>
                    <option value="4">美式</option>
                </select>
                <br/>
                发型
                <select id="initialization-hairstyle">
                    <option value="0">法师</option>
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
                <br/>
                发色
                <select id="initialization-hairColor">
                    <option value="1">乌黑</option>
                    <option value="2">银灰</option>
                    <option value="3">橙黄</option>
                </select>
                <br/>
                眼睛
                <select id="initialization-eyes">
                    <option value="1">平凡</option>
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
                <button id="initialization-enter" @click="setUserCharacter()">提交</button>
                <button id="initialization-cancel" @click="cancelUserCharacter()">取消</button>
            </div>
        </div>
        <div style="display:none">
            <audio id="voiceAudio" type="audio/wav" controls autoplay crossOrigin = "anonymous" />
            <audio id="musicAudio" :src="require('../assets/test01.mp3')" />
            <audio id="soundAudio" controls autoplay crossOrigin = "anonymous" />
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
            <img id="avatars" src="../assets/image/avatars.png" />
            <img id="characters" src="../assets/image/characters/characters.png" />
            <img id="hairstyle" src="../assets/image/characters/hairstyles/hairstyle.png" />
            <img id="hairstyle_black" src="../assets/image/characters/hairstyles/hairstyle_black.png" />
            <img id="hairstyle_grey" src="../assets/image/characters/hairstyles/hairstyle_grey.png" />
            <img id="hairstyle_orange" src="../assets/image/characters/hairstyles/hairstyle_orange.png" />
            <img id="eyesImage" src="../assets/image/characters/eyes.png" />
            <img id="a001" src="../assets/image/characters/outfits/suit.png" />
            <img id="a002" src="../assets/image/characters/outfits/tuxedo.png" />
            <img id="a003" src="../assets/image/characters/outfits/soldier.png" />
            <img id="a004" src="../assets/image/characters/outfits/officer.png" />
            <img id="a005" src="../assets/image/characters/outfits/pajamas_black.png" />
            <img id="a006" src="../assets/image/characters/outfits/pajamas_grey.png" />
            <img id="a007" src="../assets/image/characters/outfits/pajamas_white.png" />
            <img id="a008" src="../assets/image/characters/outfits/pajamas_red.png" />
            <img id="a009" src="../assets/image/characters/outfits/pajamas_green.png" />
            <img id="a010" src="../assets/image/characters/outfits/pajamas_blue.png" />
            <img id="a011" src="../assets/image/characters/outfits/pajamas_orange.png" />
            <img id="a012" src="../assets/image/characters/outfits/pajamas_yellow.png" />
            <img id="a013" src="../assets/image/characters/outfits/pajamas_purple.png" />
            <img id="doors" src="../assets/image/blocks/doors.png" />
            <img id="floors" src="../assets/image/blocks/floors.png" />
            <img id="objects" src="../assets/image/blocks/objects.png" />
            <img id="traffic" src="../assets/image/blocks/traffic.png" />
            <img id="walls" src="../assets/image/blocks/walls.png" />
            <img id="buttons" src="../assets/image/buttons.png" />
            <img id="smallButtons" src="../assets/image/small-buttons.png" />
            <img id="balloons" src="../assets/image/balloons.png" />
            <img id="interactions" src="../assets/image/interactions.png" />
        </div>
    </div>
</template>

<script>
let userDatas = []
let userData = undefined
let userStatus = undefined
let chatMessages = []
let voiceMessages = []

const canvasMaxSizeX = 16
const canvasMaxSizeY = 9
const canvasMinSizeX = 1
const canvasMinSizeY = 1
const stopEdge = 0.15
// sharedEdge is used for obstacles, not edge of the canvas map
const sharedEdge = 0.25
let blockSize = 50
const imageBlockSize = 100
let canvasMoveUse = -1
const avatarSize = 100
const buttonSize = 50
const smallButtonSize = 25
const recordButtonX = 210
const recordButtonY = -140
let pointerX
let pointerY
let isFocused
let interactionInfo
const statusSize = 20
let defaultDeltaWidth
let defaultDeltaHeight
let newScene
const maxStatusLineSize = 100
// let showStatus
// let showItems
// let showSettings
// let showInitialization
// let showExchange
const menuLeftEdge = avatarSize + buttonSize * 3
const menuRightEdge = avatarSize
const menuTopEdge = avatarSize
const menuBottomEdge = avatarSize * 2
const interactDistance = 2

let showChat = true
const screenX = 10
const screenY= 160
const maxMsgLineNum = 10
const maxMsgLineSize = 400
const chatSize = 20

import Recorder from 'js-audio-recorder' //用于获取麦克风权限
import Recorderx, { ENCODE_TYPE } from 'recorderx' //用于录音
const rc = new Recorderx()
let isMuted = false
let micIsPermitted = false
let micInUse = false
let voiceInUse = false
const voiceEndDelay = 500

var intervalTimerInit
var intervalTimer20
var intervalTimer1000
var intervalTimer30000
var intervalTimerHp
var intervalTimerVp
var intervalTimerHunger
var intervalTimerThirst

const handle1 = (property) => {
  return function(a, b) {
    const val1 = a[property]
    const val2 = b[property]
    return val1 - val2
  }
}
const handle2 = (property1, property2) => {
  return function(a, b) {
    const val11 = a[property1]
    const val12 = b[property1]
    if (val11 == val12) {
      const val21 = a[property2]
      const val22 = b[property2]
      return val21 - val22
    }
    return val11 - val12
  }
}

export default {
  name: 'World',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus',
      api_path: '/api/v1',
      websocket_path: '/websocket/v1'
    }
  },
  components: {
  },
  mounted () {
    intervalTimerInit = setInterval(() => {
      document.getElementById('loading').style.display = 'inline'
      let toLoad = 0
      let loaded = 0
      // let imgIds = ['bear', 'birds', 'buffalo', 'camel', 'chicken', 'cobra', 'fox', 'frog', 'lionfemale', 'lionmale', 'monkey', 'paofu', 'polarbear', 'racoon', 'seagull', 'sheep', 'tiger', 'avatars', 'characters', 'hairstyle', 'hairstyle_black', 'hairstyle_grey', 'hairstyle_orange', 'eyesImage', 'pajamas_black', 'pajamas_grey', 'pajamas_white', 'pajamas_red', 'pajamas_green', 'pajamas_blue', 'pajamas_orange', 'pajamas_yellow', 'pajamas_purple', 'floors', 'decorations', 'doors', 'buttons']
      let imgIds = ['avatars', 'characters', 'hairstyle', 'hairstyle_black', 'hairstyle_grey', 'hairstyle_orange', 'eyesImage', 'doors', 'floors', 'objects', 'traffic', 'walls', 'buttons', 'smallButtons', 'balloons', 'interactions']
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
        
        this.initUserData()
      }
    }, 1000)
  },
  destroy () {
    this.shutdown()
  },
  methods: {
    async initUserData () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2) })
      }
      await this.$axios.post(this.api_path + "/init-user-data", requestOptions).then(res => {
        userData = res.data.userData
        userStatus = res.data.userStatus
        console.log('User data initialized.')
        this.init()
      })
      .catch(error => {
      })
    },
    async init () {
      await this.initWebSocket()

      this.canvas = this.$refs.canvas // 指定canvas
      canvas.addEventListener('contextmenu', function(e){
        e.preventDefault();
      }) // 防止长按复制
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
      this.ctx = this.canvas.getContext('2d') // 设置2D渲染区域
      // this.ctx.lineWidth = 5 // 设置线的宽度
      document.getElementById('chat-content').addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          this.sendChat(1, '')
        }
      })

      window.onload = function () {
        document.addEventListener('gesturestart', function (e) {
          e.preventDefault();
        });
        document.addEventListener('dblclick', function (e) {
          e.preventDefault();
        });
        document.addEventListener('touchstart', function (event) {
          if (event.touches.length > 1) {
            event.preventDefault();
          }
        });
        var lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
          var now = (new Date()).getTime();
          if (now - lastTouchEnd <= 300) {
            event.preventDefault();
          }
          lastTouchEnd = now;
        }, false);
      };
      window.addEventListener('resize', this.resizeCanvas)
      this.resizeCanvas()
      
      // Character initialization
      if (!this.isDef(userData.nickname)) {
        if (this.isDef(userData.nickname)) {
          document.getElementById('initialization-nickname').value = userData.nickname
        }
        if (this.isDef(userData.firstName)) {
          document.getElementById('initialization-firstName').value = userData.firstName
        }
        if (this.isDef(userData.lastName)) {
          document.getElementById('initialization-lastName').value = userData.lastName
        }
        if (this.isDef(userData.creature)) {
          document.getElementById('initialization-creature').value = userData.creature
        }
        if (this.isDef(userData.gender)) {
          document.getElementById('initialization-gender').value = userData.gender
        }
        if (this.isDef(userData.skinColor)) {
          document.getElementById('initialization-skinColor').value = userData.skinColor
        }
        if (this.isDef(userData.hairColor)) {
          document.getElementById('initialization-hairColor').value = userData.hairColor
        }
        if (this.isDef(userData.hairstyle)) {
          document.getElementById('initialization-hairstyle').value = userData.hairstyle
        }
        if (this.isDef(userData.eyes)) {
          document.getElementById('initialization-eyes').value = userData.eyes
        }
        // if (this.isDef(userData.outfits)) {
          // document.getElementById('initialization-outfits').value = userData.outfits
        // }
        if (this.isDef(userData.avatar)) {
          document.getElementById('initialization-avatar').value = userData.avatar
        }
        canvasMoveUse = 8
      }

      // 需要定时执行的代码
      intervalTimer20 = setInterval(() => {
        if (this.websocket.readyState === 1) {
          this.sendWebsocketMessage()
          this.playerMoveFour()
          this.show()
        }
      }, 20)
      intervalTimer1000 = setInterval(() => {
        this.updateVoice()
      }, 1000)
      intervalTimer30000 = setInterval(() => {
        this.updateChat()
      }, 30000)
      intervalTimerHp = setInterval(() => {
        if (this.isDef(userStatus.hunger) && userStatus.hunger.toFixed(2) / userStatus.hungerMax.toFixed(2) >= 0.2 &&  this.isDef(userStatus.thirst) && userStatus.thirst.toFixed(2) / userStatus.thirstMax.toFixed(2) >= 0.2) {
          userStatus.hp = Math.min(userStatus.hp + 1, userStatus.hpMax)
        }
      }, 1000)
      intervalTimerVp = setInterval(() => {
        if (this.isDef(userStatus.hp) && this.isDef(userStatus.vp)) {
          if (userStatus.hp.toFixed(2) / userStatus.hpMax.toFixed(2) > 0.5 && userStatus.vp < userStatus.vpMax) {
            userStatus.vp++
          } else if (userStatus.hp.toFixed(2) / userStatus.hpMax.toFixed(2) < 0.1 && userStatus.vp > 0) {
            userStatus.vp--
          }
        }
      }, 50)
      intervalTimerHunger = setInterval(() => {
        if (this.isDef(userStatus.hunger) && userStatus.hunger > 0) {
          userStatus.hunger--
        }
      }, 70000)
      intervalTimerThirst = setInterval(() => {
        if (this.isDef(userStatus.thirst) && userStatus.thirst > 0) {
          userStatus.thirst--
        }
      }, 30000)
    },
    initWebSocket () {
      console.log('initWebSocket方法')
      // WebSocket地址为接口地址，http用ws、https用wws
      var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws"
      this.websocket = new WebSocket(ws_scheme + '://'
          // + this.$hostPrd
          + this.$hostDev
          + ':8080/websocket/v1/' + sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2))
      this.websocket.onopen = this.webSocketOpen
      this.websocket.onerror = this.webSocketError
      this.websocket.onmessage = this.webSocketMessage
      this.websocket.onclose = this.webSocketClose
    },
    webSocketOpen () {
      console.log('WebSocket连接成功')
    },
    webSocketError () {
      console.log('WebSocket连接错误')
    },
    webSocketClose (e) {
      console.log('WebSocket连接断开', e)
      this.logoff()
    },
    webSocketMessage (e) {
      // 接收服务器返回的数据
      // console.log('服务器返回的消息', e.data)
      var response = JSON.parse(e.data)

        // temp bug-fix
        // if (!this.isDef(response.token)) {
           // return
        // }
      // Update userData and userStatus (Initialization)
      // if (this.isDef(userData.initFlag) && this.isDef(response.userData) && this.isDef(response.userStatus)) {
        // userData = response.userData
        // userStatus = response.userStatus
      // }
      // if (sessionStorage['token'] !== null) {
        // userData.userCode = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
        // userData.token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
      // }

      // Token check
      if (this.isDef(sessionStorage['token']) && response.token != sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)) {
        this.logoff()
      }
      
      // Update userDatas (Communication)
      userDatas = response.userDatas
      if (this.isDef(response.chatMessages)) {
      console.log('chatMessages received')
        for (let i = 0; i < response.chatMessages.length; i++) {
          for (let j = 0; j < userDatas.length; j++) {
            if (response.chatMessages[i].fromUuid == userDatas[j].userCode) {
              if (response.chatMessages[i].type === 1) {
                this.addChat(userDatas[j].nickname + ':' + '[广播]' + response.chatMessages[i].content)
              } else {
                this.addChat(userDatas[j].nickname + ':' + response.chatMessages[i].content)
              }
              break
            }
          }
        }
      }
      if (this.isDef(response.voiceMessages)) {
      console.log('voiceMessages received')
        for (let i = 0; i < response.voiceMessages.length; i++) {
          voiceMessages.push(response.voiceMessages[i].content)
        }
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
        body: JSON.stringify({ userCode: userData.userCode, token: token })
      }
      this.$axios.post(this.api_path + "/logoff", requestOptions)
      this.$router.push('/')
    },
    sendWebsocketMessage () {
    // console.log('sendWebsocketMessage:'+JSON.stringify(userData))
      this.websocket.send(JSON.stringify(userData))
    },
    show () {
      console.log('canvasMoveUse:'+canvasMoveUse)
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      // Adjust view
      //defaultDeltaWidth = Math.min(this.ctx.canvas.width / 2 - userData.playerX * blockSize, (canvasMaxSizeX / 2 - userData.playerX) * blockSize)
      //defaultDeltaHeight = Math.min(this.ctx.canvas.height / 2 - userData.playerY * blockSize, (canvasMaxSizeY / 2 - userData.playerY) * blockSize)
      defaultDeltaWidth = this.ctx.canvas.width / 2 - userData.playerX * blockSize
      defaultDeltaHeight = this.ctx.canvas.height / 2 - userData.playerY * blockSize

      var scene = this.$scenes.scenes[userData.sceneNo]

      // Enlarge nearbySceneNos (Not including scene itself. Backend will consider it together 02/01)
      userData.nearbySceneNos = []
      // userData.nearbySceneNos.push(scene.sceneNo)
      var upLeftDone = false
      var upRightDone = false
      var downLeftDone = false
      var downRightDone = false
      newScene = {
        sceneNo: scene.sceneNo,
        name: scene.name,
        floors: [[], [], [], [], [], [], [], [], [], [],
            [], [], [], [], [], [], [], [], [], [],
            [], [], [], [], [], [], [], [], [], []],
        decorations: {
          up: [],
          bottom: []
        },
        events: [[], [], [], [], [], [], [], [], [], [],
            [], [], [], [], [], [], [], [], [], [],
            [], [], [], [], [], [], [], [], [], []],
        teleport: [[], [], [], [], [], [], [], [], [], [],
            [], [], [], [], [], [], [], [], [], [],
            [], [], [], [], [], [], [], [], [], []],
        userDatas: []
      }
      var oldScenes = [[], [], []]
      var sceneNoTable = [[], [], []]
      oldScenes[1][1] = scene
      sceneNoTable[1][1] = scene.sceneNo
      if (-1 !== scene.up) {
        userData.nearbySceneNos.push(scene.up)
        oldScenes[0][1] = this.$scenes.scenes[scene.up]
        sceneNoTable[0][1] = scene.up
        if (-1 !== this.$scenes.scenes[scene.up].left) {
          upLeftDone = true
          userData.nearbySceneNos.push(this.$scenes.scenes[scene.up].left)
          oldScenes[0][0] = this.$scenes.scenes[this.$scenes.scenes[scene.up].left]
          sceneNoTable[0][0] = this.$scenes.scenes[scene.up].left
        }
        if (-1 !== this.$scenes.scenes[scene.up].right) {
          upRightDone = true
          userData.nearbySceneNos.push(this.$scenes.scenes[scene.up].right)
          oldScenes[0][2] = this.$scenes.scenes[this.$scenes.scenes[scene.up].right]
          sceneNoTable[0][2] = this.$scenes.scenes[scene.up].right
        }
      }
      if (-1 !== scene.left) {
        if (-1 !== this.$scenes.scenes[scene.left].up && !upLeftDone) {
          upLeftDone = true
          userData.nearbySceneNos.push(this.$scenes.scenes[scene.left].up)
          oldScenes[0][0] = this.$scenes.scenes[this.$scenes.scenes[scene.left].up]
          sceneNoTable[0][0] = this.$scenes.scenes[scene.left].up
        }
        userData.nearbySceneNos.push(scene.left)
        oldScenes[1][0] = this.$scenes.scenes[scene.left]
        sceneNoTable[1][0] = scene.left
        if (-1 !== this.$scenes.scenes[scene.left].down && !downLeftDone) {
          downLeftDone = true
          userData.nearbySceneNos.push(this.$scenes.scenes[scene.left].down)
          oldScenes[2][0] = this.$scenes.scenes[this.$scenes.scenes[scene.left].down]
          sceneNoTable[2][0] = this.$scenes.scenes[scene.left].down
        }
      }
      if (-1 !== scene.right) {
        if (-1 !== this.$scenes.scenes[scene.right].up && !upRightDone) {
          upRightDone = true
          userData.nearbySceneNos.push(this.$scenes.scenes[scene.right].up)
          oldScenes[0][2] = this.$scenes.scenes[this.$scenes.scenes[scene.right].up]
          sceneNoTable[0][2] = this.$scenes.scenes[scene.right].up
        }
        userData.nearbySceneNos.push(scene.right)
        oldScenes[1][2] = this.$scenes.scenes[scene.right]
        sceneNoTable[1][2] = scene.right
        if (-1 !== this.$scenes.scenes[scene.right].down && !downRightDone) {
          downRightDone = true
          userData.nearbySceneNos.push(this.$scenes.scenes[scene.right].down)
          oldScenes[2][2] = this.$scenes.scenes[this.$scenes.scenes[scene.right].down]
          sceneNoTable[2][2] = this.$scenes.scenes[scene.right].down
        }
      }
      if (-1 !== scene.down) {
        userData.nearbySceneNos.push(scene.down)
        oldScenes[2][1] = this.$scenes.scenes[scene.down]
        sceneNoTable[2][1] = scene.down
        if (-1 !== this.$scenes.scenes[scene.down].left) {
          downLeftDone = true
          userData.nearbySceneNos.push(this.$scenes.scenes[scene.down].left)
          oldScenes[2][0] = this.$scenes.scenes[this.$scenes.scenes[scene.down].left]
          sceneNoTable[2][0] = this.$scenes.scenes[scene.down].left
        }
        if (-1 !== this.$scenes.scenes[scene.down].right) {
          downRightDone = true
          userData.nearbySceneNos.push(this.$scenes.scenes[scene.down].right)
          oldScenes[2][2] = this.$scenes.scenes[this.$scenes.scenes[scene.down].right]
          sceneNoTable[2][2] = this.$scenes.scenes[scene.down].right
        }
      }
      var userDatasMap = new Map()
      for (let i = 0; i < userDatas.length; i++) {
        if (userDatasMap.has(userDatas[i].sceneNo)) {
          userDatasMap.get(userDatas[i].sceneNo).push(userDatas[i])
        } else {
          userDatasMap.set(userDatas[i].sceneNo, [userDatas[i]])
        }
      }
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (userDatasMap.has(sceneNoTable[i][j])) {
            var userDatasFromMap = userDatasMap.get(sceneNoTable[i][j])
            for (let k = 0; k < userDatasFromMap.length; k++) {
              var userDataFromMap = JSON.parse(JSON.stringify(userDatasFromMap[k])) // Shaking bug fixed 02/04
              userDataFromMap.playerX += j * this.$scenes.width
              userDataFromMap.playerY += i * this.$scenes.height
              userDataFromMap.playerNextX += j * this.$scenes.width
              userDataFromMap.playerNextY += i * this.$scenes.height
              newScene.userDatas.push(userDataFromMap)
            }
          }
        }
      }
      // Sort userDatas by playerY
      newScene.userDatas.sort(handle1('playerY'))
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          var oldScene = oldScenes[i][j]
          if (!this.isDef(oldScene)) {
            continue
          }
          if (this.isDef(oldScene.decorations)) {
            if (this.isDef(oldScene.decorations.up)) {
              for (let k = 0; k < oldScene.decorations.up.length; k++) {
                var newDecoration = {}
                newDecoration.code = oldScene.decorations.up[k].code
                newDecoration.x = oldScene.decorations.up[k].x + j * this.$scenes.width
                newDecoration.y = oldScene.decorations.up[k].y + i * this.$scenes.height
                newScene.decorations.up.push(newDecoration)
              }
            }
            if (this.isDef(oldScene.decorations.bottom)) {
              for (let k = 0; k < oldScene.decorations.bottom.length; k++) {
                var newDecoration = {}
                newDecoration.code = oldScene.decorations.bottom[k].code
                newDecoration.x = oldScene.decorations.bottom[k].x + j * this.$scenes.width
                newDecoration.y = oldScene.decorations.bottom[k].y + i * this.$scenes.height
                newScene.decorations.bottom.push(newDecoration)
              }
            }
          }
          for (let k = 0; k < this.$scenes.height; k++) {
            for (let l = 0; l < this.$scenes.width; l++) {
              if (this.isDef(oldScene.floors) && this.isDef(oldScene.floors[k]) && this.isDef(oldScene.floors[k][l])) {
                newScene.floors[k + i * this.$scenes.height][l + j * this.$scenes.width] = oldScene.floors[k][l]
              }
              if (this.isDef(oldScene.events) && this.isDef(oldScene.events[k]) && this.isDef(oldScene.events[k][l])) {
                newScene.events[k + i * this.$scenes.height][l + j * this.$scenes.width] = oldScene.events[k][l]
              }
            }
          }
          if (this.isDef(oldScene.teleport)) {
            for (let k = 0; k < oldScene.teleport.length; k++) {
              var newTeleport = {}
              newTeleport.fromX = oldScene.teleport[k].fromX
              newTeleport.fromY = oldScene.teleport[k].fromY
              newTeleport.toSceneNo = oldScene.teleport[k].toSceneNo
              newTeleport.toX = oldScene.teleport[k].toX
              newTeleport.toY = oldScene.teleport[k].toY
              newScene.teleport[newTeleport.fromY + i * this.$scenes.height][newTeleport.fromX + j * this.$scenes.width] = newTeleport
            }
          }
        }
      }
      this.printScene(newScene, defaultDeltaWidth - this.$scenes.width * blockSize, defaultDeltaHeight - this.$scenes.height * blockSize)
      // this.printScene(newScene, defaultDeltaWidth, defaultDeltaHeight)

      // Console
      this.ctx.drawImage(avatars, userData.avatar % 10 * avatarSize, Math.floor(userData.avatar / 10) * avatarSize, avatarSize, avatarSize, 0 * avatarSize, this.ctx.canvas.height - avatarSize, avatarSize, avatarSize)
      for (let i = 0; i < 3; i++) {
        if (canvasMoveUse !== i + 2) {
          this.ctx.drawImage(buttons, i * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + i * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
        } else {
          this.ctx.drawImage(buttons, i * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + i * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
        }
      }
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = '#EEEEEE'
      if (this.isDef(userData.nickname) && this.isDef(userData.lastName) && this.isDef(userData.firstName)) {
        this.ctx.fillText('Lv.' + userStatus.level + ' ' + userData.nickname + '(' + userData.lastName + ',' + userData.firstName + ')', avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.75, buttonSize * 5)
      } else {
        this.ctx.fillText('Lv.' + userStatus.level, avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.75, buttonSize * 5)
      }
      this.ctx.fillText('经验值' + userStatus.exp + '/' + userStatus.expMax, avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.25, buttonSize * 5)
      this.ctx.fillText('生命值' + userStatus.hp + '/' + userStatus.hpMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 8 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.fillText('活力值' + userStatus.vp + '/' + userStatus.vpMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 6 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.fillText('饥饿值' + userStatus.hunger + '/' + userStatus.hungerMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 4 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.fillText('口渴值' + userStatus.thirst + '/' + userStatus.thirstMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 2 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.shadowBlur=0 // 阴影模糊范围
      this.ctx.shadowOffsetX=0
      this.ctx.shadowOffsetY=0
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      this.ctx.fillStyle = 'rgba(191, 191, 191, 0.5)'
      this.ctx.fillRect(avatarSize + buttonSize * 2 + statusSize, document.documentElement.clientHeight - buttonSize * 1.5, maxStatusLineSize * userStatus.exp / userStatus.expMax, statusSize * 0.75)
      this.ctx.fillStyle = 'rgba(191, 191, 0, 0.5)'
      this.ctx.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 7.75 * statusSize - avatarSize, maxStatusLineSize * userStatus.hp / userStatus.hpMax, statusSize * 0.75)
      this.ctx.fillStyle = 'rgba(0, 191, 0, 0.5)'
      this.ctx.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 5.75 * statusSize - avatarSize, maxStatusLineSize * userStatus.vp / userStatus.vpMax, statusSize * 0.75)
      this.ctx.fillStyle = 'rgba(191, 0, 0, 0.5)'
      this.ctx.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 3.75 * statusSize - avatarSize, maxStatusLineSize * userStatus.hunger / userStatus.hungerMax, statusSize * 0.75)
      this.ctx.fillStyle = 'rgba(0, 0, 191, 0.5)'
      this.ctx.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 1.75 * statusSize - avatarSize, maxStatusLineSize * userStatus.thirst / userStatus.thirstMax, statusSize * 0.75)
      this.ctx.strokeRect(avatarSize + buttonSize * 2 + statusSize, document.documentElement.clientHeight - buttonSize * 1.5, maxStatusLineSize, statusSize * 0.75)
      this.ctx.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 7.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      this.ctx.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 5.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      this.ctx.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 3.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      this.ctx.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 1.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      this.ctx.fillStyle = '#000000'
      if (showChat) {
        if (canvasMoveUse !== 10) {
          this.ctx.drawImage(smallButtons, 0 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, recordButtonX >= 0 ? recordButtonX : (this.ctx.canvas.width + recordButtonX), recordButtonY >= 0 ? recordButtonY : (this.ctx.canvas.height + recordButtonY), smallButtonSize, smallButtonSize)
        } else {
          this.ctx.drawImage(smallButtons, 1 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, recordButtonX >= 0 ? recordButtonX : (this.ctx.canvas.width + recordButtonX), recordButtonY >= 0 ? recordButtonY : (this.ctx.canvas.height + recordButtonY), smallButtonSize, smallButtonSize)
        }
        document.getElementById('chat').style.display = 'inline'
        this.printChat()
      } else {
        document.getElementById('chat').style.display = 'none'
      }
      
      // Show menus
      document.getElementById('items').style.display = 'none'
      document.getElementById('items-next').style.display = 'none'
      document.getElementById('initialization').style.display = 'none'
      if (canvasMoveUse === 5) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-next').style.display = 'inline'
        this.printMenu()
        this.printExchange()
      }
      if (canvasMoveUse === 2) {
        this.printMenu()
        this.printStatus()
      }
      if (canvasMoveUse === 3) {
        document.getElementById('items').style.display = 'inline'
        this.printMenu()
        this.printItems()
      }
      if (canvasMoveUse === 4) {
        this.printMenu()
        this.printSettings()
      }
      if (canvasMoveUse === 8) {
        document.getElementById('initialization').style.display = 'inline'
        this.printMenu()
        this.printInitialization()
      }

      // Cursor
      if (pointerX !== -1 && pointerY !== -1) {
        // this.ctx.drawImage(paw, pointerX - blockSize + defaultDeltaWidth, pointerY - blockSize + defaultDeltaHeight)
      }
    },
    printScene (scene, deltaWidth, deltaHeight) {
      isFocused = false
      // Bottom floor
      if (this.isDef(scene.floors)) {
        for (var j = 0; j < this.$scenes.height * 3; j++) {
          for (var i = 0; i < this.$scenes.width * 3; i++) {
            var code = scene.floors[j][i]
            if (this.isDef(code) && code < 0) {
              code *= -1
              this.printFloor(code, i * blockSize + deltaWidth, j * blockSize + deltaHeight)
            }
          }
        }
      }
      // Bottom Decoration
      if (this.isDef(scene.decorations.bottom)) {
        for (var i = 0; i < scene.decorations.bottom.length; i++) {
          this.printDecoration(scene.decorations.bottom[i], deltaWidth, deltaHeight)
        }
      }
      // Up floor & decoration & character
      var characterIndex = 0
      var decorationIndex = 0
      if (this.isDef(scene.decorations.up)) {
        // scene.decorations.up.sort((a,b) => { return a.y - b.y })
        scene.decorations.up.sort(handle2('y', 'x'))
      }
      
      for (let j = 0; j < this.$scenes.height * 3; j++) {
        for (let i = 0; i < this.$scenes.width * 3; i++) {
          // Up floor
          if (this.isDef(scene.floors)) {
            var code = scene.floors[j][i]
            if (this.isDef(code) && code > 0) {
              this.printFloor(code, i * blockSize + deltaWidth, j * blockSize + deltaHeight)
            }
          }
        }
        // Up decoration & character
        while ((this.isDef(scene.decorations.up) && decorationIndex < scene.decorations.up.length && scene.decorations.up[decorationIndex].y >= j && scene.decorations.up[decorationIndex].y < (j + 1)) || (characterIndex < scene.userDatas.length && (scene.userDatas[characterIndex].playerY - 0.5) >= j && (scene.userDatas[characterIndex].playerY - 0.5) < (j + 1))){
          if ((this.isDef(scene.decorations.up) && decorationIndex < scene.decorations.up.length && scene.decorations.up[decorationIndex].y >= j && scene.decorations.up[decorationIndex].y < (j + 1)) && (characterIndex < scene.userDatas.length && (scene.userDatas[characterIndex].playerY - 0.5) >= j && (scene.userDatas[characterIndex].playerY - 0.5) < (j + 1))) {
            if (scene.decorations.up[decorationIndex].y < (scene.userDatas[characterIndex].playerY - 0.5)) {
              this.printDecoration(scene.decorations.up[decorationIndex], deltaWidth, deltaHeight)
              decorationIndex++
            } else {
              this.printCharacter(scene.userDatas[characterIndex], deltaWidth, deltaHeight)
              if (userData.userCode != scene.userDatas[characterIndex].userCode && Math.floor(pointerX / blockSize + this.$scenes.width) === scene.userDatas[characterIndex].playerX - 0.5 && Math.floor(pointerY / blockSize + this.$scenes.height) === scene.userDatas[characterIndex].playerY - 0.5) {
                isFocused = true
                interactionInfo = {
                  type: 1,
                  x: scene.userDatas[characterIndex].playerX - 0.5,
                  y: scene.userDatas[characterIndex].playerY - 0.5,
                  list: [5, 1, 7, 6],
                  code: scene.userDatas[characterIndex].userCode
                }
                for (let k = 0; k < Math.min(4, interactionInfo.list.length); k++) {
                  this.ctx.drawImage(interactions, interactionInfo.list[k] % 10 * buttonSize, Math.floor(interactionInfo.list[k] / 10) * buttonSize, buttonSize, buttonSize, (interactionInfo.x + k % 2 / 2) * blockSize + deltaWidth, (interactionInfo.y + Math.floor(k / 2) / 2) * blockSize + deltaHeight, blockSize / 2, blockSize / 2)
                }
              }
              characterIndex++
            }
          } else if (this.isDef(scene.decorations.up) && decorationIndex < scene.decorations.up.length && scene.decorations.up[decorationIndex].y >= j && scene.decorations.up[decorationIndex].y < (j + 1)) {
            this.printDecoration(scene.decorations.up[decorationIndex], deltaWidth, deltaHeight)
            decorationIndex++
          } else if (characterIndex < scene.userDatas.length && (scene.userDatas[characterIndex].playerY - 0.5) >= j && (scene.userDatas[characterIndex].playerY - 0.5) < (j + 1)) {
            this.printCharacter(scene.userDatas[characterIndex], deltaWidth, deltaHeight)
            if (userData.userCode != scene.userDatas[characterIndex].userCode && Math.floor(pointerX / blockSize + this.$scenes.width) === scene.userDatas[characterIndex].playerX - 0.5 && Math.floor(pointerY / blockSize + this.$scenes.height) === scene.userDatas[characterIndex].playerY - 0.5) {
              isFocused = true
              interactionInfo = {
                type: 1,
                x: scene.userDatas[characterIndex].playerX - 0.5,
                y: scene.userDatas[characterIndex].playerY - 0.5,
                list: [5, 1, 7, 6],
                userCode: scene.userDatas[characterIndex].userCode
              }
              for (let k = 0; k < Math.min(4, interactionInfo.list.length); k++) {
                this.ctx.drawImage(interactions, interactionInfo.list[k] % 10 * buttonSize, Math.floor(interactionInfo.list[k] / 10) * buttonSize, buttonSize, buttonSize, (interactionInfo.x + k % 2 / 2) * blockSize + deltaWidth, (interactionInfo.y + Math.floor(k / 2) / 2) * blockSize + deltaHeight, blockSize / 2, blockSize / 2)
              }
            }
            characterIndex++
          }
        }
      }
      // Show events
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.textAlign = 'center'
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = 'white'
      for (let j = 0; j < this.$scenes.height * 3; j++) {
        for (let i = 0; i < this.$scenes.width * 3; i++) {
          if (Math.pow(userData.playerX + this.$scenes.width - i - 0.5, 2) + Math.pow(userData.playerY + this.$scenes.height - j - 0.5, 2) > Math.pow(interactDistance, 2)) {
            continue
          }
          if (scene.events[j][i] != 0 && scene.events[j][i] != 1 && Math.floor(pointerX / blockSize + this.$scenes.width) === i && Math.floor(pointerY / blockSize + this.$scenes.height) === j) {
            isFocused = true
            interactionInfo = {
              type: 2,
              x: i,
              y: j,
              list: [],
              code: scene.events[j][i].toString()
            }
          }
          if (scene.events[j][i] === 0) {
            // Ground
          } else if (scene.events[j][i] === 1) {
            // Wall
          } else if (scene.events[j][i] === 2) {
            // Storage
            this.ctx.fillText('行李箱', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize)
            if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2 && interactionInfo.list.length === 0) {
              interactionInfo.list = [1]
            }
          } else if (scene.events[j][i] === 3) {
            // Cooker
            this.ctx.fillText('灶台', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize)
            if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2 && interactionInfo.list.length === 0) {
              interactionInfo.list = [0]
            }
          } else if (scene.events[j][i] === 4) {
            // Sink
            this.ctx.fillText('饮水台', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize)
            if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2 && interactionInfo.list.length === 0) {
              interactionInfo.list = [0, 3]
            }
          } else if (scene.events[j][i] === 5) {
            // Bed
            this.ctx.fillText('床', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize)
            if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2 && interactionInfo.list.length === 0) {
              interactionInfo.list = [2]
            }
          } else if (scene.events[j][i] === 6) {
            // Toliet
            this.ctx.fillText('马桶', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize)
            if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2 && interactionInfo.list.length === 0) {
              interactionInfo.list = [0, 3]
            }
          } else if (scene.events[j][i] === 7) {
            // Dresser
            this.ctx.fillText('梳妆台', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize)
            if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2 && interactionInfo.list.length === 0) {
              interactionInfo.list = [8]
            }
          } else if (scene.events[j][i] === 8) {
            // Workshop
            this.ctx.fillText('工作台', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize)
            if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2 && interactionInfo.list.length === 0) {
              interactionInfo.list = [0]
            }
          } else if (scene.events[j][i] === 9) {
            // Packet
            this.ctx.fillText('包裹', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize)
            if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2 && interactionInfo.list.length === 0) {
              interactionInfo.list = [1]
            }
          }
          if (isFocused && this.isDef(interactionInfo.type) && interactionInfo.type === 2) {
            for (let k = 0; k < Math.min(4, interactionInfo.list.length); k++) {
              this.ctx.drawImage(interactions, interactionInfo.list[k] % 10 * buttonSize, Math.floor(interactionInfo.list[k] / 10) * buttonSize, buttonSize, buttonSize, (interactionInfo.x + k % 2 / 2) * blockSize + deltaWidth, (interactionInfo.y + Math.floor(k / 2) / 2) * blockSize + deltaHeight, blockSize / 2, blockSize / 2)
            }
          }
        }
      }
      this.ctx.fillStyle = '#000000' // 阴影颜色
      this.ctx.shadowBlur=0 // 阴影模糊范围
      this.ctx.shadowOffsetX=0
      this.ctx.shadowOffsetY=0
      this.ctx.textAlign = 'left'
    },
    printFloor (code, deltaWidth, deltaHeight) {
      if (this.isDef(code) && Math.floor(code / 1000) === 1) {
        // floors
        var offsetX = code % 10
        var offsetY = Math.floor(code / 10) % 100
        this.ctx.drawImage(floors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, deltaWidth, deltaHeight, blockSize, blockSize)
      } else if (this.isDef(code) && Math.floor(code / 1000) === 2) {
        // walls
        var offsetZ = code % 10
        var offsetX = Math.floor(code / 10) % 10 * 2 + offsetZ % 3 / 2
        var offsetY = Math.floor(code / 100) % 10 * 2 + Math.floor(offsetZ / 3) / 2
        this.ctx.drawImage(walls, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, deltaWidth, deltaHeight, blockSize, blockSize)
      }
    },
    printDecoration (decoration, deltaWidth, deltaHeight) {
      var code = decoration.code
      if (this.isDef(code) && Math.floor(code / 1000) == 1) {
        // objects
        var offsetX = code % 10
        var offsetY = Math.floor(code / 10) % 100
        this.ctx.drawImage(objects, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize + deltaWidth, decoration.y * blockSize + deltaHeight, blockSize, blockSize)
      } else if (this.isDef(code) && Math.floor(code / 1000) == 2) {
        // doors
        var offsetX = code % 10
        var offsetY = Math.floor(code / 10) % 100 * 4
        this.ctx.drawImage(doors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize + deltaWidth, decoration.y * blockSize + deltaHeight, blockSize, blockSize)
      } else if (this.isDef(code) && Math.floor(code / 1000) == 3) {
        // traffic
        var offsetX = code % 10
        var offsetY = Math.floor(code / 10) % 100
        this.ctx.drawImage(traffic, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize + deltaWidth, decoration.y * blockSize + deltaHeight, blockSize, blockSize)
      }
    },
    printCharacter (userDataTemp, deltaWidth, deltaHeight) {
      // Show individual
      var offsetX
      var offsetY
      if (userDataTemp.playerDirection == 1 || userDataTemp.playerDirection == 2) {
        offsetY = 2
      } else if (userDataTemp.playerDirection == 3 || userDataTemp.playerDirection == 4) {
        offsetY = 3
      } else if (userDataTemp.playerDirection == 5 || userDataTemp.playerDirection == 6) {
        offsetY = 1
      } else if (userDataTemp.playerDirection == 7 || userDataTemp.playerDirection == 8) {
        offsetY = 0
      } else {
        offsetY = 0
      }
      var timestamp = (new Date()).valueOf()
      var speed = Math.sqrt(Math.pow(userDataTemp.playerSpeedX, 2) + Math.pow(userDataTemp.playerSpeedY, 2))
      if (speed !== 0 && timestamp % 400 < 100) {
        offsetX = 0
      } else if (speed !== 0 && timestamp % 400 >= 200 && timestamp % 400 < 300) {
        offsetX = 2
      } else {
        offsetX = 1
      }
      if (userDataTemp.creature == 1) {
        // Display default character
        var adderX
        var adderY
        if (userDataTemp.gender == 1) {
          adderY = 4
        } else if (userDataTemp.gender == 2) {
          adderY = 0
        }
        if (userDataTemp.skinColor == 1) {
          adderX = 0
        } else if (userDataTemp.skinColor == 2) {
          adderX = 3
        } else if (userDataTemp.skinColor == 3) {
          adderX = 6
        } else if (userDataTemp.skinColor == 4) {
          adderX = 9
        }
        this.ctx.drawImage(characters, (offsetX + adderX) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        this.ctx.drawImage(eyesImage, (userDataTemp.eyes - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        // Print outfit
        // this.ctx.drawImage(pajamas_black, (offsetX + (userDataTemp.outfit - 1) * 3) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        if (userDataTemp.hairColor == 1) {
          this.ctx.drawImage(hairstyle_black, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        } else if (userDataTemp.hairColor == 2) {
          this.ctx.drawImage(hairstyle_grey, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        } else if (userDataTemp.hairColor == 3) {
          this.ctx.drawImage(hairstyle_orange, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        }
      } else {
        // Display animals
        var animalCharacter
        if (userDataTemp.creature == 2) {
          animalCharacter = paofu
        }
        if (this.isDef(animalCharacter)) {
          this.ctx.drawImage(animalCharacter, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        }
      }

      // Show name
      if (this.isDef(userDataTemp.nickname)) {
        this.ctx.shadowColor = 'black' // 阴影颜色
        this.ctx.shadowBlur = 2 // 阴影模糊范围
        this.ctx.shadowOffsetX = 2
        this.ctx.shadowOffsetY = 2
        this.ctx.textAlign = 'center'
        this.ctx.font = '16px sans-serif'
        this.ctx.fillStyle = userDataTemp.nameColor
        this.ctx.fillText(userDataTemp.nickname, userDataTemp.playerX * blockSize + deltaWidth, (userDataTemp.playerY - 0.5 + 0.12) * blockSize + deltaHeight, Math.min(document.documentElement.clientWidth - screenX, blockSize))
        this.ctx.fillStyle = '#000000' // 阴影颜色
        this.ctx.shadowBlur=0 // 阴影模糊范围
        this.ctx.shadowOffsetX=0
        this.ctx.shadowOffsetY=0
        this.ctx.textAlign = 'left'
      }
    },
    printChat () {
      var x = 0
      var y = -avatarSize
      if(this.isDef(chatMessages)) {
        // this.ctx.fillStyle = 'rgba(0,0,0,0.25)'
        // this.ctx.fillRect(screenX, document.documentElement.clientHeight - screenY - chatMessages.length * chatSize + 5, Math.min(document.documentElement.clientWidth, maxMsgLineSize - screenX), chatSize * chatMessages.length)
        for (let i = 0; i < chatMessages.length; i++) {
          this.ctx.shadowColor = 'black' // 阴影颜色
          this.ctx.shadowBlur = 2 // 阴影模糊范围
          this.ctx.shadowOffsetX = 2
          this.ctx.shadowOffsetY = 2
          this.ctx.font = '16px sans-serif'
          this.ctx.fillStyle = '#EEEEEE'
          this.ctx.fillText(chatMessages[chatMessages.length - 1 - i], screenX, document.documentElement.clientHeight - screenY - i * chatSize, Math.min(document.documentElement.clientWidth - screenX, maxMsgLineSize))
          this.ctx.fillStyle = '#000000' // 阴影颜色
          this.ctx.shadowBlur=0 // 阴影模糊范围
          this.ctx.shadowOffsetX=0
          this.ctx.shadowOffsetY=0
        }
      }
    },
    printMenu () {
      this.ctx.fillStyle = 'rgba(191, 191, 191, 0.75)'
      this.ctx.fillRect(menuLeftEdge, menuTopEdge, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge, document.documentElement.clientHeight - menuTopEdge - menuBottomEdge)
      this.ctx.fillStyle = '#000000'
    },
    printExchange () {
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = '#EEEEEE'
      this.ctx.fillText(Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100)
      this.ctx.fillText('$' + userStatus.money, menuLeftEdge + 110, menuTopEdge + 20, 50)
      this.ctx.fillStyle = '#000000'
      this.ctx.shadowBlur = 0 // 阴影模糊范围
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
    },
    printStatus () {
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = userData.nameColor
      var positionY = menuTopEdge + 20
      this.ctx.fillText(userData.nickname + ' (' + userData.lastName + ', ' + userData.firstName + ')', menuLeftEdge + 10, positionY, buttonSize * 5)
      this.ctx.fillStyle = '#EEEEEE'
      positionY += 20
      this.ctx.fillText('当前位置:' + this.$scenes.scenes[userData.sceneNo].name, menuLeftEdge + 10, positionY, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.ctx.fillText('Lv.' + userStatus.level + ' 经验值' + userStatus.exp + '/' + userStatus.expMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.ctx.fillText('生命值' + userStatus.hp + '/' + userStatus.hpMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.ctx.fillText('活力值' + userStatus.vp + '/' + userStatus.vpMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.ctx.fillText('饥饿值' + userStatus.hunger + '/' + userStatus.hungerMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.ctx.fillText('口渴值' + userStatus.thirst + '/' + userStatus.thirstMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.ctx.fillText('$' + userStatus.money + ' 负重' + Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, positionY, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.ctx.fillText('特殊状态 无', menuLeftEdge + 10, positionY, document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.ctx.fillStyle = '#000000'
      this.ctx.shadowBlur=0 // 阴影模糊范围
      this.ctx.shadowOffsetX=0
      this.ctx.shadowOffsetY=0
    },
    printItems () {
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = '#EEEEEE'
      this.ctx.fillText(Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100)
      this.ctx.fillText('$' + userStatus.money, menuLeftEdge + 110, menuTopEdge + 20, 50)
      this.ctx.fillStyle = '#000000'
      this.ctx.shadowBlur = 0 // 阴影模糊范围
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
    },
    printSettings () {
    },
    printInitialization () {
      var timestamp = (new Date()).valueOf()
      var offsetX = Math.floor(timestamp % 900 / 300)
      var offsetY = Math.floor(timestamp % 3600 / 900)

      // Avatar
      if (this.isDef(userData.avatar)) {
        this.ctx.drawImage(avatars, userData.avatar % 10 * avatarSize, Math.floor(userData.avatar / 10) * avatarSize, avatarSize, avatarSize, menuLeftEdge + 10, menuTopEdge + 10, avatarSize, avatarSize)
      }
      if (this.isDef(userData.nickname)) {
        this.ctx.drawImage(floors, 3 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
      }
      this.ctx.drawImage(avatars, document.getElementById('initialization-avatar').value % 10 * avatarSize, Math.floor(document.getElementById('initialization-avatar').value / 10) * avatarSize, avatarSize, avatarSize, menuLeftEdge + 160, menuTopEdge + 10, avatarSize, avatarSize)
      this.ctx.drawImage(floors, 3 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)

      // Show individual
      if (this.isDef(userData.creature)) {
        if (userData.creature == 1) {
          var adderX
          var adderY
          if (userData.gender == 1) {
            adderY = 4
          } else if (userData.gender == 2) {
            adderY = 0
          }
          if (userData.skinColor == 1) {
            adderX = 0
          } else if (userData.skinColor == 2) {
            adderX = 3
          } else if (userData.skinColor == 3) {
            adderX = 6
          } else if (userData.skinColor == 4) {
            adderX = 9
          }
          this.ctx.drawImage(characters, (offsetX + adderX) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          this.ctx.drawImage(eyesImage, (userData.eyes - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          // this.ctx.drawImage(outfits, (offsetX + (outfitNo - 1) * 3) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          if (userData.hairColor == 1) {
            this.ctx.drawImage(hairstyle_black, (userData.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          } else if (userData.hairColor == 2) {
            this.ctx.drawImage(hairstyle_grey, (userData.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          } else if (userData.hairColor == 3) {
            this.ctx.drawImage(hairstyle_orange, (userData.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          }
        } else if (userData.creature == 2)  {
          this.ctx.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, blockSize, blockSize)
        }
      }
      if (document.getElementById('initialization-creature').value == 1) {
        document.getElementById('initialization-skinColor').style.display = 'inline'
        document.getElementById('initialization-hairstyle').style.display = 'inline'
        document.getElementById('initialization-hairColor').style.display = 'inline'
        document.getElementById('initialization-eyes').style.display = 'inline'
        var adderX
        var adderY
        if (document.getElementById('initialization-gender').value == 1) {
          adderY = 4
        } else if (document.getElementById('initialization-gender').value == 2) {
          adderY = 0
        }
        if (document.getElementById('initialization-skinColor').value == 1) {
          adderX = 0
        } else if (document.getElementById('initialization-skinColor').value == 2) {
          adderX = 3
        } else if (document.getElementById('initialization-skinColor').value == 3) {
          adderX = 6
        } else if (document.getElementById('initialization-skinColor').value == 4) {
          adderX = 9
        }
        this.ctx.drawImage(characters, (offsetX + adderX) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        this.ctx.drawImage(eyesImage, (document.getElementById('initialization-eyes').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        // this.ctx.drawImage(outfits, (offsetX + (outfitNo - 1) * 3) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        if (document.getElementById('initialization-hairColor').value == 1) {
          this.ctx.drawImage(hairstyle_black, (document.getElementById('initialization-hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        } else if (document.getElementById('initialization-hairColor').value == 2) {
          this.ctx.drawImage(hairstyle_grey, (document.getElementById('initialization-hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        } else if (document.getElementById('initialization-hairColor').value == 3) {
          this.ctx.drawImage(hairstyle_orange, (document.getElementById('initialization-hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        }
      } else {
        document.getElementById('initialization-skinColor').style.display = 'none'
        document.getElementById('initialization-hairstyle').style.display = 'none'
        document.getElementById('initialization-hairColor').style.display = 'none'
        document.getElementById('initialization-eyes').style.display = 'none'
        if (document.getElementById('initialization-creature').value == 2) {
          this.ctx.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, blockSize, blockSize)
        }
      }

      // Show name
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.textAlign = 'center'
      this.ctx.font = '16px sans-serif'
      if (this.isDef(userData.nickname)) {
        this.ctx.fillStyle = userData.nameColor
        this.ctx.fillText(userData.nickname, menuLeftEdge + 10 + avatarSize / 2, menuTopEdge + 160 + avatarSize * 0.12, Math.min(document.documentElement.clientWidth - screenX, avatarSize))
      }
      this.ctx.fillStyle = '#000000' // 阴影颜色
      this.ctx.shadowBlur = 0 // 阴影模糊范围
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.textAlign = 'left'

      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.textAlign = 'center'
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = document.getElementById('initialization-nameColor').value
      this.ctx.fillText(document.getElementById('initialization-nickname').value, menuLeftEdge + 160 + avatarSize / 2, menuTopEdge + 160 + avatarSize * 0.12, Math.min(document.documentElement.clientWidth - screenX, avatarSize))
      this.ctx.fillStyle = '#000000' // 阴影颜色
      this.ctx.shadowBlur = 0 // 阴影模糊范围
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.textAlign = 'left'
    },
    clickItem () {
      if (canvasMoveUse === 3) {
        this.useItem()
      } else if (canvasMoveUse === 5) {
        this.exchangeItemForward()
      }
    },
    useItem () {
      var itemNo = document.getElementById('items-name').value
      if (itemNo.charAt(0) == 't') {
        // Only 1 tool is allowed to be equipped
        if (this.isDef(userData.tools) && userData.tools.length > 0 && userData.tools[0] == itemNo) {
          userData.tools = []
        } else {
          userData.tools = [itemNo]
        }
        this.updateItems()
      }
      if (itemNo.charAt(0) == 'a') {
        // Only 1 outfit is allowed to be equipped
        if (this.isDef(userData.outfits) && userData.outfits.length > 0 && userData.outfits[0] == itemNo) {
          userData.outfits = []
        } else {
          userData.outfits = [itemNo]
        }
        this.updateItems()
      }
      if (itemNo.charAt(0) == 'c') {
        // Consumable
        if (!this.isDef(userStatus.items[itemNo]) || userStatus.items[itemNo] === 0) {
          return
        } else {
          userStatus.items[itemNo]--
        }
        for (let effectType in this.$items.consumables[itemNo].effects) {
          if (effectType == 'hp') {
            userStatus.hp = Math.min(userStatus.hp + this.$items.consumables[itemNo].effects[effectType], userStatus.hpMax)
          }
          if (effectType == 'vp') {
            userStatus.vp = Math.min(userStatus.vp + this.$items.consumables[itemNo].effects[effectType], userStatus.vpMax)
          }
          if (effectType == 'hunger') {
            userStatus.hunger = Math.min(userStatus.hunger + this.$items.consumables[itemNo].effects[effectType], userStatus.hungerMax)
          }
          if (effectType == 'thirst') {
            userStatus.thirst = Math.min(userStatus.thirst + this.$items.consumables[itemNo].effects[effectType], userStatus.thirstMax)
          }
        }
        this.updateItems()
      }
      if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
        // Material, junk
      }
      if (itemNo.charAt(0) == 'n') {
        // Note
        this.addChat(this.$items.notes[name] + ':' + this.$items.notes[content])
      }
      if (itemNo.charAt(0) == 'r') {
        // Recording
      }
    },
    exchangeItemForward () {
      var itemNo = document.getElementById('items-name').value
      if (itemNo.charAt(0) == 't') {
        // Only 1 tool is allowed to be equipped
        if (this.isDef(userData.tools) && userData.tools.length > 0 && userData.tools[0] == itemNo && userStatus.items[itemNo] === 1) {
          userData.tools = []
        } else {
        }
      }
      if (itemNo.charAt(0) == 'a') {
        // Only 1 outfit is allowed to be equipped
        if (this.isDef(userData.outfits) && userData.outfits.length > 0 && userData.outfits[0] == itemNo && userStatus.items[itemNo] === 1) {
          userData.outfits = []
        } else {
        }
      }
      if (itemNo.charAt(0) == 'c') {
        // Consumable
      }
      if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
        // Material, junk
      }
      if (itemNo.charAt(0) == 'n') {
        // Note
      }
      if (itemNo.charAt(0) == 'r') {
        // Recording
      }
      userStatus.items[itemNo]--
      if (this.isDef(userStatus.preservedItems[itemNo]) && userStatus.preservedItems[itemNo] > 0) {
        userStatus.preservedItems[itemNo]++
      } else {
        userStatus.preservedItems[itemNo] = 1
      }
      this.updateItems()
      this.updatePreservedItems()
    },
    exchangeItemBackward () {
      var itemNo = document.getElementById('items-next-name').value
      if (itemNo.charAt(0) == 't') {
        // Only 1 tool is allowed to be equipped
      }
      if (itemNo.charAt(0) == 'a') {
        // Only 1 outfit is allowed to be equipped
      }
      if (itemNo.charAt(0) == 'c') {
        // Consumable
      }
      if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
        // Material, junk
      }
      if (itemNo.charAt(0) == 'n') {
        // Note
      }
      if (itemNo.charAt(0) == 'r') {
        // Recording
      }
      if (this.isDef(userStatus.items[itemNo]) && userStatus.items[itemNo] > 0) {
        userStatus.items[itemNo]++
      } else {
        userStatus.items[itemNo] = 1
      }
      userStatus.preservedItems[itemNo]--
      this.updateItems()
      this.updatePreservedItems()
    },
    updateItems () {
      userStatus.capacity = 0
      var checkValue = document.getElementById('items-name').value
      document.getElementById('items-name').length = 1
      if (this.isDef(userStatus.items)) {
        for (let itemNo in userStatus.items) {
          let itemAmount = userStatus.items[itemNo]
          if (!this.isDef(itemAmount) || itemAmount === 0) {
            continue
          }
          if (itemNo.charAt(0) == 't') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              if (this.isDef(userData.tools) && userData.tools.length > 0 && userData.tools[0] == itemNo) {
                document.getElementById('items-name').options.add(new Option('●' + this.$items.tools[itemNo].name + ' * ' + itemAmount, itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + this.$items.tools[itemNo].name + ' * ' + itemAmount, itemNo))
              }
            }
            userStatus.capacity += this.$items.tools[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'a') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.isDef(userData.outfits) && userData.outfits.length > 0 && userData.outfits[0] == itemNo) {
                      document.getElementById('items-name').options.add(new Option('●' + this.$items.clothing[itemNo].name + ' * ' + itemAmount, itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + this.$items.clothing[itemNo].name + ' * ' + itemAmount, itemNo))
              }
            }
            userStatus.capacity += this.$items.clothing[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'c') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-name').options.add(new Option(' ' + this.$items.consumables[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.consumables[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option(' ' + this.$items.materials[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.materials[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'n') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-name').options.add(new Option(' ' + this.$items.notes[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.notes[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'r') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
              document.getElementById('items-name').options.add(new Option(' ' + this.$items.recordings[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.recordings[itemNo].weight * itemAmount
          }
        }
      }
      for (let i = 0; i < document.getElementById('items-name').options.length; i++){
        if (document.getElementById('items-name').options[i].value == checkValue) {
          document.getElementById('items-name').options[i].selected = true
        }
      }
    },
    updatePreservedItems () {
      userStatus.capacity = 0
      var checkValue = document.getElementById('items-next-name').value
      document.getElementById('items-next-name').length = 1
      if (interactionInfo.code == '2' && this.isDef(userStatus.preservedItems)) {
        for (let itemNo in userStatus.preservedItems) {
          let itemAmount = userStatus.preservedItems[itemNo]
          if (!this.isDef(itemAmount) || itemAmount === 0) {
            continue
          }
          if (itemNo.charAt(0) == 't') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-next-type').value == '1') {
              if (this.isDef(userData.tools) && userData.tools.length > 0 && userData.tools[0] == itemNo) {
                document.getElementById('items-next-name').options.add(new Option('●' + this.$items.tools[itemNo].name + ' * ' + itemAmount, itemNo))
              } else {
                document.getElementById('items-next-name').options.add(new Option('○' + this.$items.tools[itemNo].name + ' * ' + itemAmount, itemNo))
              }
            }
            userStatus.capacity += this.$items.tools[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'a') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.isDef(userData.outfits) && userData.outfits.length > 0 && userData.outfits[0] == itemNo) {
                      document.getElementById('items-next-name').options.add(new Option('●' + this.$items.clothing[itemNo].name + ' * ' + itemAmount, itemNo))
              } else {
                document.getElementById('items-next-name').options.add(new Option('○' + this.$items.clothing[itemNo].name + ' * ' + itemAmount, itemNo))
              }
            }
            userStatus.capacity += this.$items.clothing[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'c') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-next-name').options.add(new Option(' ' + this.$items.consumables[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.consumables[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-next-name').options.add(new Option(' ' + this.$items.materials[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.materials[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'n') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-next-name').options.add(new Option(' ' + this.$items.notes[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.notes[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'r') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
              document.getElementById('items-next-name').options.add(new Option(' ' + this.$items.recordings[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.recordings[itemNo].weight * itemAmount
          }
        }
      }
      for (let i = 0; i < document.getElementById('items-next-name').options.length; i++){
        if (document.getElementById('items-next-name').options[i].value == checkValue) {
          document.getElementById('items-next-name').options[i].selected = true
        }
      }
    },
    canvasDownPC (e) {
      var x = e.clientX - e.target.offsetLeft
      var y = e.clientY - e.target.offsetTop
      this.canvasDown(x, y)
    },
    canvasDownPhone (e) {
      var x = e.changedTouches[0].clientX - e.target.offsetLeft
      var y = e.changedTouches[0].clientY - e.target.offsetTop
      this.canvasDown(x, y)
    },
    canvasDown (x, y) {
      if (canvasMoveUse === 8 && !this.isDef(userData.nickname)) {
        return
      }
      if ((canvasMoveUse === 2 || canvasMoveUse === 3 || canvasMoveUse === 4 || canvasMoveUse === 5 || canvasMoveUse === 8) && x >= menuLeftEdge && x <= (menuLeftEdge + document.documentElement.clientWidth / 2 - menuLeftEdge - menuRightEdge) && y >= menuTopEdge && y <= (menuTopEdge + document.documentElement.clientHeight - menuTopEdge - menuBottomEdge)) {
        return
      }
      pointerX = x + document.documentElement.scrollLeft - defaultDeltaWidth
      pointerY = y + document.documentElement.scrollTop - defaultDeltaHeight
      if (x < avatarSize && y >= this.ctx.canvas.height - avatarSize) {
        // Avatar
        canvasMoveUse = 1
      } else if (x < avatarSize + 1 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Personal information
        canvasMoveUse = canvasMoveUse === 2 ? -1 : 2 
      } else if (x < avatarSize + 2 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Backpack
        canvasMoveUse = canvasMoveUse === 3 ? -1 : 3
      } else if (x < avatarSize + 3 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Settings
        canvasMoveUse = canvasMoveUse === 4 ? -1 : 4
      } else if (x > (recordButtonX >= 0 ? recordButtonX : (this.ctx.canvas.width + recordButtonX)) && x < ((recordButtonX >= 0 ? recordButtonX : (this.ctx.canvas.width + recordButtonX)) + smallButtonSize) && y > (recordButtonY >= 0 ? recordButtonY : (this.ctx.canvas.height + recordButtonY)) && y < ((recordButtonY >= 0 ? recordButtonY : (this.ctx.canvas.height + recordButtonY)) + smallButtonSize)) {
        // Voice record
        canvasMoveUse = 10
        this.recordStart()
      } else if (isFocused) {
        var digitX = Math.floor((pointerX / blockSize + this.$scenes.width - interactionInfo.x) / 0.5)
        var digitY = Math.floor((pointerY / blockSize + this.$scenes.height - interactionInfo.y) / 0.5)
        if (digitX >= 0 && digitX < 2 && digitY >= 0 && digitY < 2 && interactionInfo.list.length > digitX + digitY * 2) {
          this.interact(interactionInfo.list[digitX + digitY * 2])
        }
      } else {
        // Playground
        canvasMoveUse = 0
        userData.playerNextX = pointerX / blockSize
        userData.playerNextY = pointerY / blockSize
      }
    },
    canvasMovePC (e) {
      var x = e.clientX - e.target.offsetLeft
      var y = e.clientY - e.target.offsetTop
      this.canvasMove (x ,y)
    },
    canvasMovePhone (e) {
      var x = e.changedTouches[0].clientX - e.target.offsetLeft
      var y = e.changedTouches[0].clientY - e.target.offsetTop
      this.canvasMove (x ,y)
    },
    canvasMove (x ,y) {
      pointerX = x + document.documentElement.scrollLeft - defaultDeltaWidth
      pointerY = y + document.documentElement.scrollTop - defaultDeltaHeight
      if (canvasMoveUse === 0) {
        userData.playerNextX = pointerX / blockSize
        userData.playerNextY = pointerY / blockSize
      }
    },
    canvasUp () {
      this.canvasLeave()
    },
    canvasLeave () {
      userData.nextSceneNo = userData.sceneNo
      userData.playerNextX = userData.playerX
      userData.playerNextY = userData.playerY
      userData.playerSpeedX = 0
      userData.playerSpeedY = 0
      if (canvasMoveUse === 10) {
        this.recordEnd()
        canvasMoveUse = -1
      } else if (canvasMoveUse !== 0 && canvasMoveUse !== 1) {
        // No effect
      } else {
        canvasMoveUse = -1
      }
    },
    playerMoveFour () {
      var deltaX = userData.playerNextX - userData.playerX
      var deltaY = userData.playerNextY - userData.playerY
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(stopEdge, 2)) {
        // Set speed
        userData.playerSpeedX = 0
        userData.playerSpeedY = 0
      } else {
        // Set speed
        // var coeffiecient = acceleration / Math.sqrt((Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        var coeffiecient = 0.05 / Math.sqrt((Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        if (this.isDef(userStatus.vp) && userStatus.vp > 0) {
          userStatus.vp--
          userData.playerSpeedX = Math.max(-userData.playerMaxSpeedX, Math.min(userData.playerMaxSpeedX, userData.playerSpeedX + deltaX * coeffiecient))
          userData.playerSpeedY = Math.max(-userData.playerMaxSpeedY, Math.min(userData.playerMaxSpeedY, userData.playerSpeedY + deltaY * coeffiecient))
          // Set direction
          if (userData.playerSpeedX > 0 && Math.abs(userData.playerSpeedX) >= Math.abs(userData.playerSpeedY)) {
            userData.playerDirection = 1
          } else if (userData.playerSpeedX < 0 && Math.abs(userData.playerSpeedX) >= Math.abs(userData.playerSpeedY)) {
            userData.playerDirection = 5
          } else if (userData.playerSpeedY > 0 && Math.abs(userData.playerSpeedX) <= Math.abs(userData.playerSpeedY)) {
            userData.playerDirection = 7
          } else if (userData.playerSpeedY < 0 && Math.abs(userData.playerSpeedX) <= Math.abs(userData.playerSpeedY)) {
            userData.playerDirection = 3
          } else {
            userData.playerDirection = 7
          }
        } else {
          userData.playerSpeedX = Math.max(-userData.playerMaxSpeedX / 2, Math.min(userData.playerMaxSpeedX / 2, userData.playerSpeedX + deltaX * coeffiecient))
          userData.playerSpeedY = Math.max(-userData.playerMaxSpeedY / 2, Math.min(userData.playerMaxSpeedY / 2, userData.playerSpeedY + deltaY * coeffiecient))
        }
        // Detect obstacles, not edge
        if (userData.playerSpeedX > 0) {
          if (newScene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + this.$scenes.height)][Math.floor(userData.playerX + 0.5 - sharedEdge + userData.playerSpeedX + this.$scenes.width)] === 0 &&
          newScene.events[Math.ceil(userData.playerY - 0.5 - sharedEdge + this.$scenes.height)][Math.floor(userData.playerX + 0.5 - sharedEdge + userData.playerSpeedX + this.$scenes.width)] === 0) {
            userData.playerX += userData.playerSpeedX
            // Infinitive moving
            userData.playerNextX += userData.playerSpeedX
          } else {
            userData.playerSpeedX = 0
          }
        }
        if (userData.playerSpeedX < 0) {
          if (newScene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + this.$scenes.height)][Math.floor(userData.playerX - 0.5 + sharedEdge + userData.playerSpeedX + this.$scenes.width)] === 0 &&
          newScene.events[Math.ceil(userData.playerY - 0.5 - sharedEdge + this.$scenes.height)][Math.floor(userData.playerX - 0.5 + sharedEdge + userData.playerSpeedX + this.$scenes.width)] === 0) {
            userData.playerX += userData.playerSpeedX
            // Infinitive moving
            userData.playerNextX += userData.playerSpeedX
          } else {
            userData.playerSpeedX = 0
          }
        }
        if (userData.playerSpeedY > 0) {
          if (newScene.events[Math.floor(userData.playerY + 0.5 - sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.floor(userData.playerX - 0.5 + sharedEdge + this.$scenes.width)] === 0 &&
          newScene.events[Math.floor(userData.playerY + 0.5 - sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.ceil(userData.playerX - 0.5 - sharedEdge + this.$scenes.width)] === 0) {
            userData.playerY += userData.playerSpeedY
            // Infinitive moving
            userData.playerNextY += userData.playerSpeedY
          } else {
            userData.playerSpeedY = 0
          }
        }
        if (userData.playerSpeedY < 0) {
          if (newScene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.floor(userData.playerX - 0.5 + sharedEdge + this.$scenes.width)] === 0 &&
          newScene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.ceil(userData.playerX - 0.5 - sharedEdge + this.$scenes.width)] === 0) {
            userData.playerY += userData.playerSpeedY
            // Infinitive moving
            userData.playerNextY += userData.playerSpeedY
          } else {
            userData.playerSpeedY = 0
          }
        }

        // Randomly get item
        if (Math.random() <= 0.1) {
          var timestamp = (new Date()).valueOf()
          if (timestamp % 150 < 150) {
            var itemName = 'j'
            if (timestamp % 150 + 1 < 10) {
              itemName += '00'
            } else if (timestamp % 150 + 1 < 100) {
              itemName += '0'
            }
            itemName += (timestamp % 150 + 1)
            if (this.isDef(userStatus.items[itemName])) {
              userStatus.items[itemName]++
            } else {
              userStatus.items[itemName] = 1
            }
            this.addChat('获得“'+ this.$items.materials[itemName].name +'”')
            this.updateItems()
          }
        }

        // Check whether user is out of the scene, then update the current scene
        var scene = this.$scenes.scenes[userData.sceneNo]
        if (scene.up !== -1 && userData.playerY < 0) {
          userData.sceneNo = scene.up
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerY += this.$scenes.height
          this.addChat('来到【'+ scene.name +'】')
        }
        if (scene.down !== -1 && userData.playerY >= this.$scenes.height) {
          userData.sceneNo = scene.down
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerY -= this.$scenes.height
          this.addChat('来到【'+ scene.name +'】')
        }
        if (scene.left !== -1 && userData.playerX < 0) {
          userData.sceneNo = scene.left
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerX += this.$scenes.width
          this.addChat('来到【'+ scene.name +'】')
        }
        if (scene.right !== -1 && userData.playerX >= this.$scenes.width) {
          userData.sceneNo = scene.right
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerX -= this.$scenes.width
          this.addChat('来到【'+ scene.name +'】')
        }
        if (this.isDef(newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)]) && this.isDef(newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)])) {
          userData.sceneNo = newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)].toSceneNo
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerX = newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)].toX + 0.5
          userData.playerY = newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)].toY + 0.5
          this.addChat('来到【'+ scene.name +'】')
        }
	    }
    },
    save () {
      const imgBase64 = this.$refs.canvas.toDataURL()
      // console.log(imgBase64)
    },
    resizeCanvas () {
      // this.ctx.canvas.width = Math.max(canvasMinSizeX * blockSize, Math.min(canvasMaxSizeX * blockSize, document.documentElement.clientWidth))
      // this.ctx.canvas.height = Math.max(canvasMinSizeY * blockSize, Math.min(canvasMaxSizeY * blockSize, document.documentElement.clientHeight))
      this.ctx.canvas.width = document.documentElement.clientWidth
      this.ctx.canvas.height = document.documentElement.clientHeight
      console.log('New size: ' + this.ctx.canvas.width + '*' + this.ctx.canvas.height)
    },
    readTextFile (filePath) {
      fetch(filePath)
        .then(response => response.json())
        .then(jsonResponse => console.log(jsonResponse))
    },
    isDef (v) {
      return v !== undefined && v !== null
    },
    isPromise (val) {
      return this.isDef(val)
      && typeof val.then === 'function'
      && typeof val.catch === 'function'
    },
    recordStart () {
      // document.getElementById('musicAudio').pause()
      document.getElementById('soundAudio').pause()
      if (!micIsPermitted) {
        Recorder.getPermission().then(() => {
          console.log('获取录音权限成功')
          micIsPermitted = true
        }, (error) => {
          this.$Message.info('请先允许该网页使用麦克风')
          console.log(`${error.name} : ${error.message}`)
        })
      }
      var audioObj = document.getElementById("voiceAudio")
      if (!audioObj.ended){
        audioObj.pause()
        audioObj.currentTime = 0
      }
      voiceInUse = false
      rc.clear()
      rc.start()
      .then(() => {
        micInUse = true
        console.log('start recording')
      })
      .catch(error => {
        this.$toast.fail('获取麦克风失败')
        micInUse = false
        console.log('Recording failed.', error)
      })
    },
    recordEnd () {
      setTimeout(() => {
        this.sendVoice(1, '')
        // document.getElementById('musicAudio').play()
      }, voiceEndDelay)
    },
    async sendChat (type, receiver) {
      // Only broadcasting mode
      let message = document.getElementById('chat-content').value
      document.getElementById('chat-content').value = ''
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userData.userCode, receiver: receiver, type: type, content: message })
      }
      await this.$axios.post(this.api_path + "/send-chat", requestOptions)
          .then(res => {
      })
      .catch(error => {
      })
    },
    async sendVoice (type, receiver) {
      micInUse = false
      rc.pause() // 先暂停录音
      var blob = rc.getRecord({
        encodeTo: ENCODE_TYPE.WAV,
        compressible: true
      }) // 获取录音文件
      const blobToBase64 = (blob) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onloadend = function () {
            resolve(reader.result)
          }
        })
      }
      var content = await blobToBase64(blob)
    
      // Only broadcasting mode
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userData.userCode, receiver: receiver, type: type, content: content })
      }
      await this.$axios.post(this.api_path + "/send-voice", requestOptions)
          .then(res => {
      })
      .catch(error => {
      })
      rc.clear()
    },
    async playBlob(blob) {
      // update file path for Audio tag...
      var audioObj = document.getElementById("voiceAudio")
      var url = (window.URL || window.webkitURL).createObjectURL( blob )
      audioObj.src = url
      audioObj.load()
      await audioObj.play()
          .then(() => {
        // Audio is playing.
      })
          .catch(error => {
        console.log(error)
      })
    },
    addChat (msgContent) {
      chatMessages.push(msgContent)
        while (chatMessages.length > maxMsgLineNum) {
          chatMessages = chatMessages.slice(1)
        }
    },
    updateChat () {
      if (this.isDef(chatMessages)) {
        chatMessages = chatMessages.slice(1)
      }
    },
    async updateVoice (blob) {
      if (voiceMessages.length > 0 && !micInUse) {
        var blob = await fetch(voiceMessages[0]).then(res => res.blob())
        voiceMessages = voiceMessages.slice(1)
        voiceInUse = true
        await this.playBlob(blob)
        voiceInUse = false
      }
    },
    playMusic () {
      // var audioObj = document.getElementById("musicAudio")
      // audioObj.loop = true
      // audioObj.load()
      // audioObj.play()
    },
    shutdown () {
      clearInterval(intervalTimer20)
      clearInterval(intervalTimer1000)
      clearInterval(intervalTimer30000)
      clearInterval(intervalTimerHp)
      clearInterval(intervalTimerVp)
      clearInterval(intervalTimerHunger)
      clearInterval(intervalTimerThirst)
      window.removeEventListener('resize', this.resizeCanvas)
      this.websocket.close()
    },
    async setUserCharacter () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: userData.userCode,
          firstName: document.getElementById('initialization-firstName').value,
          lastName: document.getElementById('initialization-lastName').value,
          nickname: document.getElementById('initialization-nickname').value,
          nameColor: document.getElementById('initialization-nameColor').value,
          creature: document.getElementById('initialization-creature').value,
          gender: document.getElementById('initialization-gender').value,
          skinColor: document.getElementById('initialization-skinColor').value,
          hairstyle: document.getElementById('initialization-hairstyle').value,
          hairColor: document.getElementById('initialization-hairColor').value,
          eyes: document.getElementById('initialization-eyes').value,
          // outfit: outfitNo,
          avatar: document.getElementById('initialization-avatar').value})
      }
      await this.$axios.post(this.api_path + "/set-user-character", requestOptions)
        .then(res => {
        canvasMoveUse = -1
        userData.firstName = document.getElementById('initialization-firstName').value
        userData.lastName = document.getElementById('initialization-lastName').value
        userData.nickname = document.getElementById('initialization-nickname').value
        userData.nameColor = document.getElementById('initialization-nameColor').value
        userData.creature = document.getElementById('initialization-creature').value
        userData.gender = document.getElementById('initialization-gender').value
        userData.skinColor = document.getElementById('initialization-skinColor').value
        userData.hairstyle = document.getElementById('initialization-hairstyle').value
        userData.hairColor = document.getElementById('initialization-hairColor').value
        userData.eyes = document.getElementById('initialization-eyes').value
        userData.avatar = document.getElementById('initialization-avatar').value
      })
      .catch(error => {
      })
    },
    cancelUserCharacter () {
      canvasMoveUse = -1
	  },
    interact (interactionCode) {
      if (!this.isDef(interactionInfo) || !this.isDef(interactionCode)) {
        return
      }
      if (interactionInfo.type === 1) {
	      // Interact with other player
        if (interactionCode === 1) {
          // Exchange
          canvasMoveUse = 5
        } else if (interactionCode === 5) {
          // Communicate
        } else if (interactionCode === 6) {
          // Attack
        } else if (interactionCode === 7) {
          // Flirt
        }
      } else if (interactionInfo.type === 2) {
        // Interact with event
        if (interactionCode === 0) {
          // Access
          canvasMoveUse = 6
        } else if (interactionCode === 1) {
          // Exchange
          canvasMoveUse = 5
        } else if (interactionCode === 2) {
          // Sleep
        } else if (interactionCode === 3) {
          // Drink
        } else if (interactionCode === 4) {
          // Decompose
          canvasMoveUse = 7
        } else if (interactionCode === 8) {
          // Makeup
          canvasMoveUse = 8
        }
	    }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
    *{
    }
    .world-canvas{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        padding: 0px 0px;
        outline:none;
    }
    .world-canvas canvas{
        -webkit-touch-callout:none; /*系统默认菜单被禁用*/
        -webkit-user-select:none; /*webkit浏览器*/
        -khtml-user-select:none; /*早期浏览器*/
        -moz-user-select:none;/*火狐*/
        -ms-user-select:none; /*IE10*/
        user-select:none;
        background-color: #000000;
    }
    .chat{
        position: absolute;
        left: 0px;
        bottom: 115px;
        display: none;
    }
    .chat #chat-content{
        height: 20px;
        width: 150px;
        opacity:0.75;
        font-size:16px;
    }
    .chat #chat-enter{
        height: 25px;
        width: 40px;
        font-size:10px;
    }
    .items{
        opacity:0.75;
        display: none;
    }
    .items #items-type{
        position: absolute;
        left: 260px;
        top: 160px;
        width: 50px;
        display: flex;
    }
    .items #items-name{
        position: absolute;
        left: 260px;
        top: 185px;
        width: 150px;
        display: flex;
    }
    .items #items-enter{
        position: absolute;
        left: 260px;
        top: 210px;
        height: 25px;
        width: 50px;
        display: flex;
        font-size:10px;
    }
    .items-next{
        display: none;
    }
    .items-next #items-next-name{
        position: absolute;
        left: 460px;
        top: 185px;
        width: 150px;
        display: flex;
    }
    .items-next #items-next-enter{
        position: absolute;
        left: 460px;
        top: 210px;
        height: 25px;
        width: 50px;
        display: flex;
        font-size:10px;
    }
    .initialization{
        position: absolute;
        left: 260px;
        top: 410px;
        opacity:0.75;
        display: none;
        font-size:16px;
        text-align: left;
    }
    .initialization input{
        left: 0px;
        width: 100px;
    }
</style>
