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
    </div>
  </div>
</template>

<script>
var canvasSizeX
var canvasSizeY
const canvasMaxSizeX = 1600
const canvasMaxSizeY = 900
const canvasMinSizeX = 10
const canvasMinSizeY = 10
const imageEdge = 50
const stopEdge = 20
let playerX = 100
let playerY = 100
let playerNextX = playerX
let playerNextY = playerY
let pointerX = -1
let pointerY = -1
let playerSpeed = 0
let playerMaxSpeed = 20
// 1-E 2-NE 3-N 4-NW 5-W 6-SW 7-S 8-SE
let playerDirection = 7
export default {
  name: 'World',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus'
    }
  },
  mounted () {
    this.canvas = this.$refs.canvas // 指定canvas
    canvas.addEventListener('contextmenu', function(e){
      e.preventDefault();
    }) // 防止长按复制
    this.ctx = this.canvas.getContext('2d') // 设置2D渲染区域
    this.ctx.lineWidth = 5 // 设置线的宽度
    let timer = setInterval(() => {
      // 需要定时执行的代码
      this.playerMoveFour()
      this.show()
    }, 100)
    this.resizeCanvas()
    window.addEventListener('resize', () => {
      this.resizeCanvas()
    })
  },
  methods: {
    switchTo (path) {
      this.$router.replace(path)
    },
    show () {
      // 显示初始图片
      this.showFloor()
      this.showObject()
      if (pointerX !== -1 && pointerY !== -1) {
        // this.ctx.drawImage(paw, pointerX - imageEdge, pointerY - imageEdge)
      }
    },
    showFloor () {
      var floor = document.getElementById('floor_001')
      for (var i = 0; i < canvasSizeX + imageEdge; i += 100) {
        for (var j = 0; j < canvasSizeY + imageEdge; j += 100) {
          this.ctx.drawImage(floor, i, j)
        }
      }
    },
    showObject () {
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
      var player = document.getElementById(playerStr)
      // console.log(Date.parse(new Date()))
      this.ctx.drawImage(player, playerX - imageEdge, playerY - imageEdge)
    },
    showObject1 () {
    },
    canvasDown (e) {
      this.canvasMoveUse = true
      playerNextX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      playerNextY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop
    },
    canvasMove (e) {
      pointerX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      pointerY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop
      if (this.canvasMoveUse) {
        playerNextX = pointerX
        playerNextY = pointerY
      }
    },
    canvasDownPhone (e) {
      this.canvasMoveUse = true
      playerNextX = e.changedTouches[0].clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      playerNextY = e.changedTouches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
    },
    canvasMovePhone (e) {
      pointerX = e.changedTouches[0].clientX - e.target.offsetLeft + document.documentElement.scrollLeft
      pointerY = e.changedTouches[0].clientY - e.target.offsetTop + document.documentElement.scrollTop
      if (pointerX !== -1 && pointerY !== -1 && this.canvasMoveUse) {
        playerNextX = pointerX
        playerNextY = pointerY
      }
    },
    canvasUp () {
      this.canvasMoveUse = false
      playerNextX = playerX
      playerNextY = playerY
      playerSpeed = 0
    },
    canvasLeave () {
      this.canvasMoveUse = false
      playerNextX = playerX
      playerNextY = playerY
      playerSpeed = 0
    },
    playerMoveFour () {
      var deltaX = playerNextX - playerX
      var deltaY = playerNextY - playerY
      if (Math.pow(deltaX, 2) + Math.pow(deltaY, 2) < Math.pow(stopEdge, 2)) {
        // Set speed
        playerSpeed = 0
      } else {
        // Set speed
        playerSpeed = Math.min(playerSpeed + 1, playerMaxSpeed)
        var coeffiecient = Math.sqrt(Math.pow(playerSpeed, 2) / (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)))
        playerX += deltaX * coeffiecient
        playerY += deltaY * coeffiecient
        // Set direction
        if (deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
          playerDirection = 1
        } else if (deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY)) {
          playerDirection = 5
        } else if (deltaY > 0 && Math.abs(deltaX) < Math.abs(deltaY)) {
          playerDirection = 7
        } else if (deltaY < 0 && Math.abs(deltaX) < Math.abs(deltaY)) {
          playerDirection = 3
        }
      }
    },
    playerMoveEight () {
      var deltaX = playerNextX - playerX
      var deltaY = playerNextY - playerY
      playerSpeed = Math.min(playerSpeed + 1, playerMaxSpeed)
      if (deltaX === 0 && deltaY === 0) {
        playerSpeed = 0
      } else if (deltaY === 0) {
        if (playerX < playerNextX) {
          playerX = Math.min(playerX + playerSpeed, playerNextX)
          playerDirection = 1
        } else {
          playerX = Math.max(playerX - playerSpeed, playerNextX)
          playerDirection = 5
        }
      } else if (deltaX === 0) {
        if (playerY < playerNextY) {
          playerY = Math.min(playerY + playerSpeed, playerNextY)
          playerDirection = 7
        } else {
          playerY = Math.max(playerY - playerSpeed, playerNextY)
          playerDirection = 3
        }
      } else {
        if (playerX < playerNextX) {
          if (playerY < playerNextY) {
            playerX = Math.min(playerX + playerSpeed / 1.414, playerNextX)
            playerY = Math.min(playerY + playerSpeed / 1.414, playerNextY)
            playerDirection = 8
          } else {
            playerX = Math.min(playerX + playerSpeed / 1.414, playerNextX)
            playerY = Math.max(playerY - playerSpeed / 1.414, playerNextY)
            playerDirection = 2
          }
        } else {
          if (playerY < playerNextY) {
            playerX = Math.max(playerX - playerSpeed / 1.414, playerNextX)
            playerY = Math.min(playerY + playerSpeed / 1.414, playerNextY)
            playerDirection = 6
          } else {
            playerX = Math.max(playerX - playerSpeed / 1.414, playerNextX)
            playerY = Math.max(playerY - playerSpeed / 1.414, playerNextY)
            playerDirection = 4
          }
        }
      }
    },
    clear () {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
      playerX = 100
      playerY = 100
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
      canvasSizeY = Math.max(canvasMinSizeY, Math.min(canvasMaxSizeY, document.documentElement.clientHeight - 10))
      this.canvas.height = canvasSizeY
    },
    readTextFile (filePath) {
      fetch(filePath)
        .then(response => response.json())
        .then(jsonResponse => console.log(jsonResponse)) 
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
    .world-canvas{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0px 0px;
    }
    .world-canvas canvas{
        background-color: #e0e3e5;
    }
</style>
