// draw.js
const HEAD_BODY_RATIO = 0.32
const WAIST_BODY_RATIO = 0.6
const STATUS_DISPLAY_DISTANCE_ADDER = 0.7

const BUFF_CODE_DEAD = 1

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
  drawCharacter(context, x, y, deltaWidth, deltaHeight, avatarSize, imageBlockSize, blockSize, upLeftPoint, downRightPoint, coefs,
    userCode, playerInfoTemp, relations,
    avatarsImage, bodiesImage, armsImage, eyesImage, hairstylesImage, toolsImage, outfitsImage, outfitArmsImage, animalsImage) {
    // Draw shadow
    context.save()
    context.beginPath()
    context.fillStyle = 'rgba(31, 31, 31, 0.25)'
    context.ellipse((x + 0.5) * blockSize + deltaWidth, (y+ 0.9) * blockSize + deltaHeight,
    blockSize * 0.2, blockSize * 0.1, 0, 0, 2 * Math.PI)
    context.fill()
    context.restore()

    if (this.isDef(playerInfoTemp.buff) && playerInfoTemp.buff[BUFF_CODE_DEAD] !== 0) {
      return
    }

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
    if (playerInfoTemp.creature == 1) {
      // Display RPG character
      var upOffsetX = offsetX
      if (this.isDef(playerInfoTemp.tools) && playerInfoTemp.tools.length > 0) {
        upOffsetX = 1
      }
      if (playerInfoTemp.gender == 2) {
        offsetX += 3
        upOffsetX += 3
      }
      // Draw tool (back side)
      if (offsetY === 1 || offsetY === 3) {
        for (var toolIndex in playerInfoTemp.tools) {
          context.drawImage(toolsImage[playerInfoTemp.tools[toolIndex]], 0, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
          x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
        }
      }
      // Draw head
      this.drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, coefs, offsetY, playerInfoTemp, eyesImage, hairstylesImage)
      // Draw body (down)
      context.drawImage(bodiesImage[Number(playerInfoTemp.skinColor) - 1], offsetX * imageBlockSize, (WAIST_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (1 - WAIST_BODY_RATIO) * imageBlockSize, 
      x * blockSize + deltaWidth, (WAIST_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (1 - WAIST_BODY_RATIO) * blockSize)
      // Draw body (up)
      context.drawImage(bodiesImage[Number(playerInfoTemp.skinColor) - 1], upOffsetX * imageBlockSize, (HEAD_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (WAIST_BODY_RATIO - HEAD_BODY_RATIO) * imageBlockSize, 
      x * blockSize + deltaWidth, (HEAD_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (WAIST_BODY_RATIO - HEAD_BODY_RATIO) * blockSize)
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (var outfitIndex in playerInfoTemp.outfits) {
          // Draw outfit (down)
          context.drawImage(outfitsImage[playerInfoTemp.outfits[outfitIndex]], offsetX * imageBlockSize, (WAIST_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (1 - WAIST_BODY_RATIO) * imageBlockSize, 
          x * blockSize + deltaWidth, (WAIST_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (1 - WAIST_BODY_RATIO) * blockSize)
          // Draw outfit (up)
          context.drawImage(outfitsImage[playerInfoTemp.outfits[outfitIndex]], upOffsetX * imageBlockSize, (HEAD_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (WAIST_BODY_RATIO - HEAD_BODY_RATIO) * imageBlockSize, 
          x * blockSize + deltaWidth, (HEAD_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (WAIST_BODY_RATIO - HEAD_BODY_RATIO) * blockSize)
        }
      }
      // Draw tool (front side)
      if (offsetY !== 1 && offsetY !== 3) {
        for (toolIndex in playerInfoTemp.tools) {
          context.drawImage(toolsImage[playerInfoTemp.tools[toolIndex]], 0, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
          x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
        }
      }
      // Draw arm (front side)
      context.drawImage(armsImage[Number(playerInfoTemp.skinColor) - 1], upOffsetX * imageBlockSize, (HEAD_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (1 - HEAD_BODY_RATIO) * imageBlockSize, 
      x * blockSize + deltaWidth, (HEAD_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (1 - HEAD_BODY_RATIO) * blockSize)
      // Draw arm outfit (front side)
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (outfitIndex in playerInfoTemp.outfits) {
          context.drawImage(outfitArmsImage[playerInfoTemp.outfits[outfitIndex]], upOffsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
          x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
        }
      }
      // Draw outfit
      
    } else if (playerInfoTemp.creature == 2) {
      // Display animals
      if (Number(playerInfoTemp.skinColor) !== 0) {
        context.drawImage(animalsImage[Number(playerInfoTemp.skinColor) - 1], offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
        x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
      }
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
    context.drawImage(avatarsImage, playerInfoTemp.avatar % 10 * avatarSize, Math.floor(playerInfoTemp.avatar / 10) * avatarSize, 
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
      this.printText(context, playerInfoTemp.nickname, (x + 0.5) * blockSize + deltaWidth, 
      (y - 0.5 + 0.12 - 0.5 + STATUS_DISPLAY_DISTANCE_ADDER) * blockSize + deltaHeight,
      blockSize * 0.5, 
      'center')
    }
  },
  drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, coefs, offsetY, playerInfoTemp, eyesImage, hairstylesImage) {
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
        context.strokeStyle = 'rgba(169, 100, 55, 1)'
        context.fillStyle = 'rgba(252, 224, 206, 1)'
        break
      case 2:
        context.strokeStyle = 'rgba(150, 75, 31, 1)'
        context.fillStyle = 'rgba(249, 193, 157, 1)'
        break
      case 3:
        context.strokeStyle = 'rgba(153, 91, 35, 1)'
        context.fillStyle = 'rgba(233, 202, 175, 1)'
        break
      case 4:
        context.strokeStyle = 'rgba(80, 21, 0, 1)'
        context.fillStyle = 'rgba(186, 137, 97, 1)'
        break
      case 5:
        context.strokeStyle = 'rgba(64, 31, 14, 1)'
        context.fillStyle = 'rgba(119, 85, 52, 1)'
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
    
    if (playerInfoTemp.hairColor !== 0) {
      context.drawImage(hairstylesImage[playerInfoTemp.hairColor - 1], (playerInfoTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
      upLeftPoint.x, upLeftPoint.y - blockSize * 0.4, blockSize, blockSize)
    }
  },
  isDef (v) {
    return v !== undefined && v !== null
  },
};