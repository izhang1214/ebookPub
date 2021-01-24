<template>
  <div class="ebook-loading">
    <div class="ebook-loading-wrapper">
      <div
        class="ebook-loading-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <div
          class="ebook-loading-line-wrapper"
          v-for="(subItem, subIndex) in item"
          :key="subIndex"
        >
          <div class="ebook-loading-line" ref="line"></div>
          <div class="ebook-loading-mark" ref="mark"></div>
        </div>
      </div>
      <div class="ebook-loading-center"></div>
    </div>
  </div>
</template>

<script>
import { px2rem } from "../../utils/utils";
export default {
  data() {
    return {
      data: [
        [{}, {}, {}],
        [{}, {}, {}],
      ],
      markWidth: [
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
        { value: 0 },
      ],
      lineWidth: [
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
        { value: 16 },
      ],
      add: true, //表示需要添加 动画的线条
      end: false, //表示不需要添加，动画线条已经走到头了
    };
  },
  mounted() {
    // 动画效果
    this.task = setInterval(() => {
      this.$refs.mark.forEach((item, index) => {
        const mark = this.$refs.mark[index];
        const line = this.$refs.line[index];
        let markWidth = this.markWidth[index]; //获取mark宽度
        let lineWidth = this.lineWidth[index]; //获取line宽度

        if (index === 0) {
          if (this.add && markWidth.value < 16) {
            markWidth.value++;
            lineWidth.value--;
          } else if (!this.add && lineWidth.value < 16) {
            markWidth.value--;
            lineWidth.value++;
          }
        } else {
          if (this.add && markWidth.value < 16) {
            let preMarkWidth = this.markWidth[index - 1];
            if (preMarkWidth.value >= 8) {
              markWidth.value++;
              lineWidth.value--;
            }
          } else if (!this.add && lineWidth.value < 16) {
            let preLineWidth = this.lineWidth[index - 1];
            if (preLineWidth.value >= 8) {
              markWidth.value--;
              lineWidth.value++;
            }
          }
        }

        mark.style.width = `${px2rem(markWidth.value)}rem`;
        mark.style.flex = ` 0 0 ${px2rem(markWidth.value)}rem`;
        line.style.width = `${px2rem(lineWidth.value)}rem`;
        line.style.flex = ` 0 0 ${px2rem(lineWidth.value)}rem`;

        if (index === this.markWidth.length - 1) {
          //如果当前是最后一个
          if (this.add) {
            if (markWidth.value === 16) {
              this.end = true;
            }
          } else {
            if (markWidth.value === 0) {
              this.end = true;
            }
          }
        }
        if (this.end) {
          this.add = !this.add;
          this.end = false;
        }
      });
    }, 20);
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.ebook-loading {
  position: relative;
  z-index: 400;
  width: px2rem(63);
  height: px2rem(40);
  background: transparent;
  border: px2rem(1.5) solid #d7d7d7;
  border-radius: px2rem(3);
  .ebook-loading-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    .ebook-loading-item {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: px2rem(7) 0;
      box-sizing: border-box;
      .ebook-loading-line-wrapper {
        flex: 1;
        padding: 0 px2rem(7);
        box-sizing: border-box;
        @include left;
        .ebook-loading-line {
          flex: 0 0 px2rem(16);
          height: px2rem(2);
          background: #d7d7d7;
        }
        .ebook-loading-mark {
          flex: 0 0 0;
          width: 0;
          height: px2rem(2);
        }
      }
    }
    .ebook-loading-center {
      //竖线部分
      position: absolute;
      left: 50%;
      top: 0;
      width: px2rem(1.5);
      height: 100%;
      background: #d7d7d7;
    }
  }
}
</style>