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
        context.fillStyle = 'rgba(196, 0, 0, ' + 0.8 * (1 - block.frame / block.period) + ')'
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
      case constants.BLOCK_CODE_NO_RESOURCE:
        context.save()
        context.fillStyle = 'rgba(255, 0, 255, 1)'
        context.fillRect((block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth,
        (block.y - block.structure.imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        block.structure.imageSize.x * canvasInfo.blockSize + 1,
        block.structure.imageSize.y * canvasInfo.blockSize + 1)
        context.textAlign = 'center'
        context.font = '16px sans-serif'
        context.fillStyle = '#EEEEEE'
        context.fillText('NO RESOURCE', block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, block.y * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize)
        context.restore()
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
      default:
        return this.drawBlock(canvasInfo, staticData, images, userInfo, block, images.blockImages[block.code], 0, 0)
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
        img = images.itemsImage.outfit
        break
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
    if (!utilMethods.isDef(img)) {
      img = images.blockImages[block.code]
      imageX = 0
      imageY = 0
    }
    return this.drawBlock(canvasInfo, staticData, images, userInfo, block, img, imageX, imageY)
  },
  drawBlock (canvasInfo, staticData, images, userInfo, block, img, imageX, imageY) {
    var context = canvasInfo.canvas.getContext('2d')
    if (!utilMethods.isDef(img)) {
      var blockTemp = Object.assign({}, block)
      blockTemp.code = constants.BLOCK_CODE_NO_RESOURCE
      return this.drawBlockByCode(canvasInfo, staticData, images, userInfo, blockTemp)
    }
    context.drawImage(img, imageX, imageY,
      block.structure.imageSize.x * canvasInfo.imageBlockSize,
      block.structure.imageSize.y * canvasInfo.imageBlockSize,
      (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
      (block.y - block.structure.imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
      block.structure.imageSize.x * canvasInfo.blockSize + 1,
      block.structure.imageSize.y * canvasInfo.blockSize + 1)
    return true
  },
  drawGridBlocks (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
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
        this.createGridImage(canvasInfo, canvasInfo.tempCanvas, staticData, images, userInfo, upleftGridBlock, 0, 0)
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
        this.createGridImage(canvasInfo, canvasInfo.tempCanvas, staticData, images, userInfo, uprightGridBlock, 0, 0.5)
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
        this.createGridImage(canvasInfo, canvasInfo.tempCanvas, staticData, images, userInfo, downleftGridBlock, 0.5, 0)
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
        this.createGridImage(canvasInfo, canvasInfo.tempCanvas, staticData, images, userInfo, downrightGridBlock, 0.5, 0.5)
        switch (this.checkEdge(upleftGridBlock.code, uprightGridBlock.code)) {
          case constants.EDGE_TYPE_SAND:
            context.drawImage(images.blockImages[constants.BLOCK_CODE_EDGE_SAND_UP], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
              upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
              upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
              canvasInfo.blockSize + 1, 
              canvasInfo.blockSize + 1)
            break
          case constants.EDGE_TYPE_DIRT:
            context.drawImage(images.blockImages[constants.BLOCK_CODE_EDGE_DIRT_UP], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
              upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
              upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
              canvasInfo.blockSize + 1, 
              canvasInfo.blockSize + 1)
            break
        }
        switch (this.checkEdge(upleftGridBlock.code, downleftGridBlock.code)) {
          case constants.EDGE_TYPE_SAND:
            context.drawImage(images.blockImages[constants.BLOCK_CODE_EDGE_SAND_LEFT], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
              upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
              upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
              canvasInfo.blockSize + 1, 
              canvasInfo.blockSize + 1)
            break
          case constants.EDGE_TYPE_DIRT:
            context.drawImage(images.blockImages[constants.BLOCK_CODE_EDGE_DIRT_LEFT], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
              upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
              upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
              canvasInfo.blockSize + 1, 
              canvasInfo.blockSize + 1)
            break
        }
        switch (this.checkEdge(uprightGridBlock.code, downrightGridBlock.code)) {
          case constants.EDGE_TYPE_SAND:
            context.drawImage(images.blockImages[constants.BLOCK_CODE_EDGE_SAND_RIGHT], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
              upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
              upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
              canvasInfo.blockSize + 1, 
              canvasInfo.blockSize + 1)
            break
          case constants.EDGE_TYPE_DIRT:
            context.drawImage(images.blockImages[constants.BLOCK_CODE_EDGE_DIRT_RIGHT], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
              upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
              upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
              canvasInfo.blockSize + 1, 
              canvasInfo.blockSize + 1)
            break
        }
        switch (this.checkEdge(downleftGridBlock.code, downrightGridBlock.code)) {
          case constants.EDGE_TYPE_SAND:
            context.drawImage(images.blockImages[constants.BLOCK_CODE_EDGE_SAND_DOWN], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
              upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
              upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
              canvasInfo.blockSize + 1, 
              canvasInfo.blockSize + 1)
            break
          case constants.EDGE_TYPE_DIRT:
            context.drawImage(images.blockImages[constants.BLOCK_CODE_EDGE_DIRT_DOWN], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
              upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
              upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
              canvasInfo.blockSize + 1, 
              canvasInfo.blockSize + 1)
            break
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
  createGridImage (canvasInfo, tempCanvas, staticData, images, userInfo, block, imageOffsetX, imageOffsetY) {
    var img
    // if (block.code == constants.BLOCK_CODE_WATER) {
    //   var timestamp = new Date().valueOf()
    //   var offsetX = timestamp * userInfo.worldInfo.windSpeed * (Math.cos(userInfo.worldInfo.windDirection / 180 * Math.PI) + 1) % canvasInfo.blockSize
    //   var offsetY = (- timestamp * userInfo.worldInfo.windSpeed * (Math.sin(userInfo.worldInfo.windDirection / 180 * Math.PI) - 1)) % canvasInfo.blockSize
    //   tempCanvas.width = canvasInfo.blockSize
    //   tempCanvas.height = canvasInfo.blockSize
    //   var tempContext = tempCanvas.getContext('2d')
    //   tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX - canvasInfo.blockSize, offsetY - canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX - canvasInfo.blockSize, offsetY, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX - canvasInfo.blockSize, offsetY + canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX, offsetY - canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX, offsetY, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX, offsetY + canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX + canvasInfo.blockSize, offsetY - canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX + canvasInfo.blockSize, offsetY, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX + canvasInfo.blockSize, offsetY + canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
    //   img = tempCanvas
    // } else {
      img = images.blockImages[block.code]
    // }
    if (!utilMethods.isDef(img)) {
      return
    }
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    context.drawImage(img, imageOffsetX * canvasInfo.imageBlockSize, imageOffsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2,
    block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
    block.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
    canvasInfo.blockSize / 2 + 1,
    canvasInfo.blockSize / 2 + 1)
  },
  checkEdge (blockCode1, blockCode2) {
    if (blockCode1 == blockCode2) {
      return constants.EDGE_TYPE_NOTHING
    }
    if (blockCode1 == constants.BLOCK_CODE_SAND || blockCode1 == constants.BLOCK_CODE_WATER
        || blockCode2 == constants.BLOCK_CODE_SAND || blockCode2 == constants.BLOCK_CODE_WATER) {
      return constants.EDGE_TYPE_SAND
    } else if (blockCode1 == constants.BLOCK_CODE_DIRT || blockCode1 == constants.BLOCK_CODE_GRASS
        || blockCode1 == constants.BLOCK_CODE_SNOW || blockCode1 == constants.BLOCK_CODE_SWAMP
        || blockCode1 == constants.BLOCK_CODE_ROUGH || blockCode1 == constants.BLOCK_CODE_SUBTERRANEAN
        || blockCode1 == constants.BLOCK_CODE_LAVA
        || blockCode2 == constants.BLOCK_CODE_DIRT || blockCode2 == constants.BLOCK_CODE_GRASS
        || blockCode2 == constants.BLOCK_CODE_SNOW || blockCode2 == constants.BLOCK_CODE_SWAMP
        || blockCode2 == constants.BLOCK_CODE_ROUGH || blockCode2 == constants.BLOCK_CODE_SUBTERRANEAN
        || blockCode2 == constants.BLOCK_CODE_LAVA) {
      return constants.EDGE_TYPE_DIRT
    }
    return constants.EDGE_TYPE_NOTHING
  },
  drawTool (canvasInfo, staticData, images, userInfo, x, y, toolIndex, offsetY, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    context.save()
    switch (offsetY) {
      case 0:
        context.translate((x + 0.35) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, (y + 0.6) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight)
        context.rotate(Math.PI / 4)
        break
      case 1:
        context.scale(-1, 1)
        context.translate(-((x) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth), (y - 0.32) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight)
        break
      case 2:
        context.translate((x + 0.5) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, (y + 0.6) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight)
        break
      case 3:
        context.scale(-1, 1)
        context.translate(-((x + 0.1) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth), (y - 0.3) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight)
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
  drawHead (canvasInfo, staticData, images, userInfo, context, upLeftPoint, downRightPoint, offsetY, playerInfoTemp) {
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    var centerHeadPoint = {x: upLeftPoint.x + width / 2, y: upLeftPoint.y + height / 2}
    var upLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * (1 + (coefs[2] - 0.5)), y: centerHeadPoint.y - height * 0.2 * coefs[0]}
    var DownLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * coefs[3], y: centerHeadPoint.y + height * 0.3 * coefs[1]}
    var DownRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * coefs[3], y: centerHeadPoint.y + height * 0.3 * coefs[1]}
    var upRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * (1 + (coefs[2] - 0.5)), y: centerHeadPoint.y - height * 0.2 * coefs[0]}
    var faceEdgeCoef = offsetY === 0 || offsetY === 4 ? coefs[5] : coefs[9]
    var leftControlPoint = {x: upLeftHeadPoint.x - width * (faceEdgeCoef - 0.5), y: centerHeadPoint.y}
    var downControlPoint = {x: centerHeadPoint.x, y: DownLeftHeadPoint.y + height * coefs[6]}
    var rightControlPoint = {x: upRightHeadPoint.x + width * (faceEdgeCoef - 0.5), y: centerHeadPoint.y}
    var upControlPoint = {x: centerHeadPoint.x, y: upLeftHeadPoint.y - height * coefs[4]}
    this.applySkinColor(context, Number(playerInfoTemp.skinColor))
    context.beginPath()
    context.moveTo(upLeftHeadPoint.x, upLeftHeadPoint.y)
    context.quadraticCurveTo(leftControlPoint.x, leftControlPoint.y, DownLeftHeadPoint.x, DownLeftHeadPoint.y)
    context.quadraticCurveTo(downControlPoint.x, downControlPoint.y, DownRightHeadPoint.x, DownRightHeadPoint.y)
    context.quadraticCurveTo(rightControlPoint.x, rightControlPoint.y, upRightHeadPoint.x, upRightHeadPoint.y)
    context.quadraticCurveTo(upControlPoint.x, upControlPoint.y, upLeftHeadPoint.x, upLeftHeadPoint.y)
    context.closePath()
    context.fill()
    context.stroke()
  },
  drawEyes (canvasInfo, staticData, images, userInfo, context, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, zoomRatio) {
    var timestamp = new Date().valueOf()
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    var centerHeadPoint = {x: upLeftPoint.x + width / 2, y: upLeftPoint.y + height / 2}
    var eyesY = centerHeadPoint.y + height * coefs[7] * coefs[13] * zoomRatio - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio
    // Blinking eyes
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
  drawNeck (canvasInfo, staticData, images, context, upLeftPoint, downRightPoint, neckWidth, neckHeight, playerInfoTemp) {
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    var centerHeadPoint = {x: upLeftPoint.x + width / 2, y: upLeftPoint.y + height / 2}
    this.applySkinColor(context, Number(playerInfoTemp.skinColor))
    context.beginPath()
    context.fillRect(centerHeadPoint.x - neckWidth / 2, centerHeadPoint.y, neckWidth, neckHeight)
    context.closePath()
    context.fill()
  },
  drawBodyPart (canvasInfo, staticData, images, userInfo, img, playerInfoTemp, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio) {
    var colors = this.convertSkinColor(playerInfoTemp.skinColor)
    canvasInfo.tempCanvas.width = xCoef * canvasInfo.blockSize * zoomRatio
    canvasInfo.tempCanvas.height = yCoef * canvasInfo.blockSize * zoomRatio
    var tempContext = canvasInfo.tempCanvas.getContext('2d')
    tempContext.drawImage(img, offsetX * canvasInfo.imageBlockSize, offsetY * canvasInfo.imageBlockSize,
      imageX * canvasInfo.imageBlockSize, imageY * canvasInfo.imageBlockSize, 
      0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)

    var rgbArray = utilMethods.rgbaStrToRgb(colors[1])
    var imageData = tempContext.getImageData(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
    var data = imageData.data
    for (var i = 0; i < data.length; i += 4) {
      data[i + 0] = Math.min(255, data[i + 0] * 1.25) * rgbArray[0] / 255
      data[i + 1] = Math.min(255, data[i + 1] * 1.25) * rgbArray[1] / 255
      data[i + 2] = Math.min(255, data[i + 2] * 1.25) * rgbArray[2] / 255
    }
    tempContext.putImageData(imageData, 0, 0)
    var context = canvasInfo.canvas.getContext('2d')
    context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height,
      x * canvasInfo.blockSize * zoomRatio - canvasInfo.tempCanvas.width / 2 + canvasInfo.deltaWidth,
      y * canvasInfo.blockSize * zoomRatio - canvasInfo.tempCanvas.height / 2 + canvasInfo.deltaHeight,
      xCoef * canvasInfo.blockSize * zoomRatio, yCoef * canvasInfo.blockSize * zoomRatio)
  },
  applySkinColor (context, skinColor) {
    var colors = this.convertSkinColor(skinColor)
    context.strokeStyle = colors[0]
    context.fillStyle = colors[1]
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
    colors.push('rgba(' + Math.floor(selectedRgb[0] * 0.9) + ', ' + Math.floor(selectedRgb[1] * 0.9) + ', ' + Math.floor(selectedRgb[2] * 0.9) + ', 1)')
    colors.push('rgba(' + selectedRgb[0] + ', ' + selectedRgb[1] + ', ' + selectedRgb[2] + ', 1)')
    return colors
  },
  drawHair (canvasInfo, staticData, images, context, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, coefs, zoomRatio) {
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    var centerHeadPoint = {x: upLeftPoint.x + width / 2, y: upLeftPoint.y + height / 2}
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
      centerHeadPoint.x - canvasInfo.blockSize * zoomRatio / 2, centerHeadPoint.y - canvasInfo.blockSize * zoomRatio / 2 - height * 0.2 * (coefs[0] - 1),
      canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio)
  },
  drawHeadHair (canvasInfo, staticData, images, context, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, coefs, zoomRatio) {
    var width = downRightPoint.x - upLeftPoint.x
    var height = downRightPoint.y - upLeftPoint.y
    var centerHeadPoint = {x: upLeftPoint.x + width / 2, y: upLeftPoint.y + height / 2}
    canvasInfo.tempCanvas.width = width
    canvasInfo.tempCanvas.height = height
    var tempContext = canvasInfo.tempCanvas.getContext('2d')
    var rgbArray = utilMethods.hexToRgb(playerInfoTemp.hairColor)
    var eyesY = centerHeadPoint.y + height * coefs[7] * coefs[13] * zoomRatio - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio
    var eyebrowsY = eyesY + (upLeftPoint.y - eyesY) * 0.15
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
          centerHeadPoint.x - 0.3 * (0.8 - coefs[3]) * canvasInfo.blockSize * moustacheRatio * zoomRatio, moustacheY,
          canvasInfo.blockSize * moustacheRatio * zoomRatio / 2, canvasInfo.blockSize * moustacheRatio * zoomRatio)

        tempContext.clearRect(0, 0, canvasInfo.tempCanvas.width, canvasInfo.tempCanvas.height)
        tempContext.drawImage(images.bodyPartsImage.beard, (playerInfoTemp.beard % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.beard / 10) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
          0, 0, canvasInfo.blockSize, canvasInfo.blockSize)
        this.mixColor(canvasInfo, rgbArray)
        context.drawImage(canvasInfo.tempCanvas, 0, 0, canvasInfo.blockSize, canvasInfo.blockSize,
          centerHeadPoint.x - 0.3 * (0.8 - coefs[3]) * canvasInfo.blockSize * beardRatio * zoomRatio, beardY,
          canvasInfo.blockSize * beardRatio * zoomRatio / 2, canvasInfo.blockSize * beardRatio * zoomRatio)
        break
      case constants.OFFSET_Y_UPWARD:
        break
    }
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
  }
}
