export default {
  data() {
    return {}
  },
  methods: {
    // 擦除路径
    erasePath() {
      if (this.posList.length > 1 && this.curPosIndex > 0) {
        const curPos = this.posList[this.curPosIndex]
        const lastPos = this.posList[this.curPosIndex - 1]
        const posArr = this.generateLinePos(curPos, lastPos)
        posArr.forEach((item) => {
          this.eraseRect(item)
        })
      } else {
        this.eraseRect(this.posList[this.curPosIndex])
      }
      this.curPosIndex++
    },
    // 生成两点之间线段上的一系列点
    generateLinePos(lastPos, nextPos) {
      const arr = [lastPos, nextPos]
      let d
      do {
        d = this.distance(arr[0], arr[1])
        for (let i = 0; i < arr.length - 1; i += 2) {
          const cPos = this.centerPos(arr[i], arr[i + 1])
          arr.splice(i + 1, 0, cPos)
        }
      } while (d > Math.min(this.mouseImgWidth, this.mouseImgHeight) / 2)
      return arr
    },
    // 擦除一个矩形
    eraseRect(pos) {
      const MouseW = this.mouseImgWidth
      const MouseH = this.mouseImgHeight
      const x = pos.x - MouseW / 2
      const y = pos.y - MouseH / 2
      this.ctx.drawImage(
        this.offscreenCanvas,
        x,
        y,
        this.mouseImgWidth,
        this.mouseImgHeight,
        x,
        y,
        this.mouseImgWidth,
        this.mouseImgHeight
      )
    }
  }
}
