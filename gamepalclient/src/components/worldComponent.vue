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
                <select id="items-type" class="items-type" @change="updateItems();updateInteractedItems()">
                    <option value="0">全部</option>
                    <option value="1">工具</option>
                    <option value="2">装备</option>
                    <option value="3">用品</option>
                    <option value="4">材料</option>
                    <option value="5">弹药</option>
                    <option value="6">笔记</option>
                    <option value="7">录音</option>
                </select>
                <select id="items-name" class="items-name" @change="updateItems();updateInteractedItems()">
                </select>
                <button id="items-choose" class="items-choose" @click="useItem()">使用</button>
                <input id="items-range" type="range" min="0" max="0" value="0"/>
                <textarea  id="items-desc" class="items-desc" value="" readonly/>
                <button id="items-remove" class="items-remove" @click="addDrop()">丢弃</button>
                <div id="items-exchange" class="items-exchange">
                    <button id="items-exchange-put" class="items-exchange-put" @click="exchangeItemForward()">存入</button>
                    <select id="items-exchange-name" class="items-exchange-name" @change="updateItems();updateInteractedItems()">
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
                <input id="settings-blockSize" type="range"/>
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
                正面弧度系数<input id="initialization-coefs-10" type="range" min="0" max="100" value="50"/>
                <br/>
                侧面弧度系数<input id="initialization-coefs-6" type="range" min="0" max="100" value="50"/>
                下颚弧度系数<input id="initialization-coefs-7" type="range" min="0" max="100" value="50"/>
                <br/>
                眼睛高度系数<input id="initialization-coefs-8" type="range" min="0" max="100" value="50"/>
                眼睛间距系数<input id="initialization-coefs-9" type="range" min="0" max="100" value="50"/>
                <br/>
                <button id="initialization-enter" @click="prepareInitializationRandomly()">随机</button>
                <button id="initialization-enter" @click="setPlayerCharacter()">提交</button>
            </div>
        </div>
        <div id="recipes" class="recipes">
            <select id="recipes-type" class="recipes-type" @change="updateRecipes()">
                <option value="0">全部</option>
            </select>
            <select id="recipes-name" class="recipes-name" @change="updateRecipes()">
            </select>
            <button id="recipes-choose" class="recipes-choose" @click="useRecipes()">制作</button>
            <input id="recipes-range" type="range" min="0" max="0" value="0"/>
            <textarea  id="recipes-desc" class="recipes-desc" value="" readonly/>
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
            <img id="buffalo" src="../assets/image/animals/buffalo.png" />
            <img id="fox" src="../assets/image/animals/fox.png" />
            <img id="polarbear" src="../assets/image/animals/polarbear.png" />
            <img id="sheep" src="../assets/image/animals/sheep.png" />
            <img id="tiger" src="../assets/image/animals/tiger.png" />
            <img id="cat" src="../assets/image/animals/cat.png" />
            <img id="dog" src="../assets/image/animals/dog.png" />
            <img id="wolf" src="../assets/image/animals/wolf.png" />
            <img id="wildboar" src="../assets/image/animals/wildboar.png" />
            <img id="horse" src="../assets/image/animals/horse.png" />

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
            <img id="outfits_a_5" src="../assets/image/characters/outfits/a_5.png" />
            <img id="outfits_b_0" src="../assets/image/characters/outfits/b_0.png" />
            <img id="outfits_b_1" src="../assets/image/characters/outfits/b_1.png" />
            <img id="outfits_c_0" src="../assets/image/characters/outfits/c_0.png" />
            <img id="outfits_d_0" src="../assets/image/characters/outfits/d_0.png" />
            <img id="outfits_d_1" src="../assets/image/characters/outfits/d_1.png" />
            <img id="outfits_d_2" src="../assets/image/characters/outfits/d_2.png" />
            <img id="outfits_e_0" src="../assets/image/characters/outfits/e_0.png" />

            <img id="plants" src="../assets/image/scenes/plants.png" />
            <img id="rocks" src="../assets/image/scenes/rocks.png" />

            <img id="buttons" src="../assets/image/buttons.png" />
            <img id="smallButtons" src="../assets/image/small-buttons.png" />
            <img id="buffs" src="../assets/image/buffs.png" />
            <img id="drops" src="../assets/image/drops.png" />
        </div>
  </div>
</template>

<script>

let canvasInfo = {
  canvas: undefined,
  tempCanvas: undefined,
  deltaWidth: undefined,
  deltaHeight: undefined,
  blockSize: undefined,
  canvasMoveUse: undefined,
  isKeyDown: { 0: false, 1: false, 2: false, 3: false, 10: false, 11: false, 12: false, 13: false }, // left 4 + right 4
  pointer: { x: undefined, y: undefined }
}
const menuLeftEdge = 150
const menuRightEdge = 150
const menuTopEdge = 100
const menuBottomEdge = 300
const terminalLeftEdge = menuLeftEdge + 10
const terminalTopEdge = menuTopEdge + 10
let avatarPosition
let buttonPositions
let minimapPosition
let useWheel = true
const wheel1Radius = 100
let wheel1Position
let handle1Position
const wheel2Radius = 100
let wheel2Position
let status1Position
let status2Position
const MAX_STATUS_LINE_SIZE = 100
const STATUS_SIZE = 20

let staticData = {
  items: undefined,
  recipes: undefined
}

let images = {
  effects: undefined,
  animals: undefined,
  avatars: undefined,
  bodies: undefined,
  arms: undefined,
  eyes: undefined,
  hairstyles: undefined,
  tools: undefined,
  outfits: undefined,
  buttons: undefined,
  smallButtons: undefined,
  buffs: undefined,
  drops: undefined,
  scenes: undefined,
  blocks: []
}

let userInfo = {
  webStage: 0,
  userCode: undefined,
  token: undefined,
  websocketMsgSize: 0,
  diffSecond: 0,
  diffMillisecond: 0,
  webSocketMessageDetail: undefined,
  worldInfo: undefined,
  regionInfo: undefined,
  miniMap: undefined,
  sceneInfos: undefined,
  sceneInfo: undefined,
  playerInfos: undefined,
  playerInfo: undefined, // This is used for smooth player movement
  movementMode: 0,
  flags: undefined,
  bagInfo: undefined,
  interactedBagInfo: undefined,
  relations: undefined,
  interactionInfo: undefined,
  blocks: undefined,
  grids: undefined,
  chatMessages: [],
  voiceMessages: []
}

var intervalTimerInit
var intervalTimerWebsocket
var intervalTimer1000
var intervalTimer30000

let terminalOutputs = undefined

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

let movementModeButtonPosition

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
    for (var blockImageId in this.$blockImageIds) {
      // img.src = "../static/image/blocks/" + this.$blockImageIds[blockImageId] + ".png"
      // img.src = this.$images.blocks.get(this.$blockImageIds[blockImageId] + ".png")
      // var img = require("@/assets/image/blocks/" + this.$blockImageIds[blockImageId] + ".png")

      // var img = new Image()
      // img.src = this.$images.blocks1000
      // images.blocks[this.$blockImageIds[blockImageId]] = img

      var imgNode = document.createElement("img")
      imgNode.id = "blockImage" + this.$blockImageIds[blockImageId]
      imgNode.src = require("../assets/image/blocks/" + this.$blockImageIds[blockImageId] + ".png")
      // document.getElementById('hiddenDiv').appendChild(imgNode)
      images.blocks[this.$blockImageIds[blockImageId]] = imgNode
    }
    images.effects = {
      'selectionEffect': document.getElementById('selectionEffect'),
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
    images.animals = [
      images.blocks[3000],
      document.getElementById('paofu'),
      document.getElementById('frog'),
      document.getElementById('monkey'),
      document.getElementById('racoon'),
      document.getElementById('chicken'),
      document.getElementById('buffalo'),
      document.getElementById('fox'),
      document.getElementById('polarbear'),
      document.getElementById('sheep'),
      document.getElementById('tiger'),
      document.getElementById('cat'),
      document.getElementById('dog'),
      document.getElementById('wolf'),
      document.getElementById('wildboar'),
      document.getElementById('horse')
    ]
    images.avatars = document.getElementById('avatars')
    images.bodies = [
      document.getElementById('body_c'),
      document.getElementById('body_m'),
      document.getElementById('body_a'),
      document.getElementById('body_l'),
      document.getElementById('body_b')
    ]
    images.arms = [
      document.getElementById('arms_c'),
      document.getElementById('arms_m'),
      document.getElementById('arms_a'),
      document.getElementById('arms_l'),
      document.getElementById('arms_b')
    ]
    images.eyes = document.getElementById('eyes')
    images.hairstyles = [
      document.getElementById('hairstyle_black'),
      document.getElementById('hairstyle_grey'),
      document.getElementById('hairstyle_orange')
    ]
    images.tools = [
      document.getElementById('tools_s'),
      document.getElementById('tools_m'),
      document.getElementById('tools_l')
    ]
    images.outfits = [
      [
        document.getElementById('outfits_a_0'), 
        document.getElementById('outfits_a_1'), 
        document.getElementById('outfits_a_2'), 
        document.getElementById('outfits_a_3'), 
        document.getElementById('outfits_a_4'), 
        document.getElementById('outfits_a_5')
      ],
      [
        document.getElementById('outfits_b_0'),
        document.getElementById('outfits_b_1')
      ],
      [document.getElementById('outfits_c_0')],
      [
        document.getElementById('outfits_d_0'), 
        document.getElementById('outfits_d_1'), 
        document.getElementById('outfits_d_2')
      ],
      [document.getElementById('outfits_e_0')]
    ]
    images.scenes = {
      'p': document.getElementById('plants'),
      'r': document.getElementById('rocks')
    }
    images.buttons = document.getElementById('buttons')
    images.smallButtons = document.getElementById('smallButtons')
    images.buffs = document.getElementById('buffs')
    images.drops = document.getElementById('drops')
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
        userInfo.userCode = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
        //Sync token from sessionStorage
        userInfo.token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
        this.initWebSocket()
      }
    }, 1000)
  },
  destroy () {
    this.logoff()
  },
  methods: {
    async initWeb () {
      canvasInfo.canvas = document.getElementById('canvas')
      canvasInfo.tempCanvas = document.getElementById('temp-canvas')
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      // canvasInfo.canvas.addEventListener('contextmenu', function(e) {
        canvasInfo.canvas.style.display = 'inline'
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
      document.getElementById('settings-blockSize').min = this.$constants.MIN_BLOCK_SIZE
      document.getElementById('settings-blockSize').max = this.$constants.MAX_BLOCK_SIZE
      document.getElementById('settings-blockSize').step = 10
      canvasInfo.blockSize = this.$constants.DEFAULT_BLOCK_SIZE
      document.getElementById('settings-blockSize').value = canvasInfo.blockSize
      document.getElementById('settings-music').checked = !musicMuted
      document.getElementById('settings-sound').checked = !soundMuted

      this.initTimers()
    },
    keyUpEventHandler(event) {
      if ((canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_IDLE && canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVING) || isChatting) {
        return
      }
      event.preventDefault()
      if (event.key === 'w' || event.key === 'W') {
         canvasInfo.isKeyDown[0] = false
      } else if (event.key === 'a' || event.key === 'A') {
         canvasInfo.isKeyDown[1] = false
      } else if (event.key === 'd' || event.key === 'D') {
         canvasInfo.isKeyDown[2] = false
      } else if (event.key === 's' || event.key === 'S') {
         canvasInfo.isKeyDown[3] = false
      } else if (event.key === 'ArrowUp') {
         canvasInfo.isKeyDown[10] = false
      } else if (event.key === 'ArrowLeft') {
         canvasInfo.isKeyDown[11] = false
      } else if (event.key === 'ArrowRight') {
         canvasInfo.isKeyDown[12] = false
      } else if (event.key === 'ArrowDown') {
         canvasInfo.isKeyDown[13] = false
      }
      if (userInfo.playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING && ! canvasInfo.isKeyDown[0] && ! canvasInfo.isKeyDown[1] && ! canvasInfo.isKeyDown[2] && ! canvasInfo.isKeyDown[3]) {
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
        this.setHandlePosition(wheel1Position.x, wheel1Position.y)
      }
    },
    keyDownEventHandler(event) {
      if ((canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_IDLE && canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVING) || isChatting) {
        return
      }
      event.preventDefault()
      if (event.key === 'w' || event.key === 'W') {
         canvasInfo.isKeyDown[0] = true
      } else if (event.key === 'a' || event.key === 'A') {
         canvasInfo.isKeyDown[1] = true
      } else if (event.key === 'd' || event.key === 'D') {
         canvasInfo.isKeyDown[2] = true
      } else if (event.key === 's' || event.key === 'S') {
         canvasInfo.isKeyDown[3] = true
      } else if (event.key === 'ArrowUp') {
         canvasInfo.isKeyDown[10] = true
      } else if (event.key === 'ArrowLeft') {
         canvasInfo.isKeyDown[11] = true
      } else if (event.key === 'ArrowRight') {
         canvasInfo.isKeyDown[12] = true
      } else if (event.key === 'ArrowDown') {
         canvasInfo.isKeyDown[13] = true
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
      intervalTimerWebsocket = setInterval(() => {
        // if (this.websocket.readyState === 1) {
          this.sendWebsocketMessage()
        // }
      }, this.$constants.WEBSOCKET_PERIOD_IN_MS)
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
          // + this.$hostQa
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
      if (response.userCode != userInfo.userCode) {
        console.log('Message is ignored due to wrong userInfo.userCode.')
        return
      }

      // Check token
      if (response.token != userInfo.token) {
        console.log('Log off due to invalid token.')
        this.logoff()
      }

      // Check timestamp
      var date = new Date()
      // var timestamp = date.valueOf()
      var currentSecond = date.getSeconds()
      var currentMillisecond = date.getMilliseconds()
      if (this.isDef(userInfo.worldInfo) && response.worldInfo.worldTime != userInfo.worldInfo.worldTime) {
        userInfo.diffSecond = currentSecond - response.currentSecond
        userInfo.diffMillisecond = currentMillisecond - response.currentMillisecond
        if (this.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING
        && userInfo.diffSecond > 15) {
          console.log('Connection lost.')
          this.logoff()
        }
        userInfo.websocketMsgSize = e.data.length
      }

      // Update staticData 24/05/05
      if (userInfo.webStage == this.$constants.WEB_STAGE_START) {
        staticData = response.staticData
      }

      // Update world information
      userInfo.worldInfo = response.worldInfo
      userInfo.playerInfos = response.playerInfos
      var originPlayerInfo = userInfo.playerInfo
      userInfo.playerInfo = userInfo.playerInfos[userInfo.userCode]
      userInfo.flags = response.flags
      userInfo.bagInfo = response.bagInfo
      userInfo.interactedBagInfo = response.interactedBagInfo

      if (userInfo.webStage == this.$constants.WEB_STAGE_START) {
        this.initWeb()
        if (this.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == this.$constants.PLAYER_STATUS_INIT) {
          // Character initialization
          this.prepareInitialization(userInfo.playerInfo)
          userInfo.webStage = this.$constants.WEB_STAGE_INITIALIZING
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_SET
        } else {
          userInfo.webStage = this.$constants.WEB_STAGE_INITIALIZED
        }
      } else if (userInfo.webStage == this.$constants.WEB_STAGE_INITIALIZING) {
        // Nothing
      } else if (userInfo.webStage == this.$constants.WEB_STAGE_INITIALIZED) {
        if (!userInfo.flags[this.$constants.FLAG_UPDATE_MOVEMENT]) {
          userInfo.playerInfo.regionNo = originPlayerInfo.regionNo
          userInfo.playerInfo.sceneCoordinate = originPlayerInfo.sceneCoordinate
          userInfo.playerInfo.coordinate = originPlayerInfo.coordinate
          userInfo.playerInfo.speed = originPlayerInfo.speed
          userInfo.playerInfo.faceDirection = originPlayerInfo.faceDirection
        }
        // Without this, the figure will shake during the game 24/03/17
        userInfo.playerInfo.playerStatus = this.$constants.PLAYER_STATUS_RUNNING
      }

      userInfo.relations = response.relations

      // Flags
      if (userInfo.flags[this.$constants.FLAG_UPDATE_ITEMS]) {
        this.updateItems()
      }
      if (userInfo.flags[this.$constants.FLAG_UPDATE_INTERACTED_ITEMS]) {
        this.updateInteractedItems()
      }
      if (userInfo.flags[this.$constants.FLAG_UPDATE_RECIPES]) {
        this.updateRecipes()
      }

      // Update Map info
      var isRegionChanged = false
      if (!this.isDef(userInfo.regionInfo) || userInfo.regionInfo.regionNo != response.regionInfo.regionNo) {
        isRegionChanged = true
      }
      // var isSceneChanged = isRegionChanged
      // if (!this.isDef(userInfo.sceneInfo) || userInfo.sceneInfo.sceneCoordinate.x != response.sceneInfo.sceneCoordinate.x 
      //     || userInfo.sceneInfo.sceneCoordinate.y != response.sceneInfo.sceneCoordinate.y) {
      //   isSceneChanged = true
      // }
      // if (isSceneChanged) {
      //   this.addChat('来到【'+ response.regionInfo.name + '-' + response.sceneInfo.name +'】')
      // }
      if (isRegionChanged) {
        userInfo.webSocketMessageDetail.functions.updateMiniMap = true
      }
      userInfo.regionInfo = response.regionInfo
      if (this.isDef(response.miniMap)) {
        if (!this.isDef(userInfo.miniMap)) {
          userInfo.miniMap = {}
        }
        if (this.isDef(response.miniMap.background)) {
          userInfo.miniMap.background = response.miniMap.background
        }
        userInfo.miniMap.sceneCoordinate = response.miniMap.sceneCoordinate
      }
      userInfo.sceneInfo = response.sceneInfo
      userInfo.sceneInfos = response.sceneInfos
      userInfo.grids = response.grids
      userInfo.blocks = response.blocks

      // Check functions 24/03/17
      if (this.isDef(response.functions)) {
        if (this.isDef(response.functions.createPlayerInfoInstance)) {
          this.prepareInitialization(response.functions.createPlayerInfoInstance)
        }
      }

      // Check messages
      if (this.isDef(response.messages)) {
        for (let i = 0; i < response.messages.length; i++) {
          var message = response.messages[i]
          var fromUserCode = message.fromUserCode
          if (message.type == this.$constants.MESSAGE_TYPE_PRINTED) {
            var fromNickname = '[已离线]'
            if (this.isDef(userInfo.playerInfos[fromUserCode])) {
              fromNickname = userInfo.playerInfos[fromUserCode].nickname
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
            userInfo.voiceMessages.push(message.content)
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
        if ( canvasInfo.isKeyDown[i]) {
          this.wheelKeyDown(i)
        }
      }
      for (let i = 10; i <= 13; i++) {
        if ( canvasInfo.isKeyDown[i]) {
          this.wheelKeyDown(i)
        } else {
          this.wheelKeyUp(i)
        }
      }

      this.show()
      this.fixSceneCoordinate(userInfo.playerInfo)
      // Update coordinates 24/03/06
      // settleSpeed() must be after show() to avoid abnormal display while changing scenes or regions
      canvasInfo.pointer.x += userInfo.playerInfo.speed.x
      canvasInfo.pointer.y += userInfo.playerInfo.speed.y
      if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVING 
      || userInfo.playerInfo.buff[this.$constants.BUFF_CODE_DEAD] != 0
      || Math.pow(canvasInfo.pointer.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - userInfo.playerInfo.coordinate.y, 2) < Math.pow(this.$constants.MIN_MOVE_DISTANCE_POINTER_PLAYER, 2)) {
        userInfo.playerInfo.speed.x = 0
        userInfo.playerInfo.speed.y = 0
      } else {
        this.settleSpeed(userInfo.userCode, userInfo.playerInfo)
        // Randomly get item
        // if (Math.random() <= 0.01) {
        //   if (timestamp % 150 < 150) {
        //     var itemName = this.$constants.ITEM_CHARACTER_JUNK
        //     if (timestamp % 150 + 1 < 10) {
        //       itemName += '00'
        //     } else if (timestamp % 150 + 1 < 100) {
        //       itemName += '0'
        //     }
        //     itemName += (timestamp % 150 + 1)
        //     this.getItems(itemName, 1)
        //     this.getItems('c031', 10)
        //     this.getItems('c026', 10)
        //     this.getPreservedItems('t101', 1)
        //     this.getPreservedItems('t201', 1)
        //     this.getPreservedItems('t202', 1)
        //     this.getPreservedItems('t203', 1)
        //     this.getItems('t204', 1)
        //     this.getItems('t205', 1)
        //     this.getItems('t226', 1)
        //     this.getItems('t227', 1)
        //     this.getItems('t006', 1)
        //     this.getItems('t007', 1)
        //     this.getItems('t008', 1)
        //     this.getItems('o001', 1)
        //     this.getItems('o002', 1)
        //     this.getItems('o003', 1)
        //     this.getItems('o004', 1)
        //     this.getItems('o005', 1)
        //     this.getItems('c001', 1)
        //     this.getItems('c002', 1)
        //     this.getItems('c003', 1)
        //     this.getItems('c004', 1)
        //     this.getItems('n001', 1)
        //     this.getItems('r001', 1)
        //   }
        // }
      }
    },
    logoff () {
      console.log('Log off.')
      this.websocket.close()
      // this.shutDown()
    },
    sendWebsocketMessage () {
      // if (userInfo.webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        // return
      // }
      this.websocket.send(JSON.stringify(userInfo.webSocketMessageDetail))
      this.resetWebSocketMessageDetail()
      if (userInfo.webStage !== this.$constants.WEB_STAGE_START) {
        if (!this.isDef(userInfo.playerInfo) || userInfo.playerInfo.playerStatus == this.$constants.PLAYER_STATUS_INIT) {
          userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter = userInfo.playerInfo
        } else if (userInfo.playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING) {
          userInfo.webSocketMessageDetail.functions.updatePlayerMovement = userInfo.playerInfo
        }
      }
    },
    resetWebSocketMessageDetail () {
      userInfo.webSocketMessageDetail = {
        webStage: userInfo.webStage,
        userCode: userInfo.userCode,
        state: 1,
        functions: {
          addMessages: [],
          addDrops: [],
          useDrop: undefined,
          setRelation: undefined,
          useItems: [],
          getItems: [],
          getPreservedItems: [],
          getInteractedItems: [],
          useRecipes: [],
          updateInteraction: undefined,
          interactBlocks: [],
          addEvents: [],
          terminalInputs: [],
          useSkills: [false, false, false, false],
          createPlayerInfoInstance: undefined,
          updatePlayerMovement: undefined,
          setMember: undefined,
          updateMiniMap: undefined
        },
      }
    },
    show () {
      // Region/scene smooth correction 24/08/26
      if (userInfo.regionInfo.regionNo !== userInfo.playerInfo.regionNo) {
        return
      }
      if (userInfo.sceneInfo.sceneCoordinate.x !== userInfo.playerInfo.sceneCoordinate.x || userInfo.sceneInfo.sceneCoordinate.y !== userInfo.playerInfo.sceneCoordinate.y) {
        return
      }

      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      context.clearRect(0, 0, canvasInfo.canvas.width, canvasInfo.canvas.height)
      canvasInfo.deltaWidth = canvasInfo.canvas.width / 2 - userInfo.playerInfo.coordinate.x * canvasInfo.blockSize
      canvasInfo.deltaHeight = canvasInfo.canvas.height / 2 - userInfo.playerInfo.coordinate.y * canvasInfo.blockSize
      var timestamp = new Date().valueOf()

      // Draw grid blocks
      this.drawGridBlock()
  
      // Print blocks
      var blockToInteract = undefined
      var blockToInteractDistance = this.$constants.MIN_INTERACTION_DISTANCE + 1
      for (var i = 0; i < userInfo.blocks.length; i++) {
        var block = userInfo.blocks[i]

        // Check drop
        if (block.type == this.$constants.BLOCK_TYPE_DROP && Math.pow(block.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(block.y - userInfo.playerInfo.coordinate.y, 2) <= Math.pow(this.$constants.MIN_DROP_INTERACTION_DISTANCE, 2)) {
          this.useDrop(block)
        }
        // Check interaction
        if (block.id != userInfo.userCode && this.checkBlockTypeInteractive(block.type)) {
          if (useWheel) {
            var distance = Math.sqrt(Math.pow(block.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(block.y - userInfo.playerInfo.coordinate.y, 2))
            if (Math.abs(userInfo.playerInfo.faceDirection - this.calculateAngle(block.x - userInfo.playerInfo.coordinate.x, block.y - userInfo.playerInfo.coordinate.y)) <= this.$constants.MIN_INTERACTION_ANGLE && distance <= this.$constants.MIN_INTERACTION_DISTANCE) {
              if ((!this.isDef(blockToInteract) || distance < blockToInteractDistance)) {
                blockToInteract = block
                blockToInteractDistance = distance
              }
            }
          } else {
            if (this.isDef(userInfo.interactionInfo)) {
              if (block.type == userInfo.interactionInfo.type && block.id == userInfo.interactionInfo.id && block.code == userInfo.interactionInfo.code) {
                context.drawImage(images.effects['selectionEffect'], Math.floor(timestamp / 100) % 10 * this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, 0 * this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, 
                (block.x - 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
                (block.y - 1) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
                canvasInfo.blockSize,
                canvasInfo.blockSize)
                if (Math.pow(block.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(block.y - userInfo.playerInfo.coordinate.y, 2) > Math.pow(this.$constants.MIN_INTERACTION_DISTANCE, 2)) {
                  userInfo.interactionInfo = undefined
                }
              }
              document.getElementById('interactions').style.display = 'inline'
            } else {
              document.getElementById('interactions').style.display = 'none'
            }
          }
        }
        if (block.type == this.$constants.BLOCK_TYPE_PLAYER) {
          this.drawCharacter(userInfo.playerInfos[block.id], block.x - 0.5, block.y - 1, canvasInfo.blockSize)
        } else {
          this.drawBlock(block)
        }
      }
      // Show interactions (new)
      if (useWheel) {
        if (this.isDef(blockToInteract) && (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_IDLE || canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_MOVING)) {
          this.startInteraction(blockToInteract)
          context.drawImage(images.effects['selectionEffect'], Math.floor(timestamp / 100) % 10 * this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, 0 * this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, 
          (blockToInteract.x - 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
          (blockToInteract.y - 1) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
          canvasInfo.blockSize,
          canvasInfo.blockSize)
          document.getElementById('interactions').style.display = 'inline'
        } else {
          document.getElementById('interactions').style.display = 'none'
        }
      }
      this.showOther()
    },
    showOther () {
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      // Show worldTime
      var hour = Math.floor(userInfo.worldInfo.worldTime / 3600)
      var minute = Math.floor(userInfo.worldInfo.worldTime / 60) % 60
      this.printText('Time: ' + (hour % 12) + ':' + minute + ' ' + (hour >= 12 ? 'PM' : 'AM'), canvasInfo.canvas.width / 2, this.$constants.DEFAULT_BUTTON_SIZE / 2, this.$constants.DEFAULT_BUTTON_SIZE * 2, 'center')

      // Region map

      // Show avater
      this.drawAvatar(avatarPosition.x * canvasInfo.blockSize, avatarPosition.y * canvasInfo.blockSize, this.$constants.DEFAULT_AVATAR_SIZE, userInfo.playerInfo.avatar, userInfo.playerInfo.nameColor)
      var topBossId = this.findTopBossId(userInfo.playerInfo)
      if (this.isDef(topBossId) && topBossId != userInfo.userCode) {
        this.drawAvatar(avatarPosition.x * canvasInfo.blockSize, avatarPosition.y * canvasInfo.blockSize, this.$constants.DEFAULT_AVATAR_SIZE / 2, userInfo.playerInfos[topBossId].avatar, userInfo.playerInfos[topBossId].nameColor)
      }
      
      // Show buttons
      if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_INFO) {
        context.drawImage(images.buttons, 0 * this.$constants.DEFAULT_BUTTON_SIZE, 0 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, buttonPositions[0].x, buttonPositions[0].y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      } else {
        context.drawImage(images.buttons, 0 * this.$constants.DEFAULT_BUTTON_SIZE, 1 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, buttonPositions[0].x, buttonPositions[0].y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      }
      if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_BACKPACK) {
        context.drawImage(images.buttons, 1 * this.$constants.DEFAULT_BUTTON_SIZE, 0 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, buttonPositions[1].x, buttonPositions[1].y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      } else {
        context.drawImage(images.buttons, 1 * this.$constants.DEFAULT_BUTTON_SIZE, 1 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, buttonPositions[1].x, buttonPositions[1].y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      }
      if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_MEMBERS) {
        context.drawImage(images.buttons, 2 * this.$constants.DEFAULT_BUTTON_SIZE, 0 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, buttonPositions[2].x, buttonPositions[2].y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      } else {
        context.drawImage(images.buttons, 2 * this.$constants.DEFAULT_BUTTON_SIZE, 1 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, buttonPositions[2].x, buttonPositions[2].y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      }
      if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_SETTINGS) {
        context.drawImage(images.buttons, 3 * this.$constants.DEFAULT_BUTTON_SIZE, 0 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, buttonPositions[3].x, buttonPositions[3].y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      } else {
        context.drawImage(images.buttons, 3 * this.$constants.DEFAULT_BUTTON_SIZE, 1 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, buttonPositions[3].x, buttonPositions[3].y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      }
      var imageX
      if (userInfo.movementMode === this.$constants.MOVEMENT_MODE_STAND_GROUND) {
        imageX = 4
      } else if (userInfo.movementMode === this.$constants.MOVEMENT_MODE_WALK) {
        imageX = 5
      } else {
        imageX = 6
      }
      if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVEMENT_MODE) {
        context.drawImage(images.buttons, imageX * this.$constants.DEFAULT_BUTTON_SIZE, 0 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, movementModeButtonPosition.x, movementModeButtonPosition.y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      } else {
        context.drawImage(images.buttons, imageX * this.$constants.DEFAULT_BUTTON_SIZE, 1 * this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE, movementModeButtonPosition.x, movementModeButtonPosition.y, this.$constants.DEFAULT_BUTTON_SIZE, this.$constants.DEFAULT_BUTTON_SIZE)
      }

      // Show minimap
      this.drawMinimap()

      // Show status1
      if (this.isDef(userInfo.playerInfo.nickname) && this.isDef(userInfo.playerInfo.lastName) && this.isDef(userInfo.playerInfo.firstName)) {
        this.printText('Lv.' + userInfo.playerInfo.level + ' ' + userInfo.playerInfo.nickname + '(' + userInfo.playerInfo.lastName + ',' + userInfo.playerInfo.firstName + ')', status1Position.x, status1Position.y + 1 * STATUS_SIZE, this.$constants.DEFAULT_BUTTON_SIZE * 5, 'left')
      } else {
        this.printText('Lv.' + userInfo.playerInfo.level, status1Position.x, status1Position.y + 1 * STATUS_SIZE, STATUS_SIZE * 10, 'left')
      }
      this.printText('经验值' + userInfo.playerInfo.exp + '/' + userInfo.playerInfo.expMax, status1Position.x, status1Position.y + 2 * STATUS_SIZE, STATUS_SIZE * 10)

      context.save()
      context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
      context.fillStyle = 'rgba(191, 191, 191, 0.5)'
      context.fillRect(status1Position.x, status1Position.y + 2.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * userInfo.playerInfo.exp / userInfo.playerInfo.expMax, STATUS_SIZE * 0.75)
      context.strokeRect(status1Position.x, status1Position.y + 2.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)

      // show status2
      this.printText('生命值' + userInfo.playerInfo.hp + '/' + userInfo.playerInfo.hpMax, status2Position.x, status2Position.y + 1 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      this.printText('活力值' + userInfo.playerInfo.vp + '/' + userInfo.playerInfo.vpMax, status2Position.x, status2Position.y + 3 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      this.printText('饥饿值' + userInfo.playerInfo.hunger + '/' + userInfo.playerInfo.hungerMax, status2Position.x, status2Position.y + 5 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      this.printText('口渴值' + userInfo.playerInfo.thirst + '/' + userInfo.playerInfo.thirstMax, status2Position.x, status2Position.y + 7 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      context.fillStyle = 'rgba(191, 191, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 1.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * userInfo.playerInfo.hp / userInfo.playerInfo.hpMax, STATUS_SIZE * 0.75)
      context.fillStyle = 'rgba(0, 191, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 3.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * userInfo.playerInfo.vp / userInfo.playerInfo.vpMax, STATUS_SIZE * 0.75)
      context.fillStyle = 'rgba(191, 0, 0, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 5.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * userInfo.playerInfo.hunger / userInfo.playerInfo.hungerMax, STATUS_SIZE * 0.75)
      context.fillStyle = 'rgba(0, 0, 191, 0.5)'
      context.fillRect(status2Position.x, status2Position.y + 7.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE * userInfo.playerInfo.thirst / userInfo.playerInfo.thirstMax, STATUS_SIZE * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 1.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 3.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 5.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      context.strokeRect(status2Position.x, status2Position.y + 7.25 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, STATUS_SIZE * 0.75)
      context.restore()

      var index = 1.5
      for (var i = this.$constants.BUFF_CODE_DEAD; i < this.$constants.BUFF_CODE_LENGTH; i++) {
        if (userInfo.playerInfo.buff[i] != 0) {
          context.drawImage(images.buffs, (i % 10) * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, Math.floor(i / 10) * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.canvas.width - index * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, status2Position.y + 8 * STATUS_SIZE + 0.5 * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE)
          index++
          if (i == this.$constants.BUFF_CODE_DEAD) {
            this.quitInteraction()
          }
        }
      }
      this.printText('Delay: ' + (userInfo.diffSecond * 1000 + userInfo.diffMillisecond) + 'ms', status2Position.x, status2Position.y + 12 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')
      this.printText('Size: ' + (userInfo.websocketMsgSize / 1024).toFixed(1) + 'KB', status2Position.x, status2Position.y + 13 * STATUS_SIZE, MAX_STATUS_LINE_SIZE, 'left')

      // Show chat
      if (showChat) {
        document.getElementById('chat-scope').value = '[广播]'
        if (scope === this.$constants.SCOPE_INDIVIDUAL) {
          for (var playerInfoIndex in userInfo.playerInfos) {
            if (userInfo.playerInfos[playerInfoIndex].id == chatTo) {
              document.getElementById('chat-scope').value = 'To:' + userInfo.playerInfos[playerInfoIndex].nickname
            }
          }
        }
        if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_RECORDER) {
          context.drawImage(images.smallButtons, 0 * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, 0 * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, recordButtonPosition.x, recordButtonPosition.y, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE)
        } else {
          context.drawImage(images.smallButtons, 0 * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, 1 * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, recordButtonPosition.x, recordButtonPosition.y, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE)
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
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_INFO) {
        this.printMenu()
        this.printStatus()
      }
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_BACKPACK) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-choose').style.display = 'inline'
        document.getElementById('items-remove').style.display = 'inline'
        this.printMenu()
        this.printItems()
      }
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_SETTINGS) {
        document.getElementById('settings').style.display = 'inline'
        this.printMenu()
        this.printSettings()
      }
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_EXCHANGE) {
        document.getElementById('items').style.display = 'inline'
        document.getElementById('items-choose').style.display = 'none'
        document.getElementById('items-remove').style.display = 'none'
        document.getElementById('items-exchange').style.display = 'inline'
        this.printMenu()
        this.printExchange()
      }
      document.getElementById('recipes').style.display = 'none'
      document.getElementById('terminal').style.display = 'none'
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_USE) {
        if (this.isDef(userInfo.interactionInfo)) {
          this.printMenu()
          if (userInfo.interactionInfo.type == this.$constants.BLOCK_TYPE_GAME) {
            document.getElementById('terminal').style.display = 'inline'
            this.printTerminal(terminalOutputs, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, canvasInfo.blockSize)
          } else {
            document.getElementById('recipes').style.display = 'inline'
          }
        }
      }
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_SET) {
        document.getElementById('initialization').style.display = 'inline'
        this.printMenu()
        this.printInitialization()
      }
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_MEMBERS) {
        document.getElementById('members').style.display = 'inline'
        this.printMenu()
        this.printMembers()
      }

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
        if ( canvasInfo.isKeyDown[10]) {
          context.fillStyle = 'rgba(255, 255, 255, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, 1.25 * Math.PI, 1.75 * Math.PI)
          context.fill()
        } else {
          context.fillStyle = 'rgba(0, 0, 0, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * Math.max(0, userInfo.playerInfo.skill[0].frame) / userInfo.playerInfo.skill[0].frameMax, 1.25 * Math.PI, 1.75 * Math.PI)
          context.fill()
        }
        if ( canvasInfo.isKeyDown[11]) {
          context.fillStyle = 'rgba(255, 255, 255, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, 0.75 * Math.PI, 1.25 * Math.PI)
          context.fill()
        } else {
          context.fillStyle = 'rgba(0, 0, 0, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * Math.max(0, userInfo.playerInfo.skill[1].frame) / userInfo.playerInfo.skill[1].frameMax, 0.75 * Math.PI, 1.25 * Math.PI)
          context.fill()
        }
        if ( canvasInfo.isKeyDown[12]) {
          context.fillStyle = 'rgba(255, 255, 255, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, -0.25 * Math.PI, 0.25 * Math.PI)
          context.fill()
        } else {
          context.fillStyle = 'rgba(0, 0, 0, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * Math.max(0, userInfo.playerInfo.skill[2].frame) / userInfo.playerInfo.skill[2].frameMax, -0.25 * Math.PI, 0.25 * Math.PI)
          context.fill()
        }
        if ( canvasInfo.isKeyDown[13]) {
          context.fillStyle = 'rgba(255, 255, 255, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius, 0.25 * Math.PI, 0.75 * Math.PI)
          context.fill()
        } else {
          context.fillStyle = 'rgba(0, 0, 0, 0.25)'
          context.beginPath()
          context.moveTo(wheel2Position.x, wheel2Position.y)
          context.arc(wheel2Position.x, wheel2Position.y, wheel2Radius * Math.max(0, userInfo.playerInfo.skill[3].frame) / userInfo.playerInfo.skill[3].frameMax, 0.25 * Math.PI, 0.75 * Math.PI)
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

        this.printText(this.generateSkillName(userInfo.playerInfo.skill[0]), wheel2Position.x, wheel2Position.y - wheel2Radius * 0.5, wheel2Radius * 0.8, 'center')
        this.printText(this.generateSkillName(userInfo.playerInfo.skill[1]), wheel2Position.x - wheel2Radius * 0.6, wheel2Position.y, wheel2Radius * 0.8, 'center')
        this.printText(this.generateSkillName(userInfo.playerInfo.skill[2]), wheel2Position.x + wheel2Radius * 0.6, wheel2Position.y, wheel2Radius * 0.8, 'center')
        this.printText(this.generateSkillName(userInfo.playerInfo.skill[3]), wheel2Position.x, wheel2Position.y + wheel2Radius * 0.5, wheel2Radius * 0.8, 'center')

        // Show sight
        if (userInfo.playerInfo.skill[0].skillCode == this.$constants.SKILL_CODE_SHOOT_HIT
        || userInfo.playerInfo.skill[0].skillCode == this.$constants.SKILL_CODE_SHOOT_ARROW
        || userInfo.playerInfo.skill[0].skillCode == this.$constants.SKILL_CODE_SHOOT_GUN
        || userInfo.playerInfo.skill[0].skillCode == this.$constants.SKILL_CODE_SHOOT_SHOTGUN
        || userInfo.playerInfo.skill[0].skillCode == this.$constants.SKILL_CODE_SHOOT_MAGNUM
        || userInfo.playerInfo.skill[0].skillCode == this.$constants.SKILL_CODE_SHOOT_ROCKET) {
          this.printSight(context)
        }
      } else {
        // Show pointer
        context.save()
        context.lineWidth = canvasInfo.blockSize * (100 + timestamp % 900) / 1000
        context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
        context.beginPath()
        context.arc(canvasInfo.pointer.x - (document.documentElement.scrollLeft - canvasInfo.deltaWidth), canvasInfo.pointer.y - (document.documentElement.scrollTop - canvasInfo.deltaHeight), 1, 0, 2 * Math.PI)
        context.closePath()
        context.stroke()
        context.restore()
      }
    },
    printSight (context) {
      var ratio = 1 - userInfo.playerInfo.precision / userInfo.playerInfo.precisionMax
      var sideLength = 20
      var x = (userInfo.playerInfo.coordinate.x + 1.5 * Math.cos(userInfo.playerInfo.faceDirection / 180 * Math.PI)) * canvasInfo.blockSize + canvasInfo.deltaWidth
      var y = (userInfo.playerInfo.coordinate.y - 2 * Math.sin(userInfo.playerInfo.faceDirection / 180 * Math.PI)) * canvasInfo.blockSize + canvasInfo.deltaHeight
      context.save()
      context.lineWidth = 2
      context.strokeStyle = 'rgba(255, 255, 255, 0.8)'
      context.beginPath()
      context.moveTo(x + sideLength * (0.5 + ratio), y + sideLength * (0.5 + ratio))
      context.lineTo(x + sideLength * (1 + ratio), y + sideLength * (0.5 + ratio))
      context.moveTo(x + sideLength * (0.5 + ratio), y + sideLength * (0.5 + ratio))
      context.lineTo(x + sideLength * (0.5 + ratio), y + sideLength * (1 + ratio))
      context.moveTo(x - sideLength * (0.5 + ratio), y + sideLength * (0.5 + ratio))
      context.lineTo(x - sideLength * (1 + ratio), y + sideLength * (0.5 + ratio))
      context.moveTo(x - sideLength * (0.5 + ratio), y + sideLength * (0.5 + ratio))
      context.lineTo(x - sideLength * (0.5 + ratio), y + sideLength * (1 + ratio))
      context.moveTo(x + sideLength * (0.5 + ratio), y - sideLength * (0.5 + ratio))
      context.lineTo(x + sideLength * (1 + ratio), y - sideLength * (0.5 + ratio))
      context.moveTo(x + sideLength * (0.5 + ratio), y - sideLength * (0.5 + ratio))
      context.lineTo(x + sideLength * (0.5 + ratio), y - sideLength * (1 + ratio))
      context.moveTo(x - sideLength * (0.5 + ratio), y - sideLength * (0.5 + ratio))
      context.lineTo(x - sideLength * (1 + ratio), y - sideLength * (0.5 + ratio))
      context.moveTo(x - sideLength * (0.5 + ratio), y - sideLength * (0.5 + ratio))
      context.lineTo(x - sideLength * (0.5 + ratio), y - sideLength * (1 + ratio))
      context.closePath()
      context.stroke()
      context.restore()
    },
    generateSkillName (skill) {
      var rst = ''
      switch (skill.skillCode) {
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
      if (this.isDef(skill.ammoCode)) {
        var ammoAmount = userInfo.bagInfo.items[skill.ammoCode]
        if (!this.isDef(ammoAmount)) {
          ammoAmount = 0
        }
        rst += '(' + ammoAmount + ')'
      }
      switch (skill.skillMode) {
        case this.$constants.SKILL_MODE_SEMI_AUTO:
        break
        case this.$constants.SKILL_MODE_AUTO:
        rst += '(A)'
        break
      }
      return rst
    },
    prepareInitializationRandomly () {
      userInfo.webSocketMessageDetail.functions.createPlayerInfoInstance = true
    },
    prepareInitialization (playerInfoTemp) {
      document.getElementById('initialization-nickname').value = playerInfoTemp.nickname
      document.getElementById('initialization-lastName').value = playerInfoTemp.lastName
      document.getElementById('initialization-firstName').value = playerInfoTemp.firstName
      document.getElementById('initialization-nameColor').value = playerInfoTemp.nameColor
      document.getElementById('initialization-avatar').value = playerInfoTemp.avatar
      for (let i = 0; i < document.getElementById('initialization-creature').options.length; i++) {
        if (document.getElementById('initialization-creature').options[i].value == playerInfoTemp.creatureType) {
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
      if (this.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING) {
        playerInfoTemp = Object.assign({}, userInfo.playerInfo)
        playerInfoTemp.speed = {
          x: Math.sin(timestamp % 4000 * Math.PI * 2 / 4000),
          y: Math.cos(timestamp % 4000 * Math.PI * 2 / 4000)
        }
        playerInfoTemp.faceDirection = this.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
        playerInfoTemp.outfits = ['a001']
        this.drawCharacter(playerInfoTemp, (menuLeftEdge + 110 - canvasInfo.deltaWidth) / this.$constants.DEFAULT_BLOCK_SIZE, (menuTopEdge + 70 - canvasInfo.deltaHeight) / this.$constants.DEFAULT_BLOCK_SIZE, this.$constants.DEFAULT_BLOCK_SIZE)
        playerInfoTemp.speed = { x:0, y:0 }
        playerInfoTemp.faceDirection = 270
        this.drawCharacter(playerInfoTemp, (menuLeftEdge + 10 - canvasInfo.deltaWidth) / this.$constants.DEFAULT_BLOCK_SIZE, (menuTopEdge + 70 - canvasInfo.deltaHeight) / this.$constants.DEFAULT_BLOCK_SIZE, this.$constants.DEFAULT_BLOCK_SIZE)
      }
      // Right character
      playerInfoTemp = {
        id: userInfo.userCode,
        firstName: document.getElementById('initialization-firstName').value,
        lastName: document.getElementById('initialization-lastName').value,
        nickname: document.getElementById('initialization-nickname').value,
        nameColor: document.getElementById('initialization-nameColor').value,
        creatureType: document.getElementById('initialization-creature').value,
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
        tools: userInfo.playerInfo.tools,
        outfits: userInfo.playerInfo.outfits,
        bossId: '',
      }
      playerInfoTemp.faceDirection = this.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
      playerInfoTemp.faceCoefs = []
      for (let i = 0; i < this.$constants.FACE_COEFS_LENGTH; i++) {
        playerInfoTemp.faceCoefs[i] = document.getElementById('initialization-coefs-' + (i + 1)).value
      }
      this.drawCharacter(playerInfoTemp, (menuLeftEdge + 320 - canvasInfo.deltaWidth) / this.$constants.DEFAULT_BLOCK_SIZE, (menuTopEdge + 70 - canvasInfo.deltaHeight) / this.$constants.DEFAULT_BLOCK_SIZE, this.$constants.DEFAULT_BLOCK_SIZE)
      playerInfoTemp.speed = { x:0, y:0 }
      playerInfoTemp.faceDirection = 270
      this.drawCharacter(playerInfoTemp, (menuLeftEdge + 220 - canvasInfo.deltaWidth) / this.$constants.DEFAULT_BLOCK_SIZE, (menuTopEdge + 70 - canvasInfo.deltaHeight) / this.$constants.DEFAULT_BLOCK_SIZE, this.$constants.DEFAULT_BLOCK_SIZE)
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
        document.getElementById('initialization-skinColor').options.add(new Option('大水牛', 6))
        document.getElementById('initialization-skinColor').options.add(new Option('小狐狸', 7))
        document.getElementById('initialization-skinColor').options.add(new Option('北极熊', 8))
        document.getElementById('initialization-skinColor').options.add(new Option('小绵羊', 9))
        document.getElementById('initialization-skinColor').options.add(new Option('大老虎', 10))
        document.getElementById('initialization-skinColor').options.add(new Option('小猫咪', 11))
        document.getElementById('initialization-skinColor').options.add(new Option('小狗狗', 12))
        document.getElementById('initialization-skinColor').options.add(new Option('大灰狼', 13))
        document.getElementById('initialization-skinColor').options.add(new Option('大野猪', 14))
        document.getElementById('initialization-skinColor').options.add(new Option('大白马', 15))
      }
    },
    printMenu () {
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      context.save()
      context.fillStyle = 'rgba(191, 191, 191, 0.75)'
      context.fillRect(menuLeftEdge, menuTopEdge, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge, canvasInfo.canvas.height - menuTopEdge - menuBottomEdge)
      context.restore()
      if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_SET || userInfo.playerInfo.playerStatus !== this.$constants.PLAYER_STATUS_INIT) {
        context.drawImage(images.smallButtons, 1 * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, 0 * this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.canvas.width - menuRightEdge - this.$constants.DEFAULT_SMALL_BUTTON_SIZE, menuTopEdge, this.$constants.DEFAULT_SMALL_BUTTON_SIZE, this.$constants.DEFAULT_SMALL_BUTTON_SIZE)
      }
    },
    printExchange () {
      this.printText(Number(userInfo.bagInfo.capacity) + '/' + Number(userInfo.bagInfo.capacityMax) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100, 'left')
      this.printText('$' + userInfo.playerInfo.money, menuLeftEdge + 110, menuTopEdge + 20, 50, 'left')
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50, 'left')
      this.printText(document.getElementById('items-exchange-range').value, menuLeftEdge + 330, menuTopEdge + 125, 50, 'left')
    },
    printStatus () {
      var positionY = menuTopEdge + 20
      this.printText(userInfo.playerInfo.nickname + ' (' + userInfo.playerInfo.lastName + ', ' + userInfo.playerInfo.firstName + ')', menuLeftEdge + 10, positionY, this.$constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
      positionY += 20
      this.printText('当前位置:' + userInfo.regionInfo.name + '-' + userInfo.sceneInfo.name, menuLeftEdge + 10, positionY, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('Lv.' + userInfo.playerInfo.level + ' 经验值' + userInfo.playerInfo.exp + '/' + userInfo.playerInfo.expMax, menuLeftEdge + 10, positionY, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('生命值' + userInfo.playerInfo.hp + '/' + userInfo.playerInfo.hpMax, menuLeftEdge + 10, positionY, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('活力值' + userInfo.playerInfo.vp + '/' + userInfo.playerInfo.vpMax, menuLeftEdge + 10, positionY, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('饥饿值' + userInfo.playerInfo.hunger + '/' + userInfo.playerInfo.hungerMax, menuLeftEdge + 10, positionY, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('口渴值' + userInfo.playerInfo.thirst + '/' + userInfo.playerInfo.thirstMax, menuLeftEdge + 10, positionY, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      this.printText('$' + userInfo.playerInfo.money + ' 负重' + Number(userInfo.bagInfo.capacity) + '/' + Number(userInfo.bagInfo.capacityMax) + '(kg)', menuLeftEdge + 10, positionY, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
      var buffStr = '特殊状态 '
      var hasBuff = false
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_DEAD] != 0) {
        hasBuff = true
        buffStr += '死亡 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_STUNNED] != 0) {
        hasBuff = true
        buffStr += '昏迷 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_BLEEDING] != 0) {
        hasBuff = true
        buffStr += '流血 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_SICK] != 0) {
        hasBuff = true
        buffStr += '疾病 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_FRACTURED] != 0) {
        hasBuff = true
        buffStr += '骨折 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_HUNGRY] != 0) {
        hasBuff = true
        buffStr += '饥饿 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_THIRSTY] != 0) {
        hasBuff = true
        buffStr += '口渴 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_FATIGUED] != 0) {
        hasBuff = true
        buffStr += '疲惫 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_BLIND] != 0) {
        hasBuff = true
        buffStr += '失明 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_INVINCIBLE] != 0) {
        hasBuff = true
        buffStr += '无敌 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_REVIVED] != 0) {
        hasBuff = true
        buffStr += '急救 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_REALISTIC] != 0) {
        hasBuff = true
        buffStr += '写实 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_ANTI_TROPHY] != 0) {
        hasBuff = true
        buffStr += '防盗 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_BLOCKED] != 0) {
        hasBuff = true
        buffStr += '格挡 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_HAPPY] != 0) {
        hasBuff = true
        buffStr += '愉悦 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_SAD] != 0) {
        hasBuff = true
        buffStr += '沮丧 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_RECOVERING] != 0) {
        hasBuff = true
        buffStr += '康复 '
      }
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_OVERWEIGHTED] != 0) {
        hasBuff = true
        buffStr += '超重 '
      }
      if (!hasBuff) {
        buffStr += '无'
      }
      this.printText(buffStr, menuLeftEdge + 10, positionY, canvasInfo.canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
      positionY += 20
    },
    printItems () {
      this.printText(Number(userInfo.bagInfo.capacity) + '/' + Number(userInfo.bagInfo.capacityMax) + '(kg)', menuLeftEdge + 10, menuTopEdge + 20, 100, 'left')
      this.printText('$' + userInfo.playerInfo.money, menuLeftEdge + 110, menuTopEdge + 20, 50, 'left')
      this.printText(document.getElementById('items-range').value, menuLeftEdge + 130, menuTopEdge + 125, 50, 'left')
    },
    printMembers () {
      var tree = []
      var member = userInfo.playerInfo
      while (this.isDef(member)) {
        tree.push(member.nickname + ' (' + member.lastName + ', ' + member.firstName + ') Lv.' + member.level)
        if (this.isDef(member.bossId) && member.bossId != member.id) {
          member = userInfo.playerInfos[member.bossId]
        } else {
          member = undefined
        }
      }
      var positionY = menuTopEdge + 20
      if (tree.length == 1) {
        this.printText('[玩家]' + tree[0], menuLeftEdge + 10, positionY, this.$constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
        positionY += 20
      } else {
        for (var i = tree.length - 1; i >= 0; i--) {
          if (i == 0) {
            this.printText('[玩家]' + tree[i], menuLeftEdge + 10, positionY, this.$constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
          } else {
            this.printText('[' + i + '级领导]' + tree[i], menuLeftEdge + 10, positionY, this.$constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
          }
          positionY += 20
        }
      }
    },
    printSettings () {
      canvasInfo.blockSize = Number(document.getElementById('settings-blockSize').value)
      musicMuted = !document.getElementById('settings-music').checked
      soundMuted = !document.getElementById('settings-sound').checked
      this.printText('缩放: ' + Math.round(canvasInfo.blockSize / this.$constants.MAX_BLOCK_SIZE * 100) + '%', menuLeftEdge + 140, menuTopEdge + 75, 100, 'left')
      this.printText('音乐', menuLeftEdge + 40, menuTopEdge + 125, 50, 'left')
      this.printText('音效', menuLeftEdge + 140, menuTopEdge + 125, 50, 'left')
    },
    printTerminal () {
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      if (!this.isDef(terminalOutputs)) {
        return
      }
      if (terminalOutputs.terminalType == this.$constants.TERMINAL_TYPE_GAME && terminalOutputs.gameType == this.$constants.GAME_TYPE_LAS_VEGAS) {
        var index = 0
        for (var casinoNo in terminalOutputs.casinos) {
          context.drawImage(images.blocks[3022], 0, 0, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, terminalLeftEdge, terminalTopEdge + index * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
          var casinoImageX, casinoImageY
          switch (terminalOutputs.casinos[casinoNo].casinoNo) {
            case 1:
              casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
              casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
              break
            case 2:
              casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
              casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
              break
            case 3:
              casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
              casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
              break
            case 4:
              casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
              casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
              break
            case 5:
              casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
              casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
              break
            case 6:
              casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
              casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
              break
          }
          context.drawImage(images.blocks[3023], casinoImageX, casinoImageY, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, terminalLeftEdge, terminalTopEdge + index * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
          var cashIndex = 0
          for (var cash in terminalOutputs.casinos[casinoNo].cashQueue) {
            this.printText(terminalOutputs.casinos[casinoNo].cashQueue[cash].value, terminalLeftEdge + canvasInfo.blockSize / 2 + cashIndex * 50, terminalTopEdge + (index + 0.25) * canvasInfo.blockSize / 2, 50, 'left')
            cashIndex++
          }
          var diceIndex = 0
          for (var dice in terminalOutputs.casinos[casinoNo].diceMap) {
            var playerImageX, playerImageY
            switch (dice) {
              case 1:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                break
              case 2:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                break
              case 3:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                break
              case 4:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                break
              case 5:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                break
              case 6:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                break
              case 7:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                break
              case 8:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                break
            }
            for (var i = 0; i < terminalOutputs.casinos[casinoNo].diceMap[dice]; i++) {
              context.drawImage(images.blocks[3023], playerImageX, playerImageY, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, terminalLeftEdge + diceIndex * canvasInfo.blockSize / 4, terminalTopEdge + (index + 0.5) * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
              context.drawImage(images.blocks[3023], casinoImageX, casinoImageY, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, terminalLeftEdge + diceIndex * canvasInfo.blockSize / 4, terminalTopEdge + (index + 0.5) * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
              diceIndex++
            }
          }
          index++
        }
        index = 0
        for (var player in terminalOutputs.players) {
          this.printText(terminalOutputs.players[player].name + '(' + terminalOutputs.players[player].money + ')', terminalLeftEdge, terminalTopEdge + (index + 0.25 + 6) * canvasInfo.blockSize / 2, 100, 'left')
          switch (player) {
            case 1:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                break
              case 2:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                break
              case 3:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                break
              case 4:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                break
              case 5:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                break
              case 6:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                break
              case 7:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                break
              case 8:
                playerImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
                playerImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                break
          }
          diceIndex = 0
          for (dice in terminalOutputs.players.diceQueue) {
            switch (terminalOutputs.players[player].diceQueue[dice].point) {
              case 1:
                casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                break
              case 2:
                casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                break
              case 3:
                casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
                casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                break
              case 4:
                casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 0 / 4
                casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
                break
              case 5:
                casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 1 / 4
                casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
                break
              case 6:
                casinoImageX = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 2 / 4
                casinoImageY = this.$constants.DEFAULT_IMAGE_BLOCK_SIZE * 3 / 4
                break
            }
            context.drawImage(images.blocks[3023], playerImageX, playerImageY, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, terminalLeftEdge + diceIndex * canvasInfo.blockSize / 4, terminalTopEdge + (index + 0.5 + 6) * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
            context.drawImage(images.blocks[3023], casinoImageX, casinoImageY, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 4, terminalLeftEdge + diceIndex * canvasInfo.blockSize / 4, terminalTopEdge + (index + 0.5 + 6) * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
            diceIndex++
          }
        }
      }
    },
    useItem () {
      var itemNo = document.getElementById('items-name').value
      if (!this.isDef(userInfo.bagInfo.items[itemNo]) || userInfo.bagInfo.items[itemNo] <= 0) {
        return
      }
      var itemAmount = Math.min(userInfo.bagInfo.items[itemNo], Number(document.getElementById('items-range').value))
      if (itemAmount <= 0) {
        return
      }
      this.useItems(itemNo, itemAmount)
    },
    useItems (itemNo, itemAmount) {
      userInfo.webSocketMessageDetail.functions.useItems.push({ itemNo: itemNo, itemAmount: itemAmount })
    },
    getItems (itemNo, itemAmount) {
      userInfo.webSocketMessageDetail.functions.getItems.push({ itemNo: itemNo, itemAmount: itemAmount })
    },
    getPreservedItems (itemNo, itemAmount) {
      userInfo.webSocketMessageDetail.functions.getPreservedItems.push({ itemNo: itemNo, itemAmount: itemAmount })
    },
    getInteractedItems (itemNo, itemAmount) {
      userInfo.webSocketMessageDetail.functions.getInteractedItems.push({ itemNo: itemNo, itemAmount: itemAmount })
    },
    useRecipes () {
      var recipeNo = document.getElementById('recipes-name').value
      for (var costKey in staticData.recipes[recipeNo].cost) {
        if (!this.isDef(userInfo.bagInfo.items[costKey]) || userInfo.bagInfo.items[costKey] <= staticData.recipes[recipeNo].cost[costKey]) {
          return
        }
        var recipeAmount = Math.min(userInfo.bagInfo.items[costKey] / staticData.recipes[recipeNo].cost[costKey], Number(document.getElementById('items-range').value))
        if (recipeAmount <= 0) {
          return
        }
      }
      userInfo.webSocketMessageDetail.functions.useRecipes.push({ recipeNo: recipeNo, recipeAmount: recipeAmount })
    },
    addDrop () {
      var itemAmount = Number(document.getElementById('items-range').value)
      if (itemAmount <= 0) {
        return
      }
      var itemNo = document.getElementById('items-name').value
      userInfo.webSocketMessageDetail.functions.addDrops.push({
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
      // this.getItems(itemNo, -1 * itemAmount)
      // this.getPreservedItems(itemNo, itemAmount)
      this.getInteractedItems(itemNo, -1 * itemAmount)
    },
    exchangeItemBackward () {
      var itemAmount = Number(document.getElementById('items-exchange-range').value)
      if (itemAmount <= 0) {
        return
      }
      var itemNo = document.getElementById('items-exchange-name').value
      // this.getItems(itemNo, itemAmount)
      // this.getPreservedItems(itemNo, -1 * itemAmount)
      this.getInteractedItems(itemNo, itemAmount)
    },
    updateItems () {
      var checkValue = document.getElementById('items-name').value
      document.getElementById('items-name').length = 0
      if (!this.isDef(userInfo.bagInfo.items)) {
        return
      }
      for (var itemNo in userInfo.bagInfo.items) {
        var itemAmount = userInfo.bagInfo.items[itemNo]
        if (!this.isDef(itemAmount) || itemAmount === 0) {
          continue
        }
        var item = staticData.items[itemNo]
        switch (itemNo.charAt(0)) {
          case this.$constants.ITEM_CHARACTER_TOOL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              if (this.isDef(userInfo.playerInfo.tools) && userInfo.playerInfo.tools.length > 0 && userInfo.playerInfo.tools.includes(itemNo)) {
                document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            break
          case this.$constants.ITEM_CHARACTER_OUTFIT:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.isDef(userInfo.playerInfo.outfits) && userInfo.playerInfo.outfits.length > 0 && userInfo.playerInfo.outfits.includes(itemNo)) {
                      document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            break
          case this.$constants.ITEM_CHARACTER_CONSUMABLE:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case this.$constants.ITEM_CHARACTER_MATERIAL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option('○[材料]' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case this.$constants.ITEM_CHARACTER_JUNK:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case this.$constants.ITEM_CHARACTER_AMMO:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case this.$constants.ITEM_CHARACTER_NOTE:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case this.$constants.ITEM_CHARACTER_RECORDING:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '7') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
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
        item = staticData.items[document.getElementById('items-name').value]
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
              document.getElementById('items-desc').value += '\n' + staticData.items[material].name + '(' + item.materials[material] + ')'
            }
          }
        }
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_AMMO) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_NOTE) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_RECORDING) {
          document.getElementById('items-desc').value = item.description
        }
        document.getElementById('items-range').min = 1
        document.getElementById('items-range').max = userInfo.bagInfo.items[document.getElementById('items-name').value]
        // document.getElementById('items-range').value = Math.min(document.getElementById('items-range').value, document.getElementById('items-range').max)
      } else {
        document.getElementById('items-range').min = 0
        document.getElementById('items-range').max = 0
        // document.getElementById('items-range').value = 0
      }
    },
    updateInteractedItems () {
      var checkValue = document.getElementById('items-exchange-name').value
      document.getElementById('items-exchange-name').length = 0
      if (!this.isDef(userInfo.interactedBagInfo)) {
        return
      }
      for (let itemNo in userInfo.interactedBagInfo.items) {
        let itemAmount = userInfo.interactedBagInfo.items[itemNo]
        if (!this.isDef(itemAmount) || itemAmount === 0) {
          continue
        }
        // console.log(itemNo + ':')
        // console.log(':' + JSON.stringify(staticData.items))
        var item = staticData.items[itemNo]
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
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_AMMO) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_NOTE) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == this.$constants.ITEM_CHARACTER_RECORDING) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '7') {
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
        item = staticData.items[document.getElementById('items-exchange-name').value]
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
              document.getElementById('items-exchange-desc').value += '\n' + staticData.items[material].name + '(' + item.materials[material] + ')'
            }
          }
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_AMMO) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_NOTE) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == this.$constants.ITEM_CHARACTER_RECORDING) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        document.getElementById('items-exchange-range').min = 1
        document.getElementById('items-exchange-range').max = userInfo.interactedBagInfo.items[document.getElementById('items-exchange-name').value]
        // document.getElementById('items-exchange-range').value = Math.min(document.getElementById('items-exchange-range').value, document.getElementById('items-exchange-range').max)
      } else {
        document.getElementById('items-exchange-range').min = 0
        document.getElementById('items-exchange-range').max = 0
        // document.getElementById('items-exchange-range').value = 0
      }
    },
    updateRecipes () {
      var recipeChar
      switch (userInfo.interactionInfo.type) {
        case this.$constants.BLOCK_TYPE_WORKSHOP:
          recipeChar = this.$constants.RECIPE_CHARACTER_WORKSHOP
          break
        case this.$constants.BLOCK_TYPE_COOKER:
          recipeChar = this.$constants.RECIPE_CHARACTER_COOKER
          break
        case this.$constants.BLOCK_TYPE_SINK:
        case this.$constants.BLOCK_TYPE_TOILET:
          recipeChar = this.$constants.RECIPE_CHARACTER_SINK
          break
      }
      var checkValue = document.getElementById('recipes-name').value
      document.getElementById('recipes-name').length = 0
      if (!this.isDef(staticData.recipes) || staticData.recipes.length == 0 || !this.isDef(userInfo.interactionInfo)) {
        return
      }
      document.getElementById('recipes-range').min = 0
      document.getElementById('recipes-range').max = 0
      for (var recipeNo in staticData.recipes) {
        if (recipeNo.charAt(0) != recipeChar) {
          continue
        }
        if (document.getElementById('recipes-type').value != '0') {
          continue // TODO Contain more types
        }
        var optionContent = ''
        for (var valueNo in staticData.recipes[recipeNo].value) {
          optionContent += staticData.items[valueNo].name + '(' + staticData.recipes[recipeNo].value[valueNo] + ') '
        }
        document.getElementById('recipes-name').options.add(new Option(optionContent, recipeNo))
        if (recipeNo == checkValue) {
          document.getElementById('recipes-name').options[document.getElementById('recipes-name').options.length - 1].selected = true
        }
      }
      if (this.isBlankString(checkValue) || checkValue.charAt(0) != recipeChar) {
        checkValue = document.getElementById('recipes-name').options[0].value
      }
      var descriptionContent = '成本:\n'
      for (var costNo in staticData.recipes[checkValue].cost) {
        var itemAmount = userInfo.bagInfo.items[costNo]
        if (!this.isDef(itemAmount)) {
          itemAmount = 0
        }
        descriptionContent += staticData.items[costNo].name + '(' + staticData.recipes[checkValue].cost[costNo] + '/' + itemAmount + ')'
        if (itemAmount >= staticData.recipes[checkValue].cost[costNo]) {
          descriptionContent += '\n'
        } else {
          descriptionContent += ' 数量不足\n'
        }
      }
      document.getElementById('recipes-desc').value = descriptionContent
      document.getElementById('recipes-range').min = 1
      document.getElementById('recipes-range').max = 1 // TODO Make it right
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
      if (userInfo.webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_INFO 
      || canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_BACKPACK 
      || canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_SETTINGS 
      || canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_EXCHANGE 
      || canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_USE 
      || canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_SET 
      || canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_MEMBERS) {
        if (x >= canvasInfo.canvas.width - menuRightEdge - this.$constants.DEFAULT_SMALL_BUTTON_SIZE && x <= canvasInfo.canvas.width - menuRightEdge && y >= menuTopEdge && y <= menuTopEdge + this.$constants.DEFAULT_SMALL_BUTTON_SIZE) {
          // Click 'X'
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
        }
        return
      }
      if (x >= avatarPosition.x && x < avatarPosition.x + this.$constants.DEFAULT_AVATAR_SIZE && y >= avatarPosition.y && y < avatarPosition.y + this.$constants.DEFAULT_AVATAR_SIZE) {
        // Avatar
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_AVATAR
      } else if (x >= buttonPositions[0].x && x < buttonPositions[0].x + this.$constants.DEFAULT_BUTTON_SIZE && y >= buttonPositions[0].y && y < buttonPositions[0].y + this.$constants.DEFAULT_BUTTON_SIZE) {
        // Personal information
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_INFO
      } else if (x >= buttonPositions[1].x && x < buttonPositions[1].x + this.$constants.DEFAULT_BUTTON_SIZE && y >= buttonPositions[1].y && y < buttonPositions[1].y + this.$constants.DEFAULT_BUTTON_SIZE) {
        // Backpack
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_BACKPACK
      } else if (x >= buttonPositions[2].x && x < buttonPositions[2].x + this.$constants.DEFAULT_BUTTON_SIZE && y >= buttonPositions[2].y && y < buttonPositions[2].y + this.$constants.DEFAULT_BUTTON_SIZE) {
        // Members
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_MEMBERS
      } else if (x >= buttonPositions[3].x && x < buttonPositions[3].x + this.$constants.DEFAULT_BUTTON_SIZE && y >= buttonPositions[3].y && y < buttonPositions[3].y + this.$constants.DEFAULT_BUTTON_SIZE) {
        // Settings
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_SETTINGS
      } else if (x >= movementModeButtonPosition.x && x < movementModeButtonPosition.x + this.$constants.DEFAULT_BUTTON_SIZE && y >= movementModeButtonPosition.y && y < movementModeButtonPosition.y + this.$constants.DEFAULT_BUTTON_SIZE) {
        // Movement mode
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVEMENT_MODE
      } else if (x >= recordButtonPosition.x && x < (recordButtonPosition.x + this.$constants.DEFAULT_SMALL_BUTTON_SIZE) && y >= recordButtonPosition.y && y < (recordButtonPosition.y + this.$constants.DEFAULT_SMALL_BUTTON_SIZE)) {
        // Voice record
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_RECORDER
        this.recordStart()
      } else {
        if (useWheel) {
          if (Math.pow(wheel1Position.x - x, 2) + Math.pow(wheel1Position.y - y, 2) <= Math.pow(wheel1Radius, 2)) {
            // New movement system 24/02/19
            canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
            this.setHandlePosition(x, y)
            this.updatePointer(handle1Position.x, handle1Position.y)
          }
          if (Math.pow(wheel2Position.x - x, 2) + Math.pow(wheel2Position.y - y, 2) <= Math.pow(wheel2Radius, 2)) {
            if (y - wheel2Position.y > x - wheel2Position.x) {
              if (y - wheel2Position.y > wheel2Position.x - x) {
                 canvasInfo.isKeyDown[13] = true
              } else { 
                 canvasInfo.isKeyDown[11] = true
              }
            } else {
              if (y - wheel2Position.y > wheel2Position.x - x) {
                 canvasInfo.isKeyDown[12] = true
              } else {
                 canvasInfo.isKeyDown[10] = true
              }
            }
          }
        } else {
          // Old movement system 24/02/12
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          for (var i = 0; i < userInfo.blocks.length; i++) {
            var block = userInfo.blocks[i]
            if (Math.pow(canvasInfo.pointer.x - block.x, 2) + Math.pow((canvasInfo.pointer.y + 0.5) - block.y, 2) > Math.pow(this.$constants.MIN_CLICK_DISTANCE_BLOCK_POINTER, 2)) {
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
      if (userInfo.webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      userInfo.webSocketMessageDetail.functions.useSkills[index - 10] = false
    },
    wheelKeyDown (index) {
      if (userInfo.webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      switch (index) {
        case 0:
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x, handle1Position.y - 0.1 * wheel1Radius)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 1:
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x - 0.1 * wheel1Radius, handle1Position.y)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 2:
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x + 0.1 * wheel1Radius, handle1Position.y)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 3:
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x, handle1Position.y + 0.1 * wheel1Radius)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 10:
        case 11:
        case 12:
        case 13:
          userInfo.webSocketMessageDetail.functions.useSkills[index - 10] = true
          break
        default:
      }
    },
    startInteraction (block) {
      if (this.isDef(userInfo.interactionInfo) && userInfo.interactionInfo.id == block.id) {
        // Without this, interaction list will keep updating and cannot select 24/08/20
        return
      }
      if (block.type == this.$constants.BLOCK_TYPE_PLAYER) {
        if (block.id != userInfo.userCode && (!this.isDef(block.buff) || block.buff[this.$constants.BUFF_CODE_DEAD] === 0)) {
          userInfo.interactionInfo = {
            type: block.type,
            id: block.id,
            code: block.code,
            list: []
          }
        }
        if (userInfo.playerInfos[block.id].playerType == this.$constants.PLAYER_TYPE_HUMAN) {
          userInfo.interactionInfo.list.push(this.$constants.INTERACTION_TALK)
        }
        if (userInfo.playerInfos[block.id].creatureType == this.$constants.CREATURE_TYPE_HUMAN) {
          userInfo.interactionInfo.list.push(this.$constants.INTERACTION_SUCCUMB)
          userInfo.interactionInfo.list.push(this.$constants.INTERACTION_EXPEL)
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_BED) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_SLEEP]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_TOILET) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE, this.$constants.INTERACTION_DRINK]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_DRESSER) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_SET]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_WORKSHOP) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_GAME) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_STORAGE) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_EXCHANGE]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_COOKER) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_SINK) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_USE, this.$constants.INTERACTION_DRINK]
        }
      } else if (block.type == this.$constants.BLOCK_TYPE_CONTAINER) {
        userInfo.interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [this.$constants.INTERACTION_EXCHANGE]
        }
      }
      this.fillInteractionList()
      userInfo.webSocketMessageDetail.functions.updateInteractionInfo = userInfo.interactionInfo
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
        canvasInfo.pointer.x = x - wheel1Position.x
        canvasInfo.pointer.y = y - wheel1Position.y
      } else {
        canvasInfo.pointer.x = (x + document.documentElement.scrollLeft - canvasInfo.deltaWidth) / canvasInfo.blockSize
        canvasInfo.pointer.y = (y + document.documentElement.scrollTop - canvasInfo.deltaHeight) / canvasInfo.blockSize
      }
    },
    fillInteractionList () {
      document.getElementById('interactions-list').length = 0
      if (!this.isDef(userInfo.interactionInfo) || !this.isDef(userInfo.interactionInfo.list)) {
        return
      }
      for (var i = 0; i < userInfo.interactionInfo.list.length; i++) {
        var interactinonName
        switch (Number(userInfo.interactionInfo.list[i])) {
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
          case this.$constants.INTERACTION_SUCCUMB:
            interactinonName = '[屈从]'
            break
          case this.$constants.INTERACTION_EXPEL:
            interactinonName = '[驱逐]'
            break
        }
        document.getElementById('interactions-list').options.add(new Option(interactinonName, Number(userInfo.interactionInfo.list[i])));
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
      if (userInfo.webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_MOVING) {
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
      if (userInfo.webStage !== this.$constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_RECORDER) {
        this.recordEnd()
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
      } else if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_MOVING) {
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
        if (useWheel) {
          this.setHandlePosition(wheel1Position.x, wheel1Position.y)
          this.updatePointer(handle1Position.x, handle1Position.y)
        } else {
          userInfo.playerInfo.speed = {
            x: 0,
            y: 0
          }
        }
      } else if (canvasInfo.canvasMoveUse === this.$constants.MOVEMENT_STATE_MOVEMENT_MODE) {
        if (userInfo.movementMode == this.$constants.MOVEMENT_MODE_STAND_GROUND) {
          userInfo.movementMode = this.$constants.MOVEMENT_MODE_WALK
        } else if (userInfo.movementMode == this.$constants.MOVEMENT_MODE_WALK) {
          userInfo.movementMode = this.$constants.MOVEMENT_MODE_DEFAULT
        } else {
          userInfo.movementMode = this.$constants.MOVEMENT_MODE_STAND_GROUND
        }
        canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
      }
      if (useWheel) {
         canvasInfo.isKeyDown[10] = false
         canvasInfo.isKeyDown[11] = false
         canvasInfo.isKeyDown[12] = false
         canvasInfo.isKeyDown[13] = false
      }
    },
    useDrop (newDrop) {
      userInfo.webSocketMessageDetail.functions.useDrop = { 
        id: newDrop.id
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
      // Speed logics, sync with back-end 24/08/24
      var speed = Math.sqrt(Math.pow(movingBlock.speed.x, 2) + Math.pow(movingBlock.speed.y, 2)) + movingBlock.acceleration
      if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_STUNNED] !== 0) {
        speed = 0
      } else if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_FRACTURED] !== 0) {
        speed = Math.min(movingBlock.maxSpeed * 0.25, speed)
      } else if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_OVERWEIGHTED] !== 0) {
        speed = Math.min(movingBlock.maxSpeed * 0.25, speed)
      } else if (userInfo.playerInfo.buff[this.$constants.BUFF_CODE_FATIGUED] !== 0) {
        speed = Math.min(movingBlock.maxSpeed * 0.25, speed)
      } else if (userInfo.movementMode === this.$constants.MOVEMENT_MODE_WALK) {
        speed = Math.min(movingBlock.maxSpeed * 0.45, speed)
      } else {
        speed = Math.min(movingBlock.maxSpeed, speed)
      }
      movingBlock.speed.x = speed * (canvasInfo.pointer.x - movingBlock.coordinate.x) / Math.sqrt(Math.pow(canvasInfo.pointer.x - movingBlock.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - movingBlock.coordinate.y, 2))
      movingBlock.speed.y = speed * (canvasInfo.pointer.y - movingBlock.coordinate.y) / Math.sqrt(Math.pow(canvasInfo.pointer.x - movingBlock.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - movingBlock.coordinate.y, 2))

      movingBlock.faceDirection = this.calculateAngle(movingBlock.speed.x, movingBlock.speed.y)
      if (userInfo.movementMode === this.$constants.MOVEMENT_MODE_STAND_GROUND) {
        movingBlock.speed.x = 0
        movingBlock.speed.y = 0
      }

      var newCoordinate
      for (var i = 0; i < userInfo.blocks.length; i++) {
        if (movingBlock.speed.x === 0 && movingBlock.speed.y === 0) {
          // No speed
          break
        }
        if (userInfo.blocks[i].type == this.$constants.BLOCK_TYPE_PLAYER && userInfo.blocks[i].id == id) {
          // Player himself is to be past
          continue
        }
        if (userInfo.blocks[i].type == this.$constants.BLOCK_TYPE_TELEPORT 
        && this.detectCollision({ x: movingBlock.coordinate.x + movingBlock.speed.x, y: movingBlock.coordinate.y + movingBlock.speed.y }, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)) {
          movingBlock.speed.x = 0
          movingBlock.speed.y = 0
          newCoordinate = {
            regionNo: userInfo.blocks[i].to.regionNo,
            sceneCoordinate: userInfo.blocks[i].to.sceneCoordinate,
            coordinate: userInfo.blocks[i].to.coordinate
          }
          if (!useWheel) {
            canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
          }
          break // This is important
        }
        if (this.$constants.STRUCTURE_MATERIAL_HOLLOW == userInfo.blocks[i].structure.material) {
          continue
        }
        if (!this.detectCollision(movingBlock.coordinate, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)
        && this.detectCollision({ x: movingBlock.coordinate.x + movingBlock.speed.x, y: movingBlock.coordinate.y }, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)) {
          movingBlock.speed.x = 0
        }
        if (!this.detectCollision(movingBlock.coordinate, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)
        && this.detectCollision({ x: movingBlock.coordinate.x, y: movingBlock.coordinate.y + movingBlock.speed.y }, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)) {
          movingBlock.speed.y = 0
        }
      }
      if (this.isDef(newCoordinate)) {
        movingBlock.regionNo = newCoordinate.regionNo
        movingBlock.sceneCoordinate = newCoordinate.sceneCoordinate
        movingBlock.coordinate = newCoordinate.coordinate
        movingBlock.speed.x = 0
        movingBlock.speed.y = 0
        return
      }
      newCoordinate = {
        regionNo: movingBlock.regionNo,
        sceneCoordinate: movingBlock.sceneCoordinate,
        coordinate: movingBlock.coordinate
      }
      newCoordinate.coordinate.x = newCoordinate.coordinate.x + movingBlock.speed.x
      newCoordinate.coordinate.y = newCoordinate.coordinate.y + movingBlock.speed.y
      this.fixSceneCoordinate(newCoordinate)
      // Avoid entering non-existing scene 24/03/06
      var hasValidScene = false
      for (var sceneInfoIndex in userInfo.sceneInfos) {
        if (userInfo.sceneInfos[sceneInfoIndex].sceneCoordinate.x == newCoordinate.sceneCoordinate.x
            && userInfo.sceneInfos[sceneInfoIndex].sceneCoordinate.y == newCoordinate.sceneCoordinate.y) {
          hasValidScene = true
        }
      }
      if (hasValidScene) {
        movingBlock.coordinate = newCoordinate.coordinate
      }
    },
    checkBlockTypeInteractive (blockType) {
      return this.$drawMethods.checkBlockTypeInteractive(this.$constants, blockType)
    },
    fixSceneCoordinate (adjustedCoordinate) {
      while (adjustedCoordinate.coordinate.y < -1) {
        adjustedCoordinate.sceneCoordinate.y -= 1
        adjustedCoordinate.coordinate.y += userInfo.regionInfo.height
      }
      while (adjustedCoordinate.coordinate.y >= userInfo.regionInfo.height - 1) {
        adjustedCoordinate.sceneCoordinate.y += 1
        adjustedCoordinate.coordinate.y -= userInfo.regionInfo.height
      }
      while (adjustedCoordinate.coordinate.x < -0.5) {
        adjustedCoordinate.sceneCoordinate.x -= 1
        adjustedCoordinate.coordinate.x += userInfo.regionInfo.width
      }
      while (adjustedCoordinate.coordinate.x >= userInfo.regionInfo.width -0.5) {
        adjustedCoordinate.sceneCoordinate.x += 1
        adjustedCoordinate.coordinate.x -= userInfo.regionInfo.width
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
    isBlankString (str) {
      return !str || /^\s*$/.test(str)
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
      // if (scope === this.$constants.SCOPE_GLOBAL) {
      //   this.addChat(userInfo.playerInfo.nickname + ':[广播]' + content)
      // } else if (scope === this.$constants.SCOPE_INDIVIDUAL) {
      //   var toNickname = '(已离线)'
      //   if (this.isDef(userInfo.playerInfos[chatTo])) {
      //     toNickname = userInfo.playerInfos[chatTo].nickname
      //   }
      //   this.addChat(userInfo.playerInfo.nickname + ':[to ' + toNickname + ']' + content)
      // }
      userInfo.webSocketMessageDetail.functions.addMessages.push({
         type: this.$constants.MESSAGE_TYPE_PRINTED, 
         scope: scope, 
         fromUserCode: userInfo.userCode, 
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
      userInfo.webSocketMessageDetail.functions.addMessages.push({
        type: this.$constants.MESSAGE_TYPE_VOICE, 
        scope: scope, 
        fromUserCode: userInfo.userCode, 
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
          fromUserCode: userInfo.userCode, 
          toUserCode: chatTo, 
          content: content 
        })
      }
      await this.axios.post(this.api_path + "/sendmsg", requestOptions)
          .then(res => {
        console.info(res)
        if (scope === this.$constants.SCOPE_GLOBAL) {
          this.addChat(userInfo.playerInfo.nickname + ':[广播]' + content)
        } else if (scope === this.$constants.SCOPE_INDIVIDUAL) {
          var toNickname = '(已离线)'
          if (this.isDef(userInfo.playerInfos[chatTo])) {
            toNickname = userInfo.playerInfos[chatTo].nickname
          }
          this.addChat(userInfo.playerInfo.nickname + ':[to ' + toNickname + ']' + content)
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
          fromUserCode: userInfo.userCode, 
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
      userInfo.chatMessages.push(msgContent)
        while (userInfo.chatMessages.length > MAX_MSG_LINE_NUM) {
          userInfo.chatMessages = userInfo.chatMessages.slice(1)
        }
    },
    updateChat () {
      if (this.isDef(userInfo.chatMessages)) {
        userInfo.chatMessages = userInfo.chatMessages.slice(1)
      }
    },
    async updateVoice () {
      if (userInfo.voiceMessages.length > 0 && !micInUse) {
        var blobRes = await fetch(userInfo.voiceMessages[0]).then(res => res.blob())
        userInfo.voiceMessages = userInfo.voiceMessages.slice(1)
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
      userInfo.webSocketMessageDetail.functions.terminalInputs.push({
        id: userInfo.interactionInfo.id,
        code: userInfo.interactionInfo.code,
        userCode: userInfo.userCode, 
        content: content 
      })
    },
    shutDown () {
      clearInterval(intervalTimerWebsocket)
      clearInterval(intervalTimer1000)
      clearInterval(intervalTimer30000)
      window.removeEventListener('resize', this.resizeCanvas)
      document.removeEventListener('keyup', this.keyUpEventHandler)
      document.removeEventListener('keydown', this.keyDownEventHandler)
      document.getElementById('chat-content').removeEventListener('keyup', this.keyUpChatEventHandler)
      document.getElementById('chat-content').removeEventListener('focus', this.focusChatEventHandler)
      document.getElementById('chat-content').removeEventListener('blur', this.blurChatEventHandler)
      userInfo.webStage = this.$constants.WEB_STAGE_START
      canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userInfo.userCode, token: userInfo.token })
      }
      this.axios.post(this.api_path + "/logoff", requestOptions)
      this.$router.push('/')
    },
    setPlayerCharacter () {
      canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter = userInfo.playerInfo
      // if (userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.playerStatus == this.$constants.PLAYER_STATUS_INIT) {
        userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.playerStatus = this.$constants.PLAYER_STATUS_RUNNING
      // }
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.firstName = document.getElementById('initialization-firstName').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.lastName = document.getElementById('initialization-lastName').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.nickname = document.getElementById('initialization-nickname').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.nameColor = document.getElementById('initialization-nameColor').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.creatureType = document.getElementById('initialization-creature').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.gender = document.getElementById('initialization-gender').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.skinColor = Number(document.getElementById('initialization-skinColor').value)
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.hairstyle = document.getElementById('initialization-hairstyle').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.hairColor = document.getElementById('initialization-hairColor').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.eyes = document.getElementById('initialization-eyes').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.faceCoefs = []
      for (let i = 0; i < this.$constants.FACE_COEFS_LENGTH; i++) {
        userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.faceCoefs[i] = document.getElementById('initialization-coefs-' + (i + 1)).value
      }
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.avatar = document.getElementById('initialization-avatar').value
      if (userInfo.webStage === this.$constants.WEB_STAGE_INITIALIZING && userInfo.playerInfo.playerStatus == this.$constants.PLAYER_STATUS_RUNNING) {
        userInfo.webStage = this.$constants.WEB_STAGE_INITIALIZED
      }
    },
    interact () {
      var interactionCode = Number(document.getElementById('interactions-list').value)
      if (this.checkBlockTypeInteractive(userInfo.interactionInfo.type)) {
        // Interact with player
        if (userInfo.interactionInfo.type === this.$constants.BLOCK_TYPE_PLAYER) {
          if (interactionCode === this.$constants.INTERACTION_TALK) {
            scope = this.$constants.SCOPE_INDIVIDUAL
            chatTo = userInfo.interactionInfo.id
          } else if (interactionCode === this.$constants.INTERACTION_ATTACK) {
            this.setRelation(userInfo.userCode, userInfo.interactionInfo.id, -1, false)
          } else if (interactionCode === this.$constants.INTERACTION_FLIRT) {
            this.setRelation(userInfo.userCode, userInfo.interactionInfo.id, 1, false)
          } else if (interactionCode === this.$constants.INTERACTION_SUCCUMB) {
            this.setMember(userInfo.userCode, userInfo.interactionInfo.id)
          } else if (interactionCode === this.$constants.INTERACTION_EXPEL) {
            this.setMember(userInfo.interactionInfo.id, '')
          }
          return
        }
        // Interact with block
        userInfo.webSocketMessageDetail.functions.interactBlocks.push({
          interactionCode: interactionCode,
        })
        if (interactionCode === this.$constants.INTERACTION_USE) {
          this.updateRecipes()
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_USE
        } else if (interactionCode === this.$constants.INTERACTION_EXCHANGE) {
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_EXCHANGE
        } else if (interactionCode === this.$constants.INTERACTION_SLEEP) {
          // this.addChat('你打了一个盹。')
          // userInfo.playerInfo.vp = userInfo.playerInfo.vpMax
        } else if (interactionCode === this.$constants.INTERACTION_DRINK) {
          // this.addChat('你痛饮了起来。')
          // userInfo.playerInfo.thirst = userInfo.playerInfo.thirstMax
        } else if (interactionCode === this.$constants.INTERACTION_DECOMPOSE) {
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_DECOMPOSE
        } else if (interactionCode === this.$constants.INTERACTION_SET) {
          // this.addChat('你捯饬了起来。')
          this.prepareInitialization(userInfo.playerInfo)
          canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_SET
        }
      }
    },
    quitInteraction () {
      userInfo.interactionInfo = undefined
      userInfo.webSocketMessageDetail.functions.updateInteractionInfo = undefined
      // This is used for manually quiting interactions with special usage events 24/02/14
      canvasInfo.canvasMoveUse = this.$constants.MOVEMENT_STATE_IDLE
    },
    setRelation (userCodeA, userCodeB, newRelation, isAbsolute) {
      userInfo.webSocketMessageDetail.functions.setRelation = { 
        userCode: userCodeA, 
        nextUserCode: userCodeB, 
        newRelation: newRelation, 
        isAbsolute: isAbsolute
      }
    },
    setMemberRebel () {
      this.setMember(userInfo.userCode, '')
    },
    setMember (userCodeA, userCodeB) {
      userInfo.webSocketMessageDetail.functions.setMember = { 
        userCode: userCodeA, 
        nextUserCode: userCodeB
      }
    },
    resizeCanvas () {
      canvasInfo.canvas.width = document.documentElement.clientWidth - 4
      canvasInfo.canvas.height = document.documentElement.clientHeight - 4
      // console.log('New size: ' + canvasInfo.canvas.width + '*' + canvasInfo.canvas.height)
      
      // Initialize positions
      avatarPosition = { x: 0, y: 0 }
      buttonPositions = [
        { x: 0, y: this.$constants.DEFAULT_AVATAR_SIZE + 0 * this.$constants.DEFAULT_BUTTON_SIZE },
        { x: 0, y: this.$constants.DEFAULT_AVATAR_SIZE + 1 * this.$constants.DEFAULT_BUTTON_SIZE },
        { x: 0, y: this.$constants.DEFAULT_AVATAR_SIZE + 2 * this.$constants.DEFAULT_BUTTON_SIZE },
        { x: 0, y: this.$constants.DEFAULT_AVATAR_SIZE + 3 * this.$constants.DEFAULT_BUTTON_SIZE }
      ]
      minimapPosition = { x: 1.5 * this.$constants.DEFAULT_BUTTON_SIZE, y: this.$constants.DEFAULT_AVATAR_SIZE + 0.5 * this.$constants.DEFAULT_BUTTON_SIZE }
      status1Position = { x: this.$constants.DEFAULT_AVATAR_SIZE, y: 0 }
      status2Position = { x: canvasInfo.canvas.width - MAX_STATUS_LINE_SIZE - STATUS_SIZE, y: 0 }
      wheel1Position = { x: wheel1Radius, y: canvasInfo.canvas.height - wheel1Radius }
      if (canvasInfo.canvasMoveUse !== this.$constants.MOVEMENT_STATE_MOVING) {
        this.setHandlePosition(wheel1Position.x, wheel1Position.y)
      }
      wheel2Position = { x: canvasInfo.canvas.width - wheel2Radius, y: canvasInfo.canvas.height - wheel2Radius }
      chatPosition = { x: 10, y: wheel2Position.y - wheel1Radius - 60 }
      recordButtonPosition = { x: 20, y: chatPosition.y + 50 }
      movementModeButtonPosition = { x: wheel1Radius * 2, y: canvasInfo.canvas.height - this.$constants.DEFAULT_BUTTON_SIZE * 1.5 }
    },
    printChat () {
      if (this.isDef(userInfo.chatMessages)) {
        for (let i = 0; i < userInfo.chatMessages.length; i++) {
          this.printText(userInfo.chatMessages[userInfo.chatMessages.length - 1 - i], chatPosition.x, chatPosition.y - i * MSG_LINE_HEIGHT, Math.min(canvasInfo.canvas.width, MAX_MSG_LINE_HEIGHT), 'left')
        }
      }
    },
    resetScope () {
      scope = this.$constants.SCOPE_GLOBAL
    },
    findTopBossId (playerInfoTemp) {
      if (!this.isDef(playerInfoTemp)) {
        return undefined
      }
      while (this.isDef(playerInfoTemp) && !this.isBlankString(playerInfoTemp.bossId) && playerInfoTemp.bossId != playerInfoTemp.id) {
        playerInfoTemp = userInfo.playerInfos[playerInfoTemp.bossId]
      }
      return playerInfoTemp.id
    },
    checkPerceptionCondition (perceptionInfo, faceDirection, coordinate1, block2) {
      var distance = Math.sqrt(Math.pow(coordinate1.x - block2.x, 2) + Math.pow(coordinate1.y - block2.y, 2))
      var angle = this.calculateAngle(block2.x - coordinate1.x, block2.y - coordinate1.y)
      if (distance <= perceptionInfo.distinctVisionRadius
      && (block2.type !== this.$constants.BLOCK_TYPE_PLAYER
      || Math.abs(angle - faceDirection) % 360 < perceptionInfo.distinctVisionAngle / 2)) {
        return true
      }
      if (distance <= perceptionInfo.distinctHearingRadius) {
          return true
      }
      return false
    },
    drawBlock (block) {
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      this.$drawMethods.drawBlock(this.$constants, context, canvasInfo.deltaWidth, canvasInfo.deltaHeight, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, canvasInfo.blockSize,
      block, userInfo.worldInfo, userInfo.userCode, userInfo.playerInfos, staticData.items, images.effects, images.drops, images.scenes, images.blocks)
    },
    drawGridBlock () {
      this.$drawMethods.drawGridBlock(this.$constants, canvasInfo.canvas, canvasInfo.deltaWidth, canvasInfo.deltaHeight, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, canvasInfo.blockSize, userInfo.userCode, userInfo.playerInfos, userInfo.regionInfo, userInfo.grids, images.blocks)
    },
    drawAvatar (x, y, avatarSize, avatarIndex, nameColor) {
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      this.$drawMethods.drawAvatar(context, x, y, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE / 2, avatarSize, avatarIndex, nameColor, images.avatars)
    },
    drawCharacter (playerInfoTemp, x, y, characterBlockSize) {
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      var avatarIndex = undefined
      if (playerInfoTemp.creatureType == 1) {
        var topBossId = this.findTopBossId(playerInfoTemp)
        avatarIndex = this.isDef(topBossId) && topBossId != playerInfoTemp.id ? userInfo.playerInfos[topBossId].avatar : playerInfoTemp.avatar
      }
      this.$drawMethods.drawCharacter(this.$constants, context, canvasInfo.tempCanvas, x, y, canvasInfo.deltaWidth, canvasInfo.deltaHeight, this.$constants.DEFAULT_AVATAR_SIZE, this.$constants.DEFAULT_IMAGE_BLOCK_SIZE, characterBlockSize, this.$constants.DEFAULT_BLOCK_SIZE,
      {x: x * characterBlockSize + canvasInfo.deltaWidth, y: y * characterBlockSize + canvasInfo.deltaHeight},
      {x: (x + 1) * characterBlockSize + canvasInfo.deltaWidth, y: (y + 1) * characterBlockSize + canvasInfo.deltaHeight},
      userInfo.userCode, playerInfoTemp, userInfo.relations, avatarIndex,
      images.avatars, images.bodies, images.arms, images.eyes, images.hairstyles, images.tools, images.outfits, images.animals)
    },
    printText (content, x, y, maxWidth, textAlign) {
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      this.$drawMethods.printText(context, content, x, y, maxWidth, textAlign)
    },
    drawMinimap () {
      var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
      // this.$drawMethods.drawMinimap(context, minimapPosition.x, minimapPosition.y, 3 * this.$constants.DEFAULT_BUTTON_SIZE,
      // userInfo.regionInfo.radius, userInfo.playerInfo.sceneCoordinate.x, userInfo.playerInfo.sceneCoordinate.y)
      this.$drawMethods.drawMinimap(context, minimapPosition.x, minimapPosition.y, this.$constants.MINI_MAP_DEFAULT_SIZE, userInfo.miniMap)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
@import './style/world.css'
</style>
