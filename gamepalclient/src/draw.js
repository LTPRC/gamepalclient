// draw.js

export function drawMethod() {
  // 你的全局方法实现
}

// 或者如果有多个方法
export const drawMethods = {
  printText (context, content, x, y, maxWidth, textAlign) {
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
  drawCharacter (constants, context, tempCanvas, x, y, deltaWidth, deltaHeight, avatarSize, imageBlockSize, blockSize, defaultBlockSize,
      upLeftPoint, downRightPoint,
      userCode, playerInfoTemp, relations, avatarIndex,
      avatarsImage, bodiesImage, armsImage, eyesImage, hairstylesImage, toolsImage, outfitsImage, animalsImage) {

    var isSwimming = this.isDef(playerInfoTemp.floorCode) && playerInfoTemp.floorCode == 1018
    // Draw shadow
    if (!isSwimming) {
      context.save()
      context.beginPath()
      context.fillStyle = 'rgba(31, 31, 31, 0.25)'
      context.ellipse((x + 0.5) * blockSize + deltaWidth, (y+ 0.9) * blockSize + deltaHeight,
      blockSize * 0.2, blockSize * 0.1, 0, 0, 2 * Math.PI)
      context.fill()
      context.restore()
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
    // Check death 24/05/09
    if (this.isDef(playerInfoTemp.buff) && playerInfoTemp.buff[constants.BUFF_CODE_DEAD] !== 0) {
      return
    }
    if (playerInfoTemp.creatureType == 1) {
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
          this.drawTool(context, x, y, imageBlockSize, blockSize, playerInfoTemp.tools[toolIndex], offsetY, deltaWidth, deltaHeight, toolsImage)
        }
      }
      // Draw head
      this.drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, eyesImage, hairstylesImage)
      // Draw body (down)
      if (!isSwimming) {
        context.drawImage(bodiesImage[playerInfoTemp.skinColor - 1], offsetX * imageBlockSize, (constants.WAIST_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (1 - constants.WAIST_BODY_RATIO) * imageBlockSize, 
        x * blockSize + deltaWidth, (constants.WAIST_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (1 - constants.WAIST_BODY_RATIO) * blockSize)
      }
      // Draw body (up)
      context.drawImage(bodiesImage[playerInfoTemp.skinColor - 1], upOffsetX * imageBlockSize, (constants.HEAD_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (constants.WAIST_BODY_RATIO - constants.HEAD_BODY_RATIO) * imageBlockSize, 
      x * blockSize + deltaWidth, (constants.HEAD_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (constants.WAIST_BODY_RATIO - constants.HEAD_BODY_RATIO) * blockSize)
      // Draw underwear
      this.drawOutfits(context, tempCanvas, outfitsImage, 'o006', 0, upOffsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
      if (!isSwimming) {
        this.drawOutfits(context, tempCanvas, outfitsImage, 'o006', 1, upOffsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
      }
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (var outfitIndex in playerInfoTemp.outfits) {
          if (!isSwimming) {
            // Draw pants
            this.drawOutfits(context, tempCanvas, outfitsImage, playerInfoTemp.outfits[outfitIndex], 1, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            // Draw shoes
            this.drawOutfits(context, tempCanvas, outfitsImage, playerInfoTemp.outfits[outfitIndex], 2, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
          }
          // Draw clothes
          this.drawOutfits(context, tempCanvas, outfitsImage, playerInfoTemp.outfits[outfitIndex], 0, upOffsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
        }
      }
      // Draw top tool
      if (offsetY !== 1 && offsetY !== 3) {
        for (toolIndex in playerInfoTemp.tools) {
          this.drawTool(context, x, y, imageBlockSize, blockSize, playerInfoTemp.tools[toolIndex], offsetY, deltaWidth, deltaHeight, toolsImage)
        }
      }
      // Draw top arm
      context.drawImage(armsImage[playerInfoTemp.skinColor - 1], upOffsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
      x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
      // Draw bottom sleeve
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (outfitIndex in playerInfoTemp.outfits) {
          this.drawOutfits(context, tempCanvas, outfitsImage, playerInfoTemp.outfits[outfitIndex], 4, upOffsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
        }
      }
      // Draw top sleeve
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (outfitIndex in playerInfoTemp.outfits) {
          this.drawOutfits(context, tempCanvas, outfitsImage, playerInfoTemp.outfits[outfitIndex], 3, upOffsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
        }
      }
      // Show name
      this.drawAvatar(context, (x + 0.5) * blockSize - 0.4 * defaultBlockSize + deltaWidth, 
      (y - constants.STATUS_DISPLAY_DISTANCE) * blockSize - 0.15 * defaultBlockSize + deltaHeight,
      avatarSize / 2, defaultBlockSize * 0.2, avatarIndex, playerInfoTemp.nameColor, avatarsImage)
      // if (userCode != playerInfoTemp.id) {
      //   context.fillStyle = 'yellow'
      //   if (this.isDef(relations) && this.isDef(relations[playerInfoTemp.id])) {
      //     if (relations[playerInfoTemp.id] < 0) {
      //       context.fillStyle = 'red'
      //     } else if (relations[playerInfoTemp.id] > 0) {
      //       context.fillStyle = 'green'
      //     }
      //   }
      //   context.save()
      //   context.beginPath()
      //   context.arc((x + 0.5) * blockSize - 0.25 * defaultBlockSize + deltaWidth, 
      //   (y - constants.STATUS_DISPLAY_DISTANCE) * blockSize + 0.15 * defaultBlockSize + deltaHeight, 
      //   0.1 * defaultBlockSize, 0, 
      //   2 * Math.PI)
      //   context.fill()
      //   context.restore()
      // }
      if (this.isDef(playerInfoTemp.nickname)) {
        this.printText(context, playerInfoTemp.nickname, (x + 0.5) * blockSize + deltaWidth, 
        (y - constants.STATUS_DISPLAY_DISTANCE) * blockSize + deltaHeight,
        defaultBlockSize * 0.5, 
        'center')
      }
    } else if (playerInfoTemp.creatureType == 2) {
      // Display animals
      if (playerInfoTemp.skinColor !== 0) {
        context.drawImage(animalsImage[playerInfoTemp.skinColor], offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
        x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
      }
    } else if (playerInfoTemp.creatureType == 3) {
      // Display other creatures
      // TBD
    }
  },
  drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, eyesImage, hairstylesImage) {
    // upLeftPoint: 整个身体的左上角
    // downRightPoint: 整个身体的右下角
    var timestamp = new Date().valueOf()
    // coefs: 头顶高度系数 下颚高度系数 头顶宽度系数 下颚宽度系数 头顶弧度系数 侧面弧度系数 下颚弧度系数 眼睛高度系数 眼睛间距系数 正面弧度系数
    var coefs = this.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    // 头型
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    var centerHeadPoint = {x: upLeftPoint.x + width * 0.5, y: upLeftPoint.y + height * 0.15}
    var UpLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * (1 + (coefs[2] - 0.5)), y: centerHeadPoint.y - height * 0.12 * (1 + (coefs[0] - 0.5))}
    var DownLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * (1 + (coefs[3] - 0.5)), y: centerHeadPoint.y + height * 0.12 * (1 + (coefs[1] - 0.5))}
    var DownRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * (1 + (coefs[3] - 0.5)), y: centerHeadPoint.y + height * 0.12 * (1 + (coefs[1] - 0.5))}
    var UpRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * (1 + (coefs[2] - 0.5)), y: centerHeadPoint.y - height * 0.12 * (1 + (coefs[0] - 0.5))}
    var faceEdgeCoef = offsetY === 0 || offsetY === 4 ? coefs[5] : coefs[9]
    var leftControlPoint = {x: UpLeftHeadPoint.x - width * (faceEdgeCoef - 0.5), y: centerHeadPoint.y}
    var downControlPoint = {x: centerHeadPoint.x, y: DownLeftHeadPoint.y + height * (coefs[6] - 0.5)}
    var rightControlPoint = {x: UpRightHeadPoint.x + width * (faceEdgeCoef - 0.5), y: centerHeadPoint.y}
    var upControlPoint = {x: centerHeadPoint.x, y: UpLeftHeadPoint.y - height * (coefs[4] - 0.5)}
    switch (Number(playerInfoTemp.skinColor)) { // Number() must be included 24/04/30
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
    var neckHeight = height * 0.2
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
    var eyesY = centerHeadPoint.y - blockSize / 8 - height * 0.12 * (coefs[7] - 0.5)
    // Blink eyes
    if (timestamp % 4000 >= 10) {
      switch(offsetY) {
        case 0:
          context.drawImage(eyesImage, (playerInfoTemp.eyes - 1) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
          centerHeadPoint.x - blockSize / 8 - height * 0.12 * (coefs[8] - 0.5), eyesY, blockSize / 8, blockSize / 4)
          context.drawImage(eyesImage, ((playerInfoTemp.eyes - 1) + 0.5) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
          centerHeadPoint.x + height * 0.12 * (coefs[8] - 0.5), eyesY, blockSize / 8, blockSize / 4)
          break
        case 1:
          context.drawImage(eyesImage, ((playerInfoTemp.eyes - 1) + 0.5) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
          centerHeadPoint.x - blockSize / 8, eyesY, blockSize / 8, blockSize / 4)
          break
        case 2:
          context.drawImage(eyesImage, (playerInfoTemp.eyes - 1) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
          centerHeadPoint.x, eyesY, blockSize / 8, blockSize / 4)
          break
      }
    }
    if (playerInfoTemp.hairColor !== 0) {
      context.drawImage(hairstylesImage[playerInfoTemp.hairColor - 1], (playerInfoTemp.hairstyle - 1) * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
      upLeftPoint.x, upLeftPoint.y - blockSize * 0.38 - height * 0.12 * (coefs[0] - 0.5), blockSize, blockSize)
    }
  },
  convertFaceCoefsToCoefs (faceCoefs) {
    var coefs = []
    coefs[0] = 0.5 + (faceCoefs[0] / 100 - 0.5) * 0.5
    coefs[1] = 0.4 + (faceCoefs[1] / 100 - 0.5) * 0.4
    coefs[2] = 0.6 + (faceCoefs[2] / 100 - 0.5) * 0.2
    coefs[3] = 0.5 + (faceCoefs[3] / 100 - 0.5) * 0.5
    coefs[4] = 0.6 + (faceCoefs[4] / 100 - 0.5) * 0.1
    coefs[5] = 0.6 + (faceCoefs[5] / 100 - 0.5) * 0.1
    coefs[6] = 0.6 + (faceCoefs[6] / 100 - 0.5) * 0.1
    coefs[7] = 0.5 + (faceCoefs[7] / 100 - 0.5) * 0.3
    coefs[8] = 0.6 + (faceCoefs[8] / 100 - 0.5) * 0.2
    coefs[9] = 0.55 + (faceCoefs[9] / 100 - 0.5) * 0.05
    return coefs
  },
  drawBlock (constants, context, deltaWidth, deltaHeight, imageBlockSize, blockSize,
    block, worldInfo, userCode, playerInfos, items, effectsImage, dropsImage, scenesImage, blockImages) {
    var imageX = 0
    var imageY = 0
    var timestamp = new Date().valueOf()
    var img
    var playerInfo = playerInfos[userCode]
    if (block.type == constants.BLOCK_TYPE_DROP) {
      img = dropsImage
      switch (block.itemNo.charAt(0)) {
        case constants.ITEM_CHARACTER_TOOL:
          imageX = 0 * imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_OUTFIT:
          imageX = 1 * imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_CONSUMABLE:
          imageX = 2 * imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_MATERIAL:
        case constants.ITEM_CHARACTER_JUNK:
          imageX = 3 * imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_NOTE:
          imageX = 4 * imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_RECORDING:
          imageX = 5 * imageBlockSize / 2
          break
      }
      context.drawImage(img, imageX, imageY, imageBlockSize / 2, imageBlockSize / 2, 
      (block.x - 0.5 * Math.sin(timestamp % 4000 * Math.PI * 2 / 4000) / 2) * blockSize + deltaWidth, 
      (block.y - 1 / 2) * blockSize + deltaHeight, 
      blockSize / 2 * Math.sin(timestamp % 4000 * Math.PI * 2 / 4000), 
      blockSize / 2)
      // Show notifications (drop)
      if (Math.pow(playerInfo.coordinate.x - block.x, 2) + Math.pow(playerInfo.coordinate.y - block.y, 2) <= Math.pow(constants.MIN_DISPLAY_DISTANCE_BLOCK_PLAYER, 2)) {
        var itemName = items[block.itemNo].name
        this.printText(context, itemName + '(' + block.amount + ')', 
        block.x * blockSize + deltaWidth, 
        (block.y - 0.5) * blockSize + deltaHeight, 
        blockSize, 'center')
      }
      return true
    }
    if (block.type == constants.BLOCK_TYPE_EVENT) {
      var codeFragments = block.code.split('-')
      // Draw by Canvas
      if (Number(codeFragments[0]) == constants.EVENT_CODE_TAIL_SMOKE
      || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_SLUG
      || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_MAGNUM
      || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_ROCKET) {
        context.save()
        context.fillStyle = 'rgba(127, 127, 127, ' + (1 - Number(codeFragments[1]) / 25) + ')'
        context.beginPath()
        context.arc(block.x * blockSize + deltaWidth, (block.y - 0.5) * blockSize + deltaHeight, blockSize * (0.2 + Number(codeFragments[1]) / 25 * 0.8), 0, 2 * Math.PI)
        context.fill()
        context.restore()
        return true
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_NOISE) {
        context.save()
        context.lineWidth = 100 * Number(codeFragments[1]) / 25
        context.strokeStyle = 'rgba(196, 196, 196, ' + (0.25 - 0.25 * Number(codeFragments[1]) / 25) + ')'
        context.beginPath()
        context.arc(block.x * blockSize + deltaWidth, (block.y - 0.5) * blockSize + deltaHeight, blockSize * (2 + Number(codeFragments[1]) / 25 * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        return true
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_CURSE) {
        context.save()
        context.lineWidth = 100 * Number(codeFragments[1]) / 25
        context.strokeStyle = 'rgba(0, 0, 0, ' + (0.25 - 0.25 * Number(codeFragments[1]) / 25) + ')'
        context.beginPath()
        context.arc(block.x * blockSize + deltaWidth, (block.y - 0.5) * blockSize + deltaHeight, blockSize * (2 + Number(codeFragments[1]) / 25 * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        return true
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_CHEER) {
        context.save()
        context.lineWidth = 100 * Number(codeFragments[1]) / 25
        context.strokeStyle = 'rgba(255, 255, 127, ' + (0.25 - 0.25 * Number(codeFragments[1]) / 25) + ')'
        context.beginPath()
        context.arc(block.x * blockSize + deltaWidth, (block.y - 0.5) * blockSize + deltaHeight, blockSize * (2 + Number(codeFragments[1]) / 25 * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        return true
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_MINE) {
        return true
      }
      // Load image resource
      if (Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_HIT
      || Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_KICK
      || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_HIT) {
        img = effectsImage['hitEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_UPGRADE) {
        img = effectsImage['upgradeEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_EXPLODE) {
        img = effectsImage['explodeEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_BLEED) {
        img = effectsImage['bleedEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_BLOCK) {
        img = effectsImage['haloEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_HEAL) {
        img = effectsImage['healEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * imageBlockSize
        imageY = Math.floor((Number(codeFragments[1])) * 1 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_DISTURB) {
        img = effectsImage['disturbEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * imageBlockSize
        imageY = Math.floor((Number(codeFragments[1])) * 1 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_SACRIFICE) {
        img = effectsImage['sacrificeEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_SCRATCH) {
        img = effectsImage['meleeScratchEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_CLEAVE) {
        img = effectsImage['meleeCleaveEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_STAB
      || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_ARROW) {
        img = effectsImage['meleeStabEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_SPARK) {
        img = effectsImage['sparkEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_FIRE) {
        img = effectsImage['fireEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * imageBlockSize
      } else if (Number(codeFragments[0]) == constants.EVENT_CODE_WATER) {
        img = effectsImage['waveEffect']
        imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * imageBlockSize
      } else {
        img = blockImages[Number(codeFragments[0])]
      }
      if (!this.isDef(img)) {
        img = blockImages[1000]
      }
      context.drawImage(img, imageX, imageY, imageBlockSize, imageBlockSize,
      (block.x - 0.5) * blockSize + deltaWidth, 
      (block.y - 1) * blockSize + deltaHeight, 
      blockSize + 1, 
      blockSize + 1)
      return true
    }
    switch (block.code.charAt(0)) {
      case 'p':
        // plants
        this.drawScenesImage(context, imageBlockSize, blockSize, deltaWidth, deltaHeight, block, scenesImage)
        break
      case 'r':
        // rocks
        this.drawScenesImage(context, imageBlockSize, blockSize, deltaWidth, deltaHeight, block, scenesImage)
        break
      default:
        img = blockImages[Number(block.code)]
        if (!this.isDef(img)) {
          img = blockImages[1000]
        }
        context.drawImage(img, imageX, imageY, imageBlockSize, imageBlockSize, 
        (block.x - 0.5) * blockSize + deltaWidth, 
        (block.y - 1) * blockSize + deltaHeight, 
        blockSize + 1, 
        blockSize + 1)
        break
    }
    return true
  },
  drawGridBlock (constants, canvas, deltaWidth, deltaHeight, imageBlockSize, blockSize, userCode, playerInfos, regionInfo, grids, blockImages) {
    var context = canvas.getContext('2d') // 设置2D渲染区域
    var horizontalRadius = ((grids[0].length - 1) / regionInfo.width - 1) / 2
    var verticalRadius = ((grids.length - 1) / regionInfo.width - 1) / 2
    for (var j = 0; j < grids.length; j++) {
      for (var i = 0; i < grids[0].length; i++) {
        if (Math.pow(playerInfos[userCode].coordinate.x - (i - horizontalRadius * regionInfo.width), 2)
        + Math.pow(playerInfos[userCode].coordinate.y - (j - verticalRadius * regionInfo.height), 2)
        >= Math.pow(playerInfos[userCode].perceptionInfo.indistinctVisionRadius + 2, 2)) {
          continue
        }
        if (Math.pow(playerInfos[userCode].coordinate.x - (i - horizontalRadius * regionInfo.width + 1), 2)
        + Math.pow(playerInfos[userCode].coordinate.y - (j - verticalRadius * regionInfo.height), 2)
        >= Math.pow(playerInfos[userCode].perceptionInfo.indistinctVisionRadius + 2, 2)) {
          continue
        }
        if (Math.pow(playerInfos[userCode].coordinate.x - (i - horizontalRadius * regionInfo.width), 2)
        + Math.pow(playerInfos[userCode].coordinate.y - (j - verticalRadius * regionInfo.height + 1), 2)
        >= Math.pow(playerInfos[userCode].perceptionInfo.indistinctVisionRadius + 2, 2)) {
          continue
        }
        if (Math.pow(playerInfos[userCode].coordinate.x - (i - horizontalRadius * regionInfo.width + 1), 2)
        + Math.pow(playerInfos[userCode].coordinate.y - (j - verticalRadius * regionInfo.height + 1), 2)
        >= Math.pow(playerInfos[userCode].perceptionInfo.indistinctVisionRadius + 2, 2)) {
          continue
        }
        var upleftGridBlock = {
          type: constants.BLOCK_TYPE_GROUND,
          code: String(grids[i][j]),
          x: i - horizontalRadius * regionInfo.width,
          y: j - verticalRadius * regionInfo.height
        }
        context.drawImage(blockImages[Number(upleftGridBlock.code)], 0, 0, imageBlockSize / 2, imageBlockSize / 2,
        upleftGridBlock.x * blockSize + deltaWidth, 
        upleftGridBlock.y * blockSize + deltaHeight, 
        blockSize / 2 + 1, 
        blockSize / 2 + 1)
        var uprightGridBlock = {
          type: constants.BLOCK_TYPE_GROUND,
          code: String(grids[i + 1][j]),
          x: i - horizontalRadius * regionInfo.width + 0.5,
          y: j - verticalRadius * regionInfo.height
        }
        context.drawImage(blockImages[Number(uprightGridBlock.code)], 0, imageBlockSize / 2, imageBlockSize / 2, imageBlockSize / 2,
        uprightGridBlock.x * blockSize + deltaWidth, 
        uprightGridBlock.y * blockSize + deltaHeight, 
        blockSize / 2 + 1, 
        blockSize / 2 + 1)
        var downleftGridBlock = {
          type: constants.BLOCK_TYPE_GROUND,
          code: String(grids[i][j + 1]),
          x: i - horizontalRadius * regionInfo.width,
          y: j - verticalRadius * regionInfo.height + 0.5
        }
        context.drawImage(blockImages[Number(downleftGridBlock.code)], imageBlockSize / 2, 0, imageBlockSize / 2, imageBlockSize / 2,
        downleftGridBlock.x * blockSize + deltaWidth, 
        downleftGridBlock.y * blockSize + deltaHeight, 
        blockSize / 2 + 1, 
        blockSize / 2 + 1)
        var downrightGridBlock = {
          type: constants.BLOCK_TYPE_GROUND,
          code: String(grids[i + 1][j + 1]),
          x: i - horizontalRadius * regionInfo.width + 0.5,
          y: j - verticalRadius * regionInfo.height + 0.5
        }
        context.drawImage(blockImages[Number(downrightGridBlock.code)], imageBlockSize / 2, imageBlockSize / 2, imageBlockSize / 2, imageBlockSize / 2,
        downrightGridBlock.x * blockSize + deltaWidth, 
        downrightGridBlock.y * blockSize + deltaHeight, 
        blockSize / 2 + 1, 
        blockSize / 2 + 1)
        if (upleftGridBlock.code != uprightGridBlock.code) {
          if (upleftGridBlock.code == '1018' || uprightGridBlock.code == '1018'
          || upleftGridBlock.code == '1011' || uprightGridBlock.code == '1011') {
            context.drawImage(blockImages[1024], 0, 0, imageBlockSize, imageBlockSize, 
              upleftGridBlock.x * blockSize + deltaWidth, 
              upleftGridBlock.y * blockSize + deltaHeight, 
              blockSize + 1, 
              blockSize + 1)
          } else {
            context.drawImage(blockImages[1020], 0, 0, imageBlockSize, imageBlockSize, 
              upleftGridBlock.x * blockSize + deltaWidth, 
              upleftGridBlock.y * blockSize + deltaHeight, 
              blockSize + 1, 
              blockSize + 1)
          }
        }
        if (upleftGridBlock.code != downleftGridBlock.code) {
          if (upleftGridBlock.code == '1018' || downleftGridBlock.code == '1018'
          || upleftGridBlock.code == '1011' || downleftGridBlock.code == '1011') {
            context.drawImage(blockImages[1025], 0, 0, imageBlockSize, imageBlockSize, 
              upleftGridBlock.x * blockSize + deltaWidth, 
              upleftGridBlock.y * blockSize + deltaHeight, 
              blockSize + 1, 
              blockSize + 1)
          } else {
            context.drawImage(blockImages[1021], 0, 0, imageBlockSize, imageBlockSize, 
              upleftGridBlock.x * blockSize + deltaWidth, 
              upleftGridBlock.y * blockSize + deltaHeight, 
              blockSize + 1, 
              blockSize + 1)
          }
        }
        if (uprightGridBlock.code != downrightGridBlock.code) {
          if (uprightGridBlock.code == '1018' || downrightGridBlock.code == '1018'
          || uprightGridBlock.code == '1011' || downrightGridBlock.code == '1011') {
            context.drawImage(blockImages[1026], 0, 0, imageBlockSize, imageBlockSize, 
              upleftGridBlock.x * blockSize + deltaWidth, 
              upleftGridBlock.y * blockSize + deltaHeight, 
              blockSize + 1, 
              blockSize + 1)
          } else {
            context.drawImage(blockImages[1022], 0, 0, imageBlockSize, imageBlockSize, 
              upleftGridBlock.x * blockSize + deltaWidth, 
              upleftGridBlock.y * blockSize + deltaHeight, 
              blockSize + 1, 
              blockSize + 1)
          }
        }
        if (downleftGridBlock.code != downrightGridBlock.code) {
          if (downleftGridBlock.code == '1018' || downrightGridBlock.code == '1018'
          || downleftGridBlock.code == '1011' || downrightGridBlock.code == '1011') {
            context.drawImage(blockImages[1027], 0, 0, imageBlockSize, imageBlockSize, 
              upleftGridBlock.x * blockSize + deltaWidth, 
              upleftGridBlock.y * blockSize + deltaHeight, 
              blockSize + 1, 
              blockSize + 1)
          } else {
            context.drawImage(blockImages[1023], 0, 0, imageBlockSize, imageBlockSize, 
              upleftGridBlock.x * blockSize + deltaWidth, 
              upleftGridBlock.y * blockSize + deltaHeight, 
              blockSize + 1, 
              blockSize + 1)
          }
        }
        // Block-style shade
        // var visionRatio = (Math.sqrt(Math.pow(playerInfos[userCode].coordinate.x - (upleftGridBlock.x + 0.5), 2)
        // + Math.pow(playerInfos[userCode].coordinate.y - (upleftGridBlock.y + 0.5), 2), 2)
        // - playerInfos[userCode].perceptionInfo.distinctVisionRadius)
        // / (playerInfos[userCode].perceptionInfo.indistinctVisionRadius - playerInfos[userCode].perceptionInfo.distinctVisionRadius)
        // if (visionRatio <= 0) {
        //   continue
        // }
        // if (visionRatio >= 1) {
        //   visionRatio = 1
        // }
        // context.save()
        // context.fillStyle = 'rgba(0, 0, 0, ' + visionRatio + ')'
        // context.fillRect(upleftGridBlock.x * blockSize + deltaWidth, 
        // upleftGridBlock.y * blockSize + deltaHeight, 
        // blockSize + 1, 
        // blockSize + 1)
        // context.restore()
      }
    }
    // Round-style shade
    context.save()
    var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, playerInfos[userCode].perceptionInfo.distinctVisionRadius * blockSize,
    canvas.width / 2, canvas.height / 2, playerInfos[userCode].perceptionInfo.indistinctVisionRadius * blockSize) // 渐变的中心点、半径
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)') // 内部完全透明
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)') // 外部完全不透明
    context.beginPath()
    context.moveTo(canvas.width / 2, canvas.height / 2)
    context.arc(canvas.width / 2, canvas.height / 2, (playerInfos[userCode].perceptionInfo.indistinctVisionRadius + 2) * blockSize, 0, 2 * Math.PI)
    context.fillStyle = gradient
    context.fill()
    context.closePath()
    var leftDDegree = 360 - playerInfos[userCode].faceDirection + playerInfos[userCode].perceptionInfo.distinctVisionAngle / 2
    var rightDDegree = 0 - playerInfos[userCode].faceDirection - playerInfos[userCode].perceptionInfo.distinctVisionAngle / 2
    context.beginPath()
    context.moveTo(canvas.width / 2, canvas.height / 2)
    context.arc(canvas.width / 2, canvas.height / 2, (playerInfos[userCode].perceptionInfo.indistinctVisionRadius + 2) * blockSize, leftDDegree / 180 * Math.PI, rightDDegree / 180 * Math.PI, false)
    context.fillStyle = 'rgba(0, 0, 0, 0.05)'
    context.fill()
    context.closePath()
    // var leftIDegree = 360 - playerInfos[userCode].faceDirection + playerInfos[userCode].perceptionInfo.indistinctVisionAngle / 2
    // var rightIDegree = 0 - playerInfos[userCode].faceDirection - playerInfos[userCode].perceptionInfo.indistinctVisionAngle / 2
    // context.beginPath()
    // context.moveTo(canvas.width / 2, canvas.height / 2)
    // context.arc(canvas.width / 2, canvas.height / 2, (playerInfos[userCode].perceptionInfo.indistinctVisionRadius + 2) * blockSize, leftIDegree / 180 * Math.PI, rightIDegree / 180 * Math.PI)
    // context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    // context.fill()
    // context.closePath()
    context.restore()
  },
  drawScenesImage (context, imageBlockSize, blockSize, deltaWidth, deltaHeight, block, scenesImage) {
    var codeFragments = block.code.split('-')
    context.drawImage(scenesImage[codeFragments[0]], Number(codeFragments[1]) * imageBlockSize, Number(codeFragments[2]) * imageBlockSize, block.structure.imageSize.x * imageBlockSize, block.structure.imageSize.y * imageBlockSize, 
    (block.x - block.structure.imageSize.x / 2) * blockSize + deltaWidth, (block.y - block.structure.imageSize.y) * blockSize + deltaHeight, block.structure.imageSize.x * blockSize, block.structure.imageSize.y * blockSize)
  },
  drawAvatar (context, x, y, imageBlockSize, avatarSize, avatarIndex, nameColor, avatarsImage) {
    context.save()
    context.beginPath()
    context.strokeStyle = nameColor
    context.lineWidth = avatarSize / 25
    context.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
    context.stroke()
    context.clip()
    context.drawImage(avatarsImage, avatarIndex % 10 * imageBlockSize, Math.floor(avatarIndex / 10) * imageBlockSize, imageBlockSize, imageBlockSize, x, y, avatarSize, avatarSize)
    context.restore()
  },
  drawTool (context, x, y, imageBlockSize, blockSize, toolIndex, offsetY, deltaWidth, deltaHeight, toolsImage) {
    var img, width, height
    var index = Number(toolIndex.substr(1, toolIndex.length - 1))
    switch (Math.floor(index / 100)) {
      case 0:
        // tool-s
        img = toolsImage[0]
        width = 0.5
        height = 0.25
        break
      case 1:
        // tool-m
        img = toolsImage[1]
        width = 1
        height = 0.25
        break
      case 2:
        // tool-l
        img = toolsImage[2]
        width = 1.5
        height = 0.5
        break
    }
    context.save()
    switch (offsetY) {
      case 0:
        context.translate((x + 0.35) * blockSize + deltaWidth, (y + 0.6) * blockSize + deltaHeight)
        context.rotate(Math.PI / 4)
        break
      case 1:
        context.scale(-1, 1)
        context.translate(-((x + 0.5) * blockSize + deltaWidth), (y + 0.6) * blockSize + deltaHeight)
        break
      case 2:
        context.translate((x + 0.5) * blockSize + deltaWidth, (y + 0.6) * blockSize + deltaHeight)
        break
      case 3:
        context.scale(-1, 1)
        context.translate(-((x + 0.65) * blockSize + deltaWidth), (y + 0.6) * blockSize + deltaHeight)
        context.rotate(-Math.PI / 4)
        break
    }
    context.drawImage(img, Math.floor(index / 10) % 10 * width * imageBlockSize, index % 10 * height * imageBlockSize, width * imageBlockSize, height * imageBlockSize, 
    -width / 2 * blockSize, -height / 2 * blockSize, width * blockSize, height * blockSize)
    context.restore()
  },
  drawOutfits (context, tempCanvas, outfitsImage, outfitNo, partIndex, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize) {
    var rgbArray
    switch (outfitNo) {
      case 'o001':
      case 'o002':
        if (outfitNo == 'o001') {
          rgbArray = [0, 0, 255]
        } else if (outfitNo == 'o002') {
          rgbArray = [255, 0, 0]
        }
        switch (partIndex) {
          case 0:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], rgbArray, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][1], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][2], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 1:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], rgbArray, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 2:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [15, 15, 15], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 3:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], rgbArray, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][2], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 4:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [255, 255, 255], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
        }
        break
      case 'o003':
        switch (partIndex) {
          case 0:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [153, 204, 153], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][2], [0, 153, 0], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 1:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [0, 102, 51], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 2:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [15, 15, 15], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 3:
          case 4:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [153, 204, 153], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
        }
        break
      case 'o004':
      case 'o005':
        switch (partIndex) {
          case 0:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [7, 7, 7], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            if (outfitNo == 'o004') {
              this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][3], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            } else if (outfitNo == 'o005') {
              this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][4], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            }
            break
          case 1:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [15, 15, 15], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 2:
          case 3:
          case 4:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [7, 7, 7], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
        }
        break
      case 'o006':
        switch (partIndex) {
          case 0:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][5], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
          case 1:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][1], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            break
        }
        break
      default:
        this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
        break
    }
  },
  drawOutfit (context, tempCanvas, outfitsImage, rgbArray, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize) {
    tempCanvas.width = blockSize
    tempCanvas.height = blockSize
    var tempContext = tempCanvas.getContext('2d')
    tempContext.drawImage(outfitsImage, offsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
      0, 0, blockSize, blockSize)
    if (this.isDef(rgbArray)) {
      var imageData = tempContext.getImageData(0, 0, blockSize, blockSize)
      var data = imageData.data
      for (var i = 0; i < data.length; i += 4) {
        data[i + 0] = rgbArray[0]
        data[i + 1] = rgbArray[1]
        data[i + 2] = rgbArray[2]
      }
      tempContext.putImageData(imageData, 0, 0)
    }
    context.drawImage(tempCanvas, 0, 0, blockSize, blockSize, 
      x * blockSize + deltaWidth, y * blockSize + deltaHeight, blockSize, blockSize)
  },
  isDef (v) {
    return v !== undefined && v !== null
  },
  checkBlockTypeInteractive (constants, blockType) {
    switch (blockType) {
      case constants.BLOCK_TYPE_PLAYER:
      case constants.BLOCK_TYPE_BED:
      case constants.BLOCK_TYPE_TOILET:
      case constants.BLOCK_TYPE_DRESSER:
      case constants.BLOCK_TYPE_WORKSHOP:
      case constants.BLOCK_TYPE_GAME:
      case constants.BLOCK_TYPE_STORAGE:
      case constants.BLOCK_TYPE_COOKER:
      case constants.BLOCK_TYPE_SINK:
      case constants.BLOCK_TYPE_CONTAINER:
        return true
    }
    return false
  },
  drawMinimap (context, x, y, length, miniMap) {
    if (!this.isDef(miniMap)) {
      return
    }
    context.save()
    if (this.isDef(miniMap.background)) {
      for (var i = 0; i < miniMap.background.length; i++) {
        var color = miniMap.background[i]
        context.fillStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0.25)'
        context.beginPath()
        context.arc(x + Math.floor(i / Math.sqrt(miniMap.background.length)), y + i % Math.sqrt(miniMap.background.length), 1, 0, 2 * Math.PI)
        context.closePath()
        context.fill()
      }
    }
    context.strokeStyle = 'rgba(0, 0, 0, 0.01)'
    for (i = 0; i < length; i += length / 10) {
      context.beginPath()
      context.moveTo(x + i, y)
      context.lineTo(x + i, y + length)
      context.closePath()
      context.stroke()
      context.beginPath()
      context.moveTo(x, y + i)
      context.lineTo(x + length, y + i)
      context.closePath()
      context.stroke()
    }
    if (this.isDef(miniMap.sceneCoordinate)) {
      var date = new Date()
      var timestamp = date.valueOf()
      var deltaLength = Math.abs(timestamp % 1000 - 500) / 20000 * length
      context.fillStyle = 'rgba(255, 0, 0, 0.75)'
      context.fillRect(x + miniMap.sceneCoordinate.x - deltaLength, y + miniMap.sceneCoordinate.y - deltaLength, 2 * deltaLength, 2 * deltaLength)
      context.restore()
    }
  }
};