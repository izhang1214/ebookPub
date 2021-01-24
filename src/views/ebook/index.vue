<template>
  <div class="ebook" ref="ebook">
    <EbookTitle />
    <EbookReader />
    <EbookMenu />
    <EbookBookmark />
  </div>
</template>

<script>
import EbookReader from "../../components/ebook/EbookReader.vue";
import EbookTitle from "../../components/ebook/EbookTitle.vue";
import EbookMenu from "../../components/ebook/EbookMenu.vue";
import EbookBookmark from "../../components/ebook/EbookBookmark";
import { getReadTime, saveReadTime } from "../../utils/localStorage";
import ebookMixin from "@/utils/mixin.js";
export default {
  mixins: [ebookMixin], //将混入的内容，通过 mixins放入到组件中
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
  },
  watch: {
    // 监听offsetY的变化
    offsetY(newValue) {
      // 判断，如果菜单栏显示的时候，书签就禁止下拉
      if (!this.menuVisible && this.ebookAvailable) {
        if (newValue > 0) {
          this.move(newValue);
        } else if (newValue === 0) {
          this.restore(newValue);
        }
      }
    },
  },
  methods: {
    move(v) {
      this.$refs.ebook.style.top = v + "px";
    },
    restore(v) {
      this.$refs.ebook.style.top = v + "px";
      this.$refs.ebook.style.transition = "all .2s linear";
      // 等动画执行完成之后，清空动画效果,解决动画卡顿现象
      setTimeout(() => {
        this.$refs.ebook.style.transition = "";
      }, 200);
    },
    // 计算电子书的阅读时间
    startLoopReadTime() {
      let readTime = getReadTime(this.fileName);
      if (!readTime) {
        readTime = 0; //如果阅读时间不存在，说明是第一次进入，初始化为0
      }
      this.task = setInterval(() => {
        readTime++;
        //如果readTime是30的倍数，也就是 每半分钟 存入缓存一次
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime);
        }
      }, 1000);
    },
  },
  mounted() {
    this.startLoopReadTime();
  },
  beforeDestroy() {
    if (this.task) {
      clearInterval(this.task);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.ebook {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>