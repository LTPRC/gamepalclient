// draw.js
// 只能在这里定义变量
const HEAD_BODY_RATIO = 0.32
const WAIST_BODY_RATIO = 0.6
const STATUS_DISPLAY_DISTANCE_ADDER = 0.7
const MIN_DISPLAY_DISTANCE_BLOCK_PLAYER = 2

const BUFF_CODE_DEAD = 1
// const EVENT_CODE_HIT_FIRE = 102
// const EVENT_CODE_HIT_ICE = 103
// const EVENT_CODE_HIT_ELECTRICITY = 104
const EVENT_CODE_UPGRADE = 105
const EVENT_CODE_FIRE = 106
const EVENT_CODE_EXPLODE = 108
const EVENT_CODE_BLEED = 109
const EVENT_CODE_BLOCK = 110
const EVENT_CODE_HEAL = 111
const EVENT_CODE_DISTURB = 112
const EVENT_CODE_SACRIFICE = 113
const EVENT_CODE_TAIL_SMOKE = 114
const EVENT_CODE_CHEER = 115
const EVENT_CODE_CURSE = 116
const EVENT_CODE_MELEE_HIT = 101
const EVENT_CODE_MELEE_SCRATCH = 117
const EVENT_CODE_MELEE_CLEAVE = 118
const EVENT_CODE_MELEE_STAB = 119
const EVENT_CODE_MELEE_KICK = 120
const EVENT_CODE_SHOOT_HIT = 122
const EVENT_CODE_SHOOT_ARROW = 123
const EVENT_CODE_SHOOT_SLUG = 107
const EVENT_CODE_SHOOT_MAGNUM = 124
const EVENT_CODE_SHOOT_ROCKET = 121
const EVENT_CODE_SPARK = 125

const BLOCK_TYPE_PLAYER = 2
const BLOCK_TYPE_DROP = 3
const BLOCK_TYPE_BED = 5
const BLOCK_TYPE_TOILET = 6
const BLOCK_TYPE_DRESSER = 7
const BLOCK_TYPE_WORKSHOP = 8
const BLOCK_TYPE_GAME = 9
const BLOCK_TYPE_STORAGE = 10
const BLOCK_TYPE_COOKER = 11
const BLOCK_TYPE_SINK = 12

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
  drawCharacter(context, tempCanvas, x, y, deltaWidth, deltaHeight, avatarSize, imageBlockSize, blockSize, upLeftPoint, downRightPoint,
    userCode, playerInfoTemp, relations, avatarIndex,
    avatarsImage, bodiesImage, armsImage, eyesImage, hairstylesImage, toolsImage, outfitsImage, animalsImage) {
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
          this.drawTool(context, x, y, imageBlockSize, blockSize, playerInfoTemp.tools[toolIndex], offsetY, deltaWidth, deltaHeight, toolsImage)
        }
      }
      // Draw head
      this.drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, eyesImage, hairstylesImage)
      // Draw body (down)
      context.drawImage(bodiesImage[Number(playerInfoTemp.skinColor) - 1], offsetX * imageBlockSize, (WAIST_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (1 - WAIST_BODY_RATIO) * imageBlockSize, 
      x * blockSize + deltaWidth, (WAIST_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (1 - WAIST_BODY_RATIO) * blockSize)
      // Draw body (up)
      context.drawImage(bodiesImage[Number(playerInfoTemp.skinColor) - 1], upOffsetX * imageBlockSize, (HEAD_BODY_RATIO + offsetY) * imageBlockSize, imageBlockSize, (WAIST_BODY_RATIO - HEAD_BODY_RATIO) * imageBlockSize, 
      x * blockSize + deltaWidth, (HEAD_BODY_RATIO + y) * blockSize + deltaHeight, blockSize, (WAIST_BODY_RATIO - HEAD_BODY_RATIO) * blockSize)
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (var outfitIndex in playerInfoTemp.outfits) {
          // Draw pants
          this.drawOutfits(context, tempCanvas, outfitsImage, playerInfoTemp.outfits[outfitIndex], 1, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
          // Draw shoes
          this.drawOutfits(context, tempCanvas, outfitsImage, playerInfoTemp.outfits[outfitIndex], 2, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
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
      context.drawImage(armsImage[Number(playerInfoTemp.skinColor) - 1], upOffsetX * imageBlockSize, offsetY * imageBlockSize, imageBlockSize, imageBlockSize, 
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
    this.drawAvatar(context, (x - 0.25 + 0.02 - 0.2 + 0.5) * blockSize + deltaWidth, 
    (y - 0.36 - 0.2 - 0.5 + STATUS_DISPLAY_DISTANCE_ADDER) * blockSize + deltaHeight,
    avatarSize / 2, blockSize * 0.2, avatarIndex, playerInfoTemp.nameColor, avatarsImage)
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
  drawHead(context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, eyesImage, hairstylesImage) {
    // upLeftPoint: 整个身体的左上角
    // downRightPoint: 整个身体的右下角
    var timestamp = new Date().valueOf()
    // coefs: 头顶高度系数 下颚高度系数 头顶宽度系数 下颚宽度系数 头顶弧度系数 颧骨弧度系数 下颚弧度系数 眼睛高度系数 眼睛间距系数
    var coefs = this.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
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
          context.drawImage(eyesImage, (Number(playerInfoTemp.eyes) - 1) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
          centerHeadPoint.x - blockSize / 8 - height * 0.12 * (coefs[8] - 0.5), eyesY, blockSize / 8, blockSize / 4)
          context.drawImage(eyesImage, ((Number(playerInfoTemp.eyes) - 1) + 0.5) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
          centerHeadPoint.x + height * 0.12 * (coefs[8] - 0.5), eyesY, blockSize / 8, blockSize / 4)
          break
        case 1:
          context.drawImage(eyesImage, ((Number(playerInfoTemp.eyes) - 1) + 0.5) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
          centerHeadPoint.x - blockSize / 8, eyesY, blockSize / 8, blockSize / 4)
          break
        case 2:
          context.drawImage(eyesImage, (Number(playerInfoTemp.eyes) - 1) * imageBlockSize / 4, 0, imageBlockSize / 8, imageBlockSize / 4, 
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
    return coefs
  },
  drawBlock (context, deltaWidth, deltaHeight, imageBlockSize, blockSize,
    block, userCode, playerInfos, items, effectsImage, scenesImage, blockImages) {
    var timestamp = new Date().valueOf()
    var img, txt
    var imageX = 0
    var imageY = 0
    var playerInfo = playerInfos[userCode]
    if (block.type == BLOCK_TYPE_PLAYER) {
      this.drawCharacter(playerInfos[block.id], block.x - 0.5, block.y - 1, blockSize)
      return
    }
    if (block.type == BLOCK_TYPE_DROP) {
      context.drawImage(blockImages[Number(block.code)], imageX, imageY, imageBlockSize, imageBlockSize, 
      (block.x - 0.5 * Math.sin(timestamp % 4000 * Math.PI * 2 / 4000)) * blockSize + deltaWidth, 
      (block.y - 1) * blockSize + deltaHeight, 
      blockSize * Math.sin(timestamp % 4000 * Math.PI * 2 / 4000), 
      blockSize)
      // Show notifications (drop)
      if (Math.pow(playerInfo.coordinate.x - block.x, 2) + Math.pow(playerInfo.coordinate.y - block.y, 2) <= Math.pow(MIN_DISPLAY_DISTANCE_BLOCK_PLAYER, 2)) {
        var itemName = items[block.itemNo].name
        this.printText(context, itemName + '(' + block.amount + ')', 
        block.x * blockSize + deltaWidth, 
        (block.y - 0.5) * blockSize + deltaHeight, 
        blockSize, 'center')
      }
      return
    }
    if (Number(block.code) == EVENT_CODE_TAIL_SMOKE
    || Number(block.code) == EVENT_CODE_SHOOT_SLUG
    || Number(block.code) == EVENT_CODE_SHOOT_MAGNUM
    || Number(block.code) == EVENT_CODE_SHOOT_ROCKET) {
      context.save()
      context.fillStyle = 'rgba(127, 127, 127, ' + (1 - Number(block.id) / 25) + ')'
      context.beginPath()
      context.arc(block.x * blockSize + deltaWidth, (block.y - 0.5) * blockSize + deltaHeight, blockSize * (0.2 + Number(block.id) / 25 * 0.8), 0, 2 * Math.PI)
      context.fill()
      context.restore()
      return
    }
    if (Number(block.code) == EVENT_CODE_MELEE_HIT
    || Number(block.code) == EVENT_CODE_MELEE_KICK
    || Number(block.code) == EVENT_CODE_SHOOT_HIT) {
      img = effectsImage['hitEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_UPGRADE) {
      img = effectsImage['upgradeEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_FIRE) {
      img = effectsImage['fireEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_EXPLODE) {
      img = effectsImage['explodeEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_BLEED) {
      img = effectsImage['bleedEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_BLOCK) {
      img = effectsImage['haloEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_HEAL) {
      img = effectsImage['healEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) % 10 * imageBlockSize
      imageY = Math.floor((Number(block.id)) * 1 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_DISTURB) {
      img = effectsImage['disturbEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) % 10 * imageBlockSize
      imageY = Math.floor((Number(block.id)) * 1 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_SACRIFICE) {
      img = effectsImage['sacrificeEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_CHEER) {
      img = effectsImage['moraleHighEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) % 10 * imageBlockSize
      imageY = Math.floor((Number(block.id)) * 1 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_CURSE) {
      img = effectsImage['moraleLowEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) % 10 * imageBlockSize
      imageY = Math.floor((Number(block.id)) * 1 / 25) * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_MELEE_SCRATCH) {
      img = effectsImage['meleeScratchEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) % 10 * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_MELEE_CLEAVE) {
      img = effectsImage['meleeCleaveEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) % 10 * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_MELEE_STAB
    || Number(block.code) == EVENT_CODE_SHOOT_ARROW) {
      img = effectsImage['meleeStabEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) % 10 * imageBlockSize
    } else if (Number(block.code) == EVENT_CODE_SPARK) {
      img = effectsImage['sparkEffect']
      imageX = Math.floor((Number(block.id)) * 10 / 25) % 10 * imageBlockSize
    } else {
      img = blockImages[Number(block.code)]
    }
    if (!this.isDef(img)) {
      img = blockImages[1000]
    }
    switch (block.code.charAt(0)) {
      case 'f':
        // 森林
        this.drawScenesImage(context, imageBlockSize, blockSize, deltaWidth, deltaHeight, block, scenesImage)
        break
      default:
        context.drawImage(img, imageX, imageY, imageBlockSize, imageBlockSize, 
        (block.x - 0.5) * blockSize + deltaWidth, 
        (block.y - 1) * blockSize + deltaHeight, 
        blockSize + 1, 
        blockSize + 1)
        break
    }
    if (block.id != userCode && this.checkBlockTypeInteractive(block.type)) {
      switch (block.type) {
        case BLOCK_TYPE_BED:
          txt = '床'
          break
        case BLOCK_TYPE_TOILET:
          txt = '马桶'
          break
        case BLOCK_TYPE_DRESSER:
          txt = '梳妆台'
          break
        case BLOCK_TYPE_WORKSHOP:
          txt = '工作台'
          break
        case BLOCK_TYPE_GAME:
          txt = '桌游'
          break
        case BLOCK_TYPE_STORAGE:
          txt = '行李箱'
          break
        case BLOCK_TYPE_COOKER:
          txt = '灶台'
          break
        case BLOCK_TYPE_SINK:
          txt = '饮水台'
          break
      }
      if (Math.pow(playerInfo.coordinate.x - block.x, 2) + Math.pow(playerInfo.coordinate.y - block.y, 2) <= Math.pow(MIN_DISPLAY_DISTANCE_BLOCK_PLAYER, 2)) {
        this.printText(context, txt, block.x * blockSize + deltaWidth, (block.y - 1) * blockSize + deltaHeight, blockSize, 'center')
      }
    }
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
      case 'a001':
      case 'a002':
        if (outfitNo == 'a001') {
          rgbArray = [0, 0, 255]
        } else if (outfitNo == 'a002') {
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
      case 'a003':
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
      case 'a004':
      case 'a005':
        switch (partIndex) {
          case 0:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [7, 7, 7], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            if (outfitNo == 'a004') {
              this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][3], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            } else if (outfitNo == 'a005') {
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
  checkBlockTypeInteractive (blockType) {
    switch (blockType) {
      case BLOCK_TYPE_PLAYER:
      case BLOCK_TYPE_BED:
      case BLOCK_TYPE_TOILET:
      case BLOCK_TYPE_DRESSER:
      case BLOCK_TYPE_WORKSHOP:
      case BLOCK_TYPE_GAME:
      case BLOCK_TYPE_STORAGE:
      case BLOCK_TYPE_COOKER:
      case BLOCK_TYPE_SINK:
        return true
    }
    return false
  }
};