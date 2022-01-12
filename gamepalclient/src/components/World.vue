<template>
  <div class="world">
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
        >
            抱歉，您的浏览器暂不支持canvas元素
        </canvas>
        <input id="chat" type="text" value=""/>
        <button id="enter" @click="sendChat(1, '')">Enter</button>
    </div>
    <div style="display:none">
	    <audio id="myAudio" type="audio/wav" controls autoplay/>
        <img id="c0" src="../assets/image/characters/c0.png">
        <img id="avatars" src="../assets/image/avatars.png">
        <img id="floors" src="../assets/image/floors.png">
        <img id="decorations" src="../assets/image/decorations.png">
        <img id="doors" src="../assets/image/doors.png">
        <img id="buttons" src="../assets/image/buttons.png">
    </div>
  </div>
</template>

<script>
import scenes from '../../static/scenes.json'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const canvasMaxSizeX = 16
const canvasMaxSizeY = 9
const canvasMinSizeX = 1
const canvasMinSizeY = 1
const stopEdge = 0.15
const sharedEdge = 0.25
let blockSize = 100
const imageBlockSize = 100
var deltaWidth
var deltaHeight
// -1-not-in-use 0-playground 1-avatar 2-info 3-msg 4-voice 5-settings
let canvasMoveUse = -1
const avatarSize = 100
const buttonSize = 50

var messages = []
const screenX = 10
const screenY= 110
const maxMsgLineNum = 5
const maxMsgLineSize = 400
const chatSize = 20

import Recorderx, { ENCODE_TYPE } from 'recorderx';
const rc = new Recorderx()
var voiceMessages = []
let micInUse = false
let voiceInUse = false

var uuid
var sceneNo
var playerX
var playerY
var playerNextX
var playerNextY
var playerSpeedX
var playerSpeedY
// Never exceed 1
const playerMaxSpeedX = 0.05
// Never exceed 1
const playerMaxSpeedY = 0.05
const acceleration = 0.01
// 1-E 2-NE 3-N 4-NW 5-W 6-SW 7-S 8-SE
var playerDirection
var isMuted = false
const voiceEndDelay = 500

var positionMap

let pointerX = -1
let pointerY = -1

var intervalTimer20
var intervalTimer250
var intervalTimer1000
var intervalTimer30000
// var timeoutTimer300000
// const timeoutMS = 300000

export default {
  name: 'World',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus',
      api_path: '/api/v1'
    }
  },
  components: {
    PulseLoader
  },
  mounted () {
    this.$nextTick(()=>{
      this.init()
    });
  },
  beforeDestroy () {
    this.shutdown()
  },
  methods: {
    async init () {
      this.canvas = this.$refs.canvas // 指定canvas
      canvas.addEventListener('contextmenu', function(e){
        e.preventDefault();
      }) // 防止长按复制
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
      this.ctx = this.canvas.getContext('2d') // 设置2D渲染区域
      // this.ctx.lineWidth = 5 // 设置线的宽度

      if (sessionStorage['token'] !== null) {
        this.uuid = sessionStorage['uuid'].substr(1, sessionStorage['uuid'].length - 2)
      }

      document.getElementById("chat").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          document.getElementById("enter").click();
        }
      })

      // 需要定时执行的代码
      intervalTimer20 = setInterval(() => {
        this.playerMoveFour()
        this.show()
      }, 20)
      intervalTimer250 = setInterval(() => {
        this.setPosition()
        this.getUsersByScene()
      }, 250)
      intervalTimer1000 = setInterval(() => {
        this.checkLogin()
        this.receiveChat()
        this.updateVoice()
      }, 1000)
      intervalTimer30000 = setInterval(() => {
        this.updateChat()
      }, 30000)
      // timeoutTimer300000 = setTimeout(() => {
        // this.logoff()
      // }, timeoutMS)
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

      // Extra once
      await this.getPosition()
      await this.getUsersByScene()
      await this.setPosition()
      this.resizeCanvas()
    },
    switchTo (path) {
      // this.$router.replace(path)
      this.$router.push(path)
    },
    async checkLogin () {
      if (sessionStorage['uuid'] !== null && sessionStorage['token'] !== null) {
        var uuid = sessionStorage['uuid'].substr(1, sessionStorage['uuid'].length - 2)
        var token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: uuid, token: token })
        }
        await this.$axios.post(this.api_path + "/checkToken", requestOptions)
          .then(res => {
            if (res.status === 200) {
              return
            } else {
              this.logoff()
            }
        })
        .catch(error => {
          this.logoff()
        })
      }
      //Vue.prototype.$message({
        //message: '请重新登录',
        //type: 'warning'
      //})
    },
    checkAlive () { // Abandoned
      // if (this.playerSpeedX > 0 || this.playerSpeedY > 0) {
        // clearTimeout(timeoutTimer300000)
        // timeoutTimer300000 = setTimeout(() => {
          // this.logoff()
        // }, timeoutMS)
      // }
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
        body: JSON.stringify({ uuid: this.uuid, token: token })
      }
      this.$axios.post(this.api_path + "/logoff", requestOptions)
      this.switchTo ('/')
    },
    async getPosition () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: this.uuid })
      }
      await this.$axios.post(this.api_path + "/getPosition", requestOptions)
          .then(res => {
        this.sceneNo = res.data.position.sceneNo
        if (res.data.position.x === -1) {
          this.playerX = this.ctx.canvas.width / 2 / blockSize
        } else {
          this.playerX = res.data.position.x
        }
        if (res.data.position.y === -1) {
          this.playerY = this.ctx.canvas.height / 2 / blockSize
        } else {
          this.playerY = res.data.position.y
        }
        this.playerSpeedX = res.data.position.speedX
        this.playerSpeedY = res.data.position.speedY
        this.playerDirection = res.data.position.direction
      })
      .catch(error => {
      })
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
    },
    async setPosition() {
      if (this.playerX < 0 || this.playerX > scenes.width || this.playerY < 0 || this.playerY > scenes.height) {
        return
      }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid: this.uuid,
          sceneNo: this.sceneNo,
          x: this.playerX,
          y: this.playerY,
          speedX: this.playerSpeedX,
          speedY: this.playerSpeedY,
          direction: this.playerDirection
        })
      }
      await this.$axios.post(this.api_path + "/setPosition", requestOptions)
          .then(res => {
      })
      .catch(error => {
      })
    },
    async getUsersByScene () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sceneNo: this.sceneNo, uuid: this.uuid })
      }
      await this.$axios.post(this.api_path + "/getUsersByScene", requestOptions)
          .then(res => {
        this.positionMap = res.data.positionMap
      })
      .catch(error => {
      })
    },
    show () {
      if (!this.isDef(this.sceneNo)) {
        return
      }
      var floors = document.getElementById('floors')
      var decorations = document.getElementById('decorations')
      var doors = document.getElementById('doors')
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

      // Adjust view
      deltaWidth = Math.min(this.ctx.canvas.width / 2 - this.playerX * blockSize, (canvasMaxSizeX / 2 - this.playerX) * blockSize)
      deltaHeight = Math.min(this.ctx.canvas.height / 2 - this.playerY * blockSize, (canvasMaxSizeY / 2 - this.playerY) * blockSize)

      var sceneHeight = scenes.height
      var sceneWidth = scenes.width
      var scene = scenes.scenes[this.sceneNo]

      // Floor
      for (var i = 0; i < sceneHeight; i++) {
        for (var j = 0; j < sceneWidth; j++) {
          var code = scene.floors[j][i]
          var offsetX = code % 10
          var offsetY = Math.floor(code / 10) % 100
          this.ctx.drawImage(floors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, i * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, blockSize)
        }
      }

      // Bottom Decoration
      this.printDecoration(scene.decorations.bottom)

      // Others + Player
      var playerPrinted = false
      if (this.isDef(this.positionMap) && !this.isPromise(this.positionMap)) {
        for (let i = 0; i < this.positionMap.length; i++) {
          var userPosition = this.positionMap[i]
          if (!playerPrinted && userPosition.y > this.playerY) {
            this.printCharacter (this.uuid, this.playerX, this.playerY, this.playerSpeedX, this.playerSpeedY, this.playerDirection, deltaWidth, deltaHeight)
            playerPrinted = true
          }
          this.printCharacter (userPosition.uuid, userPosition.x, userPosition.y, userPosition.speedX, userPosition.speedY, userPosition.direction, deltaWidth, deltaHeight)
        }
      }
      if (!playerPrinted) {
        this.printCharacter (this.uuid, this.playerX, this.playerY, this.playerSpeedX, this.playerSpeedY, this.playerDirection, deltaWidth, deltaHeight)
        playerPrinted = true
      }

      // Up Decoration
      this.printDecoration(scene.decorations.up)

      // Console
      this.ctx.drawImage(avatars, 1 * avatarSize, 0 * avatarSize, avatarSize, avatarSize, 0 * avatarSize, this.ctx.canvas.height - avatarSize, avatarSize, avatarSize)
      for (let i = 0; i < 4; i++) {
        if (canvasMoveUse !== i + 2) {
          this.ctx.drawImage(buttons, i * buttonSize, 0 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + i * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
        } else {
          this.ctx.drawImage(buttons, i * buttonSize, 1 * buttonSize, buttonSize, buttonSize, 1 * avatarSize + i * buttonSize, this.ctx.canvas.height - buttonSize, buttonSize, buttonSize)
        }
      }
      this.printChat()

      // Cursor
      if (pointerX !== -1 && pointerY !== -1) {
        // this.ctx.drawImage(paw, pointerX - blockSize + deltaWidth, pointerY - blockSize + deltaHeight)
      }
    },
    printDecoration (sceneDecorations) {
      for (var i = 0; i < sceneDecorations.length; i++) {
        var decoration = sceneDecorations[i]
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
      }
    },
    printCharacter (uuid, x, y, speedX, speedY, playerDirection, deltaWidth, deltaHeight) {
      // Show individual
      var offsetX
      var offsetY
      if (playerDirection == 1 || playerDirection == 2) {
        offsetY = 2
      } else if (playerDirection == 3 || playerDirection == 4) {
        offsetY = 3
      } else if (playerDirection == 5 || playerDirection == 6) {
        offsetY = 1
      } else if (playerDirection == 7 || playerDirection == 8) {
        offsetY = 0
      } else {
        offsetY = 0
      }
      var timestamp = (new Date()).valueOf()
      var speed = Math.sqrt(Math.pow(speedX, 2) + Math.pow(speedY, 2))
      var maxSpeed = Math.sqrt(Math.pow(playerMaxSpeedX, 2) + Math.pow(playerMaxSpeedY, 2))
      if (speed !== 0 && timestamp % (1000 / speed * maxSpeed) < (250 / speed * maxSpeed)) {
        offsetX = 0
      } else if (speed !== 0 && timestamp % (1000 / speed * maxSpeed) >= (500 / speed * maxSpeed) && timestamp % (1000 / speed * maxSpeed) < (750 / speed * maxSpeed)) {
        offsetX = 2
      } else {
        offsetX = 1
      }
      this.ctx.drawImage(c0, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
    },
    printChat () {
      var x = 0
      var y = -avatarSize
      if(this.isDef(messages)) {
        this.ctx.fillStyle = 'rgba(0,0,0,0.25)'
        this.ctx.fillRect(screenX, document.documentElement.clientHeight - screenY - messages.length * chatSize + 5, Math.min(document.documentElement.clientWidth, maxMsgLineSize - screenX), chatSize * messages.length)
        for (let i = 0; i < messages.length; i++) {
          this.ctx.font = '16px sans-serif'
          this.ctx.fillStyle = '#EEEEEE'
          this.ctx.fillText(messages[messages.length - 1 - i], screenX, document.documentElement.clientHeight - screenY - i * chatSize, Math.min(document.documentElement.clientWidth - screenX, maxMsgLineSize))
          this.ctx.fillStyle = '#000000'
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
      pointerX = x + document.documentElement.scrollLeft - deltaWidth
      pointerY = y + document.documentElement.scrollTop - deltaHeight
      if (x < avatarSize && y >= this.ctx.canvas.height - avatarSize) {
        // Avatar
        canvasMoveUse = 1
      } else if (x < avatarSize + 1 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Personal information
        canvasMoveUse = 2
      } else if (x < avatarSize + 2 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Send message
        canvasMoveUse = 3
        if (document.getElementById('chat').style.display === 'inline') {
            document.getElementById('chat').style.display = 'none'
            document.getElementById('enter').style.display = 'none'
        } else {
            document.getElementById('chat').style.display = 'inline'
            document.getElementById('enter').style.display = 'inline'
        }
      } else if (x < avatarSize + 3 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Voice chat
        canvasMoveUse = 4
        this.recordStart()
      } else if (x < avatarSize + 4 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Settings
        canvasMoveUse = 5
      } else {
        // Playground
        canvasMoveUse = 0
        this.playerNextX = pointerX / blockSize
        this.playerNextY = pointerY / blockSize
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
      pointerX = x + document.documentElement.scrollLeft - deltaWidth
      pointerY = y + document.documentElement.scrollTop - deltaHeight
      if (canvasMoveUse === 0) {
        this.playerNextX = pointerX / blockSize
        this.playerNextY = pointerY / blockSize
      }
    },
    canvasUp () {
      this.canvasLeave()
      canvasMoveUse = -1
    },
    canvasLeave () {
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
      this.playerSpeedX = 0
      this.playerSpeedY = 0
      if (canvasMoveUse === 4) {
	    setTimeout(() => {
          this.sendVoice(1, '')
        }, voiceEndDelay)
      }
    },
    playerMoveFour () {
      var deltaX = this.playerNextX - this.playerX
      var deltaY = this.playerNextY - this.playerY
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(stopEdge, 2)) {
        // Set speed
        this.playerSpeedX = 0
        this.playerSpeedY = 0
      } else {
        // Set speed
        var deltaX = this.playerNextX - this.playerX
        var deltaY = this.playerNextY - this.playerY
        var coeffiecient = acceleration / Math.sqrt((Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        this.playerSpeedX = Math.max(-playerMaxSpeedX, Math.min(playerMaxSpeedX, this.playerSpeedX + deltaX * coeffiecient))
        this.playerSpeedY = Math.max(-playerMaxSpeedY, Math.min(playerMaxSpeedY, this.playerSpeedY + deltaY * coeffiecient))
        // Set direction
        if (this.playerSpeedX > 0 && Math.abs(this.playerSpeedX) >= Math.abs(this.playerSpeedY)) {
          this.playerDirection = 1
        } else if (this.playerSpeedX < 0 && Math.abs(this.playerSpeedX) >= Math.abs(this.playerSpeedY)) {
          this.playerDirection = 5
        } else if (this.playerSpeedY > 0 && Math.abs(this.playerSpeedX) <= Math.abs(this.playerSpeedY)) {
          this.playerDirection = 7
        } else if (this.playerSpeedY < 0 && Math.abs(this.playerSpeedX) <= Math.abs(this.playerSpeedY)) {
          this.playerDirection = 3
        } else {
          this.playerDirection = 7
        }
        // Detect edge
        // sharedEdge is used for obstacles, not edge of the canvas map
        var scene = scenes.scenes[this.sceneNo]
        if (this.playerSpeedX >= 0) {
          if (this.playerX + 0.5 + this.playerSpeedX <= scenes.width &&
          scene.events[Math.max(0, Math.floor(this.playerY - 0.5 + sharedEdge))][Math.floor(this.playerX + 0.5 - sharedEdge + this.playerSpeedX)] !== 1 &&
          scene.events[Math.min(scene.events.length - 1, Math.ceil(this.playerY - 0.5 - sharedEdge))][Math.floor(this.playerX + 0.5 - sharedEdge + this.playerSpeedX)] !== 1) {
            this.playerX += this.playerSpeedX
            // Infinitive moving
            this.playerNextX += this.playerSpeedX
          } else {
            this.playerSpeedX = 0
          }
        }
        if (this.playerSpeedX <= 0) {
          if (this.playerX - 0.5 + this.playerSpeedX >= 0 &&
          scene.events[Math.max(0, Math.floor(this.playerY - 0.5 + sharedEdge))][Math.floor(this.playerX - 0.5 + sharedEdge + this.playerSpeedX)] !== 1 &&
          scene.events[Math.min(scene.events.length - 1, Math.ceil(this.playerY - 0.5 - sharedEdge))][Math.floor(this.playerX - 0.5 + sharedEdge + this.playerSpeedX)] !== 1) {
            this.playerX += this.playerSpeedX
            // Infinitive moving
            this.playerNextX += this.playerSpeedX
          } else {
            this.playerSpeedX = 0
          }
        }
        if (this.playerSpeedY >= 0) {
          if (this.playerY + 0.5 + this.playerSpeedY <= scenes.height &&
          scene.events[Math.floor(this.playerY + 0.5 - sharedEdge + this.playerSpeedY)][Math.max(0, Math.floor(this.playerX - 0.5 + sharedEdge))] !== 1 &&
          scene.events[Math.floor(this.playerY + 0.5 - sharedEdge + this.playerSpeedY)][Math.min(scene.events[0].length - 1, Math.ceil(this.playerX - 0.5 - sharedEdge))] !== 1) {
            this.playerY += this.playerSpeedY
            // Infinitive moving
            this.playerNextY += this.playerSpeedY
          } else {
            this.playerSpeedY = 0
          }
        }
        if (this.playerSpeedY <= 0) {
          if (this.playerY - 0.5 + this.playerSpeedY >= 0 &&
          scene.events[Math.floor(this.playerY - 0.5 + sharedEdge + this.playerSpeedY)][Math.max(0, Math.floor(this.playerX - 0.5 + sharedEdge))] !== 1 &&
          scene.events[Math.floor(this.playerY - 0.5 + sharedEdge + this.playerSpeedY)][Math.min(scene.events[0].length - 1, Math.ceil(this.playerX - 0.5 - sharedEdge))] !== 1) {
            this.playerY += this.playerSpeedY
            // Infinitive moving
            this.playerNextY += this.playerSpeedY
          } else {
            this.playerSpeedY = 0
          }
        }
      }
    },
    clear () {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.playerX = this.canvas.width / blockSize / 2
      this.playerY = this.canvas.height / blockSize / 2
      this.show()
    },
    save () {
      const imgBase64 = this.$refs.canvas.toDataURL()
      // console.log(imgBase64)
    },
    resizeCanvas () {
      this.canvas = this.$refs.canvas // 指定canvas
      this.canvas.width = Math.max(canvasMinSizeX * blockSize, Math.min(canvasMaxSizeX * blockSize, document.documentElement.clientWidth))
      this.canvas.height = Math.max(canvasMinSizeY * blockSize, Math.min(canvasMaxSizeY * blockSize, document.documentElement.clientHeight))
      console.log('New size: ' + this.canvas.width + '*' + this.canvas.height)
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
	  voiceInUse = false
	  var audioObj = document.getElementById("myAudio")
	  if (!audioObj.ended){
	    audioObj.pause()
		audioObj.currentTime = 0
	  }
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
      document.getElementById('chat').style.display = 'none'
      document.getElementById('enter').style.display = 'none'
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: this.uuid, receiver: receiver, type: type, content: message })
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
	  var message = await blobToBase64(blob)
	
      // Only broadcasting mode
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: this.uuid, receiver: receiver, type: type, content: message })
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
	  var audioObj = document.getElementById("myAudio")
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
    async receiveChat () {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uuid: this.uuid })
      }
      await this.$axios.post(this.api_path + "/receive-chat", requestOptions)
          .then(res => {
        for (let i = 0; i < res.data.messages.length; i++) {
          messages.push(res.data.messages[i].fromUuid + ':')
          if (res.data.messages[i].type === 1) {
            messages.push(('[广播]' + res.data.messages[i].content))
          } else {
            messages.push(res.data.messages[i].content)
          }
          while (messages.length > maxMsgLineNum * 2) {
            messages = messages.slice(-maxMsgLineNum * 2 + 1)
          }
        }
        for (let i = 0; i < res.data.voiceMessages.length; i++) {
          voiceMessages.push(res.data.voiceMessages[i].content)
        }
      })
      .catch(error => {
      })
    },
    updateChat () {
      if (this.isDef(messages)) {
        messages = messages.slice(1)
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
    shutdown () {
      clearInterval(intervalTimer20)
      clearInterval(intervalTimer250)
      clearInterval(intervalTimer1000)
      clearInterval(intervalTimer30000)
      // clearTimeout(timeoutTimer300000)
      window.removeEventListener('resize', this.resizeCanvas)
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
        left: 100px;
        bottom: 65px;
        height: 20px;
        width: 150px;
        opacity:0.5;
        font-size:16px;
        display: none;
    }
    .world-canvas #enter{
        position: absolute;
        left: 250px;
        bottom: 65px;
        height: 25px;
        width: 50px;
        font-size:10px;
        display: none;
    }
</style>
