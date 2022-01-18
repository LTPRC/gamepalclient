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
            style="display:none"
        >
            抱歉，您的浏览器暂不支持canvas元素
        </canvas>
        <input id="chat" type="text" value=""/>
        <button id="enter" @click="sendChat(1, '')">Enter</button>
    </div>
    <div style="display:none">
        <audio id="voiceAudio" type="audio/wav" controls autoplay crossOrigin = "anonymous" />
        <audio id="musicAudio" :src="require('../assets/test01.mp3')" />
        <audio id="soundAudio" controls autoplay crossOrigin = "anonymous" />
        <img id="c0" src="../assets/image/characters/c0.png" @load="prepareResource">
        <img id="avatars" src="../assets/image/avatars.png" @load="prepareResource">
        <img id="characters" src="../assets/image/characters.png" @load="prepareResource">
        <img id="hairstyle" src="../assets/image/hairstyle.png" @load="prepareResource">
        <img id="hairstyle_black" src="../assets/image/hairstyle_black.png" @load="prepareResource">
        <img id="hairstyle_grey" src="../assets/image/hairstyle_grey.png" @load="prepareResource">
        <img id="hairstyle_orange" src="../assets/image/hairstyle_orange.png" @load="prepareResource">
        <img id="eyesImage" src="../assets/image/eyes.png" @load="prepareResource">
        <img id="outfits" src="../assets/image/outfits.png" @load="prepareResource">
        <img id="floors" src="../assets/image/floors.png" @load="prepareResource">
        <img id="decorations" src="../assets/image/decorations.png" @load="prepareResource">
        <img id="doors" src="../assets/image/doors.png" @load="prepareResource">
        <img id="buttons" src="../assets/image/buttons.png" @load="prepareResource">
    </div>
  </div>
</template>

<script>
let userDatas = []
let userData = {}
let chatMessages = []
let voiceMessages = []
  
let resourceToBeLoaded
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
let pointerX = -1
let pointerY = -1

var messages = []
const screenX = 10
const screenY= 110
const maxMsgLineNum = 5
const maxMsgLineSize = 400
const chatSize = 20

import Recorder from 'js-audio-recorder' //用于获取麦克风权限
import Recorderx, { ENCODE_TYPE } from 'recorderx'; //用于录音
const rc = new Recorderx()
let isMuted = true
let micIsPermitted = false
let micInUse = false
let voiceInUse = false
const voiceEndDelay = 500

var intervalTimer20
var intervalTimer1000
var intervalTimer30000
// var timeoutTimer300000
// const timeoutMS = 300000

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
    resourceToBeLoaded = 13
  },
  beforeDestroy () {
    this.shutdown()
  },
  methods: {
    prepareResource () {
      resourceToBeLoaded--
      console.log('resourceToBeLoaded = ' + resourceToBeLoaded)
      if (resourceToBeLoaded === 0) {
        document.getElementById('canvas').style.display = 'inline'
        this.init()
      }
    },
    init () {
      this.initWebSocket()

      this.canvas = this.$refs.canvas // 指定canvas
      canvas.addEventListener('contextmenu', function(e){
        e.preventDefault();
      }) // 防止长按复制
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false}); //passive 参数不能省略，用来兼容ios和android
      this.ctx = this.canvas.getContext('2d') // 设置2D渲染区域
      // this.ctx.lineWidth = 5 // 设置线的宽度

      document.getElementById("chat").addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode === 13) {
          document.getElementById("enter").click();
        }
      })

      // 需要定时执行的代码
      intervalTimer20 = setInterval(() => {
	    this.sendMessage()
        this.playerMoveFour()
        this.show()
      }, 200)
      intervalTimer1000 = setInterval(() => {
        this.updateVoice()
      }, 1000)
      intervalTimer30000 = setInterval(() => {
        this.updateChat()
      }, 30000)
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
    },
    initWebSocket () {
      console.log('initWebSocket方法')
      // WebSocket地址为接口地址，http用ws、https用wws
      var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws"
      this.websocket = new WebSocket(ws_scheme + '://localhost:8080/websocket/v1/' + sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2))
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
      console.log('服务器返回的消息', e.data)
	  var response = JSON.parse(e.data)
      // Token check
      if (response.token != userData.token) {
        this.logoff()
      }
	  if (this.isDef(response.userDatas)) {
        for (let i = 0; i < response.userDatas.length; i++) {
          if (response.userDatas[i].userCode == response.userCode) {
            userData = response.userDatas[i]
			if (sessionStorage['token'] !== null) {
			  userData.userCode = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
			  userData.token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
			}
		  }
        }
      }
	  if (this.isDef(response.chatMessages)) {
        for (let i = 0; i < response.chatMessages.length; i++) {
          chatMessages.push(response.chatMessages[i].fromUuid + ':')
          if (response.chatMessages[i].type === 1) {
            chatMessages.push(('[广播]' + response.chatMessages[i].content))
          } else {
            chatMessages.push(response.chatMessages[i].content)
          }
          while (chatMessages.length > maxMsgLineNum * 2) {
            chatMessages = chatMessages.slice(-maxMsgLineNum * 2 + 1)
          }
        }
	  }
	  if (this.isDef(response.voiceMessages)) {
        for (let i = 0; i < response.voiceMessages.length; i++) {
          voiceMessages.push(response.voiceMessages[i].content)
		}
      }
    },
    webSocketClose (e) {
      console.log('WebSocket连接断开', e)
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
	sendMessage () {
	  if (sessionStorage['token'] !== null) {
	    userData.userCode = sessionStorage['userCode'].substr(1, sessionStorage['userCode'].length - 2)
	    userData.token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
	  }
	  this.websocket.send(JSON.stringify(userData))
	},
    show () {
      if (!this.isDef(userData.sceneNo)) {
        return
      }
      var floors = document.getElementById('floors')
      var decorations = document.getElementById('decorations')
      var doors = document.getElementById('doors')
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

      // Adjust view
      deltaWidth = Math.min(this.ctx.canvas.width / 2 - userData.playerX * blockSize, (canvasMaxSizeX / 2 - userData.playerX) * blockSize)
      deltaHeight = Math.min(this.ctx.canvas.height / 2 - userData.playerY * blockSize, (canvasMaxSizeY / 2 - userData.playerY) * blockSize)

      var sceneHeight = this.$scenes.height
      var sceneWidth = this.$scenes.width
      var scene = this.$scenes.scenes[userData.sceneNo]
	  
	  // Enlarge nearbySceneNos
	  userData.nearbySceneNos = []
	  if (-1 !== scene.up) {
	    userData.nearbySceneNos.push(scene.up)
		if (-1 !== this.$scenes.scenes[scene.up].left) {
		  userData.nearbySceneNos.push(this.$scenes.scenes[scene.up].left)
		}
		if (-1 !== this.$scenes.scenes[scene.up].right) {
		  userData.nearbySceneNos.push(this.$scenes.scenes[scene.up].right)
		}
	  }
	  if (-1 !== scene.down) {
	    userData.nearbySceneNos.push(scene.down)
		if (-1 !== this.$scenes.scenes[scene.down].left) {
		  userData.nearbySceneNos.push(this.$scenes.scenes[scene.down].left)
		}
		if (-1 !== this.$scenes.scenes[scene.down].right) {
		  userData.nearbySceneNos.push(this.$scenes.scenes[scene.down].right)
		}
	  }
	  if (-1 !== scene.left) {
	    userData.nearbySceneNos.push(scene.left)
      }
	  if (-1 !== scene.right) {
	    userData.nearbySceneNos.push(scene.right)
      }

      // Bottom floor
      for (var i = 0; i < sceneHeight; i++) {
        for (var j = 0; j < sceneWidth; j++) {
          var code = scene.floors[j][i]
		  if (code < 0) {
		    code *= -1
            var offsetX = code % 10
            var offsetY = Math.floor(code / 10) % 100
            this.ctx.drawImage(floors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, i * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, blockSize)
		  }
        }
      }

      // Bottom Decoration
      this.printDecoration(scene.decorations.bottom)

      // Others + Player
      if (this.isDef(userDatas) && !this.isPromise(userDatas)) {
        for (let i = 0; i < userDatas.length; i++) {
          this.printCharacter(userDatas[i], deltaWidth, deltaHeight)
        }
      }

      // Up floor
      for (var i = 0; i < sceneHeight; i++) {
        for (var j = 0; j < sceneWidth; j++) {
          var code = scene.floors[j][i]
		  if (code > 0) {
            var offsetX = code % 10
            var offsetY = Math.floor(code / 10) % 100
            this.ctx.drawImage(floors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, i * blockSize + deltaWidth, j * blockSize + deltaHeight, blockSize, blockSize)
		  }
        }
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
        this.ctx.drawImage(characters, (offsetX + adderX) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        this.ctx.drawImage(eyesImage, (userDataTemp.eyes - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        this.ctx.drawImage(outfits, (offsetX + (outfitNo - 1) * 3) * imageBlockSize, (offsetY + adderY) * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        if (userDataTemp.hairColor == 1) {
          this.ctx.drawImage(hairstyle_black, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        } else if (userDataTemp.hairColor == 2) {
          this.ctx.drawImage(hairstyle_grey, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        } else if (userDataTemp.hairColor == 3) {
          this.ctx.drawImage(hairstyle_orange, (userDataTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
        }
      } else if (userDataTemp.creature == 2) {
        // Display 泡芙
        this.ctx.drawImage(c0, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
      }

      // Show name
      this.ctx.shadowColor = 'black' // 阴影颜色
      this.ctx.shadowBlur = 2 // 阴影模糊范围
      this.ctx.shadowOffsetX = 2
      this.ctx.shadowOffsetY = 2
      this.ctx.textAlign = 'center'
      this.ctx.font = '16px sans-serif'
      this.ctx.fillStyle = document.getElementById('nameColor').value
      this.ctx.fillText(document.getElementById('nickname').value, blockSize / 2, blockSize * 0.12, Math.min(document.documentElement.clientWidth - screenX, blockSize))
      this.ctx.fillStyle = '#000000' // 阴影颜色
      this.ctx.shadowBlur=0 // 阴影模糊范围
      this.ctx.shadowOffsetX=0
      this.ctx.shadowOffsetY=0
      this.ctx.textAlign = 'left'
    },
    printChat () {
      var x = 0
      var y = -avatarSize
      if(this.isDef(messages)) {
        // this.ctx.fillStyle = 'rgba(0,0,0,0.25)'
        // this.ctx.fillRect(screenX, document.documentElement.clientHeight - screenY - messages.length * chatSize + 5, Math.min(document.documentElement.clientWidth, maxMsgLineSize - screenX), chatSize * messages.length)
        for (let i = 0; i < messages.length; i++) {
          this.ctx.shadowColor = 'black' // 阴影颜色
          this.ctx.shadowBlur = 2 // 阴影模糊范围
          this.ctx.shadowOffsetX = 2
          this.ctx.shadowOffsetY = 2
          this.ctx.font = '16px sans-serif'
          this.ctx.fillStyle = '#EEEEEE'
          this.ctx.fillText(messages[messages.length - 1 - i], screenX, document.documentElement.clientHeight - screenY - i * chatSize, Math.min(document.documentElement.clientWidth - screenX, maxMsgLineSize))
          this.ctx.fillStyle = '#000000' // 阴影颜色
          this.ctx.shadowBlur=0 // 阴影模糊范围
          this.ctx.shadowOffsetX=0
          this.ctx.shadowOffsetY=0
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
        document.getElementById('musicAudio').pause()
        document.getElementById('soundAudio').pause()
        this.recordStart()
      } else if (x < avatarSize + 4 * buttonSize && y >= this.ctx.canvas.height - buttonSize) {
        // Settings
        canvasMoveUse = 5
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
      pointerX = x + document.documentElement.scrollLeft - deltaWidth
      pointerY = y + document.documentElement.scrollTop - deltaHeight
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
      userData.playerNextX = userData.playerX
      userData.playerNextY = userData.playerY
      userData.playerSpeedX = 0
      userData.playerSpeedY = 0
      if (canvasMoveUse === 4) {
        setTimeout(() => {
          this.sendVoice(1, '')
          document.getElementById('musicAudio').play()
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
        var deltaX = userData.playerNextX - userData.playerX
        var deltaY = userData.playerNextY - userData.playerY
        // var coeffiecient = acceleration / Math.sqrt((Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        var coeffiecient = 0.05 / Math.sqrt((Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
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
        // Detect edge
        // sharedEdge is used for obstacles, not edge of the canvas map
        var scene = this.$scenes.scenes[userData.sceneNo]
        if (userData.playerSpeedX >= 0) {
          if (userData.playerX + 0.5 + userData.playerSpeedX <= this.$scenes.width &&
          scene.events[Math.max(0, Math.floor(userData.playerY - 0.5 + sharedEdge))][Math.floor(userData.playerX + 0.5 - sharedEdge + userData.playerSpeedX)] !== 1 &&
          scene.events[Math.min(scene.events.length - 1, Math.ceil(userData.playerY - 0.5 - sharedEdge))][Math.floor(userData.playerX + 0.5 - sharedEdge + userData.playerSpeedX)] !== 1) {
            userData.playerX += userData.playerSpeedX
            // Infinitive moving
            userData.playerNextX += userData.playerSpeedX
          } else {
            userData.playerSpeedX = 0
          }
        }
        if (userData.playerSpeedX <= 0) {
          if (userData.playerX - 0.5 + userData.playerSpeedX >= 0 &&
          scene.events[Math.max(0, Math.floor(userData.playerY - 0.5 + sharedEdge))][Math.floor(userData.playerX - 0.5 + sharedEdge + userData.playerSpeedX)] !== 1 &&
          scene.events[Math.min(scene.events.length - 1, Math.ceil(userData.playerY - 0.5 - sharedEdge))][Math.floor(userData.playerX - 0.5 + sharedEdge + userData.playerSpeedX)] !== 1) {
            userData.playerX += userData.playerSpeedX
            // Infinitive moving
            userData.playerNextX += userData.playerSpeedX
          } else {
            userData.playerSpeedX = 0
          }
        }
        if (userData.playerSpeedY >= 0) {
          if (userData.playerY + 0.5 + userData.playerSpeedY <= this.$scenes.height &&
          scene.events[Math.floor(userData.playerY + 0.5 - sharedEdge + userData.playerSpeedY)][Math.max(0, Math.floor(userData.playerX - 0.5 + sharedEdge))] !== 1 &&
          scene.events[Math.floor(userData.playerY + 0.5 - sharedEdge + userData.playerSpeedY)][Math.min(scene.events[0].length - 1, Math.ceil(userData.playerX - 0.5 - sharedEdge))] !== 1) {
            userData.playerY += userData.playerSpeedY
            // Infinitive moving
            userData.playerNextY += userData.playerSpeedY
          } else {
            userData.playerSpeedY = 0
          }
        }
        if (userData.playerSpeedY <= 0) {
          if (userData.playerY - 0.5 + userData.playerSpeedY >= 0 &&
          scene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + userData.playerSpeedY)][Math.max(0, Math.floor(userData.playerX - 0.5 + sharedEdge))] !== 1 &&
          scene.events[Math.floor(userData.playerY - 0.5 + sharedEdge + userData.playerSpeedY)][Math.min(scene.events[0].length - 1, Math.ceil(userData.playerX - 0.5 - sharedEdge))] !== 1) {
            userData.playerY += userData.playerSpeedY
            // Infinitive moving
            userData.playerNextY += userData.playerSpeedY
          } else {
            userData.playerSpeedY = 0
          }
        }
      }
    },
    clear () {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      userData.playerX = this.canvas.width / blockSize / 2
      userData.playerY = this.canvas.height / blockSize / 2
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
      document.getElementById('chat').style.display = 'none'
      document.getElementById('enter').style.display = 'none'
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
    playMusic () {
      var audioObj = document.getElementById("musicAudio")
      audioObj.loop = true
      audioObj.load()
      audioObj.play()
    },
    shutdown () {
      clearInterval(intervalTimer20)
      clearInterval(intervalTimer1000)
      clearInterval(intervalTimer30000)
      // clearTimeout(timeoutTimer300000)
      window.removeEventListener('resize', this.resizeCanvas)
      this.webSocketClose()
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
