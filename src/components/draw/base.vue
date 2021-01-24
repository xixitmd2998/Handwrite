<template>
  <div class="drawbase">
    <canvas class="canvas" ref="canvas" :width="width" :height="height"></canvas>
    <div
      class="mouse-img"
      ref="mouseImg"
      :style="{
        width: mouseImgWidth + 'px',
        height: mouseImgHeight + 'px',
        left: -mouseImgWidth + 'px',
        top: -mouseImgHeight + 'px',
        ...mouseImgStyle
      }"
    ></div>
  </div>
</template>

<script>
import mixinTools from './mixinTools/index'
import pen from './mixinTools/pen'
import eraser from './mixinTools/eraser'
export default {
  name: 'DrawBase',
  components: {},
  mixins: [mixinTools, pen, eraser],
  props: {
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 400
    },
    mouseImgWidth: {
      type: Number,
      default: 20
    },
    mouseImgHeight: {
      type: Number,
      default: 20
    },
    loadImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      mouseImgEl: null, // 鼠标移动时跟随的dom
      mouseImgStyle: {},
      openMouseImg: false, // 是否开启鼠标跟随dom
      canvas: null,
      ctx: null, // canvas上下文
      offscreenCanvas: null, // 离屏canvas
      offscreenCtx: null, // 离屏canvas上下文
      history: [], // 记录历史路径
      img: new Image(this.width, this.height)
    }
  },
  computed: {},
  watch: {
    openMouseImg: {
      handler(val) {
        if (val) {
          this.bindmove()
        } else {
          this.unbindmove()
        }
      }
    }
  },
  methods: {
    // 设置canvas样式
    setStyle(ctx) {
      ctx.strokeStyle = 'black'
      ctx.fillStyle = 'white'
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
    },
    // 初始化离屏canvas
    initCopyCanvas() {
      this.offscreenCanvas = document.createElement('canvas')
      this.offscreenCanvas.width = this.width
      this.offscreenCanvas.height = this.height
      this.offscreenCtx = this.offscreenCanvas.getContext('2d')
    },
    // canvas上渲染图片
    renderImg() {
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.ctx.drawImage(this.img, 0, 0)
      this.offscreenCtx.fillRect(0, 0, this.width, this.height)
      this.offscreenCtx.drawImage(this.img, 0, 0)
    },
    // 清空
    clear() {
      this.ctx.drawImage(this.offscreenCanvas, 0, 0)
      this.history = []
    },
    // 撤销
    back() {
      let his
      do {
        his = this.history.pop()
      } while (his && his.state !== 'complete')
      if (!his) {
        his = {
          data: this.offscreenCtx.getImageData(0, 0, this.width, this.height)
        }
      }
      this.ctx.putImageData(his.data, 0, 0)
    },
    // 绑定鼠标dom跟随
    bindmove() {
      this.$el.onmousemove = (e) => {
        const halfMouseW = this.mouseImgWidth / 2
        const halfMouseH = this.mouseImgHeight / 2
        this.mouseImgEl.style.left = e.offsetX - halfMouseW + 'px'
        this.mouseImgEl.style.top = e.offsetY - halfMouseH + 'px'
      }
    },
    // 解绑鼠标dom
    unbindmove() {
      this.$el.onmousemove = null
      this.mouseImgEl.style.left = -this.mouseImgWidth + 'px'
      this.mouseImgEl.style.top = -this.mouseImgHeight + 'px'
    }
  },
  created() {},
  mounted() {
    this.mouseImgEl = this.$refs.mouseImg
    this.canvas = this.$refs.canvas
    this.ctx = this.$refs.canvas.getContext('2d')
    this.setStyle(this.ctx)
    this.initCopyCanvas()
    this.setStyle(this.offscreenCtx)
    // this.img.src = require('@/assets/images/component_bg1.png')
    // this.img.onload = () => {
    this.renderImg()
    // }
    if (this.loadImg && this.loadImg.length > 0) {
      const img = new Image()
      img.src = this.loadImg
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.drawbase {
  position: relative;
  overflow: hidden;
  display: inline-block;
  font-size: 0;
}
.canvas {
  border: 1px dashed #ccc;
}
.mouse-img {
  position: absolute;
  background-color: #fff;
  border: 1px solid #333;
  // mouse-img不参与鼠标事件
  pointer-events: none;
}
</style>
