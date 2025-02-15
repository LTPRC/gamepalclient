// draw.js

import { constants } from "./constants"
import { utilMethods } from "./util"
import { drawBlockMethods } from "./drawBlock"

export function drawMethod() {
  // 你的全局方法实现
}

// 或者如果有多个方法
export const drawMethods = {
  show (canvasInfo, staticData, images, userInfo) {
    // Region/scene smooth correction 24/08/26
    if (userInfo.regionInfo.regionNo !== userInfo.playerInfo.regionNo) {
      return
    }
    if (userInfo.sceneInfo.sceneCoordinate.x !== userInfo.playerInfo.sceneCoordinate.x || userInfo.sceneInfo.sceneCoordinate.y !== userInfo.playerInfo.sceneCoordinate.y) {
      return
    }

    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    context.clearRect(0, 0, canvasInfo.canvas.width, canvasInfo.canvas.height)
    canvasInfo.deltaWidth = canvasInfo.canvas.width / 2 - userInfo.playerInfo.coordinate.x * canvasInfo.blockSize
    canvasInfo.deltaHeight = canvasInfo.canvas.height / 2 - userInfo.playerInfo.coordinate.y * canvasInfo.blockSize
    var timestamp = new Date().valueOf()

    // Draw grid blocks
    if (utilMethods.isDef(userInfo.grids)) {
      drawBlockMethods.drawGridBlocks(canvasInfo, staticData, images, userInfo)
    }

    // Print blocks
    var blockToInteract = undefined
    var blockToInteractDistance = constants.MIN_INTERACTION_DISTANCE + 1
    for (var i = 0; i < userInfo.blocks.length; i++) {
      var block = userInfo.blocks[i]

      // Check drop
      // if (block.type == constants.BLOCK_TYPE_DROP && Math.pow(block.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(block.y - userInfo.playerInfo.coordinate.y, 2) <= Math.pow(constants.MIN_DROP_INTERACTION_DISTANCE, 2)) {
      //   this.useDrop(block)
      // }
      // Check interaction
      if (block.id != userInfo.userCode && utilMethods.checkBlockTypeInteractive(block.type)) {
        var distance = Math.sqrt(Math.pow(block.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(block.y - userInfo.playerInfo.coordinate.y, 2))
        if (Math.abs(userInfo.playerInfo.faceDirection - utilMethods.calculateAngle(block.x - userInfo.playerInfo.coordinate.x, block.y - userInfo.playerInfo.coordinate.y)) <= constants.MIN_INTERACTION_ANGLE && distance <= constants.MIN_INTERACTION_DISTANCE) {
          if ((!utilMethods.isDef(blockToInteract) || distance < blockToInteractDistance)) {
            blockToInteract = block
            blockToInteractDistance = distance
          }
        }
      }
      if (block.type == constants.BLOCK_TYPE_PLAYER) {
        this.drawCharacter(canvasInfo, staticData, images, userInfo, userInfo.playerInfos[block.id], block.x, block.y, 1)
      } else {
        drawBlockMethods.drawBlockByType(canvasInfo, staticData, images, userInfo, block)
      }
      if (block.type == constants.BLOCK_TYPE_DROP) {
        // Show notifications (drop)
        var playerInfo = userInfo.playerInfos[userInfo.userCode]
        if (Math.pow(playerInfo.coordinate.x - block.x, 2) + Math.pow(playerInfo.coordinate.y - block.y, 2) <= Math.pow(constants.MIN_DISPLAY_DISTANCE_BLOCK_PLAYER, 2)) {
          var itemName = staticData.items[block.itemNo].name
          this.printText(context, itemName + '(' + block.amount + ')', 
          block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
          (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
          canvasInfo.blockSize, 'center')
        }
      }
    }
    // Show interactions (new)
    if (utilMethods.isDef(blockToInteract)
        && (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_IDLE
        || canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_MOVING)) {
      this.updateInteractions(userInfo, blockToInteract)
      context.drawImage(images.effectsImage['selectionEffect'], Math.floor(timestamp / 100) % 10 * canvasInfo.imageBlockSize, 0 * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
      (blockToInteract.x - blockToInteract.structure.imageSize.x / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
      (blockToInteract.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
      canvasInfo.blockSize,
      canvasInfo.blockSize)
      var txt
      if (blockToInteract.id != userInfo.userCode && utilMethods.checkBlockTypeInteractive(blockToInteract.type)) {
        switch (blockToInteract.type) {
          case constants.BLOCK_TYPE_PLAYER:
            switch (userInfo.playerInfos[blockToInteract.id].playerType) {
              case constants.PLAYER_TYPE_HUMAN:
                txt = '[玩家]' + userInfo.playerInfos[blockToInteract.id].nickname
                break
              case constants.PLAYER_TYPE_NPC:
                switch (userInfo.playerInfos[blockToInteract.id].creatureType) {
                  case constants.CREATURE_TYPE_HUMAN:
                    txt = '[NPC]' + userInfo.playerInfos[blockToInteract.id].nickname
                    break
                  case constants.CREATURE_TYPE_ANIMAL:
                    txt = '动物'
                    break
                }
                break
            }
            break
          case constants.BLOCK_TYPE_BED:
            txt = '床'
            break
          case constants.BLOCK_TYPE_TOILET:
            txt = '马桶'
            break
          case constants.BLOCK_TYPE_DRESSER:
            txt = '梳妆台'
            break
          case constants.BLOCK_TYPE_GAME:
            txt = '桌游'
            break
          case constants.BLOCK_TYPE_STORAGE:
            txt = '私人储藏箱'
            break
          case constants.BLOCK_TYPE_COOKER:
            txt = '灶台'
            break
          case constants.BLOCK_TYPE_SINK:
            txt = '饮水台'
            break
          case constants.BLOCK_TYPE_CONTAINER:
            txt = '容器'
            break
          case constants.BLOCK_TYPE_SPEAKER:
            txt = '扩音器'
            break
          case constants.BLOCK_TYPE_TREE:
            txt = '树'
            break
          case constants.BLOCK_TYPE_ROCK:
            txt = '岩石'
            break
          case constants.BLOCK_TYPE_FARM:
            txt = '农作物'
            break
          case constants.BLOCK_TYPE_WORKSHOP:
            txt = '工作台'
            break
          case constants.BLOCK_TYPE_WORKSHOP_TOOL:
            txt = '工具工坊'
            break
          case constants.BLOCK_TYPE_WORKSHOP_AMMO:
            txt = '弹药工坊'
            break
          case constants.BLOCK_TYPE_WORKSHOP_OUTFIT:
            txt = '服装工坊'
            break
          case constants.BLOCK_TYPE_WORKSHOP_CHEM:
            txt = '化学工坊'
            break
          case constants.BLOCK_TYPE_WORKSHOP_RECYCLE:
            txt = '回收站'
            break
          default:
            txt = '类型:' + blockToInteract.type
            break
        }
        if (utilMethods.isDef(blockToInteract.hp) && utilMethods.isDef(blockToInteract.hpMax)) {
          txt += ' ' + blockToInteract.hp + '/' + blockToInteract.hpMax
        }
        this.printText(context, txt, canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y - 1.5 * canvasInfo.blockSize, canvasInfo.blockSize, 'center')
      }
      document.getElementById('interactions').style.display = 'inline'
    } else {
      document.getElementById('interactions').style.display = 'none'
    }

    // Show worldTime
    var hour = Math.floor(userInfo.worldInfo.worldTime / 3600)
    var minute = Math.floor(userInfo.worldInfo.worldTime / 60) % 60
    this.printText(context, 'Time: ' + (hour % 12) + ':' + minute.toString().padStart(2, '0') + ' ' + (hour >= 12 ? 'PM' : 'AM'), canvasInfo.canvas.width / 2, constants.DEFAULT_BUTTON_SIZE / 2, constants.DEFAULT_BUTTON_SIZE * 2, 'center')

    // Show avater
    this.drawAvatar(canvasInfo, staticData, images, userInfo, canvasInfo.avatarPosition.x * canvasInfo.blockSize, canvasInfo.avatarPosition.y * canvasInfo.blockSize, constants.DEFAULT_AVATAR_SIZE, userInfo.playerInfo.avatar, userInfo.playerInfo.nameColor)
    var topBossId = this.findTopBossId(userInfo, userInfo.playerInfo)
    if (utilMethods.isDef(topBossId) && topBossId != userInfo.userCode) {
      this.drawAvatar(canvasInfo, staticData, images, userInfo, canvasInfo.avatarPosition.x * canvasInfo.blockSize, canvasInfo.avatarPosition.y * canvasInfo.blockSize, constants.DEFAULT_AVATAR_SIZE / 2, userInfo.playerInfos[topBossId].avatar, userInfo.playerInfos[topBossId].nameColor)
    }
    
    // Show buttons
    if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_INFO) {
      context.drawImage(images.buttons, 0 * constants.DEFAULT_BUTTON_SIZE, 0 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.buttonPositions[0].x, canvasInfo.buttonPositions[0].y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    } else {
      context.drawImage(images.buttons, 0 * constants.DEFAULT_BUTTON_SIZE, 1 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.buttonPositions[0].x, canvasInfo.buttonPositions[0].y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    }
    if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_BACKPACK) {
      context.drawImage(images.buttons, 1 * constants.DEFAULT_BUTTON_SIZE, 0 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.buttonPositions[1].x, canvasInfo.buttonPositions[1].y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    } else {
      context.drawImage(images.buttons, 1 * constants.DEFAULT_BUTTON_SIZE, 1 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.buttonPositions[1].x, canvasInfo.buttonPositions[1].y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    }
    if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MEMBERS) {
      context.drawImage(images.buttons, 2 * constants.DEFAULT_BUTTON_SIZE, 0 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.buttonPositions[2].x, canvasInfo.buttonPositions[2].y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    } else {
      context.drawImage(images.buttons, 2 * constants.DEFAULT_BUTTON_SIZE, 1 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.buttonPositions[2].x, canvasInfo.buttonPositions[2].y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    }
    if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_SETTINGS) {
      context.drawImage(images.buttons, 3 * constants.DEFAULT_BUTTON_SIZE, 0 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.buttonPositions[3].x, canvasInfo.buttonPositions[3].y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    } else {
      context.drawImage(images.buttons, 3 * constants.DEFAULT_BUTTON_SIZE, 1 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.buttonPositions[3].x, canvasInfo.buttonPositions[3].y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    }
    var imageX
    if (userInfo.movementMode === constants.MOVEMENT_MODE_STAND_GROUND) {
      imageX = 4
    } else if (userInfo.movementMode === constants.MOVEMENT_MODE_WALK) {
      imageX = 5
    } else {
      imageX = 6
    }
    if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_MOVEMENT_MODE) {
      context.drawImage(images.buttons, imageX * constants.DEFAULT_BUTTON_SIZE, 0 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.movementModeButtonPosition.x, canvasInfo.movementModeButtonPosition.y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    } else {
      context.drawImage(images.buttons, imageX * constants.DEFAULT_BUTTON_SIZE, 1 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.movementModeButtonPosition.x, canvasInfo.movementModeButtonPosition.y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    }
    if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_CHAT_DISPLAY) {
      context.drawImage(images.buttons, 7 * constants.DEFAULT_BUTTON_SIZE, 0 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.chatDisplayButtonPosition.x, canvasInfo.chatDisplayButtonPosition.y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    } else {
      context.drawImage(images.buttons, 7 * constants.DEFAULT_BUTTON_SIZE, 1 * constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE, canvasInfo.chatDisplayButtonPosition.x, canvasInfo.chatDisplayButtonPosition.y, constants.DEFAULT_BUTTON_SIZE, constants.DEFAULT_BUTTON_SIZE)
    }

    // Show minimap
    this.drawMinimap(canvasInfo, staticData, images, userInfo)

    // Show status1
    if (utilMethods.isDef(userInfo.playerInfo.nickname) && utilMethods.isDef(userInfo.playerInfo.lastName) && utilMethods.isDef(userInfo.playerInfo.firstName)) {
      this.printText(context, 'Lv.' + userInfo.playerInfo.level + ' ' + userInfo.playerInfo.nickname + '(' + userInfo.playerInfo.lastName + ',' + userInfo.playerInfo.firstName + ')', canvasInfo.status1Position.x, canvasInfo.status1Position.y + 1 * constants.STATUS_SIZE, constants.DEFAULT_BUTTON_SIZE * 5, 'left')
    } else {
      this.printText(context, 'Lv.' + userInfo.playerInfo.level, canvasInfo.status1Position.x, canvasInfo.status1Position.y + 1 * constants.STATUS_SIZE, constants.STATUS_SIZE * 10, 'left')
    }
    this.printText(context, '经验值' + userInfo.playerInfo.exp + '/' + userInfo.playerInfo.expMax, canvasInfo.status1Position.x, canvasInfo.status1Position.y + 2 * constants.STATUS_SIZE, constants.STATUS_SIZE * 10)

    context.save()
    context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    context.fillStyle = 'rgba(191, 191, 191, 0.5)'
    context.fillRect(canvasInfo.status1Position.x, canvasInfo.status1Position.y + 2.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE * userInfo.playerInfo.exp / userInfo.playerInfo.expMax, constants.STATUS_SIZE * 0.75)
    context.strokeRect(canvasInfo.status1Position.x, canvasInfo.status1Position.y + 2.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, constants.STATUS_SIZE * 0.75)

    // show status2
    this.printText(context, '生命值' + userInfo.playerInfo.hp + '/' + userInfo.playerInfo.hpMax, canvasInfo.status2Position.x, canvasInfo.status2Position.y + 1 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, 'left')
    this.printText(context, '活力值' + userInfo.playerInfo.vp + '/' + userInfo.playerInfo.vpMax, canvasInfo.status2Position.x, canvasInfo.status2Position.y + 3 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, 'left')
    this.printText(context, '饥饿值' + userInfo.playerInfo.hunger + '/' + userInfo.playerInfo.hungerMax, canvasInfo.status2Position.x, canvasInfo.status2Position.y + 5 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, 'left')
    this.printText(context, '口渴值' + userInfo.playerInfo.thirst + '/' + userInfo.playerInfo.thirstMax, canvasInfo.status2Position.x, canvasInfo.status2Position.y + 7 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, 'left')
    context.fillStyle = 'rgba(191, 191, 0, 0.5)'
    context.fillRect(canvasInfo.status2Position.x, canvasInfo.status2Position.y + 1.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE * userInfo.playerInfo.hp / userInfo.playerInfo.hpMax, constants.STATUS_SIZE * 0.75)
    context.fillStyle = 'rgba(0, 191, 0, 0.5)'
    context.fillRect(canvasInfo.status2Position.x, canvasInfo.status2Position.y + 3.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE * userInfo.playerInfo.vp / userInfo.playerInfo.vpMax, constants.STATUS_SIZE * 0.75)
    context.fillStyle = 'rgba(191, 0, 0, 0.5)'
    context.fillRect(canvasInfo.status2Position.x, canvasInfo.status2Position.y + 5.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE * userInfo.playerInfo.hunger / userInfo.playerInfo.hungerMax, constants.STATUS_SIZE * 0.75)
    context.fillStyle = 'rgba(0, 0, 191, 0.5)'
    context.fillRect(canvasInfo.status2Position.x, canvasInfo.status2Position.y + 7.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE * userInfo.playerInfo.thirst / userInfo.playerInfo.thirstMax, constants.STATUS_SIZE * 0.75)
    context.strokeRect(canvasInfo.status2Position.x, canvasInfo.status2Position.y + 1.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, constants.STATUS_SIZE * 0.75)
    context.strokeRect(canvasInfo.status2Position.x, canvasInfo.status2Position.y + 3.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, constants.STATUS_SIZE * 0.75)
    context.strokeRect(canvasInfo.status2Position.x, canvasInfo.status2Position.y + 5.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, constants.STATUS_SIZE * 0.75)
    context.strokeRect(canvasInfo.status2Position.x, canvasInfo.status2Position.y + 7.25 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, constants.STATUS_SIZE * 0.75)
    context.restore()

    var index = 1.5
    for (i = constants.BUFF_CODE_DEAD; i < constants.BUFF_CODE_LENGTH; i++) {
      if (userInfo.playerInfo.buff[i] != 0) {
        context.drawImage(images.buffs, (i % 10) * constants.DEFAULT_SMALL_BUTTON_SIZE, Math.floor(i / 10) * constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.canvas.width - index * constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.status2Position.y + 8 * constants.STATUS_SIZE + 0.5 * constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE)
        index++
        if (i == constants.BUFF_CODE_DEAD) {
          this.quitInteraction(canvasInfo, staticData, images, userInfo)
        }
      }
    }
    this.printText(context, 'Delay: ' + (userInfo.diffSecond * 1000 + userInfo.diffMillisecond) + 'ms', canvasInfo.status2Position.x, canvasInfo.status2Position.y + 12 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, 'left')
    this.printText(context, 'Size: ' + (userInfo.websocketMsgSize / 1024).toFixed(1) + 'KB', canvasInfo.status2Position.x, canvasInfo.status2Position.y + 13 * constants.STATUS_SIZE, constants.MAX_STATUS_LINE_SIZE, 'left')

    // Show chat
    document.getElementById('chat').style.display = userInfo.chatInfo.chatDisplay ? 'inline' : 'none'
    switch (userInfo.chatInfo.scope) {
      case constants.SCOPE_GLOBAL:
        document.getElementById('chat-scope').innerText = '[广播]'
        break
      case constants.SCOPE_TEAMMATE:
        document.getElementById('chat-scope').innerText = '[队友]'
        break
      case constants.SCOPE_INDIVIDUAL:
        document.getElementById('chat-scope').innerText = '[个人]'
        if (utilMethods.isDef(userInfo.chatInfo.chatTo) && utilMethods.isDef(userInfo.playerInfos[userInfo.chatInfo.chatTo])) {
          document.getElementById('chat-scope').innerText += userInfo.playerInfos[userInfo.chatInfo.chatTo].nickname
        } else {
          document.getElementById('chat-scope').innerText += '无'
        }
        break
    }
    if (userInfo.chatInfo.chatDisplay) {
      if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_RECORDER) {
        context.drawImage(images.smallButtons, 0 * constants.DEFAULT_SMALL_BUTTON_SIZE, 0 * constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.recordButtonPosition.x, canvasInfo.recordButtonPosition.y, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE)
      } else {
        context.drawImage(images.smallButtons, 0 * constants.DEFAULT_SMALL_BUTTON_SIZE, 1 * constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.recordButtonPosition.x, canvasInfo.recordButtonPosition.y, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE)
      }
    }
    this.printChat(canvasInfo, staticData, images, userInfo)
    
    // Show menus
    document.getElementById('items').style.display = 'none'
    document.getElementById('items-exchange').style.display = 'none'
    document.getElementById('members').style.display = 'none'
    document.getElementById('settings').style.display = 'none'
    document.getElementById('initialization').style.display = 'none'
    // document.getElementById('terminal').style.display = 'none'
    if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_INFO) {
      this.printMenu(canvasInfo, staticData, images, userInfo)
      this.printStatus(canvasInfo, staticData, images, userInfo)
    }
    if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_BACKPACK) {
      document.getElementById('items').style.display = 'inline'
      document.getElementById('items-choose').style.display = 'inline'
      document.getElementById('items-remove').style.display = 'inline'
      document.getElementById('items-recycle').style.display = 'none'
      this.printMenu(canvasInfo, staticData, images, userInfo)
      this.printItems(canvasInfo, staticData, images, userInfo)
    }
    if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_SETTINGS) {
      document.getElementById('settings').style.display = 'inline'
      this.printMenu(canvasInfo, staticData, images, userInfo)
      this.printSettings(canvasInfo)
    }
    if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_EXCHANGE) {
      document.getElementById('items').style.display = 'inline'
      document.getElementById('items-choose').style.display = 'none'
      document.getElementById('items-remove').style.display = 'none'
      document.getElementById('items-recycle').style.display = 'none'
      document.getElementById('items-exchange').style.display = 'inline'
      this.printMenu(canvasInfo, staticData, images, userInfo)
      this.printExchange(canvasInfo, staticData, images, userInfo)
    }
    document.getElementById('recipes').style.display = 'none'
    document.getElementById('terminal').style.display = 'none'
    if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_USE) {
      if (utilMethods.isDef(userInfo.interactionInfo)) {
        this.printMenu(canvasInfo, staticData, images, userInfo)
        if (userInfo.interactionInfo.type == constants.BLOCK_TYPE_GAME) {
          // document.getElementById('terminal').style.display = 'inline'
          // this.printTerminal(terminalOutputs, canvasInfo.imageBlockSize, canvasInfo.blockSize)
        } else if (block.type == constants.BLOCK_TYPE_WORKSHOP
            || block.type == constants.BLOCK_TYPE_WORKSHOP_TOOL
            || block.type == constants.BLOCK_TYPE_WORKSHOP_AMMO
            || block.type == constants.BLOCK_TYPE_WORKSHOP_OUTFIT
            || block.type == constants.BLOCK_TYPE_WORKSHOP_CHEM) {
          document.getElementById('recipes').style.display = 'inline'
          this.printText(context, document.getElementById('recipes-range').value, constants.MENU_LEFT_EDGE + 130, constants.MENU_TOP_EDGE + 125, 50, 'left')
        } else if (userInfo.interactionInfo.type == constants.BLOCK_TYPE_WORKSHOP_RECYCLE) {
          document.getElementById('items').style.display = 'inline'
          document.getElementById('items-choose').style.display = 'none'
          document.getElementById('items-remove').style.display = 'none'
          document.getElementById('items-recycle').style.display = 'inline'
          this.printMenu(canvasInfo, staticData, images, userInfo)
          this.printItems(canvasInfo, staticData, images, userInfo)
        }
      }
    }
    if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_SET) {
      document.getElementById('initialization').style.display = 'inline'
      this.printMenu(canvasInfo, staticData, images, userInfo)
      this.printInitialization(canvasInfo, staticData, images, userInfo)
    }
    if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_MEMBERS) {
      document.getElementById('members').style.display = 'inline'
      this.printMenu(canvasInfo, staticData, images, userInfo)
      this.printMembers(canvasInfo, staticData, images, userInfo)
    }

    // Show wheel1
    context.save()
    context.fillStyle = 'rgba(127, 127, 127, 0.5)'
    context.beginPath()
    context.arc(canvasInfo.wheel1Position.x, canvasInfo.wheel1Position.y, constants.WHEEL_1_RADIUS, 0, 2 * Math.PI)
    context.fill()
    context.fillStyle = 'rgba(63, 63, 63, 0.75)'
    context.beginPath()
    context.arc(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y, constants.WHEEL_1_RADIUS / 2, 0, 2 * Math.PI)
    context.fill()
    context.fillStyle = 'rgba(127, 127, 127, 0.75)'
    context.beginPath()
    context.arc(canvasInfo.handle1Position.x, canvasInfo.handle1Position.y, constants.WHEEL_1_RADIUS * 0.45, 0, 2 * Math.PI)
    context.fill()
    context.restore()

    // Show wheel2
    context.save()
    context.fillStyle = 'rgba(127, 127, 127, 0.75)'
    context.beginPath()
    context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS, 0, 2 * Math.PI)
    context.fill()
    context.restore()

    context.save()
    if (canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_UP] || canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_UP]) {
      context.fillStyle = 'rgba(255, 255, 255, 0.25)'
      context.beginPath()
      context.moveTo(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y)
      context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS, 1.25 * Math.PI, 1.75 * Math.PI)
      context.fill()
    } else {
      context.fillStyle = 'rgba(0, 0, 0, 0.25)'
      context.beginPath()
      context.moveTo(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y)
      context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS * Math.max(0, userInfo.playerInfo.skills[0].frame) / userInfo.playerInfo.skills[0].frameMax, 1.25 * Math.PI, 1.75 * Math.PI)
      context.fill()
    }
    if (canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_LEFT] || canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_LEFT]) {
      context.fillStyle = 'rgba(255, 255, 255, 0.25)'
      context.beginPath()
      context.moveTo(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y)
      context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS, 0.75 * Math.PI, 1.25 * Math.PI)
      context.fill()
    } else {
      context.fillStyle = 'rgba(0, 0, 0, 0.25)'
      context.beginPath()
      context.moveTo(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y)
      context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS * Math.max(0, userInfo.playerInfo.skills[1].frame) / userInfo.playerInfo.skills[1].frameMax, 0.75 * Math.PI, 1.25 * Math.PI)
      context.fill()
    }
    if (canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_RIGHT] || canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_RIGHT]) {
      context.fillStyle = 'rgba(255, 255, 255, 0.25)'
      context.beginPath()
      context.moveTo(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y)
      context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS, -0.25 * Math.PI, 0.25 * Math.PI)
      context.fill()
    } else {
      context.fillStyle = 'rgba(0, 0, 0, 0.25)'
      context.beginPath()
      context.moveTo(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y)
      context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS * Math.max(0, userInfo.playerInfo.skills[2].frame) / userInfo.playerInfo.skills[2].frameMax, -0.25 * Math.PI, 0.25 * Math.PI)
      context.fill()
    }
    if (canvasInfo.keyboardInteractions[constants.KEY_INDEX_SKILL_DOWN] || canvasInfo.mouseInteractions[constants.KEY_INDEX_SKILL_DOWN]) {
      context.fillStyle = 'rgba(255, 255, 255, 0.25)'
      context.beginPath()
      context.moveTo(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y)
      context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS, 0.25 * Math.PI, 0.75 * Math.PI)
      context.fill()
    } else {
      context.fillStyle = 'rgba(0, 0, 0, 0.25)'
      context.beginPath()
      context.moveTo(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y)
      context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS * Math.max(0, userInfo.playerInfo.skills[3].frame) / userInfo.playerInfo.skills[3].frameMax, 0.25 * Math.PI, 0.75 * Math.PI)
      context.fill()
    }
    context.restore()

    context.save()
    context.strokeStyle = 'rgba(63, 63, 63, 0.75)'
    context.beginPath()
    context.moveTo(canvasInfo.wheel2Position.x - Math.sqrt(0.5) * constants.WHEEL_2_RADIUS, canvasInfo.wheel2Position.y + Math.sqrt(0.5) * constants.WHEEL_2_RADIUS)
    context.lineTo(canvasInfo.wheel2Position.x + Math.sqrt(0.5) * constants.WHEEL_2_RADIUS, canvasInfo.wheel2Position.y - Math.sqrt(0.5) * constants.WHEEL_2_RADIUS)
    context.moveTo(canvasInfo.wheel2Position.x - Math.sqrt(0.5) * constants.WHEEL_2_RADIUS, canvasInfo.wheel2Position.y - Math.sqrt(0.5) * constants.WHEEL_2_RADIUS)
    context.lineTo(canvasInfo.wheel2Position.x + Math.sqrt(0.5) * constants.WHEEL_2_RADIUS, canvasInfo.wheel2Position.y + Math.sqrt(0.5) * constants.WHEEL_2_RADIUS)
    context.stroke()
    context.restore()

    context.save()
    context.fillStyle = 'rgba(63, 63, 63, 0.75)'
    context.beginPath()
    context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS * 0.1, 0, 2 * Math.PI)
    context.fill()
    context.fillStyle = 'rgba(127, 127, 127, 0.75)'
    context.beginPath()
    context.arc(canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS * 0.05, 0, 2 * Math.PI)
    context.fill()
    context.restore()

    this.printText(context, this.generateskillsName(userInfo, userInfo.playerInfo.skills[0]), canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y - constants.WHEEL_2_RADIUS * 0.5, constants.WHEEL_2_RADIUS * 0.8, 'center')
    this.printText(context, this.generateskillsName(userInfo, userInfo.playerInfo.skills[1]), canvasInfo.wheel2Position.x - constants.WHEEL_2_RADIUS * 0.6, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS * 0.8, 'center')
    this.printText(context, this.generateskillsName(userInfo, userInfo.playerInfo.skills[2]), canvasInfo.wheel2Position.x + constants.WHEEL_2_RADIUS * 0.6, canvasInfo.wheel2Position.y, constants.WHEEL_2_RADIUS * 0.8, 'center')
    this.printText(context, this.generateskillsName(userInfo, userInfo.playerInfo.skills[3]), canvasInfo.wheel2Position.x, canvasInfo.wheel2Position.y + constants.WHEEL_2_RADIUS * 0.5, constants.WHEEL_2_RADIUS * 0.8, 'center')

    // Show sight
    this.printSight(canvasInfo, staticData, images, userInfo)
    // Show pointer (old)
    // context.save()
    // context.lineWidth = canvasInfo.blockSize * (100 + timestamp % 900) / 1000
    // context.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    // context.beginPath()
    // context.arc(canvasInfo.pointer.x - (document.documentElement.scrollLeft - canvasInfo.deltaWidth), canvasInfo.pointer.y - (document.documentElement.scrollTop - canvasInfo.deltaHeight), 1, 0, 2 * Math.PI)
    // context.closePath()
    // context.stroke()
    // context.restore()
  },
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
  drawCharacter (canvasInfo, staticData, images, userInfo, playerInfoTemp, x, y, zoomRatio) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    var coefs = utilMethods.convertFaceCoefsToCoefs(playerInfoTemp.faceCoefs)

    var avatarIndex = playerInfoTemp.avatar
    if (playerInfoTemp.creatureType == constants.CREATURE_TYPE_HUMAN) {
      var topBossId = this.findTopBossId(userInfo, playerInfoTemp)
      avatarIndex = utilMethods.isDef(topBossId) && topBossId != playerInfoTemp.id ? userInfo.playerInfos[topBossId].avatar : playerInfoTemp.avatar
    }

    // Draw creature shadow
    context.save()
    context.beginPath()
    context.fillStyle = 'rgba(31, 31, 31, 0.25)'
    context.ellipse(x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight,
      canvasInfo.blockSize * zoomRatio * 0.2, canvasInfo.blockSize * zoomRatio * 0.1, 0, 0, 2 * Math.PI)
    context.fill()
    context.restore()

    var offsetX, offsetY
    if (playerInfoTemp.faceDirection >= 315 || playerInfoTemp.faceDirection < 45) {
      offsetY = constants.OFFSET_Y_RIGHTWARD
    } else if (playerInfoTemp.faceDirection >= 45 && playerInfoTemp.faceDirection < 135) {
      offsetY = constants.OFFSET_Y_UPWARD
    } else if (playerInfoTemp.faceDirection >= 135 && playerInfoTemp.faceDirection < 225) {
      offsetY = constants.OFFSET_Y_LEFTWARD
    } else if (playerInfoTemp.faceDirection >= 225 && playerInfoTemp.faceDirection < 315) {
      offsetY = constants.OFFSET_Y_DOWNWARD
    } else {
      offsetY = constants.OFFSET_Y_DOWNWARD
    }
    var timestamp = new Date().valueOf()
    var speed = Math.sqrt(Math.pow(playerInfoTemp.speed.x, 2) + Math.pow(playerInfoTemp.speed.y, 2))
    var movementPeriod
    if (speed >= 0.4) {
      movementPeriod = 50
    } else if (speed >= 0.2) {
      movementPeriod = 100
    } else if (speed >= 0.1) {
      movementPeriod = 200
    } else if (speed >= 0.05) {
      movementPeriod = 500
    } else if (speed >= 0) {
      movementPeriod = 1000
    }
    
    if (speed !== 0 && (timestamp % 1000) % movementPeriod < movementPeriod * 0.25) {
      offsetX = constants.OFFSET_X_LEFT
    } else if (speed !== 0 && timestamp % movementPeriod >= movementPeriod * 0.5 && timestamp % movementPeriod < movementPeriod * 0.75) {
      offsetX = constants.OFFSET_X_RIGHT
    } else {
      offsetX = constants.OFFSET_X_MIDDLE
    }

    if (utilMethods.isDef(playerInfoTemp.buff)) {
      if (playerInfoTemp.buff[constants.BUFF_CODE_DEAD] !== 0) {
        // TODO Show dead creature
        return
      }
      if (playerInfoTemp.buff[constants.BUFF_CODE_KNOCKED] !== 0) {
        // TODO Check knocked details
      }
    }
    if (playerInfoTemp.creatureType == constants.CREATURE_TYPE_HUMAN) {
      // Display RPG character
      var upOffsetX = offsetX
      var isHoldingTool = false
      if (utilMethods.isDef(playerInfoTemp.tools) && playerInfoTemp.tools.length > 0) {
        // Upper body is static while holding any tool
        upOffsetX = 1
        isHoldingTool = true
      }
      if (playerInfoTemp.gender == constants.GENDER_FEMALE) {
        upOffsetX += 3
      }
      // var areaWidth = 1
      // var areaHeight = 1
      var deltaY = 0
      switch (playerInfoTemp.floorCode) {
        case constants.BLOCK_CODE_WATER_SHALLOW:
          deltaY = -0.1 * coefs[10] / 2
          break
        case constants.BLOCK_CODE_WATER_MEDIUM:
          deltaY = -0.6 * coefs[10] / 2
          break
        case constants.BLOCK_CODE_WATER_DEEP:
          deltaY = -1.1 * coefs[10] / 2
          break
      }
      var crotchAreaAltitude = 0.6 * coefs[10] / 2 + deltaY
      var breastAreaAltitude = crotchAreaAltitude + 0.5 * coefs[10] / 2
      var torsoAreaAltitude = breastAreaAltitude + 0.15 * coefs[10] / 2
      var headAreaAltitude = torsoAreaAltitude + 0.6 * coefs[10] / 2
      // var noseAltitude = headAreaAltitude - 0.15 * coefs[10] / 2
      // var mouthAltitude = noseAltitude - 0.15 * coefs[10] / 2
      var shoulderWidth = 0.3 * coefs[10] / 2
      var breastsWidth = 0.1 * coefs[12] / 2
      var breastsImageRatio = 0.25
      var accessoriesImageRatio = 0.12
      // var headUpLeftPoint = {x: (x - areaWidth / 2) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: (y - headAreaAltitude - areaHeight / 2) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
      // var headDownRightPoint = {x: (x + areaWidth / 2) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth, y: (y - headAreaAltitude + areaHeight / 2) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight}
      // var neckWidth = 0.075 * canvasInfo.blockSize * zoomRatio
      // var neckHeight = 0.3 * canvasInfo.blockSize * zoomRatio

      var toolShift
      var toolShiftLegth = -0.1
      var toolShiftPeriod = 1
      if (userInfo.playerInfo.skills[0].frame < Math.max(toolShiftPeriod, userInfo.playerInfo.skills[0].frameMax - toolShiftPeriod)) {
        toolShift = {
          x: 0,
          y: 0
        }
      } else {
        // toolShift = {
        //   x: Math.cos(userInfo.playerInfo.faceDirection / 180 * Math.PI) * toolShiftLegth,
        //   y: - Math.sin(userInfo.playerInfo.faceDirection / 180 * Math.PI) * toolShiftLegth
        // }
        switch (offsetY) {
          case constants.OFFSET_Y_DOWNWARD:
            toolShift = {
              x: Math.cos(-0.25 * Math.PI) * toolShiftLegth,
              y: - Math.sin(-0.25 * Math.PI) * toolShiftLegth
            }
            break
          case constants.OFFSET_Y_LEFTWARD:
            toolShift = {
              x: Math.cos(1 * Math.PI) * toolShiftLegth,
              y: - Math.sin(1 * Math.PI) * toolShiftLegth
            }
            break
          case constants.OFFSET_Y_RIGHTWARD:
            toolShift = {
              x: Math.cos(0 * Math.PI) * toolShiftLegth,
              y: - Math.sin(0 * Math.PI) * toolShiftLegth
            }
            break
          case constants.OFFSET_Y_UPWARD:
            toolShift = {
              x: Math.cos(0.75 * Math.PI) * toolShiftLegth,
              y: - Math.sin(0.75 * Math.PI) * toolShiftLegth
            }
            break
        }
      }

      // Draw bottom breast
      switch (offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
        case constants.OFFSET_Y_UPWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 1, 1, x, y - breastAreaAltitude,
            coefs[11] * coefs[12] * breastsImageRatio, coefs[10] * coefs[12] * breastsImageRatio, zoomRatio, constants.BODY_PART_BREAST)
          break
        case constants.OFFSET_Y_LEFTWARD:
        case constants.OFFSET_Y_RIGHTWARD:
          break
      }

      // Draw bottom arms and hands
      switch (offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
          break
        case constants.OFFSET_Y_LEFTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_RIGHT_ARM)
            for (let toolIndex in playerInfoTemp.tools) {
              drawBlockMethods.drawTool(canvasInfo, staticData, images, userInfo, x + toolShift.x, y - deltaY + toolShift.y, playerInfoTemp.tools[toolIndex], offsetY, zoomRatio)
            }
          break
        case constants.OFFSET_Y_RIGHTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_LEFT_ARM)
          break
        case constants.OFFSET_Y_UPWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_UPWARD ? 1 : -1) * shoulderWidth / 2, y - torsoAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_RIGHT_ARM)
          for (let toolIndex in playerInfoTemp.tools) {
            drawBlockMethods.drawTool(canvasInfo, staticData, images, userInfo, x + toolShift.x, y - deltaY + toolShift.y, playerInfoTemp.tools[toolIndex], offsetY, zoomRatio)
          }
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_DOWNWARD ? 1 : -1) * shoulderWidth / 2, y  - torsoAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_LEFT_ARM)
          break
      }

      // Draw bottom feet and legs
      switch (offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
        case constants.OFFSET_Y_UPWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_LEFT_LEG)
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_RIGHT_LEG)
          break
        case constants.OFFSET_Y_LEFTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_RIGHT_LEG)
          break
        case constants.OFFSET_Y_RIGHTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_LEFT_LEG)
          break
      }

      if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
        // Draw bottom breast
        // if (playerInfoTemp.gender == constants.GENDER_FEMALE) {
        //   switch(offsetY) {
        //     case constants.OFFSET_Y_DOWNWARD:
        //     case constants.OFFSET_Y_UPWARD:
        //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, playerInfoTemp,
        //         playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 1, 1, x, y - breastAreaAltitude,
        //         coefs[11] * coefs[12] * breastsImageRatio, coefs[10] * coefs[12] * breastsImageRatio, zoomRatio)
        //       break
        //     case constants.OFFSET_Y_LEFTWARD:
        //     case constants.OFFSET_Y_RIGHTWARD:
        //       break
        //   }
        // }

        // Draw bottom arms and hands
        // switch (offsetY) {
        //   case constants.OFFSET_Y_DOWNWARD:
        //     break
        //   case constants.OFFSET_Y_LEFTWARD:
        //     break
        //   case constants.OFFSET_Y_RIGHTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_arms, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_hands, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        //   case constants.OFFSET_Y_UPWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_arms, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_UPWARD ? 1 : -1) * shoulderWidth / 2, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_hands, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_UPWARD ? 1 : -1) * shoulderWidth / 2, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        // }

        // Draw bottom tools
        // if (offsetY === constants.OFFSET_Y_LEFTWARD || offsetY === constants.OFFSET_Y_UPWARD) {
        //   for (var toolIndex in playerInfoTemp.tools) {
        //     drawBlockMethods.drawTool(canvasInfo, staticData, images, userInfo, x + toolShift.x, y - deltaY + toolShift.y, playerInfoTemp.tools[toolIndex], offsetY, zoomRatio)
        //   }
        // }
      
        // Draw bottom arms and hands
      //   switch (offsetY) {
      //     case constants.OFFSET_Y_DOWNWARD:
      //       break
      //     case constants.OFFSET_Y_LEFTWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_arms, playerInfoTemp,
      //         isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_hands, playerInfoTemp,
      //         isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       break
      //     case constants.OFFSET_Y_RIGHTWARD:
      //       break
      //     case constants.OFFSET_Y_UPWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_arms, playerInfoTemp,
      //         isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_DOWNWARD ? 1 : -1) * shoulderWidth / 2, y  - torsoAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_hands, playerInfoTemp,
      //         isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_DOWNWARD ? 1 : -1) * shoulderWidth / 2, y  - torsoAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       break
      //   }
      // }

      // Draw bottom feet
      // if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_SHALLOW
      //   && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
      //   && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
      //   switch (offsetY) {
      //     case constants.OFFSET_Y_DOWNWARD:
      //     case constants.OFFSET_Y_UPWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_feet, playerInfoTemp,
      //         offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_feet, playerInfoTemp,
      //         offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       break
      //     case constants.OFFSET_Y_LEFTWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_feet, playerInfoTemp,
      //         offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       break
      //     case constants.OFFSET_Y_RIGHTWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_feet, playerInfoTemp,
      //         offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       break
      //   }
      // }

      // Draw bottom legs
      // if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
      //   && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
      //   switch (offsetY) {
      //     case constants.OFFSET_Y_DOWNWARD:
      //     case constants.OFFSET_Y_UPWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_legs, playerInfoTemp,
      //         offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_legs, playerInfoTemp,
      //         offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       break
      //     case constants.OFFSET_Y_LEFTWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_legs, playerInfoTemp,
      //         offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       break
      //     case constants.OFFSET_Y_RIGHTWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_legs, playerInfoTemp,
      //         offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
      //         coefs[10] * coefs[11], coefs[10], zoomRatio)
      //       break
      //   }
      // }

      // Draw bottom hair
      switch (offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
          if (offsetY == constants.OFFSET_Y_DOWNWARD && playerInfoTemp.hairstyle == 13) {
            drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
              0, offsetY, 1, 1, x, y - headAreaAltitude,
              1, 1, zoomRatio, constants.BODY_PART_BACK_HAIR)
          }
          break
        case constants.OFFSET_Y_UPWARD:
          break
        case constants.OFFSET_Y_LEFTWARD:
          break
        case constants.OFFSET_Y_RIGHTWARD:
          break
      }
      // Draw neck
      drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
        0, offsetY, 1, 1, x, y - (headAreaAltitude + torsoAreaAltitude) / 2,
        1, 1, zoomRatio, constants.BODY_PART_NECK)

      if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
        // if (offsetY == constants.OFFSET_Y_DOWNWARD && playerInfoTemp.hairstyle == 13) {
        //   drawBlockMethods.drawHair(canvasInfo, staticData, images, context, headUpLeftPoint, headDownRightPoint, constants.OFFSET_Y_UPWARD, playerInfoTemp, coefs, zoomRatio)
        // }
        // Draw neck
        // drawBlockMethods.drawNeck(canvasInfo, staticData, images, context, headUpLeftPoint, headDownRightPoint, neckWidth, neckHeight, playerInfoTemp)
      }

      // Draw torso
      drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
        0, offsetY, 1, 1, x, y - torsoAreaAltitude,
        coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_TORSO)
      // if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
      //   drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.torsos[playerInfoTemp.gender - 1], playerInfoTemp,
      //     0, offsetY, 1, 1, x, y - torsoAreaAltitude,
      //     coefs[10] * coefs[11], coefs[10], zoomRatio)
      // }

      // Draw accessories
      switch (offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            playerInfoTemp.accessories % 10, Math.floor(playerInfoTemp.accessories / 10), 1, 1, x, y - crotchAreaAltitude,
            coefs[10] * coefs[11] * accessoriesImageRatio, coefs[10] * accessoriesImageRatio, zoomRatio, constants.BODY_PART_ACCESSORIES)
          break
        case constants.OFFSET_Y_UPWARD:
          break
        case constants.OFFSET_Y_LEFTWARD:
          break
        case constants.OFFSET_Y_RIGHTWARD:
          break
      }
      // if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
      //   && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP
      //   && playerInfoTemp.gender == constants.GENDER_FEMALE && offsetY == constants.OFFSET_Y_DOWNWARD) {
      //   drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.accessories, playerInfoTemp,
      //     playerInfoTemp.accessories % 10, Math.floor(playerInfoTemp.accessories / 10), 1, 1, x, y - crotchAreaAltitude,
      //     coefs[10] * coefs[11] * accessoriesImageRatio, coefs[10] * accessoriesImageRatio, zoomRatio)
      // }

      // Draw middle breast
      switch(offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
          break
        case constants.OFFSET_Y_LEFTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 0.5, 1, x - breastsWidth, y - breastAreaAltitude,
            coefs[11] * coefs[12] * breastsImageRatio / 2 * 0.8, coefs[10] * coefs[12] * breastsImageRatio, zoomRatio, constants.BODY_PART_BREAST)
          break
        case constants.OFFSET_Y_RIGHTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            playerInfoTemp.breastType % 10 + 0.5, Math.floor(playerInfoTemp.breastType / 10), 0.5, 1, x + breastsWidth, y - breastAreaAltitude,
            coefs[11] * coefs[12] * breastsImageRatio / 2 * 0.8, coefs[10] * coefs[12] * breastsImageRatio, zoomRatio, constants.BODY_PART_BREAST)
          break
        case constants.OFFSET_Y_UPWARD:
          break
      }
      // if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP && playerInfoTemp.gender == constants.GENDER_FEMALE) {
      //   switch(offsetY) {
      //     case constants.OFFSET_Y_DOWNWARD:
      //       break
      //     case constants.OFFSET_Y_LEFTWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, playerInfoTemp,
      //         playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 0.5, 1, x - breastsWidth, y - breastAreaAltitude,
      //         coefs[11] * coefs[12] * breastsImageRatio / 2 * 0.8, coefs[10] * coefs[12] * breastsImageRatio, zoomRatio)
      //       break
      //     case constants.OFFSET_Y_RIGHTWARD:
      //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, playerInfoTemp,
      //         playerInfoTemp.breastType % 10 + 0.5, Math.floor(playerInfoTemp.breastType / 10), 0.5, 1, x + breastsWidth, y - breastAreaAltitude,
      //         coefs[11] * coefs[12] * breastsImageRatio / 2 * 0.8, coefs[10] * coefs[12] * breastsImageRatio, zoomRatio)
      //       break
      //     case constants.OFFSET_Y_UPWARD:
      //       break
      //   }
      }

      // Draw head
      drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
        0, offsetY, 1, 1, x, y - headAreaAltitude,
        1, 1, zoomRatio, constants.BODY_PART_HEAD)

      if (speed == 0 || playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
        // // Draw head
        // drawBlockMethods.drawHead(canvasInfo, staticData, images, userInfo, context, headUpLeftPoint, headDownRightPoint, offsetY, playerInfoTemp)
        // // Draw eyes
        // drawBlockMethods.drawEyes(canvasInfo, staticData, images, userInfo, context, headUpLeftPoint, headDownRightPoint, offsetY, playerInfoTemp, zoomRatio)
        // // Draw nose, mouth
        // var noseRatio = 0.25
        // var mouthRatio = 0.25
        // switch(offsetY) {
        //   case constants.OFFSET_Y_DOWNWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.nose, playerInfoTemp,
        //       playerInfoTemp.nose % 10, Math.floor(playerInfoTemp.nose / 10), 1, 1, x, y - noseAltitude,
        //       noseRatio, noseRatio, zoomRatio)
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.mouth, playerInfoTemp,
        //       playerInfoTemp.mouth % 10, Math.floor(playerInfoTemp.mouth / 10), 1, 1, x, y - mouthAltitude,
        //       mouthRatio, mouthRatio, zoomRatio)
        //     break
        //   case constants.OFFSET_Y_LEFTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.mouth, playerInfoTemp,
        //       playerInfoTemp.mouth % 10 + 0.5, Math.floor(playerInfoTemp.mouth / 10), 0.5, 1, x + 0.08 * (0.4 - coefs[3]), y - mouthAltitude,
        //       mouthRatio * 0.5, mouthRatio, zoomRatio)
        //     break
        //   case constants.OFFSET_Y_RIGHTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.mouth, playerInfoTemp,
        //       playerInfoTemp.mouth % 10, Math.floor(playerInfoTemp.mouth / 10), 0.5, 1, x - 0.08 * (0.4 - coefs[3]), y - mouthAltitude,
        //       mouthRatio * 0.5, mouthRatio, zoomRatio)
        //     break
        //   case constants.OFFSET_Y_UPWARD:
        //     break
        // }
        // // Draw top hair
        // drawBlockMethods.drawHair(canvasInfo, staticData, images, context, headUpLeftPoint, headDownRightPoint, offsetY, playerInfoTemp, coefs, zoomRatio)
        // // Draw eyebrows, moustache, beard
        // drawBlockMethods.drawHeadHair(canvasInfo, staticData, images, context, headUpLeftPoint, headDownRightPoint, offsetY, playerInfoTemp, coefs, zoomRatio)
      }

      var positionX = x - 0.5
      var positionY = y - 0.92 + 0.6 * coefs[10] / 2 - crotchAreaAltitude

      // Draw top feet
      if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_SHALLOW
        && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
        && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
        // switch (offsetY) {
        //   case constants.OFFSET_Y_DOWNWARD:
        //   case constants.OFFSET_Y_UPWARD:
        //     break
        //   case constants.OFFSET_Y_LEFTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_feet, playerInfoTemp,
        //       offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        //   case constants.OFFSET_Y_RIGHTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_feet, playerInfoTemp,
        //       offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        // }
      }

      // Draw top legs
      if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
        && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
        // switch (offsetY) {
        //   case constants.OFFSET_Y_DOWNWARD:
        //   case constants.OFFSET_Y_UPWARD:
        //     break
        //   case constants.OFFSET_Y_LEFTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_legs, playerInfoTemp,
        //       offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        //   case constants.OFFSET_Y_RIGHTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_legs, playerInfoTemp,
        //       offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        // }
      }

      if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
        // Draw top arms and hands
        // switch (offsetY) {
        //   case constants.OFFSET_Y_DOWNWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_arms, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_DOWNWARD ? 1 : -1) * shoulderWidth / 2, y  - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_hands, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_DOWNWARD ? 1 : -1) * shoulderWidth / 2, y  - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        //   case constants.OFFSET_Y_LEFTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_arms, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.left_hands, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        //   case constants.OFFSET_Y_RIGHTWARD:
        //     break
        //   case constants.OFFSET_Y_UPWARD:
        //     break
        // }

        // Draw top tools
        // if (offsetY !== constants.OFFSET_Y_LEFTWARD && offsetY !== constants.OFFSET_Y_UPWARD) {
        //   for (let toolIndex in playerInfoTemp.tools) {
        //     drawBlockMethods.drawTool(canvasInfo, staticData, images, userInfo, positionX + toolShift.x, positionY + toolShift.y, playerInfoTemp.tools[toolIndex], offsetY, zoomRatio)
        //   }
        // }

        // Draw top arms and hands
        // switch (offsetY) {
        //   case constants.OFFSET_Y_DOWNWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_arms, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_UPWARD ? 1 : -1) * shoulderWidth / 2, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_hands, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_UPWARD ? 1 : -1) * shoulderWidth / 2, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        //   case constants.OFFSET_Y_LEFTWARD:
        //     break
        //   case constants.OFFSET_Y_RIGHTWARD:
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_arms, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.right_hands, playerInfoTemp,
        //       isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
        //       coefs[10] * coefs[11], coefs[10], zoomRatio)
        //     break
        //   case constants.OFFSET_Y_UPWARD:
        //     break
        // }

        // Draw top breast
        // if (playerInfoTemp.gender == constants.GENDER_FEMALE) {
        //   switch(offsetY) {
        //     case constants.OFFSET_Y_DOWNWARD:
        //       drawBlockMethods.drawBodyPart(canvasInfo, staticData, images, userInfo, images.bodyPartsImage.breasts, playerInfoTemp,
        //         playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 1, 1, x, y - breastAreaAltitude,
        //         coefs[11] * coefs[12] * breastsImageRatio, coefs[10] * coefs[12] * breastsImageRatio, zoomRatio)
        //       break
        //     case constants.OFFSET_Y_LEFTWARD:
        //     case constants.OFFSET_Y_RIGHTWARD:
        //     case constants.OFFSET_Y_UPWARD:
        //       break
        //   }
        // }
      }


      // Draw top feet and legs
      switch (offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
          break
        case constants.OFFSET_Y_LEFTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_LEFT_LEG)
          break
        case constants.OFFSET_Y_RIGHTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            offsetX, offsetY, 1, 1, x, y - crotchAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_RIGHT_LEG)
          break
        case constants.OFFSET_Y_UPWARD:
          break
      }

      // Draw top arms and hands
      switch (offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_DOWNWARD ? 1 : -1) * shoulderWidth / 2, y  - torsoAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_LEFT_ARM)
          for (let toolIndex in playerInfoTemp.tools) {
            drawBlockMethods.drawTool(canvasInfo, staticData, images, userInfo, positionX + toolShift.x, positionY + toolShift.y, playerInfoTemp.tools[toolIndex], offsetY, zoomRatio)
          }
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x + (offsetY == constants.OFFSET_Y_UPWARD ? 1 : -1) * shoulderWidth / 2, y - torsoAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_RIGHT_ARM)
          break
        case constants.OFFSET_Y_LEFTWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_LEFT_ARM)
          break
        case constants.OFFSET_Y_RIGHTWARD:
          for (let toolIndex in playerInfoTemp.tools) {
            drawBlockMethods.drawTool(canvasInfo, staticData, images, userInfo, positionX + toolShift.x, positionY + toolShift.y, playerInfoTemp.tools[toolIndex], offsetY, zoomRatio)
          }
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            isHoldingTool ? constants.OFFSET_X_MIDDLE : offsetX, offsetY, 1, 1, x, y - torsoAreaAltitude,
            coefs[10] * coefs[11], coefs[10], zoomRatio, constants.BODY_PART_RIGHT_ARM)
          break
        case constants.OFFSET_Y_UPWARD:
          break
      }

      // Draw top breast
      switch(offsetY) {
        case constants.OFFSET_Y_DOWNWARD:
          drawBlockMethods.drawBodyParts(canvasInfo, staticData, images, userInfo, playerInfoTemp,
            playerInfoTemp.breastType % 10, Math.floor(playerInfoTemp.breastType / 10), 1, 1, x, y - breastAreaAltitude,
            coefs[11] * coefs[12] * breastsImageRatio, coefs[10] * coefs[12] * breastsImageRatio, zoomRatio, constants.BODY_PART_BREAST)
          break
        case constants.OFFSET_Y_LEFTWARD:
        case constants.OFFSET_Y_RIGHTWARD:
        case constants.OFFSET_Y_UPWARD:
          break
      }







      if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (var outfitIndex in playerInfoTemp.outfits) {
          if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
            && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
            // Draw pants
            this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 1, offsetX, offsetY, positionX, positionY, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize * zoomRatio)
          }
          if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_SHALLOW
            && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_MEDIUM
            && playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
            // Draw shoes
            this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 2, offsetX, offsetY, positionX, positionY, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize * zoomRatio)
          }
          
          if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
            // Draw clothes
            this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 0, upOffsetX, offsetY, positionX, positionY, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize * zoomRatio)
          }
        }
      }
      
      if (playerInfoTemp.floorCode != constants.BLOCK_CODE_WATER_DEEP) {
        // Draw bottom sleeve
        if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          for (outfitIndex in playerInfoTemp.outfits) {
            this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 4, upOffsetX, offsetY, positionX, positionY, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize * zoomRatio)
          }
        }
        // Draw top sleeve
        if (utilMethods.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
          for (outfitIndex in playerInfoTemp.outfits) {
            this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 3, upOffsetX, offsetY, positionX, positionY, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize * zoomRatio)
          }
        }
      }
    } else if (playerInfoTemp.creatureType == constants.CREATURE_TYPE_ANIMAL) {
      // Display animals
      if (playerInfoTemp.skinColor !== 0) {
        context.drawImage(images.animalsImage[playerInfoTemp.skinColor], offsetX * canvasInfo.imageBlockSize, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        (x - 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, (y - 1) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize, canvasInfo.blockSize)
      }
    } else {
      // Display other creatures
      // TBD
    }
    if (playerInfoTemp.playerType == constants.PLAYER_TYPE_HUMAN) {
      // Show name
      this.drawAvatar(canvasInfo, staticData, images, userInfo, x * canvasInfo.blockSize * zoomRatio - 0.4 * constants.DEFAULT_BLOCK_SIZE + canvasInfo.deltaWidth, 
      (y - constants.STATUS_DISPLAY_DISTANCE - deltaY) * canvasInfo.blockSize * zoomRatio - 0.15 * constants.DEFAULT_BLOCK_SIZE + canvasInfo.deltaHeight,
      constants.DEFAULT_BLOCK_SIZE * 0.2, avatarIndex, playerInfoTemp.nameColor)
      // if (userCode != playerInfoTemp.id) {
      //   context.fillStyle = 'yellow'
      //   if (utilMethods.isDef(relations) && utilMethods.isDef(relations[playerInfoTemp.id])) {
      //     if (relations[playerInfoTemp.id] < 0) {
      //       context.fillStyle = 'red'
      //     } else if (relations[playerInfoTemp.id] > 0) {
      //       context.fillStyle = 'green'
      //     }
      //   }
      //   context.save()
      //   context.beginPath()
      //   context.arc((x + 0.5) * canvasInfo.blockSize * zoomRatio - 0.25 * constants.DEFAULT_BLOCK_SIZE + deltaWidth, 
      //   (y - constants.STATUS_DISPLAY_DISTANCE) * canvasInfo.blockSize * zoomRatio + 0.15 * constants.DEFAULT_BLOCK_SIZE + deltaHeight, 
      //   0.1 * constants.DEFAULT_BLOCK_SIZE, 0, 
      //   2 * Math.PI)
      //   context.fill()
      //   context.restore()
      // }
      if (utilMethods.isDef(playerInfoTemp.nickname)) {
        this.printText(context, playerInfoTemp.nickname, x * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaWidth,
          (y - constants.STATUS_DISPLAY_DISTANCE - deltaY) * canvasInfo.blockSize * zoomRatio + canvasInfo.deltaHeight,
          constants.DEFAULT_BLOCK_SIZE * 0.5,
          'center')
      }
    }
  },
  drawAvatar (canvasInfo, staticData, images, userInfo, x, y, avatarSize, avatarIndex, nameColor) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    context.save()
    context.beginPath()
    context.strokeStyle = nameColor
    context.lineWidth = avatarSize / 20
    context.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
    context.stroke()
    context.clip()
    context.drawImage(images.avatarsImage, avatarIndex % 10 * canvasInfo.imageBlockSize / 2, Math.floor(avatarIndex / 10) * canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, x, y, avatarSize, avatarSize)
    context.restore()
  },
  drawOutfits (context, tempCanvas, outfitsImage, outfitNo, partIndex, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize) {
    var rgbArray
    switch (outfitNo) {
      case constants.ITEM_NO_OUTFIT_ZGC_1:
      case constants.ITEM_NO_OUTFIT_ZGC_2:
        if (outfitNo == constants.ITEM_NO_OUTFIT_ZGC_1) {
          rgbArray = [0, 0, 255]
        } else if (outfitNo == constants.ITEM_NO_OUTFIT_ZGC_2) {
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
      case constants.ITEM_NO_OUTFIT_SOLDIER:
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
      case constants.ITEM_NO_OUTFIT_SUIT_1:
      case constants.ITEM_NO_OUTFIT_SUIT_2:
        switch (partIndex) {
          case 0:
            this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][0], [7, 7, 7], offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            if (outfitNo == constants.ITEM_NO_OUTFIT_SUIT_1) {
              this.drawOutfit(context, tempCanvas, outfitsImage[partIndex][3], undefined, offsetX, offsetY, x, y, deltaWidth, deltaHeight, imageBlockSize, blockSize)
            } else if (outfitNo == constants.ITEM_NO_OUTFIT_SUIT_2) {
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
      case constants.ITEM_NO_OUTFIT_UNDERWEAR:
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
    if (utilMethods.isDef(rgbArray)) {
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
  drawMinimap (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    if (!utilMethods.isDef(userInfo.miniMap)) {
      return
    }
    context.save()
    if (utilMethods.isDef(userInfo.miniMap.background)) {
      for (var i = 0; i < userInfo.miniMap.background.length; i++) {
        var color = userInfo.miniMap.background[i]
        context.fillStyle = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', 0.25)'
        context.beginPath()
        context.arc(canvasInfo.minimapPosition.x + Math.floor(i / Math.sqrt(userInfo.miniMap.background.length)), canvasInfo.minimapPosition.y + i % Math.sqrt(userInfo.miniMap.background.length), 1, 0, 2 * Math.PI)
        context.closePath()
        context.fill()
      }
    }
    context.strokeStyle = 'rgba(0, 0, 0, 0.01)'
    for (i = 0; i < constants.MINI_MAP_DEFAULT_SIZE; i += constants.MINI_MAP_DEFAULT_SIZE / 10) {
      context.beginPath()
      context.moveTo(canvasInfo.minimapPosition.x + i, canvasInfo.minimapPosition.y)
      context.lineTo(canvasInfo.minimapPosition.x + i, canvasInfo.minimapPosition.y + constants.MINI_MAP_DEFAULT_SIZE)
      context.closePath()
      context.stroke()
      context.beginPath()
      context.moveTo(canvasInfo.minimapPosition.x, canvasInfo.minimapPosition.y + i)
      context.lineTo(canvasInfo.minimapPosition.x + constants.MINI_MAP_DEFAULT_SIZE, canvasInfo.minimapPosition.y + i)
      context.closePath()
      context.stroke()
    }
    if (utilMethods.isDef(userInfo.miniMap.sceneCoordinate)) {
      var date = new Date()
      var timestamp = date.valueOf()
      var deltaLength = Math.abs(timestamp % 1000 - 500) / 20000 * constants.MINI_MAP_DEFAULT_SIZE
      context.fillStyle = 'rgba(255, 0, 0, 0.75)'
      context.fillRect(canvasInfo.minimapPosition.x + userInfo.miniMap.sceneCoordinate.x - deltaLength, canvasInfo.minimapPosition.y + userInfo.miniMap.sceneCoordinate.y - deltaLength, 2 * deltaLength, 2 * deltaLength)
      context.restore()
    }
  },
  printInitialization (canvasInfo, staticData, images, userInfo) { 
    var timestamp = new Date().valueOf()
    // Left character
    var playerInfoTemp
    if (utilMethods.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING) {
      playerInfoTemp = Object.assign({}, userInfo.playerInfo)
      playerInfoTemp.speed = {
        x: Math.sin(timestamp % 4000 * Math.PI * 2 / 4000),
        y: Math.cos(timestamp % 4000 * Math.PI * 2 / 4000)
      }
      playerInfoTemp.faceDirection = utilMethods.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
      playerInfoTemp.outfits = [constants.ITEM_NO_OUTFIT_ZGC_1]
      this.drawCharacter(canvasInfo, staticData, images, userInfo, playerInfoTemp, (constants.MENU_LEFT_EDGE + 110 - canvasInfo.deltaWidth) / constants.DEFAULT_BLOCK_SIZE + 1, (constants.MENU_TOP_EDGE + 70 - canvasInfo.deltaHeight) / constants.DEFAULT_BLOCK_SIZE + 1, constants.DEFAULT_BLOCK_SIZE / canvasInfo.blockSize)
      playerInfoTemp.speed = { x: 0, y: 0 }
      playerInfoTemp.faceDirection = 270
      this.drawCharacter(canvasInfo, staticData, images, userInfo, playerInfoTemp, (constants.MENU_LEFT_EDGE + 10 - canvasInfo.deltaWidth) / constants.DEFAULT_BLOCK_SIZE + 1, (constants.MENU_TOP_EDGE + 70 - canvasInfo.deltaHeight) / constants.DEFAULT_BLOCK_SIZE + 1, constants.DEFAULT_BLOCK_SIZE / canvasInfo.blockSize)
    }
    // Right character
    playerInfoTemp = {
      id: userInfo.userCode,
      firstName: document.getElementById('initialization-firstName').value,
      lastName: document.getElementById('initialization-lastName').value,
      nickname: document.getElementById('initialization-nickname').value,
      nameColor: document.getElementById('initialization-nameColor').value,
      creatureType: document.getElementById('initialization-creature').value,
      gender: document.getElementById('initialization-gender').value,
      skinColor: document.getElementById('initialization-skinColor').value,
      breastType: document.getElementById('initialization-breastType').value,
      accessories: document.getElementById('initialization-accessories').value,
      hairstyle: document.getElementById('initialization-hairstyle').value,
      hairColor: document.getElementById('initialization-hairColor').value,
      eyes: document.getElementById('initialization-eyes').value,
      nose: document.getElementById('initialization-nose').value,
      mouth: document.getElementById('initialization-mouth').value,
      tongue: document.getElementById('initialization-tongue').value,
      eyebrows: document.getElementById('initialization-eyebrows').value,
      moustache: document.getElementById('initialization-moustache').value,
      beard: document.getElementById('initialization-beard').value,
      avatar: document.getElementById('initialization-avatar').value,
      speed: {
        x: Math.sin(timestamp % 4000 * Math.PI * 2 / 4000),
        y: Math.cos(timestamp % 4000 * Math.PI * 2 / 4000)
      },
      tools: userInfo.playerInfo.tools,
      outfits: userInfo.playerInfo.outfits,
      bossId: '',
    }
    playerInfoTemp.faceDirection = utilMethods.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
    playerInfoTemp.faceCoefs = []
    playerInfoTemp.playerType = constants.PLAYER_TYPE_HUMAN
    for (let i = 0; i < constants.FACE_COEFS_LENGTH; i++) {
      playerInfoTemp.faceCoefs[i] = document.getElementById('initialization-coefs-' + i).value
    }
    this.drawCharacter(canvasInfo, staticData, images, userInfo, playerInfoTemp, (constants.MENU_LEFT_EDGE + 320 - canvasInfo.deltaWidth) / constants.DEFAULT_BLOCK_SIZE + 1, (constants.MENU_TOP_EDGE + 70 - canvasInfo.deltaHeight) / constants.DEFAULT_BLOCK_SIZE + 1, constants.DEFAULT_BLOCK_SIZE / canvasInfo.blockSize)
    playerInfoTemp.speed = { x:0, y:0 }
    playerInfoTemp.faceDirection = 270
    this.drawCharacter(canvasInfo, staticData, images, userInfo, playerInfoTemp, (constants.MENU_LEFT_EDGE + 220 - canvasInfo.deltaWidth) / constants.DEFAULT_BLOCK_SIZE + 1, (constants.MENU_TOP_EDGE + 70 - canvasInfo.deltaHeight) / constants.DEFAULT_BLOCK_SIZE + 1, constants.DEFAULT_BLOCK_SIZE / canvasInfo.blockSize)
  },
  printMenu (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    context.save()
    context.fillStyle = 'rgba(191, 191, 191, 0.75)'
    context.fillRect(constants.MENU_LEFT_EDGE, constants.MENU_TOP_EDGE, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE, canvasInfo.canvas.height - constants.MENU_TOP_EDGE - constants.MENU_BOTTOM_EDGE)
    context.restore()
    if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_SET || userInfo.playerInfo.playerStatus !== constants.PLAYER_STATUS_INIT) {
      context.drawImage(images.smallButtons, 1 * constants.DEFAULT_SMALL_BUTTON_SIZE, 0 * constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.canvas.width - constants.MENU_RIGHT_EDGE - constants.DEFAULT_SMALL_BUTTON_SIZE, constants.MENU_TOP_EDGE, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE)
    }
  },
  printExchange (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    this.printText(context, Number(userInfo.bagInfo.capacity) + '/' + Number(userInfo.bagInfo.capacityMax) + '(kg)', constants.MENU_LEFT_EDGE + 10, constants.MENU_TOP_EDGE + 20, 100, 'left')
    this.printText(context, '$' + userInfo.playerInfo.money, constants.MENU_LEFT_EDGE + 110, constants.MENU_TOP_EDGE + 20, 50, 'left')
    this.printText(context, document.getElementById('items-range').value, constants.MENU_LEFT_EDGE + 130, constants.MENU_TOP_EDGE + 125, 50, 'left')
    this.printText(context, document.getElementById('items-exchange-range').value, constants.MENU_LEFT_EDGE + 330, constants.MENU_TOP_EDGE + 125, 50, 'left')
  },
  printStatus (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    var positionY = constants.MENU_TOP_EDGE + 20
    this.printText(context, userInfo.playerInfo.nickname + ' (' + userInfo.playerInfo.lastName + ', ' + userInfo.playerInfo.firstName + ')', constants.MENU_LEFT_EDGE + 10, positionY, constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
    positionY += 20
    this.printText(context, '当前位置: ' + userInfo.regionInfo.name + '-' + userInfo.sceneInfo.name, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, 'Lv.' + userInfo.playerInfo.level + ' 经验值 ' + userInfo.playerInfo.exp + '/' + userInfo.playerInfo.expMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '生命值 ' + userInfo.playerInfo.hp + '/' + userInfo.playerInfo.hpMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '活力值 ' + userInfo.playerInfo.vp + '/' + userInfo.playerInfo.vpMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '饥饿值 ' + userInfo.playerInfo.hunger + '/' + userInfo.playerInfo.hungerMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '口渴值 ' + userInfo.playerInfo.thirst + '/' + userInfo.playerInfo.thirstMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '$' + userInfo.playerInfo.money + ' 负重 ' + Number(userInfo.bagInfo.capacity) + '/' + Number(userInfo.bagInfo.capacityMax) + '(kg)', constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    var buffStr = '特殊状态 '
    var hasBuff = false
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_DEAD] != 0) {
      hasBuff = true
      buffStr += '死亡 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_STUNNED] != 0) {
      hasBuff = true
      buffStr += '昏迷 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_BLEEDING] != 0) {
      hasBuff = true
      buffStr += '流血 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_SICK] != 0) {
      hasBuff = true
      buffStr += '疾病 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_FRACTURED] != 0) {
      hasBuff = true
      buffStr += '骨折 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_HUNGRY] != 0) {
      hasBuff = true
      buffStr += '饥饿 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_THIRSTY] != 0) {
      hasBuff = true
      buffStr += '口渴 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_FATIGUED] != 0) {
      hasBuff = true
      buffStr += '疲惫 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_BLIND] != 0) {
      hasBuff = true
      buffStr += '失明 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_INVINCIBLE] != 0) {
      hasBuff = true
      buffStr += '无敌 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_ONE_HIT] != 0) {
      hasBuff = true
      buffStr += '一击 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_REALISTIC] != 0) {
      hasBuff = true
      buffStr += '写实 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_TROPHY] != 0) {
      hasBuff = true
      buffStr += '掉落 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_BLOCKED] != 0) {
      hasBuff = true
      buffStr += '格挡 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_HAPPY] != 0) {
      hasBuff = true
      buffStr += '愉悦 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_SAD] != 0) {
      hasBuff = true
      buffStr += '沮丧 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_RECOVERING] != 0) {
      hasBuff = true
      buffStr += '康复 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_OVERWEIGHTED] != 0) {
      hasBuff = true
      buffStr += '超重 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_KNOCKED] != 0) {
      hasBuff = true
      buffStr += '濒死 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_REVIVED] != 0) {
      hasBuff = true
      buffStr += '急救 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_DIVING] != 0) {
      hasBuff = true
      buffStr += '潜水 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_DROWNING] != 0) {
      hasBuff = true
      buffStr += '溺水 '
    }
    if (!hasBuff) {
      buffStr += '无'
    }
    this.printText(context, buffStr, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
  },
  printItems (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    this.printText(context, Number(userInfo.bagInfo.capacity) + '/' + Number(userInfo.bagInfo.capacityMax) + '(kg)', constants.MENU_LEFT_EDGE + 10, constants.MENU_TOP_EDGE + 20, 100, 'left')
    this.printText(context, '$' + userInfo.playerInfo.money, constants.MENU_LEFT_EDGE + 110, constants.MENU_TOP_EDGE + 20, 50, 'left')
    this.printText(context, document.getElementById('items-range').value, constants.MENU_LEFT_EDGE + 130, constants.MENU_TOP_EDGE + 125, 50, 'left')
  },
  printMembers (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    var colleagueSet = new Set()
    for (var playerInfoIndex in userInfo.playerInfos) {
      if (userInfo.playerInfos[playerInfoIndex].topBossId == userInfo.playerInfo.topBossId) {
        colleagueSet.add(userInfo.playerInfos[playerInfoIndex].id)
      }
    }
    var tree = []
    var member = userInfo.playerInfo
    while (utilMethods.isDef(member)) {
      tree.push(member.nickname + ' (' + member.lastName + ', ' + member.firstName + ') Lv.' + member.level)
      colleagueSet.delete(member.id)
      if (utilMethods.isDef(member.bossId) && member.bossId != member.id) {
        member = userInfo.playerInfos[member.bossId]
      } else {
        member = undefined
      }
    }
    var positionY = constants.MENU_TOP_EDGE + 20
    if (tree.length == 1) {
      this.printText(context, '[玩家]' + tree[0], constants.MENU_LEFT_EDGE + 10, positionY, constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
      positionY += 20
    } else {
      for (var i = tree.length - 1; i >= 0; i--) {
        if (i == 0) {
          positionY += 20
          this.printText(context, '[玩家]' + tree[i], constants.MENU_LEFT_EDGE + 10, positionY, constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
        } else {
          this.printText(context, '[' + i + '级领导]' + tree[i], constants.MENU_LEFT_EDGE + 10, positionY, constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
        }
        positionY += 20
      }
    }
    positionY += 20
    for (var colleagueId of colleagueSet) {
      this.printText(context, '[下属]' + userInfo.playerInfos[colleagueId].nickname + ' (' + userInfo.playerInfos[colleagueId].lastName + ', ' + userInfo.playerInfos[colleagueId].firstName + ') Lv.' + userInfo.playerInfos[colleagueId].level,
      constants.MENU_LEFT_EDGE + 10, positionY, constants.DEFAULT_BUTTON_SIZE * 5, userInfo.playerInfo.nameColor, 'left')
      positionY += 20
    }
  },
  printSettings (canvasInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    this.printText(context, '缩放: ' + Math.round(canvasInfo.blockSize / constants.DEFAULT_BLOCK_SIZE * 100) + '%', constants.MENU_LEFT_EDGE + 140, constants.MENU_TOP_EDGE + 75, 100, 'left')
    this.printText(context, '音乐', constants.MENU_LEFT_EDGE + 40, constants.MENU_TOP_EDGE + 125, 50, 'left')
    this.printText(context, '音效', constants.MENU_LEFT_EDGE + 140, constants.MENU_TOP_EDGE + 125, 50, 'left')
  },
  printChat (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    if (utilMethods.isDef(userInfo.chatInfo.chatMessages)) {
      for (let i = 0; i < userInfo.chatInfo.chatMessages.length; i++) {
        this.printText(context, userInfo.chatInfo.chatMessages[userInfo.chatInfo.chatMessages.length - 1 - i], canvasInfo.chatPosition.x, canvasInfo.chatPosition.y - i * constants.MSG_LINE_HEIGHT, Math.min(canvasInfo.canvas.width, constants.MAX_MSG_LINE_HEIGHT), 'left')
      }
    }
  },
  printSight (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    var ratio, x, y
    if (userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOOT_HIT
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOOT_ARROW
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOOT_GUN
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOOT_SHOTGUN
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOOT_MAGNUM
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOOT_ROCKET
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOOT_FIRE
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOOT_WATER) {
      ratio = 1 - userInfo.playerInfo.precision / userInfo.playerInfo.precisionMax
      x = (userInfo.playerInfo.coordinate.x + 2 * Math.cos(userInfo.playerInfo.faceDirection / 180 * Math.PI)) * canvasInfo.blockSize + canvasInfo.deltaWidth
      y = (userInfo.playerInfo.coordinate.y - 2 * Math.sin(userInfo.playerInfo.faceDirection / 180 * Math.PI)) * canvasInfo.blockSize + canvasInfo.deltaHeight - 0.5 * canvasInfo.blockSize
    } else if (userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_BUILD
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_FISH
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_SHOVEL
        || userInfo.playerInfo.skills[0].skillCode == constants.SKILL_CODE_PLOW) {
      ratio = 2
      x = Math.floor(userInfo.playerInfo.coordinate.x + 0.5 + constants.SKILL_RANGE_BUILD * Math.cos(userInfo.playerInfo.faceDirection / 180 * Math.PI)) * canvasInfo.blockSize + canvasInfo.deltaWidth
      y = Math.floor(userInfo.playerInfo.coordinate.y + 0.5 - constants.SKILL_RANGE_BUILD * Math.sin(userInfo.playerInfo.faceDirection / 180 * Math.PI)) * canvasInfo.blockSize + canvasInfo.deltaHeight
    }
    var sideLength = 20
    context.save()
    context.lineWidth = 2
    context.strokeStyle = 'rgba(255, 255, 255, 0.8)'
    context.beginPath()
    context.moveTo(x + sideLength * (0.5 + ratio), y + sideLength * (0.5 + ratio))
    context.lineTo(x + sideLength * (1 + ratio), y + sideLength * (0.5 + ratio))
    context.moveTo(x + sideLength * (0.5 + ratio), y + sideLength * (0.5 + ratio))
    context.lineTo(x + sideLength * (0.5 + ratio), y + sideLength * (1 + ratio))
    context.moveTo(x - sideLength * (0.5 + ratio), y + sideLength * (0.5 + ratio))
    context.lineTo(x - sideLength * (1 + ratio), y + sideLength * (0.5 + ratio))
    context.moveTo(x - sideLength * (0.5 + ratio), y + sideLength * (0.5 + ratio))
    context.lineTo(x - sideLength * (0.5 + ratio), y + sideLength * (1 + ratio))
    context.moveTo(x + sideLength * (0.5 + ratio), y - sideLength * (0.5 + ratio))
    context.lineTo(x + sideLength * (1 + ratio), y - sideLength * (0.5 + ratio))
    context.moveTo(x + sideLength * (0.5 + ratio), y - sideLength * (0.5 + ratio))
    context.lineTo(x + sideLength * (0.5 + ratio), y - sideLength * (1 + ratio))
    context.moveTo(x - sideLength * (0.5 + ratio), y - sideLength * (0.5 + ratio))
    context.lineTo(x - sideLength * (1 + ratio), y - sideLength * (0.5 + ratio))
    context.moveTo(x - sideLength * (0.5 + ratio), y - sideLength * (0.5 + ratio))
    context.lineTo(x - sideLength * (0.5 + ratio), y - sideLength * (1 + ratio))
    context.closePath()
    context.stroke()
    context.restore()
  },
  updateInteractions (userInfo, block) {
    var interactionInfoTemp = {
      type: block.type,
      id: block.id,
      code: block.code,
      list: []
    }
    if (block.type == constants.BLOCK_TYPE_PLAYER) {
      if (block.id != userInfo.userCode && (!utilMethods.isDef(block.buff) || block.buff[constants.BUFF_CODE_DEAD] === 0)) {
        if (userInfo.playerInfos[block.id].playerType == constants.PLAYER_TYPE_HUMAN) {
          interactionInfoTemp.list.push(constants.INTERACTION_TALK)
        }
        if (userInfo.playerInfos[block.id].creatureType == constants.CREATURE_TYPE_HUMAN) {
          interactionInfoTemp.list.push(constants.INTERACTION_SUCCUMB)
          interactionInfoTemp.list.push(constants.INTERACTION_EXPEL)
        }
      }
    } else if (block.type == constants.BLOCK_TYPE_BED) {
      interactionInfoTemp.list = [constants.INTERACTION_SLEEP, constants.INTERACTION_PACK]
    } else if (block.type == constants.BLOCK_TYPE_TOILET) {
      interactionInfoTemp.list = [constants.INTERACTION_USE, constants.INTERACTION_DRINK, constants.INTERACTION_PACK]
    } else if (block.type == constants.BLOCK_TYPE_DRESSER) {
      interactionInfoTemp.list = [constants.INTERACTION_SET, constants.INTERACTION_PACK]
    } else if (block.type == constants.BLOCK_TYPE_GAME) {
      interactionInfoTemp.list = [constants.INTERACTION_USE]
    } else if (block.type == constants.BLOCK_TYPE_STORAGE) {
      interactionInfoTemp.list = [constants.INTERACTION_EXCHANGE, constants.INTERACTION_PACK]
    } else if (block.type == constants.BLOCK_TYPE_COOKER) {
      interactionInfoTemp.list = [constants.INTERACTION_USE, constants.INTERACTION_PACK]
    } else if (block.type == constants.BLOCK_TYPE_SINK) {
      interactionInfoTemp.list = [constants.INTERACTION_USE, constants.INTERACTION_DRINK, constants.INTERACTION_PACK]
    } else if (block.type == constants.BLOCK_TYPE_CONTAINER) {
      interactionInfoTemp.list = [constants.INTERACTION_EXCHANGE, constants.INTERACTION_PACK]
    } else if (block.type == constants.BLOCK_TYPE_FARM) {
      if (block.farmInfo.cropStatus == constants.CROP_STATUS_NONE || block.farmInfo.cropStatus == constants.CROP_STATUS_GATHERED) {
        interactionInfoTemp.list.push(constants.INTERACTION_PLANT)
      }
      if (block.farmInfo.cropStatus == constants.CROP_STATUS_MATURE) {
        interactionInfoTemp.list.push(constants.INTERACTION_GATHER)
      }
    } else if (block.type == constants.BLOCK_TYPE_WORKSHOP
        || block.type == constants.BLOCK_TYPE_WORKSHOP_TOOL
        || block.type == constants.BLOCK_TYPE_WORKSHOP_AMMO
        || block.type == constants.BLOCK_TYPE_WORKSHOP_OUTFIT
        || block.type == constants.BLOCK_TYPE_WORKSHOP_CHEM
        || block.type == constants.BLOCK_TYPE_WORKSHOP_RECYCLE) {
      interactionInfoTemp.list = [constants.INTERACTION_USE, constants.INTERACTION_PACK]
    } else {
      // Illegal interaction type
      return false
    }
    if (JSON.stringify(userInfo.interactionInfo) == JSON.stringify(interactionInfoTemp)) {
      // Without this, interaction list will keep updating and cannot select 25/01/13
      return false
    }
    userInfo.interactionInfo = interactionInfoTemp
    this.fillInteractionList(userInfo)
    userInfo.webSocketMessageDetail.functions.updateInteractionInfo = userInfo.interactionInfo
    return true
  },
  fillInteractionList (userInfo) {
    document.getElementById('interactions-list').length = 0
    if (!utilMethods.isDef(userInfo.interactionInfo) || !utilMethods.isDef(userInfo.interactionInfo.list)) {
      return
    }
    for (var i = 0; i < userInfo.interactionInfo.list.length; i++) {
      var interactinonName
      switch (Number(userInfo.interactionInfo.list[i])) {
        case constants.INTERACTION_USE:
          interactinonName = '[使用]'
          break
        case constants.INTERACTION_EXCHANGE:
          interactinonName = '[交换]'
          break
        case constants.INTERACTION_SLEEP:
          interactinonName = '[睡眠]'
          break
        case constants.INTERACTION_DRINK:
          interactinonName = '[饮水]'
          break
        case constants.INTERACTION_DECOMPOSE:
          interactinonName = '[分解]'
          break
        case constants.INTERACTION_TALK:
          interactinonName = '[交谈]'
          break
        case constants.INTERACTION_ATTACK:
          interactinonName = '[攻击]'
          break
        case constants.INTERACTION_FLIRT:
          interactinonName = '[示好]'
          break
        case constants.INTERACTION_SET:
          interactinonName = '[设置]'
          break
        case constants.INTERACTION_SUCCUMB:
          interactinonName = '[屈从]'
          break
        case constants.INTERACTION_EXPEL:
          interactinonName = '[驱逐]'
          break
        case constants.INTERACTION_PACK:
          interactinonName = '[打包]'
          break
        case constants.INTERACTION_PLANT:
          interactinonName = '[种植]'
          break
        case constants.INTERACTION_GATHER:
          interactinonName = '[采集]'
          break
      }
      document.getElementById('interactions-list').options.add(new Option(interactinonName, Number(userInfo.interactionInfo.list[i])));
    }
  },
  quitInteraction (canvasInfo, staticData, images, userInfo) {
    userInfo.interactionInfo = undefined
    userInfo.webSocketMessageDetail.functions.updateInteractionInfo = undefined
    // This is used for manually quiting interactions with special usage events 24/02/14
    canvasInfo.canvasMoveUse = constants.MOVEMENT_STATE_IDLE
  },
  // printTerminal () {
  //   var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
  //   if (!utilMethods.isDef(terminalOutputs)) {
  //     return
  //   }
  //   if (terminalOutputs.terminalType == constants.TERMINAL_TYPE_GAME && terminalOutputs.gameType == constants.GAME_TYPE_LAS_VEGAS) {
  //     var index = 0
  //     for (var casinoNo in terminalOutputs.casinos) {
  //       context.drawImage(images.blocks[3022], 0, 0, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, constants.MENU_LEFT_EDGE + 10, constants.MENU_TOP_EDGE+ 10 + index * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
  //       var casinoImageX, casinoImageY
  //       switch (terminalOutputs.casinos[casinoNo].casinoNo) {
  //         case 1:
  //           casinoImageX = canvasInfo.imageBlockSize * 1 / 4
  //           casinoImageY = canvasInfo.imageBlockSize * 2 / 4
  //           break
  //         case 2:
  //           casinoImageX = canvasInfo.imageBlockSize * 2 / 4
  //           casinoImageY = canvasInfo.imageBlockSize * 2 / 4
  //           break
  //         case 3:
  //           casinoImageX = canvasInfo.imageBlockSize * 3 / 4
  //           casinoImageY = canvasInfo.imageBlockSize * 2 / 4
  //           break
  //         case 4:
  //           casinoImageX = canvasInfo.imageBlockSize * 0 / 4
  //           casinoImageY = canvasInfo.imageBlockSize * 3 / 4
  //           break
  //         case 5:
  //           casinoImageX = canvasInfo.imageBlockSize * 1 / 4
  //           casinoImageY = canvasInfo.imageBlockSize * 3 / 4
  //           break
  //         case 6:
  //           casinoImageX = canvasInfo.imageBlockSize * 2 / 4
  //           casinoImageY = canvasInfo.imageBlockSize * 3 / 4
  //           break
  //       }
  //       context.drawImage(images.blocks[3023], casinoImageX, casinoImageY, canvasInfo.imageBlockSize / 4, canvasInfo.imageBlockSize / 4, constants.MENU_LEFT_EDGE + 10, constants.MENU_TOP_EDGE+ 10 + index * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
  //       var cashIndex = 0
  //       for (var cash in terminalOutputs.casinos[casinoNo].cashQueue) {
  //         this.printText(context, terminalOutputs.casinos[casinoNo].cashQueue[cash].value, constants.MENU_LEFT_EDGE + 10 + canvasInfo.blockSize / 2 + cashIndex * 50, constants.MENU_TOP_EDGE+ 10 + (index + 0.25) * canvasInfo.blockSize / 2, 50, 'left')
  //         cashIndex++
  //       }
  //       var diceIndex = 0
  //       for (var dice in terminalOutputs.casinos[casinoNo].diceMap) {
  //         var playerImageX, playerImageY
  //         switch (dice) {
  //           case 1:
  //             playerImageX = canvasInfo.imageBlockSize * 0 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 0 / 4
  //             break
  //           case 2:
  //             playerImageX = canvasInfo.imageBlockSize * 1 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 0 / 4
  //             break
  //           case 3:
  //             playerImageX = canvasInfo.imageBlockSize * 2 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 0 / 4
  //             break
  //           case 4:
  //             playerImageX = canvasInfo.imageBlockSize * 3 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 0 / 4
  //             break
  //           case 5:
  //             playerImageX = canvasInfo.imageBlockSize * 0 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 1 / 4
  //             break
  //           case 6:
  //             playerImageX = canvasInfo.imageBlockSize * 1 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 1 / 4
  //             break
  //           case 7:
  //             playerImageX = canvasInfo.imageBlockSize * 2 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 1 / 4
  //             break
  //           case 8:
  //             playerImageX = canvasInfo.imageBlockSize * 3 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 1 / 4
  //             break
  //         }
  //         for (var i = 0; i < terminalOutputs.casinos[casinoNo].diceMap[dice]; i++) {
  //           context.drawImage(images.blocks[3023], playerImageX, playerImageY, canvasInfo.imageBlockSize / 4, canvasInfo.imageBlockSize / 4, constants.MENU_LEFT_EDGE + 10 + diceIndex * canvasInfo.blockSize / 4, constants.MENU_TOP_EDGE+ 10 + (index + 0.5) * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
  //           context.drawImage(images.blocks[3023], casinoImageX, casinoImageY, canvasInfo.imageBlockSize / 4, canvasInfo.imageBlockSize / 4, constants.MENU_LEFT_EDGE + 10 + diceIndex * canvasInfo.blockSize / 4, constants.MENU_TOP_EDGE+ 10 + (index + 0.5) * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
  //           diceIndex++
  //         }
  //       }
  //       index++
  //     }
  //     index = 0
  //     for (var player in terminalOutputs.players) {
  //       this.printText(context, terminalOutputs.players[player].name + '(' + terminalOutputs.players[player].money + ')', constants.MENU_LEFT_EDGE + 10, constants.MENU_TOP_EDGE+ 10 + (index + 0.25 + 6) * canvasInfo.blockSize / 2, 100, 'left')
  //       switch (player) {
  //         case 1:
  //             playerImageX = canvasInfo.imageBlockSize * 0 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 0 / 4
  //             break
  //           case 2:
  //             playerImageX = canvasInfo.imageBlockSize * 1 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 0 / 4
  //             break
  //           case 3:
  //             playerImageX = canvasInfo.imageBlockSize * 2 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 0 / 4
  //             break
  //           case 4:
  //             playerImageX = canvasInfo.imageBlockSize * 3 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 0 / 4
  //             break
  //           case 5:
  //             playerImageX = canvasInfo.imageBlockSize * 0 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 1 / 4
  //             break
  //           case 6:
  //             playerImageX = canvasInfo.imageBlockSize * 1 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 1 / 4
  //             break
  //           case 7:
  //             playerImageX = canvasInfo.imageBlockSize * 2 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 1 / 4
  //             break
  //           case 8:
  //             playerImageX = canvasInfo.imageBlockSize * 3 / 4
  //             playerImageY = canvasInfo.imageBlockSize * 1 / 4
  //             break
  //       }
  //       diceIndex = 0
  //       for (dice in terminalOutputs.players.diceQueue) {
  //         switch (terminalOutputs.players[player].diceQueue[dice].point) {
  //           case 1:
  //             casinoImageX = canvasInfo.imageBlockSize * 1 / 4
  //             casinoImageY = canvasInfo.imageBlockSize * 2 / 4
  //             break
  //           case 2:
  //             casinoImageX = canvasInfo.imageBlockSize * 2 / 4
  //             casinoImageY = canvasInfo.imageBlockSize * 2 / 4
  //             break
  //           case 3:
  //             casinoImageX = canvasInfo.imageBlockSize * 3 / 4
  //             casinoImageY = canvasInfo.imageBlockSize * 2 / 4
  //             break
  //           case 4:
  //             casinoImageX = canvasInfo.imageBlockSize * 0 / 4
  //             casinoImageY = canvasInfo.imageBlockSize * 3 / 4
  //             break
  //           case 5:
  //             casinoImageX = canvasInfo.imageBlockSize * 1 / 4
  //             casinoImageY = canvasInfo.imageBlockSize * 3 / 4
  //             break
  //           case 6:
  //             casinoImageX = canvasInfo.imageBlockSize * 2 / 4
  //             casinoImageY = canvasInfo.imageBlockSize * 3 / 4
  //             break
  //         }
  //         context.drawImage(images.blocks[3023], playerImageX, playerImageY, canvasInfo.imageBlockSize / 4, canvasInfo.imageBlockSize / 4, constants.MENU_LEFT_EDGE + 10 + diceIndex * canvasInfo.blockSize / 4, constants.MENU_TOP_EDGE+ 10 + (index + 0.5 + 6) * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
  //         context.drawImage(images.blocks[3023], casinoImageX, casinoImageY, canvasInfo.imageBlockSize / 4, canvasInfo.imageBlockSize / 4, constants.MENU_LEFT_EDGE + 10 + diceIndex * canvasInfo.blockSize / 4, constants.MENU_TOP_EDGE+ 10 + (index + 0.5 + 6) * canvasInfo.blockSize / 2, canvasInfo.blockSize / 4, canvasInfo.blockSize / 4)
  //         diceIndex++
  //       }
  //     }
  //   }
  // },
  findTopBossId (userInfo, playerInfoTemp) {
    if (!utilMethods.isDef(playerInfoTemp)) {
      return undefined
    }
    while (utilMethods.isDef(playerInfoTemp) && !utilMethods.isBlankString(playerInfoTemp.bossId) && playerInfoTemp.bossId != playerInfoTemp.id) {
      playerInfoTemp = userInfo.playerInfos[playerInfoTemp.bossId]
    }
    return playerInfoTemp.id
  },
  generateskillsName (userInfo, skills) {
    var rst = ''
    switch (skills.skillCode) {
      case constants.SKILL_CODE_BLOCK:
        rst += 'Block'
        break
      case constants.SKILL_CODE_HEAL:
        rst += 'Heal'
        break
      case constants.SKILL_CODE_CURSE:
        rst += 'Curse'
        break
      case constants.SKILL_CODE_CHEER:
        rst += 'Cheer'
        break
      case constants.SKILL_CODE_MELEE_HIT:
        rst += 'Hit'
        break
      case constants.SKILL_CODE_MELEE_KICK:
        rst += 'Kick'
        break
      case constants.SKILL_CODE_MELEE_SCRATCH:
        rst += 'Scratch'
        break
      case constants.SKILL_CODE_MELEE_SMASH:
        rst += 'Smash'
        break
      case constants.SKILL_CODE_MELEE_CLEAVE:
        rst += 'Cleave'
        break
      case constants.SKILL_CODE_MELEE_CHOP:
        rst += 'Chop'
        break
      case constants.SKILL_CODE_MELEE_PICK:
        rst += 'Pick'
        break
      case constants.SKILL_CODE_MELEE_STAB:
        rst += 'Stab'
        break
      case constants.SKILL_CODE_SHOOT_HIT:
      case constants.SKILL_CODE_SHOOT_ARROW:
      case constants.SKILL_CODE_SHOOT_GUN:
      case constants.SKILL_CODE_SHOOT_SHOTGUN:
      case constants.SKILL_CODE_SHOOT_MAGNUM:
      case constants.SKILL_CODE_SHOOT_ROCKET:
      case constants.SKILL_CODE_SHOOT_FIRE:
      case constants.SKILL_CODE_SHOOT_WATER:
        rst += 'Shoot'
        break
      case constants.SKILL_CODE_LAY_MINE:
      case constants.SKILL_CODE_LAY_BARRIER:
      case constants.SKILL_CODE_LAY_WIRE_NETTING:
        rst += 'Lay'
        break
      case constants.SKILL_CODE_BUILD:
        rst += 'Build'
        break
      case constants.SKILL_CODE_FISH:
        rst += 'Fish'
        break
      case constants.SKILL_CODE_SHOVEL:
        rst += 'Shovel'
        break
      case constants.SKILL_CODE_PLOW:
        rst += 'Plow'
        break
    }
    if (!utilMethods.isBlankString(skills.ammoCode)) {
      var ammoAmount = userInfo.bagInfo.items[skills.ammoCode]
      if (!utilMethods.isDef(ammoAmount)) {
        ammoAmount = 0
      }
      rst += '(' + ammoAmount + ')'
    }
    // switch (skills.skillsMode) {
    //   case constants.SKILL_MODE_SEMI_AUTO:
    //   break
    //   case constants.SKILL_MODE_AUTO:
    //   rst += '(A)'
    //   break
    // }
    return rst
  }
};