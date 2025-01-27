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
            case constants.BLOCK_TYPE_EFFECT_REAL:
                return false
            default:
                return true
    }
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
    }
}
