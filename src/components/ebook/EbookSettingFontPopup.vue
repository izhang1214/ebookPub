<template>
  <transition name="popup-slide-up">
    <div class="ebook-popue-list" v-show="fontFamilyVisible">
      <div class="ebook-title">
        <div class="ebook-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <!-- $t 选中国际化字体设置 book.selectFont 是cn.js中的-->
        <span class="ebook-popue-text">{{ $t("book.selectFont") }}</span>
      </div>
      <div class="ebook-list-wrapper">
        <div
          class="ebook-item"
          v-for="(item, index) in fontFamilyList"
          :key="index"
        >
          <div
            class="ebool-item-text"
            :class="{ selected: isSelected(item) }"
            @click="setFontFamily(item)"
          >
            {{ item.font }}
          </div>
          <div class="ebook-item-check">
            <span class="icon-check" v-if="isSelected(item)"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import ebookMixin from "@/utils/mixin.js";
import { saveFontFamily } from "../../utils/localStorage";
import { mapActions } from "vuex";
export default {
  mixins: [ebookMixin],
  data() {
    return {
      fontFamilyList: [
        { font: "Default" },
        { font: "Cabin" },
        { font: "Days One" },
        { font: "Montserrat" },
        { font: "Tangerine" },
      ],
    };
  },
  methods: {
    ...mapActions(["SettingFontFamily", "FontFamilyVisible"]),
    hide() {
      this.$store.dispatch("FontFamilyVisible", false);
    },
    isSelected(item) {
      return this.defaultFontFamily == item.font;
    },
    setFontFamily({ font }) {
      this.SettingFontFamily(font);
      this.FontFamilyVisible(false);
      if (font == "Default") {
        //设置默认字体
        this.currentBook.rendition.themes.font("Times New Roman");
      } else {
        //调用 eboook对象下的font方法设置字体，因为ebook是通过iframe注入到页面的，因此需要找到iframe下的html也就是电子书的dom元素，注入字体，方能生效。
        this.currentBook.rendition.themes.font(font);
      }
      saveFontFamily(this.fileName, font);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.ebook-popue-list {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  background: white;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0, 0, 0, 0.1);
  .ebook-title {
    position: relative;
    padding: px2rem(15);
    box-sizing: border-box;
    border-bottom: px2rem(2) solid #b8b9bb;
    text-align: center;
    @include center;
    .ebook-title-icon {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: 100%;
      font-size: px2rem(16);
      font-weight: bold;
      @include center;
    }
    .ebook-popue-text {
      font-weight: bold;
      font-size: px2rem(14);
    }
  }
  .ebook-list-wrapper {
    .ebook-item {
      display: flex;
      padding: px2rem(15);
      .ebool-item-text {
        flex: 1;
        font-size: px2rem(14);
        text-align: left;
        &.selected {
          color: #346cb9;
          font-weight: bold;
        }
      }
      .ebook-item-check {
        flex: 1;
        text-align: right;
        font-size: px2rem(14);
        font-weight: bold;
        color: #346cb9;
      }
    }
  }
}
</style>