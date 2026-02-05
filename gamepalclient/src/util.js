// util.js

import { constants } from "./constants"

export function utilMethod() {
  // 你的全局方法实现
}

// 或者如果有多个方法
export const utilMethods = {
    isDef (v) {
        return v !== undefined && v !== null
    },
    isPromise (val) {
        return this.isDef(val) && typeof val.then === 'function' && typeof val.catch === 'function'
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
            case constants.BLOCK_TYPE_FLOOR:
            case constants.BLOCK_TYPE_FLOOR_DECORATION:
            case constants.BLOCK_TYPE_WALL:
            case constants.BLOCK_TYPE_WALL_DECORATION:
            case constants.BLOCK_TYPE_PLASMA:
            case constants.BLOCK_TYPE_TEXT_DISPLAY:
            case constants.BLOCK_TYPE_MELEE:
            case constants.BLOCK_TYPE_SHOOT:
            case constants.BLOCK_TYPE_EXPLOSION:
                return false
            default:
                return true
        }
    },
    convertFaceCoefsToCoefs (faceCoefs) {
        var coefs = []
        coefs[0] = 0.8 + (faceCoefs[0] / 100 - 0.5) * 0.2
        coefs[1] = 0.6 + (faceCoefs[1] / 100 - 0.5) * 0.1
        coefs[2] = 1 + (faceCoefs[2] / 100 - 0.5) * 0.2
        coefs[3] = 1 + (faceCoefs[3] / 100 - 0.5) * 0.5
        coefs[4] = 0.05 + (faceCoefs[4] / 100 - 0.5) * 0.05
        coefs[5] = 0.6 + (faceCoefs[5] / 100 - 0.5) * 0.05
        coefs[6] = 0.15 + (faceCoefs[6] / 100 - 0.5) * 0.05
        coefs[7] = 0.15 - (faceCoefs[7] / 100 - 0.5) * 0.1
        coefs[8] = 0.08 + (faceCoefs[8] / 100 - 0.5) * 0.02
        coefs[9] = 0.6 + (faceCoefs[9] / 100 - 0.5) * 0.05
        coefs[10] = 1 + (faceCoefs[10] / 100 - 0.5) * 0.2
        coefs[11] = 1 + (faceCoefs[11] / 100 - 0.5) * 0.2
        coefs[12] = 1.3 + (faceCoefs[12] / 100 - 0.5) * 0.3
        coefs[13] = 0.15 + (faceCoefs[13] / 100 - 0.5) * 0.04
        return coefs
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
    generateHashSequence (a, b, length) {
        // 创建一个基于a和b的种子值，确保不同的a,b组合尽可能产生不同的种子
        const seed = (a + b) * (a - b) * 31 // 使用31是因为它是一个常用的质数，在哈希函数中表现良好
        // 定义一个简单的线性同余生成器作为伪随机数生成器
        function pseudoRandom(seed) {
            let x = seed
            return function() {
                x = (x * 16807) % 2147483647 // 这是经典的Lehmer随机数生成算法
                return x
            }
        }
        const prng = pseudoRandom(seed)
        const sequence = []
        for (let i = 0; i < length; i++) {
            // 生成下一个伪随机数，并将其映射到0-9之间的整数
            const nextNum = Math.abs(Math.floor((prng() / 2147483647) * 10)) - 1
            sequence.push(nextNum)
        }
        return sequence
    },
    /**
     * 根据秒级时间戳返回对应的颜色
     * @param {number} currentTimestamp - 当日的秒级时间戳 (0 - 86399)
     * @param {number} sunriseStart - 日出开始时间戳 (秒)
     * @param {number} sunriseEnd - 日出结束时间戳 (秒)
     * @param {number} sunsetStart - 日落开始时间戳 (秒)
     * @param {number} sunsetEnd - 日落结束时间戳 (秒)
     * @returns {string} - 颜色字符串 (HEX 格式)
     */
    getColorByTime(currentTimestamp, sunriseStart, sunriseEnd, sunsetStart, sunsetEnd) {
        // 确保时间戳在有效范围内 (0 - 86399)
        currentTimestamp = Math.max(0, Math.min(86399, currentTimestamp))
        
        // 定义关键颜色
        const NIGHT_COLOR = [0, 0, 0] // 纯黑 #000000
        const DAWN_PRE_SUNRISE = [25, 25, 50] // 日出前深蓝
        const SUNRISE_COLOR = [255, 100, 20] // 日出橙红
        const DAY_COLOR = [135, 206, 235] // 天蓝色 #87CEEB
        const SUNSET_COLOR = [255, 100, 20] // 日落橙红
        const DUSK_POST_SUNSET = [25, 25, 50] // 日落后深蓝

        // 判断当前时间属于哪个阶段
        if (currentTimestamp < sunriseStart) {
            // 夜晚 (日出前)
            return this.rgbToHex(NIGHT_COLOR)
        } else if (currentTimestamp >= sunriseStart && currentTimestamp < sunriseEnd) {
            // 日出期间 (从深蓝/黑 -> 橙红 -> 天蓝)
            const progress = (currentTimestamp - sunriseStart) / (sunriseEnd - sunriseStart)
            let r, g, b

            if (progress < 0.5) {
                // 第一阶段: 深蓝 -> 橙红
                const p = progress * 2
                r = Math.round(this.interpolate(DAWN_PRE_SUNRISE[0], SUNRISE_COLOR[0], p))
                g = Math.round(this.interpolate(DAWN_PRE_SUNRISE[1], SUNRISE_COLOR[1], p))
                b = Math.round(this.interpolate(DAWN_PRE_SUNRISE[2], SUNRISE_COLOR[2], p))
            } else {
                // 第二阶段: 橙红 -> 天蓝
                const p = (progress - 0.5) * 2
                r = Math.round(this.interpolate(SUNRISE_COLOR[0], DAY_COLOR[0], p))
                g = Math.round(this.interpolate(SUNRISE_COLOR[1], DAY_COLOR[1], p))
                b = Math.round(this.interpolate(SUNRISE_COLOR[2], DAY_COLOR[2], p))
            }
            return this.rgbToHex([r, g, b])
        } else if (currentTimestamp >= sunriseEnd && currentTimestamp < sunsetStart) {
            // 白天
            return this.rgbToHex(DAY_COLOR)
        } else if (currentTimestamp >= sunsetStart && currentTimestamp < sunsetEnd) {
            // 日落期间 (从天蓝 -> 橙红 -> 深蓝/黑)
            const progress = (currentTimestamp - sunsetStart) / (sunsetEnd - sunsetStart)
            let r, g, b

            if (progress < 0.5) {
                // 第一阶段: 天蓝 -> 橙红
                const p = progress * 2
                r = Math.round(this.interpolate(DAY_COLOR[0], SUNSET_COLOR[0], p))
                g = Math.round(this.interpolate(DAY_COLOR[1], SUNSET_COLOR[1], p))
                b = Math.round(this.interpolate(DAY_COLOR[2], SUNSET_COLOR[2], p))
            } else {
                // 第二阶段: 橙红 -> 深蓝
                const p = (progress - 0.5) * 2
                r = Math.round(this.interpolate(SUNSET_COLOR[0], DUSK_POST_SUNSET[0], p))
                g = Math.round(this.interpolate(SUNSET_COLOR[1], DUSK_POST_SUNSET[1], p))
                b = Math.round(this.interpolate(SUNSET_COLOR[2], DUSK_POST_SUNSET[2], p))
            }
            return this.rgbToHex([r, g, b])
        } else {
            // 夜晚 (日落后)
            return this.rgbToHex(NIGHT_COLOR)
        }
    },
    /**
     * 根据时间戳返回一个用于遮罩层的Alpha值
     * 白天返回低透明度 (0.05)，夜晚返回高透明度 (0.5)，日出日落期间线性过渡
     * @param {number} currentTimestamp - 当日的秒级时间戳 (0 - 86399)
     * @param {number} sunriseStart - 日出开始时间戳 (秒)
     * @param {number} sunriseEnd - 日出结束时间戳 (秒)
     * @param {number} sunsetStart - 日落开始时间戳 (秒)
     * @param {number} sunsetEnd - 日落结束时间戳 (秒)
     * @returns {number} - Alpha 值 (0.0 - 1.0)
     */
    getShadeAlphaByTime(currentTimestamp, sunriseStart, sunriseEnd, sunsetStart, sunsetEnd) {
        // 确保时间戳在有效范围内 (0 - 86399)
        currentTimestamp = Math.max(0, Math.min(86399, currentTimestamp))
        
        const DAY_ALPHA = 0.05   // 白天遮罩透明度
        const NIGHT_ALPHA = 0.5  // 夜晚遮罩透明度

        // 判断当前时间属于哪个阶段
        if (currentTimestamp < sunriseStart) {
            // 夜晚 (日出前)
            return NIGHT_ALPHA
        } else if (currentTimestamp >= sunriseStart && currentTimestamp < sunriseEnd) {
            // 日出期间: 从夜晚的高透明度 (0.5) 线性过渡到白天的低透明度 (0.05)
            const progress = (currentTimestamp - sunriseStart) / (sunriseEnd - sunriseStart)
            return this.interpolate(NIGHT_ALPHA, DAY_ALPHA, progress)
        } else if (currentTimestamp >= sunriseEnd && currentTimestamp < sunsetStart) {
            // 白天
            return DAY_ALPHA
        } else if (currentTimestamp >= sunsetStart && currentTimestamp < sunsetEnd) {
            // 日落期间: 从白天的低透明度 (0.05) 线性过渡到夜晚的高透明度 (0.5)
            const progress = (currentTimestamp - sunsetStart) / (sunsetEnd - sunsetStart)
            return this.interpolate(DAY_ALPHA, NIGHT_ALPHA, progress)
        } else {
            // 夜晚 (日落后)
            return NIGHT_ALPHA
        }
    },
    /**
     * 线性插值函数
     * @param {number} start - 起始值
     * @param {number} end - 结束值
     * @param {number} factor - 插值因子 (0 - 1)
     * @returns {number} - 插值结果
     */
    interpolate(start, end, factor) {
        return start + (end - start) * factor
    },
    /**
     * 将 RGB 数组转换为 HEX 颜色字符串
     * @param {number[]} rgb - RGB 数组 [r, g, b]
     * @returns {string} - HEX 颜色字符串 (e.g., "#87CEEB")
     */
    rgbToHex(rgb) {
        return '#' + rgb.map(x => {
            const hex = x.toString(16)
            return hex.length === 1 ? '0' + hex : hex
        }).join('')
    },
    hexToRgbaArray (hex, alpha) {
        // 去掉可能存在的#
        hex = hex.replace(/^#/, '')
        // 如果是3位的简写形式，则扩展为6位
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('')
        }
        // 将16进制转换为整数
        const bigint = parseInt(hex, 16)
        const r = (bigint >> 16) & 255
        const g = (bigint >> 8) & 255
        const b = bigint & 255
        return [r, g, b, alpha]
    },
    hexToRgba (hex, alpha) {
        // 移除可能存在的 '#' 字符
        hex = hex.replace(/^#/, '')
        // 如果是3位的简写形式，则扩展为6位
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('')
        }
        // 将每一对十六进制数字转换为对应的十进制值
        const r = parseInt(hex.slice(0, 2), 16)
        const g = parseInt(hex.slice(2, 4), 16)
        const b = parseInt(hex.slice(4, 6), 16)
        // 返回RGBA格式的字符串
        return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'
    },
    rgbaStrToRgb (rgbaStr) {
        // 查找 '(' 和 ')' 的位置
        const start = rgbaStr.indexOf('(')
        const end = rgbaStr.indexOf(')')
        if (start === -1 || end === -1 || start >= end) {
            throw new Error('Invalid RGBA string format')
        }
        // 提取括号内的子字符串
        const substr = rgbaStr.substring(start + 1, end)
        // 根据 ',' 分割子字符串，并将每一部分转换为数字
        const numbers = substr.split(',').map(s => Number(s.trim()))
        return numbers
    },
    rgbToGrayscale(rgbArray) {
        if (!Array.isArray(rgbArray) || rgbArray.length < 3) {
            throw new Error('Input must be an array of three integers representing RGB values.')
        }
        var copiedRgbArray = rgbArray.slice()
        // 计算灰度值
        const gray = Math.round(0.299 * copiedRgbArray[0] + 0.587 * copiedRgbArray[1] + 0.114 * copiedRgbArray[2])
        // 返回包含灰度值的数组
        copiedRgbArray[0] = gray
        copiedRgbArray[1] = gray
        copiedRgbArray[2] = gray
        return copiedRgbArray
    },
    checkEdge (blockCode1, blockCode2, offsetY) {
      var blockCode
      if (blockCode1 == blockCode2) {
        blockCode = constants.BLOCK_CODE_TRANSPARENT
        return blockCode
      } else if (utilMethods.isBlockCodeWater(blockCode1) && utilMethods.isBlockCodeWater(blockCode2)) {
        if (blockCode1 == constants.BLOCK_CODE_WATER_SHALLOW || blockCode2 == constants.BLOCK_CODE_WATER_SHALLOW) {
          blockCode = constants.BLOCK_CODE_EDGE_WATER_SHALLOW_UP
          // blockCode = constants.BLOCK_CODE_WATER_SHALLOW
          // return blockCode
        } else {
          blockCode = constants.BLOCK_CODE_EDGE_WATER_MEDIUM_UP
          // blockCode = constants.BLOCK_CODE_WATER_MEDIUM
          // return blockCode
        }
        // blockCode = constants.BLOCK_CODE_TRANSPARENT
        // return blockCode
      } else if (utilMethods.isBlockCodeWater(blockCode1) || utilMethods.isBlockCodeWater(blockCode2)
        || blockCode1 == constants.BLOCK_CODE_SAND || blockCode2 == constants.BLOCK_CODE_SAND) {
          blockCode = constants.BLOCK_CODE_EDGE_SAND_UP
      } else if (blockCode1 == constants.BLOCK_CODE_DIRT || blockCode1 == constants.BLOCK_CODE_GRASS
          || blockCode1 == constants.BLOCK_CODE_SNOW || blockCode1 == constants.BLOCK_CODE_SWAMP
          || blockCode1 == constants.BLOCK_CODE_ROUGH || blockCode1 == constants.BLOCK_CODE_SUBTERRANEAN
          || blockCode1 == constants.BLOCK_CODE_LAVA
          || blockCode2 == constants.BLOCK_CODE_DIRT || blockCode2 == constants.BLOCK_CODE_GRASS
          || blockCode2 == constants.BLOCK_CODE_SNOW || blockCode2 == constants.BLOCK_CODE_SWAMP
          || blockCode2 == constants.BLOCK_CODE_ROUGH || blockCode2 == constants.BLOCK_CODE_SUBTERRANEAN
          || blockCode2 == constants.BLOCK_CODE_LAVA) {
            blockCode = constants.BLOCK_CODE_EDGE_DIRT_UP
      } else {
        blockCode = constants.BLOCK_CODE_TRANSPARENT
        return blockCode
      }
      // return blockCode + offsetY
      switch(offsetY) {
        case constants.OFFSET_Y_UPWARD:
          return blockCode
        case constants.OFFSET_Y_LEFTWARD:
          return blockCode + 1
        case constants.OFFSET_Y_RIGHTWARD:
          return blockCode + 2
        case constants.OFFSET_Y_DOWNWARD:
          return blockCode + 3
      }
    },
    isBlockCodeWater (blockCode) {
        return blockCode == constants.BLOCK_CODE_WATER_SHALLOW
        || blockCode == constants.BLOCK_CODE_WATER_MEDIUM
        || blockCode == constants.BLOCK_CODE_WATER_DEEP
    }
}
