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
        this.drawDropBlock(canvasInfo, staticData, images, userInfo, block)
        break
      case constants.BLOCK_TYPE_FLOOR:
        var wallBlock = JSON.parse(JSON.stringify(block))
        this.drawBlockByCode(canvasInfo, staticData, images, userInfo, wallBlock)
        var ceilingBlock = JSON.parse(JSON.stringify(block))
        ceilingBlock.z += ceilingBlock.structure.shape.radius.z
        ceilingBlock.code = constants.BLOCK_CODE_BLACK_CEILING
        this.drawBlockByCode(canvasInfo, staticData, images, userInfo, ceilingBlock)
        break
      case constants.BLOCK_TYPE_WALL:
        wallBlock = JSON.parse(JSON.stringify(block))
        wallBlock.code = constants.BLOCK_CODE_BLACK_CEILING
        this.drawBlockByCode(canvasInfo, staticData, images, userInfo, wallBlock)
        ceilingBlock = JSON.parse(JSON.stringify(block))
        ceilingBlock.z += ceilingBlock.structure.shape.radius.z
        this.drawBlockByCode(canvasInfo, staticData, images, userInfo, ceilingBlock)
        break
      case constants.BLOCK_TYPE_TEXT_DISPLAY:
        if (!userInfo.textDisplayMap.has(block.id)) {
          break
        }
        var context = canvasInfo.canvas.getContext('2d')
        context.save()
        context.textAlign = 'center'
        context.shadowColor = 'black'
        context.shadowBlur = 2
        context.shadowOffsetX = 2
        context.shadowOffsetY = 2
        context.font = (0.2 + 0.3 * block.frame / block.period) * canvasInfo.blockSize + 'px sans-serif'
        context.fillStyle = 'rgba(255, 255, 255, ' + (1 - block.frame / block.period) + ')'
        context.fillText(userInfo.textDisplayMap.get(block.id),
          block.x * canvasInfo.blockSize + canvasInfo.deltaWidth,
          (block.y - block.z - 1 + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight,
          (0.2 + 0.3 * block.frame / block.period) * userInfo.textDisplayMap.get(block.id).length * canvasInfo.blockSize)
        context.restore()
        break
      default:
        this.drawBlockByCode(canvasInfo, staticData, images, userInfo, block)
        break
    }
  },
  drawBlockByCode (canvasInfo, staticData, images, userInfo, block) {
    var context = canvasInfo.canvas.getContext('2d')
    var timestamp = Date.now()
    switch (block.code) {
      case constants.BLOCK_CODE_UPGRADE: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y,
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
      case constants.BLOCK_CODE_EXPLODE: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
      case constants.BLOCK_CODE_BLEED:
        context.save()
        var bloodDropAmount = 20
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
          (block.y + deltaY - bleedingHeight - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight,
          size * canvasInfo.blockSize,
          size * canvasInfo.blockSize)
        }
        context.restore()
        break
      case constants.BLOCK_CODE_HEAL:
        break
      case constants.BLOCK_CODE_DECAY: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
      case constants.BLOCK_CODE_SACRIFICE: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
      case constants.BLOCK_CODE_TAIL_SMOKE:
        context.save()
        context.fillStyle = 'rgba(127, 127, 127, ' + (0.5 - block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (0.2 + block.frame / block.period * 0.8), 0, 2 * Math.PI)
        context.fill()
        context.restore()
        break
      case constants.BLOCK_CODE_CHEER:
        context.save()
        context.lineWidth = canvasInfo.blockSize * block.frame / block.period
        context.strokeStyle = 'rgba(255, 255, 127, ' + (0.25 - 0.25 * block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5 - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + block.frame / block.period * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        break
      case constants.BLOCK_CODE_CURSE:
        context.save()
        context.lineWidth = canvasInfo.blockSize * block.frame / block.period
        context.strokeStyle = 'rgba(0, 0, 0, ' + (0.25 - 0.25 * block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5 - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + block.frame / block.period * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        break
      case constants.BLOCK_CODE_MELEE_HIT:
        break
      case constants.BLOCK_CODE_MELEE_KICK:
        break
      case constants.BLOCK_CODE_MELEE_SCRATCH:
        break
      case constants.BLOCK_CODE_MELEE_SMASH:
        break
      case constants.BLOCK_CODE_MELEE_CLEAVE:
        break
      case constants.BLOCK_CODE_MELEE_CHOP:
        break
      case constants.BLOCK_CODE_MELEE_PICK:
        break
      case constants.BLOCK_CODE_MELEE_STAB:
        break
      case constants.BLOCK_CODE_SHOOT_HIT:
        break
      case constants.BLOCK_CODE_SHOOT_ARROW:
        break
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
      case constants.BLOCK_CODE_SHOOT_THROW_JUNK:
        break
      case constants.BLOCK_CODE_SPARK: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
      case constants.BLOCK_CODE_NOISE:
        context.save()
        context.lineWidth = canvasInfo.blockSize * block.frame / block.period
        context.strokeStyle = 'rgba(196, 196, 196, ' + (0.25 - 0.25 * block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5 - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + block.frame / block.period * 3), 0, 2 * Math.PI)
        context.stroke()
        context.restore()
        break
      case constants.BLOCK_CODE_MINE:
        break
      case constants.BLOCK_CODE_FIRE: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
      case constants.BLOCK_CODE_SPRAY: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
      case constants.BLOCK_CODE_SPARK_SHORT: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
      case constants.BLOCK_CODE_LIGHT_SMOKE:
        context.save()
        context.fillStyle = 'rgba(195, 195, 195, ' + (0.25 - block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (0 + block.frame / block.period * 0.2), 0, 2 * Math.PI)
        context.fill()
        context.restore()
        break
      case constants.BLOCK_CODE_BLEED_SEVERE:
        context.save()
        context.fillStyle = 'rgba(196, 0, 0, ' + 0.5 * (1 - block.frame / block.period) + ')'
        context.beginPath()
        context.ellipse(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5 - block.z + canvasInfo.playerShiftPosition.y - Math.min(1, block.frame * 10 / block.period) * 0.15 / 2) * canvasInfo.blockSize + canvasInfo.deltaHeight,
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
          (block.y - block.z + canvasInfo.playerShiftPosition.y + deltaY - particleHeight) * canvasInfo.blockSize + canvasInfo.deltaHeight,
          size * canvasInfo.blockSize,
          size * canvasInfo.blockSize)
        }
        context.restore()
        break
      case constants.BLOCK_CODE_WAVE:
        context.save()
        context.filter = 'blur(' + 0.04 * canvasInfo.blockSize + 'px) brightness(0.95) drop-shadow(0 0 ' + 0.03 * canvasInfo.blockSize + 'px rgba(255, 255, 255, 0.2))'
        context.beginPath()
        context.ellipse(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight,
          (0.01 + timestamp / 100 % 10 * 0.02) * canvasInfo.blockSize,
          (0.005 + timestamp / 100 % 10 * 0.01) * canvasInfo.blockSize,
          0, 0, 2 * Math.PI)
        context.stroke()
        context.closePath()
        context.filter = 'none'
        context.restore()
        break
      case constants.BLOCK_CODE_SHOCK:
        context.save()
        context.lineWidth = 0.5 * canvasInfo.blockSize * block.frame / block.period
        context.strokeStyle = 'rgba(196, 196, 196, ' + (1 - block.frame / block.period) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (0.5 + block.frame / block.period * 1.5), (-block.faceDirection) / 180 * Math.PI, ((-block.faceDirection) - (5 + block.frame / block.period * 40)) / 180 * Math.PI, true)
        context.stroke()
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (0.5 + block.frame / block.period * 1.5), (-block.faceDirection) / 180 * Math.PI, ((-block.faceDirection) + (5 + block.frame / block.period * 40)) / 180 * Math.PI, false)
        context.stroke()
        context.restore()
        break
      case constants.BLOCK_CODE_BUBBLE: {
        const frame = this._getFrameXY(block)
        this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
        break
      }
      case constants.BLOCK_CODE_TIMED_BOMB:
        break
      case constants.BLOCK_CODE_BLACK:
        context.save()
        context.fillStyle = 'rgba(0, 0, 0, 1)'
        context.fillRect((block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth,
        (block.y - block.z + canvasInfo.playerShiftPosition.y - block.structure.imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        block.structure.imageSize.x * canvasInfo.blockSize + 1,
        block.structure.imageSize.y * canvasInfo.blockSize + 1)
        context.restore()
        break
      case constants.BLOCK_CODE_WHITE:
        context.save()
        context.fillStyle = 'rgba(255, 255, 255, 1)'
        context.fillRect((block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth,
        (block.y - block.z + canvasInfo.playerShiftPosition.y - block.structure.imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        block.structure.imageSize.x * canvasInfo.blockSize + 1,
        block.structure.imageSize.y * canvasInfo.blockSize + 1)
        context.restore()
        break
      case constants.BLOCK_CODE_TRANSPARENT:
        break
      case constants.BLOCK_CODE_BLACK_CEILING:
        context.save()
        context.fillStyle = 'rgba(0, 0, 0, 0.75)'
        context.fillRect((block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth,
        (block.y - block.z + canvasInfo.playerShiftPosition.y - block.structure.imageSize.y + 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        block.structure.imageSize.x * canvasInfo.blockSize + 1,
        block.structure.imageSize.y * canvasInfo.blockSize + 1)
        context.restore()
        break
      case constants.BLOCK_CODE_MINE_FLAG:
        context.save()
        context.lineWidth = 0.01 * canvasInfo.blockSize
        context.strokeStyle = 'rgba(255, 255, 255, 1)'
        context.beginPath()
        context.moveTo(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight)
        context.lineTo(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - block.z - 0.5 + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight)
        context.stroke()
        context.closePath()
        context.fillStyle = 'rgba(196, 0, 0, 0.75)'
        context.fillRect(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth,
        (block.y - block.z - 0.5 + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        0.3 * canvasInfo.blockSize,
        0.2 * canvasInfo.blockSize)
        context.restore()
        break
      default: {
        const frame = this._getFrameXY(block)
        return this._drawGenerated(canvasInfo, staticData, images, userInfo, images.effectsImage[block.code], block.code, frame.x, frame.y, 
          { x: (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, y: (block.y - block.z + canvasInfo.playerShiftPosition.y - (block.structure.imageSize.y + 0.5)) * canvasInfo.blockSize + canvasInfo.deltaHeight},
          { x: block.structure.imageSize.x, y: block.structure.imageSize.y })
      }
    }
    return true
  },
  // Helper: compute sprite frame coordinates from block.frame
  _getFrameXY (block) {
    if (!utilMethods.isDef(block) || !utilMethods.isDef(block.period) || block.period === 0) {
      return { x: 0, y: 0 }
    }
    var frameIndex = Math.floor(block.frame % block.period)
    return { x: frameIndex % 10, y: Math.floor(frameIndex / 10) }
  },
  // Helper: generate block image and draw it to the main canvas
  _drawGenerated (canvasInfo, staticData, images, userInfo, img, code, imageX, imageY, coordinate, imageSize) {
    var context = canvasInfo.canvas.getContext('2d')
    var src = this.generateBlockImage(canvasInfo, staticData, images, userInfo, img, code, imageX, imageY, imageSize)
    context.drawImage(src,
      0, 0,
      imageSize.x * canvasInfo.imageBlockSize,
      imageSize.y * canvasInfo.imageBlockSize,
      coordinate.x,
      coordinate.y,
      imageSize.x * canvasInfo.blockSize + 1,
      imageSize.y * canvasInfo.blockSize + 1)
    return true
  },
  drawDropBlock (canvasInfo, staticData, images, userInfo, block) {
    var context = canvasInfo.canvas.getContext('2d')
    var img
    if (!utilMethods.isDef(block.itemNo)) {
      return false
    }
    const index = Number(block.itemNo.substr(1, block.itemNo.length - 1))
    let imageX = index % 10
    let imageY = Math.floor(index / 10)
    switch (block.itemNo.charAt(0)) {
      case constants.ITEM_CHARACTER_TOOL:
        this.drawToolBlock(canvasInfo, staticData, images, userInfo, block.itemNo,
          block.x + canvasInfo.deltaWidth / canvasInfo.blockSize,
          block.y - block.z + canvasInfo.playerShiftPosition.y + canvasInfo.deltaHeight / canvasInfo.blockSize,
          1)
        return true
      case constants.ITEM_CHARACTER_OUTFIT:
        var item = staticData.items[block.itemNo]
        switch (item.itemIndex) {
          case 1:
            this.drawClothesByItemNo(canvasInfo, staticData, images, userInfo, block.itemNo,
              block.x,
              block.y - block.z + canvasInfo.playerShiftPosition.y,
              1)
            break
          case 2:
            this.drawHatByItemNo(canvasInfo, staticData, images, userInfo, block.itemNo, constants.OFFSET_X_MIDDLE, constants.OFFSET_Y_DOWNWARD,
              block.x,
              block.y - block.z + canvasInfo.playerShiftPosition.y,
              1)
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
      if (!utilMethods.isDef(img)) {
        return false
      }
    context.drawImage(img, imageX * canvasInfo.imageBlockSize * 0.5, imageY * canvasInfo.imageBlockSize * 0.5,
        canvasInfo.imageBlockSize * 0.5, canvasInfo.imageBlockSize * 0.5, 
        (block.x - block.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
        (block.y - block.structure.imageSize.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
        canvasInfo.blockSize * 0.5, 
        canvasInfo.blockSize * 0.5)
    return true
  },
  generateBlockImage (canvasInfo, staticData, images, userInfo, img, code, imageX, imageY, imageSize) {
    // Reuse canvasInfo.tempCanvas if provided to reduce per-frame allocations
    var tempCanvas = canvasInfo.tempCanvas || document.createElement('canvas')
    tempCanvas.width = imageSize.x * canvasInfo.blockSize
    tempCanvas.height = imageSize.y * canvasInfo.blockSize
    var tempContext = tempCanvas.getContext('2d')
    // Clear previous contents
    tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
    tempContext.save()
    if (!utilMethods.isDef(img)) {
      img = images.blockImages[code]
      imageX = 0
      imageY = 0
    }
    if (!utilMethods.isDef(img)) {
      tempContext.fillStyle = 'rgba(255, 0, 255, 1)'
      tempContext.fillRect(0, 0,
        imageSize.x * canvasInfo.blockSize,
        imageSize.y * canvasInfo.blockSize)
      tempContext.textAlign = 'center'
      tempContext.font = '16px sans-serif'
      tempContext.fillStyle = '#EEEEEE'
      tempContext.fillText('NO RESOURCE',
        imageSize.x / 2 * canvasInfo.blockSize,
        imageSize.y / 2 * canvasInfo.blockSize,
        canvasInfo.blockSize)
    } else {
      tempContext.drawImage(img,
        imageX * canvasInfo.imageBlockSize,
        imageY * canvasInfo.imageBlockSize,
        imageSize.x * canvasInfo.imageBlockSize,
        imageSize.y * canvasInfo.imageBlockSize,
        0, 0,
        imageSize.x * canvasInfo.blockSize,
        imageSize.y * canvasInfo.blockSize)
    }
    tempContext.restore()
    return tempCanvas

  },
  drawGridBlocks (canvasInfo, staticData, images, userInfo) {
    // var context = canvasInfo.canvas.getContext('2d')
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
          x: i - horizontalRadius * userInfo.regionInfo.width - 0.5,
          y: j - verticalRadius * userInfo.regionInfo.height - 0.5,
          z: userInfo.altitudes[i][j],
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
          x: i - horizontalRadius * userInfo.regionInfo.width,
          y: j - verticalRadius * userInfo.regionInfo.height - 0.5,
          z: userInfo.altitudes[i][j],
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
          x: i - horizontalRadius * userInfo.regionInfo.width - 0.5,
          y: j - verticalRadius * userInfo.regionInfo.height,
          z: userInfo.altitudes[i][j],
          structure: {
            imageSize: {
              x: 1,
              y: 1
            }
          }
        }
        this.createGridImage(canvasInfo, staticData, images, userInfo, downleftGridBlock, 0.5, 0, 0.5, 0.5)
        var downleftGridBlock2 = Object.assign({}, downleftGridBlock)
        downleftGridBlock2.y = downleftGridBlock2.y + 0.5
        this.createGridImage(canvasInfo, staticData, images, userInfo, downleftGridBlock2, 0.5, 0, 0.5, 0.5)
        
        var downrightGridBlock = {
          code: String(userInfo.grids[i + 1][j + 1]),
          x: i - horizontalRadius * userInfo.regionInfo.width,
          y: j - verticalRadius * userInfo.regionInfo.height,
          z: userInfo.altitudes[i][j],
          structure: {
            imageSize: {
              x: 1,
              y: 1
            }
          }
        }
        this.createGridImage(canvasInfo, staticData, images, userInfo, downrightGridBlock, 0.5, 0.5, 0.5, 0.5)
        var downrightGridBlock2 = Object.assign({}, downrightGridBlock)
        downrightGridBlock2.y = downrightGridBlock2.y + 0.5
        this.createGridImage(canvasInfo, staticData, images, userInfo, downrightGridBlock2, 0.5, 0.5, 0.5, 0.5)

        var edgeCode = utilMethods.checkEdge(upleftGridBlock.code, uprightGridBlock.code, constants.OFFSET_Y_UPWARD)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y, z: upleftGridBlock.z }, 0, 0, 1, 1)
        
        edgeCode = utilMethods.checkEdge(upleftGridBlock.code, downleftGridBlock.code, constants.OFFSET_Y_LEFTWARD)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y, z: upleftGridBlock.z }, 0, 0, 1, 1)
        
        edgeCode = utilMethods.checkEdge(uprightGridBlock.code, downrightGridBlock.code, constants.OFFSET_Y_RIGHTWARD)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y, z: upleftGridBlock.z }, 0, 0, 1, 1)
        
        edgeCode = utilMethods.checkEdge(downleftGridBlock.code, downrightGridBlock.code, constants.OFFSET_Y_DOWNWARD)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y, z: upleftGridBlock.z }, 0, 0, 1, 1)
        this.createGridImage(canvasInfo, staticData, images, userInfo, { code: edgeCode, x: upleftGridBlock.x, y: upleftGridBlock.y + 1, z: upleftGridBlock.z }, 0, 0.5, 1, 0.5)

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
  },
  drawHorizion (canvasInfo, staticData, images, userInfo) {
    var skyColor = utilMethods.getColorByTime(userInfo.worldInfo.worldTime,
      userInfo.worldInfo.worldTimeSunriseBegin,
      userInfo.worldInfo.worldTimeSunriseEnd,
      userInfo.worldInfo.worldTimeSunsetBegin,
      userInfo.worldInfo.worldTimeSunsetEnd)
    var context = canvasInfo.canvas.getContext('2d')
    // Round-style shade
    context.save()
    var gradient = context.createRadialGradient(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2, userInfo.playerInfos[userInfo.userCode].perceptionInfo.distinctVisionRadius * canvasInfo.blockSize,
      canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2, userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius * canvasInfo.blockSize) // 渐变的中心点、半径
    gradient.addColorStop(0, utilMethods.hexToRgba(skyColor, 0)) // 内部完全透明
    gradient.addColorStop(1, utilMethods.hexToRgba(skyColor, 1)) // 外部完全不透明
    context.beginPath()
    context.moveTo(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2)
    context.arc(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2, (userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius + 3) * canvasInfo.blockSize, 0, 2 * Math.PI)
    context.fillStyle = gradient
    context.fill()
    context.closePath()
    var leftDDegree = 360 - userInfo.playerInfos[userInfo.userCode].faceDirection + userInfo.playerInfos[userInfo.userCode].perceptionInfo.distinctVisionAngle / 2
    var rightDDegree = 0 - userInfo.playerInfos[userInfo.userCode].faceDirection - userInfo.playerInfos[userInfo.userCode].perceptionInfo.distinctVisionAngle / 2
    context.beginPath()
    context.moveTo(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2 - (userInfo.playerInfos[userInfo.userCode].coordinate.z - canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize)
    context.arc(canvasInfo.canvas.width / 2, canvasInfo.canvas.height / 2 - (userInfo.playerInfos[userInfo.userCode].coordinate.z - canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize, (userInfo.playerInfos[userInfo.userCode].perceptionInfo.indistinctVisionRadius + 3) * canvasInfo.blockSize, leftDDegree / 180 * Math.PI, rightDDegree / 180 * Math.PI, false)
    context.fillStyle = utilMethods.hexToRgba(skyColor, utilMethods.getShadeAlphaByTime(userInfo.worldInfo.worldTime,
      userInfo.worldInfo.worldTimeSunriseBegin,
      userInfo.worldInfo.worldTimeSunriseEnd,
      userInfo.worldInfo.worldTimeSunsetBegin,
      userInfo.worldInfo.worldTimeSunsetEnd))
    context.fill()
    context.closePath()
    // var leftIDegree = 360 - playerInfos[userCode].faceDirection + playerInfos[userCode].perceptionInfo.indistinctVisionAngle / 2
    // var rightIDegree = 0 - playerInfos[userCode].faceDirection - playerInfos[userCode].perceptionInfo.indistinctVisionAngle / 2
    // context.beginPath()
    // context.moveTo(canvas.width / 2, canvas.height / 2 - userInfo.playerInfos[userInfo.userCode].coordinate.z)
    // context.arc(canvas.width / 2, canvas.height / 2 - userInfo.playerInfos[userInfo.userCode].coordinate.z, (playerInfos[userCode].perceptionInfo.indistinctVisionRadius + 2) * blockSize, leftIDegree / 180 * Math.PI, rightIDegree / 180 * Math.PI)
    // context.fillStyle = 'rgba(0, 0, 0, 0.1)'
    // context.fill()
    // context.closePath()
    context.restore()
  },
  createGridImage (canvasInfo, staticData, images, userInfo, block, imageOffsetX, imageOffsetY, width, height) {
    // var timestamp = Date.now()
    var context = canvasInfo.canvas.getContext('2d')
    var img = images.blockImages[block.code]
    if (!utilMethods.isDef(img)) {
      return
    }
    switch (Number(block.code)) {
      case constants.BLOCK_CODE_WATER_SHALLOW:
      case constants.BLOCK_CODE_WATER_MEDIUM:
      case constants.BLOCK_CODE_WATER_DEEP:
        // Reuse canvasInfo.tempCanvas if provided to reduce per-frame allocations
        var tempCanvas = canvasInfo.tempCanvas || document.createElement('canvas')
        tempCanvas.width = canvasInfo.imageBlockSize * 2
        tempCanvas.height = canvasInfo.imageBlockSize * 2
        var tempContext = tempCanvas.getContext('2d')
        if (utilMethods.isDef(images.imageData.block[block.code])) {
          tempContext.putImageData(images.imageData.block[block.code], 0, 0)
        } else {
          tempContext.drawImage(img, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
            0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
          tempContext.drawImage(img, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
            0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
          tempContext.drawImage(img, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
            canvasInfo.imageBlockSize, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
          tempContext.drawImage(img, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
            canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
          images.imageData.block[block.code] = tempContext.getImageData(
            canvasInfo.waterPosition.x * canvasInfo.imageBlockSize,
            canvasInfo.waterPosition.y * canvasInfo.imageBlockSize,
            canvasInfo.imageBlockSize,
            canvasInfo.imageBlockSize)
          tempContext.putImageData(images.imageData.block[block.code], 0, 0)
        }
        context.drawImage(tempCanvas, 0 * canvasInfo.imageBlockSize,
        0 * canvasInfo.imageBlockSize,
        1 * canvasInfo.imageBlockSize,
        1 * canvasInfo.imageBlockSize,
        block.x * canvasInfo.blockSize + canvasInfo.deltaWidth,
        (block.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        width * canvasInfo.blockSize + 1,
        height * canvasInfo.blockSize + 1)
        break
      default:
        context.drawImage(img, imageOffsetX * canvasInfo.imageBlockSize, imageOffsetY * canvasInfo.imageBlockSize, width * canvasInfo.imageBlockSize, height * canvasInfo.imageBlockSize,
          block.x * canvasInfo.blockSize + canvasInfo.deltaWidth,
          (block.y - block.z + canvasInfo.playerShiftPosition.y) * canvasInfo.blockSize + canvasInfo.deltaHeight,
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
    var speed = Math.sqrt(Math.pow(playerInfoTemp.speed.x, 2) + Math.pow(playerInfoTemp.speed.y, 2))
    var context = canvasInfo.canvas.getContext('2d')
    // Without imageData
    switch (bodyPart) {
      case constants.BODY_PART_HEAD:
        if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawHead(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetX, offsetY, x, y, zoomRatio)
        }
        return
      case constants.BODY_PART_BACK_HAIR:
        if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawHair(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
        }
        return
      case constants.BODY_PART_NECK:
        if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawNeck(canvasInfo, staticData, images, userInfo, playerInfoTemp, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        }
        return
      case constants.BODY_PART_JAW:
        if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
          this.drawJaw(canvasInfo, staticData, images, userInfo, playerInfoTemp, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        }
        return
    }
    
    var invalidImageData = false
    if (!utilMethods.isDef(images.imageData.creature[playerInfoTemp.id])) {
      invalidImageData = true
      images.imageData.creature[playerInfoTemp.id] = {}
      images.imageData.creature[playerInfoTemp.id].bodyPart = []
      images.imageData.creature[playerInfoTemp.id].bodyPart[bodyPart] = []
    } else if (!utilMethods.isDef(images.imageData.creature[playerInfoTemp.id].bodyPart)) {
      invalidImageData = true
      images.imageData.creature[playerInfoTemp.id].bodyPart = []
      images.imageData.creature[playerInfoTemp.id].bodyPart[bodyPart] = []
    } else if (!utilMethods.isDef(images.imageData.creature[playerInfoTemp.id].bodyPart[bodyPart])) {
      invalidImageData = true
      images.imageData.creature[playerInfoTemp.id].bodyPart[bodyPart] = []
    }
    var bodyPartArray = images.imageData.creature[playerInfoTemp.id].bodyPart[bodyPart]
    if (invalidImageData) {
      bodyPartArray = []
      for (let offsetXTemp = constants.OFFSET_X_LEFT; offsetXTemp <= constants.OFFSET_X_RIGHT; offsetXTemp++) {
        bodyPartArray[offsetXTemp] = []
        for (let offsetYTemp = constants.OFFSET_Y_DOWNWARD; offsetYTemp <= constants.OFFSET_Y_UPWARD; offsetYTemp++) {
          bodyPartArray[offsetXTemp][offsetYTemp] = []
          this.prepareBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetXTemp, offsetYTemp, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, bodyPart, bodyPartArray)
        }
      }
    } else if (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData) {
      this.prepareBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, bodyPart, bodyPartArray)
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].bodyPart[bodyPart] = bodyPartArray
    }
    for (let bodyPartIndex in bodyPartArray[offsetX][offsetY]) {
      context.drawImage(bodyPartArray[offsetX][offsetY][bodyPartIndex], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
        (x - xCoef * 0.5) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth,
        (y - yCoef * 0.5) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight,
        xCoef * canvasInfo.blockSize * zoomRatio, yCoef * canvasInfo.blockSize * zoomRatio)
    }
  },
  prepareBodyParts (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, bodyPart, bodyPartArray) {
    var skinColors = this.convertSkinColor(playerInfoTemp.skinColor)
    var outfitIndex
    var outfitNo
    var image
    switch (bodyPart) {
      case constants.BODY_PART_TORSO:
        image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, playerInfoTemp.gender - 1, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        bodyPartArray[offsetX][offsetY].push(image)
        if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          for (outfitIndex in playerInfoTemp.outfits) {
            outfitNo = playerInfoTemp.outfits[outfitIndex]
            switch (outfitNo) {
              case constants.ITEM_NO_OUTFIT_UNDERWEAR:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, playerInfoTemp.gender - 1, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_1:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, 4, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(255, 255, 255, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, 7, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 196, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, 4, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(255, 255, 255, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, 7, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SOLDIER:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, 4, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 196, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SUIT_1:
              case constants.ITEM_NO_OUTFIT_SUIT_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, 4, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_NRA_1:
              case constants.ITEM_NO_OUTFIT_NRA_2:
              case constants.ITEM_NO_OUTFIT_NRA_3:
              case constants.ITEM_NO_OUTFIT_NRA_4:
              case constants.ITEM_NO_OUTFIT_NRA_5:
              case constants.ITEM_NO_OUTFIT_NRA_6:
              case constants.ITEM_NO_OUTFIT_NRA_7:
              case constants.ITEM_NO_OUTFIT_IJA_1:
              case constants.ITEM_NO_OUTFIT_IJA_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, 5, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getUniformColor(outfitNo))
                bodyPartArray[offsetX][offsetY].push(image)
                break
            }
          }
        // } else {
        //   image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos, playerInfoTemp.gender - 1, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        //   bodyPartArray[offsetX][offsetY].push(image)
        }
        break
      case constants.BODY_PART_LEFT_HAND:
      case constants.BODY_PART_RIGHT_HAND:
        var imgHands = bodyPart == constants.BODY_PART_LEFT_HAND ? images.bodyPartsImage.left_hands : images.bodyPartsImage.right_hands
        image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgHands, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        bodyPartArray[offsetX][offsetY].push(image)
        break
      case constants.BODY_PART_LEFT_ARM:
      case constants.BODY_PART_RIGHT_ARM:
        var imgArms = bodyPart == constants.BODY_PART_LEFT_ARM ? images.bodyPartsImage.left_arms : images.bodyPartsImage.right_arms
        var imgSleevesLong = bodyPart == constants.BODY_PART_LEFT_ARM ? images.bodyPartsImage.left_sleeves_long : images.bodyPartsImage.right_sleeves_long
        var imgArmbands = bodyPart == constants.BODY_PART_LEFT_ARM ? images.bodyPartsImage.left_armbands : images.bodyPartsImage.right_armbands
        var imgZgc = bodyPart == constants.BODY_PART_LEFT_ARM ? images.bodyPartsImage.left_zgc : images.bodyPartsImage.right_zgc
        image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        bodyPartArray[offsetX][offsetY].push(image)
        if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          for (outfitIndex in playerInfoTemp.outfits) {
            outfitNo = playerInfoTemp.outfits[outfitIndex]
            switch (outfitNo) {
              case constants.ITEM_NO_OUTFIT_UNDERWEAR:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_1:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgSleevesLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(255, 255, 255, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArmbands, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 196, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgZgc, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgSleevesLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(255, 255, 255, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArmbands, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgZgc, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SOLDIER:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgSleevesLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 196, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SUIT_1:
              case constants.ITEM_NO_OUTFIT_SUIT_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgSleevesLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_NRA_1:
              case constants.ITEM_NO_OUTFIT_NRA_2:
              case constants.ITEM_NO_OUTFIT_NRA_3:
              case constants.ITEM_NO_OUTFIT_NRA_4:
              case constants.ITEM_NO_OUTFIT_NRA_5:
              case constants.ITEM_NO_OUTFIT_NRA_6:
              case constants.ITEM_NO_OUTFIT_NRA_7:
              case constants.ITEM_NO_OUTFIT_IJA_1:
              case constants.ITEM_NO_OUTFIT_IJA_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgSleevesLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getUniformColor(outfitNo))
                bodyPartArray[offsetX][offsetY].push(image)
                break
            }
          }
        // } else {
        //   image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgArms, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        //   bodyPartArray[offsetX][offsetY].push(image)
        }
        break
      case constants.BODY_PART_BREAST:
        var showBreasts = playerInfoTemp.gender == constants.GENDER_FEMALE
        var showBra = playerInfoTemp.gender == constants.GENDER_FEMALE
        var hasBra = false
        if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          for (outfitIndex in playerInfoTemp.outfits) {
            outfitNo = playerInfoTemp.outfits[outfitIndex]
            switch (outfitNo) {
              case constants.ITEM_NO_OUTFIT_UNDERWEAR:
                showBreasts = false
                hasBra = true
                break
              case constants.ITEM_NO_OUTFIT_ZGC_1:
                showBreasts = false
                showBra = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 196, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_2:
                showBreasts = false
                showBra = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SOLDIER:
                showBreasts = false
                showBra = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 196, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SUIT_1:
                showBreasts = false
                showBra = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SUIT_2:
                showBreasts = false
                showBra = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_NRA_1:
              case constants.ITEM_NO_OUTFIT_NRA_2:
              case constants.ITEM_NO_OUTFIT_NRA_3:
              case constants.ITEM_NO_OUTFIT_NRA_4:
              case constants.ITEM_NO_OUTFIT_NRA_5:
              case constants.ITEM_NO_OUTFIT_NRA_6:
              case constants.ITEM_NO_OUTFIT_NRA_7:
              case constants.ITEM_NO_OUTFIT_IJA_1:
              case constants.ITEM_NO_OUTFIT_IJA_2:
                showBreasts = false
                showBra = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getUniformColor(outfitNo))
                bodyPartArray[offsetX][offsetY].push(image)
                break
            }
          }
        }
        if (showBreasts) {
          switch(offsetY) {
            case constants.OFFSET_Y_DOWNWARD:
              image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 1, 1, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
              bodyPartArray[offsetX][offsetY].push(image)
              break
            case constants.OFFSET_Y_LEFTWARD:
              image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 0.5, 1, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
              bodyPartArray[offsetX][offsetY].push(image)
              break
            case constants.OFFSET_Y_RIGHTWARD:
              image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, playerInfoTemp.breastType % 10 + 0.5, Math.floor(playerInfoTemp.breastType / 10), 0.5, 1, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
              bodyPartArray[offsetX][offsetY].push(image)
              break
            case constants.OFFSET_Y_UPWARD:
              image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 1, 1, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
              bodyPartArray[offsetX][offsetY].push(image)
              break
          }
        }
        if (hasBra && showBra) {
          image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 0, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
          bodyPartArray[offsetX][offsetY].push(image)
          image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 1, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
          bodyPartArray[offsetX][offsetY].push(image)
        }
        break
      case constants.BODY_PART_OUTFIT_DECORATION:
        var hasPanties = false
        var showPanties = true
        if (utilMethods.isDef(playerInfoTemp.buff)) {
          if (playerInfoTemp.buff[constants.BUFF_CODE_DEAD] !== 0) {
            yCoef /= 2
          }
          if (playerInfoTemp.buff[constants.BUFF_CODE_KNOCKED] !== 0) {
            yCoef /= 2
          }
        }
        if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          for (outfitIndex in playerInfoTemp.outfits) {
            outfitNo = playerInfoTemp.outfits[outfitIndex]
            switch (outfitNo) {
              case constants.ITEM_NO_OUTFIT_UNDERWEAR:
                hasPanties = true
                break
              case constants.ITEM_NO_OUTFIT_ZGC_1:
                showPanties = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_2:
                showPanties = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 6, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SOLDIER:
                showPanties = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 5, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SUIT_1:
                showPanties = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 4, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SUIT_2:
                showPanties = false
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 3, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_NRA_1:
              case constants.ITEM_NO_OUTFIT_NRA_2:
              case constants.ITEM_NO_OUTFIT_NRA_3:
              case constants.ITEM_NO_OUTFIT_NRA_4:
              case constants.ITEM_NO_OUTFIT_NRA_5:
              case constants.ITEM_NO_OUTFIT_NRA_6:
              case constants.ITEM_NO_OUTFIT_NRA_7:
              case constants.ITEM_NO_OUTFIT_IJA_1:
              case constants.ITEM_NO_OUTFIT_IJA_2:
                showPanties = false
                break
            }
          }
        }
        if (hasPanties && showPanties) {
          if (playerInfoTemp.gender == constants.GENDER_FEMALE) {
            image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 1, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
            bodyPartArray[offsetX][offsetY].push(image)
          }
          image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.outfit_decoration, 2, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, undefined)
          bodyPartArray[offsetX][offsetY].push(image)
        }
        break
      case constants.BODY_PART_ACCESSORIES:
        if (utilMethods.isDef(playerInfoTemp.buff)) {
          if (playerInfoTemp.buff[constants.BUFF_CODE_DEAD] !== 0) {
            yCoef /= 2
          }
          if (playerInfoTemp.buff[constants.BUFF_CODE_KNOCKED] !== 0) {
            yCoef /= 2
          }
        }
        image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.accessories, playerInfoTemp.accessories % 10, Math.floor(playerInfoTemp.accessories / 10), imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        bodyPartArray[offsetX][offsetY].push(image)
        break
      case constants.BODY_PART_LEFT_FOOT:
      case constants.BODY_PART_RIGHT_FOOT:
        var imgFeet = bodyPart == constants.BODY_PART_LEFT_FOOT ? images.bodyPartsImage.left_feet : images.bodyPartsImage.right_feet
        if (utilMethods.isDef(playerInfoTemp.buff)) {
          if (playerInfoTemp.buff[constants.BUFF_CODE_DEAD] !== 0) {
            yCoef /= 2
          }
          if (playerInfoTemp.buff[constants.BUFF_CODE_KNOCKED] !== 0) {
            yCoef /= 2
          }
        }
        image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        bodyPartArray[offsetX][offsetY].push(image)
        if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          for (outfitIndex in playerInfoTemp.outfits) {
            outfitNo = playerInfoTemp.outfits[outfitIndex]
            switch (outfitNo) {
              case constants.ITEM_NO_OUTFIT_UNDERWEAR:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_1:
              case constants.ITEM_NO_OUTFIT_ZGC_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 196, 196, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SOLDIER:
              case constants.ITEM_NO_OUTFIT_NRA_1:
              case constants.ITEM_NO_OUTFIT_IJA_1:
              case constants.ITEM_NO_OUTFIT_IJA_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(128, 64, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SUIT_1:
              case constants.ITEM_NO_OUTFIT_SUIT_2:
              case constants.ITEM_NO_OUTFIT_NRA_2:
              case constants.ITEM_NO_OUTFIT_NRA_3:
              case constants.ITEM_NO_OUTFIT_NRA_4:
              case constants.ITEM_NO_OUTFIT_NRA_5:
              case constants.ITEM_NO_OUTFIT_NRA_6:
              case constants.ITEM_NO_OUTFIT_NRA_7:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(16, 16, 16, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
            }
          }
        // } else {
        //   image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgFeet, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        //   bodyPartArray[offsetX][offsetY].push(image)
        }
        break
      case constants.BODY_PART_LEFT_LEG:
      case constants.BODY_PART_RIGHT_LEG:
        var imgLegs = bodyPart == constants.BODY_PART_LEFT_LEG ? images.bodyPartsImage.left_legs : images.bodyPartsImage.right_legs
        var imgTrouserLegsLong = bodyPart == constants.BODY_PART_LEFT_LEG ? images.bodyPartsImage.left_trouser_legs_long : images.bodyPartsImage.right_trouser_legs_long
        if (utilMethods.isDef(playerInfoTemp.buff)) {
          if (playerInfoTemp.buff[constants.BUFF_CODE_DEAD] !== 0) {
            yCoef /= 2
          }
          if (playerInfoTemp.buff[constants.BUFF_CODE_KNOCKED] !== 0) {
            yCoef /= 2
          }
        }
        image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        bodyPartArray[offsetX][offsetY].push(image)
        if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          for (outfitIndex in playerInfoTemp.outfits) {
            outfitNo = playerInfoTemp.outfits[outfitIndex]
            switch (outfitNo) {
              case constants.ITEM_NO_OUTFIT_UNDERWEAR:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_1:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgTrouserLegsLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 196, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_ZGC_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgTrouserLegsLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(196, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SOLDIER:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgTrouserLegsLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 98, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_SUIT_1:
              case constants.ITEM_NO_OUTFIT_SUIT_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgTrouserLegsLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, 'rgba(0, 0, 0, 1)')
                bodyPartArray[offsetX][offsetY].push(image)
                break
              case constants.ITEM_NO_OUTFIT_NRA_1:
              case constants.ITEM_NO_OUTFIT_NRA_2:
              case constants.ITEM_NO_OUTFIT_NRA_3:
              case constants.ITEM_NO_OUTFIT_NRA_4:
              case constants.ITEM_NO_OUTFIT_NRA_5:
              case constants.ITEM_NO_OUTFIT_NRA_6:
              case constants.ITEM_NO_OUTFIT_NRA_7:
              case constants.ITEM_NO_OUTFIT_IJA_1:
              case constants.ITEM_NO_OUTFIT_IJA_2:
                image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgTrouserLegsLong, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, this.getUniformColor(outfitNo))
                bodyPartArray[offsetX][offsetY].push(image)
                break
            }
          }
        // } else {
        //   image = this.drawBodyPart(canvasInfo, staticData, images, userInfo, imgLegs, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, skinColors[1])
        //   bodyPartArray[offsetX][offsetY].push(image)
        }
        break
    }
  },
  drawBodyPart (canvasInfo, staticData, images, userInfo, img, offsetX, offsetY, imageX, imageY, x, y, xCoef, yCoef, zoomRatio, color) {
    var tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = canvasInfo.imageBlockSize
    var tempContext = tempCanvas.getContext('2d')
    if (!utilMethods.isDef(img)) {
      return tempCanvas
    }
    tempContext.drawImage(img, offsetX * canvasInfo.imageBlockSize, offsetY * canvasInfo.imageBlockSize,
      imageX * canvasInfo.imageBlockSize, imageY * canvasInfo.imageBlockSize, 
      0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
    if (utilMethods.isDef(color)) {
      var rgbArray = utilMethods.rgbaStrToRgb(color)
      var imageData = tempContext.getImageData(0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      var data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = Math.min(255, data[i + 0] * 1.25) * rgbArray[0] / 255
        data[i + 1] = Math.min(255, data[i + 1] * 1.25) * rgbArray[1] / 255
        data[i + 2] = Math.min(255, data[i + 2] * 1.25) * rgbArray[2] / 255
      }
      tempContext.putImageData(imageData, 0, 0)
    }
    return tempCanvas
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
  drawJaw (canvasInfo, staticData, images, userInfo, playerInfoTemp, x, y, xCoef, yCoef, zoomRatio, color) {
    var context = canvasInfo.canvas.getContext('2d')
    context.fillStyle = color
    context.beginPath()
    context.arc(
      x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth,
      y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight,
      0.1 * xCoef * yCoef * canvasInfo.blockSize * zoomRatio, 0, 2 * Math.PI)
    context.fill()
  },
  drawHair (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = 4 * canvasInfo.imageBlockSize
    var tempContext = tempCanvas.getContext('2d')
    var rgbArray = utilMethods.hexToRgbaArray(playerInfoTemp.hairColor, 1)
    if (playerInfoTemp.hairStyle == -1) {
      // Bald
      return
    }
    var image = images.imageData.creature[playerInfoTemp.id].hair
    var invalidImageData = !utilMethods.isDef(image)
    if (invalidImageData || (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData)) {
      tempContext.drawImage(images.bodyPartsImage.hairstyles, playerInfoTemp.hairstyle % 10 * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.hairstyle / 10) * 4 * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 4 * canvasInfo.imageBlockSize, 
        0, 0, canvasInfo.imageBlockSize, 4 * canvasInfo.imageBlockSize)
      this.mixColor(tempCanvas, rgbArray)
      image = tempCanvas
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].hair = image
    }
    context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
      (x - 0.5) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth,
      (y - 0.5 - 0.2 * (coefs[0] - 1)) * canvasInfo.blockSize * zoomRatio  + canvasInfo.deltaHeight,
      canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio)
  },
  drawHead (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetX, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var width = canvasInfo.blockSize * zoomRatio
    var height = canvasInfo.blockSize * zoomRatio
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    var headWidthRadius = width * coefs[2] * (faceEdgeCoef = offsetY === 0 || offsetY === 4 ? 0.1 : 0.08)
    var upLeftHeadPoint = {x: centerHeadPoint.x - headWidthRadius, y: centerHeadPoint.y - height * 0.2 * coefs[0]}
    var downLeftHeadPoint = {x: centerHeadPoint.x - width * 0.1 * coefs[3], y: centerHeadPoint.y + height * 0.3 * coefs[1]}
    var downRightHeadPoint = {x: centerHeadPoint.x + width * 0.1 * coefs[3], y: centerHeadPoint.y + height * 0.3 * coefs[1]}
    var upRightHeadPoint = {x: centerHeadPoint.x + headWidthRadius, y: centerHeadPoint.y - height * 0.2 * coefs[0]}
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
          centerHeadPoint.x, centerHeadPoint.y + height / 4, height / 4)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1])
        break
      case constants.OFFSET_Y_LEFTWARD:
        gradient = context.createRadialGradient(centerHeadPoint.x, centerHeadPoint.y, height / 4,
          centerHeadPoint.x - width / 4, centerHeadPoint.y + height / 4, height / 4)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1])
        break
      case constants.OFFSET_Y_RIGHTWARD:
        gradient = context.createRadialGradient(centerHeadPoint.x, centerHeadPoint.y, height / 4,
          centerHeadPoint.x + width / 4, centerHeadPoint.y + height / 4, height / 4)
        gradient.addColorStop(0, colors[0])
        gradient.addColorStop(1, colors[1])
        break
      case constants.OFFSET_Y_UPWARD:
        gradient = context.createRadialGradient(centerHeadPoint.x, centerHeadPoint.y, height / 4,
          centerHeadPoint.x, centerHeadPoint.y - height / 4, height / 4)
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
    this.drawNose(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
    this.drawMouth(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
    // Draw top hair
    this.drawHair(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
    // Draw eyebrows, moustache, beard
    this.drawHeadHair(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
    // Draw tongue
    if (utilMethods.isDef(playerInfoTemp.buff)) {
      if (playerInfoTemp.buff[constants.BUFF_CODE_STUNNED] !== 0
        || playerInfoTemp.buff[constants.BUFF_CODE_BLEEDING] !== 0
        || playerInfoTemp.buff[constants.BUFF_CODE_SICK] !== 0
        || playerInfoTemp.buff[constants.BUFF_CODE_FRACTURED] !== 0
        || playerInfoTemp.buff[constants.BUFF_CODE_HUNGRY] !== 0
        || playerInfoTemp.buff[constants.BUFF_CODE_THIRSTY] !== 0
        || playerInfoTemp.buff[constants.BUFF_CODE_FATIGUED] !== 0
        || playerInfoTemp.buff[constants.BUFF_CODE_KNOCKED] !== 0) {
        this.drawTongue(canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio)
      }
    }
    // Draw hat
    for (var outfitIndex in playerInfoTemp.outfits) {
      var outfitNo = playerInfoTemp.outfits[outfitIndex]
      var item = staticData.items[outfitNo]
      if (item.itemIndex == 2) {
        this.drawHatByItemNo(canvasInfo, staticData, images, userInfo, outfitNo, offsetX, offsetY, x, y - 0.2 * (coefs[0] - 1), zoomRatio)
      }
    }
  },
  drawEyes (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    var eyeYCoef = 1
    if (utilMethods.isDef(playerInfoTemp.buff)
      && (playerInfoTemp.buff[constants.BUFF_CODE_KNOCKED] !== 0 || playerInfoTemp.buff[constants.BUFF_CODE_STUNNED] !== 0 || playerInfoTemp.buff[constants.BUFF_CODE_BLIND] !== 0)) {
      eyeYCoef = 0.5
    }
    var eyesY = centerHeadPoint.y + canvasInfo.blockSize * zoomRatio * coefs[7] * coefs[13] * zoomRatio - eyeYCoef / 2 * canvasInfo.blockSize * coefs[13] * zoomRatio
    // Blinking eyes
    var timestamp = Date.now()
    if (timestamp % 4000 < 10) {
      return
    }
    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.drawImage(images.bodyPartsImage.eyes, (playerInfoTemp.eyes % 5 * 2) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyes / 5) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          centerHeadPoint.x - canvasInfo.blockSize * zoomRatio * coefs[8] - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyesY,
          canvasInfo.blockSize * coefs[13] * zoomRatio, eyeYCoef * canvasInfo.blockSize * coefs[13] * zoomRatio)
        context.drawImage(images.bodyPartsImage.eyes, (playerInfoTemp.eyes % 5 * 2 + 1) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyes / 5) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          centerHeadPoint.x + canvasInfo.blockSize * zoomRatio * coefs[8] - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyesY,
          canvasInfo.blockSize * coefs[13] * zoomRatio, eyeYCoef * canvasInfo.blockSize * coefs[13] * zoomRatio)
        break
      case constants.OFFSET_Y_LEFTWARD:
        context.drawImage(images.bodyPartsImage.eyes, (playerInfoTemp.eyes % 5 * 2 + 1) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyes / 5) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          centerHeadPoint.x - canvasInfo.blockSize * zoomRatio * coefs[8] - 0.375 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyesY,
          canvasInfo.blockSize * coefs[13] * zoomRatio * 0.75, eyeYCoef * canvasInfo.blockSize * coefs[13] * zoomRatio)
        break
      case constants.OFFSET_Y_RIGHTWARD:
        context.drawImage(images.bodyPartsImage.eyes, (playerInfoTemp.eyes % 5 * 2) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyes / 5) * canvasInfo.imageBlockSize,
          canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
          centerHeadPoint.x + canvasInfo.blockSize * zoomRatio * coefs[8] - 0.375 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyesY,
          canvasInfo.blockSize * coefs[13] * zoomRatio * 0.75, eyeYCoef * canvasInfo.blockSize * coefs[13] * zoomRatio)
        break
      case constants.OFFSET_Y_UPWARD:
        break
    }
  },
  drawNose (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var colors = this.convertSkinColor(Number(playerInfoTemp.skinColor))
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    var noseRatio = 0.25
    var tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = canvasInfo.imageBlockSize
    var tempContext = tempCanvas.getContext('2d')
    var image
    image = images.imageData.creature[playerInfoTemp.id].nose
    var invalidImageData = !utilMethods.isDef(image)
    if (invalidImageData || (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData)) {
      // tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(images.bodyPartsImage.nose, playerInfoTemp.nose % 10 * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.nose / 10) % 10 * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
        0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      var rgbArray = utilMethods.rgbaStrToRgb(colors[1])
      var imageData = tempContext.getImageData(0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      var data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = Math.min(255, data[i + 0] * 1.25) * rgbArray[0] / 255
        data[i + 1] = Math.min(255, data[i + 1] * 1.25) * rgbArray[1] / 255
        data[i + 2] = Math.min(255, data[i + 2] * 1.25) * rgbArray[2] / 255
      }
      tempContext.putImageData(imageData, 0, 0)
      image = tempCanvas
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].nose = image
    }
    var context = canvasInfo.canvas.getContext('2d')

    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.drawImage(image, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x - 0.5 * noseRatio * canvasInfo.blockSize * zoomRatio,
          centerHeadPoint.y + (0.07 - 0.5 * noseRatio) * canvasInfo.blockSize * zoomRatio,
          noseRatio * canvasInfo.blockSize * zoomRatio, noseRatio * canvasInfo.blockSize * zoomRatio)
        break
      case constants.OFFSET_Y_LEFTWARD:
        break
      case constants.OFFSET_Y_RIGHTWARD:
        break
      case constants.OFFSET_Y_UPWARD:
        break
    }
  },
  drawMouth (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var colors = this.convertSkinColor(Number(playerInfoTemp.skinColor))
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    var mouthRatio = 0.25
    var tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = canvasInfo.imageBlockSize
    var tempContext = tempCanvas.getContext('2d')
    var image
    image = images.imageData.creature[playerInfoTemp.id].mouth
    var invalidImageData = !utilMethods.isDef(image)
    if (invalidImageData || (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData)) {
      // tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(images.bodyPartsImage.mouth, playerInfoTemp.mouth % 10 * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.mouth / 10) % 10 * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      var rgbArray = utilMethods.rgbaStrToRgb(colors[1])
      var imageData = tempContext.getImageData(0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      var data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = Math.min(255, data[i + 0] * 1.25) * rgbArray[0] / 255
        data[i + 1] = Math.min(255, data[i + 1] * 1.25) * rgbArray[1] / 255
        data[i + 2] = Math.min(255, data[i + 2] * 1.25) * rgbArray[2] / 255
      }
      tempContext.putImageData(imageData, 0, 0)
      image = tempCanvas
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].mouth = image
    }
    var context = canvasInfo.canvas.getContext('2d')

    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.drawImage(image, 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x + (- 0.5 * mouthRatio) * canvasInfo.blockSize * zoomRatio,
          centerHeadPoint.y + (0.15 - 0.5 * mouthRatio) * canvasInfo.blockSize * zoomRatio,
          mouthRatio * canvasInfo.blockSize * zoomRatio, mouthRatio * canvasInfo.blockSize * zoomRatio)
        break
      case constants.OFFSET_Y_LEFTWARD:
        context.drawImage(image, 0.5 * canvasInfo.imageBlockSize, 0, 0.5 * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x + (0 * mouthRatio - 0.1 * coefs[3]) * canvasInfo.blockSize * zoomRatio,
          centerHeadPoint.y + (0.15 - 0.5 * mouthRatio) * canvasInfo.blockSize * zoomRatio,
          0.5 * mouthRatio * canvasInfo.blockSize * zoomRatio, mouthRatio * canvasInfo.blockSize * zoomRatio)
        break
      case constants.OFFSET_Y_RIGHTWARD:
        context.drawImage(image, 0, 0, 0.5 * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x + (- 0.5 * mouthRatio + 0.1 * coefs[3]) * canvasInfo.blockSize * zoomRatio,
          centerHeadPoint.y + (0.15 - 0.5 * mouthRatio) * canvasInfo.blockSize * zoomRatio,
          0.5 * mouthRatio * canvasInfo.blockSize * zoomRatio, mouthRatio * canvasInfo.blockSize * zoomRatio)
        break
      case constants.OFFSET_Y_UPWARD:
        break
    }
  },
  drawTongue (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var colors = this.convertSkinColor(Number(playerInfoTemp.skinColor))
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    var tongueRatio = 0.1
    var tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = canvasInfo.imageBlockSize
    var tempContext = tempCanvas.getContext('2d')
    var image
    image = images.imageData.creature[playerInfoTemp.id].tongue
    var invalidImageData = !utilMethods.isDef(image)
    if (invalidImageData || (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData)) {
      // tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(images.bodyPartsImage.tongue, playerInfoTemp.tongue % 10 * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.tongue / 10) % 10 * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        0, 0.5, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      var rgbArray = utilMethods.rgbaStrToRgb(colors[1])
      var imageData = tempContext.getImageData(0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      var data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        data[i + 0] = Math.min(255, data[i + 0] * 1.25) * rgbArray[0] / 255
        data[i + 1] = Math.min(255, data[i + 1] * 1.25) * rgbArray[1] / 255
        data[i + 2] = Math.min(255, data[i + 2] * 1.25) * rgbArray[2] / 255
      }
      tempContext.putImageData(imageData, 0, 0)
      image = tempCanvas
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].tongue = image
    }
    var context = canvasInfo.canvas.getContext('2d')

    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.drawImage(image, 0, 0.25 * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 0.75 * canvasInfo.imageBlockSize,
          centerHeadPoint.x + (- 0.5 * tongueRatio) * canvasInfo.blockSize * zoomRatio,
          centerHeadPoint.y + (0.16 - 0 * tongueRatio) * canvasInfo.blockSize * zoomRatio,
          tongueRatio * canvasInfo.blockSize * zoomRatio, 0.75 * tongueRatio * canvasInfo.blockSize * zoomRatio)
        break
      case constants.OFFSET_Y_LEFTWARD:
        context.drawImage(image, 0.25 * canvasInfo.imageBlockSize, 0.5 * canvasInfo.imageBlockSize, 0.5 * canvasInfo.imageBlockSize, 0.75 * canvasInfo.imageBlockSize,
          centerHeadPoint.x + (0 * tongueRatio - 0.1 * coefs[3]) * canvasInfo.blockSize * zoomRatio,
          centerHeadPoint.y + (0.16 - 0 * tongueRatio) * canvasInfo.blockSize * zoomRatio,
          0.5 * tongueRatio * canvasInfo.blockSize * zoomRatio, 0.75 * tongueRatio * canvasInfo.blockSize * zoomRatio)
        break
      case constants.OFFSET_Y_RIGHTWARD:
        context.drawImage(image, 0, 0.25 * canvasInfo.imageBlockSize, 0.5 * canvasInfo.imageBlockSize, 0.75 * canvasInfo.imageBlockSize,
          centerHeadPoint.x + (- 0.5 * tongueRatio + 0.1 * coefs[3]) * canvasInfo.blockSize * zoomRatio,
          centerHeadPoint.y + (0.16 - 0 * tongueRatio) * canvasInfo.blockSize * zoomRatio,
          0.5 * tongueRatio * canvasInfo.blockSize * zoomRatio, 0.75 * tongueRatio * canvasInfo.blockSize * zoomRatio)
        break
      case constants.OFFSET_Y_UPWARD:
        break
    }
  },
  drawHeadHair (canvasInfo, staticData, images, userInfo, playerInfoTemp, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)
    var centerHeadPoint = {x: x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
    var rgbArray = utilMethods.hexToRgba(playerInfoTemp.hairColor, 1)
    var eyesY = centerHeadPoint.y + coefs[7] * coefs[13] * canvasInfo.blockSize * zoomRatio - 0.5 * canvasInfo.blockSize * coefs[13]
    var eyebrowsY = eyesY + (centerHeadPoint.y - canvasInfo.blockSize * zoomRatio / 2 - eyesY) * 0.15
    var mouthY = centerHeadPoint.y + 0.15 * coefs[10]
    var moustacheY = mouthY
    var moustacheRatio = 0.25
    var beardY = mouthY + canvasInfo.blockSize * zoomRatio * 0.27 * coefs[1]
    var beardRatio = 0.15
    var image
    var invalidImageData

    var tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = 4 * canvasInfo.imageBlockSize
    var tempContext = tempCanvas.getContext('2d')
    image = images.imageData.creature[playerInfoTemp.id].leftEyebrow
    invalidImageData = !utilMethods.isDef(image)
    if (invalidImageData || (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData)) {
      tempContext.drawImage(images.bodyPartsImage.eyebrows, (playerInfoTemp.eyebrows % 5 * 2) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyebrows / 5) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_DOWNWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      tempContext.drawImage(images.bodyPartsImage.eyebrows, (playerInfoTemp.eyebrows % 5 * 2) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyebrows / 5) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_RIGHTWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      this.mixColor(tempCanvas, rgbArray)
      image = tempCanvas
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].leftEyebrow = image
    }
    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x - canvasInfo.blockSize * zoomRatio * coefs[8] - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyebrowsY,
          canvasInfo.blockSize * coefs[13] * zoomRatio, canvasInfo.blockSize * coefs[13] * zoomRatio)
        break
      case constants.OFFSET_Y_RIGHTWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x + canvasInfo.blockSize * zoomRatio * coefs[8] - 0.375 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyebrowsY,
          canvasInfo.blockSize * coefs[13] * zoomRatio * 0.75, canvasInfo.blockSize * coefs[13] * zoomRatio)
        break
    }

    tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = 4 * canvasInfo.imageBlockSize
    tempContext = tempCanvas.getContext('2d')
    image = images.imageData.creature[playerInfoTemp.id].rightEyebrow
    invalidImageData = !utilMethods.isDef(image)
    if (invalidImageData || (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData)) {
      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(images.bodyPartsImage.eyebrows, (playerInfoTemp.eyebrows % 5 * 2 + 1) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyebrows / 5) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_DOWNWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      tempContext.drawImage(images.bodyPartsImage.eyebrows, (playerInfoTemp.eyebrows % 5 * 2 + 1) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.eyebrows / 5) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
        0, constants.OFFSET_Y_LEFTWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      this.mixColor(tempCanvas, rgbArray)
      image = tempCanvas
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].rightEyebrow = image
    }
    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x + canvasInfo.blockSize * zoomRatio * coefs[8] - 0.5 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyebrowsY,
          canvasInfo.blockSize * coefs[13] * zoomRatio, canvasInfo.blockSize * coefs[13] * zoomRatio)
        break
      case constants.OFFSET_Y_LEFTWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x - canvasInfo.blockSize * zoomRatio * coefs[8] - 0.375 * canvasInfo.blockSize * coefs[13] * zoomRatio, eyebrowsY,
          canvasInfo.blockSize * coefs[13] * zoomRatio * 0.75, canvasInfo.blockSize * coefs[13] * zoomRatio)
        break
    }

    tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = 4 * canvasInfo.imageBlockSize
    tempContext = tempCanvas.getContext('2d')
    image = images.imageData.creature[playerInfoTemp.id].moustache
    invalidImageData = !utilMethods.isDef(image)
    if (invalidImageData || (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData)) {
      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(images.bodyPartsImage.moustache, (playerInfoTemp.moustache % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.moustache / 10) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_DOWNWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      tempContext.drawImage(images.bodyPartsImage.moustache, (playerInfoTemp.moustache % 10 + 0.5) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.moustache / 10) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_LEFTWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      tempContext.drawImage(images.bodyPartsImage.moustache, (playerInfoTemp.moustache % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.moustache / 10) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_RIGHTWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      this.mixColor(tempCanvas, rgbArray)
      image = tempCanvas
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].moustache = image
    }
    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x - 0.5 * canvasInfo.blockSize * moustacheRatio * zoomRatio, moustacheY,
          canvasInfo.blockSize * moustacheRatio * zoomRatio, canvasInfo.blockSize * moustacheRatio * zoomRatio)
        break
      case constants.OFFSET_Y_LEFTWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x + 0.3 * (-0.6 - coefs[3]) * canvasInfo.blockSize * moustacheRatio * zoomRatio, moustacheY,
          canvasInfo.blockSize * moustacheRatio * zoomRatio / 2, canvasInfo.blockSize * moustacheRatio * zoomRatio)
        break
      case constants.OFFSET_Y_RIGHTWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x - 0.3 * (1.1 - coefs[3]) * canvasInfo.blockSize * moustacheRatio * zoomRatio, moustacheY,
          canvasInfo.blockSize * moustacheRatio * zoomRatio / 2, canvasInfo.blockSize * moustacheRatio * zoomRatio)
        break
    }

    tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = 4 * canvasInfo.imageBlockSize
    tempContext = tempCanvas.getContext('2d')
    image = images.imageData.creature[playerInfoTemp.id].beard
    invalidImageData = !utilMethods.isDef(image)
    if (invalidImageData || (utilMethods.isDef(playerInfoTemp.noImageData) && playerInfoTemp.noImageData)) {
      tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height)
      tempContext.drawImage(images.bodyPartsImage.beard, (playerInfoTemp.beard % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.beard / 10) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_DOWNWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      tempContext.drawImage(images.bodyPartsImage.beard, (playerInfoTemp.beard % 10 + 0.5) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.beard / 10) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_LEFTWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      tempContext.drawImage(images.bodyPartsImage.beard, (playerInfoTemp.beard % 10) * canvasInfo.imageBlockSize, Math.floor(playerInfoTemp.beard / 10) * canvasInfo.imageBlockSize,
        canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize, 
        0, constants.OFFSET_Y_RIGHTWARD * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
      this.mixColor(tempCanvas, rgbArray)
      image = tempCanvas
    }
    if (invalidImageData || (!utilMethods.isDef(playerInfoTemp.noImageData) || !playerInfoTemp.noImageData)) {
      images.imageData.creature[playerInfoTemp.id].beard = image
    }
    switch(offsetY) {
      case constants.OFFSET_Y_DOWNWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x - 0.5 * canvasInfo.blockSize * beardRatio * zoomRatio, beardY,
          canvasInfo.blockSize * beardRatio * zoomRatio, canvasInfo.blockSize * beardRatio * zoomRatio)
        break
      case constants.OFFSET_Y_LEFTWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x + 0.3 * (-0.7 - coefs[3]) * canvasInfo.blockSize * beardRatio * zoomRatio, beardY,
          canvasInfo.blockSize * beardRatio * zoomRatio / 2, canvasInfo.blockSize * beardRatio * zoomRatio)
        break
      case constants.OFFSET_Y_RIGHTWARD:
        context.drawImage(image, 0, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
          centerHeadPoint.x - 0.3 * (0.9 - coefs[3]) * canvasInfo.blockSize * beardRatio * zoomRatio, beardY,
          canvasInfo.blockSize * beardRatio * zoomRatio / 2, canvasInfo.blockSize * beardRatio * zoomRatio)
        break
    }
  },
  drawClothesByItemNo (canvasInfo, staticData, images, userInfo, outfitNo, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    var tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize / 2
    tempCanvas.height = canvasInfo.imageBlockSize / 2
    var tempContext = tempCanvas.getContext('2d')
    if (!utilMethods.isDef(images.imageData.item[outfitNo])) {
      var color
      switch (outfitNo) {
        case constants.ITEM_NO_OUTFIT_ZGC_1:
          color = 'rgba(0, 0, 196, 1)'
          break
        case constants.ITEM_NO_OUTFIT_ZGC_2:
          color = 'rgba(196, 0, 0, 1)'
          break
        case constants.ITEM_NO_OUTFIT_SOLDIER:
          color = 'rgba(0, 196, 0, 1)'
          break
        case constants.ITEM_NO_OUTFIT_SUIT_1:
        case constants.ITEM_NO_OUTFIT_SUIT_2:
          color = 'rgba(0, 0, 0, 1)'
          break
        case constants.ITEM_NO_OUTFIT_NRA_1:
        case constants.ITEM_NO_OUTFIT_NRA_2:
        case constants.ITEM_NO_OUTFIT_NRA_3:
        case constants.ITEM_NO_OUTFIT_NRA_4:
        case constants.ITEM_NO_OUTFIT_NRA_5:
        case constants.ITEM_NO_OUTFIT_NRA_6:
        case constants.ITEM_NO_OUTFIT_NRA_7:
        case constants.ITEM_NO_OUTFIT_IJA_1:
        case constants.ITEM_NO_OUTFIT_IJA_2:
          color = this.getUniformColor(outfitNo)
          break
      }
      tempContext.drawImage(images.itemsImage.outfit, (outfitNo == constants.ITEM_NO_OUTFIT_UNDERWEAR ? 1 : 0) * canvasInfo.imageBlockSize / 2, 0 * canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, 
          0, 0, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2)
      if (utilMethods.isDef(color)) {
        var rgbArray = utilMethods.rgbaStrToRgb(color)
        this.mixColor(tempCanvas, rgbArray)
      }
      images.imageData.item[outfitNo] = tempCanvas
    }
    context.drawImage(images.imageData.item[outfitNo], 0, 0, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2,
      (x - 0.25) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth,
      (y - 0.25) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight,
      canvasInfo.blockSize / 2 * zoomRatio, canvasInfo.blockSize / 2 * zoomRatio)
  },
  drawHatByItemNo (canvasInfo, staticData, images, userInfo, outfitNo, offsetX, offsetY, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d')
    // Reuse canvasInfo.tempCanvas if provided to reduce per-frame allocations
    var tempCanvas = canvasInfo.tempCanvas || document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = 4 * canvasInfo.imageBlockSize
    var invalidImageData = false
    if (!utilMethods.isDef(images.imageData.item[outfitNo])) {
      invalidImageData = true
      images.imageData.item[outfitNo] = []
    }
    if (!utilMethods.isDef(images.imageData.item[outfitNo][offsetX])) {
      invalidImageData = true
      images.imageData.item[outfitNo][offsetX] = []
    }
    if (!utilMethods.isDef(images.imageData.item[outfitNo][offsetX][offsetY])) {
      invalidImageData = true
      images.imageData.item[outfitNo][offsetX][offsetY] = []
    }
    var hatArray = images.imageData.item[outfitNo][offsetX][offsetY]
    if (invalidImageData) {
      hatArray = []
      var image
      switch (outfitNo) {
        case constants.ITEM_NO_OUTFIT_HAT_FARMER:
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 0, 0, 0, 0, 1, 'rgba(140, 140, 0, 1)')
          hatArray.push(image)
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 1, 0, 0, 0, 1, 'rgba(160, 160, 0, 1)')
          hatArray.push(image)
          break
        case constants.ITEM_NO_OUTFIT_HAT_RANGER:
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 0, 0, 0, 0, 1, 'rgba(56, 42, 0, 1)')
          hatArray.push(image)
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 1, 0, 0, 0, 1, 'rgba(64, 48, 0, 1)')
          hatArray.push(image)
          break
        case constants.ITEM_NO_OUTFIT_HAT_WHITE:
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 1, 0, 0, 0, 1, undefined)
          hatArray.push(image)
          break
        case constants.ITEM_NO_OUTFIT_HAT_BOWLER:
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 0, 0, 0, 0, 1, 'rgba(28, 28, 28, 1)')
          hatArray.push(image)
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 1, 0, 0, 0, 1, 'rgba(32, 32, 32, 1)')
          hatArray.push(image)
          break
        case constants.ITEM_NO_OUTFIT_HAT_TOP:
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 0, 0, 0, 0, 1, 'rgba(28, 28, 28, 1)')
          hatArray.push(image)
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 2, 0, 0, 0, 1, 'rgba(32, 32, 32, 1)')
          hatArray.push(image)
          break
        case constants.ITEM_NO_OUTFIT_HAT_RED:
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 2, 0, 0, 0, 1, 'rgba(196, 0, 0, 1)')
          hatArray.push(image)
          break
        case constants.ITEM_NO_OUTFIT_CAP_NRA_1:
        case constants.ITEM_NO_OUTFIT_CAP_NRA_2:
        case constants.ITEM_NO_OUTFIT_CAP_NRA_3:
        case constants.ITEM_NO_OUTFIT_CAP_NRA_4:
        case constants.ITEM_NO_OUTFIT_CAP_NRA_5:
        case constants.ITEM_NO_OUTFIT_CAP_NRA_6:
        case constants.ITEM_NO_OUTFIT_CAP_NRA_7:
          var uniformColor = this.getUniformColor(outfitNo)
          image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 3, 0, 0, 0, 1, uniformColor)
          hatArray.push(image)
          switch (offsetY) {
            case constants.OFFSET_Y_DOWNWARD:
              image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 4, 0, 0, 0, 1, uniformColor)
              hatArray.push(image)
              image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 8, 0, 0, 0, 1, undefined)
              hatArray.push(image)
              break
            case constants.OFFSET_Y_LEFTWARD:
              image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 5, 0, 0, 0, 1, uniformColor)
              hatArray.push(image)
              break
            case constants.OFFSET_Y_RIGHTWARD:
              image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 6, 0, 0, 0, 1, uniformColor)
              hatArray.push(image)
              break
            case constants.OFFSET_Y_UPWARD:
              break
          }
          break
          case constants.ITEM_NO_OUTFIT_CAP_IJA_1:
          case constants.ITEM_NO_OUTFIT_CAP_IJA_2:
            uniformColor = this.getUniformColor(outfitNo)
            image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 7, 0, 0, 0, 1, uniformColor)
            hatArray.push(image)
            switch (offsetY) {
              case constants.OFFSET_Y_DOWNWARD:
                image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 4, 0, 0, 0, 1, uniformColor)
                hatArray.push(image)
                image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 9, 0, 0, 0, 1, undefined)
                hatArray.push(image)
                break
              case constants.OFFSET_Y_LEFTWARD:
                image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 5, 0, 0, 0, 1, uniformColor)
                hatArray.push(image)
                break
              case constants.OFFSET_Y_RIGHTWARD:
                image = this.prepareDrawHat(canvasInfo, staticData, images, userInfo, 6, 0, 0, 0, 1, uniformColor)
                hatArray.push(image)
                break
              case constants.OFFSET_Y_UPWARD:
                break
            }
            break
      }
      images.imageData.item[outfitNo][offsetX][offsetY] = hatArray
    }
    for (let hatIndex in hatArray) {
      context.drawImage(hatArray[hatIndex], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
        (x - 0.5) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth,
        (y - 0.5) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight,
        canvasInfo.blockSize * zoomRatio, canvasInfo.blockSize * zoomRatio)
    }
  },
  prepareDrawHat (canvasInfo, staticData, images, userInfo, offsetX, offsetY, x, y, zoomRatio, color) {
    var tempCanvas = document.createElement('canvas')
    tempCanvas.width = canvasInfo.imageBlockSize
    tempCanvas.height = canvasInfo.imageBlockSize
    var tempContext = tempCanvas.getContext('2d')
    if (utilMethods.isDef(color)) {
      var rgbArray = utilMethods.rgbaStrToRgb(color)
    }
    tempContext.drawImage(images.bodyPartsImage.hat, offsetX * canvasInfo.imageBlockSize, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
      0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize)
    if (utilMethods.isDef(color)) {
      this.mixColor(tempCanvas, rgbArray)
    }
    return tempCanvas
  },
  generateImageByCanvas(canvas) {
    var image = new Image()
    image.src = canvas.toDataURL('image/png')
    return image
  },
  mixColor (tempCanvas, rgbArray) {
    var tempContext = tempCanvas.getContext('2d')
    var imageData = tempContext.getImageData(0, 0, tempCanvas.width, tempCanvas.height)
    var data = imageData.data
    for (let i = 0; i < data.length; i += 4) {
      data[i + 0] = Math.min(rgbArray[0], (data[i + 0] + rgbArray[0]) / 2)
      data[i + 1] = Math.min(rgbArray[1], (data[i + 1] + rgbArray[1]) / 2)
      data[i + 2] = Math.min(rgbArray[2], (data[i + 2] + rgbArray[2]) / 2)
    }
    tempContext.putImageData(imageData, 0, 0)
  },
  getUniformColor (outfitNo) {
    var uniformColor
    switch (outfitNo) {
      case constants.ITEM_NO_OUTFIT_NRA_1:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_1:
        uniformColor = 'rgba(60, 52, 37, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_2:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_2:
        uniformColor = 'rgba(216, 189, 132, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_3:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_3:
        uniformColor = 'rgba(162, 169, 175, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_4:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_4:
        uniformColor = 'rgba(66, 88, 117, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_5:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_5:
        uniformColor = 'rgba(182, 215, 168, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_6:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_6:
        uniformColor = 'rgba(28, 42, 67, 1)'
        break
      case constants.ITEM_NO_OUTFIT_NRA_7:
      case constants.ITEM_NO_OUTFIT_CAP_NRA_7:
        uniformColor = 'rgba(172, 222, 238, 1)'
        break
      case constants.ITEM_NO_OUTFIT_IJA_1:
      case constants.ITEM_NO_OUTFIT_CAP_IJA_1:
        uniformColor = 'rgba(123, 108, 77, 1)'
        break
      case constants.ITEM_NO_OUTFIT_IJA_2:
      case constants.ITEM_NO_OUTFIT_CAP_IJA_2:
        uniformColor = 'rgba(141, 134, 2, 1)'
        break
    }
    return uniformColor
  }
}
