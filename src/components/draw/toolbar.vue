<template>
  <div class="drawtoolbar">
    <el-radio-group size="small" v-model="toolType" @change="switchTool" class="tooltype">
      <el-radio-button label="pen">钢笔</el-radio-button>
      <el-radio-button label="eraser">橡皮擦</el-radio-button>
    </el-radio-group>
    <el-select
      size="small"
      v-model="fontSize"
      @change="switchFontSize"
      v-if="toolType==='pen'"
      placeholder="线条粗细"
      class="selectsize"
    >
      <el-option
        v-for="item in fontSizeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select
      size="small"
      v-model="eraserSize"
      @change="switchEraserSize"
      v-else-if="toolType==='eraser'"
      placeholder="橡皮擦大小"
      class="selectsize"
    >
      <el-option
        v-for="item in eraserSizeOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-dropdown trigger="click" placement="bottom">
      <el-button size="small" class="dropdown">
        平滑度
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <div class="smoothing-block">
          <span class="smoothing-label">笔迹平滑</span>
          <el-slider
            class="smoothing-slider"
            v-model="smoothing"
            :min="10"
            :max="100"
            @change="changeSmoothingFactor"
            :format-tooltip="formatTooltip"
          ></el-slider>
          <span class="smoothing-label">书写流畅</span>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="colorbox">
      <div
        class="color"
        :class="{active:color === item}"
        v-for="item in colorList"
        :key="item"
        @click="switchColor(item)"
      >
        <div class="inner-color" :style="{'background-color':item}"></div>
      </div>
    </div>
    <el-popconfirm title="确定清除当次全部内容吗？" @onConfirm="handle('clear','清空')">
      <el-button size="small" class="clear" slot="reference">清空</el-button>
    </el-popconfirm>
    <el-button size="small" class="back" @click="handle('back','撤销')">撤销</el-button>
  </div>
</template>

<script>
export default {
  name: 'DrawToolbar',
  components: {},
  data() {
    return {
      toolType: 'pen',
      color: 'black',
      smoothing: 17,
      fontSize: 3,
      fontSizeOptions: [
        { label: '粗', value: 5 },
        { label: '略粗', value: 4 },
        { label: '中', value: 3 },
        { label: '略细', value: 2 },
        { label: '细', value: 1 }
      ],
      eraserSize: 30,
      eraserSizeOptions: [
        { label: '大', value: 50 },
        { label: '略大', value: 40 },
        { label: '中', value: 30 },
        { label: '略小', value: 20 },
        { label: '小', value: 10 }
      ],
      colorList: [
        'black',
        'grey',
        'red',
        'pink',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple'
      ]
    }
  },
  computed: {},
  watch: {},
  methods: {
    switchTool() {
      this.$emit('change', 'toolType', this.toolType)
    },
    switchFontSize() {
      this.$emit('change', 'fontSize', this.fontSize)
    },
    switchEraserSize() {
      this.$emit('change', 'eraserSize', this.eraserSize)
    },
    changeSmoothingFactor() {
      this.$emit('change', 'smoothingFactor', this.smoothing / 100)
    },
    switchColor(color) {
      this.color = color
      this.$emit('change', 'color', this.color)
    },
    handle(event) {
      this.$emit('handle', event)
    },
    formatTooltip(val) {
      return val + '%'
    }
  },
  created() {},
  mounted() {}
}
</script>
<style lang='scss' scoped>
.drawtoolbar {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.selectsize,
.dropdown {
  margin-right: 20px;
}
.tooltype,
.colorbox,
.back,
.clear {
  margin-right: 10px;
}
.selectsize {
  width: 88px;
}
.colorbox .color {
  border: 1px solid #ccc;
  padding: 1px;
  height: 25px;
  width: 25px;
  display: inline-block;
  box-sizing: content-box;
  margin-right: 5px;
  cursor: pointer;
}
.colorbox .color .inner-color {
  width: 100%;
  height: 100%;
}
.colorbox .color.active {
  border: 1px solid #409eff;
  height: 28px;
  width: 28px;
}
.smoothing-block {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 500px;
  .smoothing-label {
    width: 100px;
    font-size: 14px;
    color: #333;
    text-align: center;
  }
  .smoothing-slider {
    flex: 1;
  }
}
</style>
