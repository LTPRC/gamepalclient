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
                <input id="chat-target" class="chat-target" type="text" value="" readonly @click="resetChatType()"/>
                <input id="chat-content" class="chat-content" type="text" value=""/>
                <button id="chat-enter" class="chat-enter" @click="sendChat()">Enter</button>
            </div>
            <div id="interactions" class="interactions">
                <select  id="interactions-list" class="interactions-list">
                </select>
                <button id="interactions-enter" class="interactions-enter" @click="interact()">OK</button>
                <button id="interactions-quit" class="interactions-quit" @click="quitInteraction()">Cancel</button>
            </div>
            <div id="items" class="items">
                <select id="items-type" class="items-type" @change="updateItems();updatePreservedItems();">
                    <option value="0">全部</option>
                    <option value="1">工具</option>
                    <option value="2">装备</option>
                    <option value="3">用品</option>
                    <option value="4">材料</option>
                    <option value="5">笔记</option>
                    <option value="6">录音</option>
                </select>
                <select id="items-name" class="items-name" @change="updateItems()">
                </select>
                <button id="items-choose" class="items-choose" @click="useItem()">使用</button>
                <input id="items-range" type="range" min="0" max="0" value="0"/>
                <button id="items-remove" class="items-remove" @click="removeItem()">丢弃</button>
                <textarea  id="items-desc" class="items-desc" value="" readonly/>
                <div id="items-exchange" class="items-exchange">
                    <button id="items-exchange-put" class="items-exchange-put" @click="exchangeItemForward()">存入</button>
                    <select id="items-exchange-name" class="items-exchange-name" @change="updatePreservedItems()">
                    </select>
                    <input id="items-exchange-range" type="range" min="0" max="0" value="0"/>
                    <button id="items-exchange-get" class="items-exchange-get" @click="exchangeItemBackward()">取出</button>
                    <textarea  id="items-exchange-desc" class="items-exchange-desc" value="" readonly/>
                </div>
            </div>
            <div id="members" class="members">
                <select  id="members-list" class="members-list">
                </select>
            </div>
            <div id="settings" class="settings">
                <input id="settings-blockSize" type="range" min="10" max="200" value="100"/>
                <input id="settings-music" type="checkbox">
                <input id="settings-sound" type="checkbox">
                <button id="settings-about" class="settings-about">关于</button>
                <button id="settings-logoff" class="settings-logoff" @click="logoff()">注销</button>
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
                <input type="color" id="initialization-nameColor" value="#ff0000">
                <br/>
                头像
                <select id="initialization-avatar">
                    <option value="0">无</option>
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
                <select id="initialization-creature" @change="updateInitializationSkinColor()">
                    <option value="1">人类</option>
                    <option value="2">动物</option>
                </select>
                <br/>
                种类
                <select id="initialization-skinColor">
                </select>
                <br/>
                性别
                <select id="initialization-gender">
                    <option value="1">♂</option>
                    <option value="2">♀</option>
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
            </div>
        </div>
        <div style="display:none">
            <audio id="voiceAudio" type="audio/wav" controls autoplay crossOrigin = "anonymous" />
            <audio id="musicAudio" :src="require('../assets/test01.mp3')" />
            <audio id="soundAudio" controls autoplay crossOrigin = "anonymous" />
            <img id="selectionImage" src="../assets/image/effects/selection.png" />
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
            <!-- <img id="interactionImages" src="../assets/image/interactions.png" /> -->
            <img id="itemsImage" src="../assets/image/items.png" />
            <!-- <img id="instructions" src="../assets/image/instructions.png" /> -->
            <img id="npcAvatarImage" src="../assets/image/npcs/npcAvatar.png" />
            <img id="npc000Image" src="../assets/image/npcs/npc000.png" />
            <img id="npc001Image" src="../assets/image/npcs/npc001.png" />
            <img id="npc002Image" src="../assets/image/npcs/npc002.png" />
            <img id="npc003Image" src="../assets/image/npcs/npc003.png" />
            <img id="npc004Image" src="../assets/image/npcs/npc004.png" />
            <img id="npc005Image" src="../assets/image/npcs/npc005.png" />
            <img id="npc006Image" src="../assets/image/npcs/npc006.png" />
            <img id="npc007Image" src="../assets/image/npcs/npc007.png" />
            <img id="npc008Image" src="../assets/image/npcs/npc008.png" />
            <img id="npc009Image" src="../assets/image/npcs/npc009.png" />
            <img id="npc010Image" src="../assets/image/npcs/npc010.png" />
            <img id="npc011Image" src="../assets/image/npcs/npc011.png" />
            <img id="npc012Image" src="../assets/image/npcs/npc012.png" />
            <img id="npc013Image" src="../assets/image/npcs/npc013.png" />
            <img id="npc014Image" src="../assets/image/npcs/npc014.png" />
            <img id="npc015Image" src="../assets/image/npcs/npc015.png" />
            <img id="npc016Image" src="../assets/image/npcs/npc016.png" />
            <img id="npc017Image" src="../assets/image/npcs/npc017.png" />
            <img id="npc018Image" src="../assets/image/npcs/npc018.png" />
            <img id="npc019Image" src="../assets/image/npcs/npc019.png" />
        </div>
    </div>
</template>

<script>
let userCode = undefined
let token = undefined
let userDatas = []
let privateUserDatas = []
let userData = undefined
let userStatus = undefined
let chatMessages = []
let voiceMessages = []
let members = []
let drops = {}
let enemies = {}

const canvasMaxSizeX = 16
const canvasMaxSizeY = 9
const canvasMinSizeX = 1
const canvasMinSizeY = 1
const stopEdge = 0.15
// sharedEdge is used for obstacles, not edge of the canvas map
const sharedEdge = 0.25
let blockSize = 100
const minBlockSize = 10
const maxBlockSize = 200
const imageBlockSize = 100
let canvasMoveUse = -1
const avatarSize = 100
const buttonSize = 50
const smallButtonSize = 25
const recordButtonX = 240
const recordButtonY = -140
let pointerX
let pointerY
let interactionInfo = {}
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
const menuLeftEdge = 100
const menuRightEdge = 100
const menuTopEdge = 100
const menuBottomEdge = 200
const interactDistance = 2
const pickDistance = 1

let showChat = true
const screenX = 10
const screenY = 160
const maxMsgLineNum = 10
const maxMsgLineSize = 400
const chatSize = 20
let chatType = 1
let chatTo

import Recorder from 'js-audio-recorder' //用于获取麦克风权限
import Recorderx, { ENCODE_TYPE } from 'recorderx' //用于录音
const rc = new Recorderx()
let musicMuted = true
let soundMuted = true
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

const I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('')

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
      let imgIds = ['avatars', 'characters', 'hairstyle', 'hairstyle_black', 'hairstyle_grey', 'hairstyle_orange', 'eyesImage', 'doors', 'floors', 'objects', 'traffic', 'walls', 'buttons', 'smallButtons', 'balloons']
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
    this.logoff()
  },
  methods: {
    async initUserData () {
      userCode = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
      token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode })
      }
      await this.$axios.post(this.api_path + "/init-user-data", requestOptions).then(res => {
        privateUserDatas = res.data.privateUserDatas
        userData = privateUserDatas[userCode]
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
        event.preventDefault()
        if (event.keyCode === 13) {
          this.sendChat()
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
        console.log('userData.avatar'+userData.avatar)
        if (this.isDef(userData.avatar)) {
          document.getElementById('initialization-avatar').value = userData.avatar
        }
        canvasMoveUse = 8
      }
      this.updateItems()
      this.updatePreservedItems()
      document.getElementById('settings-blockSize').min = minBlockSize
      document.getElementById('settings-blockSize').max = maxBlockSize
      blockSize = Math.min(maxBlockSize, Math.max(minBlockSize, blockSize))
      document.getElementById('settings-blockSize').value = blockSize
      document.getElementById('settings-music').checked = !musicMuted
      document.getElementById('settings-sound').checked = !soundMuted

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
        if (this.isDef(userData.hunger) && userData.hunger.toFixed(2) / userData.hungerMax.toFixed(2) >= 0.2 &&  this.isDef(userData.thirst) && userData.thirst.toFixed(2) / userData.thirstMax.toFixed(2) >= 0.2) {
          userData.hp = Math.min(userData.hp + 1, userData.hpMax)
        }
      }, 1000)
      intervalTimerVp = setInterval(() => {
        if (this.isDef(userData.hp) && this.isDef(userData.vp)) {
          if (userData.hp.toFixed(2) / userData.hpMax.toFixed(2) > 0.5 && userData.vp < userData.vpMax) {
            userData.vp++
          } else if (userData.hp.toFixed(2) / userData.hpMax.toFixed(2) < 0.1 && userData.vp > 0) {
            userData.vp--
          }
        }
      }, 50)
      intervalTimerHunger = setInterval(() => {
        if (this.isDef(userData.hunger) && userData.hunger > 0) {
          userData.hunger--
        }
      }, 70000)
      intervalTimerThirst = setInterval(() => {
        if (this.isDef(userData.thirst) && userData.thirst > 0) {
          userData.thirst--
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
      this.shutDown()
    },
    webSocketMessage (e) {
      // 接收服务器返回的数据
      // console.log('服务器返回的消息', e.data)
      var response = JSON.parse(e.data)

      // Token check
      if (this.isDef(token) && response.token != token) {
        this.logoff()
      }
      
      // Update userDatas (Communication)
      userDatas = response.userDatas
      if (this.isDef(response.chatMessages)) {
      // console.log('chatMessages received')
        for (let i = 0; i < response.chatMessages.length; i++) {
          for (let code in userDatas) {
            if (response.chatMessages[i].fromUuid == code && code != userCode) {
              if (response.chatMessages[i].type === 1) {
                this.addChat(userDatas[code].nickname + ':' + '[广播]' + response.chatMessages[i].content)
              } else if (response.chatMessages[i].type === 2) {
                this.addChat(userDatas[code].nickname + ':' + response.chatMessages[i].content)
              }
              break
            }
          }
        }
      }
      if (this.isDef(response.voiceMessages)) {
      // console.log('voiceMessages received')
        for (let i = 0; i < response.voiceMessages.length; i++) {
          voiceMessages.push(response.voiceMessages[i].content)
        }
      }
      enemies = response.enemies
      drops = response.drops
    },
    logoff () {
      this.websocket.close()
      this.shutDown()
    },
    sendWebsocketMessage () {
      this.websocket.send(JSON.stringify({ userCode:userCode, userData: userData, userStatus: userStatus }))
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
      for (let code in userDatas) {
        if (userDatasMap.has(userDatas[code].sceneNo)) {
          userDatasMap.get(userDatas[code].sceneNo).push(userDatas[code])
        } else {
          userDatasMap.set(userDatas[code].sceneNo, [userDatas[code]])
        }
      }
      if (this.isDef(interactionInfo.newPosition)) {
        delete interactionInfo.newPosition
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
              if (interactionInfo.type === 1 && interactionInfo.code == userDataFromMap.userCode) {
                interactionInfo.sceneNo = userDataFromMap.sceneNo
                interactionInfo.x = userDataFromMap.playerX - (j - 1) * 10 - 0.5 // Must substract first, then it will be added again 04/06
                interactionInfo.y = userDataFromMap.playerY - (i - 1) * 10 - 0.5
              }
            }
          }
          if (this.isDef(interactionInfo) && this.isDef(sceneNoTable[i][j]) && interactionInfo.sceneNo === sceneNoTable[i][j]) {
            interactionInfo.newPosition = {
              x: interactionInfo.x + (j - 1) * this.$scenes.width,
              y: interactionInfo.y + (i - 1) * this.$scenes.height
            }
          }
        }
      }
      newScene.drops = []
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
          // Dropped Items
          for (let dropNo in drops) {
            var drop = drops[dropNo]
            if (drop.sceneNo == oldScene.sceneNo) {
              var newDrop = {}
              newDrop.dropNo = dropNo
              newDrop.itemNo = drop.itemNo
              newDrop.amount = drop.amount
              newDrop.x = drop.x + j * 10
              newDrop.y = drop.y + i * 10
              newScene.drops.push(newDrop)
            }
          }
        }
      }
      this.printScene(newScene, defaultDeltaWidth - this.$scenes.width * blockSize, defaultDeltaHeight - this.$scenes.height * blockSize)
      // this.printScene(newScene, defaultDeltaWidth, defaultDeltaHeight)

      // Console
      this.ctx.drawImage(avatars, userData.avatar % 10 * avatarSize, Math.floor(userData.avatar / 10) * avatarSize, avatarSize, avatarSize, 0 * avatarSize, this.ctx.canvas.height - avatarSize, avatarSize, avatarSize)
      if (canvasMoveUse !== 2) {
        this.ctx.drawImage(buttons, 0 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 0 * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
      } else {
        this.ctx.drawImage(buttons, 0 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 0 * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== 3) {
        this.ctx.drawImage(buttons, 1 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 1 * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
      } else {
        this.ctx.drawImage(buttons, 1 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 1 * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== 9) {
        this.ctx.drawImage(buttons, 2 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 2 * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
      } else {
        this.ctx.drawImage(buttons, 2 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 2 * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== 4) {
        this.ctx.drawImage(buttons, 3 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 3 * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
      } else {
        this.ctx.drawImage(buttons, 3 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 3 * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
      }
      if (this.isDef(userData.nickname) && this.isDef(userData.lastName) && this.isDef(userData.firstName)) {
        this.printText('Lv.' + userData.level + ' ' + userData.nickname + '(' + userData.lastName + ',' + userData.firstName + ')', avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.75, buttonSize * 5)
      } else {
        this.printText('Lv.' + userData.level, avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.75, buttonSize * 5)
      }
      this.printText('经验值' + userData.exp + '/' + userData.expMax, avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.25, buttonSize * 5)
      this.printText('生命值' + userData.hp + '/' + userData.hpMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 8 * statusSize - avatarSize, maxStatusLineSize)
      this.printText('活力值' + userData.vp + '/' + userData.vpMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 6 * statusSize - avatarSize, maxStatusLineSize)
      this.printText('饥饿值' + userData.hunger + '/' + userData.hungerMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 4 * statusSize - avatarSize, maxStatusLineSize)
      this.printText('口渴值' + userData.thirst + '/' + userData.thirstMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 2 * statusSize - avatarSize, maxStatusLineSize)
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      this.ctx.fillStyle = 'rgba(191, 191, 191, 0.5)'
      this.ctx.fillRect(avatarSize + buttonSize * 2 + statusSize, document.documentElement.clientHeight - buttonSize * 1.5, maxStatusLineSize * userData.exp / userData.expMax, statusSize * 0.75)
      this.ctx.fillStyle = 'rgba(191, 191, 0, 0.5)'
      this.ctx.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 7.75 * statusSize - avatarSize, maxStatusLineSize * userData.hp / userData.hpMax, statusSize * 0.75)
      this.ctx.fillStyle = 'rgba(0, 191, 0, 0.5)'
      this.ctx.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 5.75 * statusSize - avatarSize, maxStatusLineSize * userData.vp / userData.vpMax, statusSize * 0.75)
      this.ctx.fillStyle = 'rgba(191, 0, 0, 0.5)'
      this.ctx.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 3.75 * statusSize - avatarSize, maxStatusLineSize * userData.hunger / userData.hungerMax, statusSize * 0.75)
      this.ctx.fillStyle = 'rgba(0, 0, 191, 0.5)'
      this.ctx.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 1.75 * statusSize - avatarSize, maxStatusLineSize * userData.thirst / userData.thirstMax, statusSize * 0.75)
      this.ctx.strokeRect(avatarSize + buttonSize * 2 + statusSize, document.documentElement.clientHeight - buttonSize * 1.5, maxStatusLineSize, statusSize * 0.75)
      this.ctx.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 7.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      this.ctx.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 5.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      this.ctx.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 3.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      this.ctx.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 1.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      this.ctx.fillStyle = '#000000'
      if (showChat) {
        var temp = false
        if (chatType === 2) {
          for (let userDataTemp in newScene.userDatas) {
            if (newScene.userDatas[userDataTemp].userCode == chatTo) {
              document.getElementById('chat-target').value = newScene.userDatas[userDataTemp].nickname
              temp = true
            }
          }
        }
        if (!temp) {
          chatType = 1
          document.getElementById('chat-target').value = '[广播]'
        }
        if (canvasMoveUse !== 10) {
          this.ctx.drawImage(smallButtons, 0 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, recordButtonX >= 0 ? recordButtonX : (this.ctx.canvas.width + recordButtonX), recordButtonY >= 0 ? recordButtonY : (this.ctx.canvas.height + recordButtonY), smallButtonSize, smallButtonSize)
        } else {
          this.ctx.drawImage(smallButtons, 0 * smallButtonSize, 1 * smallButtonSize, smallButtonSize, smallButtonSize, recordButtonX >= 0 ? recordButtonX : (this.ctx.canvas.width + recordButtonX), recordButtonY >= 0 ? recordButtonY : (this.ctx.canvas.height + recordButtonY), smallButtonSize, smallButtonSize)
        }
        document.getElementById('chat').style.display = 'inline'
        this.printChat()
      } else {
        document.getElementById('chat').style.display = 'none'
      }
      
      // Show menus
      document.getElementById('items').style.display = 'none'
      document.getElementById('items-exchange').style.display = 'none'
      document.getElementById('members').style.display = 'none'
      document.getElementById('settings').style.display = 'none'
      document.getElementById('initialization').style.display = 'none'
      if (canvasMoveUse === 2) {
        this.printMenu()
        this.printStatus()
      }
      if (canvasMoveUse === 3) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-choose').style.display = 'inline'
        document.getElementById('items-remove').style.display = 'inline'
        this.printMenu()
        this.printItems()
      }
      if (canvasMoveUse === 9) {
        document.getElementById('members').style.display = 'inline'
        this.printMenu()
        this.printMembers()
      }
      if (canvasMoveUse === 4) {
        document.getElementById('settings').style.display = 'inline'
        this.printMenu()
        this.printSettings()
      }
      if (canvasMoveUse === 5) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-choose').style.display = 'none'
        document.getElementById('items-remove').style.display = 'none'
        document.getElementById('items-exchange').style.display = 'inline'
        this.printMenu()
        this.printExchange()
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

      // Dropped Items
      for (let newDrop in newScene.drops) {
        var timestamp = (new Date()).valueOf()
        var time = timestamp % 4000
        this.ctx.drawImage(itemsImage, 0 * imageBlockSize / 2, 0 * imageBlockSize / 2, imageBlockSize / 2, imageBlockSize / 2, (newScene.drops[newDrop].x - 0.25 + 0.25 - Math.sin(time * Math.PI * 2 / 4000) / 4) * blockSize + deltaWidth, (newScene.drops[newDrop].y - 0.25) * blockSize + deltaHeight, blockSize / 2 * Math.sin(time * Math.PI * 2 / 4000), blockSize / 2)
      }
      
      // Up floor & decoration & character
      var characterIndex = 0
      var decorationIndex = 0
      if (this.isDef(scene.decorations.up)) {
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
              characterIndex++
            }
          } else if (this.isDef(scene.decorations.up) && decorationIndex < scene.decorations.up.length && scene.decorations.up[decorationIndex].y >= j && scene.decorations.up[decorationIndex].y < (j + 1)) {
            this.printDecoration(scene.decorations.up[decorationIndex], deltaWidth, deltaHeight)
            decorationIndex++
          } else if (characterIndex < scene.userDatas.length && (scene.userDatas[characterIndex].playerY - 0.5) >= j && (scene.userDatas[characterIndex].playerY - 0.5) < (j + 1)) {
            this.printCharacter(scene.userDatas[characterIndex], deltaWidth, deltaHeight)
            characterIndex++
          }
        }
      }
      // Show events
      for (let j = 0; j < this.$scenes.height * 3; j++) {
        for (let i = 0; i < this.$scenes.width * 3; i++) {
          if (Math.pow(userData.playerX + this.$scenes.width - i - 0.5, 2) + Math.pow(userData.playerY + this.$scenes.height - j - 0.5, 2) > Math.pow(interactDistance, 2)) {
            continue
          }
          if (scene.events[j][i] != 0 && scene.events[j][i] != 1) {
          // if (scene.events[j][i] != 0 && scene.events[j][i] != 1 && Math.floor(pointerX / blockSize + this.$scenes.width) === i && Math.floor(pointerY / blockSize + this.$scenes.height) === j) {
            switch (scene.events[j][i]) {
              case 0:
                // Ground
                break;
              case 1:
                // Wall
                break;
              case 2:
                // Storage
                this.printText('行李箱', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, 'center')
                break;
              case 3:
                // Cooker
                this.printText('灶台', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, 'center')
                break;
              case 4:
                // Sink
                this.printText('饮水台', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, 'center')
                break;
              case 5:
                // Bed
                this.printText('床', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, 'center')
                break;
              case 6:
                // Toliet
                this.printText('马桶', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, 'center')
                break;
              case 7:
                // Dresser
                this.printText('梳妆台', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, 'center')
                break;
              case 8:
                // Workshop
                this.printText('工作台', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, 'center')
                break;
              case 9:
                // Packet
                this.printText('包裹', (i + 0.5) * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, 'center')
                break;
            }
          }
        }
      }
      // Show interactions
      document.getElementById('interactions').style.display = 'none'
      if (this.isDef(interactionInfo) && this.isDef(interactionInfo.newPosition) && canvasMoveUse <= 0) {
        // this.ctx.drawImage(instructions, 0 * imageBlockSize / 2, 0 * imageBlockSize / 2, imageBlockSize / 2, imageBlockSize / 2, (interactionInfo.newPosition.x + 0.5 - 0.1) * blockSize + deltaWidth, (interactionInfo.newPosition.y - 0.1) * blockSize + deltaHeight, blockSize * 0.2, blockSize * 0.2)
        var timestamp = (new Date()).valueOf()
        this.ctx.drawImage(selectionImage, Math.floor(timestamp / 100) % 10 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, interactionInfo.newPosition.x * blockSize + deltaWidth, interactionInfo.newPosition.y * blockSize + deltaHeight, blockSize, blockSize)
        if (Math.pow(userData.playerX + this.$scenes.width - interactionInfo.newPosition.x - 0.5, 2) + Math.pow(userData.playerY + this.$scenes.height - interactionInfo.newPosition.y - 0.5, 2) <= Math.pow(interactDistance, 2)) {
          document.getElementById('interactions').style.display = 'inline'
        }
        // if (canvasMoveUse <= 0 && this.isDef(interactionInfo.list)) {
          // var interactionX = this.ctx.canvas.width / 2
          // var interactionY = this.ctx.canvas.height - avatarSize * 2.5
          // this.ctx.drawImage(smallButtons, 1 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, interactionX - smallButtonSize * 0.5, interactionY - smallButtonSize * 0.5, smallButtonSize, smallButtonSize)
          // this.ctx.drawImage(smallButtons, 2 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, interactionX - smallButtonSize * 0.5, interactionY - smallButtonSize * 1.5, smallButtonSize, smallButtonSize)
          // this.ctx.drawImage(smallButtons, 3 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, interactionX - smallButtonSize * 0.5, interactionY + smallButtonSize * 0.5, smallButtonSize, smallButtonSize)
          // this.ctx.drawImage(smallButtons, 4 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, interactionX - smallButtonSize * 1.5, interactionY - smallButtonSize * 0.5, smallButtonSize, smallButtonSize)
          // this.ctx.drawImage(smallButtons, 5 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, interactionX + smallButtonSize * 0.5, interactionY - smallButtonSize * 0.5, smallButtonSize, smallButtonSize)
          // for (let k = 0; k < Math.min(4, interactionInfo.list.length); k++) {
          //   this.ctx.drawImage(interactionImages, interactionInfo.list[k] % 10 * buttonSize, Math.floor(interactionInfo.list[k] / 10) * buttonSize, buttonSize, buttonSize, (interactionInfo.newPosition.x + k % 2 / 2) * blockSize + deltaWidth, (interactionInfo.newPosition.y + Math.floor(k / 2) / 2) * blockSize + deltaHeight, blockSize / 2, blockSize / 2)
          // }
        // }
      }
      // Show Dropped Items
      for (let newDrop in newScene.drops) {
        if (Math.pow(userData.playerX - newScene.drops[newDrop].x + 10, 2) + Math.pow(userData.playerY - newScene.drops[newDrop].y + 10, 2) > Math.pow(interactDistance, 2)) {
          continue
        }
        var itemName
        if (newScene.drops[newDrop].itemNo.charAt(0) == 't') {
          itemName = this.$items.tools[newScene.drops[newDrop].itemNo].name
        }
        if (newScene.drops[newDrop].itemNo.charAt(0) == 'a') {
          itemName = this.$items.clothing[newScene.drops[newDrop].itemNo].name
        }
        if (newScene.drops[newDrop].itemNo.charAt(0) == 'c') {
          itemName = this.$items.consumables[newScene.drops[newDrop].itemNo].name
        }
        if (newScene.drops[newDrop].itemNo.charAt(0) == 'm' || newScene.drops[newDrop].itemNo.charAt(0) == 'j') {
          itemName = this.$items.materials[newScene.drops[newDrop].itemNo].name
        }
        if (newScene.drops[newDrop].itemNo.charAt(0) == 'n') {
          itemName = this.$items.notes[newScene.drops[newDrop].itemNo].name
        }
        if (newScene.drops[newDrop].itemNo.charAt(0) == 'r') {
          itemName = this.$items.recordings[newScene.drops[newDrop].itemNo].name
        }
        this.printText(itemName + '(' + newScene.drops[newDrop].amount + ')', newScene.drops[newDrop].x * blockSize + deltaWidth, (newScene.drops[newDrop].y - 0.25) * blockSize + deltaHeight, blockSize, 'center')
      }
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
        if (this.isDef(userDataTemp.outfits) && userDataTemp.outfits.length > 0) {
          if (userDataTemp.outfits[0] == 'a001') {
            this.ctx.drawImage(a001, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a002') {
            this.ctx.drawImage(a002, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a003') {
            this.ctx.drawImage(a003, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a004') {
            this.ctx.drawImage(a004, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a005') {
            this.ctx.drawImage(a005, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a006') {
            this.ctx.drawImage(a006, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a007') {
            this.ctx.drawImage(a007, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a008') {
            this.ctx.drawImage(a008, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a009') {
            this.ctx.drawImage(a009, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a010') {
            this.ctx.drawImage(a010, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a011') {
            this.ctx.drawImage(a011, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a012') {
            this.ctx.drawImage(a012, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (userDataTemp.outfits[0] == 'a013') {
            this.ctx.drawImage(a013, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
        }
        if (userDataTemp.hairColor == 1) {
          this.ctx.drawImage(hairstyle_black, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        } else if (userDataTemp.hairColor == 2) {
          this.ctx.drawImage(hairstyle_grey, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        } else if (userDataTemp.hairColor == 3) {
          this.ctx.drawImage(hairstyle_orange, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        }
      } else if (userDataTemp.creature == 2) {
        // Display animals
        switch (userDataTemp.skinColor) {
          case '1':
            this.ctx.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case '2':
            this.ctx.drawImage(frog, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case '3':
            this.ctx.drawImage(monkey, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case '4':
            this.ctx.drawImage(racoon, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
        }
      } else if (userDataTemp.creature == 3) {
        // Display npcs
        switch (Number(userDataTemp.skinColor)) {
          case 0:
            this.ctx.drawImage(npc000Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 1:
            this.ctx.drawImage(npc001Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 2:
            this.ctx.drawImage(npc002Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 3:
            this.ctx.drawImage(npc003Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 4:
            this.ctx.drawImage(npc004Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 5:
            this.ctx.drawImage(npc005Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 6:
            this.ctx.drawImage(npc006Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 7:
            this.ctx.drawImage(npc007Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 8:
            this.ctx.drawImage(npc008Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 9:
            this.ctx.drawImage(npc009Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 10:
            this.ctx.drawImage(npc010Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 11:
            this.ctx.drawImage(npc011Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 12:
            this.ctx.drawImage(npc012Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 13:
            this.ctx.drawImage(npc013Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 14:
            this.ctx.drawImage(npc014Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 15:
            this.ctx.drawImage(npc015Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 16:
            this.ctx.drawImage(npc016Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 17:
            this.ctx.drawImage(npc017Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 18:
            this.ctx.drawImage(npc018Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case 19:
            this.ctx.drawImage(npc019Image, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (userDataTemp.playerX - 0.5) * blockSize + deltaWidth, (userDataTemp.playerY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
        }
      }

      // Show name
      if (this.isDef(userDataTemp.nameColor)) {
        this.ctx.fillStyle = userDataTemp.nameColor
        this.ctx.fillRect((userDataTemp.playerX - 0.25) * blockSize + deltaWidth, (userDataTemp.playerY - 0.54) * blockSize + deltaHeight, blockSize * 0.5, blockSize * 0.2)
      }
      if (userCode != userDataTemp.userCode) {
        var avatarImgs
        switch (Number(userDataTemp.creature)) {
          case 1:
            avatarImgs = avatars
            break
          case 2:
            avatarImgs = avatars
            break
          case 3:
            avatarImgs = npcAvatarImage
            break
        }
        this.ctx.drawImage(avatarImgs, userDataTemp.avatar % 10 * avatarSize, Math.floor(userDataTemp.avatar / 10) * avatarSize, avatarSize, avatarSize, (userDataTemp.playerX - 0.25 - 0.2) * blockSize + deltaWidth, (userDataTemp.playerY - 0.54) * blockSize + deltaHeight, blockSize * 0.2, blockSize * 0.2)
        if (this.isDef(enemies) && this.isDef(enemies[userDataTemp.userCode]) && enemies[userDataTemp.userCode] < 0) {
          this.ctx.fillStyle = 'red'
        } else {
          this.ctx.fillStyle = 'green'
        }
        this.ctx.beginPath()
        this.ctx.arc((userDataTemp.playerX + 0.25 + 0.1) * blockSize + deltaWidth, (userDataTemp.playerY - 0.54 + 0.1) * blockSize + deltaHeight, 0.1 * blockSize, 0, 2 * Math.PI);
        this.ctx.fill()
      }
      if (this.isDef(userDataTemp.nickname)) {
        this.printText(userDataTemp.nickname, userDataTemp.playerX * blockSize + deltaWidth, (userDataTemp.playerY - 0.5 + 0.12) * blockSize + deltaHeight, Math.min(document.documentElement.clientWidth - screenX, blockSize * 0.5), 'center')
      }
    },
    resetChatType () {
      chatType = 1
    },
    printChat () {
      var x = 0
      var y = -avatarSize
      if(this.isDef(chatMessages)) {
        // this.ctx.fillStyle = 'rgba(0,0,0,0.25)'
        // this.ctx.fillRect(screenX, document.documentElement.clientHeight - screenY - chatMessages.length * chatSize + 5, Math.min(document.documentElement.clientWidth, maxMsgLineSize - screenX), chatSize * chatMessages.length)
        for (let i = 0; i < chatMessages.length; i++) {
          this.printText(chatMessages[chatMessages.length - 1 - i], screenX, document.documentElement.clientHeight - screenY - i * chatSize, Math.min(document.documentElement.clientWidth - screenX, maxMsgLineSize))
        }
      }
    },
    printMenu () {
      this.ctx.fillStyle = 'rgba(191, 191, 191, 0.75)'
      this.ctx.fillRect(menuLeftEdge, menuTopEdge, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge, document.documentElement.clientHeight - menuTopEdge - menuBottomEdge)
      this.ctx.fillStyle = '#000000'
      if (canvasMoveUse !== 8 || this.isDef(userData.nickname)) {
        this.ctx.drawImage(smallButtons, 1 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, document.documentElement.clientWidth - menuRightEdge - smallButtonSize, menuTopEdge, smallButtonSize, smallButtonSize)
      }
    },
    printExchange () {
      this.printText(Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100)
      this.printText('$' + userStatus.money, menuLeftEdge + 110, menuTopEdge + 20, 50)
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50)
      this.printText(document.getElementById('items-exchange-range').value, menuLeftEdge + 330, menuTopEdge + 125, 50)
    },
    printStatus () {
      var positionY = menuTopEdge + 20
      this.printText(userData.nickname + ' (' + userData.lastName + ', ' + userData.firstName + ')', menuLeftEdge + 10, positionY, buttonSize * 5, userData.nameColor)
      positionY += 20
      this.printText('当前位置:' + this.$scenes.scenes[userData.sceneNo].name, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.printText('Lv.' + userData.level + ' 经验值' + userData.exp + '/' + userData.expMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.printText('生命值' + userData.hp + '/' + userData.hpMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.printText('活力值' + userData.vp + '/' + userData.vpMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.printText('饥饿值' + userData.hunger + '/' + userData.hungerMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.printText('口渴值' + userData.thirst + '/' + userData.thirstMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.printText('$' + userStatus.money + ' 负重' + Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
      this.printText('特殊状态 无', menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20)
      positionY += 20
    },
    printItems () {
      this.printText(Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100)
      this.printText('$' + userStatus.money, menuLeftEdge + 110, menuTopEdge + 20, 50)
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50)
    },
    async getMembers () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode })
      }
      await this.$axios.post(this.api_path + '/get-members', requestOptions)
          .then(res => {
        document.getElementById('members-list').length = 0
        members = res.data.members
        for (let member in members) {
          document.getElementById('members-list').options.add(new Option(members[member].nickname + '|' + (members[member].gender == '1' ? '男' : '') + (members[member].gender == '2' ? '女' : ''), member))
        }
      })
      .catch(error => {
      })
    },
    async insertMember () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode })
      }
      await this.$axios.post(this.api_path + '/insert-member', requestOptions)
          .then(res => {
      })
      .catch(error => {
      })
    },
    async deleteMember (memberCode) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode, memberCode: memberCode })
      }
      await this.$axios.post(this.api_path + '/delete-member', requestOptions)
          .then(res => {
      })
      .catch(error => {
      })
    },
    printMembers () {
    },
    printSettings () {
      this.printText('缩放: ' + Math.round(blockSize / maxBlockSize * 100) + '%', menuLeftEdge + 10, menuTopEdge + 75, 50)
      this.printText('音乐', menuLeftEdge + 10, menuTopEdge + 125, 50)
      this.printText('音效', menuLeftEdge + 110, menuTopEdge + 125, 50)
      blockSize = Number(document.getElementById('settings-blockSize').value)
      musicMuted = !Boolean(document.getElementById('settings-music').checked)
      soundMuted = !Boolean(document.getElementById('settings-sound').checked)
    },
    prepareInitialization () {
      document.getElementById('initialization-nickname').value = userData.nickname
      document.getElementById('initialization-lastName').value = userData.lastName
      document.getElementById('initialization-firstName').value = userData.firstName
      document.getElementById('initialization-nameColor').value = userData.nameColor
      for (var i = 0; i < document.getElementById('initialization-avatar').options.length; i++) {
        if (document.getElementById('initialization-avatar').options[i].value == userData.avatar) {
          document.getElementById('initialization-avatar').options[i].selected = true
        }
      }
      for (var i = 0; i < document.getElementById('initialization-creature').options.length; i++) {
        if (document.getElementById('initialization-creature').options[i].value == userData.creature) {
          document.getElementById('initialization-creature').options[i].selected = true
        }
      }
      this.updateInitializationSkinColor()
      for (var i = 0; i < document.getElementById('initialization-skinColor').options.length; i++) {
        if (document.getElementById('initialization-skinColor').options[i].value == userData.skinColor) {
          document.getElementById('initialization-skinColor').options[i].selected = true
        }
      }
      for (var i = 0; i < document.getElementById('initialization-gender').options.length; i++) {
        if (document.getElementById('initialization-gender').options[i].value == userData.gender) {
          document.getElementById('initialization-gender').options[i].selected = true
        }
      }
      for (var i = 0; i < document.getElementById('initialization-hairstyle').options.length; i++) {
        if (document.getElementById('initialization-hairstyle').options[i].value == userData.hairstyle) {
          document.getElementById('initialization-hairstyle').options[i].selected = true
        }
      }
      for (var i = 0; i < document.getElementById('initialization-hairColor').options.length; i++) {
        if (document.getElementById('initialization-hairColor').options[i].value == userData.hairColor) {
          document.getElementById('initialization-hairColor').options[i].selected = true
        }
      }
      for (var i = 0; i < document.getElementById('initialization-eyes').options.length; i++) {
        if (document.getElementById('initialization-eyes').options[i].value == userData.eyes) {
          document.getElementById('initialization-eyes').options[i].selected = true
        }
      }
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
          switch (userData.skinColor) {
            case '1':
              this.ctx.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '2':
              this.ctx.drawImage(frog, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '3':
              this.ctx.drawImage(monkey, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '4':
              this.ctx.drawImage(racoon, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
              break
          }
        }
      }
      if (document.getElementById('initialization-creature').value == 1) {
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
      } else if (document.getElementById('initialization-creature').value == 2) {
        document.getElementById('initialization-hairstyle').style.display = 'none'
        document.getElementById('initialization-hairColor').style.display = 'none'
        document.getElementById('initialization-eyes').style.display = 'none'
        if (document.getElementById('initialization-creature').value == 2) {
          switch (document.getElementById('initialization-skinColor').value) {
            case '1':
              this.ctx.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '2':
              this.ctx.drawImage(frog, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '3':
              this.ctx.drawImage(monkey, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '4':
              this.ctx.drawImage(racoon, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
              break
          }
        }
      }

      // Show name
      if (this.isDef(userData.nickname)) {
        this.ctx.fillStyle = userData.nameColor
        this.ctx.fillRect(menuLeftEdge + 10 + avatarSize / 2 - 0.25 * blockSize, menuTopEdge + 160 + avatarSize * 0.12 - 0.16 * blockSize, blockSize * 0.5, blockSize * 0.2)
        this.printText(userData.nickname, menuLeftEdge + 10 + avatarSize / 2, menuTopEdge + 160 + avatarSize * 0.12, Math.min(document.documentElement.clientWidth - screenX, avatarSize), 'center')
      }
      this.ctx.fillStyle = document.getElementById('initialization-nameColor').value
      this.ctx.fillRect(menuLeftEdge + 160 + avatarSize / 2 - 0.25 * blockSize, menuTopEdge + 160 + avatarSize * 0.12 - 0.16 * blockSize, blockSize * 0.5, blockSize * 0.2)
      this.printText(document.getElementById('initialization-nickname').value, menuLeftEdge + 160 + avatarSize / 2, menuTopEdge + 160 + avatarSize * 0.12, Math.min(document.documentElement.clientWidth - screenX, avatarSize), 'center')
    },
    updateInitializationSkinColor () {
      document.getElementById('initialization-skinColor').length = 0
      if (document.getElementById('initialization-creature').value == 1) {
        document.getElementById('initialization-skinColor').options.add(new Option('香草', 1))
        document.getElementById('initialization-skinColor').options.add(new Option('拿铁', 2))
        document.getElementById('initialization-skinColor').options.add(new Option('可可', 3))
        document.getElementById('initialization-skinColor').options.add(new Option('美式', 4))
      } else if (document.getElementById('initialization-creature').value == 2) {
        document.getElementById('initialization-skinColor').options.add(new Option('香香软软的小泡芙', 1))
        document.getElementById('initialization-skinColor').options.add(new Option('小青蛙', 2))
        document.getElementById('initialization-skinColor').options.add(new Option('小猴子', 3))
        document.getElementById('initialization-skinColor').options.add(new Option('小浣熊', 4))
      }
    },
    getItem (itemNo, amount, showNotification) {
      if (!this.isDef(userStatus.items[itemNo])) {
        userStatus.items[itemNo] = 0
      }
      userStatus.items[itemNo] += amount
      if (showNotification) {
        var itemName = '未知'
        if (itemNo.charAt(0) == 't') {
          itemName = this.$items.tools[itemNo].name
        }
        if (itemNo.charAt(0) == 'a') {
          itemName = this.$items.clothing[itemNo].name
        }
        if (itemNo.charAt(0) == 'c') {
          itemName = this.$items.consumables[itemNo].name
        }
        if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
          itemName = this.$items.materials[itemNo].name
        }
        if (itemNo.charAt(0) == 'n') {
          itemName = this.$items.notes[itemNo].name
        }
        if (itemNo.charAt(0) == 'r') {
          itemName = this.$items.recordings[itemNo].name
        }
        this.addChat('获得 '+ itemName +'(' + amount + ')')
      }
      this.updateItems()
      this.updatePreservedItems()
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
      }
      if (itemNo.charAt(0) == 'a') {
        // Only 1 outfit is allowed to be equipped
        if (this.isDef(userData.outfits) && userData.outfits.length > 0 && userData.outfits[0] == itemNo) {
          userData.outfits = []
        } else {
          userData.outfits = [itemNo]
        }
      }
      if (itemNo.charAt(0) == 'c') {
        // Consumable
        if (!this.isDef(userStatus.items[itemNo]) || userStatus.items[itemNo] === 0) {
          return
        }
        userStatus.items[itemNo]--
        for (let effectType in this.$items.consumables[itemNo].effects) {
          if (effectType == 'hp') {
            userData.hp = Math.min(userData.hp + this.$items.consumables[itemNo].effects[effectType], userData.hpMax)
          }
          if (effectType == 'vp') {
            userData.vp = Math.min(userData.vp + this.$items.consumables[itemNo].effects[effectType], userData.vpMax)
          }
          if (effectType == 'hunger') {
            userData.hunger = Math.min(userData.hunger + this.$items.consumables[itemNo].effects[effectType], userData.hungerMax)
          }
          if (effectType == 'thirst') {
            userData.thirst = Math.min(userData.thirst + this.$items.consumables[itemNo].effects[effectType], userData.thirstMax)
          }
        }
      }
      if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
        // Material, junk
        if (!this.isDef(userStatus.items[itemNo]) || userStatus.items[itemNo] === 0 || itemNo.charAt(0) != 'j') {
          // junk only
          return
        }
        this.getItem(itemNo, -1, false)
        for (let material in this.$items.materials[itemNo].materials) {
          this.getItem(material, this.$items.materials[itemNo].materials[material], true)
        }
      }
      if (itemNo.charAt(0) == 'n') {
        // Note
        this.addChat(this.$items.notes[name] + ':' + this.$items.notes[content])
      }
      if (itemNo.charAt(0) == 'r') {
        // Recording
      }
      this.updateItems()
    },
    async removeItem () {
      var itemAmount = Number(document.getElementById('items-range').value)
      if (itemAmount <= 0) {
        return
      }
      var itemNo = document.getElementById('items-name').value
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneNo: userData.sceneNo, x: Math.floor(userData.playerX) + 0.25 + Math.random() / 2, y: Math.floor(userData.playerY + 0.5) + 0.25 + Math.random() / 2, itemNo: itemNo, amount: itemAmount })
      }
      await this.$axios.post(this.api_path + "/set-drop", requestOptions)
          .then(res => {
        this.getItem(itemNo, -itemAmount, false)
      })
      .catch(error => {
      })
    },
    exchangeItemForward () {
      var itemAmount = Number(document.getElementById('items-range').value)
      if (itemAmount === 0) {
        return
      }
      var itemNo = document.getElementById('items-name').value
      userStatus.items[itemNo] = userStatus.items[itemNo] - itemAmount
      if (this.isDef(userStatus.preservedItems[itemNo]) && userStatus.preservedItems[itemNo] > 0) {
        userStatus.preservedItems[itemNo] += itemAmount
      } else {
        userStatus.preservedItems[itemNo] = itemAmount
      }
      if (itemNo.charAt(0) == 't') {
        // Only 1 tool is allowed to be equipped
        if (this.isDef(userData.tools) && userData.tools.length > 0 && userData.tools[0] == itemNo && userStatus.items[itemNo] === 0) {
          userData.tools = []
        }
      }
      if (itemNo.charAt(0) == 'a') {
        // Only 1 outfit is allowed to be equipped
        if (this.isDef(userData.outfits) && userData.outfits.length > 0 && userData.outfits[0] == itemNo && userStatus.items[itemNo] === 0) {
          userData.outfits = []
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
      this.updateItems()
      this.updatePreservedItems()
    },
    exchangeItemBackward () {
      var itemAmount = Number(document.getElementById('items-exchange-range').value)
      if (itemAmount === 0) {
        return
      }
      var itemNo = document.getElementById('items-exchange-name').value
      if (this.isDef(userStatus.items[itemNo]) && userStatus.items[itemNo] > 0) {
        userStatus.items[itemNo] += itemAmount
      } else {
        userStatus.items[itemNo] = itemAmount
      }
      userStatus.preservedItems[itemNo] = userStatus.preservedItems[itemNo] - itemAmount
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
      this.updateItems()
      this.updatePreservedItems()
    },
    updateItems () {
      userStatus.capacity = 0
      var checkValue = document.getElementById('items-name').value
      document.getElementById('items-name').length = 0
      if (this.isDef(userStatus.items)) {
        for (let itemNo in userStatus.items) {
          let itemAmount = userStatus.items[itemNo]
          if (!this.isDef(itemAmount) || itemAmount === 0) {
            continue
          }
          if (itemNo.charAt(0) == 't') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              if (this.isDef(userData.tools) && userData.tools.length > 0 && userData.tools[0] == itemNo) {
                document.getElementById('items-name').options.add(new Option('●' + this.$items.tools[itemNo].name + '(' + itemAmount + ') ' + (this.$items.tools[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + this.$items.tools[itemNo].name + '(' + itemAmount + ') ' + (this.$items.tools[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            userStatus.capacity += this.$items.tools[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'a') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.isDef(userData.outfits) && userData.outfits.length > 0 && userData.outfits[0] == itemNo) {
                      document.getElementById('items-name').options.add(new Option('●' + this.$items.clothing[itemNo].name + '(' + itemAmount + ') ' + (this.$items.clothing[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + this.$items.clothing[itemNo].name + '(' + itemAmount + ') ' + (this.$items.clothing[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            userStatus.capacity += this.$items.clothing[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'c') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-name').options.add(new Option('○' + this.$items.consumables[itemNo].name + '(' + itemAmount + ') ' + (this.$items.consumables[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            userStatus.capacity += this.$items.consumables[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              if (itemNo.charAt(0) == 'm') {
                document.getElementById('items-name').options.add(new Option('○[材料]' + this.$items.materials[itemNo].name + '(' + itemAmount + ') ' + (this.$items.materials[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + this.$items.materials[itemNo].name + '(' + itemAmount + ') ' + (this.$items.materials[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            userStatus.capacity += this.$items.materials[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'n') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-name').options.add(new Option('○' + this.$items.notes[itemNo].name + '(' + itemAmount + ') ' + (this.$items.notes[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            userStatus.capacity += this.$items.notes[itemNo].weight * itemAmount
          }
          if (itemNo.charAt(0) == 'r') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
              document.getElementById('items-name').options.add(new Option('○' + this.$items.recordings[itemNo].name + '(' + itemAmount + ') ' + (this.$items.recordings[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            userStatus.capacity += this.$items.recordings[itemNo].weight * itemAmount
          }
        }
        document.getElementById('items-desc').value = ''
        document.getElementById('items-range').min = 0
        document.getElementById('items-range').max = 0
        document.getElementById('items-range').value = document.getElementById('items-range').max
        if (document.getElementById('items-name').options.length > 0) {
          for (let i = 0; i < document.getElementById('items-name').options.length; i++){
            if (document.getElementById('items-name').options[i].value == checkValue) {
              document.getElementById('items-name').options[i].selected = true
            }
          }
          if (document.getElementById('items-name').value.charAt(0) == 't') {
            document.getElementById('items-desc').value = this.$items.tools[document.getElementById('items-name').value].description
          }
          if (document.getElementById('items-name').value.charAt(0) == 'a') {
            document.getElementById('items-desc').value = this.$items.clothing[document.getElementById('items-name').value].description
          }
          if (document.getElementById('items-name').value.charAt(0) == 'c') {
            document.getElementById('items-desc').value = this.$items.consumables[document.getElementById('items-name').value].description
          }
          if (document.getElementById('items-name').value.charAt(0) == 'm' || document.getElementById('items-name').value.charAt(0) == 'j') {
            document.getElementById('items-desc').value = this.$items.materials[document.getElementById('items-name').value].description
            if (document.getElementById('items-name').value.charAt(0) == 'j') {
              document.getElementById('items-desc').value += '\n可拆解材料： '
              for (let material in this.$items.materials[document.getElementById('items-name').value].materials) {
                document.getElementById('items-desc').value += '\n' + this.$items.materials[material].name + '(' + this.$items.materials[document.getElementById('items-name').value].materials[material] + ')'
              }
            }
          }
          if (document.getElementById('items-name').value.charAt(0) == 'n') {
            document.getElementById('items-desc').value = this.$items.notes[document.getElementById('items-name').value].description
          }
          if (document.getElementById('items-name').value.charAt(0) == 'r') {
            document.getElementById('items-desc').value = this.$items.recordings[document.getElementById('items-name').value].description
          }
          document.getElementById('items-range').max = userStatus.items[document.getElementById('items-name').value]
          document.getElementById('items-range').value = document.getElementById('items-range').max
        }
      }
    },
    updatePreservedItems () {
      var checkValue = document.getElementById('items-exchange-name').value
      document.getElementById('items-exchange-name').length = 0
      if (this.isDef(userStatus.preservedItems)) {
        for (let itemNo in userStatus.preservedItems) {
          let itemAmount = userStatus.preservedItems[itemNo]
          if (!this.isDef(itemAmount) || itemAmount === 0) {
            continue
          }
          if (itemNo.charAt(0) == 't') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              document.getElementById('items-exchange-name').options.add(new Option('○' + this.$items.tools[itemNo].name + '(' + itemAmount + ') ' + (this.$items.tools[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
          }
          if (itemNo.charAt(0) == 'a') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              document.getElementById('items-exchange-name').options.add(new Option('○' + this.$items.clothing[itemNo].name + '(' + itemAmount + ') ' + (this.$items.clothing[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
          }
          if (itemNo.charAt(0) == 'c') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-exchange-name').options.add(new Option('○' + this.$items.consumables[itemNo].name + '(' + itemAmount + ') ' + (this.$items.consumables[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
          }
          if (itemNo.charAt(0) == 'm' || itemNo.charAt(0) == 'j') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              if (itemNo.charAt(0) == 'm') {
                document.getElementById('items-exchange-name').options.add(new Option('○[材料]' + this.$items.materials[itemNo].name + '(' + itemAmount + ') ' + (this.$items.materials[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-exchange-name').options.add(new Option('○' + this.$items.materials[itemNo].name + '(' + itemAmount + ') ' + (this.$items.materials[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
          }
          if (itemNo.charAt(0) == 'n') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-exchange-name').options.add(new Option('○' + this.$items.notes[itemNo].name + '(' + itemAmount + ') ' + (this.$items.notes[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
          }
          if (itemNo.charAt(0) == 'r') {
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
              document.getElementById('items-exchange-name').options.add(new Option('○' + this.$items.recordings[itemNo].name + '(' + itemAmount + ') ' + (this.$items.recordings[itemNo].weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
          }
        }
        document.getElementById('items-exchange-desc').value = ''
        document.getElementById('items-exchange-range').min = 0
        document.getElementById('items-exchange-range').max = 0
        document.getElementById('items-exchange-range').value = document.getElementById('items-exchange-range').max
        if (document.getElementById('items-exchange-name').options.length > 0) {
          for (let i = 0; i < document.getElementById('items-exchange-name').options.length; i++){
            if (document.getElementById('items-exchange-name').options[i].value == checkValue) {
              document.getElementById('items-exchange-name').options[i].selected = true
            }
          }
          if (document.getElementById('items-exchange-name').value.charAt(0) == 't') {
            document.getElementById('items-exchange-desc').value = this.$items.tools[document.getElementById('items-exchange-name').value].description
          }
          if (document.getElementById('items-exchange-name').value.charAt(0) == 'a') {
            document.getElementById('items-exchange-desc').value = this.$items.clothing[document.getElementById('items-exchange-name').value].description
          }
          if (document.getElementById('items-exchange-name').value.charAt(0) == 'c') {
            document.getElementById('items-exchange-desc').value = this.$items.consumables[document.getElementById('items-exchange-name').value].description
          }
          if (document.getElementById('items-exchange-name').value.charAt(0) == 'm' || document.getElementById('items-exchange-name').value.charAt(0) == 'j') {
            document.getElementById('items-exchange-desc').value = this.$items.materials[document.getElementById('items-exchange-name').value].description
            if (document.getElementById('items-exchange-name').value.charAt(0) == 'j') {
              document.getElementById('items-exchange-desc').value += '\n可拆解材料： '
              for (let material in this.$items.materials[document.getElementById('items-exchange-name').value].materials) {
                document.getElementById('items-exchange-desc').value += '\n' + this.$items.materials[material].name + '(' + this.$items.materials[document.getElementById('items-exchange-name').value].materials[material] + ')'
              }
            }
          }
          if (document.getElementById('items-exchange-name').value.charAt(0) == 'n') {
            document.getElementById('items-exchange-desc').value = this.$items.notes[document.getElementById('items-exchange-name').value].description
          }
          if (document.getElementById('items-exchange-name').value.charAt(0) == 'r') {
            document.getElementById('items-exchange-desc').value = this.$items.recordings[document.getElementById('items-exchange-name').value].description
          }
          document.getElementById('items-exchange-range').max = userStatus.preservedItems[document.getElementById('items-exchange-name').value]
          document.getElementById('items-exchange-range').value = document.getElementById('items-exchange-range').max
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
      if (canvasMoveUse === 2 || canvasMoveUse === 3 || canvasMoveUse === 4 || canvasMoveUse === 5 || canvasMoveUse === 8 || canvasMoveUse === 9) {
        if (x >= document.documentElement.clientWidth - menuRightEdge - smallButtonSize && x <= document.documentElement.clientWidth - menuRightEdge && y >= menuTopEdge && y <= menuTopEdge + smallButtonSize) {
          canvasMoveUse = -1
        // } else if (x >= menuLeftEdge && x <= (menuLeftEdge + document.documentElement.clientWidth - menuLeftEdge - menuRightEdge) && y >= menuTopEdge && y <= (menuTopEdge + document.documentElement.clientHeight - menuTopEdge - menuBottomEdge)) {
        }
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
        // Members
        canvasMoveUse = canvasMoveUse === 9 ? -1 : 9
        this.getMembers()
      } else if (x < avatarSize + 4 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Settings
        canvasMoveUse = canvasMoveUse === 4 ? -1 : 4
      } else if (x > (recordButtonX >= 0 ? recordButtonX : (this.ctx.canvas.width + recordButtonX)) && x < ((recordButtonX >= 0 ? recordButtonX : (this.ctx.canvas.width + recordButtonX)) + smallButtonSize) && y > (recordButtonY >= 0 ? recordButtonY : (this.ctx.canvas.height + recordButtonY)) && y < ((recordButtonY >= 0 ? recordButtonY : (this.ctx.canvas.height + recordButtonY)) + smallButtonSize)) {
        // Voice record
        canvasMoveUse = 10
        this.recordStart()
      } else {
        // Dropped Items
        for (let newDrop in newScene.drops) {
          if (Math.pow(pointerX / blockSize - newScene.drops[newDrop].x + 10, 2) + Math.pow(pointerY / blockSize - newScene.drops[newDrop].y + 10, 2) > Math.pow(0.25, 2)) {
            continue
          }
          if (Math.pow(userData.playerX - newScene.drops[newDrop].x + 10, 2) + Math.pow(userData.playerY - newScene.drops[newDrop].y + 10, 2) > Math.pow(pickDistance, 2)) {
            continue
          }
          this.getDrop(newScene.drops[newDrop])
          return
        }
        // if (this.isDef(interactionInfo)) {
        //   var digitX = Math.floor((pointerX / blockSize + this.$scenes.width - interactionInfo.x) / 0.5)
        //   var digitY = Math.floor((pointerY / blockSize + this.$scenes.height - interactionInfo.y) / 0.5)
        //   if (digitX >= 0 && digitX < 2 && digitY >= 0 && digitY < 2 && interactionInfo.list.length > digitX + digitY * 2) {
        //     this.interact(digitX + digitY * 2)
        //     return
        //   }
        // }
        // Click on character
        for (var characterIndex in newScene.userDatas) {
          if (Math.abs(pointerX / blockSize + this.$scenes.width - newScene.userDatas[characterIndex].playerX) < 0.5 && Math.abs(pointerY / blockSize + this.$scenes.height - newScene.userDatas[characterIndex].playerY) < 0.5) {
            if (userCode != newScene.userDatas[characterIndex].userCode) {
              interactionInfo = {
                type: 1,
                sceneNo: newScene.sceneNo,
                x: newScene.userDatas[characterIndex].playerX - 0.5,
                y: newScene.userDatas[characterIndex].playerY - 0.5,
                list: [5, 7, 6],
                code: newScene.userDatas[characterIndex].userCode
              }
              document.getElementById('interactions-list').length = 0
            } else {
              // Cell phone is easier to click twice
              // interactionInfo = {}
            }
            this.fillInteractionList()
            return
          }
        }
        // Click on event
        var digitX = Math.floor(pointerX / blockSize + this.$scenes.width)
        var digitY = Math.floor(pointerY / blockSize + this.$scenes.height)
        if (newScene.events[digitY][digitX] != 0 && newScene.events[digitY][digitX] != 1) {
          // if (this.isDef(interactionInfo) && this.isDef(interactionInfo.newPosition && digitX === interactionInfo.newPosition.x && digitY === interactionInfo.newPosition.y)) {
            // Cell phone is easier to click twice
            // interactionInfo = {}
          // } else {
            interactionInfo = {
              type: 2,
              sceneNo: newScene.sceneNo,
              x: digitX,
              y: digitY,
              list: [],
              code: newScene.events[digitY][digitX].toString()
            }
            switch (Number(interactionInfo.code)) {
              case 0:
                // Ground
                break;
              case 1:
                // Wall
                break;
              case 2:
                // Storage
                interactionInfo.list = [1]
                break;
              case 3:
                // Cooker
                interactionInfo.list = [0]
                break;
              case 4:
                // Sink
                interactionInfo.list = [0, 3]
                break;
              case 5:
                // Bed
                interactionInfo.list = [2]
                break;
              case 6:
                // Toliet
                interactionInfo.list = [0, 3]
                break;
              case 7:
                // Dresser
                interactionInfo.list = [8]
                break;
              case 8:
                // Workshop
                interactionInfo.list = [0]
                break;
              case 9:
                // Packet
                interactionInfo.list = [1]
                break;
            }
            this.fillInteractionList()
          // }
          return
        }
        // Playground
        canvasMoveUse = 0
        userData.playerNextX = pointerX / blockSize
        userData.playerNextY = pointerY / blockSize
      }
    },
    fillInteractionList () {
      document.getElementById('interactions-list').length = 0
      for (var i = 0; i < interactionInfo.list.length; i++) {
        var interactinonName
        switch (Number(interactionInfo.list[i])) {
          case 0:
            interactinonName = '[使用]'
            break;
          case 1:
            interactinonName = '[交换]'
            break;
          case 2:
            interactinonName = '[睡眠]'
            break;
          case 3:
            interactinonName = '[饮水]'
            break;
          case 4:
            interactinonName = '[分解]'
            break;
          case 5:
            interactinonName = '[交谈]'
            break;
          case 6:
            interactinonName = '[攻击]'
            break;
          case 7:
            interactinonName = '[示好]'
            break;
          case 8:
            interactinonName = '[设置]'
            break;
        }
        document.getElementById('interactions-list').options.add(new Option(interactinonName, Number(interactionInfo.list[i])));
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
    async getDrop (newDrop) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode, dropNo: newDrop.dropNo })
      }
      await this.$axios.post(this.api_path + "/get-drop", requestOptions)
          .then(res => {
        this.getItem(newDrop.itemNo, newDrop.amount, true)
        return
      })
      .catch(error => {
      })
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
        if (this.isDef(userData.vp) && userData.vp > 0) {
          userData.vp--
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
            userStatus.preservedItems = {}
            userStatus.preservedItems['t001'] = 10
            userStatus.preservedItems['t002'] = 10
            userStatus.preservedItems['t003'] = 10
            userStatus.preservedItems['a001'] = 10
            userStatus.preservedItems['a002'] = 10
            userStatus.preservedItems['a003'] = 10
            userStatus.preservedItems['a004'] = 10
            userStatus.preservedItems['a005'] = 10
            userStatus.preservedItems['a006'] = 10
            userStatus.preservedItems['a007'] = 10
            userStatus.preservedItems['a008'] = 10
            userStatus.preservedItems['a009'] = 10
            userStatus.preservedItems['a010'] = 10
            userStatus.preservedItems['a011'] = 10
            userStatus.preservedItems['a012'] = 10
            userStatus.preservedItems['a013'] = 10
            userStatus.preservedItems['c001'] = 10
            userStatus.preservedItems['c002'] = 10
            userStatus.preservedItems['c003'] = 10
            userStatus.preservedItems['c004'] = 10
            userStatus.preservedItems['n001'] = 10
            userStatus.preservedItems['r001'] = 10
            this.getItem(itemName, 1, true)
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
          var newPlayX = newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)].toX + 0.5
          var newPlayY = newScene.teleport[Math.floor(userData.playerY + this.$scenes.height)][Math.floor(userData.playerX + this.$scenes.width)].toY + 0.5
          userData.playerX = newPlayX
          userData.playerY = newPlayY
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
    async sendChat () {
      // Only broadcasting mode
      let message = document.getElementById('chat-content').value
      document.getElementById('chat-content').value = ''
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode, receiver: chatTo, type: chatType, content: message })
      }
      await this.$axios.post(this.api_path + "/send-chat", requestOptions)
          .then(res => {
        if (chatType === 1) {
          this.addChat(userData.nickname + ':' + '[广播]' + message)
        } else if (chatType === 2) {
          var recipient = '未知'
          for (let userDataTemp in newScene.userDatas) {
            if (newScene.userDatas[userDataTemp].userCode == chatTo) {
              recipient = newScene.userDatas[userDataTemp].nickname
            }
          }
          this.addChat(userData.nickname + ':' + '[' + recipient + ']' + message)
        }
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
        body: JSON.stringify({ userCode: userCode, receiver: receiver, type: type, content: content })
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
    shutDown () {
      clearInterval(intervalTimer20)
      clearInterval(intervalTimer1000)
      clearInterval(intervalTimer30000)
      clearInterval(intervalTimerHp)
      clearInterval(intervalTimerVp)
      clearInterval(intervalTimerHunger)
      clearInterval(intervalTimerThirst)
      window.removeEventListener('resize', this.resizeCanvas)
      canvasMoveUse = -1
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode, token: token })
      }
      this.$axios.post(this.api_path + "/logoff", requestOptions)
      this.$router.push('/')
    },
    async setUserCharacter () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: userCode,
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
    interact () {
      var interactionCode = Number(document.getElementById('interactions-list').value)
      if (interactionInfo.type === 1) {
	      // Interact with other player
        if (interactionCode === 5) {
          // Communicate
          chatType = 2
          chatTo = interactionInfo.code
        } else if (interactionCode === 6) {
          // Attack
          this.addChat('你向' + userDatas[interactionInfo.code].nickname + '发动了攻击！')
          this.setRelation(userCode, interactionInfo.code, -1)
        } else if (interactionCode === 7) {
          // Flirt
          this.addChat('你向' + userDatas[interactionInfo.code].nickname + '表示了好感。')
          this.setRelation(userCode, interactionInfo.code, 0)
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
          userData.vp = userData.vpMax
        } else if (interactionCode === 3) {
          // Drink
          userData.thirst = userData.thirstMax
        } else if (interactionCode === 4) {
          // Decompose (current object)
          canvasMoveUse = 7
        } else if (interactionCode === 8) {
          // Makeup
          this.prepareInitialization()
          canvasMoveUse = 8
        }
	    }
    },
    quitInteraction () {
      interactionInfo = {}
    },
    async setRelation (userCodeA, userCodeB, newRelation) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCodeA, nextUserCode: userCodeB, newRelation: newRelation })
      }
      await this.$axios.post(this.api_path + "/set-relation", requestOptions)
          .then(res => {
      })
      .catch(error => {
      })
    },
    printText (content, x, y, maxWidth) {
      this.printText(content, x, y, maxWidth, 'left')
    },
    printText (content, x, y, maxWidth, textAlign) {
      this.ctx.textAlign = textAlign
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = '#EEEEEE'
      this.ctx.fillText(content, x, y, maxWidth)
      this.ctx.fillStyle = '#000000'
      this.ctx.shadowBlur = 0 // 阴影模糊范围
      this.ctx.shadowOffsetX = 0
      this.ctx.shadowOffsetY = 0
      this.ctx.textAlign = 'left'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
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
    .chat #chat-target{
        height: 20px;
        width: 50px;
        opacity: 0.75;
        font-size: 16px;
    }
    .chat #chat-content{
        height: 20px;
        width: 120px;
        opacity: 0.75;
        font-size: 16px;
    }
    .chat #chat-enter{
        height: 25px;
        width: 40px;
        font-size: 10px;
    }
    .interactions{
        opacity:0.75;
        display: none;
    }
    .interactions #interactions-list{
        position: absolute;
        bottom: 160px;
        height: 25px;
        width: 150px;
        margin-left: -75px;
        font-size: 16px;
    }
    .interactions #interactions-enter{
        position: absolute;
        bottom: 160px;
        height: 25px;
        width: 40px;
        margin-left: 75px;
        font-size: 10px;
    }
    .interactions #interactions-quit{
        position: absolute;
        bottom: 160px;
        height: 25px;
        width: 40px;
        margin-left: 115px;
        font-size: 10px;
    }
    .items{
        opacity:0.75;
        display: none;
    }
    .items #items-type{
        position: absolute;
        left: 110px;
        top: 160px;
        width: 50px;
        display: flex;
    }
    .items #items-name{
        position: absolute;
        left: 110px;
        top: 185px;
        width: 120px;
        display: flex;
    }
    .items #items-choose{
        position: absolute;
        left: 230px;
        top: 185px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items #items-range{
        position: absolute;
        left: 110px;
        top: 210px;
        width: 120px;
        display: flex;
    }
    .items #items-remove{
        position: absolute;
        left: 110px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size:10px;
    }
    .items #items-desc{
        position: absolute;
        left: 110px;
        top: 260px;
        width: 150px;
        height: 150px;
        display: flex;
        font-size: 16px;
    }
    .items-exchange{
        display: none;
    }
    .items-exchange #items-exchange-put{
        position: absolute;
        left: 110px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items-exchange #items-exchange-name{
        position: absolute;
        left: 310px;
        top: 185px;
        width: 120px;
        display: flex;
    }
    .items-exchange #items-exchange-range{
        position: absolute;
        left: 310px;
        top: 210px;
        width: 120px;
        display: flex;
    }
    .items-exchange #items-exchange-get{
        position: absolute;
        left: 310px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items-exchange #items-exchange-desc{
        position: absolute;
        left: 310px;
        top: 260px;
        width: 150px;
        height: 150px;
        display: flex;
        font-size: 16px;
    }
    .members{
        opacity:0.75;
        display: none;
    }
    .members #members-list{
        position: absolute;
        left: 110px;
        top: 160px;
        width: 150px;
        display: flex;
        font-size: 16px;
    }
    .settings{
        opacity:0.75;
        display: none;
    }
    .settings #settings-blockSize{
        position: absolute;
        left: 160px;
        top: 160px;
        width: 100px;
        display: flex;
    }
    .settings #settings-music{
        position: absolute;
        left: 160px;
        top: 210px;
        display: flex;
    }
    .settings #settings-sound{
        position: absolute;
        left: 260px;
        top: 210px;
        display: flex;
    }
    .settings #settings-about{
        position: absolute;
        left: 110px;
        top: 260px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .settings #settings-logoff{
        position: absolute;
        left: 110px;
        top: 310px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .initialization{
        position: absolute;
        left: 110px;
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
