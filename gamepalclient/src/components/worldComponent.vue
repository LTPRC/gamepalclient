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
            <img id="selectionEffect" src="../assets/image/effects/selection.png" />
            <img id="hitEffect" src="../assets/image/effects/hit.png" />
            <img id="hitFireEffect" src="../assets/image/effects/hitfire.png" />
            <img id="hitIceEffect" src="../assets/image/effects/hitice.png" />
            <img id="hitElectricityEffect" src="../assets/image/effects/hitelectricity.png" />
            <img id="upgradeEffect" src="../assets/image/effects/upgrade.png" />
            <img id="fireEffect" src="../assets/image/effects/fire.png" />
            <img id="shootEffect" src="../assets/image/effects/shoot.png" />
            <img id="explodeEffect" src="../assets/image/effects/explode.png" />
            <img id="bleedEffect" src="../assets/image/effects/bleed.png" />
            <img id="waveEffect" src="../assets/image/effects/wave.png" />
            <img id="haloEffect" src="../assets/image/effects/halo.png" />
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
            <img id="a001" src="../assets/image/characters/outfits/a001.png" />
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
let selectionEffect
let hitEffect
let hitFireEffect
let hitIceEffect
let hitElectricityEffect
let upgradeEffect
let fireEffect
let shootEffect
let explodeEffect
let bleedEffect
let waveEffect
let haloEffect
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
let bodies
let arms
let eyesImage
let hairstyle_black
let hairstyle_grey
let hairstyle_orange
// eslint-disable-next-line no-unused-vars
let outfits
let floors
// let walls
let buttons
let smallButtons
// let balloons
let blockImages = {}

// Frontend constants
const MIN_CLICK_DISTANCE_BLOCK_POINTER = 0.5
const MIN_DISPLAY_DISTANCE_BLOCK_PLAYER = 2
const MIN_INTERACTION_DISTANCE = 2
const MIN_INTERACTION_ANGLE = 60
const MIN_DROP_INTERACTION_DISTANCE = 0.4
const MIN_MOVE_DISTANCE_POINTER_PLAYER = 0.2
const STATUS_DISPLAY_DISTANCE_ADDER = 0.8
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
// const BLOCK_TYPE_WALL = 1
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
// const BLOCK_TYPE_CEILING = 13
const BLOCK_TYPE_GROUND_DECORATION = 14
const BLOCK_TYPE_WALL_DECORATION = 15
const BLOCK_TYPE_CEILING_DECORATION = 16
// const BLOCK_TYPE_BLOCKED_GROUND = 17
const BLOCK_TYPE_HOLLOW_WALL = 18
// const BLOCK_TYPE_BLOCKED_CEILING = 19
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
const EVENT_CODE_HIT = 101
const EVENT_CODE_HIT_FIRE = 102
const EVENT_CODE_HIT_ICE = 103
const EVENT_CODE_HIT_ELECTRICITY = 104
const EVENT_CODE_UPGRADE = 105
const EVENT_CODE_FIRE = 106
const EVENT_CODE_SHOOT = 107
const EVENT_CODE_EXPLODE = 108
const EVENT_CODE_BLEED = 109
const EVENT_CODE_BLOCK = 110
const EVENT_CODE_HEAL = 111
const BUFF_CODE_DEAD = 1
const BUFF_CODE_STUNNED = 2
const BUFF_CODE_BLEEDING = 3
const BUFF_CODE_SICK = 4
const BUFF_CODE_FRACTURED = 5
const BUFF_CODE_HUNGRY = 6
const BUFF_CODE_THIRSTY = 7
const BUFF_CODE_FATIGUED = 8
const BUFF_CODE_BLIND = 9
const BUFF_CODE_LENGTH = 10
const SKILL_CODE_SHOOT = 1
const SKILL_CODE_HIT = 2
const SKILL_CODE_BLOCK = 3
const SKILL_CODE_HEAL = 4
const SKILL_MODE_SEMI_AUTO = 0
const SKILL_MODE_AUTO = 1

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
let sceneInfo = undefined
let relations = undefined
let chatMessages = []
let voiceMessages = []
// let members = []
let interactionInfo = undefined
// eslint-disable-next-line no-unused-vars
let terminalOutputs = undefined

let webStage = WEB_STAGE_START
let region = undefined
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
const menuLeftEdge = 50
const menuRightEdge = 50
const menuTopEdge = 100
const menuBottomEdge = 200
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
let isKeyDown = { 0: false, 1: false, 2: false, 3: false, 10: false, 11: false, 12: false, 13: false } // left 4 + right 4

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
    selectionEffect = document.getElementById('selectionEffect')
    hitEffect = document.getElementById('hitEffect')
    hitFireEffect = document.getElementById('hitFireEffect')
    hitIceEffect = document.getElementById('hitIceEffect')
    hitElectricityEffect = document.getElementById('hitElectricityEffect')
    upgradeEffect = document.getElementById('upgradeEffect')
    fireEffect = document.getElementById('fireEffect')
    shootEffect = document.getElementById('shootEffect')
    explodeEffect = document.getElementById('explodeEffect')
    bleedEffect = document.getElementById('bleedEffect')
    waveEffect = document.getElementById('waveEffect')
    haloEffect = document.getElementById('haloEffect')
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
    bodies = [
      document.getElementById('body_c'),
      document.getElementById('body_m'),
      document.getElementById('body_a'),
      document.getElementById('body_l'),
      document.getElementById('body_b')
    ]
    arms = [
      document.getElementById('arms_c'),
      document.getElementById('arms_m'),
      document.getElementById('arms_a'),
      document.getElementById('arms_l'),
      document.getElementById('arms_b')
    ]
    eyesImage = document.getElementById('eyes')
    hairstyle_black = document.getElementById('hairstyle_black')
    hairstyle_grey = document.getElementById('hairstyle_grey')
    hairstyle_orange = document.getElementById('hairstyle_orange')
    outfits = { 'a001': document.getElementById('a001') }
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
      document.addEventListener("keyup", function(event) {
        if (canvasMoveUse !== MOVEMENT_STATE_IDLE && canvasMoveUse !== MOVEMENT_STATE_MOVING) {
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
        if (playerInfo.playerStatus == PLAYER_STATUS_RUNNING && !isKeyDown[0] && !isKeyDown[1] && !isKeyDown[2] && !isKeyDown[3]) {
          canvasMoveUse = MOVEMENT_STATE_IDLE
          that.setHandlePosition(wheel1Position.x, wheel1Position.y)
        }
      })
      document.addEventListener("keydown", function(event) {
        if (canvasMoveUse !== MOVEMENT_STATE_IDLE && canvasMoveUse !== MOVEMENT_STATE_MOVING) {
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
      })
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
        // playerMoveFour()要和接收websocket同步 24/02/19
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
      var movingBlock = playerInfo
      playerInfo = playerInfos[userCode]

      if (webStage == WEB_STAGE_START) {
        this.initWeb()
        if (this.isDef(playerInfo) && playerInfo.playerStatus == PLAYER_STATUS_INIT) {
          // Character initialization
          this.prepareInitialization()
          webStage = WEB_STAGE_INITIALIZING
          canvasMoveUse = MOVEMENT_STATE_SET
        } else {
          webStage = WEB_STAGE_INITIALIZED
        }
      } else if (webStage == WEB_STAGE_INITIALIZING) {
        // Nothing
      } else if (webStage == WEB_STAGE_INITIALIZED) {
        playerInfo.regionNo = movingBlock.regionNo
        playerInfo.sceneCoordinate = movingBlock.sceneCoordinate
        playerInfo.coordinate = movingBlock.coordinate
        playerInfo.speed = movingBlock.speed
        playerInfo.faceDirection = movingBlock.faceDirection
        // This probably help backend timedTask work well 24/03/04
        playerInfo.playerStatus = PLAYER_STATUS_RUNNING
      }

      relations = response.relations

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
      var isRegionChanged = false
      if (!this.isDef(region) || region.regionNo != response.region.regionNo) {
        isRegionChanged = true
      }
      var isSceneChanged = isRegionChanged
      if (!this.isDef(sceneInfo) || sceneInfo.sceneCoordinate.x != response.sceneInfo.sceneCoordinate.x 
          || sceneInfo.sceneCoordinate.y != response.sceneInfo.sceneCoordinate.y) {
        isSceneChanged = true
      }
      if (isSceneChanged) {
        this.addChat('来到【'+ response.region.name + '-' + response.sceneInfo.name +'】')
      }
      sceneInfo = response.sceneInfo
      sceneInfos = response.sceneInfos
      region = response.region
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
      // Update coordinates 24/03/06
      // playerMoveFour() must be after show() to avoid abnormal display while changing scenes or regions
      var newCoordinate = this.playerMoveFour()
      positions.pointer.x += playerInfo.speed.x
      positions.pointer.y += playerInfo.speed.y
      playerInfo.regionNo = newCoordinate.regionNo
      playerInfo.sceneCoordinate.x = newCoordinate.sceneCoordinate.x
      playerInfo.sceneCoordinate.y = newCoordinate.sceneCoordinate.y
      playerInfo.coordinate.x = newCoordinate.coordinate.x
      playerInfo.coordinate.y = newCoordinate.coordinate.y
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
      if (webStage !== WEB_STAGE_START) {
        if (!this.isDef(playerInfo) || playerInfo.playerStatus == PLAYER_STATUS_INIT) {
          webSocketMessageDetail.functions.updatePlayerInfo = playerInfo
        } else if (playerInfo.playerStatus == PLAYER_STATUS_RUNNING) {
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
          useSkills: [false, false, false, false]
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
      var blockToInteractDistance = MIN_INTERACTION_DISTANCE + 1
      for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i]

        // Check drop
        if (block.type == BLOCK_TYPE_DROP && Math.pow(block.x - playerInfo.coordinate.x, 2) + Math.pow(block.y - playerInfo.coordinate.y, 2) <= Math.pow(MIN_DROP_INTERACTION_DISTANCE, 2)) {
          this.useDrop(block)
        }
        // Check interaction
        if (this.validateBlockToInteract(block)) {
          if (useWheel) {
            var distance = Math.sqrt(Math.pow(block.x - playerInfo.coordinate.x, 2) + Math.pow(block.y - playerInfo.coordinate.y, 2))
            if (Math.abs(playerInfo.faceDirection - this.calculateAngle(block.x - playerInfo.coordinate.x, block.y - playerInfo.coordinate.y)) <= MIN_INTERACTION_ANGLE && distance <= MIN_INTERACTION_DISTANCE) {
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
                if (Math.pow(block.x - playerInfo.coordinate.x, 2) + Math.pow(block.y - playerInfo.coordinate.y, 2) > Math.pow(MIN_INTERACTION_DISTANCE, 2)) {
                  interactionInfo = undefined
                }
              }
              document.getElementById('interactions').style.display = 'inline'
            } else {
              document.getElementById('interactions').style.display = 'none'
            }
          }
        }

        var img, txt
        var imageX = 0
        var imageY = 0
        if (block.type == BLOCK_TYPE_PLAYER) {
          this.printCharacter(playerInfos[block.id], block.x - 0.5, block.y - 1)
        } else {
          if (Number(block.code) == EVENT_CODE_HIT) {
            img = hitEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_HIT_FIRE) {
            img = hitFireEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_HIT_ICE) {
            img = hitIceEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_HIT_ELECTRICITY) {
            img = hitElectricityEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_UPGRADE) {
            img = upgradeEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_FIRE) {
            img = fireEffect
            imageX = Math.floor((Number(block.id)) * 10 / 3) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_SHOOT) {
            img = shootEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_EXPLODE) {
            img = explodeEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_BLEED) {
            img = bleedEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_BLOCK) {
            img = haloEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else if (Number(block.code) == EVENT_CODE_HEAL) {
            img = waveEffect
            imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
          } else {
            img = blockImages[Number(block.code)]
          }
          if (!this.isDef(img)) {
            img = blockImages[1000]
          }
          if (block.type == BLOCK_TYPE_DROP) {
            context.drawImage(img, imageX, imageY, imageBlockSize, imageBlockSize, 
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
          } else {
            context.drawImage(img, imageX, imageY, imageBlockSize, imageBlockSize, 
            (block.x - 0.5) * blockSize + deltaWidth, 
            (block.y - 1) * blockSize + deltaHeight, 
            blockSize + 1, 
            blockSize + 1)
          }
          if (this.validateBlockToInteract(block)) {
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
            if (Math.pow(playerInfo.coordinate.x - block.x, 2) + Math.pow(playerInfo.coordinate.y - block.y, 2) <= Math.pow(MIN_DISPLAY_DISTANCE_BLOCK_PLAYER, 2)) {
              this.printText(txt, block.x * blockSize + deltaWidth, (block.y - 1) * blockSize + deltaHeight, blockSize, 'center')
            }
          }
        }
      }
      // Show interactions (new)
      if (useWheel) {
        if (this.isDef(blockToInteract) && (canvasMoveUse === MOVEMENT_STATE_IDLE || canvasMoveUse === MOVEMENT_STATE_MOVING || canvasMoveUse === MOVEMENT_STATE_USE)) {
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
    printCharacter (playerInfoTemp, x, y) {
      context.save()
      context.beginPath()
      context.fillStyle = 'rgba(31, 31, 31, 0.25)'
      context.ellipse((x + 0.5) * blockSize + deltaWidth, (y+ 0.9) * blockSize + deltaHeight,
      blockSize * 0.2, blockSize * 0.1, 0, 0, 2 * Math.PI)
      context.fill()
      context.restore()
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
        if (playerInfoTemp.gender == 2) {
          offsetX += 3
        }
        const cutHeadRatio = 0.32
        context.drawImage(bodies[Number(playerInfoTemp.skinColor) - 1], offsetX * imageBlockSize, (cutHeadRatio + offsetY) * imageBlockSize, imageBlockSize, (1 - cutHeadRatio) * imageBlockSize, 
        x * blockSize + deltaWidth, (cutHeadRatio + y) * blockSize + deltaHeight, blockSize, (1 - cutHeadRatio) * blockSize)
        context.drawImage(arms[Number(playerInfoTemp.skinColor) - 1], offsetX * imageBlockSize, (cutHeadRatio + offsetY) * imageBlockSize, imageBlockSize, (1 - cutHeadRatio) * imageBlockSize, 
        x * blockSize + deltaWidth, (cutHeadRatio + y) * blockSize + deltaHeight, blockSize, (1 - cutHeadRatio) * blockSize)
        // Print outfit
        // if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        //   for (var outfitIndex in playerInfoTemp.outfits) {
        //     context.drawImage(outfits[outfitIndex], offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
        //     x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
        //   }
        // }
        
        // Show head
        this.drawHead(context, imageBlockSize, blockSize,
        {x: x * blockSize + deltaWidth, y: y * blockSize + deltaHeight}, 
        {x: (x + 1) * blockSize + deltaWidth, y: (y + 1) * blockSize + deltaHeight},
        [0.5, 0.5, 0.5, 0.5, 0.52, 0.6, 0.6], offsetY,
        playerInfoTemp, eyesImage, hairstyle_black, hairstyle_grey, hairstyle_orange)
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
        // Display other creatures
        // TBD
      }
      // Show name
      if (this.isDef(playerInfoTemp.nameColor)) {
        context.save()
        context.fillStyle = playerInfoTemp.nameColor
        context.fillRect((x - 0.25 + 0.5) * blockSize + deltaWidth, (y - 0.36 - 0.5 + STATUS_DISPLAY_DISTANCE_ADDER) * blockSize + deltaHeight, 
        blockSize * 0.5, 
        blockSize * 0.02)
        context.restore()
      }
      context.drawImage(avatars, playerInfoTemp.avatar % 10 * avatarSize, Math.floor(playerInfoTemp.avatar / 10) * avatarSize, 
      avatarSize, avatarSize, (x - 0.25 + 0.02 - 0.2 + 0.5) * blockSize + deltaWidth, 
      (y - 0.36 - 0.2 - 0.5 + STATUS_DISPLAY_DISTANCE_ADDER) * blockSize + deltaHeight, 
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
        context.save()
        context.beginPath()
        context.arc((x + 0.25 + 0.1 + 0.5) * blockSize + deltaWidth, 
        (y - 0.54 + 0.1 - 0.5 + STATUS_DISPLAY_DISTANCE_ADDER) * blockSize + deltaHeight, 
        0.1 * blockSize, 0, 
        2 * Math.PI)
        context.fill()
        context.restore()
      }
      if (this.isDef(playerInfoTemp.nickname)) {
        this.printText(playerInfoTemp.nickname, (x + 0.5) * blockSize + deltaWidth, 
        (y - 0.5 + 0.12 - 0.5 + STATUS_DISPLAY_DISTANCE_ADDER) * blockSize + deltaHeight, 
        Math.min(canvas.width, blockSize * 0.5), 
        'center')
      }
    },
    showOther() {
      context.save()

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
      var index = 1.5
      for (var i = BUFF_CODE_DEAD; i < BUFF_CODE_LENGTH; i++) {
        if (playerInfo.buff[i] != 0) {
          context.drawImage(smallButtons, i * smallButtonSize, 2 * smallButtonSize, smallButtonSize, smallButtonSize, canvas.width - index * smallButtonSize, status2Position.y + 8 * statusSize + 0.5 * smallButtonSize, smallButtonSize, smallButtonSize)
          index++
        }
      }

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

        SKILL_CODE_SHOOT
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
        case SKILL_CODE_SHOOT:
        rst += 'Shoot'
        break
        case SKILL_CODE_HIT:
        rst += 'Hit'
        break
        case SKILL_CODE_BLOCK:
        rst += 'Block'
        break
        case SKILL_CODE_HEAL:
        rst += 'Heal'
        break
      }
      switch (skill[1]) {
        case SKILL_MODE_SEMI_AUTO:
        break
        case SKILL_MODE_AUTO:
        rst += '(Auto)'
        break
      }
      return rst
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
      if (canvasMoveUse !== MOVEMENT_STATE_SET || playerInfo.playerStatus !== PLAYER_STATUS_INIT) {
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
      this.printText('当前位置:' + region.name + '-' + sceneInfo.name, menuLeftEdge + 10, positionY, canvas.width - menuLeftEdge - menuRightEdge - 20, 'left')
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
      if (playerInfo.buff[BUFF_CODE_DEAD] != 0) {
        hasBuff = true
        buffStr += '死亡 '
      }
      if (playerInfo.buff[BUFF_CODE_STUNNED] != 0) {
        hasBuff = true
        buffStr += '昏迷 '
      }
      if (playerInfo.buff[BUFF_CODE_BLEEDING] != 0) {
        hasBuff = true
        buffStr += '流血 '
      }
      if (playerInfo.buff[BUFF_CODE_SICK] != 0) {
        hasBuff = true
        buffStr += '疾病 '
      }
      if (playerInfo.buff[BUFF_CODE_FRACTURED] != 0) {
        hasBuff = true
        buffStr += '骨折 '
      }
      if (playerInfo.buff[BUFF_CODE_HUNGRY] != 0) {
        hasBuff = true
        buffStr += '饥饿 '
      }
      if (playerInfo.buff[BUFF_CODE_THIRSTY] != 0) {
        hasBuff = true
        buffStr += '口渴 '
      }
      if (playerInfo.buff[BUFF_CODE_FATIGUED] != 0) {
        hasBuff = true
        buffStr += '疲惫 '
      }
      if (playerInfo.buff[BUFF_CODE_BLIND] != 0) {
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
      var newDropCoordinate = { 
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
      this.adjustSceneCoordinate(newDropCoordinate)
      webSocketMessageDetail.functions.addDrops.push(newDropCoordinate)
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
              if (this.isDef(playerInfo.tools) && playerInfo.tools.length > 0 && playerInfo.tools.includes(itemNo)) {
                document.getElementById('items-name').options.add(new Option('●' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              } else {
                document.getElementById('items-name').options.add(new Option('○' + item.name + '(' + itemAmount + ') ' + (item.weight * itemAmount).toFixed(1) + 'kg', itemNo))
              }
            }
            // playerInfo.capacity += item.weight * itemAmount
            break
          case ITEM_CHARACTER_OUTFIT:
            if (document.getElementById('items-type').value == '0' || document.getElementById('items-type').value == '2') {
              if (this.isDef(playerInfo.outfits) && playerInfo.outfits.length > 0 && playerInfo.outfits.includes(itemNo)) {
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
          if (Math.pow(wheel1Position.x - x, 2) + Math.pow(wheel1Position.y - y, 2) <= Math.pow(wheel1Radius, 2)) {
            // New movement system 24/02/19
            canvasMoveUse = MOVEMENT_STATE_MOVING
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
          canvasMoveUse = MOVEMENT_STATE_MOVING
          for (var i = 0; i < blocks.length; i++) {
            var block = blocks[i]
            if (Math.pow(positions.pointer.x - block.x, 2) + Math.pow((positions.pointer.y + 0.5) - block.y, 2) > Math.pow(MIN_CLICK_DISTANCE_BLOCK_POINTER, 2)) {
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
      if (webStage !== WEB_STAGE_INITIALIZED) {
        return
      }
      webSocketMessageDetail.functions.useSkills[index - 10] = false
    },
    wheelKeyDown (index) {
      if (webStage !== WEB_STAGE_INITIALIZED) {
        return
      }
      switch (index) {
        case 0:
          canvasMoveUse = MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x, handle1Position.y - 0.1 * wheel1Radius)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 1:
          canvasMoveUse = MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x - 0.1 * wheel1Radius, handle1Position.y)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 2:
          canvasMoveUse = MOVEMENT_STATE_MOVING
          this.setHandlePosition(handle1Position.x + 0.1 * wheel1Radius, handle1Position.y)
          this.updatePointer(handle1Position.x, handle1Position.y)
          break
        case 3:
          canvasMoveUse = MOVEMENT_STATE_MOVING
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
    validateBlockToInteract (block) {
      var rst = block.id != userCode
      rst &= (block.type == BLOCK_TYPE_PLAYER || block.type == BLOCK_TYPE_BED || block.type == BLOCK_TYPE_TOILET 
      || block.type == BLOCK_TYPE_DRESSER || block.type == BLOCK_TYPE_WORKSHOP || block.type == BLOCK_TYPE_GAME 
      || block.type == BLOCK_TYPE_STORAGE || block.type == BLOCK_TYPE_COOKER || block.type == BLOCK_TYPE_SINK)
      return rst
    },
    startInteraction (block) {
      if (this.isDef(interactionInfo) && interactionInfo.code == block.code) {
        return
      }
      if (block.type == BLOCK_TYPE_PLAYER) {
        if (block.id != userCode) {
          interactionInfo = {
            type: block.type,
            id: block.id,
            code: block.code,
            list: [INTERACTION_TALK, INTERACTION_FLIRT]
          }
        }
      } else if (block.type == BLOCK_TYPE_BED) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_SLEEP]
        }
      } else if (block.type == BLOCK_TYPE_TOILET) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE, INTERACTION_DRINK]
        }
      } else if (block.type == BLOCK_TYPE_DRESSER) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_SET]
        }
      } else if (block.type == BLOCK_TYPE_WORKSHOP) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE]
        }
      } else if (block.type == BLOCK_TYPE_GAME) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE]
        }
      } else if (block.type == BLOCK_TYPE_STORAGE) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_EXCHANGE]
        }
      } else if (block.type == BLOCK_TYPE_COOKER) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE]
        }
      } else if (block.type == BLOCK_TYPE_SINK) {
        interactionInfo = {
          type: block.type,
          id: block.id,
          code: block.code,
          list: [INTERACTION_USE, INTERACTION_DRINK]
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
      if (canvasMoveUse === MOVEMENT_STATE_MOVING) {
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
      if (webStage !== WEB_STAGE_INITIALIZED) {
        return
      }
      if (canvasMoveUse === MOVEMENT_STATE_RECORDER) {
        this.recordEnd()
        canvasMoveUse = MOVEMENT_STATE_IDLE
      } else if (canvasMoveUse === MOVEMENT_STATE_MOVING) {
        canvasMoveUse = MOVEMENT_STATE_IDLE
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
    detectCollision (p1, p2, p3, distance) {
      // For local player only!
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
    detectCollisionSquare (p1, p2, p3, distance, sideLength) {
      // For local player only!
      // p1: Start point
      // p2: End point
      // p3: Obstacle center point
      // distance: min distance between p1/p2 and p3
      // sideLength: blockSize
      if (Math.abs(p3.x - p1.x) < distance + sideLength / 2 && Math.abs(p3.y - p1.y) < distance + sideLength / 2) {
        // Already overlapped
        return false
      }
      if (Math.abs(p3.x - p2.x) < distance + sideLength / 2 && Math.abs(p3.y - p2.y) <= distance + sideLength / 2) {
        // Too close
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
    playerMoveFour () {
      if (canvasMoveUse !== MOVEMENT_STATE_MOVING 
      || playerInfo.buff[BUFF_CODE_DEAD] != 0
      || Math.pow(positions.pointer.x - playerInfo.coordinate.x, 2) + Math.pow(positions.pointer.y - playerInfo.coordinate.y, 2) < Math.pow(MIN_MOVE_DISTANCE_POINTER_PLAYER, 2)) {
        playerInfo.speed.x = 0
        playerInfo.speed.y = 0
        return playerInfo
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
      var newCoordinate = {
        sceneCoordinate: { x: playerInfo.sceneCoordinate.x, y: playerInfo.sceneCoordinate.y },
        coordinate: { x: playerInfo.coordinate.x, y: playerInfo.coordinate.y },
        regionNo: playerInfo.regionNo
      }
      for (var i = 0; i < blocks.length; i++) {
        if (playerInfo.speed.x === 0 && playerInfo.speed.y === 0) {
          // No speed
          break
        }
        if (blocks[i].type == BLOCK_TYPE_PLAYER) {
          if (blocks[i].id != userCode) {
            // Player himself is to be past
            if (this.detectCollision(playerInfo.coordinate, 
                { x: playerInfo.coordinate.x + playerInfo.speed.x, y: playerInfo.coordinate.y }, 
                blocks[i], radius * 2)) {
              playerInfo.speed.x = 0
            }
            if (this.detectCollision(playerInfo.coordinate, 
                { x: playerInfo.coordinate.x, y: playerInfo.coordinate.y + playerInfo.speed.y }, 
                blocks[i], radius * 2)) {
              playerInfo.speed.y = 0
            }
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
            if (!useWheel) {
              canvasMoveUse = MOVEMENT_STATE_IDLE
            }
            break
          }
        } else if (blocks[i].type != BLOCK_TYPE_GROUND && blocks[i].type != BLOCK_TYPE_DROP && blocks[i].type != BLOCK_TYPE_GROUND_DECORATION 
            && blocks[i].type != BLOCK_TYPE_WALL_DECORATION && blocks[i].type != BLOCK_TYPE_CEILING_DECORATION && blocks[i].type != BLOCK_TYPE_HOLLOW_WALL) {
          // this.detectCollisionSquare(playerInfo.coordinate, newCoordinate.coordinate, { x: blocks[i].x, y: blocks[i].y - 0.5 }, radius, 1)
          // newCoordinate.coordinate.x = playerInfo.coordinate.x + playerInfo.speed.x
          // newCoordinate.coordinate.y = playerInfo.coordinate.y + playerInfo.speed.y
            if (this.detectCollisionSquare(playerInfo.coordinate, 
                { x: playerInfo.coordinate.x + playerInfo.speed.x, y: playerInfo.coordinate.y }, 
                { x: blocks[i].x, y: blocks[i].y - 0.5 }, radius, 1)) {
              playerInfo.speed.x = 0
            }
            if (this.detectCollisionSquare(playerInfo.coordinate, 
                { x: playerInfo.coordinate.x, y: playerInfo.coordinate.y + playerInfo.speed.y }, 
                { x: blocks[i].x, y: blocks[i].y - 0.5 }, radius, 1)) {
              playerInfo.speed.y = 0
            }
            newCoordinate.coordinate.x = playerInfo.coordinate.x + playerInfo.speed.x
            newCoordinate.coordinate.y = playerInfo.coordinate.y + playerInfo.speed.y
        }
      }
      // Teleport destination cannot be adjusted 23/09/04
      if (playerInfo.regionNo == newCoordinate.regionNo) {
        this.adjustSceneCoordinate(newCoordinate)
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
        if (newCoordinate.sceneCoordinate.x !== playerInfo.sceneCoordinate.x) {
          playerInfo.speed.x = 0
        }
        if (newCoordinate.sceneCoordinate.y !== playerInfo.sceneCoordinate.y) {
          playerInfo.speed.y = 0
        }
        return playerInfo
      }

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
          this.getPreservedItems('c001', 1)
          this.getPreservedItems('c002', 1)
          this.getPreservedItems('c003', 1)
          this.getPreservedItems('c004', 1)
          this.getPreservedItems('n001', 1)
          this.getPreservedItems('r001', 1)
        }
      }

      return newCoordinate
    },
    adjustSceneCoordinate (adjustedCoordinate) {
      while (adjustedCoordinate.coordinate.y < -1) {
        adjustedCoordinate.sceneCoordinate.y -= 1
        adjustedCoordinate.coordinate.y += region.height
      }
      while (adjustedCoordinate.coordinate.y >= region.height - 1) {
        adjustedCoordinate.sceneCoordinate.y += 1
        adjustedCoordinate.coordinate.y -= region.height
      }
      while (adjustedCoordinate.coordinate.x < -0.5) {
        adjustedCoordinate.sceneCoordinate.x -= 1
        adjustedCoordinate.coordinate.x += region.width
      }
      while (adjustedCoordinate.coordinate.x >= region.width -0.5) {
        adjustedCoordinate.sceneCoordinate.x += 1
        adjustedCoordinate.coordinate.x -= region.width
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
      status2Position = { x: canvas.width - maxStatusLineSize - statusSize, y: 0 }
      wheel1Position = { x: wheel1Radius, y: canvas.height - wheel1Radius }
      if (canvasMoveUse !== MOVEMENT_STATE_MOVING) {
        this.setHandlePosition(wheel1Position.x, wheel1Position.y)
      }
      wheel2Position = { x: canvas.width - wheel2Radius, y: canvas.height - wheel2Radius }
      chatPosition = { x: 10, y: wheel2Position.y - wheel1Radius - 60 }
      recordButtonPosition = { x: 20, y: chatPosition.y + 50 }
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
      // if (webSocketMessageDetail.functions.updatePlayerInfo.playerStatus == PLAYER_STATUS_INIT) {
        webSocketMessageDetail.functions.updatePlayerInfo.playerStatus = PLAYER_STATUS_RUNNING
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
      webSocketMessageDetail.functions.updatePlayerInfo.avatar = document.getElementById('initialization-avatar').value
      if (webStage === WEB_STAGE_INITIALIZING && playerInfo.playerStatus == PLAYER_STATUS_RUNNING) {
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
    // Deprecated 24/03/04
    addEvent (eventCode) {
      if (!this.isDef(eventCode)) {
        return
      }
      var newEventCoordinate = {
        type: eventCode,
        id: '',
        code: userCode,
        regionNo: playerInfo.regionNo,
        sceneCoordinate: {
          x: playerInfo.sceneCoordinate.x, 
          y: playerInfo.sceneCoordinate.y
        },
        coordinate: {
          x: playerInfo.coordinate.x + (Math.random() + 1) * Math.cos(playerInfo.faceDirection / 180 * Math.PI), 
          y: playerInfo.coordinate.y - (Math.random() + 1) * Math.sin(playerInfo.faceDirection / 180 * Math.PI)
        }
      }
      this.adjustSceneCoordinate(newEventCoordinate)
      webSocketMessageDetail.functions.addEvents.push(newEventCoordinate)
    },
    printText (content, x, y, maxWidth, textAlign) {
      this.$drawMethods.printText(context, content, x, y, maxWidth, textAlign)
    },
    drawHead (context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, coefs, offsetY, playerInfoTemp, eyesImage, hairstyle_black, hairstyle_grey, hairstyle_orange) {
      this.$drawMethods.drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, coefs, offsetY, playerInfoTemp, eyesImage, hairstyle_black, hairstyle_grey, hairstyle_orange)
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
        left: 60px;
        top: 160px;
        width: 50px;
        display: flex;
    }
    .items #items-name{
        position: absolute;
        left: 60px;
        top: 185px;
        width: 120px;
        display: flex;
    }
    .items #items-choose{
        position: absolute;
        left: 180px;
        top: 185px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items #items-range{
        position: absolute;
        left: 60px;
        top: 210px;
        width: 120px;
        display: flex;
    }
    .items #items-remove{
        position: absolute;
        left: 60px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size:10px;
    }
    .items #items-desc{
        position: absolute;
        left: 60px;
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
        left: 60px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items-exchange #items-exchange-name{
        position: absolute;
        left: 260px;
        top: 185px;
        width: 120px;
        display: flex;
    }
    .items-exchange #items-exchange-range{
        position: absolute;
        left: 260px;
        top: 210px;
        width: 120px;
        display: flex;
    }
    .items-exchange #items-exchange-get{
        position: absolute;
        left: 260px;
        top: 235px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .items-exchange #items-exchange-desc{
        position: absolute;
        left: 260px;
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
        left: 60px;
        top: 500px;
        width: 240px;
        height: 80px;
        display: flex;
        font-size: 12px;
    }
    .terminal #terminal-input{
        position: absolute;
        left: 60px;
        top: 585px;
        width: 160px;
        display: flex;
    }
    .terminal #terminal-enter{
        position: absolute;
        left: 220px;
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
        left: 60px;
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
        left: 110px;
        top: 160px;
        width: 100px;
        display: flex;
    }
    .settings #settings-music{
        position: absolute;
        left: 110px;
        top: 210px;
        display: flex;
    }
    .settings #settings-sound{
        position: absolute;
        left: 210px;
        top: 210px;
        display: flex;
    }
    .settings #settings-about{
        position: absolute;
        left: 60px;
        top: 260px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .settings #settings-logoff{
        position: absolute;
        left: 60px;
        top: 310px;
        width: 50px;
        display: flex;
        font-size: 10px;
    }
    .initialization{
        position: absolute;
        left: 60px;
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
