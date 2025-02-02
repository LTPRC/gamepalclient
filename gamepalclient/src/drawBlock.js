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
        context.strokeStyle = 'rgba(196, 196, 128, ' + 0.8 * (1 - block.frame / block.period) + ')'
        context.beginPath()
        context.ellipse(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, block.y * canvasInfo.blockSize + canvasInfo.deltaHeight,
          (0.1 + Math.min(1, block.frame * 10 / block.period) * 0.3) * canvasInfo.blockSize,
          (0.05 + Math.min(1, block.frame * 10 / block.period) * 0.15) * canvasInfo.blockSize,
          0, 0, 2 * Math.PI)
        context.fill()
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
          block.y + canvasInfo.deltaHeight / canvasInfo.blockSize)
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
    if (block.code == constants.BLOCK_CODE_WATER) {
      var timestamp = new Date().valueOf()
      var offsetX = timestamp * userInfo.worldInfo.windSpeed * (Math.cos(userInfo.worldInfo.windDirection / 180 * Math.PI) + 1) % canvasInfo.blockSize
      var offsetY = (- timestamp * userInfo.worldInfo.windSpeed * (Math.sin(userInfo.worldInfo.windDirection / 180 * Math.PI) - 1)) % canvasInfo.blockSize
      tempCanvas.width = canvasInfo.blockSize
      tempCanvas.height = canvasInfo.blockSize
      var tempContext = tempCanvas.getContext('2d')
      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX - canvasInfo.blockSize, offsetY - canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX - canvasInfo.blockSize, offsetY, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX - canvasInfo.blockSize, offsetY + canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX, offsetY - canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX, offsetY, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX, offsetY + canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX + canvasInfo.blockSize, offsetY - canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX + canvasInfo.blockSize, offsetY, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      tempContext.drawImage(images.blockImages[block.code], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, offsetX + canvasInfo.blockSize, offsetY + canvasInfo.blockSize, canvasInfo.blockSize + 1, canvasInfo.blockSize + 1)
      img = tempCanvas
    } else {
      img = images.blockImages[block.code]
    }
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
  drawToolBlock (canvasInfo, staticData, images, userInfo, toolIndex, x, y) {
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
    (x - width / 2) * canvasInfo.blockSize,
    (y - height / 2) * canvasInfo.blockSize,
    width * canvasInfo.blockSize,
    height * canvasInfo.blockSize)
  }
}
