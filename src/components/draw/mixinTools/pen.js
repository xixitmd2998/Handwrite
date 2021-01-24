export default {
  data() {
    return {
      lastLineWidth: -1
    }
  },
  props: {
    penColor: {
      type: String,
      default: 'black'
    },
    fontSize: {
      type: Number,
      default: 1
    },
    smoothingFactor: {
      type: Number,
      default: 0.17
    }
  },
  watch: {
    penColor: {
      handler() {
        this.ctx.strokeStyle = this.penColor
      }
    }
  },
  methods: {
    // 绘制路径
    drawLine(type = 'curve') {
      this.ctx.beginPath()
      let result = true
      do {
        if (type === 'line') {
          result = this.genarateLine(this.ctx)
        } else {
          result = this.genarateCurve(this.ctx)
        }
      } while (result)
    },
    // 三点用二次贝塞尔曲线
    genarateCurve(path2d) {
      try {
        if (this.posList.length > this.curPosIndex + 2) {
          // 起点
          const startPos = this.posList[this.curPosIndex]
          // 修正控制点
          const controlPos = this.posList[this.curPosIndex + 1]
          const amendControlPos = {
            ...this.amendPosition(startPos, controlPos),
            timeStamp: controlPos.timeStamp
          }
          // 终点
          const thirdPos = this.posList[this.curPosIndex + 2]
          const amendThirdPos = {
            ...this.amendPosition(amendControlPos, thirdPos),
            timeStamp: thirdPos.timeStamp
          }
          const endPos = {
            ...this.centerPos(amendControlPos, amendThirdPos),
            timeStamp: amendThirdPos.timeStamp
          }
          this.posList[this.curPosIndex + 2] = endPos
          // 设置样式
          this.setLineWidth(startPos, endPos)
          // 绘制二次贝塞尔曲线
          path2d.moveTo(startPos.x, startPos.y)
          path2d.quadraticCurveTo(amendControlPos.x, amendControlPos.y, endPos.x, endPos.y)
          path2d.stroke()
          path2d.closePath()
          this.curPosIndex += 2
          return true
        }
        return false
      } catch (e) {
        return false
      }
    },
    // 两点直接连接
    genarateLine(path2d) {
      try {
        if (this.posList.length > this.curPosIndex + 1) {
          // 起点
          const startPos = this.posList[this.curPosIndex]
          // 终点
          const endPos = this.posList[this.curPosIndex + 1]
          // 设置样式
          this.setLineWidth(startPos, endPos)
          // 绘制二次贝塞尔曲线
          path2d.moveTo(startPos.x, startPos.y)
          path2d.lineTo(endPos.x, endPos.y)
          path2d.stroke()
          path2d.closePath()
          this.curPosIndex++
          return true
        }
        return false
      } catch (e) {
        return false
      }
    },
    // 修正位置
    amendPosition(lastPos, pos) {
      if (!lastPos) {
        return pos
      } else {
        const amendPos = {}
        const distance = this.distance(lastPos, pos)
        var smoothingFactor = Math.min(
          this.smoothingFactor,
          this.smoothingFactor - 0.02 + (distance - 60) / 3000
        )
        amendPos.x = ~~(lastPos.x - (lastPos.x - pos.x) * smoothingFactor)
        amendPos.y = ~~(lastPos.y - (lastPos.y - pos.y) * smoothingFactor)
        return amendPos
      }
    },
    // 根据速度设置线条粗细
    setLineWidth(lastPos, nextPos) {
      if (this.lastLineWidth === -1 || isNaN(this.lastLineWidth)) {
        this.lastLineWidth = this.ctx.lineWidth
      }
      const distance = this.distance(lastPos, nextPos)
      const speed = Math.round(distance / (nextPos.timeStamp - lastPos.timeStamp))
      let resultLineWidth
      if (speed <= 0.01) resultLineWidth = this.fontSize * 2
      else if (speed >= 1) resultLineWidth = this.fontSize / 2
      else {
        resultLineWidth =
          10 - ((speed - 0.01) / (1 - 0.01)) * (this.fontSize * 2 - this.fontSize / 2)
      }
      this.ctx.lineWidth = this.lastLineWidth =
        resultLineWidth * (1 / 3) + this.ctx.lineWidth * (2 / 3)
    }
  }
}
