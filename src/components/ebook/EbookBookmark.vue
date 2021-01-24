<template>
  <div class="ebook-bookmark" ref="bookmark">
    <div class="ebook-bookmark-text-wrapper">
      <!-- 下拉的图标 -->
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">{{ text }}</div>
    </div>
    <!-- 书签图标 -->
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : ''">
      <BookMark :color="color" :width="15" :height="35" />
    </div>
  </div>
</template>

<script>
import { realPx } from "../../utils/utils";
import BookMark from "../common/bookMark";
import ebookMixin from "../../utils/mixin";
import { getBookmark, saveBookmark } from "../../utils/localStorage";
import { mapActions } from "vuex";
const Blue = "#346cbc";
const White = "#fff";
export default {
  mixins: [ebookMixin],
  components: {
    BookMark,
  },
  data() {
    return {
      text: this.$t("book.pulldownAddMark"), //初始值 国际化获取
      color: White,
      isFixed: false,
      bookmark: [],
    };
  },
  computed: {
    // 计算书签下拉的高度
    height() {
      return realPx(35);
    },
    // 下拉临界值
    threshold() {
      return realPx(50);
    },
    fixedStyle() {
      return {
        position: "fixed",
        top: 0,
        right: `${(window.innerWidth - this.$refs.bookmark.clientWidth) / 2}px`,
      };
    },
  },
  watch: {
    offsetY(v) {
      if (!this.ebookAvailable || this.menuVisible || this.settingVisible >= 0)
        return;
      if (v >= this.height && v < this.threshold) {
        // console.log("到达第二阶段");
        this.beforeThreshold(v);
      } else if (v >= this.threshold) {
        // console.log("第三阶段");
        this.afterThreshold(v);
      } else if (v > 0 && v < this.height) {
        this.beforeHeight();
      } else if (v === 0) {
        // 归位操作
        this.restore();
      }
    },
    // 监听书签的标识，解决页面刷新的之后书签显示状态
    isBookmark(v){
      if(v){
        this.color = Blue;
        this.isFixed = true      
      }else{
        this.color=White;
        this.isFixed=false;
      }
    }
  },
  methods: {
    ...mapActions(["setBookMark"]),
    addBookmark() {
      // 数组存所有的书签,从本地缓存中获取
      this.bookmark = getBookmark(this.fileName);
      if (!this.bookmark) {
        this.bookmark = [];
      }
      const currentLocation = this.currentBook.rendition.currentLocation(); //获取到ebook对象
      const cfibase = currentLocation.start.cfi.replace(/!.*/, "");
      const cfistart = currentLocation.start.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      const cfiend = currentLocation.end.cfi
        .replace(/.*!/, "")
        .replace(/\)$/, "");
      const cfirange = `${cfibase}!,${cfistart},${cfiend})`;
      // 通过 epubCfi的getrange方法
      this.currentBook.getRange(cfirange).then((range) => {
        // 获取 文本  ，全局查找有2个空格的，进行删除空格操作
        const text = range.toString().replace(/\s\s/g, "");
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text: text,
        });
        saveBookmark(this.fileName, this.bookmark);
        console.log(this.bookmark);
      });
    },
    removeBookmark() {
      const currentLocation = this.currentBook.rendition.currentLocation(); //获取到ebook对象
      const cfi = currentLocation.start.cfi;
      this.bookmark = getBookmark(this.fileName);
      if (this.bookmark) {
        this.bookmark = this.bookmark.filter((item) => item.cfi !== cfi);
        saveBookmark(this.fileName, this.bookmark);
        // 取消设置当前页为书签页
        this.setBookMark(false);
      }
    },
    restore() {
      // 状态4  归位
      setTimeout(() => {
        this.$refs.bookmark.style.top = `${-this.height}px`;
        this.$refs.iconDown.style.transform = "rotate(0deg)";
      }, 200);
      if (this.isFixed) {
        this.setBookMark(true);
        this.addBookmark();
      } else {
        this.setBookMark(false);
        this.removeBookmark();
      }
    },
    beforeHeight() {
      // 状态1 未超过书签的高度
      if (this.isBookmark) {
        this.text = this.$t("book.pulldownDeleteMark");
        this.color = Blue;
        this.isFixed = true;
      } else {
        this.text = this.$t("book.pulldownAddMark");
        this.color = White;
        this.isFixed = false;
      }
    },
    // 刷新前
    beforeThreshold(v) {
      // 实现吸顶效果
      // 状态2、未到达临界状态
      this.$refs.bookmark.style.top = `${-v}px`;
      this.beforeHeight();
      // 书签小箭头的翻转
      const iconDown = this.$refs.iconDown;
      if (iconDown.style.transform === "rotate(180deg)") {
        iconDown.style.transform = `rotate(0deg)`;
      }
    },
    // 刷新后
    afterThreshold(v) {
      // 状态3、超越临界状态
      this.$refs.bookmark.style.top = `${-v}px`;
      if (this.isBookmark) {
        this.text = this.$t("book.releaseDeleteMark");
        this.color = White;
        this.isFixed = false;
      } else {
        this.text = this.$t("book.releaseAddMark");
        this.color = Blue;
        this.isFixed = true;
      }
      const iconDown = this.$refs.iconDown;
      if (
        iconDown.style.transform === "" ||
        iconDown.style.transform === "rotate(0deg)"
      ) {
        iconDown.style.transform = `rotate(180deg)`;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.ebook-bookmark {
  position: absolute;
  top: px2rem(-35);
  left: 0;
  z-index: 200;
  width: 100%;
  height: px2rem(-35);
  .ebook-bookmark-text-wrapper {
    position: absolute;
    right: px2rem(45);
    bottom: px2rem(-30);
    display: flex;
    .ebook-bookmark-down-wrapper {
      font-size: px2rem(14);
      color: #fff;
      transition: all 0.2s linear;
      @include center;
    }
    .ebook-bookmark-text {
      font-size: px2rem(14);
      color: white;
    }
  }
  .ebook-bookmark-icon-wrapper {
    position: absolute;
    right: 0;
    bottom: px2rem(-30);
    margin-right: px2rem(15);
  }
}
</style>