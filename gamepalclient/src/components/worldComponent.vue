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
                    <option value="1">普通</option>
                    <option value="2">纯真</option>
                    <option value="3">警惕</option>
                    <option value="4">蔚蓝</option>
                    <option value="5">卡通</option>
                </select>
                <br/>
                <button id="initialization-enter" @click="setPlayerCharacter()">提交</button>
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
            <img id="avatars" src="../assets/image/characters/avatars.png" />
            <img id="body_m_a" src="../assets/image/characters/body_m_a.png" />
            <img id="body_m_c" src="../assets/image/characters/body_m_c.png" />
            <img id="body_m_l" src="../assets/image/characters/body_m_l.png" />
            <img id="body_m_b" src="../assets/image/characters/body_m_b.png" />
            <img id="body_f_a" src="../assets/image/characters/body_f_a.png" />
            <img id="body_f_c" src="../assets/image/characters/body_f_c.png" />
            <img id="body_f_l" src="../assets/image/characters/body_f_l.png" />
            <img id="body_f_b" src="../assets/image/characters/body_f_b.png" />
            <img id="eyes_1" src="../assets/image/characters/eyes_1.png" />
            <img id="eyes_2" src="../assets/image/characters/eyes_2.png" />
            <img id="eyes_3" src="../assets/image/characters/eyes_3.png" />
            <img id="eyes_4" src="../assets/image/characters/eyes_4.png" />
            <img id="eyes_5" src="../assets/image/characters/eyes_5.png" />
            <img id="hairstyle_black" src="../assets/image/characters/hairstyles/hairstyle_black.png" />
            <img id="hairstyle_grey" src="../assets/image/characters/hairstyles/hairstyle_grey.png" />
            <img id="hairstyle_orange" src="../assets/image/characters/hairstyles/hairstyle_orange.png" />
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
            <img id="itemsImage" src="../assets/image/items.png" />
        </div>
  </div>
</template>

<script>

// HTML elements
let canvas
let context
let selectionImage
// let bear
// let birds
// let buffalo
// let camel
// let chicken
// let cobra
// let fox
let frog
// let lionfemale
// let lionmale
let monkey
let paofu
// let polarbear
let racoon
// let seagull
// let sheep
// let tiger
let avatars
let maleBodies
let femaleBodies
let eyesImage
let hairstyle_black
let hairstyle_grey
let hairstyle_orange
let a001
let a002
let a003
let a004
let a005
let a006
let a007
let a008
let a009
let a010
let a011
let a012
let a013
let doors
let floors
let objects
let traffic
let walls
let buttons
let smallButtons
// let balloons
let itemsImage

let userCode = undefined
let token = undefined
// eslint-disable-next-line no-unused-vars
let playerInfos = undefined
// eslint-disable-next-line no-unused-vars
let detectedUserCodes = undefined
let playerInfo = undefined
let newScene
// let userDatas = [] // Deprecated
let privateUserDatas = [] // Deprecated
let userData = undefined // Deprecated
let userStatus = undefined // Deprecated
let chatMessages = []
let voiceMessages = []
let members = []
let drops = {}
let enemies = {}

let gameState = 0 // 0-Start 1-In-progress
// const canvasMaxSizeX = 16
// const canvasMaxSizeY = 9
// const canvasMinSizeX = 1
// const canvasMinSizeY = 1
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
// let voiceInUse = false
const voiceEndDelay = 500

var intervalTimerInit
var intervalTimer20
var intervalTimer1000
var intervalTimer30000
var intervalTimerHp
var intervalTimerVp
var intervalTimerHunger
var intervalTimerThirst

// const I64BIT_TABLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.split('')

// eslint-disable-next-line no-unused-vars
const handle1 = (property) => {
  return function(a, b) {
    const val1 = a[property]
    const val2 = b[property]
    return val1 - val2
  }
}
// eslint-disable-next-line no-unused-vars
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
  name: 'worldComponent',
  data () {
    return {
      msg: 'Welcome to GamePal-Lobby',
      api_path: '/api/v1'
    }
  },
  components: {
  },
  mounted () {
    selectionImage = document.getElementById('selection')
    // bear = document.getElementById('bear')
    // birds = document.getElementById('birds')
    // buffalo = document.getElementById('buffalo')
    // camel = document.getElementById('camel')
    // chicken = document.getElementById('chicken')
    // cobra = document.getElementById('cobra')
    // fox = document.getElementById('fox')
    frog = document.getElementById('frog')
    // lionfemale = document.getElementById('lionfemale')
    // lionmale = document.getElementById('lionmale')
    monkey = document.getElementById('monkey')
    paofu = document.getElementById('paofu')
    // polarbear = document.getElementById('polarbear')
    racoon = document.getElementById('racoon')
    // seagull = document.getElementById('seagull')
    // sheep = document.getElementById('sheep')
    // tiger = document.getElementById('tiger')
    avatars = document.getElementById('avatars')
    maleBodies = [
      document.getElementById('body_m_a'),
      document.getElementById('body_m_c'),
      document.getElementById('body_m_l'),
      document.getElementById('body_m_b')
    ]
    femaleBodies = [
      document.getElementById('body_f_a'),
      document.getElementById('body_f_c'),
      document.getElementById('body_f_l'),
      document.getElementById('body_f_b')
    ]
    eyesImage = [
      document.getElementById('eyes_1'),
      document.getElementById('eyes_2'),
      document.getElementById('eyes_3'),
      document.getElementById('eyes_4'),
      document.getElementById('eyes_5')
    ]
    hairstyle_black = document.getElementById('hairstyle_black')
    hairstyle_grey = document.getElementById('hairstyle_grey')
    hairstyle_orange = document.getElementById('hairstyle_orange')
    a001 = document.getElementById('suit')
    a002 = document.getElementById('tuxedo')
    a003 = document.getElementById('soldier')
    a004 = document.getElementById('officer')
    a005 = document.getElementById('pajamas_black')
    a006 = document.getElementById('pajamas_grey')
    a007 = document.getElementById('pajamas_white')
    a008 = document.getElementById('pajamas_red')
    a009 = document.getElementById('pajamas_green')
    a010 = document.getElementById('pajamas_blue')
    a011 = document.getElementById('pajamas_orange')
    a012 = document.getElementById('pajamas_yellow')
    a013 = document.getElementById('pajamas_purple')
    doors = document.getElementById('doors')
    floors = document.getElementById('floors')
    objects = document.getElementById('objects')
    traffic = document.getElementById('traffic')
    walls = document.getElementById('walls')
    buttons = document.getElementById('buttons')
    smallButtons = document.getElementById('smallButtons')
    // balloons = document.getElementById('balloons')
    itemsImage = document.getElementById('items')
    intervalTimerInit = setInterval(() => {
      document.getElementById('loading').style.display = 'inline'
      let toLoad = 0
      let loaded = 0
      // let imgIds = ['bear', 'birds', 'buffalo', 'camel', 'chicken', 'cobra', 'fox', 'frog', 'lionfemale', 'lionmale', 'monkey', 'paofu', 'polarbear', 'racoon', 'seagull', 'sheep', 'tiger', 'avatars', 'characters', 'hairstyle', 'hairstyle_black', 'hairstyle_grey', 'hairstyle_orange', 'eyesImage', 'pajamas_black', 'pajamas_grey', 'pajamas_white', 'pajamas_red', 'pajamas_green', 'pajamas_blue', 'pajamas_orange', 'pajamas_yellow', 'pajamas_purple', 'floors', 'decorations', 'doors', 'buttons']
      // for (let i = 0; i < imgIds.length; i++) {
      //   if (document.getElementById(imgIds[i]).complete) {
      //     toLoad++
      //     loaded++
      //   } else {
      //     toLoad++
      //   }
      // }
      document.querySelector('p').innerHTML = '加载中...' + loaded + '/' + toLoad
      if (toLoad === loaded) {
        document.querySelector('p').innerHTML = '加载完毕'
        document.getElementById('loading').style.display = 'none'
        clearInterval(intervalTimerInit)
        
        // this.initUserData()

        //Sync userCode from sessionStorage
        userCode = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
        //Sync token from sessionStorage
        token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
        this.initWebSocket()
      }
    }, 1000)
  },
  destroy () {
    this.logoff()
  },
  methods: {
    async initUserData () { // Deprecated
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode })
      }
      await this.axios.post(this.api_path + "/inituserinfo", requestOptions).then(res => {
        console.log('User data initialized. ' + res)
        privateUserDatas = res.data.privateUserDatas
        userData = privateUserDatas[userCode]
        userStatus = res.data.userStatus
        // this.init()
      })
      .catch(error => {
        console.error(error)
      })
    },
    async init () {
      gameState = 1
      canvas = document.getElementById('canvas')
      context = canvas.getContext('2d') // 设置2D渲染区域
      // canvas.addEventListener('contextmenu', function(e) {
        canvas.style.display = 'inline'
      //   e.preventDefault();
      // }) // 防止长按复制
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
      context.lineWidth = 5 // 设置线的宽度
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
      this.prepareInitialization()
      canvasMoveUse = 8
      // this.updateItems()
      // this.updatePreservedItems()
      document.getElementById('settings-blockSize').min = minBlockSize
      document.getElementById('settings-blockSize').max = maxBlockSize
      blockSize = Math.min(maxBlockSize, Math.max(minBlockSize, blockSize))
      document.getElementById('settings-blockSize').value = blockSize
      document.getElementById('settings-music').checked = !musicMuted
      document.getElementById('settings-sound').checked = !soundMuted

      this.initTimers()
    },
    initTimers () {
      // 需要定时执行的代码
      intervalTimer20 = setInterval(() => {
        if (this.websocket.readyState === 1) {
          this.sendWebsocketMessage()
          // this.playerMoveFour()
          this.show()
        }
      }, 20)
      intervalTimer1000 = setInterval(() => {
        // this.updateVoice()
      }, 1000)
      intervalTimer30000 = setInterval(() => {
        // this.updateChat()
      }, 30000)
      intervalTimerHp = setInterval(() => {
        // if (this.isDef(playerInfo.hunger) && playerInfo.hunger.toFixed(2) / playerInfo.hungerMax.toFixed(2) >= 0.2 &&  this.isDef(playerInfo.thirst) && playerInfo.thirst.toFixed(2) / playerInfo.thirstMax.toFixed(2) >= 0.2) {
        //   playerInfo.hp = Math.min(playerInfo.hp + 1, playerInfo.hpMax)
        // }
      }, 1000)
      intervalTimerVp = setInterval(() => {
        // if (this.isDef(playerInfo.hp) && this.isDef(playerInfo.vp)) {
        //   if (playerInfo.hp.toFixed(2) / playerInfo.hpMax.toFixed(2) > 0.5 && playerInfo.vp < playerInfo.vpMax) {
        //     playerInfo.vp++
        //   } else if (playerInfo.hp.toFixed(2) / playerInfo.hpMax.toFixed(2) < 0.1 && playerInfo.vp > 0) {
        //     playerInfo.vp--
        //   }
        // }
      }, 50)
      intervalTimerHunger = setInterval(() => {
        // if (this.isDef(playerInfo.hunger) && playerInfo.hunger > 0) {
        //   playerInfo.hunger--
        // }
      }, 70000)
      intervalTimerThirst = setInterval(() => {
        // if (this.isDef(playerInfo.thirst) && playerInfo.thirst > 0) {
        //   playerInfo.thirst--
        // }
      }, 30000)
    },
    initWebSocket () {
      console.log('initWebSocket方法')
      // WebSocket地址为接口地址，http用ws、https用wws
      var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws"
      this.websocket = new WebSocket(ws_scheme + '://'
          // + this.$hostPrd
          + this.$hostDev
          + ':9000/websocket/v1/' + sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2))
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
      // this.shutDown()
    },
    webSocketMessage (e) {
      // 接收服务器返回的数据
      // console.log('服务器返回的消息', e.data)
      var response = JSON.parse(e.data)

      // Check usercode
      if (response.userCode != userCode) {
        console.log('Message is ignored due to invalid token.')
        return
      }

      // Check token
      if (response.token != token) {
        console.log('Log off due to invalid token.')
        this.logoff()
      }

      // Update playerInfos
      playerInfos = response.playerInfos
      playerInfo = playerInfos[userCode]

      // Update detectedUserCodes
      detectedUserCodes = response.detectedUserCodes

      // Check messages
      if (this.isDef(response.messages)) {
        console.log('Messages received.')
        for (let i = 0; i < response.messages.length; i++) {
          var message = response.messages[i]
          var fromUserCode = message.fromUserCode
          var fromNickname = '[已离线]'
          if (this.isDef(playerInfos[fromUserCode])) {
            fromNickname = playerInfos[fromUserCode].nickname
          }
          if (response.chatMessages[i].type === 0) {
            this.addChat(fromNickname + ':' + '[广播]' + message.content)
          } else if (response.chatMessages[i].type === 1) {
            this.addChat(fromNickname + ':' + message.content)
          } else {
            console.error('Unknown message type.')
          }
        }
      }
      if (this.isDef(response.voiceMessages)) {
      // console.log('voiceMessages received')
        for (let i = 0; i < response.voiceMessages.length; i++) {
          voiceMessages.push(response.voiceMessages[i].content)
        }
      }

      // enemies = response.enemies
      // drops = response.drops

      if (gameState === 0) {
        this.init()
      }
    },
    logoff () {
      console.log('Log off.')
      this.websocket.close()
      this.shutDown()
    },
    sendWebsocketMessage () {
      this.websocket.send(JSON.stringify({ userCode:userCode, playerInfo: playerInfo }))
    },
    show () {
      context.clearRect(0, 0, canvas.width, canvas.height)
      // Adjust view
      defaultDeltaWidth = canvas.width / 2 - playerInfo.userCoordinate.position.x * blockSize
      defaultDeltaHeight = canvas.height / 2 - playerInfo.userCoordinate.position.y * blockSize

      var scene = this.$scenes.scenes[playerInfo.userCoordinate.scenes.center]

      // Enlarge nearbySceneNos (Not including scene itself. Backend will consider it together 02/01)
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
        playerInfo.userCoordinate.scenes.north = scene.up
        oldScenes[0][1] = this.$scenes.scenes[scene.up]
        sceneNoTable[0][1] = scene.up
        if (-1 !== this.$scenes.scenes[scene.up].left) {
          upLeftDone = true
          playerInfo.userCoordinate.scenes.northwest = this.$scenes.scenes[scene.up].left
          oldScenes[0][0] = this.$scenes.scenes[this.$scenes.scenes[scene.up].left]
          sceneNoTable[0][0] = this.$scenes.scenes[scene.up].left
        }
        if (-1 !== this.$scenes.scenes[scene.up].right) {
          upRightDone = true
          playerInfo.userCoordinate.scenes.northeast = this.$scenes.scenes[scene.up].right
          oldScenes[0][2] = this.$scenes.scenes[this.$scenes.scenes[scene.up].right]
          sceneNoTable[0][2] = this.$scenes.scenes[scene.up].right
        }
      }
      if (-1 !== scene.left) {
        if (-1 !== this.$scenes.scenes[scene.left].up && !upLeftDone) {
          upLeftDone = true
          playerInfo.userCoordinate.scenes.northwest = this.$scenes.scenes[scene.left].up
          oldScenes[0][0] = this.$scenes.scenes[this.$scenes.scenes[scene.left].up]
          sceneNoTable[0][0] = this.$scenes.scenes[scene.left].up
        }
        playerInfo.userCoordinate.scenes.west = scene.left
        oldScenes[1][0] = this.$scenes.scenes[scene.left]
        sceneNoTable[1][0] = scene.left
        if (-1 !== this.$scenes.scenes[scene.left].down && !downLeftDone) {
          downLeftDone = true
          playerInfo.userCoordinate.scenes.southwest = this.$scenes.scenes[scene.left].down
          oldScenes[2][0] = this.$scenes.scenes[this.$scenes.scenes[scene.left].down]
          sceneNoTable[2][0] = this.$scenes.scenes[scene.left].down
        }
      }
      if (-1 !== scene.right) {
        if (-1 !== this.$scenes.scenes[scene.right].up && !upRightDone) {
          upRightDone = true
          playerInfo.userCoordinate.scenes.northeast = this.$scenes.scenes[scene.right].up
          oldScenes[0][2] = this.$scenes.scenes[this.$scenes.scenes[scene.right].up]
          sceneNoTable[0][2] = this.$scenes.scenes[scene.right].up
        }
        playerInfo.userCoordinate.scenes.east = scene.right
        oldScenes[1][2] = this.$scenes.scenes[scene.right]
        sceneNoTable[1][2] = scene.right
        if (-1 !== this.$scenes.scenes[scene.right].down && !downRightDone) {
          downRightDone = true
          playerInfo.userCoordinate.scenes.southeast = this.$scenes.scenes[scene.right].down
          oldScenes[2][2] = this.$scenes.scenes[this.$scenes.scenes[scene.right].down]
          sceneNoTable[2][2] = this.$scenes.scenes[scene.right].down
        }
      }
      if (-1 !== scene.down) {
        playerInfo.userCoordinate.scenes.south = scene.down
        oldScenes[2][1] = this.$scenes.scenes[scene.down]
        sceneNoTable[2][1] = scene.down
        if (-1 !== this.$scenes.scenes[scene.down].left) {
          downLeftDone = true
          playerInfo.userCoordinate.scenes.southwest = this.$scenes.scenes[scene.down].left
          oldScenes[2][0] = this.$scenes.scenes[this.$scenes.scenes[scene.down].left]
          sceneNoTable[2][0] = this.$scenes.scenes[scene.down].left
        }
        if (-1 !== this.$scenes.scenes[scene.down].right) {
          downRightDone = true
          playerInfo.userCoordinate.scenes.southeast = this.$scenes.scenes[scene.down].right
          oldScenes[2][2] = this.$scenes.scenes[this.$scenes.scenes[scene.down].right]
          sceneNoTable[2][2] = this.$scenes.scenes[scene.down].right
        }
      }
      
      // Reset interactionInfo from clicking
      // if (this.isDef(interactionInfo.newPosition)) {
      //   delete interactionInfo.newPosition
      // }
      // Filtering detected users' info has been done on backend
      // var userDatasMap = new Map()
      // for (let code in userDatas) {
      //   if (userDatasMap.has(userDatas[code].sceneNo)) {
      //     userDatasMap.get(userDatas[code].sceneNo).push(userDatas[code])
      //   } else {
      //     userDatasMap.set(userDatas[code].sceneNo, [userDatas[code]])
      //   }
      // }

      // for (let i = 0; i < 3; i++) {
      //   for (let j = 0; j < 3; j++) {
      //     if (userDatasMap.has(sceneNoTable[i][j])) {
      //       var userDatasFromMap = userDatasMap.get(sceneNoTable[i][j])
      //       for (let k = 0; k < userDatasFromMap.length; k++) {
      //         var userDataFromMap = JSON.parse(JSON.stringify(userDatasFromMap[k])) // Shaking bug fixed 02/04
      //         userDataFromMap.playerX += j * this.$scenes.width
      //         userDataFromMap.playerY += i * this.$scenes.height
      //         userDataFromMap.playerNextX += j * this.$scenes.width
      //         userDataFromMap.playerNextY += i * this.$scenes.height
      //         newScene.userDatas.push(userDataFromMap)
      //         if (interactionInfo.type === 1 && interactionInfo.code == userDataFromMap.userCode) {
      //           interactionInfo.sceneNo = userDataFromMap.sceneNo
      //           interactionInfo.x = userDataFromMap.playerX - (j - 1) * 10 - 0.5 // Must substract first, then it will be added again 04/06
      //           interactionInfo.y = userDataFromMap.playerY - (i - 1) * 10 - 0.5
      //         }
      //       }
      //     }
      //     if (this.isDef(interactionInfo) && this.isDef(sceneNoTable[i][j]) && interactionInfo.sceneNo === sceneNoTable[i][j]) {
      //       interactionInfo.newPosition = {
      //         x: interactionInfo.x + (j - 1) * this.$scenes.width,
      //         y: interactionInfo.y + (i - 1) * this.$scenes.height
      //       }
      //     }
      //   }
      // }

      // Locate interactionInfo
      for (let i = 0; i < playerInfos.length; i++) {
        if (interactionInfo.type === 1 && interactionInfo.code == playerInfos[i].userCode) {
          interactionInfo.position1 = {
            x: playerInfos[i].userCoordinate.position.x,
            y: playerInfos[i].userCoordinate.position.y
          }
        }
      }
      newScene.drops = []

      var newDecoration
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          var oldScene = oldScenes[i][j]
          if (!this.isDef(oldScene)) {
            continue
          }
          if (this.isDef(oldScene.decorations)) {
            if (this.isDef(oldScene.decorations.up)) {
              for (let k = 0; k < oldScene.decorations.up.length; k++) {
                newDecoration = {}
                newDecoration.code = oldScene.decorations.up[k].code
                newDecoration.x = oldScene.decorations.up[k].x + j * this.$scenes.width
                newDecoration.y = oldScene.decorations.up[k].y + i * this.$scenes.height
                newScene.decorations.up.push(newDecoration)
              }
            }
            if (this.isDef(oldScene.decorations.bottom)) {
              for (let k = 0; k < oldScene.decorations.bottom.length; k++) {
                newDecoration = {}
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

      // Console
      // context.drawImage(avatars, 0, 0, 100, 101)
      // context.fillRect(100, 100, 300, 300)
      // context.strokeRect(222, 222, 444, 444)
      context.drawImage(avatars, playerInfo.avatar % 10 * avatarSize, Math.floor(playerInfo.avatar / 10) * avatarSize, avatarSize, avatarSize, 0 * avatarSize, canvas.height - avatarSize, avatarSize, avatarSize)
      if (canvasMoveUse !== 2) {
        context.drawImage(buttons, 0 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 0 * buttonSize, canvas.height - buttonSize, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 0 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 0 * buttonSize, canvas.height - buttonSize, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== 3) {
        context.drawImage(buttons, 1 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 1 * buttonSize, canvas.height - buttonSize, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 1 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 1 * buttonSize, canvas.height - buttonSize, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== 9) {
        context.drawImage(buttons, 2 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 2 * buttonSize, canvas.height - buttonSize, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 2 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 2 * buttonSize, canvas.height - buttonSize, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== 4) {
        context.drawImage(buttons, 3 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 3 * buttonSize, canvas.height - buttonSize, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 3 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + 3 * buttonSize, canvas.height - buttonSize, buttonSize, buttonSize)
      }
      if (this.isDef(playerInfo.nickname) && this.isDef(playerInfo.lastName) && this.isDef(playerInfo.firstName)) {
        this.printText('Lv.' + playerInfo.level + ' ' + playerInfo.nickname + '(' + playerInfo.lastName + ',' + playerInfo.firstName + ')', avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.75, buttonSize * 5, 'left')
      } else {
        this.printText('Lv.' + playerInfo.level, avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.75, buttonSize * 5, 'left')
      }
      this.printText('经验值' + playerInfo.exp + '/' + playerInfo.expMax, avatarSize + statusSize, document.documentElement.clientHeight - buttonSize * 1.25, buttonSize * 5)
      this.printText('生命值' + playerInfo.hp + '/' + playerInfo.hpMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 8 * statusSize - avatarSize, maxStatusLineSize, 'left')
      this.printText('活力值' + playerInfo.vp + '/' + playerInfo.vpMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 6 * statusSize - avatarSize, maxStatusLineSize, 'left')
      this.printText('饥饿值' + playerInfo.hunger + '/' + playerInfo.hungerMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 4 * statusSize - avatarSize, maxStatusLineSize, 'left')
      this.printText('口渴值' + playerInfo.thirst + '/' + playerInfo.thirstMax, document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 2 * statusSize - avatarSize, maxStatusLineSize, 'left')
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      context.fillStyle = 'rgba(191, 191, 191, 0.5)'
      context.fillRect(avatarSize + buttonSize * 2 + statusSize, document.documentElement.clientHeight - buttonSize * 1.5, maxStatusLineSize * playerInfo.exp / playerInfo.expMax, statusSize * 0.75)
      context.fillStyle = 'rgba(191, 191, 0, 0.5)'
      context.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 7.75 * statusSize - avatarSize, maxStatusLineSize * playerInfo.hp / playerInfo.hpMax, statusSize * 0.75)
      context.fillStyle = 'rgba(0, 191, 0, 0.5)'
      context.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 5.75 * statusSize - avatarSize, maxStatusLineSize * playerInfo.vp / playerInfo.vpMax, statusSize * 0.75)
      context.fillStyle = 'rgba(191, 0, 0, 0.5)'
      context.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 3.75 * statusSize - avatarSize, maxStatusLineSize * playerInfo.hunger / playerInfo.hungerMax, statusSize * 0.75)
      context.fillStyle = 'rgba(0, 0, 191, 0.5)'
      context.fillRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 1.75 * statusSize - avatarSize, maxStatusLineSize * playerInfo.thirst / playerInfo.thirstMax, statusSize * 0.75)
      context.strokeRect(avatarSize + buttonSize * 2 + statusSize, document.documentElement.clientHeight - buttonSize * 1.5, maxStatusLineSize, statusSize * 0.75)
      context.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 7.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      context.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 5.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      context.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 3.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      context.strokeRect(document.documentElement.clientWidth - maxStatusLineSize - statusSize, document.documentElement.clientHeight - 1.75 * statusSize - avatarSize, maxStatusLineSize, statusSize * 0.75)
      context.fillStyle = '#000000'
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
          context.drawImage(smallButtons, 0 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, recordButtonX >= 0 ? recordButtonX : (canvas.width + recordButtonX), recordButtonY >= 0 ? recordButtonY : (canvas.height + recordButtonY), smallButtonSize, smallButtonSize)
        } else {
          context.drawImage(smallButtons, 0 * smallButtonSize, 1 * smallButtonSize, smallButtonSize, smallButtonSize, recordButtonX >= 0 ? recordButtonX : (canvas.width + recordButtonX), recordButtonY >= 0 ? recordButtonY : (canvas.height + recordButtonY), smallButtonSize, smallButtonSize)
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
        // context.drawImage(paw, pointerX - blockSize + defaultDeltaWidth, pointerY - blockSize + defaultDeltaHeight)
      }
    },
    printScene (scene, deltaWidth, deltaHeight) {
      console.log('scene.decorations'+JSON.stringify(scene.decorations))
      console.log('playerInfos'+JSON.stringify(playerInfos))
      // Bottom floor
      var i, j, code
      if (this.isDef(scene.floors)) {
        for (j = 0; j < this.$scenes.height * 3; j++) {
          for (i = 0; i < this.$scenes.width * 3; i++) {
            code = scene.floors[j][i]
            if (this.isDef(code) && code < 0) {
              code *= -1
              this.printFloor(code, i * blockSize + deltaWidth, j * blockSize + deltaHeight)
            }
          }
        }
      }
      // Bottom Decoration
      if (this.isDef(scene.decorations.bottom)) {
        for (i = 0; i < scene.decorations.bottom.length; i++) {
          this.printDecoration(scene.decorations.bottom[i], deltaWidth, deltaHeight)
        }
      }

      // Dropped Items
      var timestamp
      for (let newDrop in newScene.drops) {
        timestamp = (new Date()).valueOf()
        var time = timestamp % 4000
        context.drawImage(itemsImage, 0 * imageBlockSize / 2, 0 * imageBlockSize / 2, imageBlockSize / 2, imageBlockSize / 2, (newScene.drops[newDrop].x - 0.25 + 0.25 - Math.sin(time * Math.PI * 2 / 4000) / 4) * blockSize + deltaWidth, (newScene.drops[newDrop].y - 0.25) * blockSize + deltaHeight, blockSize / 2 * Math.sin(time * Math.PI * 2 / 4000), blockSize / 2)
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
            code = scene.floors[j][i]
            if (this.isDef(code) && code > 0) {
              this.printFloor(code, i * blockSize + deltaWidth, j * blockSize + deltaHeight)
            }
          }
        }
        // Up decoration & character
        while ((this.isDef(scene.decorations.up) && decorationIndex < scene.decorations.up.length 
            && scene.decorations.up[decorationIndex].y >= j && scene.decorations.up[decorationIndex].y < (j + 1)) 
            || (characterIndex < detectedUserCodes.length && (playerInfos[detectedUserCodes[characterIndex]].userCoordinate.position.y - 0.5) >= j 
            && (playerInfos[detectedUserCodes[characterIndex]].userCoordinate.position.y - 0.5) < (j + 1))) {
          if ((this.isDef(scene.decorations.up) && decorationIndex < scene.decorations.up.length 
              && scene.decorations.up[decorationIndex].y >= j && scene.decorations.up[decorationIndex].y < (j + 1)) 
              && (characterIndex < detectedUserCodes.length && (playerInfos[detectedUserCodes[characterIndex]].userCoordinate.position.y - 0.5) >= j 
              && (playerInfos[detectedUserCodes[characterIndex]].userCoordinate.position.y - 0.5) < (j + 1))) {
            if (scene.decorations.up[decorationIndex].y < (playerInfos[detectedUserCodes[characterIndex]].userCoordinate.position.y - 0.5)) {
              this.printDecoration(scene.decorations.up[decorationIndex], deltaWidth, deltaHeight)
              decorationIndex++
            } else {
              this.printCharacter(playerInfos[detectedUserCodes[characterIndex]], deltaWidth, deltaHeight)
              characterIndex++
            }
          } else if (this.isDef(scene.decorations.up) && decorationIndex < scene.decorations.up.length 
              && scene.decorations.up[decorationIndex].y >= j && scene.decorations.up[decorationIndex].y < (j + 1)) {
            this.printDecoration(scene.decorations.up[decorationIndex], deltaWidth, deltaHeight)
            decorationIndex++
          } else if (characterIndex < detectedUserCodes.length && (playerInfos[detectedUserCodes[characterIndex]].userCoordinate.position.y - 0.5) >= j 
              && (playerInfos[detectedUserCodes[characterIndex]].userCoordinate.position.y - 0.5) < (j + 1)) {
            this.printCharacter(playerInfos[detectedUserCodes[characterIndex]], deltaWidth, deltaHeight)
            characterIndex++
          }
        }
      }
      // Show events
      for (let j = 0; j < this.$scenes.height * 3; j++) {
        for (let i = 0; i < this.$scenes.width * 3; i++) {
          if (Math.pow(playerInfo.userCoordinate.position.x + this.$scenes.width - i - 0.5, 2) + Math.pow(playerInfo.userCoordinate.position.y + this.$scenes.height - j - 0.5, 2) > Math.pow(interactDistance, 2)) {
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
        // context.drawImage(instructions, 0 * imageBlockSize / 2, 0 * imageBlockSize / 2, imageBlockSize / 2, imageBlockSize / 2, (interactionInfo.newPosition.x + 0.5 - 0.1) * blockSize + deltaWidth, (interactionInfo.newPosition.y - 0.1) * blockSize + deltaHeight, blockSize * 0.2, blockSize * 0.2)
        timestamp = (new Date()).valueOf()
        context.drawImage(selectionImage, Math.floor(timestamp / 100) % 10 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, interactionInfo.newPosition.x * blockSize + deltaWidth, interactionInfo.newPosition.y * blockSize + deltaHeight, blockSize, blockSize)
        if (Math.pow(playerInfo.userCoordinate.position.x + this.$scenes.width - interactionInfo.newPosition.x - 0.5, 2) + Math.pow(playerInfo.userCoordinate.position.y + this.$scenes.height - interactionInfo.newPosition.y - 0.5, 2) <= Math.pow(interactDistance, 2)) {
          document.getElementById('interactions').style.display = 'inline'
        }
      }
      // Show Dropped Items
      for (let newDrop in newScene.drops) {
        if (Math.pow(playerInfo.userCoordinate.position.x - newScene.drops[newDrop].x + 10, 2) + Math.pow(playerInfo.userCoordinate.position.y - newScene.drops[newDrop].y + 10, 2) > Math.pow(interactDistance, 2)) {
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
      var offsetX, offsetY, offsetZ
      if (this.isDef(code) && Math.floor(code / 1000) === 1) {
        // floors
        offsetX = code % 10
        offsetY = Math.floor(code / 10) % 100
        context.drawImage(floors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, deltaWidth, deltaHeight, blockSize, blockSize)
      } else if (this.isDef(code) && Math.floor(code / 1000) === 2) {
        // walls
        offsetZ = code % 10
        offsetX = Math.floor(code / 10) % 10 * 2 + offsetZ % 3 / 2
        offsetY = Math.floor(code / 100) % 10 * 2 + Math.floor(offsetZ / 3) / 2
        context.drawImage(walls, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, deltaWidth, deltaHeight, blockSize, blockSize)
      }
    },
    printDecoration (decoration, deltaWidth, deltaHeight) {
      var offsetX, offsetY
      var code = decoration.code
      if (this.isDef(code) && Math.floor(code / 1000) == 1) {
        // objects
        offsetX = code % 10
        offsetY = Math.floor(code / 10) % 100
        context.drawImage(objects, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize + deltaWidth, decoration.y * blockSize + deltaHeight, blockSize, blockSize)
      } else if (this.isDef(code) && Math.floor(code / 1000) == 2) {
        // doors
        offsetX = code % 10
        offsetY = Math.floor(code / 10) % 100 * 4
        context.drawImage(doors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize + deltaWidth, decoration.y * blockSize + deltaHeight, blockSize, blockSize)
      } else if (this.isDef(code) && Math.floor(code / 1000) == 3) {
        // traffic
        offsetX = code % 10
        offsetY = Math.floor(code / 10) % 100
        context.drawImage(traffic, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize + deltaWidth, decoration.y * blockSize + deltaHeight, blockSize, blockSize)
      }
    },
    printCharacter (playerInfoTemp, deltaWidth, deltaHeight) {
      console.log('playerInfo.userCoordinate.position.x'+playerInfo.userCoordinate.position.x)
      console.log('playerInfo.userCoordinate.position.y'+playerInfo.userCoordinate.position.y)
      // Show individual
      var characterX = playerInfo.userCoordinate.position.x
      var characterY = playerInfo.userCoordinate.position.y
      if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.northwest) {
        characterX += 0
        characterY += 0
      } else if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.north) {
        characterX += 10
        characterY += 0
      } else if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.northeast) {
        characterX += 20
        characterY += 0
      } else if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.west) {
        characterX += 0
        characterY += 10
      } else if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.center) {
        characterX += 10
        characterY += 10
      } else if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.east) {
        characterX += 20
        characterY += 10
      } else if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.southwest) {
        characterX += 0
        characterY += 20
      } else if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.south) {
        characterX += 10
        characterY += 20
      } else if (playerInfoTemp.userCoordinate.scenes.center === playerInfo.userCoordinate.scenes.southeast) {
        characterX += 20
        characterY += 20
      } else {
        // Invalid position
        return
      }
      console.log('characterX'+characterX)
      console.log('characterY'+characterY)
      var offsetX, offsetY
      if (playerInfoTemp.userCoordinate.faceDirection >= 315 || playerInfoTemp.userCoordinate.faceDirection < 45) {
        offsetY = 2
      } else if (playerInfoTemp.userCoordinate.faceDirection >= 45 && playerInfoTemp.userCoordinate.faceDirection < 135) {
        offsetY = 3
      } else if (playerInfoTemp.userCoordinate.faceDirection >= 135 && playerInfoTemp.userCoordinate.faceDirection < 225) {
        offsetY = 1
      } else if (playerInfoTemp.userCoordinate.faceDirection >= 225 && playerInfoTemp.userCoordinate.faceDirection < 315) {
        offsetY = 0
      } else {
        offsetY = 0
      }
      var timestamp = (new Date()).valueOf()
      var speed = Math.sqrt(Math.pow(playerInfoTemp.userCoordinate.speed.x, 2) + Math.pow(playerInfoTemp.userCoordinate.speed.y, 2))
      if (speed !== 0 && timestamp % 400 < 100) {
        offsetX = 0
      } else if (speed !== 0 && timestamp % 400 >= 200 && timestamp % 400 < 300) {
        offsetX = 2
      } else {
        offsetX = 1
      }
      if (playerInfoTemp.creature == 1) {
        // Display RPG character
        var adderY, bodyImage
        if (playerInfoTemp.gender == 1) {
          bodyImage = maleBodies[Number(playerInfoTemp.skinColor) - 1]
          adderY = 4
        } else if (playerInfoTemp.gender == 2) {
          bodyImage = femaleBodies[Number(playerInfoTemp.skinColor) - 1]
          adderY = 0
        }
        context.drawImage(bodyImage, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        context.drawImage(eyesImage[Number(playerInfoTemp.eyes) - 1], 0, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        // Print outfit
        if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          if (playerInfoTemp.outfits[0] == 'a001') {
            context.drawImage(a001, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a002') {
            context.drawImage(a002, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a003') {
            context.drawImage(a003, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a004') {
            context.drawImage(a004, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a005') {
            context.drawImage(a005, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a006') {
            context.drawImage(a006, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a007') {
            context.drawImage(a007, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a008') {
            context.drawImage(a008, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a009') {
            context.drawImage(a009, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a010') {
            context.drawImage(a010, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a011') {
            context.drawImage(a011, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a012') {
            context.drawImage(a012, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
          if (playerInfoTemp.outfits[0] == 'a013') {
            context.drawImage(a013, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
          }
        }
        if (playerInfoTemp.hairColor == 1) {
          context.drawImage(hairstyle_black, (playerInfoTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        } else if (playerInfoTemp.hairColor == 2) {
          context.drawImage(hairstyle_grey, (playerInfoTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        } else if (playerInfoTemp.hairColor == 3) {
          context.drawImage(hairstyle_orange, (playerInfoTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        }
      } else if (playerInfoTemp.creature == 2) {
        // Display animals
        switch (playerInfoTemp.skinColor) {
          case '1':
            context.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case '2':
            context.drawImage(frog, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case '3':
            context.drawImage(monkey, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
          case '4':
            context.drawImage(racoon, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (characterX - 0.5) * blockSize + deltaWidth, (characterY - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
            break
        }
      } else if (playerInfoTemp.creature == 3) {
        // Display npcs
      }

      // Show name
      if (this.isDef(playerInfoTemp.nameColor)) {
        context.fillStyle = playerInfoTemp.nameColor
        context.fillRect((characterX - 0.25) * blockSize + deltaWidth, (characterY - 0.54) * blockSize + deltaHeight, blockSize * 0.5, blockSize * 0.2)
      }
      if (userCode != playerInfoTemp.userCode) {
        var avatarImgs
        switch (Number(playerInfoTemp.creature)) {
          case 1:
            avatarImgs = avatars
            break
          case 2:
            avatarImgs = avatars
            break
          case 3:
            // avatarImgs = npcAvatarImage
            break
        }
        context.drawImage(avatarImgs, playerInfoTemp.avatar % 10 * avatarSize, Math.floor(playerInfoTemp.avatar / 10) * avatarSize, avatarSize, avatarSize, (characterX - 0.25 - 0.2) * blockSize + deltaWidth, (characterY - 0.54) * blockSize + deltaHeight, blockSize * 0.2, blockSize * 0.2)
        if (this.isDef(enemies) && this.isDef(enemies[playerInfoTemp.userCode]) && enemies[playerInfoTemp.userCode] < 0) {
          context.fillStyle = 'red'
        } else {
          context.fillStyle = 'green'
        }
        context.beginPath()
        context.arc((characterX + 0.25 + 0.1) * blockSize + deltaWidth, (characterY - 0.54 + 0.1) * blockSize + deltaHeight, 0.1 * blockSize, 0, 2 * Math.PI);
        context.fill()
      }
      if (this.isDef(playerInfoTemp.nickname)) {
        this.printText(playerInfoTemp.nickname, characterX * blockSize + deltaWidth, (characterY - 0.5 + 0.12) * blockSize + deltaHeight, Math.min(document.documentElement.clientWidth - screenX, blockSize * 0.5), 'center')
      }
    },
    resetChatType () {
      chatType = 1
    },
    printChat () {
      // var x = 0
      // var y = -avatarSize
      if(this.isDef(chatMessages)) {
        // context.fillStyle = 'rgba(0,0,0,0.25)'
        // context.fillRect(screenX, document.documentElement.clientHeight - screenY - chatMessages.length * chatSize + 5, Math.min(document.documentElement.clientWidth, maxMsgLineSize - screenX), chatSize * chatMessages.length)
        for (let i = 0; i < chatMessages.length; i++) {
          this.printText(chatMessages[chatMessages.length - 1 - i], screenX, document.documentElement.clientHeight - screenY - i * chatSize, Math.min(document.documentElement.clientWidth - screenX, maxMsgLineSize), 'left')
        }
      }
    },
    printMenu () {
      context.fillStyle = 'rgba(191, 191, 191, 0.75)'
      context.fillRect(menuLeftEdge, menuTopEdge, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge, document.documentElement.clientHeight - menuTopEdge - menuBottomEdge)
      context.fillStyle = '#000000'
      if (canvasMoveUse !== 8 || this.isDef(playerInfo.nickname)) {
        context.drawImage(smallButtons, 1 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, document.documentElement.clientWidth - menuRightEdge - smallButtonSize, menuTopEdge, smallButtonSize, smallButtonSize)
      }
    },
    printExchange () {
      this.printText(Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100, 'left')
      this.printText('$' + userStatus.money, menuLeftEdge + 110, menuTopEdge + 20, 50, 'left')
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50, 'left')
      this.printText(document.getElementById('items-exchange-range').value, menuLeftEdge + 330, menuTopEdge + 125, 50, 'left')
    },
    printStatus () {
      var positionY = menuTopEdge + 20
      this.printText(playerInfo.nickname + ' (' + playerInfo.lastName + ', ' + playerInfo.firstName + ')', menuLeftEdge + 10, positionY, buttonSize * 5, playerInfo.nameColor, 'left')
      positionY += 20
      this.printText('当前位置:' + this.$scenes.scenes[userData.sceneNo].name, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('Lv.' + playerInfo.level + ' 经验值' + playerInfo.exp + '/' + playerInfo.expMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('生命值' + playerInfo.hp + '/' + playerInfo.hpMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('活力值' + playerInfo.vp + '/' + playerInfo.vpMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('饥饿值' + playerInfo.hunger + '/' + playerInfo.hungerMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('口渴值' + playerInfo.thirst + '/' + playerInfo.thirstMax, menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('$' + userStatus.money + ' 负重' + Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('特殊状态 无', menuLeftEdge + 10, positionY, document.documentElement.clientWidth - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
    },
    printItems () {
      this.printText(Number(userStatus.capacity).toFixed(1) + '/' + Number(userStatus.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100, 'left')
      this.printText('$' + userStatus.money, menuLeftEdge + 110, menuTopEdge + 20, 50, 'left')
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50, 'left')
    },
    async getMembers () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode })
      }
      await this.axios.post(this.api_path + '/get-members', requestOptions)
          .then(res => {
        console.info(res)
        document.getElementById('members-list').length = 0
        members = res.data.members
        for (let member in members) {
          document.getElementById('members-list').options.add(new Option(members[member].nickname + '|' + (members[member].gender == '1' ? '男' : '') + (members[member].gender == '2' ? '女' : ''), member))
        }
      })
          .catch(error => {
        console.error(error)
      })
    },
    async insertMember () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode })
      }
      await this.axios.post(this.api_path + '/insert-member', requestOptions)
          .then(res => {
        console.info(res)
      })
          .catch(error => {
        console.error(error)
      })
    },
    async deleteMember (memberCode) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode, memberCode: memberCode })
      }
      await this.axios.post(this.api_path + '/delete-member', requestOptions)
          .then(res => {
        console.info(res)
      })
          .catch(error => {
        console.error(error)
      })
    },
    printMembers () {
    },
    printSettings () {
      this.printText('缩放: ' + Math.round(blockSize / maxBlockSize * 100) + '%', menuLeftEdge + 10, menuTopEdge + 75, 50, 'left')
      this.printText('音乐', menuLeftEdge + 10, menuTopEdge + 125, 50, 'left')
      this.printText('音效', menuLeftEdge + 110, menuTopEdge + 125, 50, 'left')
      blockSize = Number(document.getElementById('settings-blockSize').value)
      musicMuted = !document.getElementById('settings-music').checked
      soundMuted = !document.getElementById('settings-sound').checked
    },
    prepareInitialization () {
      document.getElementById('initialization-nickname').value = playerInfo.nickname
      document.getElementById('initialization-lastName').value = playerInfo.lastName
      document.getElementById('initialization-firstName').value = playerInfo.firstName
      document.getElementById('initialization-nameColor').value = playerInfo.nameColor
      for (let i = 0; i < document.getElementById('initialization-avatar').options.length; i++) {
        if (document.getElementById('initialization-avatar').options[i].value == playerInfo.avatar) {
          document.getElementById('initialization-avatar').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-creature').options.length; i++) {
        if (document.getElementById('initialization-creature').options[i].value == playerInfo.creature) {
          document.getElementById('initialization-creature').options[i].selected = true
      // console.log('playerInfo.creature'+playerInfo.creature)
        }
      }
      this.updateInitializationSkinColor()
      for (let i = 0; i < document.getElementById('initialization-skinColor').options.length; i++) {
        if (document.getElementById('initialization-skinColor').options[i].value == playerInfo.skinColor) {
          document.getElementById('initialization-skinColor').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-gender').options.length; i++) {
        if (document.getElementById('initialization-gender').options[i].value == playerInfo.gender) {
          document.getElementById('initialization-gender').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-hairstyle').options.length; i++) {
        if (document.getElementById('initialization-hairstyle').options[i].value == playerInfo.hairstyle) {
          document.getElementById('initialization-hairstyle').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-hairColor').options.length; i++) {
        if (document.getElementById('initialization-hairColor').options[i].value == playerInfo.hairColor) {
          document.getElementById('initialization-hairColor').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-eyes').options.length; i++) {
        if (document.getElementById('initialization-eyes').options[i].value == playerInfo.eyes) {
          document.getElementById('initialization-eyes').options[i].selected = true
        }
      }
    },
    printInitialization () {
      var timestamp = (new Date()).valueOf()
      var offsetX = Math.floor(timestamp % 900 / 300)
      var offsetY = Math.floor(timestamp % 3600 / 900)

      // Avatar
      if (this.isDef(playerInfo.avatar)) {
        context.drawImage(avatars, playerInfo.avatar % 10 * avatarSize, Math.floor(playerInfo.avatar / 10) * avatarSize, avatarSize, avatarSize, menuLeftEdge + 10, menuTopEdge + 10, avatarSize, avatarSize)
      }
      if (this.isDef(playerInfo.nickname)) {
        context.drawImage(floors, 3 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
      }
      context.drawImage(avatars, document.getElementById('initialization-avatar').value % 10 * avatarSize, Math.floor(document.getElementById('initialization-avatar').value / 10) * avatarSize, avatarSize, avatarSize, menuLeftEdge + 160, menuTopEdge + 10, avatarSize, avatarSize)
      context.drawImage(floors, 3 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)

      // Show individual
      if (this.isDef(playerInfo.creature)) {
        if (playerInfo.creature == 1) {
          var adderY, bodyImage
          if (playerInfo.gender == 1) {
            bodyImage = maleBodies[Number(playerInfo.skinColor) - 1]
            adderY = 4
          } else if (playerInfo.gender == 2) {
            bodyImage = femaleBodies[Number(playerInfo.skinColor) - 1]
            adderY = 0
          }
          context.drawImage(bodyImage, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          context.drawImage(eyesImage[Number(playerInfo.eyes) - 1], 0, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          // context.drawImage(outfits, (offsetX + (outfitNo - 1) * 3) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          if (playerInfo.hairColor == 1) {
            context.drawImage(hairstyle_black, (playerInfo.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          } else if (playerInfo.hairColor == 2) {
            context.drawImage(hairstyle_grey, (playerInfo.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          } else if (playerInfo.hairColor == 3) {
            context.drawImage(hairstyle_orange, (playerInfo.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
          }
        } else if (playerInfo.creature == 2)  {
          switch (playerInfo.skinColor) {
            case '1':
              context.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '2':
              context.drawImage(frog, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '3':
              context.drawImage(monkey, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '4':
              context.drawImage(racoon, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 160, avatarSize, avatarSize)
              break
          }
        }
      }
      if (document.getElementById('initialization-creature').value == 1) {
        document.getElementById('initialization-hairstyle').style.display = 'inline'
        document.getElementById('initialization-hairColor').style.display = 'inline'
        document.getElementById('initialization-eyes').style.display = 'inline'
        if (document.getElementById('initialization-gender').value == 1) {
          adderY = 4
          bodyImage = maleBodies[document.getElementById('initialization-skinColor').value - 1]
        } else if (document.getElementById('initialization-gender').value == 2) {
          adderY = 0
          bodyImage = femaleBodies[document.getElementById('initialization-skinColor').value - 1]
        }
        context.drawImage(bodyImage, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        context.drawImage(eyesImage[(document.getElementById('initialization-eyes').value - 1)], 0, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        // context.drawImage(outfits, (offsetX + (outfitNo - 1) * 3) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        if (document.getElementById('initialization-hairColor').value == 1) {
          context.drawImage(hairstyle_black, (document.getElementById('initialization-hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        } else if (document.getElementById('initialization-hairColor').value == 2) {
          context.drawImage(hairstyle_grey, (document.getElementById('initialization-hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        } else if (document.getElementById('initialization-hairColor').value == 3) {
          context.drawImage(hairstyle_orange, (document.getElementById('initialization-hairstyle').value - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
        }
      } else if (document.getElementById('initialization-creature').value == 2) {
        document.getElementById('initialization-hairstyle').style.display = 'none'
        document.getElementById('initialization-hairColor').style.display = 'none'
        document.getElementById('initialization-eyes').style.display = 'none'
        if (document.getElementById('initialization-creature').value == 2) {
          switch (document.getElementById('initialization-skinColor').value) {
            case '1':
              context.drawImage(paofu, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '2':
              context.drawImage(frog, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '3':
              context.drawImage(monkey, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
              break
            case '4':
              context.drawImage(racoon, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 160, avatarSize, avatarSize)
              break
          }
        }
      }

      // Show name
      if (this.isDef(playerInfo.nickname)) {
        context.fillStyle = playerInfo.nameColor
        context.fillRect(menuLeftEdge + 10 + avatarSize / 2 - 0.25 * blockSize, menuTopEdge + 160 + avatarSize * 0.12 - 0.16 * blockSize, blockSize * 0.5, blockSize * 0.2)
        this.printText(playerInfo.nickname, menuLeftEdge + 10 + avatarSize / 2, menuTopEdge + 160 + avatarSize * 0.12, Math.min(document.documentElement.clientWidth - screenX, avatarSize), 'center')
      }
      context.fillStyle = document.getElementById('initialization-nameColor').value
      context.fillRect(menuLeftEdge + 160 + avatarSize / 2 - 0.25 * blockSize, menuTopEdge + 160 + avatarSize * 0.12 - 0.16 * blockSize, blockSize * 0.5, blockSize * 0.2)
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
            playerInfo.hp = Math.min(playerInfo.hp + this.$items.consumables[itemNo].effects[effectType], playerInfo.hpMax)
          }
          if (effectType == 'vp') {
            playerInfo.vp = Math.min(playerInfo.vp + this.$items.consumables[itemNo].effects[effectType], playerInfo.vpMax)
          }
          if (effectType == 'hunger') {
            playerInfo.hunger = Math.min(playerInfo.hunger + this.$items.consumables[itemNo].effects[effectType], playerInfo.hungerMax)
          }
          if (effectType == 'thirst') {
            playerInfo.thirst = Math.min(playerInfo.thirst + this.$items.consumables[itemNo].effects[effectType], playerInfo.thirstMax)
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
        // this.addChat(this.$items.notes[name] + ':' + this.$items.notes[content]) //???
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
        body: JSON.stringify({ sceneNo: userData.sceneNo, x: Math.floor(playerInfo.userCoordinate.position.x) + 0.25 + Math.random() / 2, y: Math.floor(playerInfo.userCoordinate.position.y + 0.5) + 0.25 + Math.random() / 2, itemNo: itemNo, amount: itemAmount })
      }
      await this.axios.post(this.api_path + "/set-drop", requestOptions)
          .then(res => {
        console.info(res)
        this.getItem(itemNo, -itemAmount, false)
      })
          .catch(error => {
        console.error(error)
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
      if (canvasMoveUse === 8 && !this.isDef(playerInfo.nickname)) {
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

      if (x < avatarSize && y >= canvas.height - avatarSize) {
        // Avatar
        canvasMoveUse = 1
      } else if (x < avatarSize + 1 * buttonSize && y >= canvas.height - buttonSize) {
        // Personal information
        canvasMoveUse = canvasMoveUse === 2 ? -1 : 2 
      } else if (x < avatarSize + 2 * buttonSize && y >= canvas.height - buttonSize) {
        // Backpack
        canvasMoveUse = canvasMoveUse === 3 ? -1 : 3
      } else if (x < avatarSize + 3 * buttonSize && y >= canvas.height - buttonSize) {
        // Members
        canvasMoveUse = canvasMoveUse === 9 ? -1 : 9
        this.getMembers()
      } else if (x < avatarSize + 4 * buttonSize && y >= canvas.height - buttonSize) {
        // Settings
        canvasMoveUse = canvasMoveUse === 4 ? -1 : 4
      } else if (x > (recordButtonX >= 0 ? recordButtonX : (canvas.width + recordButtonX)) && x < ((recordButtonX >= 0 ? recordButtonX : (canvas.width + recordButtonX)) + smallButtonSize) && y > (recordButtonY >= 0 ? recordButtonY : (canvas.height + recordButtonY)) && y < ((recordButtonY >= 0 ? recordButtonY : (canvas.height + recordButtonY)) + smallButtonSize)) {
        // Voice record
        canvasMoveUse = 10
        this.recordStart()
      } else {
        // Dropped Items
        for (let newDrop in newScene.drops) {
          if (Math.pow(pointerX / blockSize - newScene.drops[newDrop].x + 10, 2) + Math.pow(pointerY / blockSize - newScene.drops[newDrop].y + 10, 2) > Math.pow(0.25, 2)) {
            continue
          }
          if (Math.pow(playerInfo.userCoordinate.position.x - newScene.drops[newDrop].x + 10, 2) + Math.pow(playerInfo.userCoordinate.position.y - newScene.drops[newDrop].y + 10, 2) > Math.pow(pickDistance, 2)) {
            continue
          }
          this.getDrop(newScene.drops[newDrop])
          return
        }
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
      // userData.nextSceneNo = userData.sceneNo
      // userData.playerNextX = playerInfo.userCoordinate.position.x
      // userData.playerNextY = playerInfo.userCoordinate.position.y
      playerInfo.userCoordinate.speed = {
        x: 0,
        y: 0
      }
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
      await this.axios.post(this.api_path + "/get-drop", requestOptions)
          .then(res => {
        console.info(res)
        this.getItem(newDrop.itemNo, newDrop.amount, true)
        return
      })
          .catch(error => {
        console.error(error)
      })
    },
    playerMoveFour () {
      var deltaX = userData.playerNextX - playerInfo.userCoordinate.position.x
      var deltaY = userData.playerNextY - playerInfo.userCoordinate.position.y
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(stopEdge, 2)) {
        // Set speed
        userData.playerSpeedX = 0
        userData.playerSpeedY = 0
      } else {
        // Set speed
        // var coeffiecient = acceleration / Math.sqrt((Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        var coeffiecient = 0.05 / Math.sqrt((Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        if (this.isDef(playerInfo.vp) && playerInfo.vp > 0) {
          playerInfo.vp--
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
          if (newScene.events[Math.floor(playerInfo.userCoordinate.position.y - 0.5 + sharedEdge + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x + 0.5 - sharedEdge + userData.playerSpeedX + this.$scenes.width)] === 0 &&
          newScene.events[Math.ceil(playerInfo.userCoordinate.position.y - 0.5 - sharedEdge + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x + 0.5 - sharedEdge + userData.playerSpeedX + this.$scenes.width)] === 0) {
            playerInfo.userCoordinate.position.x += userData.playerSpeedX
            // Infinitive moving
            userData.playerNextX += userData.playerSpeedX
          } else {
            userData.playerSpeedX = 0
          }
        }
        if (userData.playerSpeedX < 0) {
          if (newScene.events[Math.floor(playerInfo.userCoordinate.position.y - 0.5 + sharedEdge + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x - 0.5 + sharedEdge + userData.playerSpeedX + this.$scenes.width)] === 0 &&
          newScene.events[Math.ceil(playerInfo.userCoordinate.position.y - 0.5 - sharedEdge + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x - 0.5 + sharedEdge + userData.playerSpeedX + this.$scenes.width)] === 0) {
            playerInfo.userCoordinate.position.x += userData.playerSpeedX
            // Infinitive moving
            userData.playerNextX += userData.playerSpeedX
          } else {
            userData.playerSpeedX = 0
          }
        }
        if (userData.playerSpeedY > 0) {
          if (newScene.events[Math.floor(playerInfo.userCoordinate.position.y + 0.5 - sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x - 0.5 + sharedEdge + this.$scenes.width)] === 0 &&
          newScene.events[Math.floor(playerInfo.userCoordinate.position.y + 0.5 - sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.ceil(playerInfo.userCoordinate.position.x - 0.5 - sharedEdge + this.$scenes.width)] === 0) {
            playerInfo.userCoordinate.position.y += userData.playerSpeedY
            // Infinitive moving
            userData.playerNextY += userData.playerSpeedY
          } else {
            userData.playerSpeedY = 0
          }
        }
        if (userData.playerSpeedY < 0) {
          if (newScene.events[Math.floor(playerInfo.userCoordinate.position.y - 0.5 + sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x - 0.5 + sharedEdge + this.$scenes.width)] === 0 &&
          newScene.events[Math.floor(playerInfo.userCoordinate.position.y - 0.5 + sharedEdge + userData.playerSpeedY + this.$scenes.height)][Math.ceil(playerInfo.userCoordinate.position.x - 0.5 - sharedEdge + this.$scenes.width)] === 0) {
            playerInfo.userCoordinate.position.y += userData.playerSpeedY
            // Infinitive moving
            userData.playerNextY += userData.playerSpeedY
          } else {
            userData.playerSpeedY = 0
          }
        }

        // Randomly get item
        if (Math.random() <= 0.01) {
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
        if (scene.up !== -1 && playerInfo.userCoordinate.position.y < 0) {
          userData.sceneNo = scene.up
          scene = this.$scenes.scenes[userData.sceneNo]
          playerInfo.userCoordinate.position.y += this.$scenes.height
          this.addChat('来到【'+ scene.name +'】')
        }
        if (scene.down !== -1 && playerInfo.userCoordinate.position.y >= this.$scenes.height) {
          userData.sceneNo = scene.down
          scene = this.$scenes.scenes[userData.sceneNo]
          playerInfo.userCoordinate.position.y -= this.$scenes.height
          this.addChat('来到【'+ scene.name +'】')
        }
        if (scene.left !== -1 && playerInfo.userCoordinate.position.x < 0) {
          userData.sceneNo = scene.left
          scene = this.$scenes.scenes[userData.sceneNo]
          playerInfo.userCoordinate.position.x += this.$scenes.width
          this.addChat('来到【'+ scene.name +'】')
        }
        if (scene.right !== -1 && playerInfo.userCoordinate.position.x >= this.$scenes.width) {
          userData.sceneNo = scene.right
          scene = this.$scenes.scenes[userData.sceneNo]
          playerInfo.userCoordinate.position.x -= this.$scenes.width
          this.addChat('来到【'+ scene.name +'】')
        }
        if (this.isDef(newScene.teleport[Math.floor(playerInfo.userCoordinate.position.y + this.$scenes.height)]) && this.isDef(newScene.teleport[Math.floor(playerInfo.userCoordinate.position.y + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x + this.$scenes.width)])) {
          userData.sceneNo = newScene.teleport[Math.floor(playerInfo.userCoordinate.position.y + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x + this.$scenes.width)].toSceneNo
          scene = this.$scenes.scenes[userData.sceneNo]
          var newPlayX = newScene.teleport[Math.floor(playerInfo.userCoordinate.position.y + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x + this.$scenes.width)].toX + 0.5
          var newPlayY = newScene.teleport[Math.floor(playerInfo.userCoordinate.position.y + this.$scenes.height)][Math.floor(playerInfo.userCoordinate.position.x + this.$scenes.width)].toY + 0.5
          playerInfo.userCoordinate.position.x = newPlayX
          playerInfo.userCoordinate.position.y = newPlayY
          this.addChat('来到【'+ scene.name +'】')
        }
      }
    },
    save () {
      // const imgBase64 = document.getElementById('canvas.toDataURL()
      // console.log(imgBase64)
    },
    resizeCanvas () {
      canvas.width = document.documentElement.clientWidth
      canvas.height = document.documentElement.clientHeight
      console.log('New size: ' + canvas.width + '*' + canvas.height)
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
      // voiceInUse = false
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
      await this.axios.post(this.api_path + "/send-chat", requestOptions)
          .then(res => {
        console.info(res)
        if (chatType === 1) {
          this.addChat(playerInfo.nickname + ':' + '[广播]' + message)
        } else if (chatType === 2) {
          var recipient = '未知'
          for (let userDataTemp in newScene.userDatas) {
            if (newScene.userDatas[userDataTemp].userCode == chatTo) {
              recipient = newScene.userDatas[userDataTemp].nickname
            }
          }
          this.addChat(playerInfo.nickname + ':' + '[' + recipient + ']' + message)
        }
      })
          .catch(error => {
        console.error(error)
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
      await this.axios.post(this.api_path + "/send-voice", requestOptions)
          .then(res => {
        console.info(res)
      })
          .catch(error => {
        console.error(error)
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
    async updateVoice () {
      if (voiceMessages.length > 0 && !micInUse) {
        var blobRes = await fetch(voiceMessages[0]).then(res => res.blob())
        voiceMessages = voiceMessages.slice(1)
        // voiceInUse = true
        await this.playBlob(blobRes)
        // voiceInUse = false
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
      this.axios.post(this.api_path + "/logoff", requestOptions)
      this.$router.push('/')
    },
    async setPlayerCharacter () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userCode: userCode,
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
      await this.axios.post(this.api_path + "/setplayerinfobyentities", requestOptions)
          .then(res => {
        console.info(res)
        canvasMoveUse = -1
        playerInfo.firstName = document.getElementById('initialization-firstName').value
        playerInfo.lastName = document.getElementById('initialization-lastName').value
        playerInfo.nickname = document.getElementById('initialization-nickname').value
        playerInfo.nameColor = document.getElementById('initialization-nameColor').value
        playerInfo.creature = document.getElementById('initialization-creature').value
        playerInfo.gender = document.getElementById('initialization-gender').value
        playerInfo.skinColor = document.getElementById('initialization-skinColor').value
        playerInfo.hairstyle = document.getElementById('initialization-hairstyle').value
        playerInfo.hairColor = document.getElementById('initialization-hairColor').value
        playerInfo.eyes = document.getElementById('initialization-eyes').value
        playerInfo.avatar = document.getElementById('initialization-avatar').value
      })
          .catch(error => {
        console.error(error)
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
          // this.addChat('你向' + userDatas[interactionInfo.code].nickname + '发动了攻击！')
          this.setRelation(userCode, interactionInfo.code, -1)
        } else if (interactionCode === 7) {
          // Flirt
          // this.addChat('你向' + userDatas[interactionInfo.code].nickname + '表示了好感。')
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
          playerInfo.vp = playerInfo.vpMax
        } else if (interactionCode === 3) {
          // Drink
          playerInfo.thirst = playerInfo.thirstMax
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
      await this.axios.post(this.api_path + "/set-relation", requestOptions)
          .then(res => {
        console.info(res)
      })
          .catch(error => {
        console.error(error)
      })
    },
    printText (content, x, y, maxWidth, textAlign) {
      context.textAlign = textAlign
      context.shadowColor = 'black' // 阴影颜色
      context.shadowBlur = 2 // 阴影模糊范围
      context.shadowOffsetX = 2
      context.shadowOffsetY = 2
      context.font = '16px sans-serif'
      context.fillStyle = '#EEEEEE'
      context.fillText(content, x, y, maxWidth)
      context.fillStyle = '#000000'
      context.shadowBlur = 0 // 阴影模糊范围
      context.shadowOffsetX = 0
      context.shadowOffsetY = 0
      context.textAlign = 'left'
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
