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
        <img id="paw" src="../assets/image/paw.png">
        <img id="floor_001" src="../assets/image/blocks/floor_001.png">
        <img id="c0111" src="../assets/image/players/c0111.png">
        <img id="c0112" src="../assets/image/players/c0112.png">
        <img id="c0113" src="../assets/image/players/c0113.png">
        <img id="c0121" src="../assets/image/players/c0121.png">
        <img id="c0122" src="../assets/image/players/c0122.png">
        <img id="c0123" src="../assets/image/players/c0123.png">
        <img id="c0131" src="../assets/image/players/c0131.png">
        <img id="c0132" src="../assets/image/players/c0132.png">
        <img id="c0133" src="../assets/image/players/c0133.png">
        <img id="c0141" src="../assets/image/players/c0141.png">
        <img id="c0142" src="../assets/image/players/c0142.png">
        <img id="c0143" src="../assets/image/players/c0143.png">
        <img id="c0211" src="../assets/image/players/c0211.png">
        <img id="c0212" src="../assets/image/players/c0212.png">
        <img id="c0213" src="../assets/image/players/c0213.png">
        <img id="c0221" src="../assets/image/players/c0221.png">
        <img id="c0222" src="../assets/image/players/c0222.png">
        <img id="c0223" src="../assets/image/players/c0223.png">
        <img id="c0231" src="../assets/image/players/c0231.png">
        <img id="c0232" src="../assets/image/players/c0232.png">
        <img id="c0233" src="../assets/image/players/c0233.png">
        <img id="c0241" src="../assets/image/players/c0241.png">
        <img id="c0242" src="../assets/image/players/c0242.png">
        <img id="c0243" src="../assets/image/players/c0243.png">
        <img id="floors" src="../assets/image/floors.png">
        <img id="decorations" src="../assets/image/decorations.png">
        <img id="doors" src="../assets/image/doors.png">
    </div>
  </div>
</template>

<script>
import scenes from '../../static/scenes.json'
var canvasSizeX
var canvasSizeY
const canvasMaxSizeX = 1600
const canvasMaxSizeY = 900
const canvasMinSizeX = 10
const canvasMinSizeY = 10
const blockSize = 100
const stopEdge = 20

var uuid
var sceneNo
var playerX
var playerY
var playerNextX
var playerNextY
var playerOutfit
var playerSpeed
const playerMaxSpeed = 20
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
        this.playerX = 300
        this.playerY = 300
        this.playerOutfit = 101
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
            x: Math.floor(this.playerX), // 向下取整
            y: Math.floor(this.playerY), // 向下取整
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
          var code = scene.floors[i][j]
          var offsetX = code % 10
          var offsetY = Math.floor(code / 10) % 100
          this.ctx.drawImage(floors, offsetX * blockSize, offsetY * blockSize, blockSize, blockSize, i * blockSize, j * blockSize, blockSize, blockSize)
        }
      }

      // Others + Player
      var playerPrinted = false
      if (this.isDef(this.positionMap) && !this.isPromise(this.positionMap)) {
        for (let i = 0; i < this.positionMap.length; i++) {
          var userPosition = this.positionMap[i]
          if (!playerPrinted && y > this.playerY) {
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
          this.ctx.drawImage(decorations, offsetX * blockSize, offsetY * blockSize, blockSize, blockSize, decoration.x, decoration.y, blockSize, blockSize)
        } else if (Math.floor(code / 1000) == 2) {
          // Door
          var offsetX = code % 10
          var offsetY = Math.floor(code / 10) % 100
          this.ctx.drawImage(doors, offsetX * blockSize, offsetY * blockSize, blockSize, blockSize, decoration.x * blockSize, decoration.y * blockSize, blockSize, blockSize)
        }
      }

      //Cursor
      if (pointerX !== -1 && pointerY !== -1) {
        // this.ctx.drawImage(paw, pointerX - blockSize, pointerY - blockSize)
      }
    },
    printCharacter (uuid, x, y, playerOutfit, playerSpeed, playerDirection) {
      // Show individual
      var playerStr = 'c02'
      if (playerDirection === 1 || playerDirection === 2) {
        playerStr += '3'
      } else if (playerDirection === 3 || playerDirection === 4) {
        playerStr += '4'
      } else if (playerDirection === 5 || playerDirection === 6) {
        playerStr += '2'
      } else if (playerDirection === 7 || playerDirection === 8) {
        playerStr += '1'
      }
      var timestamp = (new Date()).valueOf()
      if (playerSpeed > 0 && timestamp % 1000 < 250) {
        playerStr += '1'
      } else if (playerSpeed > 0 && timestamp % 1000 >= 500 && timestamp % 1000 < 750) {
        playerStr += '3'
      } else {
        playerStr += '2'
      }
      var character = document.getElementById(playerStr)
      this.ctx.drawImage(character, x - blockSize, y - blockSize)
    },
    canvasDown (e) {
      this.canvasMoveUse = true
      this.playerNextX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      this.playerNextY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop
    },
    canvasMove (e) {
      pointerX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      pointerY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop
      if (this.canvasMoveUse) {
        this.playerNextX = pointerX
        this.playerNextY = pointerY
      }
    },
    canvasDownPhone (e) {
      this.canvasMoveUse = true
      this.playerNextX = e.changedTouches[0].clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      this.playerNextY = e.changedTouches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
    },
    canvasMovePhone (e) {
      pointerX = e.changedTouches[0].clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      pointerY = e.changedTouches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
      if (pointerX !== -1 && pointerY !== -1 && this.canvasMoveUse) {
        this.playerNextX = pointerX
        this.playerNextY = pointerY
      }
    },
    canvasUp () {
      this.canvasMoveUse = false
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
      this.playerSpeed = 0
    },
    canvasLeave () {
      this.canvasMoveUse = false
      this.playerNextX = this.playerX
      this.playerNextY = this.playerY
      this.playerSpeed = 0
    },
    playerMoveFour () {
      var deltaX = this.playerNextX - this.playerX
      var deltaY = this.playerNextY - this.playerY
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(stopEdge, 2)) {
        // Set speed
        this.playerSpeed = 0
      } else {
        // Set speed
        this.playerSpeed = Math.min(this.playerSpeed + 1, playerMaxSpeed)
        var coeffiecient = Math.sqrt(Math.pow(this.playerSpeed, 2) / (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        
        this.playerX += deltaX * coeffiecient
        this.playerY += deltaY * coeffiecient
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
      }
    },
    clear () {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      this.playerX = 100
      this.playerY = 100
      this.show()
    },
    save () {
      const imgBase64 = this.$refs.canvas.toDataURL()
      // console.log(imgBase64)
    },
    resizeCanvas () {
      this.canvas = this.$refs.canvas // 指定canvas
      canvasSizeX = Math.max(canvasMinSizeX, Math.min(canvasMaxSizeX, document.documentElement.clientWidth))
      this.canvas.width = canvasSizeX
      canvasSizeY = Math.max(canvasMinSizeY, Math.min(canvasMaxSizeY, document.documentElement.clientHeight))
      this.canvas.height = canvasSizeY
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
