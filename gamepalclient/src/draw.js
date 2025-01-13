// draw.js

import { constants } from "./constants";

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
    if (this.isDef(userInfo.grids)) {
      this.drawGridBlock(canvasInfo, staticData, images, userInfo)
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
      if (block.id != userInfo.userCode && this.checkBlockTypeInteractive(block.type)) {
        var distance = Math.sqrt(Math.pow(block.x - userInfo.playerInfo.coordinate.x, 2) + Math.pow(block.y - userInfo.playerInfo.coordinate.y, 2))
        if (Math.abs(userInfo.playerInfo.faceDirection - this.calculateAngle(block.x - userInfo.playerInfo.coordinate.x, block.y - userInfo.playerInfo.coordinate.y)) <= constants.MIN_INTERACTION_ANGLE && distance <= constants.MIN_INTERACTION_DISTANCE) {
          if ((!this.isDef(blockToInteract) || distance < blockToInteractDistance)) {
            blockToInteract = block
            blockToInteractDistance = distance
          }
        }
      }
      if (block.type == constants.BLOCK_TYPE_PLAYER) {
        this.drawCharacter(canvasInfo, staticData, images, userInfo, userInfo.playerInfos[block.id], block.x - 0.5, block.y - 1, canvasInfo.blockSize)
      } else {
        this.drawBlock(canvasInfo, staticData, images, userInfo, block)
      }
    }
    // Show interactions (new)
    if (this.isDef(blockToInteract)
        && (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_IDLE
        || canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_MOVING)) {
      this.updateInteractions(userInfo, blockToInteract)
      context.drawImage(images.effectsImage['selectionEffect'], Math.floor(timestamp / 100) % 10 * canvasInfo.imageBlockSize, 0 * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
      (blockToInteract.x - 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
      (blockToInteract.y - 1) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
      canvasInfo.blockSize,
      canvasInfo.blockSize)
      var txt
      if (blockToInteract.id != userInfo.userCode && this.checkBlockTypeInteractive(blockToInteract.type)) {
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
        if (this.isDef(blockToInteract.hp) && this.isDef(blockToInteract.hpMax)) {
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
    if (this.isDef(topBossId) && topBossId != userInfo.userCode) {
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

    // Show minimap
    this.drawMinimap(canvasInfo, staticData, images, userInfo)

    // Show status1
    if (this.isDef(userInfo.playerInfo.nickname) && this.isDef(userInfo.playerInfo.lastName) && this.isDef(userInfo.playerInfo.firstName)) {
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
    document.getElementById('chat').style.display = 'inline'
    switch (userInfo.chatInfo.scope) {
      case constants.SCOPE_GLOBAL:
        document.getElementById('chat-scope').innerText = '[广播]'
        break
      case constants.SCOPE_TEAMMATE:
        document.getElementById('chat-scope').innerText = '[队友]'
        break
      case constants.SCOPE_INDIVIDUAL:
        document.getElementById('chat-scope').innerText = '[个人]'
        if (this.isDef(userInfo.chatInfo.chatTo) && this.isDef(userInfo.playerInfos[userInfo.chatInfo.chatTo])) {
          document.getElementById('chat-scope').innerText += userInfo.playerInfos[userInfo.chatInfo.chatTo].nickname
        } else {
          document.getElementById('chat-scope').innerText += '无'
        }
        break
    }
    if (canvasInfo.canvasMoveUse !== constants.MOVEMENT_STATE_RECORDER) {
      context.drawImage(images.smallButtons, 0 * constants.DEFAULT_SMALL_BUTTON_SIZE, 0 * constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.recordButtonPosition.x, canvasInfo.recordButtonPosition.y, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE)
    } else {
      context.drawImage(images.smallButtons, 0 * constants.DEFAULT_SMALL_BUTTON_SIZE, 1 * constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE, canvasInfo.recordButtonPosition.x, canvasInfo.recordButtonPosition.y, constants.DEFAULT_SMALL_BUTTON_SIZE, constants.DEFAULT_SMALL_BUTTON_SIZE)
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
      document.getElementById('items-exchange').style.display = 'inline'
      this.printMenu(canvasInfo, staticData, images, userInfo)
      this.printExchange(canvasInfo, staticData, images, userInfo)
    }
    document.getElementById('recipes').style.display = 'none'
    document.getElementById('terminal').style.display = 'none'
    if (canvasInfo.canvasMoveUse === constants.MOVEMENT_STATE_USE) {
      if (this.isDef(userInfo.interactionInfo)) {
        this.printMenu(canvasInfo, staticData, images, userInfo)
        if (userInfo.interactionInfo.type == constants.BLOCK_TYPE_GAME) {
          // document.getElementById('terminal').style.display = 'inline'
          // this.printTerminal(terminalOutputs, canvasInfo.imageBlockSize, canvasInfo.blockSize)
        } else {
          document.getElementById('recipes').style.display = 'inline'
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
    if ( canvasInfo.isKeyDown[10]) {
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
    if ( canvasInfo.isKeyDown[11]) {
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
    if ( canvasInfo.isKeyDown[12]) {
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
    if ( canvasInfo.isKeyDown[13]) {
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
  drawCharacter (canvasInfo, staticData, images, userInfo, playerInfoTemp, x, y, characterBlockSize) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    var avatarIndex = playerInfoTemp.avatar
    if (playerInfoTemp.creatureType == 1) {
      var topBossId = this.findTopBossId(userInfo, playerInfoTemp)
      avatarIndex = this.isDef(topBossId) && topBossId != playerInfoTemp.id ? userInfo.playerInfos[topBossId].avatar : playerInfoTemp.avatar
    }
    var upLeftPoint = {x: x * characterBlockSize + canvasInfo.deltaWidth, y: y * characterBlockSize + canvasInfo.deltaHeight}
    var downRightPoint = {x: (x + 1) * characterBlockSize + canvasInfo.deltaWidth, y: (y + 1) * characterBlockSize + canvasInfo.deltaHeight}

    var isSwimming = this.isDef(playerInfoTemp.floorCode) && playerInfoTemp.floorCode == 1018
    // Draw shadow
    if (!isSwimming) {
      context.save()
      context.beginPath()
      context.fillStyle = 'rgba(31, 31, 31, 0.25)'
      context.ellipse((x + 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, (y+ 0.9) * canvasInfo.blockSize + canvasInfo.deltaHeight,
      canvasInfo.blockSize * 0.2, canvasInfo.blockSize * 0.1, 0, 0, 2 * Math.PI)
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
          this.drawTool(context, x, y, canvasInfo.imageBlockSize, canvasInfo.blockSize, playerInfoTemp.tools[toolIndex], offsetY, canvasInfo.deltaWidth, canvasInfo.deltaHeight, images.toolsImage)
        }
      }
      // Draw head
      this.drawHead(context, canvasInfo.imageBlockSize, canvasInfo.blockSize, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, images.eyesImage, images.hairstylesImage)
      // Draw body (down)
      if (!isSwimming) {
        context.drawImage(images.bodiesImage[playerInfoTemp.skinColor - 1], offsetX * canvasInfo.imageBlockSize, (constants.WAIST_BODY_RATIO + offsetY) * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, (1 - constants.WAIST_BODY_RATIO) * canvasInfo.imageBlockSize, 
        x * canvasInfo.blockSize + canvasInfo.deltaWidth, (constants.WAIST_BODY_RATIO + y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize, (1 - constants.WAIST_BODY_RATIO) * canvasInfo.blockSize)
      }
      // Draw body (up)
      context.drawImage(images.bodiesImage[playerInfoTemp.skinColor - 1], upOffsetX * canvasInfo.imageBlockSize, (constants.HEAD_BODY_RATIO + offsetY) * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, (constants.WAIST_BODY_RATIO - constants.HEAD_BODY_RATIO) * canvasInfo.imageBlockSize, 
      x * canvasInfo.blockSize + canvasInfo.deltaWidth, (constants.HEAD_BODY_RATIO + y) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize, (constants.WAIST_BODY_RATIO - constants.HEAD_BODY_RATIO) * canvasInfo.blockSize)
      // Draw underwear
      this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, 'o006', 0, upOffsetX, offsetY, x, y, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize)
      if (!isSwimming) {
        this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, 'o006', 1, upOffsetX, offsetY, x, y, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize)
      }
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (var outfitIndex in playerInfoTemp.outfits) {
          if (!isSwimming) {
            // Draw pants
            this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 1, offsetX, offsetY, x, y, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize)
            // Draw shoes
            this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 2, offsetX, offsetY, x, y, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize)
          }
          // Draw clothes
          this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 0, upOffsetX, offsetY, x, y, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize)
        }
      }
      // Draw top tool
      if (offsetY !== 1 && offsetY !== 3) {
        for (toolIndex in playerInfoTemp.tools) {
          this.drawTool(context, x, y, canvasInfo.imageBlockSize, canvasInfo.blockSize, playerInfoTemp.tools[toolIndex], offsetY, canvasInfo.deltaWidth, canvasInfo.deltaHeight, images.toolsImage)
        }
      }
      // Draw top arm
      context.drawImage(images.armsImage[playerInfoTemp.skinColor - 1], upOffsetX * canvasInfo.imageBlockSize, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
      x * canvasInfo.blockSize + canvasInfo.deltaWidth, y * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize, canvasInfo.blockSize)
      // Draw bottom sleeve
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (outfitIndex in playerInfoTemp.outfits) {
          this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 4, upOffsetX, offsetY, x, y, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize)
        }
      }
      // Draw top sleeve
      if (this.isDef(playerInfoTemp.outfits) && playerInfoTemp.outfits.length > 0) {
        for (outfitIndex in playerInfoTemp.outfits) {
          this.drawOutfits(context, canvasInfo.tempCanvas, images.outfitsImage, playerInfoTemp.outfits[outfitIndex], 3, upOffsetX, offsetY, x, y, canvasInfo.deltaWidth, canvasInfo.deltaHeight, canvasInfo.imageBlockSize, canvasInfo.blockSize)
        }
      }
    } else if (playerInfoTemp.creatureType == 2) {
      // Display animals
      if (playerInfoTemp.skinColor !== 0) {
        context.drawImage(images.animalsImage[playerInfoTemp.skinColor], offsetX * canvasInfo.imageBlockSize, offsetY * canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
        x * canvasInfo.blockSize + canvasInfo.deltaWidth, y * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize, canvasInfo.blockSize)
      }
    } else if (playerInfoTemp.creatureType == 3) {
      // Display other creatures
      // TBD
    }
    if (playerInfoTemp.playerType == constants.PLAYER_TYPE_HUMAN) {
      // Show name
      this.drawAvatar(canvasInfo, staticData, images, userInfo, (x + 0.5) * canvasInfo.blockSize - 0.4 * constants.DEFAULT_BLOCK_SIZE + canvasInfo.deltaWidth, 
      (y - constants.STATUS_DISPLAY_DISTANCE) * canvasInfo.blockSize - 0.15 * constants.DEFAULT_BLOCK_SIZE + canvasInfo.deltaHeight,
      constants.DEFAULT_BLOCK_SIZE * 0.2, avatarIndex, playerInfoTemp.nameColor)
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
      //   context.arc((x + 0.5) * blockSize - 0.25 * constants.DEFAULT_BLOCK_SIZE + deltaWidth, 
      //   (y - constants.STATUS_DISPLAY_DISTANCE) * blockSize + 0.15 * constants.DEFAULT_BLOCK_SIZE + deltaHeight, 
      //   0.1 * constants.DEFAULT_BLOCK_SIZE, 0, 
      //   2 * Math.PI)
      //   context.fill()
      //   context.restore()
      // }
      if (this.isDef(playerInfoTemp.nickname)) {
        this.printText(context, playerInfoTemp.nickname, (x + 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
        (y - constants.STATUS_DISPLAY_DISTANCE) * canvasInfo.blockSize + canvasInfo.deltaHeight,
        constants.DEFAULT_BLOCK_SIZE * 0.5, 
        'center')
      }
    }
  },
  drawHead (context, imageBlockSize, blockSize, upLeftPoint, downRightPoint, offsetY, playerInfoTemp, eyesImage, hairstylesImage) {
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
  drawBlock (canvasInfo, staticData, images, userInfo, block) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    var imageX = 0
    var imageY = 0
    var timestamp = new Date().valueOf()
    var img
    var playerInfo = userInfo.playerInfos[userInfo.userCode]
    if (block.type == constants.BLOCK_TYPE_DROP) {
      img = images.dropsImage
      switch (block.itemNo.charAt(0)) {
        case constants.ITEM_CHARACTER_TOOL:
          imageX = 0 * canvasInfo.imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_OUTFIT:
          imageX = 1 * canvasInfo.imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_CONSUMABLE:
          imageX = 2 * canvasInfo.imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_MATERIAL:
        case constants.ITEM_CHARACTER_JUNK:
          imageX = 3 * canvasInfo.imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_NOTE:
          imageX = 4 * canvasInfo.imageBlockSize / 2
          break
        case constants.ITEM_CHARACTER_RECORDING:
          imageX = 5 * canvasInfo.imageBlockSize / 2
          break
      }
      context.drawImage(img, imageX, imageY, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, 
      (block.x - 0.5 * Math.sin(timestamp % 4000 * Math.PI * 2 / 4000) / 2) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
      (block.y - 1 / 2) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
      canvasInfo.blockSize / 2 * Math.sin(timestamp % 4000 * Math.PI * 2 / 4000), 
      canvasInfo.blockSize / 2)
      // Show notifications (drop)
      if (Math.pow(playerInfo.coordinate.x - block.x, 2) + Math.pow(playerInfo.coordinate.y - block.y, 2) <= Math.pow(constants.MIN_DISPLAY_DISTANCE_BLOCK_PLAYER, 2)) {
        var itemName = staticData.items[block.itemNo].name
        this.printText(context, itemName + '(' + block.amount + ')', 
        block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
        (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
        canvasInfo.blockSize, 'center')
      }
      return true
    }
    if (!this.isDef(block.code)) {
      console.log(JSON.stringify(block))
    }
    var codeFragments = block.code.split('-')
    // Draw by Canvas
    img = images.blockImages[Number(codeFragments[0])]
    switch (codeFragments[0].charAt(0)) {
      case constants.BLOCK_CODE_PREFIX_PLANTS:
        // plants
        this.drawScenesImage(context, canvasInfo.imageBlockSize, canvasInfo.blockSize, canvasInfo.deltaWidth, canvasInfo.deltaHeight, block, images.scenesImage)
        return
      case constants.BLOCK_CODE_PREFIX_ROCKS:
        // rocks
        this.drawScenesImage(context, canvasInfo.imageBlockSize, canvasInfo.blockSize, canvasInfo.deltaWidth, canvasInfo.deltaHeight, block, images.scenesImage)
        return
      default:
        break
    }
    if (Number(codeFragments[0]) == constants.EVENT_CODE_TAIL_SMOKE) {
      context.save()
      context.fillStyle = 'rgba(127, 127, 127, ' + (1 - Number(codeFragments[1]) / 25) + ')'
      context.beginPath()
      context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (0.2 + Number(codeFragments[1]) / 25 * 0.8), 0, 2 * Math.PI)
      context.fill()
      context.restore()
      return true
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_NOISE) {
      context.save()
      context.lineWidth = 100 * Number(codeFragments[1]) / 25
      context.strokeStyle = 'rgba(196, 196, 196, ' + (0.25 - 0.25 * Number(codeFragments[1]) / 25) + ')'
      context.beginPath()
      context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + Number(codeFragments[1]) / 25 * 3), 0, 2 * Math.PI)
      context.stroke()
      context.restore()
      return true
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_CURSE) {
      context.save()
      context.lineWidth = 100 * Number(codeFragments[1]) / 25
      context.strokeStyle = 'rgba(0, 0, 0, ' + (0.25 - 0.25 * Number(codeFragments[1]) / 25) + ')'
      context.beginPath()
      context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + Number(codeFragments[1]) / 25 * 3), 0, 2 * Math.PI)
      context.stroke()
      context.restore()
      return true
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_CHEER) {
      context.save()
      context.lineWidth = 100 * Number(codeFragments[1]) / 25
      context.strokeStyle = 'rgba(255, 255, 127, ' + (0.25 - 0.25 * Number(codeFragments[1]) / 25) + ')'
      context.beginPath()
      context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (2 + Number(codeFragments[1]) / 25 * 3), 0, 2 * Math.PI)
      context.stroke()
      context.restore()
      return true
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_SLUG
        || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_MAGNUM
        || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_ROCKET
        || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_FIRE
        || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_WATER
        || Number(codeFragments[0]) == constants.EVENT_CODE_MINE) {
      // Hidden figure
      return true
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_ASH) {
        context.save()
        context.fillStyle = 'rgba(195, 195, 195, ' + (1 - Number(codeFragments[1]) / 25) + ')'
        context.beginPath()
        context.arc(block.x * canvasInfo.blockSize + canvasInfo.deltaWidth, (block.y - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight, canvasInfo.blockSize * (0.1 + Number(codeFragments[1]) / 25 * 0.4), 0, 2 * Math.PI)
        context.fill()
        context.restore()
        return true
    }
    // Load image resource
    if (Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_HIT
    || Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_KICK
    || Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_SMASH
    || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_HIT) {
      img = images.effectsImage['hitEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_UPGRADE) {
      img = images.effectsImage['upgradeEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_EXPLODE) {
      img = images.effectsImage['explodeEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_BLEED) {
      img = images.effectsImage['bleedEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_BLOCK) {
      img = images.effectsImage['haloEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_HEAL) {
      img = images.effectsImage['healEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * canvasInfo.imageBlockSize
      imageY = Math.floor((Number(codeFragments[1])) * 1 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_DISTURB) {
      img = images.effectsImage['disturbEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * canvasInfo.imageBlockSize
      imageY = Math.floor((Number(codeFragments[1])) * 1 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_SACRIFICE) {
      img = images.effectsImage['sacrificeEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_SCRATCH) {
      img = images.effectsImage['meleeScratchEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_CLEAVE
    || Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_CHOP
    || Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_PICK) {
      img = images.effectsImage['meleeCleaveEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_MELEE_STAB
        || Number(codeFragments[0]) == constants.EVENT_CODE_SHOOT_ARROW) {
      img = images.effectsImage['meleeStabEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_SPARK
        || Number(codeFragments[0]) == constants.EVENT_CODE_SPARK_SHORT) {
      img = images.effectsImage['sparkEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) % 10 * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_FIRE) {
      img = images.effectsImage['fireEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * canvasInfo.imageBlockSize
    } else if (Number(codeFragments[0]) == constants.EVENT_CODE_WATER) {
      img = images.effectsImage['waveEffect']
      imageX = Math.floor((Number(codeFragments[1])) * 10 / 25) * canvasInfo.imageBlockSize
    } else {
      img = images.blockImages[Number(codeFragments[0])]
      imageX = 0
    }
    if (!this.isDef(img)) {
      img = images.blockImages[1000]
    }
    context.drawImage(img, imageX, imageY, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
    (block.x - 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
    (block.y - 1) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
    canvasInfo.blockSize + 1, 
    canvasInfo.blockSize + 1)
    // if (!this.isDef(img)) {
    //   img = images.blockImages[1000]
    // }
    // context.drawImage(img, imageX, imageY, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize,
    // (block.x - 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
    // (block.y - 1) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
    // canvasInfo.blockSize + 1, 
    // canvasInfo.blockSize + 1)
    return true
    // switch (block.code.charAt(0)) {
    //   case constants.BLOCK_CODE_PREFIX_PLANTS:
    //     // plants
    //     this.drawScenesImage(context, canvasInfo.imageBlockSize, canvasInfo.blockSize, canvasInfo.deltaWidth, canvasInfo.deltaHeight, block, images.scenesImage)
    //     break
    //   case constants.BLOCK_CODE_PREFIX_ROCKS:
    //     // rocks
    //     this.drawScenesImage(context, canvasInfo.imageBlockSize, canvasInfo.blockSize, canvasInfo.deltaWidth, canvasInfo.deltaHeight, block, images.scenesImage)
    //     break
    //   default:
    //     if (Number(block.code) === 0) {
    //       break
    //     }
    //     img = images.blockImages[Number(block.code)]
    //     if (!this.isDef(img)) {
    //       img = images.blockImages[1000]
    //     }
    //     context.drawImage(img, imageX, imageY, canvasInfo.imageBlockSize, canvasInfo.imageBlockSize, 
    //     (block.x - 0.5) * canvasInfo.blockSize + canvasInfo.deltaWidth, 
    //     (block.y - 1) * canvasInfo.blockSize + canvasInfo.deltaHeight, 
    //     canvasInfo.blockSize + 1, 
    //     canvasInfo.blockSize + 1)
    //     break
    // }
    // return true
  },
  drawGridBlock (canvasInfo, staticData, images, userInfo) {
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
          type: constants.BLOCK_TYPE_GROUND,
          code: String(userInfo.grids[i][j]),
          x: i - horizontalRadius * userInfo.regionInfo.width,
          y: j - verticalRadius * userInfo.regionInfo.height
        }
        context.drawImage(images.blockImages[Number(upleftGridBlock.code)], 0, 0, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2,
        upleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
        upleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
        canvasInfo.blockSize / 2 + 1, 
        canvasInfo.blockSize / 2 + 1)
        var uprightGridBlock = {
          type: constants.BLOCK_TYPE_GROUND,
          code: String(userInfo.grids[i + 1][j]),
          x: i - horizontalRadius * userInfo.regionInfo.width + 0.5,
          y: j - verticalRadius * userInfo.regionInfo.height
        }
        context.drawImage(images.blockImages[Number(uprightGridBlock.code)], 0, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2,
        uprightGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
        uprightGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
        canvasInfo.blockSize / 2 + 1, 
        canvasInfo.blockSize / 2 + 1)
        var downleftGridBlock = {
          type: constants.BLOCK_TYPE_GROUND,
          code: String(userInfo.grids[i][j + 1]),
          x: i - horizontalRadius * userInfo.regionInfo.width,
          y: j - verticalRadius * userInfo.regionInfo.height + 0.5
        }
        context.drawImage(images.blockImages[Number(downleftGridBlock.code)], canvasInfo.imageBlockSize / 2, 0, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2,
        downleftGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
        downleftGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
        canvasInfo.blockSize / 2 + 1, 
        canvasInfo.blockSize / 2 + 1)
        var downrightGridBlock = {
          type: constants.BLOCK_TYPE_GROUND,
          code: String(userInfo.grids[i + 1][j + 1]),
          x: i - horizontalRadius * userInfo.regionInfo.width + 0.5,
          y: j - verticalRadius * userInfo.regionInfo.height + 0.5
        }
        context.drawImage(images.blockImages[Number(downrightGridBlock.code)], canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2,
        downrightGridBlock.x * canvasInfo.blockSize + canvasInfo.deltaWidth, 
        downrightGridBlock.y * canvasInfo.blockSize + canvasInfo.deltaHeight, 
        canvasInfo.blockSize / 2 + 1, 
        canvasInfo.blockSize / 2 + 1)
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
  drawScenesImage (context, imageBlockSize, blockSize, deltaWidth, deltaHeight, block, scenesImage) {
    var codeFragments = block.code.split('-')
    context.drawImage(scenesImage[codeFragments[0]], Number(codeFragments[1]) * imageBlockSize, Number(codeFragments[2]) * imageBlockSize, block.structure.imageSize.x * imageBlockSize, block.structure.imageSize.y * imageBlockSize, 
    (block.x - block.structure.imageSize.x / 2) * blockSize + deltaWidth, (block.y - block.structure.imageSize.y) * blockSize + deltaHeight, block.structure.imageSize.x * blockSize, block.structure.imageSize.y * blockSize)
  },
  drawAvatar (canvasInfo, staticData, images, userInfo, x, y, avatarSize, avatarIndex, nameColor) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    context.save()
    context.beginPath()
    context.strokeStyle = nameColor
    context.lineWidth = avatarSize / 25
    context.arc(x + avatarSize / 2, y + avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
    context.stroke()
    context.clip()
    context.drawImage(images.avatarsImage, avatarIndex % 10 * canvasInfo.imageBlockSize / 2, Math.floor(avatarIndex / 10) * canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, canvasInfo.imageBlockSize / 2, x, y, avatarSize, avatarSize)
    context.restore()
  },
  drawTool (context, x, y, imageBlockSize, blockSize, toolIndex, offsetY, deltaWidth, deltaHeight, toolsImage) {
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
      default:
        // unable to display
        return
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
  drawMinimap (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    if (!this.isDef(userInfo.miniMap)) {
      return
    }
    context.save()
    if (this.isDef(userInfo.miniMap.background)) {
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
    if (this.isDef(userInfo.miniMap.sceneCoordinate)) {
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
    if (this.isDef(userInfo.playerInfo) && userInfo.playerInfo.playerStatus == constants.PLAYER_STATUS_RUNNING) {
      playerInfoTemp = Object.assign({}, userInfo.playerInfo)
      playerInfoTemp.speed = {
        x: Math.sin(timestamp % 4000 * Math.PI * 2 / 4000),
        y: Math.cos(timestamp % 4000 * Math.PI * 2 / 4000)
      }
      playerInfoTemp.faceDirection = this.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
      playerInfoTemp.outfits = ['o001']
      this.drawCharacter(canvasInfo, staticData, images, userInfo, playerInfoTemp, (constants.MENU_LEFT_EDGE + 110 - canvasInfo.deltaWidth) / constants.DEFAULT_BLOCK_SIZE, (constants.MENU_TOP_EDGE + 70 - canvasInfo.deltaHeight) / constants.DEFAULT_BLOCK_SIZE, constants.DEFAULT_BLOCK_SIZE)
      playerInfoTemp.speed = { x:0, y:0 }
      playerInfoTemp.faceDirection = 270
      this.drawCharacter(canvasInfo, staticData, images, userInfo, playerInfoTemp, (constants.MENU_LEFT_EDGE + 10 - canvasInfo.deltaWidth) / constants.DEFAULT_BLOCK_SIZE, (constants.MENU_TOP_EDGE + 70 - canvasInfo.deltaHeight) / constants.DEFAULT_BLOCK_SIZE, constants.DEFAULT_BLOCK_SIZE)
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
      hairstyle: document.getElementById('initialization-hairstyle').value,
      hairColor: document.getElementById('initialization-hairColor').value,
      eyes: document.getElementById('initialization-eyes').value,
      avatar: document.getElementById('initialization-avatar').value,
      speed: {
        x: Math.sin(timestamp % 4000 * Math.PI * 2 / 4000),
        y: Math.cos(timestamp % 4000 * Math.PI * 2 / 4000)
      },
      tools: userInfo.playerInfo.tools,
      outfits: userInfo.playerInfo.outfits,
      bossId: '',
    }
    playerInfoTemp.faceDirection = this.calculateAngle(playerInfoTemp.speed.x, playerInfoTemp.speed.y)
    playerInfoTemp.faceCoefs = []
    for (let i = 0; i < constants.FACE_COEFS_LENGTH; i++) {
      playerInfoTemp.faceCoefs[i] = document.getElementById('initialization-coefs-' + (i + 1)).value
    }
    this.drawCharacter(canvasInfo, staticData, images, userInfo, playerInfoTemp, (constants.MENU_LEFT_EDGE + 320 - canvasInfo.deltaWidth) / constants.DEFAULT_BLOCK_SIZE, (constants.MENU_TOP_EDGE + 70 - canvasInfo.deltaHeight) / constants.DEFAULT_BLOCK_SIZE, constants.DEFAULT_BLOCK_SIZE)
    playerInfoTemp.speed = { x:0, y:0 }
    playerInfoTemp.faceDirection = 270
    this.drawCharacter(canvasInfo, staticData, images, userInfo, playerInfoTemp, (constants.MENU_LEFT_EDGE + 220 - canvasInfo.deltaWidth) / constants.DEFAULT_BLOCK_SIZE, (constants.MENU_TOP_EDGE + 70 - canvasInfo.deltaHeight) / constants.DEFAULT_BLOCK_SIZE, constants.DEFAULT_BLOCK_SIZE)
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
    this.printText(context, '当前位置:' + userInfo.regionInfo.name + '-' + userInfo.sceneInfo.name, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, 'Lv.' + userInfo.playerInfo.level + ' 经验值' + userInfo.playerInfo.exp + '/' + userInfo.playerInfo.expMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '生命值' + userInfo.playerInfo.hp + '/' + userInfo.playerInfo.hpMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '活力值' + userInfo.playerInfo.vp + '/' + userInfo.playerInfo.vpMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '饥饿值' + userInfo.playerInfo.hunger + '/' + userInfo.playerInfo.hungerMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '口渴值' + userInfo.playerInfo.thirst + '/' + userInfo.playerInfo.thirstMax, constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
    positionY += 20
    this.printText(context, '$' + userInfo.playerInfo.money + ' 负重' + Number(userInfo.bagInfo.capacity) + '/' + Number(userInfo.bagInfo.capacityMax) + '(kg)', constants.MENU_LEFT_EDGE + 10, positionY, canvasInfo.canvas.width - constants.MENU_LEFT_EDGE - constants.MENU_RIGHT_EDGE - 20, 'left')
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
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_REVIVED] != 0) {
      hasBuff = true
      buffStr += '急救 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_REALISTIC] != 0) {
      hasBuff = true
      buffStr += '写实 '
    }
    if (userInfo.playerInfo.buff[constants.BUFF_CODE_ANTI_TROPHY] != 0) {
      hasBuff = true
      buffStr += '防盗 '
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
    while (this.isDef(member)) {
      tree.push(member.nickname + ' (' + member.lastName + ', ' + member.firstName + ') Lv.' + member.level)
      colleagueSet.delete(member.id)
      if (this.isDef(member.bossId) && member.bossId != member.id) {
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
    this.printText(context, '缩放: ' + Math.round(canvasInfo.blockSize / constants.MAX_BLOCK_SIZE * 100) + '%', constants.MENU_LEFT_EDGE + 140, constants.MENU_TOP_EDGE + 75, 100, 'left')
    this.printText(context, '音乐', constants.MENU_LEFT_EDGE + 40, constants.MENU_TOP_EDGE + 125, 50, 'left')
    this.printText(context, '音效', constants.MENU_LEFT_EDGE + 140, constants.MENU_TOP_EDGE + 125, 50, 'left')
  },
  printChat (canvasInfo, staticData, images, userInfo) {
    var context = canvasInfo.canvas.getContext('2d') // 设置2D渲染区域
    if (this.isDef(userInfo.chatInfo.chatMessages)) {
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
      x = (Math.floor(userInfo.playerInfo.coordinate.x + 0.5 + 1 * Math.cos(userInfo.playerInfo.faceDirection / 180 * Math.PI))) * canvasInfo.blockSize + canvasInfo.deltaWidth
      y = (Math.floor(userInfo.playerInfo.coordinate.y + 0.5 - 1 * Math.sin(userInfo.playerInfo.faceDirection / 180 * Math.PI)) - 0.5) * canvasInfo.blockSize + canvasInfo.deltaHeight
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
      if (block.id != userInfo.userCode && (!this.isDef(block.buff) || block.buff[constants.BUFF_CODE_DEAD] === 0)) {
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
    if (!this.isDef(userInfo.interactionInfo) || !this.isDef(userInfo.interactionInfo.list)) {
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
  //   if (!this.isDef(terminalOutputs)) {
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
  isDef (v) {
    return v !== undefined && v !== null
  },
  isPromise (val) {
    return this.isDef(val)
    && typeof val.then === 'function'
    && typeof val.catch === 'function'
  },
  isBlankString (str) {
    return !str || /^\s*$/.test(str)
  },
  checkBlockTypeInteractive (blockType) {
    switch (blockType) {
      case constants.BLOCK_TYPE_NORMAL:
      case constants.BLOCK_TYPE_EFFECT:
      case constants.BLOCK_TYPE_DROP:
      case constants.BLOCK_TYPE_TELEPORT:
      case constants.BLOCK_TYPE_BUILDING:
      case constants.BLOCK_TYPE_TREE:
      case constants.BLOCK_TYPE_ROCK:
      case constants.BLOCK_TYPE_TRAP:
        return false
      default:
        return true
    }
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
  calculateAngle (x, y) {
    if (y < 0) {
      return Math.acos(x / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) / Math.PI * 180
    } else if (y > 0) {
      return 360 - Math.acos(x / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))) / Math.PI * 180
    } else {
      if (x > 0) {
        return 0
      } else if (x < 0) {
        return 180
      } else {
        return 270
      }
    }
  },
  findTopBossId (userInfo, playerInfoTemp) {
    if (!this.isDef(playerInfoTemp)) {
      return undefined
    }
    while (this.isDef(playerInfoTemp) && !this.isBlankString(playerInfoTemp.bossId) && playerInfoTemp.bossId != playerInfoTemp.id) {
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
    if (!this.isBlankString(skills.ammoCode)) {
      var ammoAmount = userInfo.bagInfo.items[skills.ammoCode]
      if (!this.isDef(ammoAmount)) {
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