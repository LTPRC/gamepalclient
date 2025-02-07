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
            case constants.BLOCK_TYPE_CEILING:
            case constants.BLOCK_TYPE_CEILING_DECORATION:
            case constants.BLOCK_TYPE_PLASMA:
                return false
            default:
                return true
        }
    },
    convertFaceCoefsToCoefs (faceCoefs) {
        var coefs = []
        coefs[0] = 0.3 + (faceCoefs[0] / 100 - 0.5) * 0.1
        coefs[1] = 0.1 + (faceCoefs[1] / 100 - 0.5) * 0.1
        coefs[2] = 0.6 + (faceCoefs[2] / 100 - 0.5) * 0.2
        coefs[3] = 0.5 + (faceCoefs[3] / 100 - 0.5) * 0.5
        coefs[4] = 0.1 + (faceCoefs[4] / 100 - 0.5) * 0.1
        coefs[5] = 0.6 + (faceCoefs[5] / 100 - 0.5) * 0.1
        coefs[6] = 0.1 + (faceCoefs[6] / 100 - 0.5) * 0.1
        coefs[7] = 0.08 + (faceCoefs[7] / 100 - 0.5) * 0.3
        coefs[8] = 0.08 + (faceCoefs[8] / 100 - 0.5) * 0.02
        coefs[9] = 0.55 + (faceCoefs[9] / 100 - 0.5) * 0.05
        coefs[10] = 1 + (faceCoefs[10] / 100 - 0.5) * 0.2
        coefs[11] = 1 + (faceCoefs[11] / 100 - 0.5) * 0.2
        coefs[12] = 1.3 + (faceCoefs[12] / 100 - 0.5) * 0.3
        coefs[13] = 0.18 + (faceCoefs[13] / 100 - 0.5) * 0.04
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
    hexToRgb (hex) {
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
        return [r, g, b, 1]
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
    }
}
