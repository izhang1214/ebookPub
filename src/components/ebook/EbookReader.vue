<template>
  <div class="ebook-reader">
    <!-- 渲染电子书页面的DOM -->
    <div id="read"></div>
    <!-- 通过蒙版 实现书签效果 -->
    <div
      class="ebook-reader-mark"
      @click="onMark"
      @touchmove="move"
      @touchend="moveEnd"
    ></div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ebookMixin from "@/utils/mixin.js";
import {
  getFontFamily,
  saveFontFamily,
  saveFontSize,
  getFontSize,
  getTheme,
  saveTheme,
  getLocation,
} from "../../utils/localStorage";
// import {themeList} from '../../utils/book'; 因为通过mixin 混入了，因此这里不需要再次引入
import Epub from "epubjs"; // 引入epub
import { addCss, flatter, removeAllCss } from "../../utils/book";
global.epub = Epub; // 全局环境上存储epub实例对象

export default {
  mixins: [ebookMixin], //将混入的内容，通过 mixins放入到组件中
  // computed: { //多个地方使用，这里也进行混入
  //     themeList() {
  //         return themeList(this)
  //     },
  // },
  methods: {
    ...mapActions([
      "SetMenuVisible",
      "SettingVisible",
      "SetCurrentBook",
      "FontFamilyVisible",
      "SettingFontFamily",
      "SetDefaultFontSize",
      "SetTheme",
      "SetBookAvailable",
      "SetSection",
      "SetCover",
      "SetMetadata",
      "SetNavigation",
      "SetOffsetY",
    ]),
    move(e) {
      let offsetY = 0;
      if (this.firstOffsetY) { // firstOffsetY 第一个偏移量
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY;
        this.SetOffsetY(offsetY);
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY;
      }
      e.preventDefault();
      e.stopPropagation();
    },
    moveEnd(e) {
      this.SetOffsetY(0); //重置偏移量
      this.firstOffsetY = 0; //重置
    },
    // 遮罩层的事件
    onMark(e) {
      const offsetX = e.offsetX;
      let width = window.innerWidth;
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage();
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage();
      } else {
        this.toggleTitleAndMenu();
      }
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation();
        }); //调用Epub实例对象的内部的prev方法
        if (this.section <= 0) {
          this.SetSection((this.section = 0));
        } else {
          this.SetSection(this.section - 1);
        }
      }
    },
    nextPage() {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation();
        }); //调用Epub实例对象的内部的next方法
        this.SetSection(this.section + 1);
      }
    },
    toggleTitleAndMenu() {
      this.$store.dispatch("SetMenuVisible", !this.menuVisible);
      this.FontFamilyVisible(false);
      this.SettingVisible(-1);
    },
    // 翻页的时候隐藏菜单栏
    hideTitleAndMenu() {
      // this.$store.dispatch('SetMenuVisible',false)
      this.SetMenuVisible(false);
      this.FontFamilyVisible(false);
      this.SettingVisible(-1);
    },
    // 注册字号
    initFontFamily() {
      let font = getFontFamily(this.fileName);
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily);
      } else {
        this.rendition.themes.font(font); //如果有缓存的字体，直接赋值渲染
        this.SettingFontFamily(font);
      }
    },
    // 注册字体
    initFontSize() {
      // 缓存里没有字体，就进行保存
      let fontsize = getFontSize(this.fileName);
      if (!fontsize) {
        saveFontSize(this.fileName, fontsize);
      } else {
        this.rendition.themes.fontSize(fontsize + "px");
        this.SetDefaultFontSize(fontsize);
      }
    },
    // 主题样式注册
    initTheme() {
      // 设置主题缓存
      let defaultTheme = getTheme(this.fileName);
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name;
        saveTheme(this.fileName, defaultTheme);
      }
      this.SetTheme(defaultTheme); //缓存值存入vuex里
      this.themeList.forEach((theme) => {
        this.rendition.themes.register(theme.name, theme.style); //通过 register 来注册主题样式
      });
      // // 选择一个默认样式
      this.rendition.themes.select(defaultTheme);

      // 设置全局样式，在mixins中混入了
      this.initGlobalStyle();
    },
    // 初始化渲染方法
    initialRendition() {
      this.rendition = this.book.renderTo("read", {
        width: innerWidth,
        height: innerHeight,
        methods: "default", //兼容微信，确保在微信端可以现在
      });

      //调用display(),渲染视图，返回一个promise对象, promise之后初始化一个默认字体
      const location = getLocation(this.fileName);
      // console.log(location);
      this.display(location, () => {
        // 注册主题
        this.initTheme();
        this.initFontSize();
        this.initFontFamily();
        // 设置全局主题，设置全局的css
        this.initGlobalStyle();
        // 调用 refreshLocation
        // this.refreshLocation();
      });

      // 解决eboook的iframe 注入字体。ebook的rendition提供了钩子函数解决
      this.rendition.hooks.content.register((contents) => {
        // 通过 addStylesheet 注入样式文件，参数必须是url
        Promise.all([
          contents.addStylesheet(
            `${process.env.VUE_APP_RESOURCE_URL}/fonts/daysOne.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RESOURCE_URL}/fonts/cabin.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RESOURCE_URL}/fonts/montserrat.css`
          ),
          contents.addStylesheet(
            `${process.env.VUE_APP_RESOURCE_URL}/fonts/tangerine.css`
          ),
        ]);
      });
    },
    // 初始化手势
    initGesture() {
      //电子书实现原理是通过 iframe标签，绑定事件需要通过on方法
      // 通过 on 方法 将事件绑定到iframe 上
      this.rendition.on("touchstart", (event) => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp; //获取操作的时间，如果我希望是在多久之后进行操作
      });

      this.rendition.on("touchend", (event) => {
        this.offsetX = event.changedTouches[0].clientX - this.touchStartX; //计算手指的位置
        this.time = event.timeStamp - this.touchStartTime; //计算手指触摸时间
        if (this.time < 500 && this.offsetX > 40) {
          //如果时间500毫秒以内，>40 左边滑动
          this.prevPage(); //进入上一页
          this.hideTitleAndMenu();
        } else if (this.time < 500 && this.offsetX < -40) {
          //右边滑动
          this.nextPage(); //进入下一页
          this.hideTitleAndMenu();
        } else {
          // 如果上面两个条件都不满足，就保持在中间页
          this.toggleTitleAndMenu();
        }
        event.preventDefault();//阻止默认行为
        event.stopPropagation();
      });
    },
    // 解析电子书，获取电子书的封面图片，作者
    parseBook() {
      this.book.loaded.cover.then((cover) => {
        // 将图片转成url地址
        this.book.archive.createUrl(cover).then((url) => {
          this.SetCover(url);
        });
      });
      // 获取书签的图片和作者
      this.book.loaded.metadata.then((metadata) => {
        this.SetMetadata(metadata);
      });
      // 获取电子书目录
      this.book.loaded.navigation.then((navigation) => {
        const navItem = flatter(navigation.toc);
        // 目录的层级判断
        function findLevel(item, level = 0) {
          //查找目录级别的方法
          return !item.parent
            ? level
            : findLevel(
                navItem.filter(
                  (parentItem) => parentItem.id === item.parent
                )[0],
                ++level
              );
        }
        navItem.forEach((item) => {
          item.level = findLevel(item);
        });
        // 将处理后的数据 存入 vuex中
        this.SetNavigation(navItem);
      });
    },
    initEpub(baseUrl) {
      const url = baseUrl + this.fileName + ".epub";
      // 渲染电子书
      this.book = new Epub(url); //将电子书实例对象到vue组件实例
      // 将电子书对象 传给 vuex
      this.SetCurrentBook(this.book);
      this.initialRendition();
      this.initGesture();
      this.parseBook();
      // 通过 ready方法实现分页，ready是个promise对象
      this.book.ready.then(() => {
        return this.book.locations
          .generate(
            750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16)
          )
          .then((location) => {
            this.SetBookAvailable(true);
            this.refreshLocation(); //分页完成后需要调用一下，否则获取不到cfi
          });
      });
    },
  },
  // computed: {  因为上面引用了mixin.js，所以在这里可以取消
  //     ...mapGetters([
  //         'fileName',
  //         'menuVisible'
  //     ])
  // },

  mounted() {
    const baseUrl = `${process.env.VUE_APP_RESOURCE_URL}`;
    const fileName = this.$route.params.fileName.split("|").join("/");
    // 需要将动态路由获取到的文件，拼凑成 nginx 配置的目录
    this.$store.dispatch("SetFileName", fileName).then(() => {
      this.initEpub(baseUrl);
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.ebook-reader {
  width: 100%;
  height: 100%;
  .ebook-reader-mark {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: transparent;
  }
}
</style>