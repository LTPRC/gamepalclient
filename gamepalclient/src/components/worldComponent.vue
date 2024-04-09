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
            <canvas
                id="temp-canvas"
                ref="temp-canvas"
                style="display:none; overflow:hidden;"
            >
                抱歉，您的浏览器暂不支持canvas元素
            </canvas>
            <div id="chat" class="chat">
                <input id="chat-scope" class="chat-scope" type="text" value="" readonly @click="resetScope()"/>
                <input id="chat-content" class="chat-content" type="text" value=""/>
                <button id="chat-enter" class="chat-enter" @click="sendMsg()">Enter</button>
            </div>
            <div id="interactions" class="interactions">
                <select  id="interactions-list" class="interactions-list">
                </select>
                <button id="interactions-enter" class="interactions-enter" @click="interact()">OK</button>
                <button id="interactions-quit" class="interactions-quit" @click="quitInteraction()">Cancel</button>
            </div>
            <div id="items" class="items">
                <select id="items-type" class="items-type" @change="updateItems();updatePreservedItems()">
                    <option value="0">全部</option>
                    <option value="1">工具</option>
                    <option value="2">装备</option>
                    <option value="3">用品</option>
                    <option value="4">材料</option>
                    <option value="5">笔记</option>
                    <option value="6">录音</option>
                </select>
                <select id="items-name" class="items-name" @change="updateItems();updatePreservedItems()">
                </select>
                <button id="items-choose" class="items-choose" @click="useItem()">使用</button>
                <input id="items-range" type="range" min="0" max="0" value="0"/>
                <textarea  id="items-desc" class="items-desc" value="" readonly/>
                <button id="items-remove" class="items-remove" @click="addDrop()">丢弃</button>
                <div id="items-exchange" class="items-exchange">
                    <button id="items-exchange-put" class="items-exchange-put" @click="exchangeItemForward()">存入</button>
                    <select id="items-exchange-name" class="items-exchange-name" @change="updateItems();updatePreservedItems()">
                    </select>
                    <input id="items-exchange-range" type="range" min="0" max="0" value="0"/>
                    <button id="items-exchange-get" class="items-exchange-get" @click="exchangeItemBackward()">取出</button>
                    <textarea  id="items-exchange-desc" class="items-exchange-desc" value="" readonly/>
                </div>
            </div>
            <div id="members" class="members">
                <button id="members-rebel" class="members-rebel" @click="setMemberRebel()">自立</button>
            </div>
            <div id="settings" class="settings">
                <input id="settings-blockSize" type="range" min="10" max="200" value="100"/>
                <input id="settings-music" type="checkbox">
                <input id="settings-sound" type="checkbox">
                <button id="settings-about" class="settings-about">关于</button>
                <button id="settings-logoff" class="settings-logoff" @click="logoff()">注销</button>
            </div>
            <div id="initialization" class="initialization">
                用户名称
                <input id="initialization-nickname" type="text"/>
                姓
                <input id="initialization-lastName" type="text"/>
                名
                <input id="initialization-firstName" type="text"/>
                <br/>
                头像
                <input id="initialization-avatar" type="range" min="0" max="109" value="0"/>
                个性化颜色
                <input type="color" id="initialization-nameColor" value="#ff0000">
                模型
                <select id="initialization-creature" @change="updateInitializationSkinColor()">
                    <option value="1">人类</option>
                    <option value="2">动物</option>
                </select>
                <br/>
                种类
                <select id="initialization-skinColor">
                </select>
                性别
                <select id="initialization-gender">
                    <option value="1">♂</option>
                    <option value="2">♀</option>
                </select>
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
                发色
                <select id="initialization-hairColor">
                    <option value="1">乌黑</option>
                    <option value="2">银灰</option>
                    <option value="3">橙黄</option>
                </select>
                眼睛
                <select id="initialization-eyes">
                    <option value="1">普通</option>
                    <option value="2">纯真</option>
                    <option value="3">警惕</option>
                    <option value="4">蔚蓝</option>
                    <option value="5">卡通</option>
                </select>
                <br/>
                头顶高度系数<input id="initialization-coefs-1" type="range" min="0" max="100" value="50"/>
                下颚高度系数<input id="initialization-coefs-2" type="range" min="0" max="100" value="50"/>
                <br/>
                头顶宽度系数<input id="initialization-coefs-3" type="range" min="0" max="100" value="50"/>
                下颚宽度系数<input id="initialization-coefs-4" type="range" min="0" max="100" value="50"/>
                <br/>
                头顶弧度系数<input id="initialization-coefs-5" type="range" min="0" max="100" value="50"/>
                颧骨弧度系数<input id="initialization-coefs-6" type="range" min="0" max="100" value="50"/>
                <br/>
                下颚弧度系数<input id="initialization-coefs-7" type="range" min="0" max="100" value="50"/>
                眼睛高度系数<input id="initialization-coefs-8" type="range" min="0" max="100" value="50"/>
                <br/>
                眼睛间距系数<input id="initialization-coefs-9" type="range" min="0" max="100" value="50"/>
                <br/>
                <button id="initialization-enter" @click="prepareInitializationRandomly()">随机</button>
                <button id="initialization-enter" @click="setPlayerCharacter()">提交</button>
            </div>
        </div>
        <div id="terminal" class="terminal">
            <textarea  id="terminal-text" class="terminal-text" value="" readonly/>
            <input id="terminal-input" class="terminal-input" type="text" value=""/>
            <button id="terminal-enter" class="terminal-enter" @click="sendTerminalMsg()">Enter</button>
        </div>
        <div id="hiddenDiv" style="display:none">
            <audio id="voiceAudio" type="audio/wav" controls autoplay crossOrigin = "anonymous" />
            <audio id="musicAudio" :src="require('../assets/test01.mp3')" />
            <audio id="soundAudio" controls autoplay crossOrigin = "anonymous" />

            <img id="selectionEffect" src="../assets/image/effects/selection.png" />
            <img id="hitEffect" src="../assets/image/effects/hit.png" />
            <img id="upgradeEffect" src="../assets/image/effects/upgrade.png" />
            <img id="fireEffect" src="../assets/image/effects/fire.png" />
            <img id="explodeEffect" src="../assets/image/effects/explode.png" />
            <img id="bleedEffect" src="../assets/image/effects/bleed.png" />
            <img id="haloEffect" src="../assets/image/effects/halo.png" />
            <img id="healEffect" src="../assets/image/effects/heal.png" />
            <img id="disturbEffect" src="../assets/image/effects/disturb.png" />
            <img id="sacrificeEffect" src="../assets/image/effects/sacrifice.png" />
            <img id="moraleHighEffect" src="../assets/image/effects/morale_high.png" />
            <img id="moraleLowEffect" src="../assets/image/effects/morale_low.png" />
            <img id="meleeScratchEffect" src="../assets/image/effects/melee_scratch.png" />
            <img id="meleeCleaveEffect" src="../assets/image/effects/melee_cleave.png" />
            <img id="meleeStabEffect" src="../assets/image/effects/melee_stab.png" />
            <img id="sparkEffect" src="../assets/image/effects/spark.png" />

            <img id="paofu" src="../assets/image/animals/paofu.png" />
            <img id="frog" src="../assets/image/animals/frog.png" />
            <img id="monkey" src="../assets/image/animals/monkey.png" />
            <img id="racoon" src="../assets/image/animals/racoon.png" />
            <img id="chicken" src="../assets/image/animals/chicken.png" />

            <img id="avatars" src="../assets/image/characters/avatars.png" />
            <img id="body_c" src="../assets/image/characters/body_c.png" />
            <img id="body_m" src="../assets/image/characters/body_m.png" />
            <img id="body_a" src="../assets/image/characters/body_a.png" />
            <img id="body_l" src="../assets/image/characters/body_l.png" />
            <img id="body_b" src="../assets/image/characters/body_b.png" />
            <img id="arms_c" src="../assets/image/characters/arms_c.png" />
            <img id="arms_m" src="../assets/image/characters/arms_m.png" />
            <img id="arms_a" src="../assets/image/characters/arms_a.png" />
            <img id="arms_l" src="../assets/image/characters/arms_l.png" />
            <img id="arms_b" src="../assets/image/characters/arms_b.png" />
            <img id="eyes" src="../assets/image/characters/eyes.png" />
            <img id="hairstyle_black" src="../assets/image/characters/hairstyles/hairstyle_black.png" />
            <img id="hairstyle_grey" src="../assets/image/characters/hairstyles/hairstyle_grey.png" />
            <img id="hairstyle_orange" src="../assets/image/characters/hairstyles/hairstyle_orange.png" />

            <img id="tools_s" src="../assets/image/characters/tools/tools_s.png" />
            <img id="tools_m" src="../assets/image/characters/tools/tools_m.png" />
            <img id="tools_l" src="../assets/image/characters/tools/tools_l.png" />

            <img id="outfits_a_0" src="../assets/image/characters/outfits/a_0.png" />
            <img id="outfits_a_1" src="../assets/image/characters/outfits/a_1.png" />
            <img id="outfits_a_2" src="../assets/image/characters/outfits/a_2.png" />
            <img id="outfits_a_3" src="../assets/image/characters/outfits/a_3.png" />
            <img id="outfits_a_4" src="../assets/image/characters/outfits/a_4.png" />
            <img id="outfits_b_0" src="../assets/image/characters/outfits/b_0.png" />
            <img id="outfits_c_0" src="../assets/image/characters/outfits/c_0.png" />
            <img id="outfits_d_0" src="../assets/image/characters/outfits/d_0.png" />
            <img id="outfits_d_1" src="../assets/image/characters/outfits/d_1.png" />
            <img id="outfits_d_2" src="../assets/image/characters/outfits/d_2.png" />
            <img id="outfits_e_0" src="../assets/image/characters/outfits/e_0.png" />

            <img id="forrest" src="../assets/image/scenes/forrest.png" />
            <img id="buttons" src="../assets/image/buttons.png" />
            <img id="smallButtons" src="../assets/image/small-buttons.png" />
            <img id="balloons" src="../assets/image/balloons.png" />
        </div>
  </div>
</template>

<script>

// HTML elements
let canvas
let tempCanvas
let context

let selectionEffect
let avatarsImage
let bodiesImage
let armsImage
let eyesImage
let hairstylesImage
let toolsImage
let outfitsImage
let animalsImage
let scenesImage
let buttons
let smallButtons
let effectsImage
// let balloons
let blockImages = {}

let webSocketMessageDetail = undefined
let userCode = undefined
let token = undefined
let blocks = undefined
let positions = {
  pointer: { x: undefined, y: undefined }
}
let onlineTimestamp = undefined

// eslint-disable-next-line no-unused-vars
let items = undefined
let playerInfos = undefined
let playerInfo = undefined
let sceneInfos = undefined
let sceneInfo = undefined
let relations = undefined
let chatMessages = []
let voiceMessages = []
// let members = []
let interactionInfo = undefined
// eslint-disable-next-line no-unused-vars

let webStage = 0
let regionInfo = undefined
let blockSize = 100
const minBlockSize = 10
const maxBlockSize = 200
const imageBlockSize = 100
let canvasMoveUse
const avatarSize = 100
const buttonSize = 50
const smallButtonSize = 25
// 大地图的最左上角的位置
let deltaWidth
let deltaHeight
const menuLeftEdge = 150
const menuRightEdge = 150
const menuTopEdge = 100
const menuBottomEdge = 300
const terminalLeftEdge = menuLeftEdge + 10
const terminalTopEdge = menuTopEdge + 10
let avatarPosition
let buttonPositions

let showChat = true
let scope = 0
let chatTo
let isChatting = false
let chatPosition
const MAX_MSG_LINE_NUM = 10
const MAX_MSG_LINE_HEIGHT = 400
const MSG_LINE_HEIGHT = 20

let recordButtonPosition
import Recorder from 'js-audio-recorder' //用于获取麦克风权限
import Recorderx, { ENCODE_TYPE } from 'recorderx' //用于录音
// import { onUnmounted } from 'vue'
const rc = new Recorderx()
let musicMuted = true
let soundMuted = true
let micIsPermitted = false
let micInUse = false
// let voiceInUse = false
const voiceEndDelay = 500

let useWheel = true
const wheel1Radius = 100
let wheel1Position
let handle1Position
const wheel2Radius = 100
let wheel2Position
let isKeyDown = { 0: false, 1: false, 2: false, 3: false, 10: false, 11: false, 12: false, 13: false } // left 4 + right 4
let status1Position
let status2Position
const MAX_STATUS_LINE_SIZE = 100
const STATUS_SIZE = 20

var intervalTimerInit
var intervalTimer20
var intervalTimer1000
var intervalTimer30000

let terminalOutputs = undefined

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
    selectionEffect = document.getElementById('selectionEffect')
    effectsImage = {
      'hitEffect': document.getElementById('hitEffect'),
      'upgradeEffect': document.getElementById('upgradeEffect'),
      'fireEffect': document.getElementById('fireEffect'),
      'explodeEffect': document.getElementById('explodeEffect'),
      'bleedEffect': document.getElementById('bleedEffect'),
      'waveEffect': document.getElementById('waveEffect'),
      'haloEffect': document.getElementById('haloEffect'),
      'healEffect': document.getElementById('healEffect'),
      'disturbEffect': document.getElementById('disturbEffect'),
      'sacrificeEffect': document.getElementById('sacrificeEffect'),
      'moraleHighEffect': document.getElementById('moraleHighEffect'),
      'moraleLowEffect': document.getElementById('moraleLowEffect'),
      'meleeScratchEffect': document.getElementById('meleeScratchEffect'),
      'meleeCleaveEffect': document.getElementById('meleeCleaveEffect'),
      'meleeStabEffect': document.getElementById('meleeStabEffect'),
      'sparkEffect': document.getElementById('sparkEffect')
    }
    animalsImage = [
      document.getElementById('paofu'),
      document.getElementById('frog'),
      document.getElementById('monkey'),
      document.getElementById('racoon'),
      document.getElementById('chicken')
    ]
    avatarsImage = document.getElementById('avatars')
    bodiesImage = [
      document.getElementById('body_c'),
      document.getElementById('body_m'),
      document.getElementById('body_a'),
      document.getElementById('body_l'),
      document.getElementById('body_b')
    ]
    armsImage = [
      document.getElementById('arms_c'),
      document.getElementById('arms_m'),
      document.getElementById('arms_a'),
      document.getElementById('arms_l'),
      document.getElementById('arms_b')
    ]
    eyesImage = document.getElementById('eyes')
    hairstylesImage = [
      document.getElementById('hairstyle_black'),
      document.getElementById('hairstyle_grey'),
      document.getElementById('hairstyle_orange')
    ]
    toolsImage = [
      document.getElementById('tools_s'),
      document.getElementById('tools_m'),
      document.getElementById('tools_l')
    ]
    outfitsImage = [
      [
        document.getElementById('outfits_a_0'), 
        document.getElementById('outfits_a_1'), 
        document.getElementById('outfits_a_2'), 
        document.getElementById('outfits_a_3'), 
        document.getElementById('outfits_a_4')
      ],
      [document.getElementById('outfits_b_0')],
      [document.getElementById('outfits_c_0')],
      [
        document.getElementById('outfits_d_0'), 
        document.getElementById('outfits_d_1'), 
        document.getElementById('outfits_d_2')
      ],
      [document.getElementById('outfits_e_0')]
    ]
    scenesImage = {
      'f': document.getElementById('forrest')
    }
    buttons = document.getElementById('buttons')
    smallButtons = document.getElementById('smallButtons')
    // balloons = document.getElementById('balloons')
    for (var blockImageId in this.$blockImageIds) {
      // img.src = "../static/image/blocks/" + this.$blockImageIds[blockImageId] + ".png"
      // img.src = this.$blockImages.get(this.$blockImageIds[blockImageId] + ".png")
      // var img = require("@/assets/image/blocks/" + this.$blockImageIds[blockImageId] + ".png")

      // var img = new Image()
      // img.src = this.$blockImages1000
      // blockImages[this.$blockImageIds[blockImageId]] = img

      var imgNode = document.createElement("img")
      imgNode.id = "blockImage" + this.$blockImageIds[blockImageId]
      imgNode.src = require("../assets/image/blocks/" + this.$blockImageIds[blockImageId] + ".png")
      // document.getElementById('hiddenDiv').appendChild(imgNode)
      blockImages[this.$blockImageIds[blockImageId]] = imgNode
    }
    intervalTimerInit = setInterval(() => {
      // This is the first timer.
      document.getElementById('loading').style.display = 'inline'
      let toLoad = 0
      let loaded = 0
      document.querySelector('p').innerHTML = '加载中...' + loaded + '/' + toLoad
      if (toLoad === loaded) {
        document.querySelector('p').innerHTML = '加载完毕'
        document.getElementById('loading').style.display = 'none'
        clearInterval(intervalTimerInit)
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
    async initWeb () {
      canvas = document.getElementById('canvas')
      tempCanvas = document.getElementById('temp-canvas')
      context = canvas.getContext('2d') // 设置2D渲染区域
      // canvas.addEventListener('contextmenu', function(e) {
        canvas.style.display = 'inline'
      //   e.preventDefault();
      // }) // 防止长按复制
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
      context.lineWidth = 5 // 设置线的宽度

      // Key listener 24/02/12
      document.addEventListener('keyup', this.keyUpEventHandler)
      document.addEventListener('keydown', this.keyDownEventHandler)
      document.getElementById('chat-content').addEventListener('keyup', this.keyUpChatEventHandler)
      document.getElementById('chat-content').addEventListener('focus', this.focusChatEventHandler)
      document.getElementById('chat-content').addEventListener('blur', this.blurChatEventHandler)

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
      document.getElementById('settings-blockSize').min = minBlockSize
      document.getElementById('settings-blockSize').max = maxBlockSize
      blockSize = Math.min(maxBlockSize, Math.max(minBlockSize, blockSize))
      document.getElementById('settings-blockSize').value = blockSize
      document.getElementById('settings-music').checked = !musicMuted
      document.getElementById('settings-sound').checked = !soundMuted

      this.initTimers()
    },
    keyUpEventHandler(event) {
      if ((canvasMoveUse !== this.$constants.MOVEMENT_STATE_IDLE && canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVING) || isChatting) {
        return
      }
      event.preventDefault()
      if (event.key === 'w' || event.key === 'W') {
        isKeyDown[0] = false
      } else if (event.key === 'a' || event.key === 'A') {
        isKeyDown[1] = false
      } else if (event.key === 'd' || event.key === 'D') {
        isKeyDown[2] = false
      } else if (event.key === 's' || event.key === 'S') {
        isKeyDown[3] = false
      } else if (event.key === 'ArrowUp') {
        isKeyDown[10] = false
      } else if (event.key === 'ArrowLeft') {
        isKeyDown[11] = false
      } else if (event.key === 'ArrowRight') {
        isKeyDown[12] = false
      } else if (event.key === 'ArrowDown') {
        isKeyDown[13] = false
      }
      if (playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING && !isKeyDown[0] && !isKeyDown[1] && !isKeyDown[2] && !isKeyDown[3]) {
        canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
        this.setHandlePosition(wheel1Position.x, wheel1Position.y)
      }
    },
    keyDownEventHandler(event) {
      if ((canvasMoveUse !== this.$constants.MOVEMENT_STATE_IDLE && canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVING) || isChatting) {
        return
      }
      event.preventDefault()
      if (event.key === 'w' || event.key === 'W') {
        isKeyDown[0] = true
      } else if (event.key === 'a' || event.key === 'A') {
        isKeyDown[1] = true
      } else if (event.key === 'd' || event.key === 'D') {
        isKeyDown[2] = true
      } else if (event.key === 's' || event.key === 'S') {
        isKeyDown[3] = true
      } else if (event.key === 'ArrowUp') {
        isKeyDown[10] = true
      } else if (event.key === 'ArrowLeft') {
        isKeyDown[11] = true
      } else if (event.key === 'ArrowRight') {
        isKeyDown[12] = true
      } else if (event.key === 'ArrowDown') {
        isKeyDown[13] = true
      }
    },
    keyUpChatEventHandler(event) {
      event.preventDefault()
      if (event.key === 'Enter') {
        this.sendMsg()
      }
    },
    focusChatEventHandler(event) {
      event.preventDefault()
      isChatting = true
    },
    blurChatEventHandler(event) {
      event.preventDefault()
      isChatting = false
    },
    initTimers () {
      // 需要定时执行的代码
      intervalTimer20 = setInterval(() => {
        // if (this.websocket.readyState === 1) {
          this.sendWebsocketMessage()
        // }
      }, 20)
      intervalTimer1000 = setInterval(() => {
        this.updateVoice()
      }, 1000)
      intervalTimer30000 = setInterval(() => {
        this.updateChat()
      }, 30000)
    },
    initWebSocket () {
      console.log('initWebSocket方法')
      this.resetWebSocketMessageDetail()
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
      this.shutDown()
    },
    webSocketMessage (e) {
      // 接收服务器返回的数据
      // console.log('服务器返回的消息长度', e.data.length)
      var response = JSON.parse(e.data)

      // Check usercode
      if (response.userCode != userCode) {
        console.log('Message is ignored due to wrong userCode.')
        return
      }

      // Check token
      if (response.token != token) {
        console.log('Log off due to invalid token.')
        this.logoff()
      }

      // Check timestamp
      if (this.isDef(playerInfo) && playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING && this.isDef(onlineTimestamp) && Number(response.timestamp) - onlineTimestamp > 5) {
        console.log('Connection lost.')
        this.logoff()
      } else {
        onlineTimestamp = Number(response.timestamp)
      }

      // Update status resources
      if (webStage == this.$constants.WEB_STAGE_START) {
        items = response.items
      }

      // Update infos
      playerInfos = response.playerInfos
      var originPlayerInfo = playerInfo
      playerInfo = playerInfos[userCode]

      if (webStage == this.$constants.WEB_STAGE_START) {
        this.initWeb()
        if (this.isDef(playerInfo) && playerInfo.playerStatus == this.$constants.PLAYER_STATUS_INIT) {
          // Character initialization
          this.prepareInitialization(playerInfo)
          webStage = this.$constants.WEB_STAGE_INITIALIZING
          canvasMoveUse = this.$constants.MOVEMENT_STATE_SET
        } else {
          webStage = this.$constants.WEB_STAGE_INITIALIZED
        }
      } else if (webStage == this.$constants.WEB_STAGE_INITIALIZING) {
        // Nothing
      } else if (webStage == this.$constants.WEB_STAGE_INITIALIZED) {
        playerInfo.regionNo = originPlayerInfo.regionNo
        playerInfo.sceneCoordinate = originPlayerInfo.sceneCoordinate
        playerInfo.coordinate = originPlayerInfo.coordinate
        playerInfo.speed = originPlayerInfo.speed
        playerInfo.faceDirection = originPlayerInfo.faceDirection
        // Without this, the figure will shake during the game 24/03/17
        playerInfo.playerStatus = this.$constants.PLAYER_STATUS_RUNNING
      }

      relations = response.relations

      // Flags
      for (var i in response.flags) {
        switch (response.flags[i]) {
          case this.$constants.FLAG_UPDATE_ITEMS:
            this.updateItems()
            break
          case this.$constants.FLAG_UPDATE_PRESERVED_ITEMS:
            this.updatePreservedItems()
            break
        }
      }

      // Update Map info
      var isRegionChanged = false
      if (!this.isDef(regionInfo) || regionInfo.regionNo != response.regionInfo.regionNo) {
        isRegionChanged = true
      }
      var isSceneChanged = isRegionChanged
      if (!this.isDef(sceneInfo) || sceneInfo.sceneCoordinate.x != response.sceneInfo.sceneCoordinate.x 
          || sceneInfo.sceneCoordinate.y != response.sceneInfo.sceneCoordinate.y) {
        isSceneChanged = true
      }
      if (isSceneChanged) {
        this.addChat('来到【'+ response.regionInfo.name + '-' + response.sceneInfo.name +'】')
      }
      sceneInfo = response.sceneInfo
      sceneInfos = response.sceneInfos
      regionInfo = response.regionInfo
      blocks = response.blocks

      // Check functions 24/03/17
      if (this.isDef(response.functions) && this.isDef(response.functions.createPlayerInfoInstance)) {
        this.prepareInitialization(response.functions.createPlayerInfoInstance)
      }

      // Check messages
      if (this.isDef(response.messages)) {
        for (let i = 0; i < response.messages.length; i++) {
          var message = response.messages[i]
          var fromUserCode = message.fromUserCode
          if (fromUserCode == userCode) {
            // Message from self has shown before
            continue
          }
          if (message.type == this.$constants.MESSAGE_TYPE_PRINTED) {
            var fromNickname = '[已离线]'
            if (this.isDef(playerInfos[fromUserCode])) {
              fromNickname = playerInfos[fromUserCode].nickname
            }
            if (message.scope === this.$constants.SCOPE_GLOBAL) {
              this.addChat(fromNickname + ':' + '[广播]' + message.content)
            } else if (message.scope === this.$constants.SCOPE_INDIVIDUAL) {
              this.addChat(fromNickname + ':' + message.content)
            } else if (message.scope === this.$constants.SCOPE_SELF) {
              this.addChat(message.content)
            }
          } else if (message.type == this.$constants.MESSAGE_TYPE_VOICE) {
            console.log('VOICE IN')
            voiceMessages.push(message.content)
          }
        }
      }

      // Check terminal output
      if (this.isDef(response.terminalOutputs)) {
        for (var j = 0; j < response.terminalOutputs.length; j++) {
          if (!this.isDef(response.terminalOutputs[j])) {
            continue
          }
          if (this.isDef(response.terminalOutputs[j].content)) {
            document.getElementById('terminal-text').value += '\n' + response.terminalOutputs[j].content
            document.getElementById('terminal-text').scrollTop = document.getElementById('terminal-text').scrollHeight
          } else {
            terminalOutputs = response.terminalOutputs[j]
          }
        }
      }

      // Check keyDown
      for (let i = 0; i <= 3; i++) {
        if (isKeyDown[i]) {
          this.wheelKeyDown(i)
        }
      }
      for (let i = 10; i <= 13; i++) {
        if (isKeyDown[i]) {
          this.wheelKeyDown(i)
        } else {
          this.wheelKeyUp(i)
        }
      }

      this.show()
      this.fixSceneCoordinate(playerInfo)
      // Update coordinates 24/03/06
      // settleSpeed() must be after show() to avoid abnormal display while changing scenes or regions
      positions.pointer.x += playerInfo.speed.x
      positions.pointer.y += playerInfo.speed.y
      if (canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVING 
      || playerInfo.buff[this.$constants.BUFF_CODE_DEAD] != 0
      || Math.pow(positions.pointer.x - playerInfo.coordinate.x, 2) + Math.pow(positions.pointer.y - playerInfo.coordinate.y, 2) < Math.pow(this.$constants.MIN_MOVE_DISTANCE_POINTER_PLAYER, 2)) {
        playerInfo.speed.x = 0
        playerInfo.speed.y = 0
      } else {
        this.settleSpeed(userCode, playerInfo)
        // Randomly get item
        if (Math.random() <= 0.01) {
          var timestamp = new Date().valueOf()
          if (timestamp % 150 < 150) {
            var itemName = this.$constants.ITEM_CHARACTER_JUNK
            if (timestamp % 150 + 1 < 10) {
              itemName += '00'
            } else if (timestamp % 150 + 1 < 100) {
              itemName += '0'
            }
            itemName += (timestamp % 150 + 1)
            this.getItems(itemName, 1)
            this.getPreservedItems('t101', 1)
            this.getPreservedItems('t201', 1)
            this.getPreservedItems('t202', 1)
            this.getPreservedItems('t203', 1)
            this.getPreservedItems('t204', 1)
            this.getPreservedItems('t205', 1)
            this.getPreservedItems('t226', 1)
            this.getPreservedItems('t227', 1)
            this.getPreservedItems('t006', 1)
            this.getPreservedItems('t007', 1)
            this.getPreservedItems('t008', 1)
            this.getPreservedItems('a001', 1)
            this.getPreservedItems('a002', 1)
            this.getPreservedItems('a003', 1)
            this.getPreservedItems('a004', 1)
            this.getPreservedItems('a005', 1)
            this.getPreservedItems('c001', 1)
            this.getPreservedItems('c002', 1)
            this.getPreservedItems('c003', 1)
            this.getPreservedItems('c004', 1)
            this.getPreservedItems('n001', 1)
            this.getPreservedItems('r001', 1)
          }
        }
      }
    },
    logoff () {
      console.log('Log off.')
      this.websocket.close()
      // this.shutDown()
    },
    sendWebsocketMessage () {
      // if (webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        // return
      // }
      this.websocket.send(JSON.stringify(webSocketMessageDetail))
      this.resetWebSocketMessageDetail()
      if (webStage !== this.$constants.WEB_STAGE_START) {
        if (!this.isDef(playerInfo) || playerInfo.playerStatus == this.$constants.PLAYER_STATUS_INIT) {
          webSocketMessageDetail.functions.updatePlayerInfo = playerInfo
        } else if (playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING) {
          webSocketMessageDetail.functions.updateMovingBlock = playerInfo
        }
      }
    },
    resetWebSocketMessageDetail () {
      webSocketMessageDetail = {
        webStage: webStage,
        userCode: userCode,
        state: 1,
        functions: {
          addMessages: [],
          addDrops: [],
          useDrop: undefined,
          setRelation: undefined,
          useItems: [],
          getItems: [],
          getPreservedItems: [],
          interactBlocks: [],
          addEvents: [],
          terminalInputs: [],
          useSkills: [false, false, false, false],
          createPlayerInfoInstance: undefined,
          updateMovingBlock: undefined,
          setMember: undefined
        },
      }
    },
    show () {
      context.clearRect(0, 0, canvas.width, canvas.height)
      deltaWidth = canvas.width / 2 - playerInfo.coordinate.x * blockSize
      deltaHeight = canvas.height / 2 - playerInfo.coordinate.y * blockSize
      var timestamp = new Date().valueOf()
  
      // Print blocks
      var blockToInteract = undefined
      var blockToInteractDistance = this.$constants.MIN_INTERACTION_DISTANCE + 1
      for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i]

        // Check drop
        if (block.type == this.$constants.BLOCK_TYPE_DROP && Math.pow(block.x - playerInfo.coordinate.x, 2) + Math.pow(block.y - playerInfo.coordinate.y, 2) <= Math.pow(this.$constants.MIN_DROP_INTERACTION_DISTANCE, 2)) {
          this.useDrop(block)
        }
        // Check interaction
        if (block.id != userCode && this.checkBlockTypeInteractive(block.type)) {
          if (useWheel) {
            var distance = Math.sqrt(Math.pow(block.x - playerInfo.coordinate.x, 2) + Math.pow(block.y - playerInfo.coordinate.y, 2))
            if (Math.abs(playerInfo.faceDirection - this.calculateAngle(block.x - playerInfo.coordinate.x, block.y - playerInfo.coordinate.y)) <= this.$constants.MIN_INTERACTION_ANGLE && distance <= this.$constants.MIN_INTERACTION_DISTANCE) {
              if ((!this.isDef(blockToInteract) || distance < blockToInteractDistance)) {
                blockToInteract = block
                blockToInteractDistance = distance
              }
            }
          } else {
            if (this.isDef(interactionInfo)) {
              if (block.type == interactionInfo.type && block.id == interactionInfo.id && block.code == interactionInfo.code) {
                context.drawImage(selectionEffect, Math.floor(timestamp / 100) % 10 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, 
                (block.x - 0.5) * blockSize + deltaWidth, 
                (block.y - 1) * blockSize + deltaHeight, 
                blockSize,
                blockSize)
                if (Math.pow(block.x - playerInfo.coordinate.x, 2) + Math.pow(block.y - playerInfo.coordinate.y, 2) > Math.pow(this.$constants.MIN_INTERACTION_DISTANCE, 2)) {
                  interactionInfo = undefined
                }
              }
              document.getElementById('interactions').style.display = 'inline'
            } else {
              document.getElementById('interactions').style.display = 'none'
            }
          }
        }
        if (block.type == this.$constants.BLOCK_TYPE_PLAYER) {
          this.drawCharacter(playerInfos[block.id], block.x - 0.5, block.y - 1, blockSize)
        } else {
          this.drawBlock(block)
        }
      }
      // Show interactions (new)
      if (useWheel) {
        if (this.isDef(blockToInteract) && (canvasMoveUse === this.$constants.MOVEMENT_STATE_IDLE || canvasMoveUse === this.$constants.MOVEMENT_STATE_MOVING || canvasMoveUse === this.$constants.MOVEMENT_STATE_USE)) {
          this.startInteraction(blockToInteract)
          context.drawImage(selectionEffect, Math.floor(timestamp / 100) % 10 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, 
          (blockToInteract.x - 0.5) * blockSize + deltaWidth, 
          (blockToInteract.y - 1) * blockSize + deltaHeight, 
          blockSize,
          blockSize)
          document.getElementById('interactions').style.display = 'inline'
        } else {
          document.getElementById('interactions').style.display = 'none'
        }
      }
      this.showOther()
    },
    showOther () {
      context.save()

      // Show avater
      this.drawAvatar(avatarPosition.x, avatarPosition.y, avatarSize / 2, avatarSize, playerInfo.avatar, playerInfo.nameColor)
      var topBossId = this.findTopBossId(userCode)
      if (this.isDef(topBossId) && topBossId != userCode) {
        this.drawAvatar(avatarPosition.x, avatarPosition.y, avatarSize / 2, avatarSize / 2, playerInfos[topBossId].avatar, playerInfos[topBossId].nameColor)
      }
      
      // Show buttons
      if (canvasMoveUse !== this.$constants.MOVEMENT_STATE_INFO) {
        context.drawImage(buttons, 0 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, buttonPositions[0].x, buttonPositions[0].y, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 0 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, buttonPositions[0].x, buttonPositions[0].y, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== this.$constants.MOVEMENT_STATE_BACKPACK) {
        context.drawImage(buttons, 1 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, buttonPositions[1].x, buttonPositions[1].y, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 1 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, buttonPositions[1].x, buttonPositions[1].y, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== this.$constants.MOVEMENT_STATE_MEMBERS) {
        context.drawImage(buttons, 2 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, buttonPositions[2].x, buttonPositions[2].y, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 2 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, buttonPositions[2].x, buttonPositions[2].y, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== this.$constants.MOVEMENT_STATE_SETTINGS) {
        context.drawImage(buttons, 3 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, buttonPositions[3].x, buttonPositions[3].y, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 3 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, buttonPositions[3].x, buttonPositions[3].y, buttonSize, buttonSize)
      }

      // Show status1
      if (this.isDef(playerInfo.nickname) && this.isDef(playerInfo.lastName) && this.isDef(playerInfo.firstName)) {
        this.printText('Lv.' + playerInfo.level + ' ' + playerInfo.nickname + '(' + playerInfo.lastName + ',' + playerInfo.firstName + ')', status1Position.x, status1Position.y + 1 * STATUS_SIZE, buttonSize * 5, 'left')
      } else {
        this.printText('Lv.' + playerInfo.level, status1Position.x, status1Position.y + 1 * STATUS_SIZE, STATUS_SIZE * 10, 'left')
      }
      this.printText('经验值' + playerInfo.exp + '/' + playerInfo.expMax, status1Position.x, status1Position.y + 2 * STATUS_SIZE, STATUS_SIZE * 10)
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      context.fillStyle = 'rgba(191, 191, 191, 0.5)'
      context.fillRect(status1Position.x, status1Position.y + 2.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * playerInfo.exp / playerInfo.expMax, STATUS_SIZE * 0.75)
      context.strokeRect(status1Position.x, status1Position.y + 2.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      
      // show status2
      this.printText('生命值' + playerInfo.hp + '/' + playerInfo.hpMax, status2Position.x, status2Position.y + 1 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      this.printText('活力值' + playerInfo.vp + '/' + playerInfo.vpMax, status2Position.x, status2Position.y + 3 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      this.printText('饥饿值' + playerInfo.hunger + '/' + playerInfo.hungerMax, status2Position.x, status2Position.y + 5 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      this.printText('口渴值' + playerInfo.thirst + '/' + playerInfo.thirstMax, status2Position.x, status2Position.y + 7 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      context.fillStyle = 'rgba(191, 191, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 1.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * playerInfo.hp / playerInfo.hpMax, STATUS_SIZE * 0.75)
      context.fillStyle = 'rgba(0, 191, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 3.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * playerInfo.vp / playerInfo.vpMax, STATUS_SIZE * 0.75)
      context.fillStyle = 'rgba(191, 0, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 5.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * playerInfo.hunger / playerInfo.hungerMax, STATUS_SIZE * 0.75)
      context.fillStyle = 'rgba(0, 0, 191, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 7.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * playerInfo.thirst / playerInfo.thirstMax, STATUS_SIZE * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 1.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 3.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 5.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 7.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      var index = 1.5
      for (var i = this.$constants.BUFF_CODE_DEAD; i < this.$constants.BUFF_CODE_LENGTH; i++) {
        if (playerInfo.buff[i] != 0) {
          context.drawImage(smallButtons, i * smallButtonSize, 2 * smallButtonSize, smallButtonSize, smallButtonSize, canvas.width - index * smallButtonSize, status2Position.y + 8 * STATUS_SIZE + 0.5 * smallButtonSize, smallButtonSize, smallButtonSize)
          index++
          if (i == this.$constants.BUFF_CODE_DEAD) {
            this.quitInteraction()
          }
        }
      }

      // Show chat
      if (showChat) {
        document.getElementById('chat-scope').value = '[广播]'
        if (scope === this.$constants.SCOPE_INDIVIDUAL) {
          for (var playerInfoIndex in playerInfos) {
            if (playerInfos[playerInfoIndex].id == chatTo) {
              document.getElementById('chat-scope').value = 'To:' + playerInfos[playerInfoIndex].nickname
            }
          }
        }
        if (canvasMoveUse !== this.$constants.MOVEMENT_STATE_RECORDER) {
          context.drawImage(smallButtons, 0 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, recordButtonPosition.x, recordButtonPosition.y, smallButtonSize, smallButtonSize)
        } else {
          context.drawImage(smallButtons, 0 * smallButtonSize, 1 * smallButtonSize, smallButtonSize, smallButtonSize, recordButtonPosition.x, recordButtonPosition.y, smallButtonSize, smallButtonSize)
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
      // document.getElementById('terminal').style.display = 'none'
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_INFO) {
        this.printMenu()
        this.printStatus()
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_BACKPACK) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-choose').style.display = 'inline'
        document.getElementById('items-remove').style.display = 'inline'
        this.printMenu()
        this.printItems()
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_SETTINGS) {
        document.getElementById('settings').style.display = 'inline'
        this.printMenu()
        this.printSettings()
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_EXCHANGE) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-choose').style.display = 'none'
        document.getElementById('items-remove').style.display = 'none'
        document.getElementById('items-exchange').style.display = 'inline'
        this.printMenu()
        this.printExchange()
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_USE) {
        if (this.isDef(interactionInfo) && interactionInfo.type == this.$constants.BLOCK_TYPE_GAME) {
          this.printMenu()
          document.getElementById('terminal').style.display = 'inline'
          this.printTerminal(terminalOutputs, imageBlockSize, blockSize)
        } else {
          document.getElementById('terminal').style.display = 'none'
        }
      } else {
        document.getElementById('terminal').style.display = 'none'
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_SET) {
        document.getElementById('initialization').style.display = 'inline'
        this.printMenu()
        this.printInitialization()
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_MEMBERS) {
        document.getElementById('members').style.display = 'inline'
        this.printMenu()
        this.printMembers()
      }
    
      context.restore()

      var timestamp = new Date().valueOf()
      if (useWheel) {
        // Show wheel1
        context.save()
        context.fillStyle = 'rgba(127, 127, 127, 0.5)'
        context.beginPath()
        context.arc(wheel1Position.x, wheel1Position.y, wheel1Radius, 0, 2 * Math.PI)
        context.fill()
        context.fillStyle = 'rgba(63, 63, 63, 0.75)'
        context.beginPath()
        context.arc(handle1Position.x, handle1Position.y, wheel1Radius / 2, 0, 2 * Math.PI)
        context.fill()
        context.fillStyle = 'rgba(127, 127, 127, 0.75)'
        context.beginPath()
        context.arc(handle1Position.x, handle1Position.y, wheel1Radius * 0.45, 0, 2 * Math.PI)
        context.fill()
        context.restore()

        // Show wheel2
        context.save()
        context.fillStyle = 'rgba(127, 127, 127, 0.75)'
        context.beginPath()
        context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, 0, 2 * Math.PI)
        context.fill()
        context.restore()

        context.save()
        if (isKeyDown[10]) {
          context.fillStyle = 'rgba(255, 255, 255, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, 1.25 * Math.PI, 1.75 * Math.PI)
          context.fill()
        } else {
          context.fillStyle = 'rgba(0, 0, 0, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * Math.max(0, playerInfo.skill[0][2]) / playerInfo.skill[0][3], 1.25 * Math.PI, 1.75 * Math.PI)
          context.fill()
        }
        if (isKeyDown[11]) {
          context.fillStyle = 'rgba(255, 255, 255, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, 0.75 * Math.PI, 1.25 * Math.PI)
          context.fill()
        } else {
          context.fillStyle = 'rgba(0, 0, 0, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * Math.max(0, playerInfo.skill[1][2]) / playerInfo.skill[1][3], 0.75 * Math.PI, 1.25 * Math.PI)
          context.fill()
        }
        if (isKeyDown[12]) {
          context.fillStyle = 'rgba(255, 255, 255, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, -0.25 * Math.PI, 0.25 * Math.PI)
          context.fill()
        } else {
          context.fillStyle = 'rgba(0, 0, 0, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * Math.max(0, playerInfo.skill[2][2]) / playerInfo.skill[2][3], -0.25 * Math.PI, 0.25 * Math.PI)
          context.fill()
        }
        if (isKeyDown[13]) {
          context.fillStyle = 'rgba(255, 255, 255, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, 0.25 * Math.PI, 0.75 * Math.PI)
          context.fill()
        } else {
          context.fillStyle = 'rgba(0, 0, 0, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * Math.max(0, playerInfo.skill[3][2]) / playerInfo.skill[3][3], 0.25 * Math.PI, 0.75 * Math.PI)
          context.fill()
        }
        context.restore()

        context.save()
        context.strokeStyle = 'rgba(63, 63, 63, 0.75)'
        context.beginPath()
        context.moveTo(wheel2Position.x - Math.sqrt(0.5) * wheel2Radius, wheel2Position.y + Math.sqrt(0.5) * wheel2Radius)
        context.lineTo(wheel2Position.x + Math.sqrt(0.5) * wheel2Radius, wheel2Position.y - Math.sqrt(0.5) * wheel2Radius)
        context.moveTo(wheel2Position.x - Math.sqrt(0.5) * wheel2Radius, wheel2Position.y - Math.sqrt(0.5) * wheel2Radius)
        context.lineTo(wheel2Position.x + Math.sqrt(0.5) * wheel2Radius, wheel2Position.y + Math.sqrt(0.5) * wheel2Radius)
        context.stroke()
        context.restore()

        context.save()
        context.fillStyle = 'rgba(63, 63, 63, 0.75)'
        context.beginPath()
        context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * 0.1, 0, 2 * Math.PI)
        context.fill()
        context.fillStyle = 'rgba(127, 127, 127, 0.75)'
        context.beginPath()
        context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * 0.05, 0, 2 * Math.PI)
        context.fill()
        context.restore()

        this.printText(this.generateSkillName(playerInfo.skill[0]), wheel2Position.x, wheel2Position.y - wheel2Radius * 0.5, wheel2Radius * 0.5, 'center')
        this.printText(this.generateSkillName(playerInfo.skill[1]), wheel2Position.x - wheel2Radius * 0.6, wheel2Position.y, wheel2Radius * 0.5, 'center')
        this.printText(this.generateSkillName(playerInfo.skill[2]), wheel2Position.x + wheel2Radius * 0.6, wheel2Position.y, wheel2Radius * 0.5, 'center')
        this.printText(this.generateSkillName(playerInfo.skill[3]), wheel2Position.x, wheel2Position.y + wheel2Radius * 0.5, wheel2Radius * 0.5, 'center')

        // Show sight
        context.save()
        context.lineWidth = blockSize * (100 + timestamp % 900) / 1000
        context.strokeStyle = 'rgba(255, 255, 255, 0.25)'
        context.beginPath()
        context.arc((playerInfo.coordinate.x + 1.5 * Math.cos(playerInfo.faceDirection / 180 * Math.PI)) * blockSize + deltaWidth, (playerInfo.coordinate.y - 2 * Math.sin(playerInfo.faceDirection / 180 * Math.PI)) * blockSize + deltaHeight, 1, 0, 2 * Math.PI)
        context.stroke()
        context.restore()
      } else {
        // Show pointer
        context.save()
        context.lineWidth = blockSize * (100 + timestamp % 900) / 1000
        context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
        context.beginPath()
        context.arc(positions.pointer.x - (document.documentElement.scrollLeft - deltaWidth), positions.pointer.y - (document.documentElement.scrollTop - deltaHeight), 1, 0, 2 * Math.PI)
        context.stroke()
        context.restore()
      }
    },
    generateSkillName (skill) {
      var rst = ''
      switch (skill[0]) {
        case this.$constants.SKILL_CODE_BLOCK:
        rst += 'Block'
        break
        case this.$constants.SKILL_CODE_HEAL:
        rst += 'Heal'
        break
        case this.$constants.SKILL_CODE_CURSE:
        rst += 'Curse'
        break
        case this.$constants.SKILL_CODE_CHEER:
        rst += 'Cheer'
        break
        case this.$constants.SKILL_CODE_MELEE_HIT:
        rst += 'Hit'
        break
        case this.$constants.SKILL_CODE_MELEE_KICK:
        rst += 'Kick'
        break
        case this.$constants.SKILL_CODE_MELEE_SCRATCH:
        rst += 'Scratch'
        break
        case this.$constants.SKILL_CODE_MELEE_CLEAVE:
        rst += 'Cleave'
        break
        case this.$constants.SKILL_CODE_MELEE_STAB:
        rst += 'Stab'
        break
        case this.$constants.SKILL_CODE_SHOOT_HIT:
        case this.$constants.SKILL_CODE_SHOOT_ARROW:
        case this.$constants.SKILL_CODE_SHOOT_GUN:
        case this.$constants.SKILL_CODE_SHOOT_SHOTGUN:
        case this.$constants.SKILL_CODE_SHOOT_MAGNUM:
        case this.$constants.SKILL_CODE_SHOOT_ROCKET:
        rst += 'Shoot'
        break
      }
      switch (skill[1]) {
        case this.$constants.SKILL_MODE_SEMI_AUTO:
        break
        case this.$constants.SKILL_MODE_AUTO:
        rst += '(A)'
        break
      }
      return rst
    },
    prepareInitializationRandomly () {
      webSocketMessageDetail.functions.createPlayerInfoInstance = true
    },
    prepareInitialization (playerInfoTemp) {
      document.getElementById('initialization-nickname').value = playerInfoTemp.nickname
      document.getElementById('initialization-lastName').value = playerInfoTemp.lastName
      document.getElementById('initialization-firstName').value = playerInfoTemp.firstName
      document.getElementById('initialization-nameColor').value = playerInfoTemp.nameColor
      document.getElementById('initialization-avatar').value = playerInfoTemp.avatar
      for (let i = 0; i < document.getElementById('initialization-creature').options.length; i++) {
        if (document.getElementById('initialization-creature').options[i].value == playerInfoTemp.creature) {
          document.getElementById('initialization-creature').options[i].selected = true
        }
      }
      this.updateInitializationSkinColor()
      for (let i = 0; i < document.getElementById('initialization-skinColor').options.length; i++) {
        if (document.getElementById('initialization-skinColor').options[i].value == playerInfoTemp.skinColor) {
          document.getElementById('initialization-skinColor').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-gender').options.length; i++) {
        if (document.getElementById('initialization-gender').options[i].value == playerInfoTemp.gender) {
          document.getElementById('initialization-gender').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-hairstyle').options.length; i++) {
        if (document.getElementById('initialization-hairstyle').options[i].value == playerInfoTemp.hairstyle) {
          document.getElementById('initialization-hairstyle').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-hairColor').options.length; i++) {
        if (document.getElementById('initialization-hairColor').options[i].value == playerInfoTemp.hairColor) {
          document.getElementById('initialization-hairColor').options[i].selected = true
        }
      }
      for (let i = 0; i < document.getElementById('initialization-eyes').options.length; i++) {
        if (document.getElementById('initialization-eyes').options[i].value == playerInfoTemp.eyes) {
          document.getElementById('initialization-eyes').options[i].selected = true
        }
      }
      if (this.isDef(playerInfoTemp.faceCoefs)) {
        for (let i = 0; i < this.$constants.FACE_COEFS_LENGTH; i++) {
          document.getElementById('initialization-coefs-' + (i + 1)).value = playerInfoTemp.faceCoefs[i]
        }
      }
    },
    printInitialization () { 
      var timestamp = new Date().valueOf()
      // Left character
      var playerInfoTemp
      if (this.isDef(playerInfo) && playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING) {
        playerInfoTemp = Object.assign({}, playerInfo)
        playerInfoTemp.speed = {
          x: Math.sin(timestamp % 4000 * Math.PI * 2 / 4000),
          y: Math.cos(timestamp % 4000 * Math.PI * 2 / 4000)
        }
        playerInfoTemp.faceDirection = this.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
        playerInfoTemp.outfits = ['a001']
        this.drawCharacter(playerInfoTemp, (menuLeftEdge + 110 - deltaWidth) / blockSize, (menuTopEdge + 70 - deltaHeight) / blockSize, imageBlockSize)
        playerInfoTemp.speed = { x:0, y:0 }
        playerInfoTemp.faceDirection = 270
        this.drawCharacter(playerInfoTemp, (menuLeftEdge + 10 - deltaWidth) / blockSize, (menuTopEdge + 70 - deltaHeight) / blockSize, imageBlockSize)
      }
      // Right character
      playerInfoTemp = {
        id: userCode,
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
        avatar: document.getElementById('initialization-avatar').value,
        speed: {
          x: Math.sin(timestamp % 4000 * Math.PI * 2 / 4000),
          y: Math.cos(timestamp % 4000 * Math.PI * 2 / 4000)
        },
        outfits: ['a001']
      }
      playerInfoTemp.faceDirection = this.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
      playerInfoTemp.faceCoefs = []
      for (let i = 0; i < this.$constants.FACE_COEFS_LENGTH; i++) {
        playerInfoTemp.faceCoefs[i] = document.getElementById('initialization-coefs-' + (i + 1)).value
      }
      this.drawCharacter(playerInfoTemp, (menuLeftEdge + 320 - deltaWidth) / blockSize, (menuTopEdge + 70 - deltaHeight) / blockSize, imageBlockSize)
      playerInfoTemp.speed = { x:0, y:0 }
      playerInfoTemp.faceDirection = 270
      this.drawCharacter(playerInfoTemp, (menuLeftEdge + 220 - deltaWidth) / blockSize, (menuTopEdge + 70 - deltaHeight) / blockSize, imageBlockSize)
    },
    updateInitializationSkinColor () {
      document.getElementById('initialization-skinColor').length = 0
      if (document.getElementById('initialization-creature').value == 1) {
        document.getElementById('initialization-skinColor').options.add(new Option('C型', 1))
        document.getElementById('initialization-skinColor').options.add(new Option('M型', 2))
        document.getElementById('initialization-skinColor').options.add(new Option('A型', 3))
        document.getElementById('initialization-skinColor').options.add(new Option('L型', 4))
        document.getElementById('initialization-skinColor').options.add(new Option('B型', 5))
      } else if (document.getElementById('initialization-creature').value == 2) {
        document.getElementById('initialization-skinColor').options.add(new Option('香香软软的小泡芙', 1))
        document.getElementById('initialization-skinColor').options.add(new Option('小青蛙', 2))
        document.getElementById('initialization-skinColor').options.add(new Option('小猴子', 3))
        document.getElementById('initialization-skinColor').options.add(new Option('小浣熊', 4))
        document.getElementById('initialization-skinColor').options.add(new Option('小公鸡', 5))
      }
    },
    printMenu () {
      context.save()
      context.fillStyle = 'rgba(191, 191, 191, 0.75)'
      context.fillRect(menuLeftEdge, menuTopEdge, canvas.width - menuLeftEdge - menuRightEdge, canvas.height - menuTopEdge - menuBottomEdge)
      context.restore()
      if (canvasMoveUse !== this.$constants.MOVEMENT_STATE_SET || playerInfo.playerStatus !== this.$constants.PLAYER_STATUS_INIT) {
        context.drawImage(smallButtons, 1 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, canvas.width - menuRightEdge - smallButtonSize, menuTopEdge, smallButtonSize, smallButtonSize)
      }
    },
    printExchange () {
      this.printText(Number(playerInfo.capacity) + '/' + Number(playerInfo.capacityMax) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100, 'left')
      this.printText('$' + playerInfo.money, menuLeftEdge + 110, menuTopEdge + 20, 50, 'left')
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50, 'left')
      this.printText(document.getElementById('items-exchange-range').value, menuLeftEdge + 330, menuTopEdge + 125, 50, 'left')
    },
    printStatus () {
      var positionY = menuTopEdge + 20
      this.printText(playerInfo.nickname + ' (' + playerInfo.lastName + ', ' + playerInfo.firstName + ')', menuLeftEdge + 10, positionY, buttonSize * 5, playerInfo.nameColor, 'left')
      positionY += 20
      this.printText('当前位置:' + regionInfo.name + '-' + sceneInfo.name, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('Lv.' + playerInfo.level + ' 经验值' + playerInfo.exp + '/' + playerInfo.expMax, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('生命值' + playerInfo.hp + '/' + playerInfo.hpMax, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('活力值' + playerInfo.vp + '/' + playerInfo.vpMax, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('饥饿值' + playerInfo.hunger + '/' + playerInfo.hungerMax, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('口渴值' + playerInfo.thirst + '/' + playerInfo.thirstMax, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('$' + playerInfo.money + ' 负重' + Number(playerInfo.capacity) + '/' + Number(playerInfo.capacityMax) + '(kg)', menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      var buffStr = '特殊状态 '
      var hasBuff = false
      if (playerInfo.buff[this.$constants.BUFF_CODE_DEAD] != 0) {
        hasBuff = true
        buffStr += '死亡 '
      }
      if (playerInfo.buff[this.$constants.BUFF_CODE_STUNNED] != 0) {
        hasBuff = true
        buffStr += '昏迷 '
      }
      if (playerInfo.buff[this.$constants.BUFF_CODE_BLEEDING] != 0) {
        hasBuff = true
        buffStr += '流血 '
      }
      if (playerInfo.buff[this.$constants.BUFF_CODE_SICK] != 0) {
        hasBuff = true
        buffStr += '疾病 '
      }
      if (playerInfo.buff[this.$constants.BUFF_CODE_FRACTURED] != 0) {
        hasBuff = true
        buffStr += '骨折 '
      }
      if (playerInfo.buff[this.$constants.BUFF_CODE_HUNGRY] != 0) {
        hasBuff = true
        buffStr += '饥饿 '
      }
      if (playerInfo.buff[this.$constants.BUFF_CODE_THIRSTY] != 0) {
        hasBuff = true
        buffStr += '口渴 '
      }
      if (playerInfo.buff[this.$constants.BUFF_CODE_FATIGUED] != 0) {
        hasBuff = true
        buffStr += '疲惫 '
      }
      if (playerInfo.buff[this.$constants.BUFF_CODE_BLIND] != 0) {
        hasBuff = true
        buffStr += '失明 '
      }
      if (!hasBuff) {
        buffStr += '无'
      }
      this.printText(buffStr, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
    },
    printItems () {
      this.printText(Number(playerInfo.capacity) + '/' + Number(playerInfo.capacityMax) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100, 'left')
      this.printText('$' + playerInfo.money, menuLeftEdge + 110, menuTopEdge + 20, 50, 'left')
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50, 'left')
      // this.displayItems()
    },
    printMembers () {
      var tree = []
      var member = playerInfo
      while (this.isDef(member)) {
        tree.push(member.nickname + ' (' + member.lastName + ', ' + member.firstName + ') Lv.' + member.level)
        if (this.isDef(member.bossId) && member.bossId != member.id) {
          member = playerInfos[member.bossId]
        } else {
          member = undefined
        }
      }
      var positionY = menuTopEdge + 20
      if (tree.length == 1) {
        this.printText('[玩家]' + tree[0], menuLeftEdge + 10, positionY, buttonSize * 5, playerInfo.nameColor, 'left')
        positionY += 20
      } else {
        for (var i = tree.length - 1; i >= 0; i--) {
          if (i == 0) {
            this.printText('[玩家]' + tree[i], menuLeftEdge + 10, positionY, buttonSize * 5, playerInfo.nameColor, 'left')
          } else {
            this.printText('[' + i + '级领导]' + tree[i], menuLeftEdge + 10, positionY, buttonSize * 5, playerInfo.nameColor, 'left')
          }
          positionY += 20
        }
      }
    },
    printSettings () {
      this.printText('缩放: ' + Math.round(blockSize / maxBlockSize * 100) + '%', menuLeftEdge + 140, menuTopEdge + 75, 100, 'left')
      this.printText('音乐', menuLeftEdge + 40, menuTopEdge + 125, 50, 'left')
      this.printText('音效', menuLeftEdge + 140, menuTopEdge + 125, 50, 'left')
      blockSize = Number(document.getElementById('settings-blockSize').value)
      musicMuted = !document.getElementById('settings-music').checked
      soundMuted = !document.getElementById('settings-sound').checked
    },
    printTerminal () {
      if (!this.isDef(terminalOutputs)) {
        return
      }
      if (terminalOutputs.terminalType == this.$constants.TERMINAL_TYPE_GAME && terminalOutputs.gameType == this.$constants.GAME_TYPE_LAS_VEGAS) {
        var index = 0
        for (var casinoNo in terminalOutputs.casinos) {
          context.drawImage(blockImages[3022], 0, 0, imageBlockSize, imageBlockSize, terminalLeftEdge, terminalTopEdge + index * blockSize / 2, blockSize / 4, blockSize / 4)
          var casinoImageX, casinoImageY
          switch (terminalOutputs.casinos[casinoNo].casinoNo) {
            case 1:
              casinoImageX = imageBlockSize * 1 / 4
              casinoImageY = imageBlockSize * 2 / 4
              break
            case 2:
              casinoImageX = imageBlockSize * 2 / 4
              casinoImageY = imageBlockSize * 2 / 4
              break
            case 3:
              casinoImageX = imageBlockSize * 3 / 4
              casinoImageY = imageBlockSize * 2 / 4
              break
            case 4:
              casinoImageX = imageBlockSize * 0 / 4
              casinoImageY = imageBlockSize * 3 / 4
              break
            case 5:
              casinoImageX = imageBlockSize * 1 / 4
              casinoImageY = imageBlockSize * 3 / 4
              break
            case 6:
              casinoImageX = imageBlockSize * 2 / 4
              casinoImageY = imageBlockSize * 3 / 4
              break
          }
          context.drawImage(blockImages[3023], casinoImageX, casinoImageY, imageBlockSize / 4, imageBlockSize / 4, terminalLeftEdge, terminalTopEdge + index * blockSize / 2, blockSize / 4, blockSize / 4)
          var cashIndex = 0
          for (var cash in terminalOutputs.casinos[casinoNo].cashQueue) {
            this.printText(terminalOutputs.casinos[casinoNo].cashQueue[cash].value, terminalLeftEdge + blockSize / 2 + cashIndex * 50, terminalTopEdge + (index + 0.25) * blockSize / 2, 50, 'left')
            cashIndex++
          }
          var diceIndex = 0
          for (var dice in terminalOutputs.casinos[casinoNo].diceMap) {
            var playerImageX, playerImageY
            switch (dice) {
              case 1:
                playerImageX = imageBlockSize * 0 / 4
                playerImageY = imageBlockSize * 0 / 4
                break
              case 2:
                playerImageX = imageBlockSize * 1 / 4
                playerImageY = imageBlockSize * 0 / 4
                break
              case 3:
                playerImageX = imageBlockSize * 2 / 4
                playerImageY = imageBlockSize * 0 / 4
                break
              case 4:
                playerImageX = imageBlockSize * 3 / 4
                playerImageY = imageBlockSize * 0 / 4
                break
              case 5:
                playerImageX = imageBlockSize * 0 / 4
                playerImageY = imageBlockSize * 1 / 4
                break
              case 6:
                playerImageX = imageBlockSize * 1 / 4
                playerImageY = imageBlockSize * 1 / 4
                break
              case 7:
                playerImageX = imageBlockSize * 2 / 4
                playerImageY = imageBlockSize * 1 / 4
                break
              case 8:
                playerImageX = imageBlockSize * 3 / 4
                playerImageY = imageBlockSize * 1 / 4
                break
            }
            for (var i = 0; i < terminalOutputs.casinos[casinoNo].diceMap[dice]; i++) {
              context.drawImage(blockImages[3023], playerImageX, playerImageY, imageBlockSize / 4, imageBlockSize / 4, terminalLeftEdge + diceIndex * blockSize / 4, terminalTopEdge + (index + 0.5) * blockSize / 2, blockSize / 4, blockSize / 4)
              context.drawImage(blockImages[3023], casinoImageX, casinoImageY, imageBlockSize / 4, imageBlockSize / 4, terminalLeftEdge + diceIndex * blockSize / 4, terminalTopEdge + (index + 0.5) * blockSize / 2, blockSize / 4, blockSize / 4)
              diceIndex++
            }
          }
          index++
        }
        index = 0
        for (var player in terminalOutputs.players) {
          this.printText(terminalOutputs.players[player].name + '(' + terminalOutputs.players[player].money + ')', terminalLeftEdge, terminalTopEdge + (index + 0.25 + 6) * blockSize / 2, 100, 'left')
          switch (player) {
            case 1:
                playerImageX = imageBlockSize * 0 / 4
                playerImageY = imageBlockSize * 0 / 4
                break
              case 2:
                playerImageX = imageBlockSize * 1 / 4
                playerImageY = imageBlockSize * 0 / 4
                break
              case 3:
                playerImageX = imageBlockSize * 2 / 4
                playerImageY = imageBlockSize * 0 / 4
                break
              case 4:
                playerImageX = imageBlockSize * 3 / 4
                playerImageY = imageBlockSize * 0 / 4
                break
              case 5:
                playerImageX = imageBlockSize * 0 / 4
                playerImageY = imageBlockSize * 1 / 4
                break
              case 6:
                playerImageX = imageBlockSize * 1 / 4
                playerImageY = imageBlockSize * 1 / 4
                break
              case 7:
                playerImageX = imageBlockSize * 2 / 4
                playerImageY = imageBlockSize * 1 / 4
                break
              case 8:
                playerImageX = imageBlockSize * 3 / 4
                playerImageY = imageBlockSize * 1 / 4
                break
          }
          diceIndex = 0
          for (dice in terminalOutputs.players.diceQueue) {
            switch (terminalOutputs.players[player].diceQueue[dice].point) {
              case 1:
                casinoImageX = imageBlockSize * 1 / 4
                casinoImageY = imageBlockSize * 2 / 4
                break
              case 2:
                casinoImageX = imageBlockSize * 2 / 4
                casinoImageY = imageBlockSize * 2 / 4
                break
              case 3:
                casinoImageX = imageBlockSize * 3 / 4
                casinoImageY = imageBlockSize * 2 / 4
                break
              case 4:
                casinoImageX = imageBlockSize * 0 / 4
                casinoImageY = imageBlockSize * 3 / 4
                break
              case 5:
                casinoImageX = imageBlockSize * 1 / 4
                casinoImageY = imageBlockSize * 3 / 4
                break
              case 6:
                casinoImageX = imageBlockSize * 2 / 4
                casinoImageY = imageBlockSize * 3 / 4
                break
            }
            context.drawImage(blockImages[3023], playerImageX, playerImageY, imageBlockSize / 4, imageBlockSize / 4, terminalLeftEdge + diceIndex * blockSize / 4, terminalTopEdge + (index + 0.5 + 6) * blockSize / 2, blockSize / 4, blockSize / 4)
            context.drawImage(blockImages[3023], casinoImageX, casinoImageY, imageBlockSize / 4, imageBlockSize / 4, terminalLeftEdge + diceIndex * blockSize / 4, terminalTopEdge + (index + 0.5 + 6) * blockSize / 2, blockSize / 4, blockSize / 4)
            diceIndex++
          }
        }
      }
    },
    useItem () {
      var itemNo = document.getElementById('items-name').value
      if (!this.isDef(playerInfo.items[itemNo]) || playerInfo.items[itemNo] <= 0) {
        return
      }
      var itemAmount = Math.min(playerInfo.items[itemNo], Number(document.getElementById('items-range').value))
      if (itemAmount <= 0) {
        return
      }
      this.useItems(itemNo, itemAmount)
    },
    useItems (itemNo, itemAmount) {
      webSocketMessageDetail.functions.useItems.push({ itemNo: itemNo, itemAmount: itemAmount })
    },
    getItems (itemNo, itemAmount) {
      webSocketMessageDetail.functions.getItems.push({ itemNo: itemNo, itemAmount: itemAmount })
    },
    getPreservedItems (itemNo, itemAmount) {
      webSocketMessageDetail.functions.getPreservedItems.push({ itemNo: itemNo, itemAmount: itemAmount })
    },
    addDrop () {
      var itemAmount = Number(document.getElementById('items-range').value)
      if (itemAmount <= 0) {
        return
      }
      var itemNo = document.getElementById('items-name').value
      webSocketMessageDetail.functions.addDrops.push({
        itemNo: itemNo, 
        itemAmount: itemAmount
      })
    },
    exchangeItemForward () {
      var itemAmount = Number(document.getElementById('items-range').value)
      if (itemAmount <= 0) {
        return
      }
      var itemNo = document.getElementById('items-name').value
      this.getItems(itemNo, -1 * itemAmount)
      this.getPreservedItems(itemNo, itemAmount)
    },
    exchangeItemBackward () {
      var itemAmount = Number(document.getElementById('items-exchange-range').value)
      if (itemAmount <= 0) {
        return
      }
      var itemNo = document.getElementById('items-exchange-name').value
      this.getItems(itemNo, itemAmount)
      this.getPreservedItems(itemNo, -1 * itemAmount)
    },
    updateItems () {
      var checkValue = document.getElementById('items-name').value
      // playerInfo.capacity = 0
      document.getElementById('items-name').length = 0
      if (!this.isDef(playerInfo.items)) {
        return
      }
      for (var itemNo in playerInfo.items) {
        var itemAmount = playerInfo.items[itemNo]
        if (!this.isDef(itemAmount) || itemAmount === 0) {
          continue
        }
        var item = items[itemNo]
        switch (itemNo.charAt(0)) {
          case this.$constants.ITEM_CHARACTER_TOOL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              if (this.isDef(playerInfo.tools) && playerInfo.tools.length > 0 && playerInfo.tools.includes(itemNo)) {
                document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case this.$constants.ITEM_CHARACTER_OUTFIT:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.isDef(playerInfo.outfits) && playerInfo.outfits.length > 0 && playerInfo.outfits.includes(itemNo)) {
                      document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case this.$constants.ITEM_CHARACTER_CONSUMABLE:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case this.$constants.ITEM_CHARACTER_MATERIAL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option('○[材料]' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case this.$constants.ITEM_CHARACTER_JUNK:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case this.$constants.ITEM_CHARACTER_NOTE:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case this.$constants.ITEM_CHARACTER_RECORDING:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
        }
      }
      document.getElementById('items-desc').value = ''
      if (document.getElementById('items-name').options.length > 0) {
        for (let i = 0; i < document.getElementById('items-name').options.length; i++){
          if (document.getElementById('items-name').options[i].value == checkValue) {
            document.getElementById('items-name').options[i].selected = true
          }
        }
        item = items[document.getElementById('items-name').value]
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_TOOL) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_OUTFIT) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_CONSUMABLE) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_MATERIAL || document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_JUNK) {
          document.getElementById('items-desc').value = item.description
          if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_JUNK) {
            document.getElementById('items-desc').value += '\n可拆解材料： '
            for (let material in item.materials) {
              document.getElementById('items-desc').value += '\n' + items[material].name + '(' + item.materials[material] + ')'
            }
          }
        }
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_NOTE) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_RECORDING) {
          document.getElementById('items-desc').value = item.description
        }
        document.getElementById('items-range').min = 1
        document.getElementById('items-range').max = playerInfo.items[document.getElementById('items-name').value]
        // document.getElementById('items-range').value = Math.min(document.getElementById('items-range').value, document.getElementById('items-range').max)
      } else {
        document.getElementById('items-range').min = 0
        document.getElementById('items-range').max = 0
        // document.getElementById('items-range').value = 0
      }
    },
    updatePreservedItems () {
      var checkValue = document.getElementById('items-exchange-name').value
      document.getElementById('items-exchange-name').length = 0
      if (!this.isDef(playerInfo.preservedItems)) {
        return
      }
      for (let itemNo in playerInfo.preservedItems) {
        let itemAmount = playerInfo.preservedItems[itemNo]
        if (!this.isDef(itemAmount) || itemAmount === 0) {
          continue
        }
        var item = items[itemNo]
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_TOOL) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_OUTFIT) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_CONSUMABLE) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_MATERIAL || itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_JUNK) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
            if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_MATERIAL) {
              document.getElementById('items-exchange-name').options.add(new Option('○[材料]' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            } else {
              document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
          }
        }
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_NOTE) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_RECORDING) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
      }
      document.getElementById('items-exchange-desc').value = ''
      if (document.getElementById('items-exchange-name').options.length > 0) {
        for (let i = 0; i < document.getElementById('items-exchange-name').options.length; i++) {
          if (document.getElementById('items-exchange-name').options[i].value == checkValue) {
            document.getElementById('items-exchange-name').options[i].selected = true
          }
        }
        item = items[document.getElementById('items-exchange-name').value]
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_TOOL) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_OUTFIT) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_CONSUMABLE) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_MATERIAL || document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_JUNK) {
          document.getElementById('items-exchange-desc').value = item.description
          if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_JUNK) {
            document.getElementById('items-exchange-desc').value += '\n可拆解材料： '
            for (let material in item.materials) {
              document.getElementById('items-exchange-desc').value += '\n' + items[material].name + '(' + item.materials[material] + ')'
            }
          }
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_NOTE) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_RECORDING) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        document.getElementById('items-exchange-range').min = 1
        document.getElementById('items-exchange-range').max = playerInfo.preservedItems[document.getElementById('items-exchange-name').value]
        // document.getElementById('items-exchange-range').value = Math.min(document.getElementById('items-exchange-range').value, document.getElementById('items-exchange-range').max)
      } else {
        document.getElementById('items-exchange-range').min = 0
        document.getElementById('items-exchange-range').max = 0
        // document.getElementById('items-exchange-range').value = 0
      }
    },
    canvasDownPC (e) {
      var x = e.clientX - e.target.offsetLeft
      var y = e.clientY - e.target.offsetTop
      // var x = e.clientX
      // var y = e.clientY
      this.canvasDown(x, y)
    },
    canvasDownPhone (e) {
      var x = e.changedTouches[0].clientX - e.target.offsetLeft
      var y = e.changedTouches[0].clientY - e.target.offsetTop
      this.canvasDown(x, y)
    },
    canvasDown (x, y) {
      if (webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_INFO 
      || canvasMoveUse === this.$constants.MOVEMENT_STATE_BACKPACK 
      || canvasMoveUse === this.$constants.MOVEMENT_STATE_SETTINGS 
      || canvasMoveUse === this.$constants.MOVEMENT_STATE_EXCHANGE 
      || canvasMoveUse === this.$constants.MOVEMENT_STATE_USE 
      || canvasMoveUse === this.$constants.MOVEMENT_STATE_SET 
      || canvasMoveUse === this.$constants.MOVEMENT_STATE_MEMBERS) {
        if (x >= canvas.width - menuRightEdge - smallButtonSize && x <= canvas.width - menuRightEdge && y >= menuTopEdge && y <= menuTopEdge + smallButtonSize) {
          // Click 'X'
          canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
        }
        return
      }
      if (x >= avatarPosition.x && x < avatarPosition.x + avatarSize && y >= avatarPosition.y && y < avatarPosition.y + avatarSize) {
        // Avatar
        canvasMoveUse = this.$constants.MOVEMENT_STATE_AVATAR
      } else if (x >= buttonPositions[0].x && x < buttonPositions[0].x + buttonSize && y >= buttonPositions[0].y && y < buttonPositions[0].y + buttonSize) {
        // Personal information
        canvasMoveUse = this.$constants.MOVEMENT_STATE_INFO
      } else if (x >= buttonPositions[1].x && x < buttonPositions[1].x + buttonSize && y >= buttonPositions[1].y && y < buttonPositions[1].y + buttonSize) {
        // Backpack
        canvasMoveUse = this.$constants.MOVEMENT_STATE_BACKPACK
      } else if (x >= buttonPositions[2].x && x < buttonPositions[2].x + buttonSize && y >= buttonPositions[2].y && y < buttonPositions[2].y + buttonSize) {
        // Members
        canvasMoveUse = this.$constants.MOVEMENT_STATE_MEMBERS
        // TBD
      } else if (x >= buttonPositions[3].x && x < buttonPositions[3].x + buttonSize && y >= buttonPositions[3].y && y < buttonPositions[3].y + buttonSize) {
        // Settings
        canvasMoveUse = this.$constants.MOVEMENT_STATE_SETTINGS
      } else if (x >= recordButtonPosition.x && x < (recordButtonPosition.x + smallButtonSize) && y >= recordButtonPosition.y && y < (recordButtonPosition.y + smallButtonSize)) {
        // Voice record
        canvasMoveUse = this.$constants.MOVEMENT_STATE_RECORDER
        this.recordStart()
      } else {
        if (useWheel) {
          if (Math.pow(wheel1Position.x - x, 2) + Math.pow(wheel1Position.y - y, 2) <= Math.pow(wheel1Radius, 2)) {
            // New movement system 24/02/19
            canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
            this.setHandlePosition(x, y)
            this.updatePointer(handle1Position.x, handle1Position.y)
          }
          if (Math.pow(wheel2Position.x - x, 2) + Math.pow(wheel2Position.y - y, 2) <= Math.pow(wheel2Radius, 2)) {
            if (y - wheel2Position.y > x - wheel2Position.x) {
              if (y - wheel2Position.y > wheel2Position.x - x) {
                isKeyDown[13] = true
              } else { 
                isKeyDown[11] = true
              }
            } else {
              if (y - wheel2Position.y > wheel2Position.x - x) {
                isKeyDown[12] = true
              } else {
                isKeyDown[10] = true
              }
            }
          }
        } else {
          // Old movement system 24/02/12
          canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i]
            if (Math.pow(positions.pointer.x - block.x, 2) + Math.pow((positions.pointer.y + 0.5) - block.y, 2) > Math.pow(this.$constants.MIN_CLICK_DISTANCE_BLOCK_POINTER, 2)) {
              // Distance between object and pointer is not close enough 24/02/13
              // Maybe it should be allowed to cancel focus? 23/09/04
              continue
            }
            if (this.validateBlockToInteract(block)) {
              this.startInteraction(block)
              break
            }
          }
          this.updatePointer(x, y)
        }
      }
    },
    wheelKeyUp (index) {
      if (webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      webSocketMessageDetail.functions.useSkills[index - 10] = false
    },
    wheelKeyDown (index) {
      if (webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      switch (index) {
        case 0:
          canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x, handle1Position.y - 0.1 * wheel1Radius)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 1:
          canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x - 0.1 * wheel1Radius, handle1Position.y)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 2:
          canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x + 0.1 * wheel1Radius, handle1Position.y)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 3:
          canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x, handle1Position.y + 0.1 * wheel1Radius)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 10:
        case 11:
        case 12:
        case 13:
          webSocketMessageDetail.functions.useSkills[index - 10] = true
          break
        default:
      }
    },
    startInteraction (block) {
      if (this.isDef(interactionInfo) && interactionInfo.code == block.code) {
        return
      }
      if (block.type == this.$constants.BLOCK_TYPE_PLAYER) {
        if (block.id != userCode) {
          interactionInfo = {
            type: block.type,
            id: block.id,
            code: block.code,
            list: [this.$constants.INTERACTION_YIELD, this.$constants.INTERACTION_TALK, this.$constants.INTERACTION_FLIRT]
          }
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_BED) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_SLEEP]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_TOILET) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE, this.$constants.INTERACTION_DRINK]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_DRESSER) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_SET]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_WORKSHOP) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_GAME) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_STORAGE) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_EXCHANGE]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_COOKER) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_SINK) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE, this.$constants.INTERACTION_DRINK]
        }
      }
      this.fillInteractionList()
    },
    setHandlePosition (x, y) {
      var distance = Math.sqrt(Math.pow(x - wheel1Position.x, 2) + Math.pow(y - wheel1Position.y, 2))
      distance = Math.max(distance, wheel1Radius / 2)
      handle1Position = {
        x: wheel1Position.x + (x - wheel1Position.x) * (wheel1Radius / 2) / distance,
        y: wheel1Position.y + (y - wheel1Position.y) * (wheel1Radius / 2) / distance
      }
    },
    updatePointer (x, y) {
      if (useWheel) {
        positions.pointer.x = x - wheel1Position.x
        positions.pointer.y = y - wheel1Position.y
      } else {
        positions.pointer.x = (x + document.documentElement.scrollLeft - deltaWidth) / blockSize
        positions.pointer.y = (y + document.documentElement.scrollTop - deltaHeight) / blockSize
      }
    },
    fillInteractionList () {
      document.getElementById('interactions-list').length = 0
      if (!this.isDef(interactionInfo) || !this.isDef(interactionInfo.list)) {
        return
      }
      for (var i = 0; i < interactionInfo.list.length; i++) {
        var interactinonName
        switch (Number(interactionInfo.list[i])) {
          case this.$constants.INTERACTION_USE:
            interactinonName = '[使用]'
            break
          case this.$constants.INTERACTION_EXCHANGE:
            interactinonName = '[交换]'
            break
          case this.$constants.INTERACTION_SLEEP:
            interactinonName = '[睡眠]'
            break
          case this.$constants.INTERACTION_DRINK:
            interactinonName = '[饮水]'
            break
          case this.$constants.INTERACTION_DECOMPOSE:
            interactinonName = '[分解]'
            break
          case this.$constants.INTERACTION_TALK:
            interactinonName = '[交谈]'
            break
          case this.$constants.INTERACTION_ATTACK:
            interactinonName = '[攻击]'
            break
          case this.$constants.INTERACTION_FLIRT:
            interactinonName = '[示好]'
            break
          case this.$constants.INTERACTION_SET:
            interactinonName = '[设置]'
            break
          case this.$constants.INTERACTION_YIELD:
            interactinonName = '[屈从]'
            break
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
    canvasMove (x, y) {
      if (webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_MOVING) {
        if (useWheel) {
          this.setHandlePosition(x, y)
          this.updatePointer(handle1Position.x, handle1Position.y)
        } else {
          this.updatePointer(x, y)
        }
      }
    },
    canvasUp () {
      this.canvasLeave()
    },
    canvasLeave () {
      if (webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasMoveUse === this.$constants.MOVEMENT_STATE_RECORDER) {
        this.recordEnd()
        canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
      } else if (canvasMoveUse === this.$constants.MOVEMENT_STATE_MOVING) {
        canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
        if (useWheel) {
          this.setHandlePosition(wheel1Position.x, wheel1Position.y)
          this.updatePointer(handle1Position.x, handle1Position.y)
        } else {
          playerInfo.speed = {
            x: 0,
            y: 0
          }
        }
      } else {
        // No effect
      }
      if (useWheel) {
        isKeyDown[10] = false
        isKeyDown[11] = false
        isKeyDown[12] = false
        isKeyDown[13] = false
      }
    },
    useDrop (newDrop) {
      webSocketMessageDetail.functions.useDrop = { 
        id: newDrop.id
      }
    },
    detectCollisionOldOld (p1, p2, p3, distance) {
      // p1: Start point
      // p2: End point
      // p3: Obstacle center point
      // distance: min distance between p1/p2 and p3
      // When slop equals to infinite, dividend might be zero, cautious! 23/08/31
      var coefficientA = 1
      var coefficientB = 0
      var coefficientC = -1 * p1.x
      if (p2.x != p1.x) {
        coefficientA = (p2.y - p1.y) / (p2.x - p1.x)
        coefficientB = -1
        coefficientC = (p2.x * p1.y - p2.y * p1.x) / (p2.x - p1.x)
      }
      if (Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2)) < distance) {
        // Already overlapped
        return false
      }
      var verticalDistance = Math.abs(coefficientA * p3.x + coefficientB * p3.y + coefficientC) 
      / Math.sqrt(Math.pow(coefficientA, 2) + Math.pow(coefficientB, 2))
      if (verticalDistance >= distance) {
        // Never get touched
        return false
      }
      // Abandoned temporarily 24/03/14
      // calculateLongestDestination(p1, p2, p3, distance)
      return true
    },
    calculateLongestDestination(p1, p2, p3, distance) {
      var coefficientA = 1
      var coefficientB = 0
      var coefficientC = -1 * p1.x
      if (p2.x != p1.x) {
        coefficientA = (p2.y - p1.y) / (p2.x - p1.x)
        coefficientB = -1
        coefficientC = (p2.x * p1.y - p2.y * p1.x) / (p2.x - p1.x)
      }
      var verticalDistance = Math.abs(coefficientA * p3.x + coefficientB * p3.y + coefficientC) 
      / Math.sqrt(Math.pow(coefficientA, 2) + Math.pow(coefficientB, 2))
      var coefficientA2 = 1
      var coefficientB2 = 0
      var coefficientC2 = -1 * p3.x
      if (p2.y != p1.y) {
        coefficientA2 = -1 / coefficientA
        coefficientB2 = -1
        coefficientC2 = p3.x / coefficientA + p3.y
      }
      var footCoordinate = {}
      if (coefficientB === 0) {
        footCoordinate.x = - coefficientC / coefficientA
        footCoordinate.y = - coefficientC2 / coefficientB2
      } else if (coefficientB2 === 0) {
        footCoordinate.x = - coefficientC2 / coefficientA2
        footCoordinate.y = - coefficientC / coefficientB
      } else {
        footCoordinate.x = (coefficientB * coefficientC2 - coefficientB2 * coefficientC) / (coefficientA * coefficientB2 - coefficientA2 * coefficientB)
        footCoordinate.y = -1 * (coefficientA / coefficientB) * footCoordinate.x - coefficientC / coefficientB
      }

      var backDistance = Math.sqrt(Math.pow(distance, 2) - Math.pow(verticalDistance, 2))
      var footDistance = Math.sqrt(Math.pow(footCoordinate.x - p1.x, 2) + Math.pow(footCoordinate.y - p1.y, 2))
      var newSpeed = footDistance - backDistance
      if (playerInfo.speed.x > 0) {
        playerInfo.speed.x = Math.min(playerInfo.speed.x, newSpeed * playerInfo.speed.x / Math.sqrt(Math.pow(playerInfo.speed.x, 2) + Math.pow(playerInfo.speed.y, 2)))
      } else if (playerInfo.speed.x < 0) {
        playerInfo.speed.x = Math.max(playerInfo.speed.x, newSpeed * playerInfo.speed.x / Math.sqrt(Math.pow(playerInfo.speed.x, 2) + Math.pow(playerInfo.speed.y, 2)))
      } else {
        playerInfo.speed.x = 0
      }
      if (playerInfo.speed.y > 0) {
        playerInfo.speed.y = Math.min(playerInfo.speed.y, newSpeed * playerInfo.speed.y / Math.sqrt(Math.pow(playerInfo.speed.x, 2) + Math.pow(playerInfo.speed.y, 2)))
      } else if (playerInfo.speed.y < 0) {
        playerInfo.speed.y = Math.max(playerInfo.speed.y, newSpeed * playerInfo.speed.y / Math.sqrt(Math.pow(playerInfo.speed.x, 2) + Math.pow(playerInfo.speed.y, 2)))
      } else {
        playerInfo.speed.y = 0
      }
    },
    detectCollision (oldP1, oldP2, structure1, structure2) {
      var p1 = { x: oldP1.x + structure1.shape.center.x, y: oldP1.y + structure1.shape.center.y }
      var p2 = { x: oldP2.x + structure2.shape.center.x, y: oldP2.y + structure2.shape.center.y }
      if (this.$constants.STRUCTURE_SHAPE_TYPE_SQUARE == structure1.shape.shapeType) {
        structure1.shape.shapeType = this.$constants.STRUCTURE_SHAPE_TYPE_RECTANGLE
        structure1.shape.radius.y = structure1.shape.radius.x
      }
      if (this.$constants.STRUCTURE_SHAPE_TYPE_SQUARE == structure2.shape.shapeType) {
        structure2.shape.shapeType = this.$constants.STRUCTURE_SHAPE_TYPE_RECTANGLE
        structure2.shape.radius.y = structure2.shape.radius.x
      }
      // Round vs. round
      if (this.$constants.STRUCTURE_SHAPE_TYPE_ROUND == structure1.shape.shapeType && this.$constants.STRUCTURE_SHAPE_TYPE_ROUND == structure2.shape.shapeType) {
        if (Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) <= structure1.shape.radius.x + structure2.shape.radius.x) {
          return true
        }
        return false
      }
      // Rectangle vs. rectangle
      if (this.$constants.STRUCTURE_SHAPE_TYPE_RECTANGLE == structure1.shape.shapeType && this.$constants.STRUCTURE_SHAPE_TYPE_RECTANGLE == structure2.shape.shapeType) {
        if (Math.abs(p1.x - p2.x) <= structure1.shape.radius.x + structure2.shape.radius.x && Math.abs(p1.y - p2.y) <= structure1.shape.radius.y + structure2.shape.radius.y) {
          return true
        }
        return false
      }
      // Round vs. rectangle
      if (this.$constants.STRUCTURE_SHAPE_TYPE_ROUND == structure2.shape.shapeType) {
        return this.detectCollision(oldP2, oldP1, structure2, structure1)
      }
      if (p1.x + structure1.shape.radius.x >= p2.x - structure2.shape.radius.x
      && p1.x - structure1.shape.radius.x <= p2.x + structure2.shape.radius.x
      && p1.y + structure1.shape.radius.y >= p2.y - structure2.shape.radius.y
      && p1.y - structure1.shape.radius.y <= p2.y + structure2.shape.radius.y) {
        return true
      }
      return false
    },
    calculateAngle (x, y) {
      if (y < 0) {
        return Math.acos(x / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) / Math.PI * 180
      } else if (y > 0) {
        return 360 - Math.acos(x / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) / Math.PI * 180
      } else {
        if (x > 0) {
          return 0
        } else if (x < 0) {
          return 180
        } else {
          return 270
        }
      }
    },
    settleSpeed (id, movingBlock) {
      // Speed up
      var speed = Math.sqrt(Math.pow(movingBlock.speed.x, 2) + Math.pow(movingBlock.speed.y, 2)) + movingBlock.acceleration
      if (this.isDef(movingBlock.vp) && movingBlock.vp > 0) {
        speed = Math.min(movingBlock.maxSpeed, speed)
      } else {
        speed = Math.min(movingBlock.maxSpeed * 0.5, speed)
      }
      if (speed === 0) {
        movingBlock.speed.x = 0
        movingBlock.speed.y = 0
      } else {
        movingBlock.speed.x = speed * (positions.pointer.x - movingBlock.coordinate.x) / Math.sqrt(Math.pow(positions.pointer.x - movingBlock.coordinate.x, 2) + Math.pow(positions.pointer.y - movingBlock.coordinate.y, 2))
        movingBlock.speed.y = speed * (positions.pointer.y - movingBlock.coordinate.y) / Math.sqrt(Math.pow(positions.pointer.x - movingBlock.coordinate.x, 2) + Math.pow(positions.pointer.y - movingBlock.coordinate.y, 2))
      }
      movingBlock.faceDirection = this.calculateAngle(movingBlock.speed.x, movingBlock.speed.y)

      var newCoordinate = {
        sceneCoordinate: { x: movingBlock.sceneCoordinate.x, y: movingBlock.sceneCoordinate.y },
        coordinate: { x: movingBlock.coordinate.x, y: movingBlock.coordinate.y },
        regionNo: movingBlock.regionNo
      }
      for (var i = 0; i < blocks.length; i++) {
        if (movingBlock.speed.x === 0 && movingBlock.speed.y === 0) {
          // No speed
          break
        }
        if (blocks[i].type == this.$constants.BLOCK_TYPE_PLAYER && blocks[i].id == id) {
          // Player himself is to be past
          continue
        }
        if (blocks[i].type == this.$constants.BLOCK_TYPE_TELEPORT 
        && this.detectCollision({ x: movingBlock.coordinate.x + movingBlock.speed.x, y: movingBlock.coordinate.y + movingBlock.speed.y }, blocks[i], movingBlock.structure, blocks[i].structure)) {
          movingBlock.speed.x = 0
          movingBlock.speed.y = 0
          newCoordinate.regionNo = blocks[i].to.regionNo
          newCoordinate.sceneCoordinate = blocks[i].to.sceneCoordinate
          newCoordinate.coordinate = blocks[i].to.coordinate
          if (!useWheel) {
            canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
          }
          break // This is important
        }
        if (this.$constants.STRUCTURE_MATERIAL_HOLLOW == this.convertBlockType2Material(blocks[i].type)) {
          continue
        }
        if (!this.detectCollision(movingBlock.coordinate, blocks[i], movingBlock.structure, blocks[i].structure)
        && this.detectCollision({ x: movingBlock.coordinate.x + movingBlock.speed.x, y: movingBlock.coordinate.y }, blocks[i], movingBlock.structure, blocks[i].structure)) {
          movingBlock.speed.x = 0
        }
        if (!this.detectCollision(movingBlock.coordinate, blocks[i], movingBlock.structure, blocks[i].structure)
        && this.detectCollision({ x: movingBlock.coordinate.x, y: movingBlock.coordinate.y + movingBlock.speed.y }, blocks[i], movingBlock.structure, blocks[i].structure)) {
          movingBlock.speed.y = 0
        }
        newCoordinate.coordinate.x = movingBlock.coordinate.x + movingBlock.speed.x
        newCoordinate.coordinate.y = movingBlock.coordinate.y + movingBlock.speed.y
      }
      // Avoid entering non-existing scene 24/03/06
      var hasValidScene = false
      for (var sceneInfoIndex in sceneInfos) {
        if (sceneInfos[sceneInfoIndex].sceneCoordinate.x == newCoordinate.sceneCoordinate.x
            && sceneInfos[sceneInfoIndex].sceneCoordinate.y == newCoordinate.sceneCoordinate.y) {
          hasValidScene = true
        }
      }
      if (!hasValidScene) {
        if (newCoordinate.sceneCoordinate.x !== movingBlock.sceneCoordinate.x) {
          // movingBlock.speed.x = 0
          newCoordinate.coordinate.x = movingBlock.coordinate.x
        }
        if (newCoordinate.sceneCoordinate.y !== movingBlock.sceneCoordinate.y) {
          // movingBlock.speed.y = 0
          newCoordinate.coordinate.y = movingBlock.coordinate.y
        }
      }
      movingBlock.regionNo = newCoordinate.regionNo
      movingBlock.sceneCoordinate = newCoordinate.sceneCoordinate
      movingBlock.coordinate = newCoordinate.coordinate
    },
    convertBlockType2Material (blockType) {
      var material
      switch (blockType) {
        case this.$constants.BLOCK_TYPE_GROUND:
        case this.$constants.BLOCK_TYPE_DROP:
        case this.$constants.BLOCK_TYPE_GROUND_DECORATION:
        case this.$constants.BLOCK_TYPE_WALL_DECORATION:
        case this.$constants.BLOCK_TYPE_CEILING_DECORATION:
        case this.$constants.BLOCK_TYPE_HOLLOW_WALL:
        case this.$constants.BLOCK_TYPE_TELEPORT:
          material = this.$constants.STRUCTURE_MATERIAL_HOLLOW
          break
        case this.$constants.BLOCK_TYPE_PLAYER:
          material = this.$constants.STRUCTURE_MATERIAL_FLESH
          break
        default:
          material = this.$constants.STRUCTURE_MATERIAL_SOLID
          break
      }
      return material
    },
    checkBlockTypeInteractive (blockType) {
      switch (blockType) {
        case this.$constants.BLOCK_TYPE_PLAYER:
        case this.$constants.BLOCK_TYPE_BED:
        case this.$constants.BLOCK_TYPE_TOILET:
        case this.$constants.BLOCK_TYPE_DRESSER:
        case this.$constants.BLOCK_TYPE_WORKSHOP:
        case this.$constants.BLOCK_TYPE_GAME:
        case this.$constants.BLOCK_TYPE_STORAGE:
        case this.$constants.BLOCK_TYPE_COOKER:
        case this.$constants.BLOCK_TYPE_SINK:
          return true
      }
      return false
    },
    fixSceneCoordinate (adjustedCoordinate) {
      while (adjustedCoordinate.coordinate.y < -1) {
        adjustedCoordinate.sceneCoordinate.y -= 1
        adjustedCoordinate.coordinate.y += regionInfo.height
      }
      while (adjustedCoordinate.coordinate.y >= regionInfo.height - 1) {
        adjustedCoordinate.sceneCoordinate.y += 1
        adjustedCoordinate.coordinate.y -= regionInfo.height
      }
      while (adjustedCoordinate.coordinate.x < -0.5) {
        adjustedCoordinate.sceneCoordinate.x -= 1
        adjustedCoordinate.coordinate.x += regionInfo.width
      }
      while (adjustedCoordinate.coordinate.x >= regionInfo.width -0.5) {
        adjustedCoordinate.sceneCoordinate.x += 1
        adjustedCoordinate.coordinate.x -= regionInfo.width
      }
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
        // Unable to send voice msg through websocket
        // this.sendVoiceMsg()
        this.sendVoice()
        // Playing music
        // document.getElementById('musicAudio').play()
      }, voiceEndDelay)
    },
    sendMsg () {
      // In this method, we will use websocket to send printed msgs, instead of HTTP request. 23/08/29
      var content
      content = document.getElementById('chat-content').value
      if (!this.isDef(content) || content == '') {
        // No content to send
        return
      }
      document.getElementById('chat-content').value = ''
      if (scope === this.$constants.SCOPE_GLOBAL) {
        this.addChat(playerInfo.nickname + ':[广播]' + content)
      } else if (scope === this.$constants.SCOPE_INDIVIDUAL) {
        var toNickname = '(已离线)'
        if (this.isDef(playerInfos[chatTo])) {
          toNickname = playerInfos[chatTo].nickname
        }
        this.addChat(playerInfo.nickname + ':[to ' + toNickname + ']' + content)
      }
      webSocketMessageDetail.functions.addMessages.push({
         type: this.$constants.MESSAGE_TYPE_PRINTED, 
         scope: scope, 
         fromUserCode: userCode, 
         toUserCode: chatTo, 
         content: content 
        })
    },
    async sendVoiceMsg () {
      // In this method, we will use websocket to send voice msgs, instead of HTTP request. 23/08/29
      // type: 1-printed 2-voice
      var content
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
      content = await blobToBase64(blob)
      rc.clear()
      webSocketMessageDetail.functions.addMessages.push({
        type: this.$constants.MESSAGE_TYPE_VOICE, 
        scope: scope, 
        fromUserCode: userCode, 
        toUserCode: chatTo, 
        content: content 
      })
    },
    async sendChat () {
      // Avoid using HTTP request, use websocket instead 23/09/12
      // Only broadcasting mode
      var content = document.getElementById('chat-content').value
      if (!this.isDef(content) || content == '') {
        // No content to send
        return
      }
      document.getElementById('chat-content').value = ''
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: this.$constants.MESSAGE_TYPE_PRINTED, 
          scope: scope, 
          fromUserCode: userCode, 
          toUserCode: chatTo, 
          content: content 
        })
      }
      await this.axios.post(this.api_path + "/sendmsg", requestOptions)
          .then(res => {
        console.info(res)
        if (scope === this.$constants.SCOPE_GLOBAL) {
          this.addChat(playerInfo.nickname + ':[广播]' + content)
        } else if (scope === this.$constants.SCOPE_INDIVIDUAL) {
          var toNickname = '(已离线)'
          if (this.isDef(playerInfos[chatTo])) {
            toNickname = playerInfos[chatTo].nickname
          }
          this.addChat(playerInfo.nickname + ':[to ' + toNickname + ']' + content)
        }
      })
          .catch(error => {
        console.error(error)
      })
    },
    async sendVoice () {
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
        body: JSON.stringify({ 
          type: this.$constants.MESSAGE_TYPE_VOICE, 
          scope: scope, 
          fromUserCode: userCode, 
          toUserCode: chatTo, 
          content: content 
        })
      }
      await this.axios.post(this.api_path + "/sendmsg", requestOptions)
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
        console.error(error)
      })
    },
    addChat (msgContent) {
      chatMessages.push(msgContent)
        while (chatMessages.length > MAX_MSG_LINE_NUM) {
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
    sendTerminalMsg () {
      var content
      content = document.getElementById('terminal-input').value
      if (!this.isDef(content) || content == '') {
        // No content to send
        return
      }
      document.getElementById('terminal-input').value = ''
      webSocketMessageDetail.functions.terminalInputs.push({
        id: interactionInfo.id,
        code: interactionInfo.code,
        userCode: userCode, 
        content: content 
      })
    },
    shutDown () {
      clearInterval(intervalTimer20)
      clearInterval(intervalTimer1000)
      clearInterval(intervalTimer30000)
      window.removeEventListener('resize', this.resizeCanvas)
      document.removeEventListener('keyup', this.keyUpEventHandler)
      document.removeEventListener('keydown', this.keyDownEventHandler)
      document.getElementById('chat-content').removeEventListener('keyup', this.keyUpChatEventHandler)
      document.getElementById('chat-content').removeEventListener('focus', this.focusChatEventHandler)
      document.getElementById('chat-content').removeEventListener('blur', this.blurChatEventHandler)
      webStage = this.$constants.WEB_STAGE_START
      canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode, token: token })
      }
      this.axios.post(this.api_path + "/logoff", requestOptions)
      this.$router.push('/')
    },
    setPlayerCharacter () {
      canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
      webSocketMessageDetail.functions.updatePlayerInfo = playerInfo
      // if (webSocketMessageDetail.functions.updatePlayerInfo.playerStatus == this.$constants.PLAYER_STATUS_INIT) {
        webSocketMessageDetail.functions.updatePlayerInfo.playerStatus = this.$constants.PLAYER_STATUS_RUNNING
      // }
      webSocketMessageDetail.functions.updatePlayerInfo.firstName = document.getElementById('initialization-firstName').value
      webSocketMessageDetail.functions.updatePlayerInfo.lastName = document.getElementById('initialization-lastName').value
      webSocketMessageDetail.functions.updatePlayerInfo.nickname = document.getElementById('initialization-nickname').value
      webSocketMessageDetail.functions.updatePlayerInfo.nameColor = document.getElementById('initialization-nameColor').value
      webSocketMessageDetail.functions.updatePlayerInfo.creature = document.getElementById('initialization-creature').value
      webSocketMessageDetail.functions.updatePlayerInfo.gender = document.getElementById('initialization-gender').value
      webSocketMessageDetail.functions.updatePlayerInfo.skinColor = document.getElementById('initialization-skinColor').value
      webSocketMessageDetail.functions.updatePlayerInfo.hairstyle = document.getElementById('initialization-hairstyle').value
      webSocketMessageDetail.functions.updatePlayerInfo.hairColor = document.getElementById('initialization-hairColor').value
      webSocketMessageDetail.functions.updatePlayerInfo.eyes = document.getElementById('initialization-eyes').value
      webSocketMessageDetail.functions.updatePlayerInfo.faceCoefs = []
      for (let i = 0; i < this.$constants.FACE_COEFS_LENGTH; i++) {
        webSocketMessageDetail.functions.updatePlayerInfo.faceCoefs[i] = document.getElementById('initialization-coefs-' + (i + 1)).value
      }
      webSocketMessageDetail.functions.updatePlayerInfo.avatar = document.getElementById('initialization-avatar').value
      if (webStage === this.$constants.WEB_STAGE_INITIALIZING && playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING) {
        webStage = this.$constants.WEB_STAGE_INITIALIZED
      }
    },
    interact () {
      var interactionCode = Number(document.getElementById('interactions-list').value)
      if (this.checkBlockTypeInteractive(interactionInfo.type)) {
        if (interactionInfo.type === this.$constants.BLOCK_TYPE_PLAYER) {
          if (interactionCode === this.$constants.INTERACTION_TALK) {
            scope = this.$constants.SCOPE_INDIVIDUAL
            chatTo = interactionInfo.id
          } else if (interactionCode === this.$constants.INTERACTION_ATTACK) {
            // this.addChat('你向' + playerInfos[interactionInfo.id].nickname + '发动了攻击！')
            this.setRelation(userCode, interactionInfo.id, -1, false)
          } else if (interactionCode === this.$constants.INTERACTION_FLIRT) {
            // this.addChat('你向' + playerInfos[interactionInfo.id].nickname + '表示了好感。')
            this.setRelation(userCode, interactionInfo.id, 1, false)
          } else if (interactionCode === this.$constants.INTERACTION_YIELD) {
            this.setMember(userCode, interactionInfo.id)
          }
          return
        }
        webSocketMessageDetail.functions.interactBlocks.push({
          interactionCode: interactionCode,
          id: interactionInfo.id
        })
        if (interactionCode === this.$constants.INTERACTION_USE) {
          canvasMoveUse = this.$constants.MOVEMENT_STATE_USE
        } else if (interactionCode === this.$constants.INTERACTION_EXCHANGE) {
          canvasMoveUse = this.$constants.MOVEMENT_STATE_EXCHANGE
        } else if (interactionCode === this.$constants.INTERACTION_SLEEP) {
          // this.addChat('你打了一个盹。')
          // playerInfo.vp = playerInfo.vpMax
        } else if (interactionCode === this.$constants.INTERACTION_DRINK) {
          // this.addChat('你痛饮了起来。')
          // playerInfo.thirst = playerInfo.thirstMax
        } else if (interactionCode === this.$constants.INTERACTION_DECOMPOSE) {
          canvasMoveUse = this.$constants.MOVEMENT_STATE_DECOMPOSE
        } else if (interactionCode === this.$constants.INTERACTION_SET) {
          // this.addChat('你捯饬了起来。')
          this.prepareInitialization(playerInfo)
          canvasMoveUse = this.$constants.MOVEMENT_STATE_SET
        }
      }
    },
    quitInteraction () {
      interactionInfo = undefined
      // This is used for manually quiting interactions with special usage events 24/02/14
      canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
    },
    setRelation (userCodeA, userCodeB, newRelation, isAbsolute) {
      webSocketMessageDetail.functions.setRelation = { 
        userCode: userCodeA, 
        nextUserCode: userCodeB, 
        newRelation: newRelation, 
        isAbsolute: isAbsolute
      }
    },
    setMemberRebel () {
      this.setMember(userCode, '')
    },
    setMember (userCodeA, userCodeB) {
      webSocketMessageDetail.functions.setMember = { 
        userCode: userCodeA, 
        nextUserCode: userCodeB
      }
    },
    resizeCanvas () {
      canvas.width = document.documentElement.clientWidth
      canvas.height = document.documentElement.clientHeight
      // console.log('New size: ' + canvas.width + '*' + canvas.height)
      
      // Initialize positions
      avatarPosition = { x: 0, y: 0 }
      buttonPositions = [
        { x: 0, y: avatarSize + 0 * buttonSize },
        { x: 0, y: avatarSize + 1 * buttonSize },
        { x: 0, y: avatarSize + 2 * buttonSize },
        { x: 0, y: avatarSize + 3 * buttonSize }
      ]
      status1Position = { x: avatarSize, y: 0 }
      status2Position = { x: canvas.width - MAX_STATUS_LINE_SIZE - STATUS_SIZE, y: 0 }
      wheel1Position = { x: wheel1Radius, y: canvas.height - wheel1Radius }
      if (canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVING) {
        this.setHandlePosition(wheel1Position.x, wheel1Position.y)
      }
      wheel2Position = { x: canvas.width - wheel2Radius, y: canvas.height - wheel2Radius }
      chatPosition = { x: 10, y: wheel2Position.y - wheel1Radius - 60 }
      recordButtonPosition = { x: 20, y: chatPosition.y + 50 }
    },
    printChat () {
      if (this.isDef(chatMessages)) {
        for (let i = 0; i < chatMessages.length; i++) {
          this.printText(chatMessages[chatMessages.length - 1 - i], chatPosition.x, chatPosition.y - i * MSG_LINE_HEIGHT, Math.min(canvas.width, MAX_MSG_LINE_HEIGHT), 'left')
        }
      }
    },
    resetScope () {
      scope = this.$constants.SCOPE_GLOBAL
    },
    findTopBossId (id) {
      var member = playerInfos[id]
      while (this.isDef(member) && this.isDef(member.bossId) && member.bossId != member.id) {
        member = playerInfos[member.bossId]
      }
      return member.id
    },
    drawBlock (block) {
      this.$drawMethods.drawBlock(context, deltaWidth, deltaHeight, imageBlockSize, blockSize,
      block, userCode, playerInfos, items, effectsImage, scenesImage, blockImages)
    },
    drawAvatar (x, y, imageBlockSize, avatarSize, avatarIndex, nameColor) {
      this.$drawMethods.drawAvatar(context, x, y, imageBlockSize, avatarSize, avatarIndex, nameColor, avatarsImage)
    },
    drawCharacter (playerInfoTemp, x, y, characterBlockSize) {
      var topBossId = this.findTopBossId(playerInfoTemp.id)
      this.$drawMethods.drawCharacter(context, tempCanvas, x, y, deltaWidth, deltaHeight, avatarSize, imageBlockSize, characterBlockSize,
      {x: x * blockSize + deltaWidth, y: y * blockSize + deltaHeight}, 
      {x: (x + 1) * blockSize + deltaWidth, y: (y + 1) * blockSize + deltaHeight},
      userCode, playerInfoTemp, relations, playerInfos[topBossId].avatar,
      avatarsImage, bodiesImage, armsImage, eyesImage, hairstylesImage, toolsImage, outfitsImage, animalsImage)
    },
    drawHead (context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, coefs, offsetY, playerInfoTemp, eyesImage, hairstylesImage) {
      this.$drawMethods.drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, coefs, offsetY, playerInfoTemp, eyesImage, hairstylesImage)
    },
    printText (content, x, y, maxWidth, textAlign) {
      this.$drawMethods.printText(context, content, x, y, maxWidth, textAlign)
    },
    drawOutfit (offsetX, offsetY, x, y, deltaWidth, deltaHeight) {
      this.$drawMethods.drawOutfit(context, outfitsImage, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
    .world-canvas{
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        padding: 0px 0px;
        outline: none;
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
        bottom: 220px;
        display: none;
    }
    .chat #chat-scope{
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
        position: absolute;
        right: 20px;
        bottom: 220px;
        opacity:0.75;
        display: none;
    }
    .interactions #interactions-list{
        height: 25px;
        width: 100px;
        font-size: 16px;
    }
    .interactions #interactions-enter{
        height: 25px;
        width: 40px;
        font-size: 10px;
    }
    .interactions #interactions-quit{
        height: 25px;
        width: 40px;
        font-size: 10px;
    }
    .items{
        opacity: 0.75;
        display: none;
    }
    .items #items-type{
        position: absolute;
        left: 160px;
        top: 160px;
        width: 50px;
        display: flex;
    }
    .items #items-name{
        position: absolute;
        left: 160px;
        top: 185px;
        width: 120px;
        display: flex;
    }
    .items #items-choose{
        position: absolute;
        left: 280px;
        top: 185px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items #items-range{
        position: absolute;
        left: 160px;
        top: 210px;
        width: 120px;
        display: flex;
    }
    .items #items-remove{
        position: absolute;
        left: 160px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size:10px;
    }
    .items #items-desc{
        position: absolute;
        left: 160px;
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
        left: 160px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items-exchange #items-exchange-name{
        position: absolute;
        left: 360px;
        top: 185px;
        width: 120px;
        display: flex;
    }
    .items-exchange #items-exchange-range{
        position: absolute;
        left: 360px;
        top: 210px;
        width: 120px;
        display: flex;
    }
    .items-exchange #items-exchange-get{
        position: absolute;
        left: 360px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items-exchange #items-exchange-desc{
        position: absolute;
        left: 360px;
        top: 260px;
        width: 150px;
        height: 150px;
        display: flex;
        font-size: 16px;
    }
    .terminal{
        opacity: 1;
        display: none;
    }
    .terminal #terminal-text{
        position: absolute;
        left: 160px;
        top: 160px;
        width: 240px;
        height: 80px;
        display: flex;
        font-size: 12px;
    }
    .terminal #terminal-input{
        position: absolute;
        left: 160px;
        top: 535px;
        width: 160px;
        display: flex;
    }
    .terminal #terminal-enter{
        position: absolute;
        left: 320px;
        top: 535px;
        width: 80px;
        display: flex;
    }
    .members{
        opacity:0.75;
        display: none;
    }
    .members #members-rebel{
        position: absolute;
        left: 160px;
        top: 535px;
        height: 25px;
        width: 40px;
        display: flex;
        font-size: 10px;
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
        left: 160px;
        top: 260px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .settings #settings-logoff{
        position: absolute;
        left: 160px;
        top: 310px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .initialization{
        position: absolute;
        left: 160px;
        top: 300px;
        opacity:0.75;
        display: none;
        font-size:16px;
        text-align: left;
    }
    .initialization input{
        width: 100px;
    }
</style>
