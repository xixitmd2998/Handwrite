<template>
  <div class="draw" :style="{ width: `${width + 2}px`, height: `${height + 100}px` }">
    <draw-toolbar @change="change" @handle="handle"></draw-toolbar>
    <draw-base
      :penColor="color"
      :toolType="toolType"
      :fontSize="fontSize"
      :width="width"
      :height="height"
      :mouseImgWidth="eraserSize"
      :mouseImgHeight="eraserSize"
      :smoothingFactor="smoothingFactor"
      :loadImg="loadImg"
      ref="canvas"
    ></draw-base>
  </div>
</template>

<script>
import DrawToolbar from '@/components/draw/toolbar'
import DrawBase from '@/components/draw/base'
export default {
  name: 'Draw',
  components: {
    DrawToolbar,
    DrawBase
  },
  props: {
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 400
    },
    loadImg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      color: '#333',
      toolType: 'pen',
      fontSize: 3,
      eraserSize: 30,
      smoothingFactor: 0.17
    }
  },
  computed: {},
  watch: {},
  methods: {
    change(key, value) {
      try {
        this[key] = value
      } catch (e) {
        console.error(e)
      }
    },
    handle(event) {
      try {
        this.evil(event)
      } catch (e) {
        console.error(e)
      }
    },
    evil(fn) {
      const Fn = Function
      const ev = new Fn('return this.' + fn + '()')
      return ev.call(this)
    },
    clear() {
      this.$refs.canvas.clear()
    },
    back() {
      this.$refs.canvas.back()
    },
    getBase64Img() {
      return this.$refs.canvas.canvas.toDataURL('image/png')
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang="scss" scoped></style>
