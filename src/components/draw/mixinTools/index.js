export default {
  data() {
    return {
      isMousedown: false, // 鼠标是否按下
      isMouseover: false, // 鼠标是否进入
      startPos: null, // 鼠标按下时的起始位置
      posList: [], // 记录移动点的集合,
      curPosIndex: 0, // 记录posList的当前指向
      pathId: null // 当前路径id
    }
  },
  props: {
    toolType: {
      type: String,
      default: 'pen'
    }
  },
  watch: {
    toolType: {
      handler(val) {
        switch (val) {
          case 'eraser':
            this.openMouseImg = true
            break
          default:
            this.openMouseImg = false
        }
      }
    },
    isMousedown: {
      handler(newVal, oldVal) {
        if ((newVal === false, oldVal === true)) {
          this.savePath()
        }
      }
    }
  },
  methods: {
    // 初始化记录点
    initPos(startX, startY) {
      for (const item of this.history) {
        item.state = 'complete'
      }
      this.pathId = 'path' + Date.now()
      this.posList = []
      this.startPos = { x: startX, y: startY, timeStamp: Date.now() }
      this.curPosIndex = 0
    },
    // 存储当前path到history
    savePath() {
      const data = this.ctx.getImageData(0, 0, this.width, this.height)
      for (const item of this.history) {
        if (item.id === this.pathId) {
          item.data = data
          return
        }
      }
      this.history.push({
        id: this.pathId,
        data,
        state: 'pending'
      })
    },
    // 鼠标移动绘制canvas
    draw() {
      try {
        switch (this.toolType) {
          case 'pen':
            this.drawLine()
            break
          case 'eraser':
            this.erasePath()
            break
        }
      } catch (e) {
        console.error('找不到对应的工具')
      }
    },
    // 边界处理
    overBorder() {
      try {
        switch (this.toolType) {
          case 'pen':
            this.drawLine('line')
            break
        }
      } catch (e) {
        console.error('找不到对应的工具')
      }
    },
    // 计算两点间距离
    distance(p1, p2) {
      const x = p2.x - p1.x
      const y = p2.y - p1.y
      return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
    },
    // 计算两点间的中点
    centerPos(p1, p2) {
      return { x: ~~((p1.x + p2.x) / 2), y: ~~((p1.y + p2.y) / 2) }
    }
  },
  mounted() {
    // 鼠标按下
    this.$refs.canvas.onmousedown = (e) => {
      this.isMousedown = true
      this.initPos(e.offsetX, e.offsetY)
    }
    // 鼠标移动
    this.$refs.canvas.onmousemove = (e) => {
      if (this.isMousedown && this.isMouseover) {
        this.posList.push({
          x: ~~e.offsetX,
          y: ~~e.offsetY,
          timeStamp: Date.now()
        })
        this.draw()
      }
    }
    // 鼠标抬起
    window.addEventListener('mouseup', () => {
      this.isMousedown = false
    })
    // 鼠标进入
    this.$refs.canvas.onmouseover = (e) => {
      this.isMouseover = true
      this.initPos(e.offsetX, e.offsetY)
    }
    // 鼠标离开
    this.$refs.canvas.onmouseleave = (e) => {
      if (this.isMousedown && this.posList[this.posList.length - 1]) {
        const pos = this.posList[this.posList.length - 1] // 离开前的点
        const epos = { x: e.offsetX, y: e.offsetY } // 离开后的点
        const slope = (epos.y - pos.y) / (epos.x - pos.x)
        let addPos = {}
        if (epos.y < 0) {
          // 超过上边界
          const x = epos.x - epos.y / slope
          if (x <= this.width && x >= 0) {
            addPos = { x, y: 0 }
          }
        } else if (epos.y > this.height) {
          // 超过下边界
          const x = epos.x - (epos.y - this.height) / slope
          if (x <= this.width && x >= 0) {
            addPos = { x, y: this.height }
          }
        }
        if (epos.x < 0) {
          // 超过左边界
          const y = epos.y - epos.x * slope
          if (y <= this.height && y >= 0) {
            addPos = { x: 0, y }
          }
        } else if (epos.x > this.width) {
          // 超过右边界
          const y = epos.y - (epos.x - this.width) * slope
          if (y <= this.height && y >= 0) {
            addPos = { x: this.width, y }
          }
        }
        if (addPos.x || addPos.y) {
          this.posList.push({
            ...addPos,
            timeStamp: Date.now()
          })
          this.overBorder()
        }
      }
      this.isMouseover = false
    }
  }
}
