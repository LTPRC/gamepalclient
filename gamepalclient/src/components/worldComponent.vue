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
        <div id="terminal" class="terminal">
            <textarea  id="terminal-text" class="terminal-text" value="" readonly/>
            <input id="terminal-input" class="terminal-input" type="text" value=""/>
            <button id="terminal-enter" class="terminal-enter" @click="sendTerminalMsg()">Enter</button>
        </div>
        <div id="hiddenDiv" style="display:none">
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
            <img id="floors" src="../assets/image/blocks/floors.png" />
            <img id="walls" src="../assets/image/blocks/walls.png" />
            <img id="buttons" src="../assets/image/buttons.png" />
            <img id="smallButtons" src="../assets/image/small-buttons.png" />
            <img id="balloons" src="../assets/image/balloons.png" />
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
let floors
// let walls
let buttons
let smallButtons
// let balloons
let blockImages = {}

// Frontend constants
const MIN_CLICK_DISTANCE_BLOCK_POINTER = 0.5
const MIN_DISPLAY_DISTANCE_BLOCK_PLAYER = 2
const MIN_INTERACTION_DISTANCE = 1
const MIN_INTERACTION_ANGLE = 60
const MIN_DROP_INTERACTION_DISTANCE = 0.25
const MIN_MOVE_DISTANCE_POINTER_PLAYER = 0.2
const MOVEMENT_STATE_IDLE = -1
const MOVEMENT_STATE_MOVING = 0
const MOVEMENT_STATE_AVATAR = 1
const MOVEMENT_STATE_INFO = 2
const MOVEMENT_STATE_BACKPACK = 3
const MOVEMENT_STATE_MEMBERS = 9
const MOVEMENT_STATE_SETTINGS = 4
const MOVEMENT_STATE_USE = 6
const MOVEMENT_STATE_DECOMPOSE = 7
const MOVEMENT_STATE_SET = 8
const MOVEMENT_STATE_EXCHANGE = 5
const MOVEMENT_STATE_RECORDER = 10

// Backend constants
const WEB_STAGE_START = 0
const WEB_STAGE_INITIALIZING = 1
const WEB_STAGE_INITIALIZED = 2
const PLAYER_STATUS_INIT = 0
const PLAYER_STATUS_RUNNING = 1
const MESSAGE_TYPE_PRINTED = 1
const MESSAGE_TYPE_VOICE = 2
const SCOPE_GLOBAL = 0
const SCOPE_INDIVIDUAL = 1
const SCOPE_SELF = 2;
const BLOCK_TYPE_GROUND = 0
const BLOCK_TYPE_WALL = 1
const BLOCK_TYPE_PLAYER = 2
const BLOCK_TYPE_DROP = 3
const BLOCK_TYPE_TELEPORT = 4
const BLOCK_TYPE_BED = 5
const BLOCK_TYPE_TOILET = 6
const BLOCK_TYPE_DRESSER = 7
const BLOCK_TYPE_WORKSHOP = 8
const BLOCK_TYPE_GAME = 9
const BLOCK_TYPE_STORAGE = 10
const BLOCK_TYPE_COOKER = 11
const BLOCK_TYPE_SINK = 12
const BLOCK_TYPE_CEILING = 13
const BLOCK_TYPE_GROUND_DECORATION = 14
const BLOCK_TYPE_WALL_DECORATION = 15
const BLOCK_TYPE_CEILING_DECORATION = 16
const BLOCK_TYPE_BLOCKED_GROUND = 17
const BLOCK_TYPE_HOLLOW_WALL = 18
const BLOCK_TYPE_BLOCKED_CEILING = 19
const INTERACTION_USE = 0
const INTERACTION_EXCHANGE = 1
const INTERACTION_SLEEP = 2
const INTERACTION_DRINK = 3
const INTERACTION_DECOMPOSE = 4
const INTERACTION_TALK = 5
const INTERACTION_ATTACK = 6
const INTERACTION_FLIRT = 7
const INTERACTION_SET = 8
const ITEM_CHARACTER_TOOL = 't'
const ITEM_CHARACTER_OUTFIT = 'a'
const ITEM_CHARACTER_CONSUMABLE = 'c'
const ITEM_CHARACTER_MATERIAL = 'm'
const ITEM_CHARACTER_JUNK = 'j'
const ITEM_CHARACTER_NOTE = 'n'
const ITEM_CHARACTER_RECORDING = 'r'
const FLAG_UPDATE_ITEMS = 'updateItems'
const FLAG_UPDATE_PRESERVED_ITEMS = 'updatePreservedItems'
const TERMINAL_TYPE_GAME = 1
const GAME_TYPE_LAS_VEGAS = 1
let webSocketMessageDetail = undefined
let userCode = undefined
let token = undefined
let blocks = undefined
let positions = {
  pointer: { x: undefined, y: undefined }
}

// eslint-disable-next-line no-unused-vars
let items = undefined
let playerInfos = undefined
let playerInfo = undefined
let sceneInfos = undefined
let relations = undefined
let chatMessages = []
let voiceMessages = []
// let members = []
let interactionInfo = undefined
// eslint-disable-next-line no-unused-vars
let terminalOutputs = undefined

let webStage = WEB_STAGE_START
let height = undefined
let width = undefined
// const canvasMaxSizeX = 16
// const canvasMaxSizeY = 9
// const canvasMinSizeX = 1
// const canvasMinSizeY = 1
let blockSize = 100
const minBlockSize = 10
const maxBlockSize = 200
const imageBlockSize = 100
let canvasMoveUse = MOVEMENT_STATE_IDLE
const avatarSize = 100
const buttonSize = 50
const smallButtonSize = 25
const statusSize = 20
// 大地图的最左上角的位置
let deltaWidth
let deltaHeight
const maxStatusLineSize = 100
const menuLeftEdge = 100
const menuRightEdge = 100
const menuTopEdge = 50
const menuBottomEdge = 150
const terminalLeftEdge = menuLeftEdge + 10
const terminalTopEdge = menuTopEdge + 10
let avatarPosition
let buttonPositions
let status1Position
let status2Position

let showChat = true
let chatPosition
const maxMsgLineNum = 10
const maxMsgLineSize = 400
const chatSize = 20
let scope = SCOPE_GLOBAL
let chatTo

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

var intervalTimerInit
var intervalTimer20
var intervalTimer1000
var intervalTimer30000

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
    selectionImage = document.getElementById('selectionImage')
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
    a001 = document.getElementById('a001')
    a002 = document.getElementById('a002')
    a003 = document.getElementById('a003')
    a004 = document.getElementById('a004')
    a005 = document.getElementById('a005')
    a006 = document.getElementById('a006')
    a007 = document.getElementById('a007')
    a008 = document.getElementById('a008')
    a009 = document.getElementById('a009')
    a010 = document.getElementById('a010')
    a011 = document.getElementById('a011')
    a012 = document.getElementById('a012')
    a013 = document.getElementById('a013')
    floors = document.getElementById('floors')
    // walls = document.getElementById('walls')
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
      var that = this
      document.getElementById('chat-content').addEventListener("keyup", function(event) {
        event.preventDefault()
        if (event.key === 'Enter') {
          that.sendMsg()
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
        this.playerMoveFour()
        // show()要和接收websocket同步
        // this.show()
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
      // console.log('服务器返回的消息', e.data)
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

      // Update status resources
      if (webStage == WEB_STAGE_START) {
        items = response.items
      }

      // Update infos
      playerInfos = response.playerInfos
      if (webStage == WEB_STAGE_START) {
        this.initWeb()
        playerInfo = playerInfos[userCode]
      }
      if (webStage == WEB_STAGE_INITIALIZED) {
        var movingBlock = playerInfo
        playerInfo = playerInfos[userCode]
        playerInfo.regionNo = movingBlock.regionNo
        playerInfo.sceneCoordinate = movingBlock.sceneCoordinate
        playerInfo.coordinate = movingBlock.coordinate
        playerInfo.speed = movingBlock.speed
        playerInfo.faceDirection = movingBlock.faceDirection
      }

      relations = response.relations
      sceneInfos = response.sceneInfos

      // Flags
      for (var i in response.flags) {
        switch (response.flags[i]) {
          case FLAG_UPDATE_ITEMS:
            this.updateItems()
            break
          case FLAG_UPDATE_PRESERVED_ITEMS:
            this.updatePreservedItems()
            break
        }
      }

      // Update Map info
      height = response.region.height
      width = response.region.width
      blocks = response.blocks

      // Check messages
      if (this.isDef(response.messages)) {
        for (let i = 0; i < response.messages.length; i++) {
          var message = response.messages[i]
          var fromUserCode = message.fromUserCode
          if (fromUserCode == userCode) {
            // Message from self has shown before
            continue
          }
          if (message.type == MESSAGE_TYPE_PRINTED) {
            var fromNickname = '[已离线]'
            if (this.isDef(playerInfos[fromUserCode])) {
              fromNickname = playerInfos[fromUserCode].nickname
            }
            if (message.scope === SCOPE_GLOBAL) {
              this.addChat(fromNickname + ':' + '[广播]' + message.content)
            } else if (message.scope === SCOPE_INDIVIDUAL) {
              this.addChat(fromNickname + ':' + message.content)
            } else if (message.scope === SCOPE_SELF) {
              this.addChat(message.content)
            }
          } else if (message.type == MESSAGE_TYPE_VOICE) {
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

      if (webStage === WEB_STAGE_START) {
        if (!this.isDef(playerInfo) || playerInfo.playerStatus == PLAYER_STATUS_INIT) {
          // Character initialization
          this.prepareInitialization()
          webStage = WEB_STAGE_INITIALIZING
          canvasMoveUse = MOVEMENT_STATE_SET
        } else if (webStage === WEB_STAGE_INITIALIZING) {
          webStage = WEB_STAGE_INITIALIZED
          canvasMoveUse = MOVEMENT_STATE_IDLE
        }
      }

      this.show()
    },
    logoff () {
      console.log('Log off.')
      this.websocket.close()
      // this.shutDown()
    },
    sendWebsocketMessage () {
      // if (webStage !== WEB_STAGE_INITIALIZED) {
        // return
      // }
      this.websocket.send(JSON.stringify(webSocketMessageDetail))
      this.resetWebSocketMessageDetail()
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
          terminalInputs: []
        },
      }
      if (!this.isDef(playerInfo) || playerInfo.playerStatus == PLAYER_STATUS_INIT) {
        webSocketMessageDetail.functions.updatePlayerInfo = playerInfo
      } else if (playerInfo.playerStatus == PLAYER_STATUS_RUNNING) {
        webSocketMessageDetail.functions.updateMovingBlock = playerInfo
      }
    },
    show () {
      context.clearRect(0, 0, canvas.width, canvas.height)
      deltaWidth = canvas.width / 2 - playerInfo.coordinate.x * blockSize
      deltaHeight = canvas.height / 2 - playerInfo.coordinate.y * blockSize

      var timestamp = new Date().valueOf()

      // Print blocks
      for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i]

        // Check interaction
        if (useWheel && !this.isDef(interactionInfo)) {
          var distance = block.type == BLOCK_TYPE_DROP ? MIN_INTERACTION_DISTANCE : MIN_DROP_INTERACTION_DISTANCE
          if (Math.abs(playerInfo.faceDirection - this.calculateAngle(block.x - playerInfo.coordinate.x, block.y - playerInfo.coordinate.y)) <= MIN_INTERACTION_ANGLE 
              && Math.pow(block.x - playerInfo.coordinate.x, 2) + Math.pow(block.y - playerInfo.coordinate.y, 2) <= Math.pow(distance, 2)) {
            this.startInteraction(block)
          }
        }

        var img, txt
        if (block.type == BLOCK_TYPE_PLAYER) {
          this.printCharacter(playerInfos[block.id], block.x - 0.5, block.y - 1)
        } else if (block.type == BLOCK_TYPE_DROP) {
          img = blockImages[Number(block.code)]
          if (!this.isDef(img)) {
            img = blockImages[1000]
          }
          context.drawImage(img, 0, 0, imageBlockSize, imageBlockSize, 
          (block.x - 0.5 * Math.sin(timestamp % 4000 * Math.PI * 2 / 4000)) * blockSize + deltaWidth, 
          (block.y - 1) * blockSize + deltaHeight, 
          blockSize * Math.sin(timestamp % 4000 * Math.PI * 2 / 4000), 
          blockSize)
          // Show notifications (drop)
          if (Math.pow(playerInfo.coordinate.x - block.x, 2) + Math.pow(playerInfo.coordinate.y - block.y, 2) <= Math.pow(MIN_DISPLAY_DISTANCE_BLOCK_PLAYER, 2)) {
            var itemName = items[block.itemNo].name
            this.printText(itemName + '(' + block.amount + ')', 
            block.x * blockSize + deltaWidth, 
            (block.y - 0.5) * blockSize + deltaHeight, 
            blockSize, 'center')
          }
        } else if (block.type == BLOCK_TYPE_GROUND || block.type == BLOCK_TYPE_WALL || block.type == BLOCK_TYPE_CEILING || block.type == BLOCK_TYPE_TELEPORT
            || block.type == BLOCK_TYPE_GROUND_DECORATION || block.type == BLOCK_TYPE_WALL_DECORATION || block.type == BLOCK_TYPE_CEILING_DECORATION
            || block.type == BLOCK_TYPE_BLOCKED_GROUND || block.type == BLOCK_TYPE_HOLLOW_WALL || block.type == BLOCK_TYPE_BLOCKED_CEILING) {
            img = blockImages[Number(block.code)]
          if (!this.isDef(img)) {
            img = blockImages[1000]
          }
          context.drawImage(img, 0, 0, imageBlockSize, imageBlockSize, 
          (block.x - 0.5) * blockSize + deltaWidth, 
          (block.y - 1) * blockSize + deltaHeight, 
          blockSize + 1, 
          blockSize + 1)
        } else {
          img = blockImages[Number(block.code)]
          if (!this.isDef(img)) {
            img = blockImages[1000]
          }
          switch (block.type) {
            case BLOCK_TYPE_BED:
              txt = '床'
              break
            case BLOCK_TYPE_TOILET:
              txt = '马桶'
              break
            case BLOCK_TYPE_DRESSER:
              txt = '梳妆台'
              break
            case BLOCK_TYPE_WORKSHOP:
              txt = '工作台'
              break
            case BLOCK_TYPE_GAME:
              txt = '桌游'
              break
            case BLOCK_TYPE_STORAGE:
              txt = '行李箱'
              break
            case BLOCK_TYPE_COOKER:
              txt = '灶台'
              break
            case BLOCK_TYPE_SINK:
              txt = '饮水台'
              break
          }
          context.drawImage(img, 0, 0, imageBlockSize, imageBlockSize, 
          (block.x - 0.5) * blockSize + deltaWidth, 
          (block.y - 1) * blockSize + deltaHeight, 
          blockSize + 1, 
          blockSize + 1)
          if (Math.pow(playerInfo.coordinate.x - block.x, 2) + Math.pow(playerInfo.coordinate.y - block.y, 2) <= Math.pow(MIN_DISPLAY_DISTANCE_BLOCK_PLAYER, 2)) {
            this.printText(txt, block.x * blockSize + deltaWidth, (block.y - 1) * blockSize + deltaHeight, blockSize, 'center')
          }
        }
        // Show interactions
        if (this.isDef(interactionInfo)) {
          document.getElementById('interactions').style.display = 'inline'
          if (block.type == interactionInfo.type && block.id == interactionInfo.id && block.code == interactionInfo.code) {
            context.drawImage(selectionImage, Math.floor(timestamp / 100) % 10 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, 
            (block.x - 0.5) * blockSize + deltaWidth, 
            (block.y - 1) * blockSize + deltaHeight, 
            blockSize,
            blockSize)
            if (Math.pow(block.x - playerInfo.coordinate.x, 2) + Math.pow(block.y - playerInfo.coordinate.y, 2) > Math.pow(MIN_INTERACTION_DISTANCE, 2)) {
              interactionInfo = undefined
            }
          }
        } else {
          document.getElementById('interactions').style.display = 'none'
        }
      }
      this.showOther()
    },
    printCharacter (playerInfoTemp, x, y) {
      // Show individual
      var offsetX, offsetY
      if (playerInfoTemp.faceDirection >= 315 || playerInfoTemp.faceDirection < 45) {
        offsetY = 2
      } else if (playerInfoTemp.faceDirection >= 45 && playerInfoTemp.faceDirection < 135) {
        offsetY = 3
      } else if (playerInfoTemp.faceDirection >= 135 && playerInfoTemp.faceDirection < 225) {
        offsetY = 1
      } else if (playerInfoTemp.faceDirection >= 225 && playerInfoTemp.faceDirection < 315) {
        offsetY = 0
      } else {
        offsetY = 0
      }
      var timestamp = new Date().valueOf()
      var speed = Math.sqrt(Math.pow(playerInfoTemp.speed.x, 2) + Math.pow(playerInfoTemp.speed.y, 2))
      if (speed !== 0 && timestamp % 400 < 100) {
        offsetX = 0
      } else if (speed !== 0 && timestamp % 400 >= 200 && timestamp % 400 < 300) {
        offsetX = 2
      } else {
        offsetX = 1
      }
      var img
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
        context.drawImage(bodyImage, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
        x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
        context.drawImage(eyesImage[Number(playerInfoTemp.eyes) - 1], 0, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
        x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
        // Print outfit
        if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          if (playerInfoTemp.outfits[0] == 'a001') {
            img = a001
          }
          if (playerInfoTemp.outfits[0] == 'a002') {
            img = a002
          }
          if (playerInfoTemp.outfits[0] == 'a003') {
            img = a003
          }
          if (playerInfoTemp.outfits[0] == 'a004') {
            img = a004
          }
          if (playerInfoTemp.outfits[0] == 'a005') {
            img = a005
          }
          if (playerInfoTemp.outfits[0] == 'a006') {
            img = a006
          }
          if (playerInfoTemp.outfits[0] == 'a007') {
            img = a007
          }
          if (playerInfoTemp.outfits[0] == 'a008') {
            img = a008
          }
          if (playerInfoTemp.outfits[0] == 'a009') {
            img = a009
          }
          if (playerInfoTemp.outfits[0] == 'a010') {
            img = a010
          }
          if (playerInfoTemp.outfits[0] == 'a011') {
            img = a011
          }
          if (playerInfoTemp.outfits[0] == 'a012') {
            img = a012
          }
          if (playerInfoTemp.outfits[0] == 'a013') {
            img = a013
          }
          context.drawImage(img, offsetX * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, 
          x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
        }
        if (playerInfoTemp.hairColor == 1) {
          img = hairstyle_black
        } else if (playerInfoTemp.hairColor == 2) {
          img = hairstyle_grey
        } else if (playerInfoTemp.hairColor == 3) {
          img = hairstyle_orange
        }
        context.drawImage(img, (playerInfoTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
        x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
      } else if (playerInfoTemp.creature == 2) {
        // Display animals
        switch (playerInfoTemp.skinColor) {
          case '1':
            img = paofu
            break
          case '2':
            img = frog
            break
          case '3':
            img = monkey
            break
          case '4':
            img = racoon
            break
        }
        context.drawImage(img, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
        x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
      } else if (playerInfoTemp.creature == 3) {
        // Display npcs
        // TBD
      }
      // Show name
      if (this.isDef(playerInfoTemp.nameColor)) {
        context.fillStyle = playerInfoTemp.nameColor
        context.fillRect((x - 0.25 + 0.5) * blockSize + deltaWidth, (y - 0.36 - 0.5 + 1) * blockSize + deltaHeight, 
        blockSize * 0.5, 
        blockSize * 0.02)
      }
      context.drawImage(avatars, playerInfoTemp.avatar % 10 * avatarSize, Math.floor(playerInfoTemp.avatar / 10) * avatarSize, 
      avatarSize, avatarSize, (x - 0.25 + 0.02 - 0.2 + 0.5) * blockSize + deltaWidth, 
      (y - 0.36 - 0.2 - 0.5 + 1) * blockSize + deltaHeight, 
      blockSize * 0.25, blockSize * 0.25)
      if (userCode != playerInfoTemp.id) {
        context.fillStyle = 'yellow'
        if (this.isDef(relations) && this.isDef(relations[playerInfoTemp.id])) {
          if (relations[playerInfoTemp.id] < 0) {
            context.fillStyle = 'red'
          } else if (relations[playerInfoTemp.id] > 0) {
            context.fillStyle = 'green'
          }
        }
        context.beginPath()
        context.arc((x + 0.25 + 0.1 + 0.5) * blockSize + deltaWidth, 
        (y - 0.54 + 0.1 - 0.5 + 1) * blockSize + deltaHeight, 
        0.1 * blockSize, 0, 
        2 * Math.PI)
        context.fill()
      }
      if (this.isDef(playerInfoTemp.nickname)) {
        this.printText(playerInfoTemp.nickname, (x + 0.5) * blockSize + deltaWidth, 
        (y - 0.5 + 0.12 - 0.5 + 1) * blockSize + deltaHeight, 
        Math.min(canvas.width, blockSize * 0.5), 
        'center')
      }
    },
    showOther() {
      // Initialize positions
      avatarPosition = { x: 0, y: 0 }
      buttonPositions = [
        { x: 0, y: avatarSize + 0 * buttonSize },
        { x: 0, y: avatarSize + 1 * buttonSize },
        { x: 0, y: avatarSize + 2 * buttonSize },
        { x: 0, y: avatarSize + 3 * buttonSize }
      ]
      status1Position = { x: avatarSize, y: 0 }
      status2Position = { x: canvas.width - maxStatusLineSize - statusSize, y: 0 }
      wheel1Position = { x: wheel1Radius, y: canvas.height - wheel1Radius }
      if (!this.isDef(handle1Position)) {
        this.resetHandlePosition()
      }
      wheel2Position = { x: canvas.width - wheel2Radius, y: canvas.height - wheel2Radius }
      chatPosition = { x: 10, y: wheel2Position.y - wheel1Radius - 60 }
      recordButtonPosition = { x: 240, y: chatPosition.y + 20 }

      // Show avater
      context.drawImage(avatars, playerInfo.avatar % 10 * avatarSize, Math.floor(playerInfo.avatar / 10) * avatarSize, avatarSize, avatarSize, avatarPosition.x, avatarPosition.y, avatarSize, avatarSize)
      
      // Show buttons
      if (canvasMoveUse !== MOVEMENT_STATE_INFO) {
        context.drawImage(buttons, 0 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, buttonPositions[0].x, buttonPositions[0].y, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 0 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, buttonPositions[0].x, buttonPositions[0].y, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== MOVEMENT_STATE_BACKPACK) {
        context.drawImage(buttons, 1 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, buttonPositions[1].x, buttonPositions[1].y, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 1 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, buttonPositions[1].x, buttonPositions[1].y, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== MOVEMENT_STATE_MEMBERS) {
        context.drawImage(buttons, 2 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, buttonPositions[2].x, buttonPositions[2].y, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 2 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, buttonPositions[2].x, buttonPositions[2].y, buttonSize, buttonSize)
      }
      if (canvasMoveUse !== MOVEMENT_STATE_SETTINGS) {
        context.drawImage(buttons, 3 * buttonSize, 0 * buttonSize, buttonSize, buttonSize, buttonPositions[3].x, buttonPositions[3].y, buttonSize, buttonSize)
      } else {
        context.drawImage(buttons, 3 * buttonSize, 1 * buttonSize, buttonSize, buttonSize, buttonPositions[3].x, buttonPositions[3].y, buttonSize, buttonSize)
      }

      // Show status1
      if (this.isDef(playerInfo.nickname) && this.isDef(playerInfo.lastName) && this.isDef(playerInfo.firstName)) {
        this.printText('Lv.' + playerInfo.level + ' ' + playerInfo.nickname + '(' + playerInfo.lastName + ',' + playerInfo.firstName + ')', status1Position.x, status1Position.y + 1 * statusSize, buttonSize * 5, 'left')
      } else {
        this.printText('Lv.' + playerInfo.level, status1Position.x, status1Position.y + 1 * statusSize, statusSize * 10, 'left')
      }
      this.printText('经验值' + playerInfo.exp + '/' + playerInfo.expMax, status1Position.x, status1Position.y + 2 * statusSize, statusSize * 10)
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      context.fillStyle = 'rgba(191, 191, 191, 0.5)'
      context.fillRect(status1Position.x, status1Position.y + 2.25 * statusSize, maxStatusLineSize * playerInfo.exp / playerInfo.expMax, statusSize * 0.75)
      context.strokeRect(status1Position.x, status1Position.y + 2.25 * statusSize, maxStatusLineSize, statusSize * 0.75)
      
      // show status2
      this.printText('生命值' + playerInfo.hp + '/' + playerInfo.hpMax, status2Position.x, status2Position.y + 1 * statusSize, maxStatusLineSize, 'left')
      this.printText('活力值' + playerInfo.vp + '/' + playerInfo.vpMax, status2Position.x, status2Position.y + 3 * statusSize, maxStatusLineSize, 'left')
      this.printText('饥饿值' + playerInfo.hunger + '/' + playerInfo.hungerMax, status2Position.x, status2Position.y + 5 * statusSize, maxStatusLineSize, 'left')
      this.printText('口渴值' + playerInfo.thirst + '/' + playerInfo.thirstMax, status2Position.x, status2Position.y + 7 * statusSize, maxStatusLineSize, 'left')
      context.fillStyle = 'rgba(191, 191, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 1.25 * statusSize, maxStatusLineSize * playerInfo.hp / playerInfo.hpMax, statusSize * 0.75)
      context.fillStyle = 'rgba(0, 191, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 3.25 * statusSize, maxStatusLineSize * playerInfo.vp / playerInfo.vpMax, statusSize * 0.75)
      context.fillStyle = 'rgba(191, 0, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 5.25 * statusSize, maxStatusLineSize * playerInfo.hunger / playerInfo.hungerMax, statusSize * 0.75)
      context.fillStyle = 'rgba(0, 0, 191, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 7.25 * statusSize, maxStatusLineSize * playerInfo.thirst / playerInfo.thirstMax, statusSize * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 1.25 * statusSize, maxStatusLineSize, statusSize * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 3.25 * statusSize, maxStatusLineSize, statusSize * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 5.25 * statusSize, maxStatusLineSize, statusSize * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 7.25 * statusSize, maxStatusLineSize, statusSize * 0.75)
      context.fillStyle = '#000000'

      // Show chat
      if (showChat) {
        document.getElementById('chat-scope').value = '[广播]'
        if (scope === SCOPE_INDIVIDUAL) {
          for (var playerInfoIndex in playerInfos) {
            if (playerInfos[playerInfoIndex].id == chatTo) {
              document.getElementById('chat-scope').value = 'To:' + playerInfos[playerInfoIndex].nickname
            }
          }
        }
        if (canvasMoveUse !== MOVEMENT_STATE_RECORDER) {
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
      if (canvasMoveUse === MOVEMENT_STATE_INFO) {
        this.printMenu()
        this.printStatus()
      }
      if (canvasMoveUse === MOVEMENT_STATE_BACKPACK) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-choose').style.display = 'inline'
        document.getElementById('items-remove').style.display = 'inline'
        this.printMenu()
        this.printItems()
      }
      if (canvasMoveUse === MOVEMENT_STATE_SETTINGS) {
        document.getElementById('settings').style.display = 'inline'
        this.printMenu()
        this.printSettings()
      }
      if (canvasMoveUse === MOVEMENT_STATE_EXCHANGE) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-choose').style.display = 'none'
        document.getElementById('items-remove').style.display = 'none'
        document.getElementById('items-exchange').style.display = 'inline'
        this.printMenu()
        this.printExchange()
      }
      if (canvasMoveUse === MOVEMENT_STATE_USE) {
        if (this.isDef(interactionInfo) && interactionInfo.type == BLOCK_TYPE_GAME) {
          this.printMenu()
          document.getElementById('terminal').style.display = 'inline'
          this.printTerminal()
        } else {
          document.getElementById('terminal').style.display = 'none'
        }
      } else {
        document.getElementById('terminal').style.display = 'none'
      }
      if (canvasMoveUse === MOVEMENT_STATE_SET) {
        document.getElementById('initialization').style.display = 'inline'
        this.printMenu()
        this.printInitialization()
      }
      if (canvasMoveUse === MOVEMENT_STATE_MEMBERS) {
        document.getElementById('members').style.display = 'inline'
        this.printMenu()
      }

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
      } else {
        // Show pointer
        if (canvasMoveUse === MOVEMENT_STATE_MOVING) {
          this.printPointer(positions.pointer.x - (document.documentElement.scrollLeft - deltaWidth) / blockSize,
          positions.pointer.y - (document.documentElement.scrollTop - deltaHeight) / blockSize)
        }
      }
    },
    printPointer (x, y) {
      var timestamp = new Date().valueOf()
      context.save()
      context.lineWidth = blockSize * (100 + timestamp % 900) / 1000
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      context.beginPath()
      context.arc(x * blockSize, y * blockSize, 1, 0, 2 * Math.PI)
      context.stroke()
      context.restore()
    },
    resetScope () {
      scope = SCOPE_GLOBAL
    },
    printChat () {
      if(this.isDef(chatMessages)) {
        for (let i = 0; i < chatMessages.length; i++) {
          this.printText(chatMessages[chatMessages.length - 1 - i], chatPosition.x, chatPosition.y - i * chatSize, Math.min(canvas.width, maxMsgLineSize), 'left')
        }
      }
    },
    printMenu () {
      context.save()
      context.fillStyle = 'rgba(191, 191, 191, 0.75)'
      context.fillRect(menuLeftEdge, menuTopEdge, canvas.width - menuLeftEdge - menuRightEdge, canvas.height - menuTopEdge - menuBottomEdge)
      context.restore()
      if (canvasMoveUse !== MOVEMENT_STATE_SET || playerInfo.playerStatus != PLAYER_STATUS_INIT) {
        context.drawImage(smallButtons, 1 * smallButtonSize, 0 * smallButtonSize, smallButtonSize, smallButtonSize, canvas.width - menuRightEdge - smallButtonSize, menuTopEdge, smallButtonSize, smallButtonSize)
      }
    },
    printExchange () {
      this.printText(Number(playerInfo.capacity).toFixed(1) + '/' + Number(playerInfo.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100, 'left')
      this.printText('$' + playerInfo.money, menuLeftEdge + 110, menuTopEdge + 20, 50, 'left')
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50, 'left')
      this.printText(document.getElementById('items-exchange-range').value, menuLeftEdge + 330, menuTopEdge + 125, 50, 'left')
    },
    printStatus () {
      var positionY = menuTopEdge + 20
      this.printText(playerInfo.nickname + ' (' + playerInfo.lastName + ', ' + playerInfo.firstName + ')', menuLeftEdge + 10, positionY, buttonSize * 5, playerInfo.nameColor, 'left')
      positionY += 20
      // this.printText('当前位置:' + sceneInfos[playerInfo.sceneNo].name, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      // positionY += 20
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
      this.printText('$' + playerInfo.money + ' 负重' + Number(playerInfo.capacity).toFixed(1) + '/' + Number(playerInfo.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('特殊状态 无', menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
    },
    printItems () {
      this.printText(Number(playerInfo.capacity).toFixed(1) + '/' + Number(playerInfo.capacityMax).toFixed(1) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100, 'left')
      this.printText('$' + playerInfo.money, menuLeftEdge + 110, menuTopEdge + 20, 50, 'left')
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50, 'left')
      // this.displayItems()
    },
    printSettings () {
      this.printText('缩放: ' + Math.round(blockSize / maxBlockSize * 100) + '%', menuLeftEdge + 10, menuTopEdge + 75, 50, 'left')
      this.printText('音乐', menuLeftEdge + 10, menuTopEdge + 125, 50, 'left')
      this.printText('音效', menuLeftEdge + 110, menuTopEdge + 125, 50, 'left')
      blockSize = Number(document.getElementById('settings-blockSize').value)
      musicMuted = !document.getElementById('settings-music').checked
      soundMuted = !document.getElementById('settings-sound').checked
    },
    printTerminal () {
      if (!this.isDef(terminalOutputs)) {
        return
      }
      if (terminalOutputs.terminalType == TERMINAL_TYPE_GAME && terminalOutputs.gameType == GAME_TYPE_LAS_VEGAS) {
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
      // Avatar
      if (this.isDef(playerInfo.avatar)) {
        context.drawImage(avatars, playerInfo.avatar % 10 * avatarSize, Math.floor(playerInfo.avatar / 10) * avatarSize, avatarSize, avatarSize, menuLeftEdge + 10, menuTopEdge + 10, avatarSize, avatarSize)
      }
      context.drawImage(avatars, document.getElementById('initialization-avatar').value % 10 * avatarSize, Math.floor(document.getElementById('initialization-avatar').value / 10) * avatarSize, avatarSize, avatarSize, menuLeftEdge + 160, menuTopEdge + 10, avatarSize, avatarSize)
      // Nickname
      if (this.isDef(playerInfo.nickname)) {
        context.drawImage(floors, 3 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 10, menuTopEdge + 120, avatarSize, avatarSize)
      }
      context.drawImage(floors, 3 * imageBlockSize, 0 * imageBlockSize, imageBlockSize, imageBlockSize, menuLeftEdge + 160, menuTopEdge + 120, avatarSize, avatarSize)
      // Left character
      var playerInfoTemp
      if (this.isDef(playerInfo)) {
        playerInfoTemp = Object.assign({}, playerInfo)
        var timestamp = new Date().valueOf()
        playerInfoTemp.speed = {
          x: Math.sin(timestamp % 4000 * Math.PI * 2 / 4000),
          y: Math.cos(timestamp % 4000 * Math.PI * 2 / 4000)
        }
        playerInfoTemp.faceDirection = this.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
        this.printCharacter(playerInfoTemp, (menuLeftEdge + 10 - deltaWidth) / blockSize, (menuTopEdge + 120 - deltaHeight) / blockSize)
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
        faceDirection: this.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y),
        outfits: playerInfoTemp.outfits
      }
      this.printCharacter(playerInfoTemp, (menuLeftEdge + 160 - deltaWidth) / blockSize, (menuTopEdge + 120 - deltaHeight) / blockSize)
      // Show name
      if (this.isDef(playerInfo.nickname)) {
        context.fillStyle = playerInfo.nameColor
        context.fillRect(menuLeftEdge + 10 + avatarSize / 2 - 0.25 * blockSize, menuTopEdge + 120 + avatarSize * 0.12 + 0.02 * blockSize, blockSize * 0.5, blockSize * 0.02)
        this.printText(playerInfo.nickname, menuLeftEdge + 10 + avatarSize / 2, menuTopEdge + 120 + avatarSize * 0.12, Math.min(canvas.width, avatarSize), 'center')
      }
      context.fillStyle = document.getElementById('initialization-nameColor').value
      context.fillRect(menuLeftEdge + 160 + avatarSize / 2 - 0.25 * blockSize, menuTopEdge + 120 + avatarSize * 0.12 + 0.02 * blockSize, blockSize * 0.5, blockSize * 0.02)
      this.printText(document.getElementById('initialization-nickname').value, menuLeftEdge + 160 + avatarSize / 2, menuTopEdge + 120 + avatarSize * 0.12, Math.min(canvas.width, avatarSize), 'center')
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
      var newCoordinate = { 
        itemNo: itemNo, 
        amount: itemAmount, 
        regionNo: playerInfo.regionNo,
        sceneCoordinate: {
          x: playerInfo.sceneCoordinate.x, 
          y: playerInfo.sceneCoordinate.y
        },
        coordinate: {
          // A Minecraft-like throw-away coordinate 24/02/14
          x: playerInfo.coordinate.x + (Math.random() + 1) * Math.cos(playerInfo.faceDirection / 180 * Math.PI), 
          y: playerInfo.coordinate.y - (Math.random() + 1) * Math.sin(playerInfo.faceDirection / 180 * Math.PI)
        }
      }
      this.adjustSceneCoordinate(newCoordinate)
      webSocketMessageDetail.functions.addDrops.push(newCoordinate)
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
          case ITEM_CHARACTER_TOOL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              if (this.isDef(playerInfo.tools) && playerInfo.tools.length > 0 && playerInfo.tools[0] == itemNo) {
                document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case ITEM_CHARACTER_OUTFIT:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.isDef(playerInfo.outfits) && playerInfo.outfits.length > 0 && playerInfo.outfits[0] == itemNo) {
                      document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case ITEM_CHARACTER_CONSUMABLE:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case ITEM_CHARACTER_MATERIAL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option('○[材料]' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case ITEM_CHARACTER_JUNK:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case ITEM_CHARACTER_NOTE:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case ITEM_CHARACTER_RECORDING:
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
        if (document.getElementById('items-name').value.charAt(0) == ITEM_CHARACTER_TOOL) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == ITEM_CHARACTER_OUTFIT) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == ITEM_CHARACTER_CONSUMABLE) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == ITEM_CHARACTER_MATERIAL || document.getElementById('items-name').value.charAt(0) == ITEM_CHARACTER_JUNK) {
          document.getElementById('items-desc').value = item.description
          if (document.getElementById('items-name').value.charAt(0) == ITEM_CHARACTER_JUNK) {
            document.getElementById('items-desc').value += '\n可拆解材料： '
            console.log()
            for (let material in item.materials) {
              document.getElementById('items-desc').value += '\n' + items[material].name + '(' + item.materials[material] + ')'
            }
          }
        }
        if (document.getElementById('items-name').value.charAt(0) == ITEM_CHARACTER_NOTE) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == ITEM_CHARACTER_RECORDING) {
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
        if (itemNo.charAt(0) == ITEM_CHARACTER_TOOL) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == ITEM_CHARACTER_OUTFIT) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == ITEM_CHARACTER_CONSUMABLE) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == ITEM_CHARACTER_MATERIAL || itemNo.charAt(0) == ITEM_CHARACTER_JUNK) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
            if (itemNo.charAt(0) == ITEM_CHARACTER_MATERIAL) {
              document.getElementById('items-exchange-name').options.add(new Option('○[材料]' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            } else {
              document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
          }
        }
        if (itemNo.charAt(0) == ITEM_CHARACTER_NOTE) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == ITEM_CHARACTER_RECORDING) {
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
        if (document.getElementById('items-exchange-name').value.charAt(0) == ITEM_CHARACTER_TOOL) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == ITEM_CHARACTER_OUTFIT) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == ITEM_CHARACTER_CONSUMABLE) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == ITEM_CHARACTER_MATERIAL || document.getElementById('items-exchange-name').value.charAt(0) == ITEM_CHARACTER_JUNK) {
          document.getElementById('items-exchange-desc').value = item.description
          if (document.getElementById('items-exchange-name').value.charAt(0) == ITEM_CHARACTER_JUNK) {
            document.getElementById('items-exchange-desc').value += '\n可拆解材料： '
            for (let material in item.materials) {
              document.getElementById('items-exchange-desc').value += '\n' + items[material].name + '(' + item.materials[material] + ')'
            }
          }
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == ITEM_CHARACTER_NOTE) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == ITEM_CHARACTER_RECORDING) {
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
      if (webStage !== WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasMoveUse === MOVEMENT_STATE_INFO 
      || canvasMoveUse === MOVEMENT_STATE_BACKPACK 
      || canvasMoveUse === MOVEMENT_STATE_SETTINGS 
      || canvasMoveUse === MOVEMENT_STATE_EXCHANGE 
      || canvasMoveUse === MOVEMENT_STATE_USE 
      || canvasMoveUse === MOVEMENT_STATE_SET 
      || canvasMoveUse === MOVEMENT_STATE_MEMBERS) {
        if (x >= canvas.width - menuRightEdge - smallButtonSize && x <= canvas.width - menuRightEdge && y >= menuTopEdge && y <= menuTopEdge + smallButtonSize) {
          // Click 'X'
          canvasMoveUse = MOVEMENT_STATE_IDLE
        // } else if (x >= menuLeftEdge && x <= (menuLeftEdge + canvas.width - menuLeftEdge - menuRightEdge) && y >= menuTopEdge && y <= (menuTopEdge + canvas.height - menuTopEdge - menuBottomEdge)) {
        }
        return
      }
      if (x >= avatarPosition.x && x < avatarPosition.x + avatarSize && y >= avatarPosition.y && y < avatarPosition.y + avatarSize) {
        // Avatar
        canvasMoveUse = MOVEMENT_STATE_AVATAR
      } else if (x >= buttonPositions[0].x && x < buttonPositions[0].x + buttonSize && y >= buttonPositions[0].y && y < buttonPositions[0].y + buttonSize) {
        // Personal information
        canvasMoveUse = MOVEMENT_STATE_INFO
      } else if (x >= buttonPositions[1].x && x < buttonPositions[1].x + buttonSize && y >= buttonPositions[1].y && y < buttonPositions[1].y + buttonSize) {
        // Backpack
        canvasMoveUse = MOVEMENT_STATE_BACKPACK
      } else if (x >= buttonPositions[2].x && x < buttonPositions[2].x + buttonSize && y >= buttonPositions[2].y && y < buttonPositions[2].y + buttonSize) {
        // Members
        canvasMoveUse = MOVEMENT_STATE_MEMBERS
        // TBD
      } else if (x >= buttonPositions[3].x && x < buttonPositions[3].x + buttonSize && y >= buttonPositions[3].y && y < buttonPositions[3].y + buttonSize) {
        // Settings
        canvasMoveUse = MOVEMENT_STATE_SETTINGS
      } else if (x >= recordButtonPosition.x && x < (recordButtonPosition.x + smallButtonSize) && y >= recordButtonPosition.y && y < (recordButtonPosition.y + smallButtonSize)) {
        // Voice record
        canvasMoveUse = MOVEMENT_STATE_RECORDER
        this.recordStart()
      } else {
        if (useWheel) {
          // New movement system 24/02/12
          if (Math.pow(wheel1Position.x - x, 2) + Math.pow(wheel1Position.y - y, 2) <= Math.pow(wheel1Radius, 2)) {
            canvasMoveUse = MOVEMENT_STATE_MOVING
            this.updatePointer(x, y)
          }
        } else {
          // Old movement system 24/02/12
          for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i]
            if (Math.pow(positions.pointer.x - block.x, 2) + Math.pow((positions.pointer.y + 0.5) - block.y, 2) > Math.pow(MIN_CLICK_DISTANCE_BLOCK_POINTER, 2)) {
              // Distance between object and pointer is not close enough 24/02/13
              // Maybe it should be allowed to cancel focus? 23/09/04
              continue
            }
            if (this.startInteraction(block)) {
              break
            }
          }
          this.updatePointer(x, y)
        }
      }
    },
    startInteraction (block) {
      if (block.type == BLOCK_TYPE_PLAYER) {
        if (block.id != userCode) {
          interactionInfo = {
            type: block.type,
            id: block.id,
            code: block.code,
            list: [INTERACTION_TALK, INTERACTION_FLIRT, INTERACTION_ATTACK]
          }
          this.fillInteractionList()
          return true
        }
      } else if (block.type == BLOCK_TYPE_DROP) {
        this.useDrop(block)
        return true
      } else if (block.type == BLOCK_TYPE_BED) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_SLEEP]
        }
        this.fillInteractionList()
        return true
      } else if (block.type == BLOCK_TYPE_TOILET) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE, INTERACTION_DRINK]
        }
        this.fillInteractionList()
        return true
      } else if (block.type == BLOCK_TYPE_DRESSER) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_SET]
        }
        this.fillInteractionList()
        return true
      } else if (block.type == BLOCK_TYPE_WORKSHOP) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE]
        }
        this.fillInteractionList()
        return true
      } else if (block.type == BLOCK_TYPE_GAME) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE]
        }
        this.fillInteractionList()
        return true
      } else if (block.type == BLOCK_TYPE_STORAGE) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_EXCHANGE]
        }
        this.fillInteractionList()
        return true
      } else if (block.type == BLOCK_TYPE_COOKER) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE]
        }
        this.fillInteractionList()
        return true
      } else if (block.type == BLOCK_TYPE_SINK) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE, INTERACTION_DRINK]
        }
        this.fillInteractionList()
        return true
      }
      return false
    },
    resetHandlePosition () {
      if (useWheel) {
        handle1Position = { x: wheel1Position.x, y: wheel1Position.y }
      }
    },
    updatePointer (x, y) {
      if (useWheel) {
        this.resetHandlePosition()
        if (canvasMoveUse === MOVEMENT_STATE_MOVING) {
          var distance = Math.sqrt(Math.pow(x - wheel1Position.x, 2) + Math.pow(y - wheel1Position.y, 2))
          distance = Math.max(distance, wheel1Radius / 2)
          handle1Position.x += (x - wheel1Position.x) * (wheel1Radius / 2) / distance
          handle1Position.y += (y - wheel1Position.y) * (wheel1Radius / 2) / distance
          positions.pointer.x = playerInfo.coordinate.x + x - wheel1Position.x
          positions.pointer.y = playerInfo.coordinate.y + y - wheel1Position.y
        }
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
    canvasMove (x, y) {
      if (webStage !== WEB_STAGE_INITIALIZED) {
        return
      }
      this.updatePointer(x, y)
    },
    canvasUp () {
      this.canvasLeave()
    },
    canvasLeave () {
      if (webStage !== WEB_STAGE_INITIALIZED) {
        return
      }
      playerInfo.speed = {
        x: 0,
        y: 0
      }
      if (canvasMoveUse === MOVEMENT_STATE_RECORDER) {
        this.recordEnd()
        canvasMoveUse = MOVEMENT_STATE_IDLE
      } else if (canvasMoveUse !== MOVEMENT_STATE_MOVING && canvasMoveUse !== MOVEMENT_STATE_AVATAR) {
        // No effect
      } else {
        canvasMoveUse = MOVEMENT_STATE_IDLE
      }
      this.resetHandlePosition()
    },
    useDrop (newDrop) {
      webSocketMessageDetail.functions.useDrop = { 
        id: newDrop.id
      }
    },
    detectCollision (p1, p2, p3, distance) {
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
        return
      }
      if (Math.sqrt(Math.pow(p3.x - (p1.x + playerInfo.speed.x), 2) + Math.pow(p3.y - (p1.y + playerInfo.speed.y), 2)) < distance) {
        // Too close
        playerInfo.speed.x = 0
        playerInfo.speed.y = 0
      }
      var verticalDistance = Math.abs(coefficientA * p3.x + coefficientB * p3.y + coefficientC) 
      / Math.sqrt(Math.pow(coefficientA, 2) + Math.pow(coefficientB, 2))
      if (verticalDistance >= distance) {
        // Never get touched
        return
      }
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
    detectCollisionSquare (p1, p2, p3, distance, sideLength) {
      if (Math.abs(p3.x - p1.x) < distance + sideLength / 2 && Math.abs(p3.y - p1.y) < distance + sideLength / 2) {
        // Already overlapped
        return
      }
      if (Math.abs(p3.x - p2.x) < distance + sideLength / 2 && Math.abs(p3.y - p2.y) <= distance + sideLength / 2) {
        // Too close
        playerInfo.speed.x = 0
        playerInfo.speed.y = 0
      }
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
    playerMoveFour () {
      if (canvasMoveUse !== MOVEMENT_STATE_MOVING || Math.pow(positions.pointer.x - playerInfo.coordinate.x, 2) + Math.pow(positions.pointer.y - playerInfo.coordinate.y, 2) < Math.pow(MIN_MOVE_DISTANCE_POINTER_PLAYER, 2)) {
        playerInfo.speed.x = 0
        playerInfo.speed.y = 0
        return
      }
      // Speed up
      var speed = Math.sqrt(Math.pow(playerInfo.speed.x, 2) + Math.pow(playerInfo.speed.y, 2)) + playerInfo.acceleration
      if (this.isDef(playerInfo.vp) && playerInfo.vp > 0) {
        speed = Math.min(playerInfo.maxSpeed, speed)
      } else {
        speed = Math.min(playerInfo.maxSpeed * 0.5, speed)
      }
      if (speed === 0) {
        playerInfo.speed.x = 0
        playerInfo.speed.y = 0
      } else {
        playerInfo.speed.x = speed * (positions.pointer.x - playerInfo.coordinate.x) / Math.sqrt(Math.pow(positions.pointer.x - playerInfo.coordinate.x, 2) + Math.pow(positions.pointer.y - playerInfo.coordinate.y, 2))
        playerInfo.speed.y = speed * (positions.pointer.y - playerInfo.coordinate.y) / Math.sqrt(Math.pow(positions.pointer.x - playerInfo.coordinate.x, 2) + Math.pow(positions.pointer.y - playerInfo.coordinate.y, 2))
      }
      playerInfo.faceDirection = this.calculateAngle(playerInfo.speed.x, playerInfo.speed.y)

      const radius = 0.1
      var newCoordinate = { sceneCoordinate: {}, coordinate: {}, regionNo: playerInfo.regionNo }
      newCoordinate.sceneCoordinate.x = playerInfo.sceneCoordinate.x
      newCoordinate.sceneCoordinate.y = playerInfo.sceneCoordinate.y
      newCoordinate.coordinate.x = playerInfo.coordinate.x + playerInfo.speed.x
      newCoordinate.coordinate.y = playerInfo.coordinate.y + playerInfo.speed.y
      for (var i = 0; i < blocks.length; i++) {
        if (playerInfo.speed.x === 0 && playerInfo.speed.y === 0) {
          // No speed
          break
        }
        if (blocks[i].type == BLOCK_TYPE_PLAYER) {
          if (blocks[i].id != userCode) {
            // Player himself is to be past
            this.detectCollision(playerInfo.coordinate, newCoordinate.coordinate, blocks[i], radius * 2)
            newCoordinate.coordinate.x = playerInfo.coordinate.x + playerInfo.speed.x
            newCoordinate.coordinate.y = playerInfo.coordinate.y + playerInfo.speed.y
          }
        } else if (blocks[i].type == BLOCK_TYPE_TELEPORT) {
          if (Math.abs(blocks[i].x - playerInfo.coordinate.x) < 0.5 && Math.abs(blocks[i].y - 0.5 - playerInfo.coordinate.y) < 0.5) {
            newCoordinate.regionNo = blocks[i].to.regionNo
            newCoordinate.sceneCoordinate = blocks[i].to.sceneCoordinate
            newCoordinate.coordinate = blocks[i].to.coordinate
            playerInfo.speed.x = 0
            playerInfo.speed.y = 0
            canvasMoveUse = MOVEMENT_STATE_IDLE
            break
          }
        } else if (blocks[i].type != BLOCK_TYPE_GROUND && blocks[i].type != BLOCK_TYPE_DROP && blocks[i].type != BLOCK_TYPE_GROUND_DECORATION 
            && blocks[i].type != BLOCK_TYPE_WALL_DECORATION && blocks[i].type != BLOCK_TYPE_CEILING_DECORATION && blocks[i].type != BLOCK_TYPE_HOLLOW_WALL) {
          this.detectCollisionSquare(playerInfo.coordinate, newCoordinate.coordinate, { x: blocks[i].x, y: blocks[i].y - 0.5 }, radius, 1)
          newCoordinate.coordinate.x = playerInfo.coordinate.x + playerInfo.speed.x
          newCoordinate.coordinate.y = playerInfo.coordinate.y + playerInfo.speed.y
        }
      }
      // Teleport destination cannot be adjusted 23/09/04
      if (playerInfo.regionNo == newCoordinate.regionNo) {
        this.adjustSceneCoordinate(newCoordinate)
      }

      // Scene has changed
      if (playerInfo.regionNo != newCoordinate.regionNo 
          || playerInfo.sceneCoordinate.x != newCoordinate.sceneCoordinate.x 
          || playerInfo.sceneCoordinate.y != newCoordinate.sceneCoordinate.y) {
        for (i = 0; i < sceneInfos.length; i++) {
          // Unable to detect names from new region 24/02/01
          // if (sceneInfos[i].sceneCoordinate.x == newCoordinate.sceneCoordinate.x && sceneInfos[i].sceneCoordinate.y == newCoordinate.sceneCoordinate.y) {
          //   this.addChat('来到【'+ sceneInfos[i].name +'】')
          // }
        }
      }

      // Update coordinates
      positions.pointer.x += playerInfo.speed.x
      positions.pointer.y += playerInfo.speed.y
      playerInfo.regionNo = newCoordinate.regionNo
      playerInfo.sceneCoordinate.x = newCoordinate.sceneCoordinate.x
      playerInfo.sceneCoordinate.y = newCoordinate.sceneCoordinate.y
      playerInfo.coordinate.x = newCoordinate.coordinate.x
      playerInfo.coordinate.y = newCoordinate.coordinate.y

      // Randomly get item
      if (Math.random() <= 0.01) {
        var timestamp = new Date().valueOf()
        if (timestamp % 150 < 150) {
          var itemName = ITEM_CHARACTER_JUNK
          if (timestamp % 150 + 1 < 10) {
            itemName += '00'
          } else if (timestamp % 150 + 1 < 100) {
            itemName += '0'
          }
          itemName += (timestamp % 150 + 1)
          this.getItems(itemName, 1)
          this.getPreservedItems('t001', 1)
          this.getPreservedItems('t002', 1)
          this.getPreservedItems('t003', 1)
          this.getPreservedItems('a001', 1)
          this.getPreservedItems('a002', 1)
          this.getPreservedItems('a003', 1)
          this.getPreservedItems('a004', 1)
          this.getPreservedItems('a005', 1)
          this.getPreservedItems('a006', 1)
          this.getPreservedItems('a007', 1)
          this.getPreservedItems('a008', 1)
          this.getPreservedItems('a009', 1)
          this.getPreservedItems('a010', 1)
          this.getPreservedItems('a011', 1)
          this.getPreservedItems('a012', 1)
          this.getPreservedItems('a013', 1)
          this.getPreservedItems('c001', 1)
          this.getPreservedItems('c002', 1)
          this.getPreservedItems('c003', 1)
          this.getPreservedItems('c004', 1)
          this.getPreservedItems('n001', 1)
          this.getPreservedItems('r001', 1)
        }
      }
    },
    adjustSceneCoordinate (newCoordinate) {
      while (newCoordinate.coordinate.y < -1) {
        newCoordinate.sceneCoordinate.y -= 1
        newCoordinate.coordinate.y += height
      }
      while (newCoordinate.coordinate.y >= height - 1) {
        newCoordinate.sceneCoordinate.y += 1
        newCoordinate.coordinate.y -= height
      }
      while (newCoordinate.coordinate.x < -0.5) {
        newCoordinate.sceneCoordinate.x -= 1
        newCoordinate.coordinate.x += width
      }
      while (newCoordinate.coordinate.x >= width -0.5) {
        newCoordinate.sceneCoordinate.x += 1
        newCoordinate.coordinate.x -= width
      }
    },
    resizeCanvas () {
      canvas.width = document.documentElement.clientWidth
      canvas.height = document.documentElement.clientHeight
      // console.log('New size: ' + canvas.width + '*' + canvas.height)
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
      if (scope === SCOPE_GLOBAL) {
        this.addChat(playerInfo.nickname + ':[广播]' + content)
      } else if (scope === SCOPE_INDIVIDUAL) {
        var toNickname = '(已离线)'
        if (this.isDef(playerInfos[chatTo])) {
          toNickname = playerInfos[chatTo].nickname
        }
        this.addChat(playerInfo.nickname + ':[to ' + toNickname + ']' + content)
      }
      webSocketMessageDetail.functions.addMessages.push({
         type: MESSAGE_TYPE_PRINTED, 
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
        type: MESSAGE_TYPE_VOICE, 
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
          type: MESSAGE_TYPE_PRINTED, 
          scope: scope, 
          fromUserCode: userCode, 
          toUserCode: chatTo, 
          content: content 
        })
      }
      await this.axios.post(this.api_path + "/sendmsg", requestOptions)
          .then(res => {
        console.info(res)
        if (scope === SCOPE_GLOBAL) {
          this.addChat(playerInfo.nickname + ':[广播]' + content)
        } else if (scope === SCOPE_INDIVIDUAL) {
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
          type: MESSAGE_TYPE_VOICE, 
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
      canvasMoveUse = MOVEMENT_STATE_IDLE
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userCode, token: token })
      }
      this.axios.post(this.api_path + "/logoff", requestOptions)
      this.$router.push('/')
    },
    setPlayerCharacter () {
      canvasMoveUse = MOVEMENT_STATE_IDLE
      webSocketMessageDetail.functions.updatePlayerInfo = playerInfo
      if (webSocketMessageDetail.functions.updatePlayerInfo.playerStatus == PLAYER_STATUS_INIT) {
        webSocketMessageDetail.functions.updatePlayerInfo.playerStatus = PLAYER_STATUS_RUNNING
      }
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
      webSocketMessageDetail.functions.updatePlayerInfo.avatar = document.getElementById('initialization-avatar').value
      if (webStage === WEB_STAGE_INITIALIZING) {
        webStage = WEB_STAGE_INITIALIZED
      }
    },
    interact () {
      var interactionCode = Number(document.getElementById('interactions-list').value)
      if (interactionInfo.type === BLOCK_TYPE_PLAYER) {
        if (interactionCode === INTERACTION_TALK) {
          scope = SCOPE_INDIVIDUAL
          chatTo = interactionInfo.id
        } else if (interactionCode === INTERACTION_ATTACK) {
          // this.addChat('你向' + playerInfos[interactionInfo.id].nickname + '发动了攻击！')
          this.setRelation(userCode, interactionInfo.id, -1, false)
        } else if (interactionCode === INTERACTION_FLIRT) {
          // this.addChat('你向' + playerInfos[interactionInfo.id].nickname + '表示了好感。')
          this.setRelation(userCode, interactionInfo.id, 1, false)
        }
      } else if (interactionInfo.type >= BLOCK_TYPE_BED && interactionInfo.type <= BLOCK_TYPE_SINK) {
        webSocketMessageDetail.functions.interactBlocks.push({
          interactionCode: interactionCode,
          id: interactionInfo.id
        })
        if (interactionCode === INTERACTION_USE) {
          canvasMoveUse = MOVEMENT_STATE_USE
        } else if (interactionCode === INTERACTION_EXCHANGE) {
          canvasMoveUse = MOVEMENT_STATE_EXCHANGE
        } else if (interactionCode === INTERACTION_SLEEP) {
          // this.addChat('你打了一个盹。')
          // playerInfo.vp = playerInfo.vpMax
        } else if (interactionCode === INTERACTION_DRINK) {
          // this.addChat('你痛饮了起来。')
          // playerInfo.thirst = playerInfo.thirstMax
        } else if (interactionCode === INTERACTION_DECOMPOSE) {
          canvasMoveUse = MOVEMENT_STATE_DECOMPOSE
        } else if (interactionCode === INTERACTION_SET) {
          // this.addChat('你捯饬了起来。')
          this.prepareInitialization()
          canvasMoveUse = MOVEMENT_STATE_SET
        }
      }
    },
    quitInteraction () {
      interactionInfo = undefined
      // This is used for manually quiting interactions with special usage events 24/02/14
      canvasMoveUse = MOVEMENT_STATE_IDLE
    },
    setRelation (userCodeA, userCodeB, newRelation, isAbsolute) {
      webSocketMessageDetail.functions.setRelation = { 
        userCode: userCodeA, 
        nextUserCode: userCodeB, 
        newRelation: newRelation, 
        isAbsolute: isAbsolute 
      }
    },
    printText (content, x, y, maxWidth, textAlign) {
      context.save()
      context.textAlign = textAlign
      context.shadowColor = 'black' // 阴影颜色
      context.shadowBlur = 2 // 阴影模糊范围
      context.shadowOffsetX = 2
      context.shadowOffsetY = 2
      context.font = '16px sans-serif'
      context.fillStyle = '#EEEEEE'
      context.fillText(content, x, y, maxWidth)
      context.restore()
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
        left: 350px;
        bottom: 115px;
        opacity:0.75;
        display: none;
    }
    .interactions #interactions-list{
        height: 25px;
        width: 150px;
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
    .terminal{
        opacity: 1;
        display: none;
    }
    .terminal #terminal-text{
        position: absolute;
        left: 110px;
        top: 500px;
        width: 240px;
        height: 80px;
        display: flex;
        font-size: 12px;
    }
    .terminal #terminal-input{
        position: absolute;
        left: 110px;
        top: 585px;
        width: 160px;
        display: flex;
    }
    .terminal #terminal-enter{
        position: absolute;
        left: 270px;
        top: 585px;
        width: 80px;
        display: flex;
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
        top: 300px;
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
