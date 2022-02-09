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
            style="display:none"
        >
            抱歉，您的浏览器暂不支持canvas元素
        </canvas>
        <input id="chat" type="text" value=""/>
        <button id="enter" @click="sendChat(1, '')">Enter</button>
        <div id="items" class="items">
            <select id="items-type" size="7" @change="updateItems()">
                <option value="0">全部</option>
                <option value="1">工具</option>
                <option value="2">装备</option>
                <option value="3">用品</option>
                <option value="4">材料</option>
                <option value="5">笔记</option>
                <option value="6">录音</option>
            </select>
            <select id="items-name" size="10" @dblclick="useItem()">
            </select>
            <select id="items-name-next" size="10">
            </select>
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
        <img id="pajamas_black" src="../assets/image/characters/outfits/pajamas_black.png" />
        <img id="pajamas_grey" src="../assets/image/characters/outfits/pajamas_grey.png" />
        <img id="pajamas_white" src="../assets/image/characters/outfits/pajamas_white.png" />
        <img id="pajamas_red" src="../assets/image/characters/outfits/pajamas_red.png" />
        <img id="pajamas_green" src="../assets/image/characters/outfits/pajamas_green.png" />
        <img id="pajamas_blue" src="../assets/image/characters/outfits/pajamas_blue.png" />
        <img id="pajamas_orange" src="../assets/image/characters/outfits/pajamas_orange.png" />
        <img id="pajamas_yellow" src="../assets/image/characters/outfits/pajamas_yellow.png" />
        <img id="pajamas_purple" src="../assets/image/characters/outfits/pajamas_purple.png" />
        <img id="floors" src="../assets/image/floors.png" />
        <img id="decorations" src="../assets/image/decorations.png" />
        <img id="doors" src="../assets/image/doors.png" />
        <img id="buttons" src="../assets/image/buttons.png" />
    </div>
  </div>
</template>

<script>
let userDatas = []
let userData = undefined
let userStatus = undefined
let chatMessages = []
let voiceMessages = []

let turnOnShow = true
const canvasMaxSizeX = 16
const canvasMaxSizeY = 9
const canvasMinSizeX = 1
const canvasMinSizeY = 1
const stopEdge = 0.15
// sharedEdge is used for obstacles, not edge of the canvas map
const sharedEdge = 0.25
let blockSize = 100
const imageBlockSize = 100
// -1-not-in-use 0-playground 1-avatar 2-info 3-msg 4-voice 5-settings
let canvasMoveUse = -1
const avatarSize = 100
const buttonSize = 50
let pointerX = -1
let pointerY = -1
let showStatus
let showItems
const maxStatusLineSize = 100
const statusSize = 20
let defaultDeltaWidth
let defaultDeltaHeight
let newScene

let showChat = true
var messages = []
const screenX = 10
const screenY= 160
const maxMsgLineNum = 5
const maxMsgLineSize = 400
const chatSize = 20

import Recorder from 'js-audio-recorder' //用于获取麦克风权限
import Recorderx, { ENCODE_TYPE } from 'recorderx'; //用于录音
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
      let imgIds = ['avatars', 'characters', 'hairstyle', 'hairstyle_black', 'hairstyle_grey', 'hairstyle_orange', 'eyesImage', 'pajamas_black', 'pajamas_grey', 'pajamas_white', 'pajamas_red', 'pajamas_green', 'pajamas_blue', 'pajamas_orange', 'pajamas_yellow', 'pajamas_purple', 'floors', 'decorations', 'doors', 'buttons']
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
        this.init()
      }
    }, 1000)
  },
  destroy () {
    this.shutdown()
  },
  methods: {
    async init () {
      //userData = {
      //  userCode: sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2),
      //  token: sessionStorage['token'].substr(1, sessionStorage['token'].length - 2),
      //  initFlag: 1
      //}
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
      showStatus = true
      showItems = true
      document.getElementById("chat").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          document.getElementById("enter").click();
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

      // 需要定时执行的代码
      intervalTimer20 = setInterval(() => {
        if (this.websocket.readyState === 1) {
          this.sendWebsocketMessage()
          this.playerMoveFour()
          if (turnOnShow) {
            this.show()
          }
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
    webSocketMessage (e) {
      // 接收服务器返回的数据
      // console.log('服务器返回的消息', e.data)
      var response = JSON.parse(e.data)
      if (!this.isDef(response.websocketmessagetype)) {
        return
      }

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
      // if (this.isDef(userData) && response.token != userData.token) {
      if (this.isDef(sessionStorage['token']) && response.token != sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)) {
      console.log('logoff: '+sessionStorage['token'] +':'+ response.token)
        this.logoff()
      }
      
      // Update userDatas (Communication)
      userDatas = response.userDatas
      if (this.isDef(response.chatMessages)) {
      console.log('chatMessages received')
        for (let i = 0; i < response.chatMessages.length; i++) {
          for (let j = 0; j < userDatas.length; j++) {
            if (response.chatMessages[i].fromUuid == userDatas[j].userCode) {
              chatMessages.push(userDatas[j].nickname + ':')
              if (response.chatMessages[i].type === 1) {
                chatMessages.push(('[广播]' + response.chatMessages[i].content))
              } else {
                chatMessages.push(response.chatMessages[i].content)
              }
              while (chatMessages.length > maxMsgLineNum * 2) {
                chatMessages = chatMessages.slice(-maxMsgLineNum * 2 + 1)
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
    async initUserData () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2) })
      }
      await this.$axios.post(this.api_path + "/init-user-data", requestOptions).then(res => {
        userData = res.data.userData
        userStatus = res.data.userStatus
        // if (sessionStorage['token'] !== null) {
          // userData.userCode = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
          // userData.token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
        // }
        console.log('User data initialized.')
      })
      .catch(error => {
      })
    },
    webSocketClose (e) {
      console.log('WebSocket连接断开', e)
      this.logoff()
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
      this.ctx.drawImage(avatars, userData.avatar * avatarSize, 0 * avatarSize, avatarSize, avatarSize, 0 * avatarSize, this.ctx.canvas.height - avatarSize, avatarSize, avatarSize)
      for (let i = 0; i < 5; i++) {
        if (canvasMoveUse !== i + 2) {
          this.ctx.drawImage(buttons, i * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + i * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
        } else {
          this.ctx.drawImage(buttons, i * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + i * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
        }
      }
      if (showChat) {
        document.getElementById('chat').style.display = 'inline'
        document.getElementById('enter').style.display = 'inline'
        this.printChat()
      } else {
        document.getElementById('chat').style.display = 'none'
        document.getElementById('enter').style.display = 'none'
      }
      if (showStatus) {
        this.printStatus()
      }
      this.printItems()

      // Cursor
      if (pointerX !== -1 && pointerY !== -1) {
        // this.ctx.drawImage(paw, pointerX - blockSize + defaultDeltaWidth, pointerY - blockSize + defaultDeltaHeight)
      }
    },
    printScene (scene, deltaWidth, deltaHeight) {

      // Bottom floor
      if (this.isDef(scene.floors)) {
        for (var i = 0; i < this.$scenes.height * 3; i++) {
          for (var j = 0; j < this.$scenes.width * 3; j++) {
            var code = scene.floors[j][i]
            if (this.isDef(code) && code < 0) {
              code *= -1
              var offsetX = code % 10
              var offsetY = Math.floor(code / 10) % 100
              this.ctx.drawImage(floors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, i * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, blockSize)
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
            if (code > 0) {
              var offsetX = code % 10
              var offsetY = Math.floor(code / 10) % 100
              this.ctx.drawImage(floors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, i * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, blockSize)
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
                //if (userData.userCode == scene.userDatas[characterIndex].userCode) {
                //  this.printCharacter(userData, deltaWidth, deltaHeight)
                //} else {
                  this.printCharacter(scene.userDatas[characterIndex], deltaWidth, deltaHeight)
                //}
                characterIndex++
              }
            } else if (this.isDef(scene.decorations.up) && decorationIndex < scene.decorations.up.length && scene.decorations.up[decorationIndex].y >= j && scene.decorations.up[decorationIndex].y < (j + 1)) {
              this.printDecoration(scene.decorations.up[decorationIndex], deltaWidth, deltaHeight)
              decorationIndex++
            } else if (characterIndex < scene.userDatas.length && (scene.userDatas[characterIndex].playerY - 0.5) >= j && (scene.userDatas[characterIndex].playerY - 0.5) < (j + 1)) {
              //if (userData.userCode == scene.userDatas[characterIndex].userCode) {
              //  this.printCharacter(userData, deltaWidth, deltaHeight)
              //} else {
                this.printCharacter(scene.userDatas[characterIndex], deltaWidth, deltaHeight)
              //}
              characterIndex++
            }
          }
      }
    },
    printDecoration (decoration, deltaWidth, deltaHeight) {
      var code = decoration.code
      if (Math.floor(code / 1000) == 1) {
        // Decoration
        var offsetX = code % 10
        var offsetY = Math.floor(code / 10) % 100
        this.ctx.drawImage(decorations, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize + deltaWidth, decoration.y * blockSize + deltaHeight, blockSize, blockSize)
      } else if (Math.floor(code / 1000) == 2) {
        // Door
        var offsetX = code % 10
        var offsetY = Math.floor(code / 10) % 100 * 4
        this.ctx.drawImage(doors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize + deltaWidth, decoration.y * blockSize + deltaHeight, blockSize, blockSize)
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
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.textAlign = 'center'
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = userDataTemp.nameColor
      this.ctx.fillText(userDataTemp.nickname, (userDataTemp.playerX - 0.5 + 0.6) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5 + 0.12) * blockSize + deltaHeight, Math.min(document.documentElement.clientWidth - screenX, blockSize))
      this.ctx.fillStyle = '#000000' // 阴影颜色
      this.ctx.shadowBlur=0 // 阴影模糊范围
      this.ctx.shadowOffsetX=0
      this.ctx.shadowOffsetY=0
      this.ctx.textAlign = 'left'
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
    printStatus () {
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = '#EEEEEE'
      this.ctx.fillText('Lv.' + userStatus.level + ' ' + userData.nickname + '(' + userData.lastName + ',' + userData.firstName + ')', avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.75, buttonSize * 5)
      this.ctx.fillText('经验值' + userStatus.exp + '/' + userStatus.expMax, avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.25, buttonSize * 5)
      this.ctx.fillText('生命值' + userStatus.hp + '/' + userStatus.hpMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 8 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.fillText('活力值' + userStatus.vp + '/' + userStatus.vpMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 6 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.fillText('饥饿值' + userStatus.hunger + '/' + userStatus.hungerMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 4 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.fillText('口渴值' + userStatus.thirst + '/' + userStatus.thirstMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 2 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.fillStyle = '#000000'
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
    },
    printItems () {
      if (!showItems) {
        document.getElementById('items').style.display = 'none'
        return
      }
      document.getElementById('items').style.display = 'inline'
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = '#EEEEEE'
      this.ctx.fillText('$' + userStatus.money, 210, document.documentElement.clientHeight - 125, blockSize / 2)
      this.ctx.fillText(Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', 210 + blockSize / 2, document.documentElement.clientHeight - 125, blockSize)
      this.ctx.fillStyle = '#000000'
      this.ctx.shadowBlur = 0 // 阴影模糊范围
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
    },
    updateItems () {
      userStatus.capacity = 0
      document.getElementById('items-name').length = 0
      if (this.isDef(userStatus.items)) {
        for (let itemNo in userStatus.items) {
          let itemAmount = userStatus.items[itemNo]
          if (!this.isDef(itemAmount)) {
            continue
          }
          if (itemNo.charAt(0) == 't') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              document.getElementById('items-name').options.add(new Option(this.$items.tools[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.tools[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'a') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              document.getElementById('items-name').options.add(new Option(this.$items.clothing[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.clothing[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'c') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-name').options.add(new Option(this.$items.consumables[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.consumables[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option(this.$items.materials[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.materials[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'n') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-name').options.add(new Option(this.$items.notes[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.notes[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'r') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
              document.getElementById('items-name').options.add(new Option(this.$items.recordings[itemNo].name + ' * ' + itemAmount, itemNo))
            }
            userStatus.capacity += this.$items.recordings[itemNo].weight * itemAmount
          }
        }
      }
    },
    useItem () {
      var itemNo = document.getElementById('items-name').value
      if (itemNo.charAt(0) == 't') {
        //
      }
      if (itemNo.charAt(0) == 'a') {
        //
      }
      if (itemNo.charAt(0) == 'c') {
        //
      }
      if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
        //
      }
      if (itemNo.charAt(0) == 'n') {
        //
      }
      if (itemNo.charAt(0) == 'r') {
        //
      }
      console.log('雅蠛蝶')
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
      pointerX = x + document.documentElement.scrollLeft - defaultDeltaWidth
      pointerY = y + document.documentElement.scrollTop - defaultDeltaHeight
      if (x < avatarSize && y >= this.ctx.canvas.height - avatarSize) {
        // Avatar
        canvasMoveUse = 1
      } else if (x < avatarSize + 1 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Personal information
        canvasMoveUse = 2
        showStatus = !showStatus
      } else if (x < avatarSize + 2 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Backpack
        canvasMoveUse = 3
        showItems = !showItems
      } else if (x < avatarSize + 3 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Send message
        canvasMoveUse = 4
        showChat = !showChat
      } else if (x < avatarSize + 4 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Voice chat
        canvasMoveUse = 5
        // document.getElementById('musicAudio').pause()
        document.getElementById('soundAudio').pause()
        this.recordStart()
      } else if (x < avatarSize + 5 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Mute
        canvasMoveUse = 6
        isMuted = !isMuted
        document.getElementById('voiceAudio').muted = isMuted
        document.getElementById('musicAudio').muted = isMuted
        document.getElementById('soundAudio').muted = isMuted
        this.playMusic()
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
      canvasMoveUse = -1
    },
    canvasLeave () {
      userData.nextSceneNo = userData.sceneNo
      userData.playerNextX = userData.playerX
      userData.playerNextY = userData.playerY
      userData.playerSpeedX = 0
      userData.playerSpeedY = 0
      if (canvasMoveUse === 5) {
        setTimeout(() => {
          this.sendVoice(1, '')
          // document.getElementById('musicAudio').play()
        }, voiceEndDelay)
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
          if (newScene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + this.$scenes.height)][Math.floor(userData.playerX + 0.5 - sharedEdge + userData.playerSpeedX + this.$scenes.width)] !== 1 &&
          newScene.events[Math.ceil(userData.playerY - 0.5 - sharedEdge + this.$scenes.height)][Math.floor(userData.playerX + 0.5 - sharedEdge + userData.playerSpeedX + this.$scenes.width)] !== 1) {
            userData.playerX += userData.playerSpeedX
            // Infinitive moving
            userData.playerNextX += userData.playerSpeedX
          } else {
            userData.playerSpeedX = 0
          }
        }
        if (userData.playerSpeedX < 0) {
          if (newScene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + this.$scenes.height)][Math.floor(userData.playerX - 0.5 + sharedEdge + userData.playerSpeedX + this.$scenes.width)] !== 1 &&
          newScene.events[Math.ceil(userData.playerY - 0.5 - sharedEdge + this.$scenes.height)][Math.floor(userData.playerX - 0.5 + sharedEdge + userData.playerSpeedX + this.$scenes.width)] !== 1) {
            userData.playerX += userData.playerSpeedX
            // Infinitive moving
            userData.playerNextX += userData.playerSpeedX
          } else {
            userData.playerSpeedX = 0
          }
        }
        if (userData.playerSpeedY > 0) {
          if (newScene.events[Math.floor(userData.playerY + 0.5 - sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.floor(userData.playerX - 0.5 + sharedEdge + this.$scenes.width)] !== 1 &&
          newScene.events[Math.floor(userData.playerY + 0.5 - sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.ceil(userData.playerX - 0.5 - sharedEdge + this.$scenes.width)] !== 1) {
            userData.playerY += userData.playerSpeedY
            // Infinitive moving
            userData.playerNextY += userData.playerSpeedY
          } else {
            userData.playerSpeedY = 0
          }
        }
        if (userData.playerSpeedY < 0) {
          if (newScene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.floor(userData.playerX - 0.5 + sharedEdge + this.$scenes.width)] !== 1 &&
          newScene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.ceil(userData.playerX - 0.5 - sharedEdge + this.$scenes.width)] !== 1) {
            userData.playerY += userData.playerSpeedY
            // Infinitive moving
            userData.playerNextY += userData.playerSpeedY
          } else {
            userData.playerSpeedY = 0
          }
        }

        this.updateItems()

        // Randomly get item
        if (Math.random() >= 0.01) {
          return
        }
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
          chatMessages.push('获得【'+ this.$items.materials[itemName].name +'】')
        }

        // Check whether user is out of the scene, then update the current scene
        var scene = this.$scenes.scenes[userData.sceneNo]
        if (scene.up !== -1 && userData.playerY < 0) {
          userData.sceneNo = scene.up
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerY += this.$scenes.height
          chatMessages.push('来到【'+ scene.name +'】')
        }
        if (scene.down !== -1 && userData.playerY >= this.$scenes.height) {
          userData.sceneNo = scene.down
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerY -= this.$scenes.height
          chatMessages.push('来到【'+ scene.name +'】')
        }
        if (scene.left !== -1 && userData.playerX < 0) {
          userData.sceneNo = scene.left
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerX += this.$scenes.width
          chatMessages.push('来到【'+ scene.name +'】')
        }
        if (scene.right !== -1 && userData.playerX >= this.$scenes.width) {
          userData.sceneNo = scene.right
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerX -= this.$scenes.width
          chatMessages.push('来到【'+ scene.name +'】')
        }
        if (this.isDef(newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)]) && this.isDef(newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)])) {
          userData.sceneNo = newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)].toSceneNo
          scene = this.$scenes.scenes[userData.sceneNo]
          userData.playerX = newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)].toX + 0.5
          userData.playerY = newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)].toY + 0.5
          chatMessages.push('来到【'+ scene.name +'】')
        }
        while (chatMessages.length > maxMsgLineNum * 2) {
          chatMessages = chatMessages.slice(-maxMsgLineNum * 2 + 1)
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
    async sendChat (type, receiver) {
      // Only broadcasting mode
      let message = document.getElementById('chat').value
      document.getElementById('chat').value = ''
      // document.getElementById('chat').style.display = 'none'
      // document.getElementById('enter').style.display = 'none'
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
    .world-canvas #chat{
        text-align: left;
        position: absolute;
        left: 0px;
        bottom: 115px;
        height: 20px;
        width: 150px;
        opacity:0.5;
        font-size:16px;
        display: none;
    }
    .world-canvas #enter{
        position: absolute;
        left: 150px;
        bottom: 115px;
        height: 25px;
        width: 50px;
        font-size:10px;
        display: none;
    }
    .items{
        position: absolute;
        left: 210px;
        bottom: 150px;
        margin: 0 auto;
        display: none;
    }
    .items #items-type{
        width: 40px;
        overflow:hidden;
    }
    .items #items-name{
        width: 150px;
    }
    .items #items-name-next{
        width: 150px;
        display: none;
    }
</style>
