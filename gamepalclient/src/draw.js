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
  drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, coefs, offsetY, playerInfoTemp, eyesImage, hairstyle_black, hairstyle_grey, hairstyle_orange) {
    // upLeftPoint: 整个身体的左上角
    // downRightPoint: 整个身体的右下角
    // coefs: 头顶高度系数 额头弧度系数 颧骨宽度系数 脸颊弧度系数 下颚高度系数
    // 头型
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    var centerHeadPoint = {x: upLeftPoint.x + width * 0.5, y: upLeftPoint.y + height * 0.15}
    var UpLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * (1 + (coefs[2] - 0.5)), y: centerHeadPoint.y - height * 0.12 * (1 + (coefs[0] - 0.5))}
    var DownLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * (1 + (coefs[3] - 0.5)), y: centerHeadPoint.y + height * 0.12 * (1 + (coefs[1] - 0.5))}
    var DownRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * (1 + (coefs[3] - 0.5)), y: centerHeadPoint.y + height * 0.12 * (1 + (coefs[1] - 0.5))}
    var UpRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * (1 + (coefs[2] - 0.5)), y: centerHeadPoint.y - height * 0.12 * (1 + (coefs[0] - 0.5))}
    var leftControlPoint = {x: UpLeftHeadPoint.x - width * (coefs[5] - 0.5), y: centerHeadPoint.y}
    var downControlPoint = {x: centerHeadPoint.x, y: DownLeftHeadPoint.y + height * (coefs[6] - 0.5)}
    var rightControlPoint = {x: UpRightHeadPoint.x + width * (coefs[5] - 0.5), y: centerHeadPoint.y}
    var upControlPoint = {x: centerHeadPoint.x, y: UpLeftHeadPoint.y - height * (coefs[4] - 0.5)}
    switch (Number(playerInfoTemp.skinColor)) {
      case 1:
        context.strokeStyle = 'rgba(150, 75, 31, 1)'
        context.fillStyle = 'rgba(249, 193, 157, 1)'
        break
      case 2:
        context.strokeStyle = 'rgba(169, 100, 55, 1)'
        context.fillStyle = 'rgba(252, 224, 206, 1)'
        break
      case 3:
        context.strokeStyle = 'rgba(80, 21, 0, 1)'
        context.fillStyle = 'rgba(186, 137, 97, 1)'
        break
      case 4:
        context.strokeStyle = 'rgba(64, 31, 14, 1)'
        context.fillStyle = 'rgba(119, 75, 41, 1)'
        break
    }
    var neckWidth = width * 0.10
    var neckHeight = height * 0.08
    context.beginPath()
    context.fillRect(centerHeadPoint.x - neckWidth / 2, DownLeftHeadPoint.y, neckWidth, neckHeight)
    context.closePath()
    context.fill()
    context.beginPath()
    context.moveTo(UpLeftHeadPoint.x, UpLeftHeadPoint.y)
    context.quadraticCurveTo(leftControlPoint.x, leftControlPoint.y, DownLeftHeadPoint.x, DownLeftHeadPoint.y)
    context.quadraticCurveTo(downControlPoint.x, downControlPoint.y, DownRightHeadPoint.x, DownRightHeadPoint.y)
    context.quadraticCurveTo(rightControlPoint.x, rightControlPoint.y, UpRightHeadPoint.x, UpRightHeadPoint.y)
    context.quadraticCurveTo(upControlPoint.x, upControlPoint.y, UpLeftHeadPoint.x, UpLeftHeadPoint.y)
    context.closePath()
    context.fill()
    context.stroke()
    // 眉毛眼睛、鼻子、嘴巴、头发、帽子
    switch(offsetY) {
      case 0:
        context.drawImage(eyesImage, (Number(playerInfoTemp.eyes) - 1) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
        centerHeadPoint.x - blockSize / 8, centerHeadPoint.y - blockSize / 8, blockSize / 8, blockSize / 4)
        context.drawImage(eyesImage, ((Number(playerInfoTemp.eyes) - 1) + 0.5) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
        centerHeadPoint.x, centerHeadPoint.y - blockSize / 8, blockSize / 8, blockSize / 4)
        break
      case 1:
        context.drawImage(eyesImage, ((Number(playerInfoTemp.eyes) - 1) + 0.5) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
        centerHeadPoint.x - blockSize / 8, centerHeadPoint.y - blockSize / 8, blockSize / 8, blockSize / 4)
        break
      case 2:
        context.drawImage(eyesImage, (Number(playerInfoTemp.eyes) - 1) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
        centerHeadPoint.x, centerHeadPoint.y - blockSize / 8, blockSize / 8, blockSize / 4)
        break
    }
    
    var img
    if (playerInfoTemp.hairColor == 1) {
      img = hairstyle_black
    } else if (playerInfoTemp.hairColor == 2) {
      img = hairstyle_grey
    } else if (playerInfoTemp.hairColor == 3) {
      img = hairstyle_orange
    }
    context.drawImage(img, (playerInfoTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
    upLeftPoint.x, upLeftPoint.y - blockSize * 0.25, blockSize, blockSize)
  }
  // drawFigure(context, x1, x2, y1, y2) {
  // }
};