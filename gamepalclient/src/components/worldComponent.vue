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
                <button id="chat-scope" class="chat-scope"  @click="updateChatScope()"></button>
                <input id="chat-content" class="chat-content" type="text" value=""/>
                <button id="chat-enter" class="chat-enter" @click="sendMsg()">Enter</button>
            </div>
            <div id="interactions" class="interactions">
                <select  id="interactions-list" class="interactions-list">
                </select>
                <button id="interactions-enter" class="interactions-enter" @click="interact()">OK</button>
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
                <input id="settings-blockSize" type="range" @change="changeSettingBlockSize()">
                <input id="settings-music" type="checkbox" @change="changeSettingMusic()">
                <input id="settings-sound" type="checkbox" @change="changeSettingSound()">
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
            <img id="waveEffect" src="../assets/image/effects/wave.png" />
            <img id="haloEffect" src="../assets/image/effects/halo.png" />
            <img id="healEffect" src="../assets/image/effects/heal.png" />
            <img id="disturbEffect" src="../assets/image/effects/disturb.png" />
            <img id="sacrificeEffect" src="../assets/image/effects/sacrifice.png" />
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

let constants = undefined

let canvasInfo = {
  canvas: undefined,
  tempCanvas: undefined,
  deltaWidth: undefined,
  deltaHeight: undefined,
  imageBlockSize: undefined,
  blockSize: undefined,
  canvasMoveUse: undefined,
  isKeyDown: { 0: false, 1: false, 2: false, 3: false, 10: false, 11: false, 12: false, 13: false }, // left 4 + right 4
  pointer: { x: undefined, y: undefined },
  avatarPosition: undefined,
  buttonPositions: undefined,
  minimapPosition: undefined,
  wheel1Position: undefined,
  handle1Position: undefined,
  wheel2Position: undefined,
  status1Position: undefined,
  status2Position: undefined,
  chatPosition: undefined,
  recordButtonPosition: undefined,
  movementModeButtonPosition: undefined
}

let staticData = {
  items: undefined,
  recipes: undefined
}

let images = {
  effectsImage: undefined,
  animalsImage: undefined,
  avatarsImage: undefined,
  bodiesImage: undefined,
  armsImage: undefined,
  eyesImage: undefined,
  hairstylesImage: undefined,
  toolsImage: undefined,
  outfitsImage: undefined,
  buttons: undefined,
  smallButtons: undefined,
  buffs: undefined,
  dropsImage: undefined,
  scenesImage: undefined,
  blockImages: []
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
  chatInfo: {
    scope: 0,
    chatMessages: [],
    voiceMessages: [],
    chatTo: undefined,
    isTyping: false
  }
}

var intervalTimerInit
var intervalTimerWebsocket
var intervalTimer1000
var intervalTimer30000

// let terminalOutputs = undefined

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
    constants = this.$constants
    for (var blockImageId in this.$blockImageIds) {
      // img.src = "../static/image/blocks/" + this.$blockImageIds[blockImageId] + ".png"
      // img.src = this.$images.blocks.get(this.$blockImageIds[blockImageId] + ".png")
      // img.src = this.$images.blockImages.get(this.$blockImageIds[blockImageId] + ".png")
      // var img = require("@/assets/image/blocks/" + this.$blockImageIds[blockImageId] + ".png")

      // var img = new Image()
      // img.src = this.$images.blocks1000
      // images.blocks[this.$blockImageIds[blockImageId]] = img
      // images.blockImages[this.$blockImageIds[blockImageId]] = img

      var imgNode = document.createElement("img")
      imgNode.id = "blockImage" + this.$blockImageIds[blockImageId]
      imgNode.src = require("../assets/image/blocks/" + this.$blockImageIds[blockImageId] + ".png")
      // document.getElementById('hiddenDiv').appendChild(imgNode)
      images.blockImages[this.$blockImageIds[blockImageId]] = imgNode
    }
    images.effectsImage = {
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
      'meleeScratchEffect': document.getElementById('meleeScratchEffect'),
      'meleeCleaveEffect': document.getElementById('meleeCleaveEffect'),
      'meleeStabEffect': document.getElementById('meleeStabEffect'),
      'sparkEffect': document.getElementById('sparkEffect')
    }
    images.animalsImage = [
      images.blockImages[3000],
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
    images.avatarsImage = document.getElementById('avatars')
    images.bodiesImage = [
      document.getElementById('body_c'),
      document.getElementById('body_m'),
      document.getElementById('body_a'),
      document.getElementById('body_l'),
      document.getElementById('body_b')
    ]
    images.armsImage = [
      document.getElementById('arms_c'),
      document.getElementById('arms_m'),
      document.getElementById('arms_a'),
      document.getElementById('arms_l'),
      document.getElementById('arms_b')
    ]
    images.eyesImage = document.getElementById('eyes')
    images.hairstylesImage = [
      document.getElementById('hairstyle_black'),
      document.getElementById('hairstyle_grey'),
      document.getElementById('hairstyle_orange')
    ]
    images.toolsImage = [
      document.getElementById('tools_s'),
      document.getElementById('tools_m'),
      document.getElementById('tools_l')
    ]
    images.outfitsImage = [
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
    images.scenesImage = {}
    images.scenesImage[constants.BLOCK_CODE_PREFIX_PLANTS] = document.getElementById('plants')
    images.scenesImage[constants.BLOCK_CODE_PREFIX_ROCKS] = document.getElementById('rocks')
    images.buttons = document.getElementById('buttons')
    images.smallButtons = document.getElementById('smallButtons')
    images.buffs = document.getElementById('buffs')
    images.dropsImage = document.getElementById('drops')
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
    initWeb () {
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
      document.getElementById('settings-blockSize').min = constants.MIN_BLOCK_SIZE
      document.getElementById('settings-blockSize').max = constants.MAX_BLOCK_SIZE
      document.getElementById('settings-blockSize').step = 10
      canvasInfo.imageBlockSize = constants.DEFAULT_IMAGE_BLOCK_SIZE
      canvasInfo.blockSize = constants.DEFAULT_BLOCK_SIZE
      document.getElementById('settings-blockSize').value = canvasInfo.blockSize
      document.getElementById('settings-music').checked = !musicMuted
      document.getElementById('settings-sound').checked = !soundMuted

      this.initTimers()
    },
    keyUpEventHandler(event) {
      if ((canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_IDLE && canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MOVING) || userInfo.chatInfo.isTyping) {
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
      if (userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING && ! canvasInfo.isKeyDown[0] && ! canvasInfo.isKeyDown[1] && ! canvasInfo.isKeyDown[2] && ! canvasInfo.isKeyDown[3]) {
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
        this.setHandlePosition(canvasInfo.wheel1Position.x, canvasInfo.wheel1Position.y)
      }
    },
    keyDownEventHandler(event) {
      if ((canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_IDLE && canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MOVING) || userInfo.chatInfo.isTyping) {
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
      userInfo.chatInfo.isTyping = true
    },
    blurChatEventHandler(event) {
      event.preventDefault()
      userInfo.chatInfo.isTyping = false
    },
    initTimers () {
      // 需要定时执行的代码
      intervalTimerWebsocket = setInterval(() => {
        // if (this.websocket.readyState === 1) {
          this.sendWebsocketMessage()
        // }
      }, constants.WEBSOCKET_PERIOD_IN_MS)
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
        if (this.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING
        && userInfo.diffSecond > 15) {
          console.log('Connection lost.')
          this.logoff()
        }
        userInfo.websocketMsgSize = e.data.length
      }

      // Update staticData 24/05/05
      if (userInfo.webStage == constants.WEB_STAGE_START) {
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

      if (userInfo.webStage == constants.WEB_STAGE_START) {
        this.initWeb()
        if (this.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_INIT) {
          // Character initialization
          this.prepareInitialization(userInfo.playerInfo)
          userInfo.webStage = constants.WEB_STAGE_INITIALIZING
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_SET
        } else {
          userInfo.webStage = constants.WEB_STAGE_INITIALIZED
        }
      } else if (userInfo.webStage == constants.WEB_STAGE_INITIALIZING) {
        // Nothing
      } else if (userInfo.webStage == constants.WEB_STAGE_INITIALIZED) {
        if (!userInfo.flags[constants.FLAG_UPDATE_MOVEMENT]) {
          userInfo.playerInfo.regionNo = originPlayerInfo.regionNo
          userInfo.playerInfo.sceneCoordinate = originPlayerInfo.sceneCoordinate
          userInfo.playerInfo.coordinate = originPlayerInfo.coordinate
          userInfo.playerInfo.speed = originPlayerInfo.speed
          userInfo.playerInfo.faceDirection = originPlayerInfo.faceDirection
        }
        // Without this, the figure will shake during the game 24/03/17
        userInfo.playerInfo.playerStatus = constants.PLAYER_STATUS_RUNNING
      }

      userInfo.relations = response.relations

      // Flags
      if (userInfo.flags[constants.FLAG_UPDATE_ITEMS]) {
        this.updateItems()
      }
      if (userInfo.flags[constants.FLAG_UPDATE_INTERACTED_ITEMS]) {
        this.updateInteractedItems()
      }
      if (userInfo.flags[constants.FLAG_UPDATE_RECIPES]) {
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
          if (message.type == constants.MESSAGE_TYPE_PRINTED) {
            var fromNickname = '[已离线]'
            if (this.isDef(userInfo.playerInfos[fromUserCode])) {
              fromNickname = userInfo.playerInfos[fromUserCode].nickname
            }
            if (message.scope === constants.SCOPE_GLOBAL) {
              this.addChat(fromNickname + ':[广播]' + message.content)
            } else if (message.scope === constants.SCOPE_TEAMMATE) {
              this.addChat(fromNickname + ':[队友]' + message.content)
            } else if (message.scope === constants.SCOPE_INDIVIDUAL) {
              this.addChat(fromNickname + ':' + message.content)
            } else if (message.scope === constants.SCOPE_SELF) {
              this.addChat(message.content)
            }
          } else if (message.type == constants.MESSAGE_TYPE_VOICE) {
            console.log('VOICE IN')
            userInfo.chatInfo.voiceMessages.push(message.content)
          }
        }
      }

      // Check terminal output
      // if (this.isDef(response.terminalOutputs)) {
      //   for (var j = 0; j < response.terminalOutputs.length; j++) {
      //     if (!this.isDef(response.terminalOutputs[j])) {
      //       continue
      //     }
      //     if (this.isDef(response.terminalOutputs[j].content)) {
      //       document.getElementById('terminal-text').value += '\n' + response.terminalOutputs[j].content
      //       document.getElementById('terminal-text').scrollTop = document.getElementById('terminal-text').scrollHeight
      //     } else {
      //       terminalOutputs = response.terminalOutputs[j]
      //     }
      //   }
      // }

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
      if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MOVING 
      || userInfo.playerInfo.buff[constants.BUFF_CODE_DEAD] != 0
      || Math.pow(canvasInfo.pointer.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - userInfo.playerInfo.coordinate.y, 2) < Math.pow(constants.MIN_MOVE_DISTANCE_POINTER_PLAYER, 2)) {
        userInfo.playerInfo.speed.x = 0
        userInfo.playerInfo.speed.y = 0
      } else {
        this.settleSpeed(userInfo.userCode, userInfo.playerInfo)
        // Randomly get item
        var timestamp = new Date().valueOf()
        if (Math.random() <= 0.01) {
          if (timestamp % 150 < 150) {
            var itemName = constants.ITEM_CHARACTER_JUNK
            if (timestamp % 150 + 1 < 10) {
              itemName += '00'
            } else if (timestamp % 150 + 1 < 100) {
              itemName += '0'
            }
            itemName += (timestamp % 150 + 1)
            this.getItems(itemName, 1)
            this.getItems('t013', 1)
            this.getItems('t021', 1)
            this.getItems('t218', 1)
            this.getItems('t009', 1)
            this.getItems('t008', 1)
            this.getItems('t011', 1)
            this.getItems('a023', 10)
            this.getItems('t207', 1)
            this.getItems('t222', 1)
            this.getItems('a022', 50)
            this.getItems('t221', 1)
            this.getItems('a021', 4)
            this.getItems('t301', 1)
            this.getItems('t302', 1)
            this.getItems('t303', 1)
            this.getItems('t304', 1)
            this.getItems('t305', 1)
            this.getItems('t306', 1)
            this.getItems('t351', 1)
            this.getItems('t022', 1)
            this.getItems('t023', 1)
            this.getItems('t118', 1)
            this.getItems('t119', 1)
            this.getItems('t232', 1)
            this.getItems('t233', 1)
            this.getItems('t234', 1)
            this.getItems('a015', 30)
            this.getItems('o001', 1)
            this.getItems('o002', 1)
            this.getItems('c001', 1)
            this.getItems('c002', 1)
            this.getItems('c003', 1)
            this.getItems('c004', 1)
            this.getItems('n001', 1)
            this.getItems('r001', 1)
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
      // if (userInfo.webStage !== constants.WEB_STAGE_INITIALIZED) {
        // return
      // }
      this.websocket.send(JSON.stringify(userInfo.webSocketMessageDetail))
      this.resetWebSocketMessageDetail()
      if (userInfo.webStage !== constants.WEB_STAGE_START) {
        if (!this.isDef(userInfo.playerInfo) || userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_INIT) {
          userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter = userInfo.playerInfo
        } else if (userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING) {
          userInfo.webSocketMessageDetail.functions.updatePlayerMovement = {
            worldCoordinate: userInfo.playerInfo,
            movementInfo: userInfo.playerInfo
          }
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
          // useDrop: undefined,
          setRelation: undefined,
          useItems: [],
          getItems: [],
          getPreservedItems: [],
          getInteractedItems: [],
          useRecipes: [],
          updateInteraction: undefined,
          interactBlocks: [],
          terminalInputs: [],
          useSkills: [false, false, false, false],
          createPlayerInfoInstance: undefined,
          updatePlayerMovement: undefined,
          setMember: undefined,
          updateMiniMap: undefined
        },
      }
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
        for (let i = 0; i < constants.FACE_COEFS_LENGTH; i++) {
          document.getElementById('initialization-coefs-' + (i + 1)).value = playerInfoTemp.faceCoefs[i]
        }
      }
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
          case constants.ITEM_CHARACTER_TOOL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              if (this.isDef(userInfo.playerInfo.tools) && userInfo.playerInfo.tools.length > 0 && userInfo.playerInfo.tools.includes(itemNo)) {
                document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            break
          case constants.ITEM_CHARACTER_OUTFIT:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.isDef(userInfo.playerInfo.outfits) && userInfo.playerInfo.outfits.length > 0 && userInfo.playerInfo.outfits.includes(itemNo)) {
                      document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            break
          case constants.ITEM_CHARACTER_CONSUMABLE:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case constants.ITEM_CHARACTER_MATERIAL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option('○[材料]' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case constants.ITEM_CHARACTER_JUNK:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case constants.ITEM_CHARACTER_AMMO:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case constants.ITEM_CHARACTER_NOTE:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
              document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
            break
          case constants.ITEM_CHARACTER_RECORDING:
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
        if (document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_TOOL) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_OUTFIT) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_CONSUMABLE) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_MATERIAL || document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_JUNK) {
          document.getElementById('items-desc').value = item.description
          if (document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_JUNK) {
            document.getElementById('items-desc').value += '\n可拆解材料： '
            for (let material in item.materials) {
              document.getElementById('items-desc').value += '\n' + staticData.items[material].name + '(' + item.materials[material] + ')'
            }
          }
        }
        if (document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_AMMO) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_NOTE) {
          document.getElementById('items-desc').value = item.description
        }
        if (document.getElementById('items-name').value.charAt(0) == constants.ITEM_CHARACTER_RECORDING) {
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
        if (itemNo.charAt(0) == constants.ITEM_CHARACTER_TOOL) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == constants.ITEM_CHARACTER_OUTFIT) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == constants.ITEM_CHARACTER_CONSUMABLE) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '3') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == constants.ITEM_CHARACTER_MATERIAL || itemNo.charAt(0) == constants.ITEM_CHARACTER_JUNK) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '4') {
            if (itemNo.charAt(0) == constants.ITEM_CHARACTER_MATERIAL) {
              document.getElementById('items-exchange-name').options.add(new Option('○[材料]' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            } else {
              document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
            }
          }
        }
        if (itemNo.charAt(0) == constants.ITEM_CHARACTER_AMMO) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '5') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == constants.ITEM_CHARACTER_NOTE) {
          if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '6') {
            document.getElementById('items-exchange-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
          }
        }
        if (itemNo.charAt(0) == constants.ITEM_CHARACTER_RECORDING) {
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
        if (document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_TOOL) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_OUTFIT) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_CONSUMABLE) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_MATERIAL || document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_JUNK) {
          document.getElementById('items-exchange-desc').value = item.description
          if (document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_JUNK) {
            document.getElementById('items-exchange-desc').value += '\n可拆解材料： '
            for (let material in item.materials) {
              document.getElementById('items-exchange-desc').value += '\n' + staticData.items[material].name + '(' + item.materials[material] + ')'
            }
          }
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_AMMO) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_NOTE) {
          document.getElementById('items-exchange-desc').value = item.description
        }
        if (document.getElementById('items-exchange-name').value.charAt(0) == constants.ITEM_CHARACTER_RECORDING) {
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
      // var recipeChar
      // switch (userInfo.interactionInfo.type) {
      //   case constants.BLOCK_TYPE_WORKSHOP:
      //     recipeChar = constants.RECIPE_CHARACTER_WORKSHOP
      //     break
      //   case constants.BLOCK_TYPE_COOKER:
      //     recipeChar = constants.RECIPE_CHARACTER_COOKER
      //     break
      //   case constants.BLOCK_TYPE_SINK:
      //   case constants.BLOCK_TYPE_TOILET:
      //     recipeChar = constants.RECIPE_CHARACTER_SINK
      //     break
      // }
      var checkValue = document.getElementById('recipes-name').value
      document.getElementById('recipes-name').length = 0
      if (!this.isDef(staticData.recipes) || staticData.recipes.length == 0 || !this.isDef(userInfo.interactionInfo)) {
        return
      }
      document.getElementById('recipes-range').min = 0
      document.getElementById('recipes-range').max = 0
      var checkValueFound = false
      for (var recipeNo in staticData.recipes) {
        if (staticData.recipes[recipeNo].type != userInfo.interactionInfo.type) {
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
          checkValueFound = true
        }
      }
      // if (this.isBlankString(checkValue) || checkValue.charAt(0) != recipeChar) {
      if (this.isBlankString(checkValue) || !checkValueFound) {
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
      if (userInfo.webStage !== constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_INFO 
      || canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_BACKPACK 
      || canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_SETTINGS 
      || canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_EXCHANGE 
      || canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_USE 
      || canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_SET 
      || canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_MEMBERS) {
        if (x >= canvasInfo.canvas.width - constants.MENU_RIGHT_EDGE - constants.DEFAULT_SMALL_BUTTON_SIZE && x <= canvasInfo.canvas.width - constants.MENU_RIGHT_EDGE && y >= constants.MENU_TOP_EDGE && y <= constants.MENU_TOP_EDGE + constants.DEFAULT_SMALL_BUTTON_SIZE) {
          // Click 'X'
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
        }
        return
      }
      if (x >= canvasInfo.avatarPosition.x && x < canvasInfo.avatarPosition.x + constants.DEFAULT_AVATAR_SIZE && y >= canvasInfo.avatarPosition.y && y < canvasInfo.avatarPosition.y + constants.DEFAULT_AVATAR_SIZE) {
        // Avatar
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_AVATAR
      } else if (x >= canvasInfo.buttonPositions[0].x && x < canvasInfo.buttonPositions[0].x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.buttonPositions[0].y && y < canvasInfo.buttonPositions[0].y + constants.DEFAULT_BUTTON_SIZE) {
        // Personal information
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_INFO
      } else if (x >= canvasInfo.buttonPositions[1].x && x < canvasInfo.buttonPositions[1].x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.buttonPositions[1].y && y < canvasInfo.buttonPositions[1].y + constants.DEFAULT_BUTTON_SIZE) {
        // Backpack
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_BACKPACK
      } else if (x >= canvasInfo.buttonPositions[2].x && x < canvasInfo.buttonPositions[2].x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.buttonPositions[2].y && y < canvasInfo.buttonPositions[2].y + constants.DEFAULT_BUTTON_SIZE) {
        // Members
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MEMBERS
      } else if (x >= canvasInfo.buttonPositions[3].x && x < canvasInfo.buttonPositions[3].x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.buttonPositions[3].y && y < canvasInfo.buttonPositions[3].y + constants.DEFAULT_BUTTON_SIZE) {
        // Settings
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_SETTINGS
      } else if (x >= canvasInfo.movementModeButtonPosition.x && x < canvasInfo.movementModeButtonPosition.x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.movementModeButtonPosition.y && y < canvasInfo.movementModeButtonPosition.y + constants.DEFAULT_BUTTON_SIZE) {
        // Movement mode
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVEMENT_MODE
      } else if (x >= canvasInfo.recordButtonPosition.x && x < (canvasInfo.recordButtonPosition.x + constants.DEFAULT_SMALL_BUTTON_SIZE) && y >= canvasInfo.recordButtonPosition.y && y < (canvasInfo.recordButtonPosition.y + constants.DEFAULT_SMALL_BUTTON_SIZE)) {
        // Voice record
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_RECORDER
        this.recordStart()
      } else {
        if (Math.pow(canvasInfo.wheel1Position.x - x, 2) + Math.pow(canvasInfo.wheel1Position.y - y, 2) <= Math.pow(constants.WHEEL_1_RADIUS, 2)) {
          // New movement system 24/02/19
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(x, y)
          this.updatePointer(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y)
        }
        if (Math.pow(canvasInfo.wheel2Position.x - x, 2) + Math.pow(canvasInfo.wheel2Position.y - y, 2) <= Math.pow(constants.WHEEL_2_RADIUS, 2)) {
          if (y - canvasInfo.wheel2Position.y > x - canvasInfo.wheel2Position.x) {
            if (y - canvasInfo.wheel2Position.y > canvasInfo.wheel2Position.x - x) {
                canvasInfo.isKeyDown[13] = true
            } else { 
                canvasInfo.isKeyDown[11] = true
            }
          } else {
            if (y - canvasInfo.wheel2Position.y > canvasInfo.wheel2Position.x - x) {
                canvasInfo.isKeyDown[12] = true
            } else {
                canvasInfo.isKeyDown[10] = true
            }
          }
        }
      }
    },
    wheelKeyUp (index) {
      if (userInfo.webStage !== constants.WEB_STAGE_INITIALIZED) {
        return
      }
      userInfo.webSocketMessageDetail.functions.useSkills[index - 10] = false
    },
    wheelKeyDown (index) {
      if (userInfo.webStage !== constants.WEB_STAGE_INITIALIZED) {
        return
      }
      switch (index) {
        case 0:
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y - 0.1 * constants.WHEEL_1_RADIUS)
          this.updatePointer(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y)
          break
        case 1:
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(canvasInfo.handle1Position.x - 0.1 * constants.WHEEL_1_RADIUS, canvasInfo.handle1Position.y)
          this.updatePointer(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y)
          break
        case 2:
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(canvasInfo.handle1Position.x + 0.1 * constants.WHEEL_1_RADIUS, canvasInfo.handle1Position.y)
          this.updatePointer(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y)
          break
        case 3:
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
          this.setHandlePosition(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y + 0.1 * constants.WHEEL_1_RADIUS)
          this.updatePointer(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y)
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
    setHandlePosition (x, y) {
      var distance = Math.sqrt(Math.pow(x - canvasInfo.wheel1Position.x, 2) + Math.pow(y - canvasInfo.wheel1Position.y, 2))
      distance = Math.max(distance, constants.WHEEL_1_RADIUS / 2)
      canvasInfo.handle1Position = {
        x: canvasInfo.wheel1Position.x + (x - canvasInfo.wheel1Position.x) * (constants.WHEEL_1_RADIUS / 2) / distance,
        y: canvasInfo.wheel1Position.y + (y - canvasInfo.wheel1Position.y) * (constants.WHEEL_1_RADIUS / 2) / distance
      }
    },
    updatePointer (x, y) {
      canvasInfo.pointer.x = x - canvasInfo.wheel1Position.x
      canvasInfo.pointer.y = y - canvasInfo.wheel1Position.y
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
      if (userInfo.webStage !== constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_MOVING) {
        this.setHandlePosition(x, y)
        this.updatePointer(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y)
      }
    },
    canvasUp () {
      this.canvasLeave()
    },
    canvasLeave () {
      if (userInfo.webStage !== constants.WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_RECORDER) {
        this.recordEnd()
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
      } else if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_MOVING) {
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
        this.setHandlePosition(canvasInfo.wheel1Position.x, canvasInfo.wheel1Position.y)
        this.updatePointer(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y)
      } else if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_MOVEMENT_MODE) {
        if (userInfo.movementMode == constants.MOVEMENT_MODE_STAND_GROUND) {
          userInfo.movementMode = constants.MOVEMENT_MODE_WALK
        } else if (userInfo.movementMode == constants.MOVEMENT_MODE_WALK) {
          userInfo.movementMode = constants.MOVEMENT_MODE_DEFAULT
        } else {
          userInfo.movementMode = constants.MOVEMENT_MODE_STAND_GROUND
        }
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
      }
      canvasInfo.isKeyDown[10] = false
      canvasInfo.isKeyDown[11] = false
      canvasInfo.isKeyDown[12] = false
      canvasInfo.isKeyDown[13] = false
    },
    // useDrop (newDrop) {
    //   userInfo.webSocketMessageDetail.functions.useDrop = { 
    //     id: newDrop.id
    //   }
    // },
    detectCollision (oldP1, oldP2, structure1, structure2) {
      var p1 = { x: oldP1.x + structure1.shape.center.x, y: oldP1.y + structure1.shape.center.y }
      var p2 = { x: oldP2.x + structure2.shape.center.x, y: oldP2.y + structure2.shape.center.y }
      if (constants.STRUCTURE_SHAPE_TYPE_SQUARE == structure1.shape.shapeType) {
        structure1.shape.shapeType = constants.STRUCTURE_SHAPE_TYPE_RECTANGLE
        structure1.shape.radius.y = structure1.shape.radius.x
      }
      if (constants.STRUCTURE_SHAPE_TYPE_SQUARE == structure2.shape.shapeType) {
        structure2.shape.shapeType = constants.STRUCTURE_SHAPE_TYPE_RECTANGLE
        structure2.shape.radius.y = structure2.shape.radius.x
      }
      // Round vs. round
      if (constants.STRUCTURE_SHAPE_TYPE_ROUND == structure1.shape.shapeType && constants.STRUCTURE_SHAPE_TYPE_ROUND == structure2.shape.shapeType) {
        if (Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)) <= structure1.shape.radius.x + structure2.shape.radius.x) {
          return true
        }
        return false
      }
      // Rectangle vs. rectangle
      if (constants.STRUCTURE_SHAPE_TYPE_RECTANGLE == structure1.shape.shapeType && constants.STRUCTURE_SHAPE_TYPE_RECTANGLE == structure2.shape.shapeType) {
        if (Math.abs(p1.x - p2.x) <= structure1.shape.radius.x + structure2.shape.radius.x && Math.abs(p1.y - p2.y) <= structure1.shape.radius.y + structure2.shape.radius.y) {
          return true
        }
        return false
      }
      // Round vs. rectangle
      if (constants.STRUCTURE_SHAPE_TYPE_ROUND == structure2.shape.shapeType) {
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
    checkMaterialCollision (structureMaterial1, structureMaterial2) {
      switch (structureMaterial1) {
        case constants.STRUCTURE_MATERIAL_FLESH:
          return structureMaterial2 == constants.STRUCTURE_MATERIAL_SOLID
            || structureMaterial2 == constants.STRUCTURE_MATERIAL_FLESH
        case constants.STRUCTURE_MATERIAL_MAGNUM:
          return structureMaterial2 == constants.STRUCTURE_MATERIAL_SOLID
            || structureMaterial2 == constants.STRUCTURE_MATERIAL_MAGNUM
        case constants.STRUCTURE_MATERIAL_PLASMA:
          return structureMaterial2 == constants.STRUCTURE_MATERIAL_SOLID
        case constants.STRUCTURE_MATERIAL_SOLID:
          return structureMaterial2 != constants.STRUCTURE_MATERIAL_HOLLOW
        case constants.STRUCTURE_MATERIAL_HOLLOW:
        default:
          return false
      }
    },
    settleSpeed (id, movingBlock) {
      // Speed logics, sync with back-end 24/08/24
      var speed = Math.sqrt(Math.pow(movingBlock.speed.x, 2) + Math.pow(movingBlock.speed.y, 2)) + movingBlock.acceleration
      if (userInfo.playerInfo.buff[constants.BUFF_CODE_STUNNED] !== 0) {
        speed = 0
      } else if (userInfo.playerInfo.buff[constants.BUFF_CODE_FRACTURED] !== 0) {
        speed = Math.min(movingBlock.maxSpeed * 0.25, speed)
      } else if (userInfo.playerInfo.buff[constants.BUFF_CODE_OVERWEIGHTED] !== 0) {
        speed = Math.min(movingBlock.maxSpeed * 0.25, speed)
      } else if (userInfo.playerInfo.buff[constants.BUFF_CODE_FATIGUED] !== 0) {
        speed = Math.min(movingBlock.maxSpeed * 0.25, speed)
      } else if (userInfo.movementMode === constants.MOVEMENT_MODE_WALK) {
        speed = Math.min(movingBlock.maxSpeed * 0.45, speed)
      } else {
        speed = Math.min(movingBlock.maxSpeed, speed)
      }
      movingBlock.speed.x = speed * (canvasInfo.pointer.x - movingBlock.coordinate.x) / Math.sqrt(Math.pow(canvasInfo.pointer.x - movingBlock.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - movingBlock.coordinate.y, 2))
      movingBlock.speed.y = speed * (canvasInfo.pointer.y - movingBlock.coordinate.y) / Math.sqrt(Math.pow(canvasInfo.pointer.x - movingBlock.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - movingBlock.coordinate.y, 2))

      movingBlock.faceDirection = this.calculateAngle(movingBlock.speed.x, movingBlock.speed.y)
      if (userInfo.movementMode === constants.MOVEMENT_MODE_STAND_GROUND) {
        movingBlock.speed.x = 0
        movingBlock.speed.y = 0
      }

      var newCoordinate
      for (var i = 0; i < userInfo.blocks.length; i++) {
        if (movingBlock.speed.x === 0 && movingBlock.speed.y === 0) {
          // No speed
          break
        }
        if (userInfo.blocks[i].type == constants.BLOCK_TYPE_PLAYER && userInfo.blocks[i].id == id) {
          // Player himself is to be past
          continue
        }
        if (userInfo.blocks[i].type == constants.BLOCK_TYPE_TELEPORT
            && this.detectCollision({ x: movingBlock.coordinate.x + movingBlock.speed.x, y: movingBlock.coordinate.y + movingBlock.speed.y }, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)) {
          movingBlock.speed.x = 0
          movingBlock.speed.y = 0
          newCoordinate = {
            regionNo: userInfo.blocks[i].to.regionNo,
            sceneCoordinate: userInfo.blocks[i].to.sceneCoordinate,
            coordinate: userInfo.blocks[i].to.coordinate
          }
          break // This is important
        }
        if (!this.detectCollision(movingBlock.coordinate, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)
        && this.detectCollision({ x: movingBlock.coordinate.x + movingBlock.speed.x, y: movingBlock.coordinate.y }, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)
        && this.checkMaterialCollision(movingBlock.structure.material, userInfo.blocks[i].structure.material)) {
          movingBlock.speed.x = 0
        }
        if (!this.detectCollision(movingBlock.coordinate, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)
        && this.detectCollision({ x: movingBlock.coordinate.x, y: movingBlock.coordinate.y + movingBlock.speed.y }, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)
        && this.checkMaterialCollision(movingBlock.structure.material, userInfo.blocks[i].structure.material)) {
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
        // Unable to send voice msg through websocket 24/09/01
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
      if (!this.isDef(userInfo.chatInfo.chatTo) && userInfo.chatInfo.scope === constants.SCOPE_INDIVIDUAL) {
        // No receiver
        return
      }
      document.getElementById('chat-content').value = ''
      userInfo.webSocketMessageDetail.functions.addMessages.push({
         type: constants.MESSAGE_TYPE_PRINTED, 
         scope: userInfo.chatInfo.scope, 
         fromUserCode: userInfo.userCode, 
         toUserCode: userInfo.chatInfo.chatTo, 
         content: content 
        })
    },
    async sendVoice () {
      // Voice msg has to be sent through HTTP request/ 24/09/01
      if (!this.isDef(userInfo.chatInfo.chatTo) && userInfo.chatInfo.scope === constants.SCOPE_INDIVIDUAL) {
        // No receiver
        return
      }
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
          type: constants.MESSAGE_TYPE_VOICE, 
          scope: userInfo.chatInfo.scope, 
          fromUserCode: userInfo.userCode, 
          toUserCode: userInfo.chatInfo.chatTo, 
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
    async playBlob (blob) {
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
      userInfo.chatInfo.chatMessages.push(msgContent)
        while (userInfo.chatInfo.chatMessages.length > constants.MAX_MSG_LINE_NUM) {
          userInfo.chatInfo.chatMessages = userInfo.chatInfo.chatMessages.slice(1)
        }
    },
    updateChat () {
      if (this.isDef(userInfo.chatInfo.chatMessages)) {
        userInfo.chatInfo.chatMessages = userInfo.chatInfo.chatMessages.slice(1)
      }
    },
    async updateVoice () {
      if (userInfo.chatInfo.voiceMessages.length > 0 && !micInUse) {
        var blobRes = await fetch(userInfo.chatInfo.voiceMessages[0]).then(res => res.blob())
        userInfo.chatInfo.voiceMessages = userInfo.chatInfo.voiceMessages.slice(1)
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
      userInfo.webStage = constants.WEB_STAGE_START
      canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userCode: userInfo.userCode, token: userInfo.token })
      }
      this.axios.post(this.api_path + "/logoff", requestOptions)
      this.$router.push('/')
    },
    setPlayerCharacter () {
      canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter = userInfo.playerInfo
      // if (userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.playerStatus == constants.PLAYER_STATUS_INIT) {
        userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.playerStatus = constants.PLAYER_STATUS_RUNNING
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
      for (let i = 0; i < constants.FACE_COEFS_LENGTH; i++) {
        userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.faceCoefs[i] = document.getElementById('initialization-coefs-' + (i + 1)).value
      }
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.avatar = document.getElementById('initialization-avatar').value
      if (userInfo.webStage === constants.WEB_STAGE_INITIALIZING && userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING) {
        userInfo.webStage = constants.WEB_STAGE_INITIALIZED
      }
    },
    interact () {
      var interactionCode = Number(document.getElementById('interactions-list').value)
      if (this.checkBlockTypeInteractive(userInfo.interactionInfo.type)) {
        // Interact with player
        if (userInfo.interactionInfo.type === constants.BLOCK_TYPE_PLAYER) {
          if (interactionCode === constants.INTERACTION_TALK) {
            userInfo.chatInfo.scope = constants.SCOPE_INDIVIDUAL
            userInfo.chatInfo.chatTo = userInfo.interactionInfo.id
          } else if (interactionCode === constants.INTERACTION_ATTACK) {
            this.setRelation(userInfo.userCode, userInfo.interactionInfo.id, -1, false)
          } else if (interactionCode === constants.INTERACTION_FLIRT) {
            this.setRelation(userInfo.userCode, userInfo.interactionInfo.id, 1, false)
          } else if (interactionCode === constants.INTERACTION_SUCCUMB) {
            this.setMember(userInfo.userCode, userInfo.interactionInfo.id)
          } else if (interactionCode === constants.INTERACTION_EXPEL) {
            this.setMember(userInfo.interactionInfo.id, '')
          }
          return
        }
        // Interact with block
        userInfo.webSocketMessageDetail.functions.interactBlocks.push({
          interactionCode: interactionCode,
        })
        if (interactionCode === constants.INTERACTION_USE) {
          this.updateRecipes()
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_USE
        } else if (interactionCode === constants.INTERACTION_EXCHANGE) {
          document.getElementById('items-type').value = '0'
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_EXCHANGE
        } else if (interactionCode === constants.INTERACTION_SLEEP) {
          // userInfo.playerInfo.vp = userInfo.playerInfo.vpMax
        } else if (interactionCode === constants.INTERACTION_DRINK) {
          // userInfo.playerInfo.thirst = userInfo.playerInfo.thirstMax
        } else if (interactionCode === constants.INTERACTION_DECOMPOSE) {
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_DECOMPOSE
        } else if (interactionCode === constants.INTERACTION_SET) {
          this.prepareInitialization(userInfo.playerInfo)
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_SET
        }
      }
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
      canvasInfo.avatarPosition = { x: 0, y: 0 }
      canvasInfo.buttonPositions = [
        { x: 0, y: constants.DEFAULT_AVATAR_SIZE + 0 * constants.DEFAULT_BUTTON_SIZE },
        { x: 0, y: constants.DEFAULT_AVATAR_SIZE + 1 * constants.DEFAULT_BUTTON_SIZE },
        { x: 0, y: constants.DEFAULT_AVATAR_SIZE + 2 * constants.DEFAULT_BUTTON_SIZE },
        { x: 0, y: constants.DEFAULT_AVATAR_SIZE + 3 * constants.DEFAULT_BUTTON_SIZE }
      ]
      canvasInfo.minimapPosition = { x: 1.5 * constants.DEFAULT_BUTTON_SIZE, y: constants.DEFAULT_AVATAR_SIZE + 0.5 * constants.DEFAULT_BUTTON_SIZE }
      canvasInfo.status1Position = { x: constants.DEFAULT_AVATAR_SIZE, y: 0 }
      canvasInfo.status2Position = { x: canvasInfo.canvas.width - constants.MAX_STATUS_LINE_SIZE - constants.STATUS_SIZE, y: 0 }
      canvasInfo.wheel1Position = { x: constants.WHEEL_1_RADIUS, y: canvasInfo.canvas.height - constants.WHEEL_1_RADIUS }
      if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MOVING) {
        this.setHandlePosition(canvasInfo.wheel1Position.x, canvasInfo.wheel1Position.y)
      }
      canvasInfo.wheel2Position = { x: canvasInfo.canvas.width - constants.WHEEL_2_RADIUS, y: canvasInfo.canvas.height - constants.WHEEL_2_RADIUS }
      canvasInfo.chatPosition = { x: 10, y: canvasInfo.wheel2Position.y - constants.WHEEL_1_RADIUS - 60 }
      canvasInfo.recordButtonPosition = { x: 20, y: canvasInfo.chatPosition.y + 50 }
      canvasInfo.movementModeButtonPosition = { x: constants.WHEEL_1_RADIUS * 2, y: canvasInfo.canvas.height - constants.DEFAULT_BUTTON_SIZE * 1.5 }
    },
    updateChatScope () {
      if (userInfo.chatInfo.scope === constants.SCOPE_GLOBAL) {
        userInfo.chatInfo.scope = constants.SCOPE_TEAMMATE
      } else if (userInfo.chatInfo.scope === constants.SCOPE_TEAMMATE) {
        userInfo.chatInfo.scope = constants.SCOPE_INDIVIDUAL
      } else if (userInfo.chatInfo.scope === constants.SCOPE_INDIVIDUAL) {
        userInfo.chatInfo.scope = constants.SCOPE_GLOBAL
      }
    },
    checkPerceptionCondition (perceptionInfo, faceDirection, coordinate1, block2) {
      var distance = Math.sqrt(Math.pow(coordinate1.x - block2.x, 2) + Math.pow(coordinate1.y - block2.y, 2))
      var angle = this.calculateAngle(block2.x - coordinate1.x, block2.y - coordinate1.y)
      if (distance <= perceptionInfo.distinctVisionRadius
      && (block2.type !== constants.BLOCK_TYPE_PLAYER
      || Math.abs(angle - faceDirection) % 360 < perceptionInfo.distinctVisionAngle / 2)) {
        return true
      }
      if (distance <= perceptionInfo.distinctHearingRadius) {
          return true
      }
      return false
    },
    changeSettingBlockSize () {
      canvasInfo.blockSize = Number(document.getElementById('settings-blockSize').value)
    },
    changeSettingMusic () {
      musicMuted = !document.getElementById('settings-music').checked
    },
    changeSettingSound () {
      soundMuted = !document.getElementById('settings-sound').checked
    },
    show () {
      this.$drawMethods.show(canvasInfo, staticData, images, userInfo)
    },
    checkBlockTypeInteractive (blockType) {
      return this.$drawMethods.checkBlockTypeInteractive(blockType)
    },
    calculateAngle (x, y) {
      return this.$drawMethods.calculateAngle(x, y)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
@import './style/world.css'
</style>
