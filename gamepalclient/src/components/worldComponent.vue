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
                <select id="interactions-list" class="interactions-list">
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
                <button id="items-recycle" class="items-recycle" @click="recycleItem()">拆解</button>
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
                <input id="settings-teen" type="checkbox" @change="changeSettingTeen()">
                <button id="settings-about" class="settings-about">关于</button>
                <button id="settings-logoff" class="settings-logoff" @click="logoff()">注销</button>
            </div>
            <div id="initialization" class="initialization">
              <div id="initialization-settings" class="initialization-settings">
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
                <br/>
                模型
                <select id="initialization-creature" @change="updateInitializationByCreatureType()">
                    <option value="1">人类</option>
                    <option value="2">动物</option>
                </select>
                种类
                <input id="initialization-skinColor" type="range"/>
                性别
                <select id="initialization-gender" @change="updateInitializationByGender()">
                    <option value="1">♂</option>
                    <option value="2">♀</option>
                </select>
                <br/>
                身高系数<input id="initialization-coefs-10" type="range" min="0" max="100" value="50"/>
                体重系数<input id="initialization-coefs-11" type="range" min="0" max="100" value="50"/>
                <br/>
                胸部类型<input id="initialization-breastType" type="range" min="0" max="9" value="0"/>
                胸部体积系数<input id="initialization-coefs-12" type="range" min="0" max="100" value="50"/>
                <input id="initialization-accessories" type="range" min="0" max="9" value="0" style="display:none"/>
                <br/>
                头顶高度系数<input id="initialization-coefs-0" type="range" min="0" max="100" value="50"/>
                下颚高度系数<input id="initialization-coefs-1" type="range" min="0" max="100" value="50"/>
                <br/>
                头顶宽度系数<input id="initialization-coefs-2" type="range" min="0" max="100" value="50"/>
                下颚宽度系数<input id="initialization-coefs-3" type="range" min="0" max="100" value="50"/>
                <br/>
                头顶弧度系数<input id="initialization-coefs-4" type="range" min="0" max="100" value="50"/>
                正面弧度系数<input id="initialization-coefs-9" type="range" min="0" max="100" value="50"/>
                <br/>
                侧面弧度系数<input id="initialization-coefs-5" type="range" min="0" max="100" value="50"/>
                下颚弧度系数<input id="initialization-coefs-6" type="range" min="0" max="100" value="50"/>
                <br/>
                发型
                <input id="initialization-hairstyle" type="range" min="-1" max="19" value="-1"/>
                发色
                <input type="color" id="initialization-hairColor" value="#000000">
                <br/>
                眼睛类型<input id="initialization-eyes" type="range" min="0" max="9" value="0"/>
                <br/>
                眼睛尺寸系数<input id="initialization-coefs-13" type="range" min="0" max="100" value="50"/>
                眼睛高度系数<input id="initialization-coefs-7" type="range" min="0" max="100" value="50"/>
                <br/>
                眼睛间距系数<input id="initialization-coefs-8" type="range" min="0" max="100" value="50"/>
                <br/>
                眉毛类型<input id="initialization-eyebrows" type="range" min="0" max="9" value="0"/>
                <br/>
                鼻子类型<input id="initialization-nose" type="range" min="0" max="9" value="0"/>
                <br/>
                鼻子高度系数<input id="initialization-coefs-14" type="range" min="0" max="100" value="50"/>
                鼻子尺寸系数<input id="initialization-coefs-15" type="range" min="0" max="100" value="50"/>
                <br/>
                嘴巴类型<input id="initialization-mouth" type="range" min="0" max="9" value="0"/>
                舌头类型<input id="initialization-tongue" type="range" min="0" max="9" value="0"/>
                <br/>
                胡髭类型<input id="initialization-moustache" type="range" min="0" max="9" value="0"/>
                胡髯类型<input id="initialization-beard" type="range" min="0" max="5" value="0"/>
                <br/>
              </div>
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
            <img id="waveEffect" src="../assets/image/effects/wave.png" />
            <img id="haloEffect" src="../assets/image/effects/halo.png" />
            <img id="sacrificeEffect" src="../assets/image/effects/sacrifice.png" />
            <img id="meleeScratchEffect" src="../assets/image/effects/melee_scratch.png" />
            <img id="meleeCleaveEffect" src="../assets/image/effects/melee_cleave.png" />
            <img id="meleeStabEffect" src="../assets/image/effects/melee_stab.png" />
            <img id="sparkEffect" src="../assets/image/effects/spark.png" />
            <img id="decayEffect" src="../assets/image/effects/decay.png" />
            <img id="bubbleEffect" src="../assets/image/effects/bubble.png" />

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
            <img id="male_torsos" src="../assets/image/characters/male_torsos.png" />
            <img id="female_torsos" src="../assets/image/characters/female_torsos.png" />
            <img id="left_arms" src="../assets/image/characters/left_arms.png" />
            <img id="left_armbands" src="../assets/image/characters/left_armbands.png" />
            <img id="left_feet" src="../assets/image/characters/left_feet.png" />
            <img id="left_hands" src="../assets/image/characters/left_hands.png" />
            <img id="left_legs" src="../assets/image/characters/left_legs.png" />
            <img id="left_zgc" src="../assets/image/characters/left_zgc.png" />
            <img id="right_arms" src="../assets/image/characters/right_arms.png" />
            <img id="right_armbands" src="../assets/image/characters/right_armbands.png" />
            <img id="right_feet" src="../assets/image/characters/right_feet.png" />
            <img id="right_hands" src="../assets/image/characters/right_hands.png" />
            <img id="right_legs" src="../assets/image/characters/right_legs.png" />
            <img id="right_zgc" src="../assets/image/characters/right_zgc.png" />
            <img id="accessories" src="../assets/image/characters/accessories.png" />
            <img id="breasts" src="../assets/image/characters/breasts.png" />
            <img id="hairstyles" src="../assets/image/characters/hairstyles.png" />
            <img id="eyes" src="../assets/image/characters/eyes.png" />
            <img id="nose" src="../assets/image/characters/nose.png" />
            <img id="mouth" src="../assets/image/characters/mouth.png" />
            <img id="tongue" src="../assets/image/characters/tongue.png" />
            <img id="eyebrows" src="../assets/image/characters/eyebrows.png" />
            <img id="moustache" src="../assets/image/characters/moustache.png" />
            <img id="beard" src="../assets/image/characters/beard.png" />
            <img id="outfit_decoration" src="../assets/image/characters/outfit_decoration.png" />
            <img id="hat" src="../assets/image/characters/hat.png" />

            <img id="tool_s" src="../assets/image/items/tool_s.png" />
            <img id="tool_m" src="../assets/image/items/tool_m.png" />
            <img id="tool_l" src="../assets/image/items/tool_l.png" />
            <img id="outfit" src="../assets/image/items/outfit.png" />
            <img id="consumable" src="../assets/image/items/consumable.png" />
            <img id="material" src="../assets/image/items/material.png" />
            <img id="junk" src="../assets/image/items/junk.png" />
            <img id="ammo" src="../assets/image/items/ammo.png" />
            <img id="note" src="../assets/image/items/note.png" />
            <img id="recording" src="../assets/image/items/recording.png" />

            <img id="buttons" src="../assets/image/buttons.png" />
            <img id="smallButtons" src="../assets/image/small-buttons.png" />
            <img id="buffs" src="../assets/image/buffs.png" />
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
  keyboardInteractions: {},
  mouseInteractions: {},
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
  movementModeButtonPosition: undefined,
  chatDisplayButtonPosition: undefined,
  teenMode: undefined,
  waterPosition: { x: undefined, y: undefined }
}

let staticData = {
  items: undefined,
  recipes: undefined
}

let images = {
  effectsImage: undefined,
  animalsImage: undefined,
  avatarsImage: undefined,
  bodyPartsImage: undefined,
  buttons: undefined,
  smallButtons: undefined,
  buffs: undefined,
  blockImages: [],
  itemsImage: {
    tool_s: undefined,
    tool_m: undefined,
    tool_l: undefined,
    outfit: undefined,
    consumable: undefined,
    material: undefined,
    junk: undefined,
    ammo: undefined,
    note: undefined,
    recording: undefined
  }
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
    chatDisplay: false,
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

import { utilMethod } from '@/util'
// let terminalOutputs = undefined

import Recorder from 'js-audio-recorder' //用于获取麦克风权限
import Recorderx, { ENCODE_TYPE } from 'recorderx' //用于录音
// import { onUnmounted } from 'vue'
const rc = new Recorderx()
var musicMuted = true
var soundMuted = true
var micIsPermitted = false
var micInUse = false
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
    this.initImages()
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
    initImages () {
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
        'waveEffect': document.getElementById('waveEffect'),
        'haloEffect': document.getElementById('haloEffect'),
        'sacrificeEffect': document.getElementById('sacrificeEffect'),
        'meleeScratchEffect': document.getElementById('meleeScratchEffect'),
        'meleeCleaveEffect': document.getElementById('meleeCleaveEffect'),
        'meleeStabEffect': document.getElementById('meleeStabEffect'),
        'sparkEffect': document.getElementById('sparkEffect'),
        'decayEffect': document.getElementById('decayEffect'),
        'bubbleEffect': document.getElementById('bubbleEffect')
      }
      images.animalsImage = [
        images.blockImages[1000],
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
      images.bodyPartsImage = {
        torsos: [document.getElementById('male_torsos'), document.getElementById('female_torsos')],
        left_arms: document.getElementById('left_arms'),
        right_arms: document.getElementById('right_arms'),
        left_armbands: document.getElementById('left_armbands'),
        right_armbands: document.getElementById('right_armbands'),
        left_hands: document.getElementById('left_hands'),
        right_hands: document.getElementById('right_hands'),
        left_legs: document.getElementById('left_legs'),
        right_legs: document.getElementById('right_legs'),
        left_feet: document.getElementById('left_feet'),
        right_feet: document.getElementById('right_feet'),
        left_zgc: document.getElementById('left_zgc'),
        right_zgc: document.getElementById('right_zgc'),
        breasts: document.getElementById('breasts'),
        accessories: document.getElementById('accessories'),
        hairstyles: document.getElementById('hairstyles'),
        eyes: document.getElementById('eyes'),
        nose: document.getElementById('nose'),
        mouth: document.getElementById('mouth'),
        tongue: document.getElementById('tongue'),
        eyebrows: document.getElementById('eyebrows'),
        moustache: document.getElementById('moustache'),
        beard: document.getElementById('beard'),
        outfit_decoration: document.getElementById('outfit_decoration'),
        hat: document.getElementById('hat')
      }
      images.buttons = document.getElementById('buttons')
      images.smallButtons = document.getElementById('smallButtons')
      images.buffs = document.getElementById('buffs')
      images.itemsImage = {
        tool_s: document.getElementById('tool_s'),
        tool_m: document.getElementById('tool_m'),
        tool_l: document.getElementById('tool_l'),
        outfit: document.getElementById('outfit'),
        consumable: document.getElementById('consumable'),
        material: document.getElementById('material'),
        junk: document.getElementById('junk'),
        ammo: document.getElementById('ammo'),
        note: document.getElementById('note'),
        recording: document.getElementById('recording')
      }
      images.imageData = {
        item: [],
        block: [],
        creature: []
      }
    },
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
      canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
      for (let i = constants.KEY_INDEX_MOVEMENT_UP; i <= constants.KEY_INDEX_MOVEMENT_DOWN; i++) {
        canvasInfo.mouseInteractions[i] = false
        canvasInfo.keyboardInteractions[i] = false
      }
      for (let i = constants.KEY_INDEX_SKILL_UP; i <= constants.KEY_INDEX_SKILL_DOWN; i++) {
        canvasInfo.mouseInteractions[i] = false
        canvasInfo.keyboardInteractions[i] = false
      }

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
      canvasInfo.teenMode = true
      document.getElementById('settings-teen').checked = canvasInfo.teenMode
      canvasInfo.waterPosition = { x: 0, y: 0 }

      this.initTimers()
    },
    keyUpEventHandler (event) {
      if ((canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_IDLE && canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MOVING) || userInfo.chatInfo.isTyping) {
        return
      }
      event.preventDefault()
      if (event.key === 'w' || event.key === 'W') {
         canvasInfo.keyboardInteractions[constants.KEY_INDEX_MOVEMENT_UP] = false
      } else if (event.key === 'a' || event.key === 'A') {
         canvasInfo.keyboardInteractions[constants.KEY_INDEX_MOVEMENT_LEFT] = false
      } else if (event.key === 'd' || event.key === 'D') {
         canvasInfo.keyboardInteractions[constants.KEY_INDEX_MOVEMENT_RIGHT] = false
      } else if (event.key === 's' || event.key === 'S') {
         canvasInfo.keyboardInteractions[constants.KEY_INDEX_MOVEMENT_DOWN] = false
      } else if (event.key === 'ArrowUp') {
         canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_UP] = false
      } else if (event.key === 'ArrowLeft') {
         canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_LEFT] = false
      } else if (event.key === 'ArrowRight') {
         canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_RIGHT] = false
      } else if (event.key === 'ArrowDown') {
         canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_DOWN] = false
      }
      if (userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING
          && !this.isWheel1KeyInUse(canvasInfo.keyboardInteractions)
          && !this.isWheel1KeyInUse(canvasInfo.mouseInteractions)) {
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
        this.setHandlePosition(canvasInfo.wheel1Position.x, canvasInfo.wheel1Position.y)
      }
    },
    keyDownEventHandler (event) {
      if ((canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_IDLE && canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MOVING) || userInfo.chatInfo.isTyping) {
        return
      }
      event.preventDefault()
      if (!this.isWheel1KeyInUse(canvasInfo.mouseInteractions)) {
        if (event.key === 'w' || event.key === 'W') {
          canvasInfo.keyboardInteractions[constants.KEY_INDEX_MOVEMENT_UP] = true
        } else if (event.key === 'a' || event.key === 'A') {
          canvasInfo.keyboardInteractions[constants.KEY_INDEX_MOVEMENT_LEFT] = true
        } else if (event.key === 'd' || event.key === 'D') {
          canvasInfo.keyboardInteractions[constants.KEY_INDEX_MOVEMENT_RIGHT] = true
        } else if (event.key === 's' || event.key === 'S') {
          canvasInfo.keyboardInteractions[constants.KEY_INDEX_MOVEMENT_DOWN] = true
        }
      }
      if (!this.isWheel2KeyInUse(canvasInfo.mouseInteractions)) {
        if (event.key === 'ArrowUp') {
          canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_UP] = true
        } else if (event.key === 'ArrowLeft') {
          canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_LEFT] = true
        } else if (event.key === 'ArrowRight') {
          canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_RIGHT] = true
        } else if (event.key === 'ArrowDown') {
          canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_DOWN] = true
        }
      }
    },
    keyUpChatEventHandler (event) {
      event.preventDefault()
      if (event.key === 'Enter') {
        this.sendMsg()
      }
    },
    focusChatEventHandler (event) {
      event.preventDefault()
      userInfo.chatInfo.isTyping = true
    },
    blurChatEventHandler (event) {
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
      if (this.$utilMethods.isDef(userInfo.worldInfo) && response.worldInfo.worldTime != userInfo.worldInfo.worldTime) {
        userInfo.diffSecond = currentSecond - response.currentSecond
        userInfo.diffMillisecond = currentMillisecond - response.currentMillisecond
        if (this.$utilMethods.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING
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
      this.resetImageData()
      var originPlayerInfo = userInfo.playerInfo
      userInfo.playerInfo = userInfo.playerInfos[userInfo.userCode]
      userInfo.flags = response.flags
      userInfo.bagInfo = response.bagInfo
      userInfo.interactedBagInfo = response.interactedBagInfo

      if (userInfo.webStage == constants.WEB_STAGE_START) {
        this.initWeb()
        if (this.$utilMethods.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_INIT) {
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
      if (!this.$utilMethods.isDef(userInfo.regionInfo) || userInfo.regionInfo.regionNo != response.regionInfo.regionNo) {
        isRegionChanged = true
      }
      // var isSceneChanged = isRegionChanged
      // if (!this.$utilMethods.isDef(userInfo.sceneInfo) || userInfo.sceneInfo.sceneCoordinate.x != response.sceneInfo.sceneCoordinate.x 
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
      if (this.$utilMethods.isDef(response.miniMap)) {
        if (!this.$utilMethods.isDef(userInfo.miniMap)) {
          userInfo.miniMap = {}
        }
        if (this.$utilMethods.isDef(response.miniMap.background)) {
          userInfo.miniMap.background = response.miniMap.background
        }
        userInfo.miniMap.sceneCoordinate = response.miniMap.sceneCoordinate
      }
      userInfo.sceneInfo = response.sceneInfo
      userInfo.sceneInfos = response.sceneInfos
      userInfo.grids = response.grids
      userInfo.blocks = response.blocks

      // Check functions 24/03/17
      if (this.$utilMethods.isDef(response.functions)) {
        if (this.$utilMethods.isDef(response.functions.createPlayerInfoInstance)) {
          this.prepareInitialization(response.functions.createPlayerInfoInstance)
        }
      }

      // Check messages
      if (this.$utilMethods.isDef(response.messages)) {
        for (let i = 0; i < response.messages.length; i++) {
          var message = response.messages[i]
          var fromUserCode = message.fromUserCode
          if (message.type == constants.MESSAGE_TYPE_PRINTED) {
            var fromNickname = '[已离线]'
            if (this.$utilMethods.isDef(userInfo.playerInfos[fromUserCode])) {
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
      // if (this.$utilMethods.isDef(response.terminalOutputs)) {
      //   for (var j = 0; j < response.terminalOutputs.length; j++) {
      //     if (!this.$utilMethods.isDef(response.terminalOutputs[j])) {
      //       continue
      //     }
      //     if (this.$utilMethods.isDef(response.terminalOutputs[j].content)) {
      //       document.getElementById('terminal-text').value += '\n' + response.terminalOutputs[j].content
      //       document.getElementById('terminal-text').scrollTop = document.getElementById('terminal-text').scrollHeight
      //     } else {
      //       terminalOutputs = response.terminalOutputs[j]
      //     }
      //   }
      // }

      // Check keyDown
      for (let i = constants.KEY_INDEX_MOVEMENT_UP; i <= constants.KEY_INDEX_MOVEMENT_DOWN; i++) {
        if (!this.isWheel1KeyInUse(canvasInfo.mouseInteractions) && canvasInfo.keyboardInteractions[i]) {
          this.wheelKeyDown(i)
        }
      }
      for (let i = constants.KEY_INDEX_SKILL_UP; i <= constants.KEY_INDEX_SKILL_DOWN; i++) {
        if (canvasInfo.keyboardInteractions[i] || canvasInfo.mouseInteractions[i]) {
          this.wheelKeyDown(i)
        } else {
          this.wheelKeyUp(i)
        }
      }

      this.$drawMethods.show(canvasInfo, staticData, images, userInfo)
      this.fixSceneCoordinate(userInfo.playerInfo)
      canvasInfo.waterPosition.x = canvasInfo.waterPosition.x + 1 + userInfo.worldInfo.windSpeed * Math.cos(userInfo.worldInfo.windDirection / 180 * Math.PI)
      canvasInfo.waterPosition.x = (canvasInfo.waterPosition.x % 1)
      canvasInfo.waterPosition.y = canvasInfo.waterPosition.y + 1 - userInfo.worldInfo.windSpeed * Math.sin(userInfo.worldInfo.windDirection / 180 * Math.PI)
      canvasInfo.waterPosition.y = (canvasInfo.waterPosition.y % 1)
      images.imageData.block = []
      // Update coordinates 24/03/06
      // settleSpeed() must be after show() to avoid abnormal display while changing scenes or regions
      canvasInfo.pointer.x += userInfo.playerInfo.speed.x
      canvasInfo.pointer.y += userInfo.playerInfo.speed.y
      if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MOVING
          || userInfo.playerInfo.buff[constants.BUFF_CODE_DEAD] != 0
          || Math.pow(canvasInfo.pointer.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - userInfo.playerInfo.coordinate.y, 2) < Math.pow(constants.MIN_MOVE_DISTANCE_POINTER_PLAYER, 2)) {
        userInfo.playerInfo.speed.x = 0
        userInfo.playerInfo.speed.y = 0
        if (userInfo.playerInfo.buff[constants.BUFF_CODE_DEAD] != 0 && userInfo.playerInfo.buff[constants.BUFF_CODE_REALISTIC] != 0) {
          // Game over
          this.$router.push('/gameover')
        }
      } else {
        this.speedUp(userInfo.playerInfo)
        if (constants.LAZY_SETTLE_SPEED) {
          this.settleSpeed(userInfo.userCode, userInfo.playerInfo)
        }
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
            this.getItems(constants.ITEM_NO_OUTFIT_UNDERWEAR, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_ZGC_1, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_ZGC_2, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_SOLDIER, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_SUIT_1, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_SUIT_2, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_IJA, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_NRA_1, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_NRA_2, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_NRA_3, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_NRA_4, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_NRA_5, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_NRA_6, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_NRA_7, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_HAT_FARMER, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_HAT_RANGER, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_HAT_WHITE, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_HAT_BOWLER, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_HAT_TOP, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_HAT_RED, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_CAP_IJA, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_CAP_NRA_1, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_CAP_NRA_2, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_CAP_NRA_3, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_CAP_NRA_4, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_CAP_NRA_5, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_CAP_NRA_6, 1)
            this.getItems(constants.ITEM_NO_OUTFIT_CAP_NRA_7, 1)
            this.getItems('c065', 1)
            this.getItems('c066', 1)
            this.getItems('c067', 1)
            this.getItems('c068', 1)
            this.getItems('n001', 1)
            this.getItems('r001', 1)
            this.getItems('c064', 30)
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
        if (!this.$utilMethods.isDef(userInfo.playerInfo) || userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_INIT) {
          userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter = userInfo.playerInfo
        } else if (userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING) {
          if (constants.LAZY_SETTLE_SPEED) {
            userInfo.webSocketMessageDetail.functions.settleCoordinate = {
              worldCoordinate: userInfo.playerInfo,
              movementInfo: userInfo.playerInfo
            }
          } else {
            userInfo.webSocketMessageDetail.functions.settleSpeedAndCoordinate = {
              movementInfo: userInfo.playerInfo
            }
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
          recycleItems: [],
          useRecipes: [],
          updateInteractionInfo: undefined,
          interactBlocks: [],
          terminalInputs: [],
          useSkills: [false, false, false, false],
          createPlayerInfoInstance: undefined,
          settleSpeedAndCoordinate: undefined,
          settleCoordinate: undefined,
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
      this.updateInitializationByCreatureType()
      document.getElementById('initialization-skinColor').value = Math.max(document.getElementById('initialization-skinColor').min,
          Math.min(document.getElementById('initialization-skinColor').max, playerInfoTemp.skinColor))
      for (let i = 0; i < document.getElementById('initialization-gender').options.length; i++) {
        if (document.getElementById('initialization-gender').options[i].value == playerInfoTemp.gender) {
          document.getElementById('initialization-gender').options[i].selected = true
        }
      }
      this.updateInitializationByGender()
      document.getElementById('initialization-breastType').value = playerInfoTemp.breastType
      document.getElementById('initialization-accessories').value = playerInfoTemp.accessories
      document.getElementById('initialization-hairstyle').value = playerInfoTemp.hairstyle
      document.getElementById('initialization-hairColor').value = playerInfoTemp.hairColor
      if (this.$utilMethods.isDef(playerInfoTemp.faceCoefs)) {
        for (let i = 0; i < constants.FACE_COEFS_LENGTH; i++) {
          document.getElementById('initialization-coefs-' + i).value = playerInfoTemp.faceCoefs[i]
        }
      }
      document.getElementById('initialization-eyes').value = playerInfoTemp.eyes
      document.getElementById('initialization-nose').value = playerInfoTemp.nose
      document.getElementById('initialization-mouth').value = playerInfoTemp.mouth
      document.getElementById('initialization-tongue').value = playerInfoTemp.tongue
      document.getElementById('initialization-eyebrows').value = playerInfoTemp.eyebrows
      document.getElementById('initialization-moustache').value = playerInfoTemp.moustache
      document.getElementById('initialization-beard').value = playerInfoTemp.beard
    },
    updateInitializationByCreatureType () {
      if (document.getElementById('initialization-creature').value == 1) {
        document.getElementById('initialization-skinColor').min = 0
        document.getElementById('initialization-skinColor').max = 100
      } else if (document.getElementById('initialization-creature').value == 2) {
        document.getElementById('initialization-skinColor').min = 1
        document.getElementById('initialization-skinColor').max = 15
      }
    },
    updateInitializationByGender () {
      document.getElementById('initialization-moustache').min = 0
      document.getElementById('initialization-beard').min = 0
      document.getElementById('initialization-accessories').min = 0
      if (document.getElementById('initialization-gender').value == 1) {
        document.getElementById('initialization-moustache').max = 9
        document.getElementById('initialization-beard').max = 5
        document.getElementById('initialization-accessories').max = 0
      } else if (document.getElementById('initialization-gender').value == 2) {
        document.getElementById('initialization-moustache').max = 0
        document.getElementById('initialization-beard').max = 0
        document.getElementById('initialization-accessories').max = 9
      }
    },
    useItem () {
      var itemNo = document.getElementById('items-name').value
      if (!this.$utilMethods.isDef(userInfo.bagInfo.items[itemNo]) || userInfo.bagInfo.items[itemNo] <= 0) {
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
    recycleItem () {
      var itemNo = document.getElementById('items-name').value
      if (!this.$utilMethods.isDef(userInfo.bagInfo.items[itemNo]) || userInfo.bagInfo.items[itemNo] <= 0) {
        return
      }
      var itemAmount = Math.min(userInfo.bagInfo.items[itemNo], Number(document.getElementById('items-range').value))
      if (itemAmount <= 0) {
        return
      }
      this.recycleItems(itemNo, itemAmount)
    },
    recycleItems (itemNo, itemAmount) {
      userInfo.webSocketMessageDetail.functions.recycleItems.push({ itemNo: itemNo, itemAmount: itemAmount })
    },
    useRecipes () {
      var recipeNo = document.getElementById('recipes-name').value
      for (var costKey in staticData.recipes[recipeNo].cost) {
        if (!this.$utilMethods.isDef(userInfo.bagInfo.items[costKey]) || userInfo.bagInfo.items[costKey] <= staticData.recipes[recipeNo].cost[costKey]) {
          return
        }
        var recipeAmount = Math.min(Math.floor(userInfo.bagInfo.items[costKey] / staticData.recipes[recipeNo].cost[costKey]), Number(document.getElementById('recipes-range').value))
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
      if (!this.$utilMethods.isDef(userInfo.bagInfo.items)) {
        return
      }
      for (var itemNo in userInfo.bagInfo.items) {
        var itemAmount = userInfo.bagInfo.items[itemNo]
        if (!this.$utilMethods.isDef(itemAmount) || itemAmount === 0) {
          continue
        }
        var item = staticData.items[itemNo]
        switch (itemNo.charAt(0)) {
          case constants.ITEM_CHARACTER_TOOL:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '1') {
              if (this.$utilMethods.isDef(userInfo.playerInfo.tools) && userInfo.playerInfo.tools.length > 0 && userInfo.playerInfo.tools.includes(itemNo)) {
                document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            break
          case constants.ITEM_CHARACTER_OUTFIT:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.$utilMethods.isDef(userInfo.playerInfo.outfits) && userInfo.playerInfo.outfits.length > 0 && userInfo.playerInfo.outfits.includes(itemNo)) {
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
      if (!this.$utilMethods.isDef(userInfo.interactedBagInfo)) {
        return
      }
      for (let itemNo in userInfo.interactedBagInfo.items) {
        let itemAmount = userInfo.interactedBagInfo.items[itemNo]
        if (!this.$utilMethods.isDef(itemAmount) || itemAmount === 0) {
          continue
        }
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
      var checkValue = document.getElementById('recipes-name').value
      document.getElementById('recipes-name').length = 0
      if (!this.$utilMethods.isDef(staticData.recipes) || staticData.recipes.length == 0 || !this.$utilMethods.isDef(userInfo.interactionInfo)) {
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
      if (this.$utilMethods.isBlankString(checkValue) || !checkValueFound) {
        checkValue = document.getElementById('recipes-name').options[0].value
      }
      var recipeAmountMax = Number.MAX_SAFE_INTEGER
      var descriptionContent = '成本:\n'
      for (var costNo in staticData.recipes[checkValue].cost) {
        var itemAmount = userInfo.bagInfo.items[costNo]
        if (!this.$utilMethods.isDef(itemAmount)) {
          itemAmount = 0
        }
        descriptionContent += staticData.items[costNo].name + '(' + staticData.recipes[checkValue].cost[costNo] + '/' + itemAmount + ')'
        if (itemAmount >= staticData.recipes[checkValue].cost[costNo]) {
          recipeAmountMax = Math.min(recipeAmountMax, Math.floor(itemAmount / staticData.recipes[checkValue].cost[costNo]))
          descriptionContent += '\n'
        } else {
          recipeAmountMax = 0
          descriptionContent += ' 数量不足\n'
        }
      }
      document.getElementById('recipes-desc').value = descriptionContent
      document.getElementById('recipes-range').min = 0
      document.getElementById('recipes-range').max = recipeAmountMax
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
        this.updateItems()
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_BACKPACK
      } else if (x >= canvasInfo.buttonPositions[2].x && x < canvasInfo.buttonPositions[2].x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.buttonPositions[2].y && y < canvasInfo.buttonPositions[2].y + constants.DEFAULT_BUTTON_SIZE) {
        // Members
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MEMBERS
      } else if (x >= canvasInfo.buttonPositions[3].x && x < canvasInfo.buttonPositions[3].x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.buttonPositions[3].y && y < canvasInfo.buttonPositions[3].y + constants.DEFAULT_BUTTON_SIZE) {
        // Settings
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_SETTINGS
      } else if (x >= canvasInfo.recordButtonPosition.x && x < (canvasInfo.recordButtonPosition.x + constants.DEFAULT_SMALL_BUTTON_SIZE) && y >= canvasInfo.recordButtonPosition.y && y < (canvasInfo.recordButtonPosition.y + constants.DEFAULT_SMALL_BUTTON_SIZE)) {
        // Voice record
        if (userInfo.chatInfo.chatDisplay) {
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_RECORDER
          this.recordStart()
        }
      } else if (x >= canvasInfo.movementModeButtonPosition.x && x < canvasInfo.movementModeButtonPosition.x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.movementModeButtonPosition.y && y < canvasInfo.movementModeButtonPosition.y + constants.DEFAULT_BUTTON_SIZE) {
        // Movement mode
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVEMENT_MODE
      } else if (x >= canvasInfo.chatDisplayButtonPosition.x && x < canvasInfo.chatDisplayButtonPosition.x + constants.DEFAULT_BUTTON_SIZE && y >= canvasInfo.chatDisplayButtonPosition.y && y < canvasInfo.chatDisplayButtonPosition.y + constants.DEFAULT_BUTTON_SIZE) {
        // Chat display
        if (canvasInfo.canvasMoveUse == constants.MOVEMENT_STATE_CHAT_DISPLAY) {
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
        } else {
          canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_CHAT_DISPLAY
        }
        userInfo.chatInfo.chatDisplay = !userInfo.chatInfo.chatDisplay
      } else {
        if (!this.isWheel1KeyInUse(canvasInfo.keyboardInteractions)) {
          if (Math.pow(canvasInfo.wheel1Position.x - x, 2) + Math.pow(canvasInfo.wheel1Position.y - y, 2) <= Math.pow(constants.WHEEL_1_RADIUS, 2)) {
            // New movement system 25/01/26
            canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
            this.setHandlePosition(x, y)
            canvasInfo.mouseInteractions[constants.KEY_INDEX_MOVEMENT_UP] = true
            canvasInfo.mouseInteractions[constants.KEY_INDEX_MOVEMENT_LEFT] = true
            canvasInfo.mouseInteractions[constants.KEY_INDEX_MOVEMENT_RIGHT] = true
            canvasInfo.mouseInteractions[constants.KEY_INDEX_MOVEMENT_DOWN] = true
          }
        }
        if (!this.isWheel2KeyInUse(canvasInfo.keyboardInteractions)) {
          if (Math.pow(canvasInfo.wheel2Position.x - x, 2) + Math.pow(canvasInfo.wheel2Position.y - y, 2) <= Math.pow(constants.WHEEL_2_RADIUS, 2)) {
            if (y - canvasInfo.wheel2Position.y > x - canvasInfo.wheel2Position.x) {
              if (y - canvasInfo.wheel2Position.y > canvasInfo.wheel2Position.x - x) {
                canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_DOWN] = true
              } else {
                canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_LEFT] = true
              }
            } else {
              if (y - canvasInfo.wheel2Position.y > canvasInfo.wheel2Position.x - x) {
                canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_RIGHT] = true
              } else {
                canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_UP] = true
              }
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
        case constants.KEY_INDEX_MOVEMENT_UP:
          if (!this.isWheel1KeyInUse(canvasInfo.mouseInteractions)) {
            canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
            this.setHandlePosition(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y - 0.1 * constants.WHEEL_1_RADIUS)
          }
          break
        case constants.KEY_INDEX_MOVEMENT_LEFT:
          if (!this.isWheel1KeyInUse(canvasInfo.mouseInteractions)) {
            canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
            this.setHandlePosition(canvasInfo.handle1Position.x - 0.1 * constants.WHEEL_1_RADIUS, canvasInfo.handle1Position.y)
          }
          break
        case constants.KEY_INDEX_MOVEMENT_RIGHT:
          if (!this.isWheel1KeyInUse(canvasInfo.mouseInteractions)) {
            canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
            this.setHandlePosition(canvasInfo.handle1Position.x + 0.1 * constants.WHEEL_1_RADIUS, canvasInfo.handle1Position.y)
          }
          break
        case constants.KEY_INDEX_MOVEMENT_DOWN:
          if (!this.isWheel1KeyInUse(canvasInfo.mouseInteractions)) {
            canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_MOVING
            this.setHandlePosition(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y + 0.1 * constants.WHEEL_1_RADIUS)
          }
          break
        case constants.KEY_INDEX_SKILL_UP:
        case constants.KEY_INDEX_SKILL_LEFT:
        case constants.KEY_INDEX_SKILL_RIGHT:
        case constants.KEY_INDEX_SKILL_DOWN:
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
      this.updatePointer(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y)
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
        if (!this.isWheel1KeyInUse(canvasInfo.keyboardInteractions)) {
          this.setHandlePosition(x, y)
        }
      }
    },
    canvasUp () {
      this.canvasLeave()
    },
    canvasLeave () {
      if (userInfo.webStage !== constants.WEB_STAGE_INITIALIZED) {
        return
      }
      canvasInfo.mouseInteractions[constants.KEY_INDEX_MOVEMENT_UP] = false
      canvasInfo.mouseInteractions[constants.KEY_INDEX_MOVEMENT_LEFT] = false
      canvasInfo.mouseInteractions[constants.KEY_INDEX_MOVEMENT_RIGHT] = false
      canvasInfo.mouseInteractions[constants.KEY_INDEX_MOVEMENT_DOWN] = false
      if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_RECORDER) {
        this.recordEnd()
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
      } else if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_MOVING) {
        canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
        if (!this.isWheel1KeyInUse(canvasInfo.keyboardInteractions)) {
          this.setHandlePosition(canvasInfo.wheel1Position.x, canvasInfo.wheel1Position.y)
        }
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
      canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_UP] = false
      canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_LEFT] = false
      canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_RIGHT] = false
      canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_DOWN] = false
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
    speedUp (movingBlock) {
      // Speed logics, sync with back-end 24/08/24
      var speed = Math.sqrt(Math.pow(movingBlock.speed.x, 2) + Math.pow(movingBlock.speed.y, 2)) + movingBlock.acceleration
      if (userInfo.playerInfo.buff[constants.BUFF_CODE_STUNNED] !== 0) {
        speed = 0
      } else if (userInfo.playerInfo.buff[constants.BUFF_CODE_FRACTURED] !== 0
          || userInfo.playerInfo.buff[constants.BUFF_CODE_OVERWEIGHTED] !== 0
          || userInfo.playerInfo.buff[constants.BUFF_CODE_FATIGUED] !== 0
          || userInfo.playerInfo.buff[constants.BUFF_CODE_KNOCKED] !== 0) {
        speed = Math.min(movingBlock.maxSpeed * 0.25, speed)
      } else if (userInfo.movementMode === constants.MOVEMENT_MODE_WALK) {
        // Frontend condition
        speed = Math.min(movingBlock.maxSpeed * 0.45, speed)
      } else {
        speed = Math.min(movingBlock.maxSpeed, speed)
      }
      movingBlock.speed.x = speed * (canvasInfo.pointer.x - movingBlock.coordinate.x) / Math.sqrt(Math.pow(canvasInfo.pointer.x - movingBlock.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - movingBlock.coordinate.y, 2))
      movingBlock.speed.y = speed * (canvasInfo.pointer.y - movingBlock.coordinate.y) / Math.sqrt(Math.pow(canvasInfo.pointer.x - movingBlock.coordinate.x, 2) + Math.pow(canvasInfo.pointer.y - movingBlock.coordinate.y, 2))

      movingBlock.faceDirection = this.$utilMethods.calculateAngle(movingBlock.speed.x, movingBlock.speed.y)
      if (userInfo.movementMode === constants.MOVEMENT_MODE_STAND_GROUND) {
        movingBlock.speed.x = 0
        movingBlock.speed.y = 0
      }
    },
    settleSpeed (id, movingBlock) {
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
        && utilMethod.checkMaterialCollision(movingBlock.structure.material, userInfo.blocks[i].structure.material)) {
          movingBlock.speed.x = 0
        }
        if (!this.detectCollision(movingBlock.coordinate, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)
        && this.detectCollision({ x: movingBlock.coordinate.x, y: movingBlock.coordinate.y + movingBlock.speed.y }, userInfo.blocks[i], movingBlock.structure, userInfo.blocks[i].structure)
        && utilMethod.checkMaterialCollision(movingBlock.structure.material, userInfo.blocks[i].structure.material)) {
          movingBlock.speed.y = 0
        }
      }
      if (this.$utilMethods.isDef(newCoordinate)) {
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
      if (!this.$utilMethods.isDef(content) || content == '') {
        // No content to send
        return
      }
      if (!this.$utilMethods.isDef(userInfo.chatInfo.chatTo) && userInfo.chatInfo.scope === constants.SCOPE_INDIVIDUAL) {
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
      if (!this.$utilMethods.isDef(userInfo.chatInfo.chatTo) && userInfo.chatInfo.scope === constants.SCOPE_INDIVIDUAL) {
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
      if (this.$utilMethods.isDef(userInfo.chatInfo.chatMessages)) {
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
      if (!this.$utilMethods.isDef(content) || content == '') {
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
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.breastType = Number(document.getElementById('initialization-breastType').value)
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.accessories = Number(document.getElementById('initialization-accessories').value)
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.hairstyle = document.getElementById('initialization-hairstyle').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.hairColor = document.getElementById('initialization-hairColor').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.eyes = document.getElementById('initialization-eyes').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.nose = document.getElementById('initialization-nose').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.mouth = document.getElementById('initialization-mouth').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.tongue = document.getElementById('initialization-tongue').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.eyebrows = document.getElementById('initialization-eyebrows').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.moustache = document.getElementById('initialization-moustache').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.beard = document.getElementById('initialization-beard').value
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.faceCoefs = []
      for (let i = 0; i < constants.FACE_COEFS_LENGTH; i++) {
        userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.faceCoefs[i] = document.getElementById('initialization-coefs-' + i).value
      }
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.breastType = document.getElementById('initialization-avatar').breastType
      userInfo.webSocketMessageDetail.functions.updatePlayerInfoCharacter.avatar = document.getElementById('initialization-avatar').value
      if (userInfo.webStage === constants.WEB_STAGE_INITIALIZING && userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING) {
        userInfo.webStage = constants.WEB_STAGE_INITIALIZED
      }
    },
    interact () {
      var interactionCode = Number(document.getElementById('interactions-list').value)
      if (this.$utilMethods.checkBlockTypeInteractive(userInfo.interactionInfo.type)) {
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
          if (userInfo.interactionInfo.type == constants.BLOCK_TYPE_WORKSHOP
              || userInfo.interactionInfo.type == constants.BLOCK_TYPE_WORKSHOP_TOOL
              || userInfo.interactionInfo.type == constants.BLOCK_TYPE_WORKSHOP_AMMO
              || userInfo.interactionInfo.type == constants.BLOCK_TYPE_WORKSHOP_OUTFIT
              || userInfo.interactionInfo.type == constants.BLOCK_TYPE_WORKSHOP_CHEM) {
            this.updateRecipes()
          }
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
        if (!this.isWheel1KeyInUse(canvasInfo.keyboardInteractions)) {
          this.setHandlePosition(canvasInfo.wheel1Position.x, canvasInfo.wheel1Position.y)
        }
      }
      canvasInfo.wheel2Position = { x: canvasInfo.canvas.width - constants.WHEEL_2_RADIUS, y: canvasInfo.canvas.height - constants.WHEEL_2_RADIUS }
      canvasInfo.chatPosition = { x: 10, y: canvasInfo.wheel2Position.y - constants.WHEEL_1_RADIUS - 60 }
      canvasInfo.recordButtonPosition = { x: 20, y: canvasInfo.chatPosition.y + 50 }
      canvasInfo.movementModeButtonPosition = { x: constants.WHEEL_1_RADIUS * 2, y: canvasInfo.wheel1Position.y + constants.DEFAULT_BUTTON_SIZE * 0.5 }
      canvasInfo.chatDisplayButtonPosition = { x: constants.WHEEL_1_RADIUS * 2, y: canvasInfo.wheel1Position.y - constants.DEFAULT_BUTTON_SIZE * 1.5 }
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
    changeSettingBlockSize () {
      canvasInfo.blockSize = Number(document.getElementById('settings-blockSize').value)
      this.resetImageData()
    },
    changeSettingMusic () {
      musicMuted = !document.getElementById('settings-music').checked
    },
    changeSettingSound () {
      soundMuted = !document.getElementById('settings-sound').checked
    },
    changeSettingTeen () {
      canvasInfo.teenMode = document.getElementById('settings-teen').checked
    },
    isWheel1KeyInUse (interactions) {
      return interactions[constants.KEY_INDEX_MOVEMENT_UP]
          || interactions[constants.KEY_INDEX_MOVEMENT_LEFT]
          || interactions[constants.KEY_INDEX_MOVEMENT_RIGHT]
          || interactions[constants.KEY_INDEX_MOVEMENT_DOWN]
    },
    isWheel2KeyInUse (interactions) {
      return interactions[constants.KEY_INDEX_SKILL_UP]
          || interactions[constants.KEY_INDEX_SKILL_LEFT]
          || interactions[constants.KEY_INDEX_SKILL_RIGHT]
          || interactions[constants.KEY_INDEX_SKILL_DOWN]
    },
    resetImageData () {
      for (var playerInfoIndex in userInfo.playerInfos) {
        if (!this.$utilMethods.isDef(images.imageData.creature[userInfo.playerInfos[playerInfoIndex].id])) {
          images.imageData.creature[userInfo.playerInfos[playerInfoIndex].id] = {
            hair: undefined,
            leftEyebrow: undefined,
            rightEyebrow: undefined,
            moustache: undefined,
            beard: undefined,
            nose: undefined,
            mouth: undefined,
            bodyPart: undefined
          }
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
@import './style/world.css'
</style>
