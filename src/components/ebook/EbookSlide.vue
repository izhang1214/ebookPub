<template>
  <transition name="fade">
    <div
      class="slide-content-wrapper"
      v-show="menuVisible && settingVisible === 3"
    >
      <transition name="slide-right">
        <div class="content" v-if="settingVisible === 3">
          <!-- 当图书加载完成，显示菜单栏 -->
          <div class="content-page-wrapper" v-if="ebookAvailable">
            <div class="content-page">
              <!-- 这里通过 <component :is属性实现组件的动态切换>  currentTable为1加载content组件，否则加载bookmark组件 -->
              <component
                :is="currentTable === 1 ? content : bookmark"
              ></component>
            </div>
            <div class="content-page-table">
              <div
                class="content-item"
                :class="{ selected: currentTable === 1 }"
                @click="selectTable(1)"
              >
                {{ $t("book.navigation") }}
              </div>
              <div
                class="content-item"
                :class="{ selected: currentTable === 2 }"
                @click="selectTable(2)"
              >
                {{ $t("book.bookmark") }}
              </div>
            </div>
          </div>
          <!-- 否则显示这个  加载中的 -->
          <div class="content-empty">
            <EbookLoading></EbookLoading>
          </div>
        </div>
      </transition>
      <div class="content-bg" @click="hideSlide"></div>
    </div>
  </transition>
</template>

<script>
import ebookMixin from "@/utils/mixin.js";
import EbookSlideContent from "./EbookSlideContent";
import EbookSlideBookmark from "./EbookSlideBookmark";
import EbookLoading from "./EbookLoading";

export default {
  mixins: [ebookMixin],
  components: {
    EbookLoading,
  },
  data() {
    return {
      currentTable: 1,
      content: EbookSlideContent, //直接将组件赋值给变量，即可访问
      bookmark: EbookSlideBookmark,
    };
  },
  methods: {
    // ...mapActions(["SetMenuVisible", "SettingVisible", "FontFamilyVisible"]),
    // hideSlide() {
    //   this.SetMenuVisible(false);
    //   this.SettingVisible(-1);
    //   this.FontFamilyVisible(false);
    // },
    // 底部tab切换
    selectTable(current) {
      this.currentTable = current;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.slide-content-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 300;
  width: 100%;
  height: 100%;
  display: flex;
  .content {
    flex: 0 0 85%;
    width: 85%;
    height: 100%;
    .content-page-wrapper {
      display: flex;
      flex-direction: column; //垂直布局
      width: 100%;
      height: 100%;
      .content-page {
        flex: 1;
        width: 100%;
        overflow: hidden;
      }
      .content-page-table {
        flex: 0 0 px2rem(48);
        width: 100%;
        height: px2rem(48);
        display: flex;
        border-top: 1px solid #cccccc;
        .content-item {
          flex: 1;
          @include center;
          font-size: px2rem(12);
        }
        .selected {
          font-weight: bold;
          color: #fff;
        }
      }
    }
    .content-empty {
      width: 100%;
      height: 100%;
      @include center;
    }
  }
  .content-bg {
    flex: 0 0 15%;
    width: 15%;
    height: 100%;
  }
}
</style>