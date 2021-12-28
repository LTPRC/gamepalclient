<template>
  <div class="world">
    <h1>{{ msg }}</h1>

    <div class="sign-canvas">
        <canvas
                id="canvas"
                width="1000"
                height="750"
                @mousedown="canvasDown($event)"
                @mousemove="canvasMove($event)"
                @mouseup="canvasUp()"
                @mouseleave="canvasLeave()"
                ref="canvas"
        >
            抱歉，您的浏览器暂不支持canvas元素
        </canvas>
        <div class="sign-btn">
            <div class="clear" @click="clear">
                清空
            </div>
            <div class="save" @click="save">
                保存
            </div>
        </div>
    </div>
  </div>
</template>

<script>
let that = null;
export default {
  name: 'World',
  data () {
    return {
      msg: 'Welcome to GamePal, Shijiazhuang Plus',
    }
  },
  mounted(){
    this.show();
  },
  methods: {
    switchTo (path) {
      this.$router.replace(path)
    },
    show(){
        this.canvas = this.$refs.canvas;// 指定canvas
        this.ctx = this.canvas.getContext("2d") // 设置2D渲染区域
        this.ctx.lineWidth = 5; // 设置线的宽度
    },
    canvasDown(e) {
        this.canvasMoveUse = true;
        const canvasX = e.clientX - e.target.offsetLeft + document.documentElement.scrollLeft
        const canvasY = e.clientY - e.target.offsetTop + document.documentElement.scrollTop
        this.ctx.beginPath()  // 移动的起点
        this.ctx.moveTo(canvasX, canvasY)
    },
    canvasMove(e) {
        // 只在移动是进行绘制图线
        if (this.canvasMoveUse) {
            const t = e.target;
            let canvasX;
            let canvasY;
            canvasX = e.clientX - t.offsetLeft + document.documentElement.scrollLeft
            canvasY = e.clientY - t.offsetTop + document.documentElement.scrollTop
            this.ctx.lineTo(canvasX, canvasY)
            this.ctx.stroke()
        }
    },
    canvasUp() {
        this.canvasMoveUse = false;
    },
    canvasLeave() {
        this.canvasMoveUse = false;
    },
    clear(){
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    },
    save() {
        const imgBase64 = this.$refs.canvas.toDataURL();
        console.log(imgBase64);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
    .sign-canvas{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 20px 30px;
    }
    .sign-canvas canvas{
        background-color: #e0e3e5;
    }
    .sign-btn {
        display: flex;
        margin:20px 0;
    }
    .sign-btn div {
        width: 175px;
        text-align: center;
        height: 70px;
        line-height: 70px;
        color: #FFFFFF;
    }
    .sign-btn div:active {
        background-color: #CCCCCC;
        color: #333333;
    }
    .sign-btn .clear {
        background-color: #FF8F58;
    }
    .sign-btn .save {
        background-color: #0599D7;
    }
</style>