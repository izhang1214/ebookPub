<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{ getReadTimeText() }}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper">
            <span class="icon-back" @click="prevSection()"></span>
          </div>
          <input
            class="progress"
            type="range"
            max="100"
            min="0"
            step="1"
            @change="onProgressChange($event.target.value)"
            @input="onProgressInput($event.target.value)"
            :value="ebookprogress"
            :disabled="!ebookAvailable"
            ref="ebookprogress"
          />
          <div class="progress-icon-wrapper">
            <span class="icon-forward" @click="nextSection()"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{ getSectionName }}</span>
          <span
            >({{ ebookAvailable ? ebookprogress + "%" : "加载中..." }})</span
          >
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ebookMixin from "@/utils/mixin.js";
import { mapActions } from "vuex";
import {
  getLocation,
  getReadTime,
  saveLocation,
} from "../../utils/localStorage";
export default {
  mixins: [ebookMixin],
  computed: {
    // 获取当前章节的名称
    getSectionName() {
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section);
      //   if (sectionInfo && sectionInfo.href) {
      //     return this.currentBook.navigation.get(sectionInfo.href).label;
      //   }
      // }
      return this.section ? this.navigation[this.section].label : "";
    },
  },
  methods: {
    ...mapActions(["SetProgress", "SetSection"]),
    onProgressChange(value) {
      this.SetProgress(value).then(() => {
        this.displayProgress();
        this.updateProgressBg();
      });
    },
    onProgressInput(value) {
      this.SetProgress(value).then(() => {
        this.displayProgress();
        this.updateProgressBg();
      });
    },
    // 用来展示当前进度  所展示的页面
    displayProgress() {
      // 获取电子书的location, 通过cfiFromPercentage 百分比获取进度
      const cfi = this.currentBook.locations.cfiFromPercentage(
        this.ebookprogress / 100
      ); //作为小数，就可以获取到cfi
      // 通过 ebook的rendition对象，来渲染电子书
      // this.currentBook.rendition.display(cfi).then(() => {
      //   this.refreshLocation(); //章节切换 和 进度条同步,并存入缓存
      // });
      this.display(cfi);
    },
    // 拖动的时候改变 已读内容的进度条背景
    updateProgressBg() {
      // 获取进度条 dom
      this.$refs.ebookprogress.style.backgroundSize = `${this.ebookprogress}% 100%`;
    },
    prevSection() {
      // 判断 章节section>0  并且  进度条可拖动
      if (this.section > 0 && this.ebookAvailable) {
        // 将新的值传给vuex  -1就是返回上一章节
        this.SetSection(this.section - 1).then(() => {
          this.changeSection();
        });
      }
    },
    nextSection() {
      // console.log(this.currentBook.spine);  spine表示当前电子书一共有多少章节
      if (
        this.section < this.currentBook.spine.length - 1 &&
        this.ebookAvailable
      ) {
        this.SetSection(this.section + 1).then(() => {
          this.changeSection();
        });
      }
    },

    // 上一章 和 下一章 渲染
    changeSection() {
      const sectionInfo = this.currentBook.section(this.section);
      if (sectionInfo && sectionInfo.href) {
        this.display(sectionInfo.href);
        // this.currentBook.rendition.display(sectionInfo.href).then(() => {
        //   this.refreshLocation();
        // });
      }
    },
    //阅读时间  集成到了mixins中
    // getReadTimeText() {
    //   return this.$t("book.haveRead").replace("$1", this.getReadTime());
    // },
    // getReadTime() {
    //   const readTime = getReadTime(this.fileName);
    //   if (!readTime) {
    //     return 0;
    //   } else {
    //     return Math.ceil(readTime / 60);
    //   }
    // },
  },
  // 解决进度条初始状态
  updated() {
    this.updateProgressBg();
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.setting-wrapper {
  position: absolute;
  bottom: px2rem(48);
  left: 0;
  z-index: 101;
  width: 100%;
  height: px2rem(90);
  background: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
  .progress-icon-wrapper {
    font-size: px2rem(16);
  }
  .setting-progress {
    position: relative;
    width: 100%;
    height: 100%;
    .read-time-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: px2rem(40);
      font-size: px2rem(12);
      @include center;
    }
    .progress-wrapper {
      width: 100%;
      height: 100%;
      @include center;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .progress {
        width: 100%;
        -webkit-appearance: none;
        height: px2rem(2);
        margin: 0 px2rem(15);
        // background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
        // background-size: 0 100%;
        &:focus {
          outline: none;
        }
        &::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: px2rem(20);
          width: px2rem(20);
          border-radius: 50%;
          background: white;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.15);
          border: px2rem(1) solid #ddd;
        }
      }
    }
    .text-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(10);
      width: 100%;
      color: #333;
      font-size: px2rem(12);
      text-align: center;
      padding: 0 px2rem(15);
      @include center;
      .progress-section-text {
        @include ellipsis;
      }
    }
  }
}
</style>