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
const wallEdge = 0.5
let blockSize = 50
const imageBlockSize = 100

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

export default {
  name: 'World',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus',
      api_path: '/api/v1'
    }
  },
  created() {
    window.addEventListener('beforeunload', (event) => {
      // Cancel the event as stated by the standard.
      event.preventDefault()
      // Chrome requires returnValue to be set.
      event.returnValue = ''
      this.logoff()
    })
  },
  mounted () {
    this.checkLogin() //还不能被新的登录踢掉
    this.init()

    // 需要定时执行的代码
    const timer100 = setInterval(() => {
      this.playerMoveFour()
      this.show()
    }, 100)
    const timer1000 = setInterval(() => {
      if (this.playerSpeed > 0) {
        this.setPosition()
      }
      this.getUsersByScene()
    }, 1000)
    window.addEventListener('resize', () => {
      this.resizeCanvas()
    })
  },
  methods: {
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
            }
        })
        .catch(error => {
          this.switchTo ('/')
        })
      }
      //Vue.prototype.$message({
        //message: '请重新登录',
        //type: 'warning'
      //})
    },
    logoff () {
      if (sessionStorage['token'] !== null) {
        var token = sessionStorage['token'].substr(1, sessionStorage['token'].length - 2)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uuid: this.uuid, token: token })
        }
        this.$axios.post(this.api_path + "/logoff", requestOptions)
      }
    },
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

      // Extra once
      await this.getPosition()
      await this.getUsersByScene()
      await this.setPosition()
      this.resizeCanvas()
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
      if (!this.isDef(this.sceneNo)) {
        return
      }
      var floors = document.getElementById('floors')
      var decorations = document.getElementById('decorations')
      var doors = document.getElementById('doors')
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

      // Floor
      var scene = scenes.scenes[this.sceneNo]
      for (var i = 0; i < scene.height; i++) {
        for (var j = 0; j < scene.width; j++) {
          var code = scene.floors[j][i]
          var offsetX = code % 10
          var offsetY = Math.floor(code / 10) % 100
          this.ctx.drawImage(floors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, i * blockSize, j * blockSize, blockSize, blockSize)
        }
      }

      // Others + Player
      var playerPrinted = false
      if (this.isDef(this.positionMap) && !this.isPromise(this.positionMap)) {
        for (let i = 0; i < this.positionMap.length; i++) {
          var userPosition = this.positionMap[i]
          if (!playerPrinted && userPosition.y > this.playerY) {
            this.printCharacter (this.uuid, this.playerX, this.playerY, this.playerOutfit, this.playerSpeed, this.playerDirection)
            playerPrinted = true
          }
          this.printCharacter (userPosition.uuid, userPosition.x, userPosition.y, userPosition.outfit, userPosition.speed, userPosition.direction)
        }
      }
      if (!playerPrinted) {
        this.printCharacter (this.uuid, this.playerX, this.playerY, this.playerOutfit, this.playerSpeed, this.playerDirection)
        playerPrinted = true
      }
      
      // Decoration
      for (var i = 0; i < scene.decorations.length; i++) {
        var decoration = scene.decorations[i]
        var code = decoration.code
        if (Math.floor(code / 1000) == 1) {
          // Decoration
          var offsetX = code % 10
          var offsetY = Math.floor(code / 10) % 100
          this.ctx.drawImage(decorations, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize, decoration.y * blockSize, blockSize, blockSize)
        } else if (Math.floor(code / 1000) == 2) {
          // Door
          var offsetX = code % 10
          var offsetY = Math.floor(code / 10) % 100 * 4
          this.ctx.drawImage(doors, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, decoration.x * blockSize, decoration.y * blockSize, blockSize, blockSize)
        }
      }

      //Cursor
      if (pointerX !== -1 && pointerY !== -1) {
        // this.ctx.drawImage(paw, pointerX - blockSize, pointerY - blockSize)
      }
    },
    printCharacter (uuid, x, y, playerOutfit, playerSpeed, playerDirection) {
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
      this.ctx.drawImage(c0, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, (x - 0.5) * blockSize, (y - 0.5) * blockSize, blockSize, blockSize)
    },
    canvasDown (e) {
      this.canvasMoveUse = true
      pointerX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      pointerY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop
      this.playerNextX = pointerX / blockSize
      this.playerNextY = pointerY / blockSize
    },
    canvasMove (e) {
      pointerX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      pointerY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop
      if (this.canvasMoveUse) {
        this.playerNextX = pointerX / blockSize
        this.playerNextY = pointerY / blockSize
      }
    },
    canvasDownPhone (e) {
      this.canvasMoveUse = true
      pointerX = e.changedTouches[0].clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      pointerY = e.changedTouches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
      this.playerNextX = pointerX / blockSize
      this.playerNextY = pointerY / blockSize
    },
    canvasMovePhone (e) {
      pointerX = e.changedTouches[0].clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      pointerY = e.changedTouches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
      if (pointerX !== -1 && pointerY !== -1 && this.canvasMoveUse) {
        this.playerNextX = pointerX / blockSize
        this.playerNextY = pointerY / blockSize
      }
    },
    canvasUp () {
      this.canvasMoveUse = false
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
      this.playerSpeed -= acceleration
    },
    canvasLeave () {
      this.canvasMoveUse = false
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
      this.playerSpeed -= acceleration
    },
    playerMoveFour () {
      var deltaX = this.playerNextX - this.playerX
      var deltaY = this.playerNextY - this.playerY
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(stopEdge, 2)) {
        // Set speed
        this.playerSpeed = 0.0
      } else {
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
        var scene = scenes.scenes[this.sceneNo]
		this.playerX += deltaX * coeffiecient
		if (deltaX > 0) {
		console.log(Math.floor(this.playerX + wallEdge))
		console.log(Math.floor(this.playerY))
		    if (this.playerX + wallEdge >= scene.width || scene.events[Math.floor(this.playerY)][Math.floor(this.playerX + wallEdge)] == 1 || scene.events[Math.ceil(this.playerY)][Math.floor(this.playerX + wallEdge)] == 1) {
			    this.playerX = Math.floor(this.playerX + wallEdge) - wallEdge
			}
		} else {
		    if (this.playerX - wallEdge <= 0 || scene.events[Math.floor(this.playerY)][Math.floor(this.playerX - wallEdge)] == 1 || scene.events[Math.ceil(this.playerY)][Math.floor(this.playerX - wallEdge)] == 1) {
			    this.playerX = Math.ceil(this.playerX - wallEdge) + wallEdge
			}
		}
		this.playerY += deltaY * coeffiecient
		if (deltaY > 0) {
		    if (this.playerY + wallEdge >= scene.height || scene.events[Math.floor(this.playerY + wallEdge)][Math.floor(this.playerX)] == 1 || scene.events[Math.floor(this.playerY + wallEdge)][Math.ceil(this.playerX)] == 1) {
			    this.playerY = Math.floor(this.playerY + wallEdge) - wallEdge
			}
		} else {
		    if (this.playerY - wallEdge <= 0 || scene.events[Math.floor(this.playerY - wallEdge)][Math.floor(this.playerX)] == 1 || scene.events[Math.floor(this.playerY - wallEdge)][Math.ceil(this.playerX)] == 1) {
			    this.playerY = Math.ceil(this.playerY - wallEdge) + wallEdge
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
