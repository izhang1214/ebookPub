<template>
  <!-- 书签组件，其他地方也会用到，因此设为公共组件 -->
  <div class="book-mark" :style="style" ref="bookmark"></div>
</template>

<script>
import { px2rem } from "../../utils/utils";
export default {
  props: {
    width: Number,
    height: Number,
    color: String,
  },
  computed: {
    //   书签颜色，通过计算属性实现
    style() {
      if (this.color) {
        //父组件传color，取父组件color
        return {
          borderColor: `${this.color} ${this.color} transparent ${this.color}`,
        };
      } else {
        //否则 取默认值为空，就不会替换默认样式
        return {};
      }
    },
  },
  methods: {
    refresh() {
      if (this.width && this.height) {
        this.$refs.bookmark.style.borderWidth = `${px2rem(this.height - 5)}rem ${px2rem(this.width / 2)}rem ${px2rem(5)}rem ${px2rem(this.width / 2)}rem`;
      }
    },
  },
  mounted() {
    this.refresh();
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.book-mark {
  width: 0;
  height: 0;
  border-width: px2rem(50) px2rem(8) px2rem(8) px2rem(8);
  border-style: solid;
  border-color: white white transparent white;
}
</style>