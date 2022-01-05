<template>
  <div class="world">
    <div class="world-canvas">
        <canvas
            id="canvas"
            @mousedown="canvasDown($event)"
            @mousemove="canvasMove($event)"
            @mouseup="canvasUp()"
            @mouseleave="canvasLeave()"
            @touchstart="canvasDownPhone($event)"
            @touchend="canvasUp()"
            @touchmove="canvasMovePhone($event)"
            ref="canvas"
        >
            抱歉，您的浏览器暂不支持canvas元素
        </canvas>
    </div>

    <div style="display:none">
        <img id="c0" src="../assets/image/characters/c0.png">
        <img id="floors" src="../assets/image/floors.png">
        <img id="decorations" src="../assets/image/decorations.png">
        <img id="doors" src="../assets/image/doors.png">
    </div>
  </div>
</template>

<script>
import scenes from '../../static/scenes.json'
const canvasMaxSizeX = 16
const canvasMaxSizeY = 9
const canvasMinSizeX = 1
const canvasMinSizeY = 1
const stopEdge = 0.2
const sharedEdge = 0.1
let blockSize = 100
const imageBlockSize = 100
var deltaWidth
var deltaHeight

var uuid
var sceneNo
var playerX
var playerY
var playerNextX
var playerNextY
var playerOutfit
var playerSpeed
const playerMaxSpeed = 0.1
const acceleration = 0.01
// 1-E 2-NE 3-N 4-NW 5-W 6-SW 7-S 8-SE
var playerDirection

var positionMap

let pointerX = -1
let pointerY = -1

var intervalTimer100
var intervalTimer250
var intervalTimer1000
var timeoutTimer300000

export default {
  name: 'World',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus',
      api_path: '/api/v1'
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy() {
    clearInterval(intervalTimer100)
    clearInterval(intervalTimer250)
    clearInterval(intervalTimer1000)
    clearTimeout(timeoutTimer300000)
    window.removeEventListener('resize', () => {
      this.resizeCanvas()
    })
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

      // 需要定时执行的代码
      intervalTimer100 = setInterval(() => {
        this.playerMoveFour()
        this.show()
      }, 100)
      intervalTimer250 = setInterval(() => {
        this.setPosition()
        this.getUsersByScene()
      }, 250)
      intervalTimer1000 = setInterval(() => {
        this.checkLogin()
      }, 1000)
      timeoutTimer300000 = setTimeout(() => {
        this.logoff()
      }, 300000)
      window.addEventListener('resize', () => {
        this.resizeCanvas()
      })

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
        })
      }
      //Vue.prototype.$message({
        //message: '请重新登录',
        //type: 'warning'
      //})
    },
    logoff () {
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
        this.playerX = res.data.position.x
        this.playerY = res.data.position.y
        this.playerOutfit = res.data.position.outfit
        this.playerSpeed = res.data.position.speed
        this.playerDirection = res.data.position.direction
      })
      .catch(error => {
        this.sceneNo = 0
        this.playerX = 0
        this.playerY = 0
        this.playerOutfit = 0
        this.playerSpeed = 0
        this.playerDirection = 7
      })
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
    },
    async setPosition() {
	  if (this.playerSpeed <= 0 || this.playerX < 0 || this.playerX > scenes.width || this.playerY < 0 || this.playerY > scenes.height) {
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
          outfit: this.playerOutfit,
          speed: this.playerSpeed,
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
	  console.log(this.playerX+':'+this.playerY)
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
		  console.log(scene.floors[j][i])
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
            this.printCharacter (this.uuid, this.playerX, this.playerY, this.playerOutfit, this.playerSpeed, this.playerDirection, deltaWidth, deltaHeight)
            playerPrinted = true
          }
          this.printCharacter (userPosition.uuid, userPosition.x, userPosition.y, userPosition.outfit, userPosition.speed, userPosition.direction, deltaWidth, deltaHeight)
        }
      }
      if (!playerPrinted) {
        this.printCharacter (this.uuid, this.playerX, this.playerY, this.playerOutfit, this.playerSpeed, this.playerDirection, deltaWidth, deltaHeight)
        playerPrinted = true
      }

      // Up Decoration
	  this.printDecoration(scene.decorations.up)

      //Cursor
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
    printCharacter (uuid, x, y, playerOutfit, playerSpeed, playerDirection, deltaWidth, deltaHeight) {
      // Show individual
      var offsetX
      var offsetY
      if (playerDirection === 1 || playerDirection === 2) {
        offsetY = 2
      } else if (playerDirection === 3 || playerDirection === 4) {
        offsetY = 3
      } else if (playerDirection === 5 || playerDirection === 6) {
        offsetY = 1
      } else if (playerDirection === 7 || playerDirection === 8) {
        offsetY = 0
      }
      var timestamp = (new Date()).valueOf()
      if (playerSpeed > 0 && timestamp % 1000 < 250) {
        offsetX = 0
      } else if (playerSpeed > 0 && timestamp % 1000 >= 500 && timestamp % 1000 < 750) {
        offsetX = 2
      } else {
        offsetX = 1
      }
      this.ctx.drawImage(c0, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize + deltaWidth, (y - 0.5) * blockSize + deltaHeight, blockSize, blockSize)
    },
    canvasDown (e) {
      this.canvasMoveUse = true
      pointerX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft - deltaWidth
      pointerY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop - deltaHeight
      this.playerNextX = pointerX / blockSize
      this.playerNextY = pointerY / blockSize
    },
    canvasMove (e) {
      pointerX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft - deltaWidth
      pointerY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop - deltaHeight
      if (this.canvasMoveUse) {
        this.playerNextX = pointerX / blockSize
        this.playerNextY = pointerY / blockSize
      }
    },
    canvasDownPhone (e) {
      this.canvasMoveUse = true
      pointerX = e.changedTouches[0].clientX - e.target.offsetLeft + document.documentElement.scrollLeft - deltaWidth
      pointerY = e.changedTouches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop - deltaHeight
      this.playerNextX = pointerX / blockSize
      this.playerNextY = pointerY / blockSize
    },
    canvasMovePhone (e) {
      pointerX = e.changedTouches[0].clientX - e.target.offsetLeft + document.documentElement.scrollLeft - deltaWidth
      pointerY = e.changedTouches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop - deltaHeight
      if (pointerX !== -1 && pointerY !== -1 && this.canvasMoveUse) {
        this.playerNextX = pointerX / blockSize
        this.playerNextY = pointerY / blockSize
      }
    },
    canvasUp () {
      this.canvasMoveUse = false
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
      this.playerSpeed = 0.0
    },
    canvasLeave () {
      this.canvasMoveUse = false
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
      this.playerSpeed = 0.0
    },
    playerMoveFour () {
      var deltaX = this.playerNextX - this.playerX
      var deltaY = this.playerNextY - this.playerY
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(stopEdge, 2)) {
        // Set speed
        this.playerSpeed = 0.0
      } else {
	    this.keepActive()
        // Set speed
        this.playerSpeed = Math.min(this.playerSpeed + acceleration, playerMaxSpeed)
        var coeffiecient = Math.sqrt(Math.pow(this.playerSpeed, 2) / (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        // Set direction
        if (deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
          this.playerDirection = 1
        } else if (deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
          this.playerDirection = 5
        } else if (deltaY > 0 && Math.abs(deltaX) < Math.abs(deltaY)) {
          this.playerDirection = 7
        } else if (deltaY < 0 && Math.abs(deltaX) < Math.abs(deltaY)) {
          this.playerDirection = 3
        }
        // Detect edge
		// sharedEdge is used for obstacles, not edge of the canvas map
        var scene = scenes.scenes[this.sceneNo]
		this.playerX += deltaX * coeffiecient
		if (deltaX > 0 && (this.playerX + 0.5 >= scene.width || scene.events[Math.max(0, Math.floor(this.playerY - 0.5 + sharedEdge))][Math.floor(this.playerX + 0.5 - sharedEdge)] === 1 || scene.events[Math.min(scene.events.length - 1, Math.ceil(this.playerY - 0.5 - sharedEdge))][Math.floor(this.playerX + 0.5 - sharedEdge)] === 1)) {
		    this.playerX = Math.floor(this.playerX) + 0.5
		}
		if (deltaX < 0 && (this.playerX - 0.5 <= 0 || scene.events[Math.max(0, Math.floor(this.playerY - 0.5 + sharedEdge))][Math.floor(this.playerX - 0.5 + sharedEdge)] === 1 || scene.events[Math.min(scene.events.length - 1, Math.ceil(this.playerY - 0.5 - sharedEdge))][Math.floor(this.playerX - 0.5 + sharedEdge)] === 1)) {
			this.playerX = Math.ceil(this.playerX) - 0.5
		}
		this.playerY += deltaY * coeffiecient
		if (deltaY > 0 && (this.playerY + 0.5 >= scene.height || scene.events[Math.floor(this.playerY + 0.5 - sharedEdge)][Math.max(0, Math.floor(this.playerX - 0.5 + sharedEdge))] === 1 || scene.events[Math.floor(this.playerY + 0.5 - sharedEdge)][Math.min(scene.events[0].length - 1, Math.ceil(this.playerX - 0.5 - sharedEdge))] === 1)) {
		    this.playerY = Math.floor(this.playerY) + 0.5
		}
		if (deltaY < 0 && (this.playerY - 0.5 <= 0 || scene.events[Math.floor(this.playerY - 0.5 + sharedEdge)][Math.max(0, Math.floor(this.playerX - 0.5 + sharedEdge))] === 1 || scene.events[Math.floor(this.playerY - 0.5 + sharedEdge)][Math.min(scene.events[0].length - 1, Math.ceil(this.playerX - 0.5 - sharedEdge))] === 1)) {
			this.playerY = Math.ceil(this.playerY) - 0.5
		}
      }
    },
	keepActive() {
	  clearTimeout(timeoutTimer300000)
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
    *{
        -webkit-touch-callout:none; /*系统默认菜单被禁用*/
        -webkit-user-select:none; /*webkit浏览器*/
        -khtml-user-select:none; /*早期浏览器*/
        -moz-user-select:none;/*火狐*/
        -ms-user-select:none; /*IE10*/
        user-select:none;
    }
    .world-canvas{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0px 0px;
    }
    .world-canvas canvas{
        background-color: #000000;
    }
</style>
