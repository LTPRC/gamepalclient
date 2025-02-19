// drawBlock.js

import { constants } from "./constants"
import { utilMethods } from "./util"

export function drawBlockMethod() {
  // 你的全局方法实现
}

// 或者如果有多个方法
export const drawBlockMethods = {
  drawBlockByType (canvasInfo, staticData, images, userInfo, block) {
    switch (block.type) {
      case constants.BLOCK_TYPE_DROP:
        return this.drawDropBlock(canvasInfo, staticData, images, userInfo, block)
      default:
        return this.drawBlockByCode(canvasInfo, staticData, images, userInfo, block)
    }
  },
  drawBlockByCode (canvasInfo, staticData, images, userInfo, block) {
    var context = canvasInfo.canvas.getContext('2d')
    var timestamp = new Date().valueOf()
    switch (block.code) {
      case constants.BLOCK_CODE_UPGRADE:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['upgradeEffect'])
      case constants.BLOCK_CODE_EXPLODE:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['explodeEffect'])
      case constants.BLOCK_CODE_BLEED:
        context.save()
        var bloodDropAmount = 30
        var variableAmount = 9
        var hashSequence = utilMethods.generateHashSequence(Math.floor(block.x * 1000), Math.floor(block.y * 1000), bloodDropAmount * variableAmount)
        var bleedingHeight = 0.5
        context.fillStyle = 'rgba(196, 0, 0, ' + (1 - block.frame / block.period) + ')'
        for (let i = 0; i < bloodDropAmount; i++) {
          var deltaX = 1 * block.frame / block.period * (hashSequence[0 + i * variableAmount] * 10 + hashSequence[1 + i * variableAmount] - 50) / 50
          + 0.05 * (hashSequence[2 + i * variableAmount] * 10 + hashSequence[3 + i * variableAmount] - 50) / 50
          var deltaY = 1 * block.frame / block.period * (hashSequence[4 + i * variableAmount] * 10 + hashSequence[5 + i * variableAmount] - 50) / 50
          + 0.05 * (hashSequence[6 + i * variableAmount] * 10 + hashSequence[7 + i * variableAmount] - 50) / 50
          var size = ((1 - block.frame / block.period) * 5 * (hashSequence[8 + i * variableAmount] / 10) + 1) / canvasInfo.blockSize
          context.fillRect((block.x + deltaX) * canvasInfo.blockSize + canvasInfo.deltaWidth,
          (block.y + deltaY - bleedingHeight) * canvasInfo.blockSize + canvasInfo.deltaHeight,
          size * canvasInfo.blockSize,
          size * canvasInfo.blockSize)
        }
        context.restore()
        break
      case constants.BLOCK_CODE_BLOCK:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['haloEffect'])
      case constants.BLOCK_CODE_HEAL:
        break
      case constants.BLOCK_CODE_DECAY:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['decayEffect'])
      case constants.BLOCK_CODE_SACRIFICE:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['sacrificeEffect'])
      case constants.BLOCK_CODE_TAIL_SMOKE:
        context.save()
        context.fillStyle = 'rgba(127, 127, 127, ' + (1 - block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (0.2 + block.frame / block.period * 0.8), 0, 2 * Math.PI)
        context.fill()
        context.restore()
        break
      case constants.BLOCK_CODE_CHEER:
        context.save()
        context.lineWidth = 100 * block.frame / block.period
        context.strokeStyle = 'rgba(255, 255, 127, ' + (0.25 - 0.25 * block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + block.frame / block.period * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        break
      case constants.BLOCK_CODE_CURSE:
        context.save()
        context.lineWidth = 100 * block.frame / block.period
        context.strokeStyle = 'rgba(0, 0, 0, ' + (0.25 - 0.25 * block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + block.frame / block.period * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        break
      case constants.BLOCK_CODE_MELEE_HIT:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['hitEffect'])
      case constants.BLOCK_CODE_MELEE_KICK:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['hitEffect'])
      case constants.BLOCK_CODE_MELEE_SCRATCH:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['meleeScratchEffect'])
      case constants.BLOCK_CODE_MELEE_SMASH:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['hitEffect'])
      case constants.BLOCK_CODE_MELEE_CLEAVE:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['meleeCleaveEffect'])
      case constants.BLOCK_CODE_MELEE_CHOP:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['meleeCleaveEffect'])
      case constants.BLOCK_CODE_MELEE_PICK:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['meleeCleaveEffect'])
      case constants.BLOCK_CODE_MELEE_STAB:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['meleeStabEffect'])
      case constants.BLOCK_CODE_SHOOT_HIT:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['hitEffect'])
      case constants.BLOCK_CODE_SHOOT_ARROW:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['meleeStabEffect'])
      case constants.BLOCK_CODE_SHOOT_SLUG:
        break
      case constants.BLOCK_CODE_SHOOT_MAGNUM:
        break
      case constants.BLOCK_CODE_SHOOT_ROCKET:
        break
      case constants.BLOCK_CODE_SHOOT_FIRE:
        break
      case constants.BLOCK_CODE_SHOOT_SPRAY:
        break
      case constants.BLOCK_CODE_SPARK:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['sparkEffect'])
      case constants.BLOCK_CODE_NOISE:
        context.save()
        context.lineWidth = 100 * block.frame / block.period
        context.strokeStyle = 'rgba(196, 196, 196, ' + (0.25 - 0.25 * block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + block.frame / block.period * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        break
      case constants.BLOCK_CODE_MINE:
        break
      case constants.BLOCK_CODE_FIRE:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['fireEffect'])
      case constants.BLOCK_CODE_SPRAY:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['waveEffect'])
      case constants.BLOCK_CODE_SPARK_SHORT:
        return this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['sparkEffect'])
      case constants.BLOCK_CODE_LIGHT_SMOKE:
        context.save()
        context.fillStyle = 'rgba(195, 195, 195, ' + (1 - block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, block.y * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (0.1 + block.frame / block.period * 0.4), 0, 2 * Math.PI)
        context.fill()
        context.restore()
        break
      case constants.BLOCK_CODE_BLEED_SEVERE:
        context.save()
        context.fillStyle = 'rgba(196, 0, 0, ' + 0.5 * (1 - block.frame / block.period) + ')'
        context.beginPath()
        context.ellipse(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5 - Math.min(1, block.frame * 10 / block.period) * 0.15 / 2) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        // context.ellipse(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, block.y * canvasInfo.blockSize + canvasInfo.deltaHeight,
          (0.1 + Math.min(1, block.frame * 10 / block.period) * 0.3) * canvasInfo.blockSize,
          (0.05 + Math.min(1, block.frame * 10 / block.period) * 0.15) * canvasInfo.blockSize,
          0, 0, 2 * Math.PI)
        context.fill()
        context.restore()
        break
      case constants.BLOCK_CODE_DISINTEGRATE:
        context.save()
        var particleAmount = 50
        variableAmount = 9
        hashSequence = utilMethods.generateHashSequence(Math.floor(block.x * 1000), Math.floor(block.y * 1000), particleAmount * variableAmount)
        var particleHeight = 0.5
        var rgbValue = 127 * (1 - block.frame / block.period)
        context.fillStyle = 'rgba(' + rgbValue + ', ' + rgbValue + ', ' + rgbValue + ', ' + (1 - block.frame / block.period) + ')'
        for (let i = 0; i < particleAmount; i++) {
          deltaX = 1 * block.frame / block.period * (hashSequence[0 + i * variableAmount] * 10 + hashSequence[1 + i * variableAmount] - 50) / 50
          + 0.05 * (hashSequence[2 + i * variableAmount] * 10 + hashSequence[3 + i * variableAmount] - 50) / 50
          deltaY = 1 * block.frame / block.period * (hashSequence[4 + i * variableAmount] * 10 + hashSequence[5 + i * variableAmount] - 50) / 50
          + 0.05 * (hashSequence[6 + i * variableAmount] * 10 + hashSequence[7 + i * variableAmount] - 50) / 50
          size = (5 * (hashSequence[8 + i * variableAmount] / 10) + 1) / canvasInfo.blockSize
          context.fillRect((block.x + deltaX) * canvasInfo.blockSize + canvasInfo.deltaWidth,
          (block.y + deltaY - particleHeight) * canvasInfo.blockSize + canvasInfo.deltaHeight,
          size * canvasInfo.blockSize,
          size * canvasInfo.blockSize)
        }
        context.restore()
        break
      case constants.BLOCK_CODE_WAVE:
        context.save()
        context.filter = 'blur(' + 0.04 * canvasInfo.blockSize + 'px) brightness(0.95) drop-shadow(0 0 ' + 0.03 * canvasInfo.blockSize + 'px rgba(255, 255, 255, 0.2))'
        context.beginPath()
        context.ellipse(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, block.y * canvasInfo.blockSize + canvasInfo.deltaHeight,
          (0.01 + timestamp / 100 % 10 * 0.02) * canvasInfo.blockSize,
          (0.005 + timestamp / 100 % 10 * 0.01) * canvasInfo.blockSize,
          0, 0, 2 * Math.PI)
        context.stroke()
        context.closePath()
        context.filter = 'none'
        context.restore()
        break
      case constants.BLOCK_CODE_BUBBLE:
        this.drawEffectBlock(canvasInfo, staticData, images, userInfo, block, images.effectsImage['bubbleEffect'])
        break
      case constants.BLOCK_CODE_BLACK:
        context.save()
        context.fillStyle = 'rgba(0, 0, 0, 1)'
        context.fillRect((block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth,
        (block.y - block.structure.imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        block.structure.imageSize.x * canvasInfo.blockSize + 1,
        block.structure.imageSize.y * canvasInfo.blockSize + 1)
        context.restore()
        break
      case constants.BLOCK_CODE_WHITE:
        context.save()
        context.fillStyle = 'rgba(255, 255, 255, 1)'
        context.fillRect((block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth,
        (block.y - block.structure.imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        block.structure.imageSize.x * canvasInfo.blockSize + 1,
        block.structure.imageSize.y * canvasInfo.blockSize + 1)
        context.restore()
        break
      case constants.BLOCK_CODE_TRANSPARENT:
        break
      default:
        return this.drawBlock(canvasInfo, staticData, images, userInfo, images.blockImages[block.code], block.code, 0, 0,
          { x: block.x, y: block.y },
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y }
        )
    }
    return true
  },
  drawDropBlock (canvasInfo, staticData, images, userInfo, block) {
    var context = canvasInfo.canvas.getContext('2d')
    var img
    var index = Number(block.itemNo.substr(1, block.itemNo.length - 1))
    var imageX = index % 10
    var imageY = Math.floor(index / 10)
    switch (block.itemNo.charAt(0)) {
      case constants.ITEM_CHARACTER_TOOL:
        this.drawToolBlock(canvasInfo, staticData, images, userInfo, block.itemNo,
          block.x + canvasInfo.deltaWidth / canvasInfo.blockSize,
          block.y + canvasInfo.deltaHeight / canvasInfo.blockSize,
          1)
        return true
      case constants.ITEM_CHARACTER_OUTFIT:
        var item = staticData.items[block.itemNo]
        switch (item.itemIndex) {
          case 1:
            if (block.itemNo == constants.ITEM_NO_OUTFIT_UNDERWEAR) {
              this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.itemsImage.outfit, 0.5, 0, 0.5, 0.5, block.x, block.y, 0.5, 0.5, constants.DEFAULT_BLOCK_SIZE / canvasInfo.blockSize, undefined)
            } else {
              var outfitColor
              switch (block.itemNo) {
                case constants.ITEM_NO_OUTFIT_ZGC_1:
                  outfitColor = 'rgba(0, 0, 196, 1)'
                  break
                case constants.ITEM_NO_OUTFIT_ZGC_2:
                  outfitColor = 'rgba(196, 0, 0, 1)'
                  break
                case constants.ITEM_NO_OUTFIT_SOLDIER:
                  outfitColor = 'rgba(0, 196, 0, 1)'
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_1:
                case constants.ITEM_NO_OUTFIT_SUIT_2:
                  outfitColor = 'rgba(0, 0, 0, 1)'
                  break
                case constants.ITEM_NO_OUTFIT_IJA:
                  outfitColor = 'rgba(123, 108, 77, 1)'
                  break
                case constants.ITEM_NO_OUTFIT_NRA_1:
                case constants.ITEM_NO_OUTFIT_NRA_2:
                case constants.ITEM_NO_OUTFIT_NRA_3:
                case constants.ITEM_NO_OUTFIT_NRA_4:
                case constants.ITEM_NO_OUTFIT_NRA_5:
                case constants.ITEM_NO_OUTFIT_NRA_6:
                case constants.ITEM_NO_OUTFIT_NRA_7:
                  outfitColor = this.getNraColor(block.itemNo)
                  break
              }
              this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.itemsImage.outfit, 0, 0, 0.5, 0.5, block.x, block.y, 0.5, 0.5, constants.DEFAULT_BLOCK_SIZE / canvasInfo.blockSize, outfitColor)
            }
            break
          case 2:
            this.drawHatByItemNo(canvasInfo, staticData, images, userInfo, block.itemNo, constants.OFFSET_Y_DOWNWARD, block.x, block.y, constants.DEFAULT_BLOCK_SIZE / canvasInfo.blockSize)
            break
        }
        return true
      case constants.ITEM_CHARACTER_CONSUMABLE:
        img = images.itemsImage.consumable
        break
      case constants.ITEM_CHARACTER_MATERIAL:
        img = images.itemsImage.material
        break
      case constants.ITEM_CHARACTER_JUNK:
        img = images.itemsImage.junk
        break
      case constants.ITEM_CHARACTER_AMMO:
        img = images.itemsImage.ammo
        break
      case constants.ITEM_CHARACTER_NOTE:
        img = images.itemsImage.note
        imageX = 0
        imageY = 0
        break
      case constants.ITEM_CHARACTER_RECORDING:
        img = images.itemsImage.recording
        imageX = 0
        imageY = 0
        break
    }
    context.drawImage(img, imageX * canvasInfo.imageBlockSize * 0.5, imageY * canvasInfo.imageBlockSize * 0.5,
        canvasInfo.imageBlockSize * 0.5, canvasInfo.imageBlockSize * 0.5, 
        (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
        (block.y - block.structure.imageSize.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
        canvasInfo.blockSize * 0.5, 
        canvasInfo.blockSize * 0.5)
    return true
  },
  drawEffectBlock (canvasInfo, staticData, images, userInfo, block, img) {
    var imageX = Math.floor(block.frame * 10 / block.period) % 10 * canvasInfo.imageBlockSize
    var imageY = Math.floor(block.frame * 1 / block.period) * canvasInfo.imageBlockSize
    return this.drawBlock(canvasInfo, staticData, images, userInfo, img, block.code, imageX, imageY,
      { x: block.x, y: block.y },
      { x: block.structure.imageSize.x, y: block.structure.imageSize.y }
    )
  },
  drawBlock (canvasInfo, staticData, images, userInfo, img, code, imageX, imageY, coordinate, imageSize) {
    var context = canvasInfo.canvas.getContext('2d')
    if (!utilMethods.isDef(img)) {
      img = images.blockImages[code]
      imageX = 0
      imageY = 0
    }
    if (!utilMethods.isDef(img)) {
      context.save()
      context.fillStyle = 'rgba(255, 0, 255, 1)'
      context.fillRect((coordinate.x - imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth,
      (coordinate.y - imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
      imageSize.x * canvasInfo.blockSize + 1,
      imageSize.y * canvasInfo.blockSize + 1)
      context.textAlign = 'center'
      context.font = '16px sans-serif'
      context.fillStyle = '#EEEEEE'
      context.fillText('NO RESOURCE', coordinate.x * canvasInfo.blockSize + canvasInfo.deltaWidth, coordinate.y * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize)
      context.restore()
      return false
    }
    context.drawImage(img, imageX, imageY,
      imageSize.x * canvasInfo.imageBlockSize,
      imageSize.y * canvasInfo.imageBlockSize,
      (coordinate.x - imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
      (coordinate.y - imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
      imageSize.x * canvasInfo.blockSize + 1,
      imageSize.y * canvasInfo.blockSize + 1)
    return true
  },
  drawGridBlocks (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d')
    var horizontalRadius = ((userInfo.grids[0].length - 1) / userInfo.regionInfo.width - 1) / 2
    var verticalRadius = ((userInfo.grids.length - 1) / userInfo.regionInfo.width - 1) / 2
    for (var j = 0; j < userInfo.grids.length; j++) {
      for (var i = 0; i < userInfo.grids[0].length; i++) {
        if (Math.pow(userInfo.playerInfos[userInfo.userCode].coordinate.x - (i - horizontalRadius * userInfo.regionInfo.width), 2)
        + Math.pow(userInfo.playerInfos[userInfo.userCode].coordinate.y - (j - verticalRadius * userInfo.regionInfo.height), 2)
        >= Math.pow(userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius + 2, 2)) {
          continue
        }
        if (Math.pow(userInfo.playerInfos[userInfo.userCode].coordinate.x - (i - horizontalRadius * userInfo.regionInfo.width + 1), 2)
        + Math.pow(userInfo.playerInfos[userInfo.userCode].coordinate.y - (j - verticalRadius * userInfo.regionInfo.height), 2)
        >= Math.pow(userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius + 2, 2)) {
          continue
        }
        if (Math.pow(userInfo.playerInfos[userInfo.userCode].coordinate.x - (i - horizontalRadius * userInfo.regionInfo.width), 2)
        + Math.pow(userInfo.playerInfos[userInfo.userCode].coordinate.y - (j - verticalRadius * userInfo.regionInfo.height + 1), 2)
        >= Math.pow(userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius + 2, 2)) {
          continue
        }
        if (Math.pow(userInfo.playerInfos[userInfo.userCode].coordinate.x - (i - horizontalRadius * userInfo.regionInfo.width + 1), 2)
        + Math.pow(userInfo.playerInfos[userInfo.userCode].coordinate.y - (j - verticalRadius * userInfo.regionInfo.height + 1), 2)
        >= Math.pow(userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius + 2, 2)) {
          continue
        }
        var upleftGridBlock = {
          code: String(userInfo.grids[i][j]),
          x: i - horizontalRadius * userInfo.regionInfo.width,
          y: j - verticalRadius * userInfo.regionInfo.height,
          structure: {
            imageSize: {
              x: 1,
              y: 1
            }
          }
        }
        this.createGridImage(canvasInfo, staticData, images, userInfo, upleftGridBlock, 0, 0, 0.5, 0.5)
        var uprightGridBlock = {
          code: String(userInfo.grids[i + 1][j]),
          x: i - horizontalRadius * userInfo.regionInfo.width + 0.5,
          y: j - verticalRadius * userInfo.regionInfo.height,
          structure: {
            imageSize: {
              x: 1,
              y: 1
            }
          }
        }
        this.createGridImage(canvasInfo, staticData, images, userInfo, uprightGridBlock, 0, 0.5, 0.5, 0.5)
        var downleftGridBlock = {
          code: String(userInfo.grids[i][j + 1]),
          x: i - horizontalRadius * userInfo.regionInfo.width,
          y: j - verticalRadius * userInfo.regionInfo.height + 0.5,
          structure: {
            imageSize: {
              x: 1,
              y: 1
            }
          }
        }
        this.createGridImage(canvasInfo, staticData, images, userInfo, downleftGridBlock, 0.5, 0, 0.5, 0.5)
        var downrightGridBlock = {
          code: String(userInfo.grids[i + 1][j + 1]),
          x: i - horizontalRadius * userInfo.regionInfo.width + 0.5,
          y: j - verticalRadius * userInfo.regionInfo.height + 0.5,
          structure: {
            imageSize: {
              x: 1,
              y: 1
            }
          }
        }
        this.createGridImage(canvasInfo, staticData, images, userInfo, downrightGridBlock, 0.5, 0.5, 0.5, 0.5)

        var edgeCode = utilMethods.checkEdge(upleftGridBlock.code, uprightGridBlock.code, constants.OFFSET_Y_UPWARD)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y }, 0, 0, 1, 1)
        edgeCode = utilMethods.checkEdge(upleftGridBlock.code, downleftGridBlock.code, constants.OFFSET_Y_LEFTWARD)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y }, 0, 0, 1, 1)
        edgeCode = utilMethods.checkEdge(uprightGridBlock.code, downrightGridBlock.code, constants.OFFSET_Y_RIGHTWARD)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y }, 0, 0, 1, 1)
        edgeCode = utilMethods.checkEdge(downleftGridBlock.code, downrightGridBlock.code, constants.OFFSET_Y_DOWNWARD)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y }, 0, 0, 1, 1)

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
    var gradient = context.createRadialGradient(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2, userInfo.playerInfos[userInfo.userCode].perceptionInfo.distinctVisionRadius * canvasInfo.blockSize,
      canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2, userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius * canvasInfo.blockSize) // 渐变的中心点、半径
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)') // 内部完全透明
    gradient.addColorStop(1, 'rgba(0, 0, 0, 1)') // 外部完全不透明
    context.beginPath()
    context.moveTo(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2)
    context.arc(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2, (userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius + 2) * canvasInfo.blockSize, 0, 2 * Math.PI)
    context.fillStyle = gradient
    context.fill()
    context.closePath()
    var leftDDegree = 360 - userInfo.playerInfos[userInfo.userCode].faceDirection + userInfo.playerInfos[userInfo.userCode].perceptionInfo.distinctVisionAngle / 2
    var rightDDegree = 0 - userInfo.playerInfos[userInfo.userCode].faceDirection - userInfo.playerInfos[userInfo.userCode].perceptionInfo.distinctVisionAngle / 2
    context.beginPath()
    context.moveTo(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2)
    context.arc(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2, (userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius + 2) * canvasInfo.blockSize, leftDDegree / 180 * Math.PI, rightDDegree / 180 * Math.PI, false)
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
  createGridImage (canvasInfo, staticData, images, userInfo, block, imageOffsetX, imageOffsetY, width, height) {
    // var timestamp = new Date().valueOf()
    // var tempContext = canvasInfo.tempCanvas.getContext('2d')
    var context = canvasInfo.canvas.getContext('2d')
    var img = images.blockImages[block.code]
    if (!utilMethods.isDef(img)) {
      return
    }
    switch (Number(block.code)) {
      // case constants.BLOCK_CODE_WATER_SHALLOW:
      // case constants.BLOCK_CODE_WATER_MEDIUM:
      // case constants.BLOCK_CODE_WATER_DEEP:
        // canvasInfo.tempCanvas.width = canvasInfo.imageBlockSize * 2
        // canvasInfo.tempCanvas.height = canvasInfo.imageBlockSize * 2
        // tempContext.drawImage(img, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
        //   0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
        // tempContext.drawImage(img, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
        //   0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
        // tempContext.drawImage(img, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
        //   canvasInfo.imageBlockSize, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
        // tempContext.drawImage(img, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
        //   canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
        // var imageRatio = Math.floor(timestamp * userInfo.worldInfo.windSpeed / constants.MAX_WIND_SPEED) % 2000 / 2000
        // imageRatio = Math.max(0.1, Math.min(0.9, imageRatio))
        // context.drawImage(canvasInfo.tempCanvas, (imageRatio + imageOffsetX) * canvasInfo.imageBlockSize, (imageRatio + imageOffsetY) * canvasInfo.imageBlockSize, width * canvasInfo.imageBlockSize, height * canvasInfo.imageBlockSize,
        //   block.x * canvasInfo.blockSize + canvasInfo.deltaWidth,
        //   block.y * canvasInfo.blockSize + canvasInfo.deltaHeight,
        //   width * canvasInfo.blockSize + 1,
        //   height * canvasInfo.blockSize + 1)
        // break
      default:
        context.drawImage(img, imageOffsetX * canvasInfo.imageBlockSize, imageOffsetY * canvasInfo.imageBlockSize, width * canvasInfo.imageBlockSize, height * canvasInfo.imageBlockSize,
          block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
          block.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
          width * canvasInfo.blockSize + 1,
          height * canvasInfo.blockSize + 1)
        break
    }
  },
  drawTool (canvasInfo, staticData, images, userInfo, x, y, toolIndex, offsetY, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    context.save()
    switch (offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.translate((x + 0.35) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, (y + 0.6) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight)
        context.rotate(Math.PI / 4)
        break
      case constants.OFFSET_Y_LEFTWARD:
        context.scale(-1, 1)
        context.translate(-((x) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth), (y - 0.32) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight)
        break
      case constants.OFFSET_Y_RIGHTWARD:
        context.translate((x + 0.5) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, (y + 0.6) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight)
        break
      case constants.OFFSET_Y_UPWARD:
        context.scale(-1, 1)
        context.translate(-((x + 0.1) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth), (y - 0.4) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight)
        context.rotate(-Math.PI / 4)
        break
    }
    this.drawToolBlock(canvasInfo, staticData, images, userInfo, toolIndex, 0, 0, zoomRatio)
    context.restore()
  },
  drawToolBlock (canvasInfo, staticData, images, userInfo, toolIndex, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var img, width, height
    var index = Number(toolIndex.substr(1, toolIndex.length - 1))
    // Convert specific toolIndexes
    if (index >= 301 && index <= 315) {
      // Build tool
      index = 12
    }
    switch (Math.floor(index / 100)) {
      case 0:
        // tool-s
        img = images.itemsImage.tool_s
        width = 0.5
        height = 0.25
        break
      case 1:
        // tool-m
        img = images.itemsImage.tool_m
        width = 1
        height = 0.25
        break
      case 2:
        // tool-l
        img = images.itemsImage.tool_l
        width = 1.5
        height = 0.5
        break
      default:
        // unable to display
        return
    }
    context.drawImage(img, Math.floor(index / 10) % 10 * width * canvasInfo.imageBlockSize, index % 10 * height * canvasInfo.imageBlockSize, width * canvasInfo.imageBlockSize, height * canvasInfo.imageBlockSize, 
    (x - width / 2) * canvasInfo.blockSize * zoomRatio,
    (y - height / 2) * canvasInfo.blockSize * zoomRatio,
    width * canvasInfo.blockSize * zoomRatio,
    height * canvasInfo.blockSize * zoomRatio)
  },
  
  drawBodyParts (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, bodyPart) {
    var skinColors = this.convertSkinColor(playerInfoTemp.skinColor)
    var nameColors = utilMethods.hexToRgb(playerInfoTemp.nameColor)
    var speed = Math.sqrt(Math.pow(playerInfoTemp.speed.x, 2) + Math.pow(playerInfoTemp.speed.y, 2))
    var outfitIndex
    var outfitNo
    switch (bodyPart) {
      case constants.BODY_PART_HEAD:
        if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawHead(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
        }
        break
      case constants.BODY_PART_BACK_HAIR:
        if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawHair(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
        }
        break
      case constants.BODY_PART_NECK:
        if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawNeck(canvasInfo, staticData, images, userInfo, playerInfoTemp, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        }
        break
      case constants.BODY_PART_TORSO:
        if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos[playerInfoTemp.gender - 1], offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
          if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
            for (outfitIndex in playerInfoTemp.outfits) {
              outfitNo = playerInfoTemp.outfits[outfitIndex]
              switch (outfitNo) {
                case constants.ITEM_NO_OUTFIT_ZGC_1:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos[playerInfoTemp.gender - 1], offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 196, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_ZGC_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos[playerInfoTemp.gender - 1], offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 0, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SOLDIER:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos[playerInfoTemp.gender - 1], offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 196, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_1:
                case constants.ITEM_NO_OUTFIT_SUIT_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos[playerInfoTemp.gender - 1], offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_IJA:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos[playerInfoTemp.gender - 1], offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(123, 108, 77, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_NRA_1:
                case constants.ITEM_NO_OUTFIT_NRA_2:
                case constants.ITEM_NO_OUTFIT_NRA_3:
                case constants.ITEM_NO_OUTFIT_NRA_4:
                case constants.ITEM_NO_OUTFIT_NRA_5:
                case constants.ITEM_NO_OUTFIT_NRA_6:
                case constants.ITEM_NO_OUTFIT_NRA_7:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos[playerInfoTemp.gender - 1], offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getNraColor(outfitNo))
                  break
              }
            }
          }
        }
        break
      case constants.BODY_PART_LEFT_ARM:
      case constants.BODY_PART_RIGHT_ARM:
        if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          var imgArms = bodyPart == constants.BODY_PART_LEFT_ARM ? images.bodyPartsImage.left_arms : images.bodyPartsImage.right_arms
          var imgHands = bodyPart == constants.BODY_PART_LEFT_ARM ? images.bodyPartsImage.left_hands : images.bodyPartsImage.right_hands
          var imgArmbands = bodyPart == constants.BODY_PART_LEFT_ARM ? images.bodyPartsImage.left_armbands : images.bodyPartsImage.right_armbands
          var imgZgc = bodyPart == constants.BODY_PART_LEFT_ARM ? images.bodyPartsImage.left_zgc : images.bodyPartsImage.right_zgc
          this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
          this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgHands, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
          if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
            for (outfitIndex in playerInfoTemp.outfits) {
              outfitNo = playerInfoTemp.outfits[outfitIndex]
              switch (outfitNo) {
                case constants.ITEM_NO_OUTFIT_ZGC_1:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(255, 255, 255, 1)')
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArmbands, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 196, 1)')
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgZgc, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  break
                case constants.ITEM_NO_OUTFIT_ZGC_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(255, 255, 255, 1)')
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArmbands, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 0, 0, 1)')
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgZgc, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  break
                case constants.ITEM_NO_OUTFIT_SOLDIER:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 196, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_1:
                case constants.ITEM_NO_OUTFIT_SUIT_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_IJA:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(123, 108, 77, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_NRA_1:
                case constants.ITEM_NO_OUTFIT_NRA_2:
                case constants.ITEM_NO_OUTFIT_NRA_3:
                case constants.ITEM_NO_OUTFIT_NRA_4:
                case constants.ITEM_NO_OUTFIT_NRA_5:
                case constants.ITEM_NO_OUTFIT_NRA_6:
                case constants.ITEM_NO_OUTFIT_NRA_7:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getNraColor(outfitNo))
                  break
              }
            }
          }
        }
        break
      case constants.BODY_PART_BREAST:
        if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP
          && playerInfoTemp.gender == constants.GENDER_FEMALE) {
          var showBreasts = true
          if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
            for (outfitIndex in playerInfoTemp.outfits) {
              outfitNo = playerInfoTemp.outfits[outfitIndex]
              switch (outfitNo) {
                case constants.ITEM_NO_OUTFIT_UNDERWEAR:
                  showBreasts = false
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 7, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, nameColors)
                  break
                case constants.ITEM_NO_OUTFIT_ZGC_1:
                  showBreasts = false
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 196, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_ZGC_2:
                  showBreasts = false
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 0, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SOLDIER:
                  showBreasts = false
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 196, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_1:
                  showBreasts = false
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_2:
                  showBreasts = false
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_IJA:
                  showBreasts = false
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(123, 108, 77, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_NRA_1:
                case constants.ITEM_NO_OUTFIT_NRA_2:
                case constants.ITEM_NO_OUTFIT_NRA_3:
                case constants.ITEM_NO_OUTFIT_NRA_4:
                case constants.ITEM_NO_OUTFIT_NRA_5:
                case constants.ITEM_NO_OUTFIT_NRA_6:
                case constants.ITEM_NO_OUTFIT_NRA_7:
                  showBreasts = false
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getNraColor(outfitNo))
                  break
              }
            }
          }
          if (showBreasts) {
            this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
          }
        }
        break
      case constants.BODY_PART_OUTFIT_DECORATION:
        if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
            for (outfitIndex in playerInfoTemp.outfits) {
              outfitNo = playerInfoTemp.outfits[outfitIndex]
              switch (outfitNo) {
                case constants.ITEM_NO_OUTFIT_UNDERWEAR:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 8, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, nameColors)
                  break
                case constants.ITEM_NO_OUTFIT_ZGC_1:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 1, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  break
                case constants.ITEM_NO_OUTFIT_ZGC_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 1, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  break
                case constants.ITEM_NO_OUTFIT_SOLDIER:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 5, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_1:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 2, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 3, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                  break
                case constants.ITEM_NO_OUTFIT_IJA:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 4, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(123, 108, 77, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_NRA_1:
                case constants.ITEM_NO_OUTFIT_NRA_2:
                case constants.ITEM_NO_OUTFIT_NRA_3:
                case constants.ITEM_NO_OUTFIT_NRA_4:
                case constants.ITEM_NO_OUTFIT_NRA_5:
                case constants.ITEM_NO_OUTFIT_NRA_6:
                case constants.ITEM_NO_OUTFIT_NRA_7:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 4, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getNraColor(outfitNo))
                  break
              }
            }
          }
        }
        break
      case constants.BODY_PART_ACCESSORIES:
        if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
          && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP
          && playerInfoTemp.gender == constants.GENDER_FEMALE) {
          this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.accessories, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        }
        break
      case constants.BODY_PART_LEFT_LEG:
      case constants.BODY_PART_RIGHT_LEG:
        if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_SHALLOW
          && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
          && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          var imgFeet = bodyPart == constants.BODY_PART_LEFT_LEG ? images.bodyPartsImage.left_feet : images.bodyPartsImage.right_feet
          var imgLegs = bodyPart == constants.BODY_PART_LEFT_LEG ? images.bodyPartsImage.left_legs : images.bodyPartsImage.right_legs
          this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
          if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
            for (outfitIndex in playerInfoTemp.outfits) {
              outfitNo = playerInfoTemp.outfits[outfitIndex]
              switch (outfitNo) {
                case constants.ITEM_NO_OUTFIT_ZGC_1:
                  case constants.ITEM_NO_OUTFIT_ZGC_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 196, 196, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SOLDIER:
                case constants.ITEM_NO_OUTFIT_IJA:
                case constants.ITEM_NO_OUTFIT_NRA_1:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(128, 64, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_1:
                case constants.ITEM_NO_OUTFIT_SUIT_2:
                case constants.ITEM_NO_OUTFIT_NRA_2:
                case constants.ITEM_NO_OUTFIT_NRA_3:
                case constants.ITEM_NO_OUTFIT_NRA_4:
                case constants.ITEM_NO_OUTFIT_NRA_5:
                case constants.ITEM_NO_OUTFIT_NRA_6:
                case constants.ITEM_NO_OUTFIT_NRA_7:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(16, 16, 16, 1)')
                  break
              }
            }
          }
        }
        if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
          && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
          if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
            for (outfitIndex in playerInfoTemp.outfits) {
              outfitNo = playerInfoTemp.outfits[outfitIndex]
              switch (outfitNo) {
                case constants.ITEM_NO_OUTFIT_ZGC_1:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 196, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_ZGC_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 0, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SOLDIER:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 98, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_SUIT_1:
                case constants.ITEM_NO_OUTFIT_SUIT_2:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_IJA:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(123, 108, 77, 1)')
                  break
                case constants.ITEM_NO_OUTFIT_NRA_1:
                case constants.ITEM_NO_OUTFIT_NRA_2:
                case constants.ITEM_NO_OUTFIT_NRA_3:
                case constants.ITEM_NO_OUTFIT_NRA_4:
                case constants.ITEM_NO_OUTFIT_NRA_5:
                case constants.ITEM_NO_OUTFIT_NRA_6:
                case constants.ITEM_NO_OUTFIT_NRA_7:
                  this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getNraColor(outfitNo))
                  break
              }
            }
          }
        }
        break
    }
  },
  drawBodyPart (canvasInfo, staticData, images, userInfo, img, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, color) {
    if (!utilMethods.isDef(img)) {
      return
    }
    canvasInfo.tempCanvas.width = xCoef * canvasInfo.blockSize * zoomRatio
    canvasInfo.tempCanvas.height = yCoef * canvasInfo.blockSize * zoomRatio
    var tempContext = canvasInfo.tempCanvas.getContext('2d')
    tempContext.drawImage(img, offsetX * canvasInfo.imageBlockSize, offsetY * canvasInfo.imageBlockSize,
      imageX * canvasInfo.imageBlockSize, imageY * canvasInfo.imageBlockSize, 
      0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
    if (utilMethods.isDef(color)) {
      var rgbArray = utilMethods.rgbaStrToRgb(color)
      var imageData = tempContext.getImageData(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
      var data = imageData.data
      for (var i = 0; i < data.length; i += 4) {
        data[i + 0] = Math.min(255, data[i + 0] * 1.25) * rgbArray[0] / 255
        data[i + 1] = Math.min(255, data[i + 1] * 1.25) * rgbArray[1] / 255
        data[i + 2] = Math.min(255, data[i + 2] * 1.25) * rgbArray[2] / 255
      }
      tempContext.putImageData(imageData, 0, 0)
    }
    var context = canvasInfo.canvas.getContext('2d')
    context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height,
      x * canvasInfo.blockSize * zoomRatio - canvasInfo.tempCanvas.width / 2 + canvasInfo.deltaWidth,
      y * canvasInfo.blockSize * zoomRatio - canvasInfo.tempCanvas.height / 2 + canvasInfo.deltaHeight,
      xCoef * canvasInfo.blockSize * zoomRatio, yCoef * canvasInfo.blockSize * zoomRatio)
  },
  convertSkinColor (skinColor) {
    var colors = []
    var rgbArray = [[235, 224, 200], [224, 178, 153], [160, 105, 79], [150, 100, 67], [40, 26, 13]]
    var selectedRgb
    if (skinColor >= 0 && skinColor < 25) {
      selectedRgb = [
        Math.floor(rgbArray[0][0] + (rgbArray[1][0] - rgbArray[0][0]) * (skinColor % 25) / 25),
        Math.floor(rgbArray[0][1] + (rgbArray[1][1] - rgbArray[0][1]) * (skinColor % 25) / 25),
        Math.floor(rgbArray[0][2] + (rgbArray[1][2] - rgbArray[0][2]) * (skinColor % 25) / 25)
      ]
    } else if (skinColor >= 25 && skinColor < 50) {
      selectedRgb = [
        Math.floor(rgbArray[1][0] + (rgbArray[2][0] - rgbArray[1][0]) * (skinColor % 25) / 25),
        Math.floor(rgbArray[1][1] + (rgbArray[2][1] - rgbArray[1][1]) * (skinColor % 25) / 25),
        Math.floor(rgbArray[1][2] + (rgbArray[2][2] - rgbArray[1][2]) * (skinColor % 25) / 25)
      ]
    } else if (skinColor >= 50 && skinColor < 75) {
      selectedRgb = [
        Math.floor(rgbArray[2][0] + (rgbArray[3][0] - rgbArray[2][0]) * (skinColor % 25) / 25),
        Math.floor(rgbArray[2][1] + (rgbArray[3][1] - rgbArray[2][1]) * (skinColor % 25) / 25),
        Math.floor(rgbArray[2][2] + (rgbArray[3][2] - rgbArray[2][2]) * (skinColor % 25) / 25)
      ]
    } else if (skinColor >= 75 && skinColor < 100) {
      selectedRgb = [
        Math.floor(rgbArray[3][0] + (rgbArray[4][0] - rgbArray[3][0]) * (skinColor % 25) / 25),
        Math.floor(rgbArray[3][1] + (rgbArray[4][1] - rgbArray[3][1]) * (skinColor % 25) / 25),
        Math.floor(rgbArray[3][2] + (rgbArray[4][2] - rgbArray[3][2]) * (skinColor % 25) / 25)
      ]
    } else {
      selectedRgb = rgbArray[4]
    }
    colors.push('rgba(' + Math.floor(selectedRgb[0] * 0.75) + ', ' + Math.floor(selectedRgb[1] * 0.75) + ', ' + Math.floor(selectedRgb[2] * 0.75) + ', 1)')
    colors.push('rgba(' + selectedRgb[0] + ', ' + selectedRgb[1] + ', ' + selectedRgb[2] + ', 1)')
    return colors
  },
  drawNeck (canvasInfo, staticData, images, userInfo, playerInfoTemp, x, y, xCoef, yCoef, zoomRatio, color) {
    var context = canvasInfo.canvas.getContext('2d')
    var neckWidth = 0.075 * xCoef * canvasInfo.blockSize * zoomRatio
    var neckHeight = 0.3 * yCoef * canvasInfo.blockSize * zoomRatio
    context.fillStyle = color
    context.beginPath()
    context.fillRect(
      x * canvasInfo.blockSize * zoomRatio - neckWidth / 2 + canvasInfo.deltaWidth,
      y * canvasInfo.blockSize * zoomRatio - neckHeight / 2 + canvasInfo.deltaHeight,
      neckWidth, neckHeight)
    context.closePath()
    context.fill()
  },
  drawHair (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var width = canvasInfo.blockSize * zoomRatio
    var height = canvasInfo.blockSize * zoomRatio
    canvasInfo.tempCanvas.width = width
    canvasInfo.tempCanvas.height = height
    var tempContext = canvasInfo.tempCanvas.getContext('2d')
    var rgbArray = utilMethods.hexToRgb(playerInfoTemp.hairColor)
    if (playerInfoTemp.hairStyle != -1) {
      tempContext.drawImage(images.bodyPartsImage.hairstyles, playerInfoTemp.hairstyle % 10 * canvasInfo.imageBlockSize, (Math.floor(playerInfoTemp.hairstyle / 10) * 4 + offsetY) * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        0, 0, canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio)
    }
    this.mixColor(canvasInfo, rgbArray)
    context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio,
      x * canvasInfo.blockSize * zoomRatio - width / 2 + canvasInfo.deltaWidth,
      y * canvasInfo.blockSize * zoomRatio - height / 2 + canvasInfo.deltaHeight - height * 0.2 * (coefs[0] - 1),
      canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio)
  },
  drawHead (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var width = canvasInfo.blockSize * zoomRatio
    var height = canvasInfo.blockSize * zoomRatio
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    var upLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * (1 + (coefs[2] - 0.5)), y: centerHeadPoint.y - height * 0.2 * coefs[0]}
    var downLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * coefs[3], y: centerHeadPoint.y + height * 0.3 * coefs[1]}
    var downRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * coefs[3], y: centerHeadPoint.y + height * 0.3 * coefs[1]}
    var upRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * (1 + (coefs[2] - 0.5)), y: centerHeadPoint.y - height * 0.2 * coefs[0]}
    var faceEdgeCoef = offsetY === 0 || offsetY === 4 ? coefs[5] : coefs[9]
    var leftControlPoint = {x: upLeftHeadPoint.x - width * (faceEdgeCoef - 0.5), y: centerHeadPoint.y}
    var downControlPoint = {x: centerHeadPoint.x, y: downLeftHeadPoint.y + height * coefs[6]}
    var rightControlPoint = {x: upRightHeadPoint.x + width * (faceEdgeCoef - 0.5), y: centerHeadPoint.y}
    var upControlPoint = {x: centerHeadPoint.x, y: upLeftHeadPoint.y - height * coefs[4]}
    var colors = this.convertSkinColor(Number(playerInfoTemp.skinColor))
    context.strokeStyle = colors[0]
    var gradient
    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        gradient = context.createRadialGradient(centerHeadPoint.x, centerHeadPoint.y, height / 4,
          centerHeadPoint.x, centerHeadPoint.y + height / 8, height / 8)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1])
        break
      case constants.OFFSET_Y_LEFTWARD:
        gradient = context.createRadialGradient(centerHeadPoint.x, centerHeadPoint.y, height / 4,
          centerHeadPoint.x - width / 8, centerHeadPoint.y + height / 8, height / 8)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1])
        break
      case constants.OFFSET_Y_RIGHTWARD:
        gradient = context.createRadialGradient(centerHeadPoint.x, centerHeadPoint.y, height / 4,
          centerHeadPoint.x + width / 8, centerHeadPoint.y + height / 8, height / 8)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1])
        break
      case constants.OFFSET_Y_UPWARD:
        gradient = context.createRadialGradient(centerHeadPoint.x, centerHeadPoint.y, height / 4,
          centerHeadPoint.x, centerHeadPoint.y - height / 8, height / 8)
        gradient.addColorStop(0, colors[1])
        gradient.addColorStop(1, colors[0])
        break
    }
    context.fillStyle = gradient
    context.beginPath()
    context.moveTo(upLeftHeadPoint.x, upLeftHeadPoint.y)
    context.quadraticCurveTo(leftControlPoint.x, leftControlPoint.y, downLeftHeadPoint.x, downLeftHeadPoint.y)
    context.quadraticCurveTo(downControlPoint.x, downControlPoint.y, downRightHeadPoint.x, downRightHeadPoint.y)
    context.quadraticCurveTo(rightControlPoint.x, rightControlPoint.y, upRightHeadPoint.x, upRightHeadPoint.y)
    context.quadraticCurveTo(upControlPoint.x, upControlPoint.y, upLeftHeadPoint.x, upLeftHeadPoint.y)
    context.closePath()
    context.fill()
    context.stroke()

    // Draw eyes
    this.drawEyes(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
    // Draw nose, mouth
    this.drawNoseAndMouth(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
    // Draw top hair
    this.drawHair(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
    // Draw eyebrows, moustache, beard
    this.drawHeadHair(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
    // Draw hat
    for (var outfitIndex in playerInfoTemp.outfits) {
      var outfitNo = playerInfoTemp.outfits[outfitIndex]
      this.drawHatByItemNo(canvasInfo, staticData, images, userInfo, outfitNo, offsetY, x, y - 0.2 * (coefs[0] - 1), zoomRatio)
    }
  },
  drawEyes (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var width = canvasInfo.blockSize * zoomRatio
    var height = canvasInfo.blockSize * zoomRatio
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    var eyesY = centerHeadPoint.y + height * coefs[7] * coefs[13] * zoomRatio - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio
    // Blinking eyes
    var timestamp = new Date().valueOf()
    if (timestamp % 4000 >= 10) {
      switch(offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
          context.drawImage(images.bodyPartsImage.eyes, (playerInfoTemp.eyes % 5 * 2) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyes / 5) * canvasInfo.imageBlockSize,
            canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
            centerHeadPoint.x - width * coefs[8] - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyesY,
            canvasInfo.blockSize * coefs[13] * zoomRatio, canvasInfo.blockSize * coefs[13] * zoomRatio)
          context.drawImage(images.bodyPartsImage.eyes, (playerInfoTemp.eyes % 5 * 2 + 1) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyes / 5) * canvasInfo.imageBlockSize,
            canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
            centerHeadPoint.x + width * coefs[8] - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyesY,
            canvasInfo.blockSize * coefs[13] * zoomRatio, canvasInfo.blockSize * coefs[13] * zoomRatio)
          break
        case constants.OFFSET_Y_LEFTWARD:
          context.drawImage(images.bodyPartsImage.eyes, (playerInfoTemp.eyes % 5 * 2 + 1) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyes / 5) * canvasInfo.imageBlockSize,
            canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
            centerHeadPoint.x - width * coefs[8] - 0.375 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyesY,
            canvasInfo.blockSize * coefs[13] * zoomRatio * 0.75, canvasInfo.blockSize * coefs[13] * zoomRatio)
          break
        case constants.OFFSET_Y_RIGHTWARD:
          context.drawImage(images.bodyPartsImage.eyes, (playerInfoTemp.eyes % 5 * 2) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyes / 5) * canvasInfo.imageBlockSize,
            canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
            centerHeadPoint.x + width * coefs[8] - 0.375 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyesY,
            canvasInfo.blockSize * coefs[13] * zoomRatio * 0.75, canvasInfo.blockSize * coefs[13] * zoomRatio)
          break
        case constants.OFFSET_Y_UPWARD:
          break
      }
    }
  },
  drawNoseAndMouth (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var colors = this.convertSkinColor(Number(playerInfoTemp.skinColor))
    // x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth,
    // y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight,
    var head2Nose = 0.18 * coefs[10] / 2
    var head2Mouth = 0.35 * coefs[10] / 2
    var noseRatio = 0.25
    var mouthRatio = 0.25
    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.nose,
          playerInfoTemp.nose % 10, Math.floor(playerInfoTemp.nose / 10), 1, 1, x, y + head2Nose,
          noseRatio, noseRatio, zoomRatio, colors[1])
        this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.mouth,
          playerInfoTemp.mouth % 10, Math.floor(playerInfoTemp.mouth / 10), 1, 1, x, y + head2Mouth,
          mouthRatio, mouthRatio, zoomRatio, colors[1])
        break
      case constants.OFFSET_Y_LEFTWARD:
        this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.mouth,
          playerInfoTemp.mouth % 10 + 0.5, Math.floor(playerInfoTemp.mouth / 10), 0.5, 1, x + 0.08 * (0.4 - coefs[3]), y + head2Mouth,
          mouthRatio * 0.5, mouthRatio, zoomRatio, colors[1])
        break
      case constants.OFFSET_Y_RIGHTWARD:
        this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.mouth,
          playerInfoTemp.mouth % 10, Math.floor(playerInfoTemp.mouth / 10), 0.5, 1, x - 0.08 * (0.4 - coefs[3]), y + head2Mouth,
          mouthRatio * 0.5, mouthRatio, zoomRatio, colors[1])
        break
      case constants.OFFSET_Y_UPWARD:
        break
    }
  },
  drawHeadHair (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var width = canvasInfo.blockSize * zoomRatio
    var height = canvasInfo.blockSize * zoomRatio
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    canvasInfo.tempCanvas.width = width
    canvasInfo.tempCanvas.height = height
    var tempContext = canvasInfo.tempCanvas.getContext('2d')
    var rgbArray = utilMethods.hexToRgb(playerInfoTemp.hairColor)
    var eyesY = centerHeadPoint.y + height * coefs[7] * coefs[13] * zoomRatio - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio
    var eyebrowsY = eyesY + (centerHeadPoint.y - height / 2 - eyesY) * 0.15
    var mouthY = centerHeadPoint.y + 0.15 * coefs[10]
    var moustacheY = mouthY
    var moustacheRatio = 0.25
    var beardY = mouthY + height * 0.27 * coefs[1]
    var beardRatio = 0.15
    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        tempContext.drawImage(images.bodyPartsImage.eyebrows, (playerInfoTemp.eyebrows % 5 * 2) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyebrows / 5) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x - width * coefs[8] - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyebrowsY,
          canvasInfo.blockSize * coefs[13] * zoomRatio, canvasInfo.blockSize * coefs[13] * zoomRatio)

        tempContext.clearRect(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
        tempContext.drawImage(images.bodyPartsImage.eyebrows, (playerInfoTemp.eyebrows % 5 * 2 + 1) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyebrows / 5) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x + width * coefs[8] - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyebrowsY,
          canvasInfo.blockSize * coefs[13] * zoomRatio, canvasInfo.blockSize * coefs[13] * zoomRatio)

        tempContext.clearRect(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
        tempContext.drawImage(images.bodyPartsImage.moustache, (playerInfoTemp.moustache % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.moustache / 10) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x - 0.5 * canvasInfo.blockSize * moustacheRatio * zoomRatio, moustacheY,
          canvasInfo.blockSize * moustacheRatio * zoomRatio, canvasInfo.blockSize * moustacheRatio * zoomRatio)

        tempContext.clearRect(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
        tempContext.drawImage(images.bodyPartsImage.beard, (playerInfoTemp.beard % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.beard / 10) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x - 0.5 * canvasInfo.blockSize * beardRatio * zoomRatio, beardY,
          canvasInfo.blockSize * beardRatio * zoomRatio, canvasInfo.blockSize * beardRatio * zoomRatio)
        break
      case constants.OFFSET_Y_LEFTWARD:
        tempContext.drawImage(images.bodyPartsImage.eyebrows, (playerInfoTemp.eyebrows % 5 * 2 + 1) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyebrows / 5) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x - width * coefs[8] - 0.375 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyebrowsY,
          canvasInfo.blockSize * coefs[13] * zoomRatio * 0.75, canvasInfo.blockSize * coefs[13] * zoomRatio)

        tempContext.clearRect(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
        tempContext.drawImage(images.bodyPartsImage.moustache, (playerInfoTemp.moustache % 10 + 0.5) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.moustache / 10) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x + 0.3 * (-0.7 - coefs[3]) * canvasInfo.blockSize * moustacheRatio * zoomRatio, moustacheY,
          canvasInfo.blockSize * moustacheRatio * zoomRatio / 2, canvasInfo.blockSize * moustacheRatio * zoomRatio)

        tempContext.clearRect(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
        tempContext.drawImage(images.bodyPartsImage.beard, (playerInfoTemp.beard % 10 + 0.5) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.beard / 10) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x + 0.3 * (-0.7 - coefs[3]) * canvasInfo.blockSize * beardRatio * zoomRatio, beardY,
          canvasInfo.blockSize * beardRatio * zoomRatio / 2, canvasInfo.blockSize * beardRatio * zoomRatio)
        break
      case constants.OFFSET_Y_RIGHTWARD:
        tempContext.drawImage(images.bodyPartsImage.eyebrows, (playerInfoTemp.eyebrows % 5 * 2) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyebrows / 5) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x + width * coefs[8] - 0.375 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyebrowsY,
          canvasInfo.blockSize * coefs[13] * zoomRatio * 0.75, canvasInfo.blockSize * coefs[13] * zoomRatio)

        tempContext.clearRect(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
        tempContext.drawImage(images.bodyPartsImage.moustache, (playerInfoTemp.moustache % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.moustache / 10) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x - 0.3 * (0.9 - coefs[3]) * canvasInfo.blockSize * moustacheRatio * zoomRatio, moustacheY,
          canvasInfo.blockSize * moustacheRatio * zoomRatio / 2, canvasInfo.blockSize * moustacheRatio * zoomRatio)

        tempContext.clearRect(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
        tempContext.drawImage(images.bodyPartsImage.beard, (playerInfoTemp.beard % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.beard / 10) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x - 0.3 * (0.9 - coefs[3]) * canvasInfo.blockSize * beardRatio * zoomRatio, beardY,
          canvasInfo.blockSize * beardRatio * zoomRatio / 2, canvasInfo.blockSize * beardRatio * zoomRatio)
        break
      case constants.OFFSET_Y_UPWARD:
        break
    }
  },
  drawHatByItemNo (canvasInfo, staticData, images, userInfo, outfitNo, offsetY, x, y, zoomRatio) {
    switch (outfitNo) {
      case constants.ITEM_NO_OUTFIT_HAT_FARMER:
        this.drawHat(canvasInfo, staticData, images, userInfo, 0, 0, x, y, zoomRatio, 'rgba(140, 140, 0, 1)')
        this.drawHat(canvasInfo, staticData, images, userInfo, 1, 0, x, y, zoomRatio, 'rgba(160, 160, 0, 1)')
        break
      case constants.ITEM_NO_OUTFIT_HAT_RANGER:
        this.drawHat(canvasInfo, staticData, images, userInfo, 0, 0, x, y, zoomRatio, 'rgba(56, 42, 0, 1)')
        this.drawHat(canvasInfo, staticData, images, userInfo, 1, 0, x, y, zoomRatio, 'rgba(64, 48, 0, 1)')
        break
      case constants.ITEM_NO_OUTFIT_HAT_WHITE:
        this.drawHat(canvasInfo, staticData, images, userInfo, 1, 0, x, y, zoomRatio, undefined)
        break
      case constants.ITEM_NO_OUTFIT_HAT_BOWLER:
        this.drawHat(canvasInfo, staticData, images, userInfo, 0, 0, x, y, zoomRatio, 'rgba(28, 28, 28, 1)')
        this.drawHat(canvasInfo, staticData, images, userInfo, 1, 0, x, y, zoomRatio, 'rgba(32, 32, 32, 1)')
        break
      case constants.ITEM_NO_OUTFIT_HAT_TOP:
        this.drawHat(canvasInfo, staticData, images, userInfo, 0, 0, x, y, zoomRatio, 'rgba(28, 28, 28, 1)')
        this.drawHat(canvasInfo, staticData, images, userInfo, 2, 0, x, y, zoomRatio, 'rgba(32, 32, 32, 1)')
        break
      case constants.ITEM_NO_OUTFIT_HAT_RED:
        this.drawHat(canvasInfo, staticData, images, userInfo, 2, 0, x, y, zoomRatio, 'rgba(196, 0, 0, 1)')
        break
      case constants.ITEM_NO_OUTFIT_CAP_IJA:
        this.drawHat(canvasInfo, staticData, images, userInfo, 7, 0, x, y, zoomRatio, 'rgba(123, 108, 77, 1)')
        switch (offsetY) {
          case constants.OFFSET_Y_DOWNWARD:
            this.drawHat(canvasInfo, staticData, images, userInfo, 4, 0, x, y, zoomRatio, 'rgba(123, 108, 77, 1)')
            this.drawHat(canvasInfo, staticData, images, userInfo, 9, 0, x, y, zoomRatio, undefined)
            break
          case constants.OFFSET_Y_LEFTWARD:
            this.drawHat(canvasInfo, staticData, images, userInfo, 5, 0, x, y, zoomRatio, 'rgba(123, 108, 77, 1)')
            break
          case constants.OFFSET_Y_RIGHTWARD:
            this.drawHat(canvasInfo, staticData, images, userInfo, 6, 0, x, y, zoomRatio, 'rgba(123, 108, 77, 1)')
            break
          case constants.OFFSET_Y_UPWARD:
            break
        }
        break
      case constants.ITEM_NO_OUTFIT_CAP_NRA_1:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_2:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_3:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_4:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_5:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_6:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_7:
        var nraColor = this.getNraColor(outfitNo)
        this.drawHat(canvasInfo, staticData, images, userInfo, 3, 0, x, y, zoomRatio, nraColor)
        switch (offsetY) {
          case constants.OFFSET_Y_DOWNWARD:
            this.drawHat(canvasInfo, staticData, images, userInfo, 4, 0, x, y, zoomRatio, nraColor)
            this.drawHat(canvasInfo, staticData, images, userInfo, 8, 0, x, y, zoomRatio, undefined)
            break
          case constants.OFFSET_Y_LEFTWARD:
            this.drawHat(canvasInfo, staticData, images, userInfo, 5, 0, x, y, zoomRatio, nraColor)
            break
          case constants.OFFSET_Y_RIGHTWARD:
            this.drawHat(canvasInfo, staticData, images, userInfo, 6, 0, x, y, zoomRatio, nraColor)
            break
          case constants.OFFSET_Y_UPWARD:
            break
        }
        break
    }
  },
  drawHat (canvasInfo, staticData, images, userInfo, offsetX, offsetY, x, y, zoomRatio, color) {
    var context = canvasInfo.canvas.getContext('2d')
    var width = canvasInfo.blockSize * zoomRatio
    var height = canvasInfo.blockSize * zoomRatio
    canvasInfo.tempCanvas.width = width
    canvasInfo.tempCanvas.height = height
    var tempContext = canvasInfo.tempCanvas.getContext('2d')
    if (utilMethods.isDef(color)) {
      var rgbArray = utilMethods.rgbaStrToRgb(color)
    }
    tempContext.drawImage(images.bodyPartsImage.hat, offsetX * canvasInfo.imageBlockSize, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
      0, 0, canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio)
    if (utilMethods.isDef(color)) {
      this.mixColor(canvasInfo, rgbArray)
    }
    context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio,
      x * canvasInfo.blockSize * zoomRatio - width / 2 + canvasInfo.deltaWidth,
      y * canvasInfo.blockSize * zoomRatio - height / 2 + canvasInfo.deltaHeight,
      canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio)
  },
  mixColor (canvasInfo, rgbArray) {
    var tempContext = canvasInfo.tempCanvas.getContext('2d')
    var imageData = tempContext.getImageData(0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
    var data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i + 0] = Math.min(rgbArray[0], (data[i + 0] + rgbArray[0]) / 2)
      data[i + 1] = Math.min(rgbArray[1], (data[i + 1] + rgbArray[1]) / 2)
      data[i + 2] = Math.min(rgbArray[2], (data[i + 2] + rgbArray[2]) / 2)
    }
    tempContext.putImageData(imageData, 0, 0)
  },
  getNraColor (outfitNo) {
    var nraColor
    switch (outfitNo) {
      case constants.ITEM_NO_OUTFIT_NRA_1:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_1:
        nraColor = 'rgba(60, 52, 37, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_2:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_2:
        nraColor = 'rgba(216, 189, 132, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_3:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_3:
        nraColor = 'rgba(162, 169, 175, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_4:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_4:
        nraColor = 'rgba(66, 88, 117, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_5:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_5:
        nraColor = 'rgba(182, 215, 168, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_6:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_6:
        nraColor = 'rgba(28, 42, 67, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_7:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_7:
        nraColor = 'rgba(172, 222, 238, 1)'
        break
    }
    return nraColor
  }
}
