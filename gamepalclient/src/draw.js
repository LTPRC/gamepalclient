// draw.js
export function drawMethod() {
  // 你的全局方法实现
}

  // 或者如果有多个方法
export const drawMethods = {
  printText(context, content, x, y, maxWidth, textAlign) {
    context.save()
    context.textAlign = textAlign
    context.shadowColor = 'black' // 阴影颜色
    context.shadowBlur = 2 // 阴影模糊范围
    context.shadowOffsetX = 2
    context.shadowOffsetY = 2
    context.font = '16px sans-serif'
    context.fillStyle = '#EEEEEE'
    context.fillText(content, x, y, maxWidth)
    context.restore()
  },
  drawCharacter(context, upLeftPoint, downRightPoint) {
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    // let circles = [
    //   { x: 200, y: 100, r: 100 },
    //   { x: 100, y: 200, r: 100 },
    //   { x: 200, y: 300, r: 100 },
    //   { x: 300, y: 200, r: 100 }
    // ];
    this.drawHead(context, 
      {x: upLeftPoint.x + width * 0.25, y: upLeftPoint.y}, 
      {x: upLeftPoint.x + width * 0.75, y: upLeftPoint.y + height * 0.5},
      [0.5, 0.5, 0.5, 0.5, 0.5])
    // drawFigure(context, )
  },
  drawHead(context, upLeftPoint, downRightPoint, coefs) {
    // coefs: 头顶高度系数 额头弧度系数 颧骨宽度系数 脸颊弧度系数 下颚高度系数
    // 头型
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    var headUpPoint = {x: upLeftPoint.x + width * 0.5, y: upLeftPoint.y + (1 - coefs[0]) * height * 0.5}
    var headLeftPoint = {x: upLeftPoint.x + (1 - coefs[2]) * width * 0.5, y: upLeftPoint.y + height * 0.5}
    var headDownPoint = {x: upLeftPoint.x + width * 0.5, y: upLeftPoint.y + (1 + coefs[0]) * height * 0.5}
    var headRightPoint = {x: upLeftPoint.x + (1 + coefs[2]) * width * 0.5, y: upLeftPoint.y + height * 0.5}
    var radiusUp = Math.sqrt(Math.pow(headUpPoint.x - headLeftPoint.x, 2) + Math.pow(headUpPoint.y - headLeftPoint.y, 2), 2)
    var radiusDown = Math.sqrt(Math.pow(headDownPoint.x - headLeftPoint.x, 2) + Math.pow(headDownPoint.y - headLeftPoint.y, 2), 2)
    context.strokeStyle = 'rgba(255, 255, 191, 0.5)'
    context.fillStyle = 'rgba(191, 191, 127, 1)'
    context.beginPath();
    context.moveTo(headUpPoint.x, headUpPoint.y)
    context.arcTo(headUpPoint.x, headUpPoint.y, headLeftPoint.x, headLeftPoint.y, radiusUp);
    context.arcTo(headLeftPoint.x, headLeftPoint.y, headDownPoint.x, headDownPoint.y, radiusDown);
    context.arcTo(headDownPoint.x, headDownPoint.y, headRightPoint.x, headRightPoint.y, radiusDown);
    context.arcTo(headRightPoint.x, headRightPoint.y, headUpPoint.x, headUpPoint.y, radiusUp);
    context.closePath()
    context.fill()
    context.stroke()
    console.log(headUpPoint.x+':'+headUpPoint.y)
    console.log(headLeftPoint.x+':'+headLeftPoint.y)
    console.log(headDownPoint.x+':'+headDownPoint.y)
    // 眉毛眼睛、鼻子、嘴巴、头发、帽子
  }
  // drawFigure(context, x1, x2, y1, y2) {
  // }
};