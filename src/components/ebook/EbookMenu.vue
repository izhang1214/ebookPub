<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div
        class="menu-wrapper"
        :class="{ 'hide-box-shadow': !menuVisible || settingVisible >= 0 }"
        v-show="menuVisible"
      >
        <div class="icon-wrapper">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <EbookSettingFont />
    <EbookSettingFontPopup />
    <EbookSettingTheme />
    <EbookSettingProgress />
    <EbookSlide />
  </div>
</template>

<script>
import EbookSettingFont from "@/components/ebook/ebookSettingFont.vue";
import EbookSettingFontPopup from "@/components/ebook/EbookSettingFontPopup.vue";
import EbookSettingTheme from "@/components/ebook/EbookSettingTheme.vue";
import EbookSettingProgress from "@/components/ebook/EbookSettingProgress.vue";
import EbookSlide from "@/components/ebook/EbookSlide.vue";
//这里由于 mapGetters 在多个vue组件中使用，所以我们可以通过vue的mixin混合机制完成
import { mapGetters, mapActions } from "vuex";
import ebookMixin from "@/utils/mixin.js";
export default {
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide,
  },
  mixins: [ebookMixin],
  // computed: {
  //     ...mapGetters(['menuVisible'])
  // },
  methods: {
    ...mapActions(["SettingVisible"]),
    showSetting(key) {
      this.SettingVisible(key);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.menu-bar {
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 102;
    display: flex;
    width: 100%;
    height: px2rem(48);
    font-size: px2rem(28);
    background: white;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, 0.15);
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress,
      .icon-menu,
      .icon-bright,
      .icon-a {
        font-size: px2rem(28);
      }
    }
  }
}
</style>