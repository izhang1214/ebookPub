<template>
  <div class="ebook-slide-content">
    <div class="slide-contents-search-wrapper">
      <div class="silde-contents-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input
          type="text"
          class="slide-contents-search-input"
          v-model="searchText"
          :placeholder="$t('book.searchHint')"
          @keyup.enter.exact="search"
          @focus="showSearchPage()"
        />
      </div>
      <div
        class="slide-contents-cancel"
        @click="hideSearchPage()"
        v-if="searchVisible"
      >
        {{ $t("book.cancel") }}
      </div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-img-wrapper">
        <img :src="cover" alt="" class="slide-img" />
      </div>
      <div class="slide-book-info-wrapper">
        <div class="slide-contents-title">{{ metadata.title }}</div>
        <div class="slide-contents-author">{{ metadata.creator }}</div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
        <div class="slide-contents-book-progress">
          <span class="progress">{{ ebookprogress + "%" }}</span>
          <span class="progress-text">{{ $t("book.haveRead2") }}</span>
        </div>
        <div class="slide-contents-book-time">{{ getReadTimeText() }}</div>
      </div>
    </div>
    <Scroll
      :top="156"
      :bottom="48"
      ref="scroll"
      class="slide-contents-lists"
      v-show="!searchVisible"
    >
      <div
        class="slide-contents-item"
        v-for="(item, index) in navigation"
        :key="index"
      >
        <!-- 
          :style="contentsItemStyle() 动态计算二级目录 ；
          :class动态绑定class，高亮显示  ，判断section章节==index ；
          点击切换目录，调用mixins中的display方法，传入href地址，即可跳转对应的章节目录；
        -->
        <span
          class="slide-contents-item-label"
          :class="{ active: section === index }"
          :style="contentsItemStyle(item)"
          @click="displayNavigation(item.href)"
          >{{ item.label }}{{ index }}</span
        >
        <span class="slide-contents-item-page"></span>
      </div>
    </Scroll>
    <!-- 搜索结果列表 -->
    <Scroll
      :top="66"
      :bottom="48"
      class="slide-search-list"
      v-show="searchVisible"
    >
      <div
        class="slide-search-item"
        v-for="(item, index) in searchList"
        :key="index"
        v-html="item.excerpt"
        @click="displaySearch(item.cfi, true)"
      ></div>
    </Scroll>
  </div>
</template>

<script>
import ebookMixin from "@/utils/mixin.js";
import Scroll from "../common/Scroll";
import { px2rem } from "../../utils/utils";
export default {
  mixins: [ebookMixin],
  components: {
    Scroll,
  },
  data() {
    return {
      searchText: "",
      searchList: null,
      searchVisible: false, //搜索列表的展示
    };
  },
  methods: {
    search() {
      if (this.searchText) {
        this.currentBook.ready.then(() => {
          this.doSearch(this.searchText).then((list) => {
            this.searchList = list;
            this.searchList.map((item) => {
              item.excerpt = item.excerpt.replace(
                this.searchText,
                `<span class='content-search-text'>${this.searchText}<span>`
              );
              return item;
            });
          });
        });
      }
    },
    //  调用电子书的自带的一个  搜索的   方法，官方api：https://github.com/futurepress/epub.js/wiki/Tips-and-Tricks-%28v0.3%29
    doSearch(q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(
          (item) =>
            item
              .load(this.currentBook.load.bind(this.currentBook))
              .then(item.find.bind(item, q))
              .finally(item.unload.bind(item)) //这里的finally方法，是加载完电子书之后执行这个unload，对电子书进行卸载，释放内存
        )
      ).then((results) => Promise.resolve([].concat.apply([], results)));
    },
    // 设置 2级目录的缩进
    contentsItemStyle(item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`,
      };
    },
    // 隐藏目录
    displayNavigation(target) {
      this.display(target, () => {
        this.hideSlide();
      });
    },
    // displaySearch
    displaySearch(cif, highLight = false) {
      this.display(cif, () => {
        this.hideSlide();
        // 当highLight 为true时，关键字高亮显示
        if (highLight) {
          this.currentBook.rendition.annotations.highlight(cif); //调用电子书高亮的方法
        }
      });
    },
    showSearchPage() {
      this.searchVisible = true;
    },
    hideSearchPage() {
      this.searchVisible = false;
      this.searchText = "";
      this.searchList = null;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.ebook-slide-content {
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(36);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .silde-contents-input-wrapper {
      flex: 1;
      border: 1px solid #cccccc;
      border-radius: px2rem(6);
      @include center;
      .slide-contents-search-icon {
        flex: 0 0 px2rem(28); //图标宽度为28
        font-size: px2rem(14);
        @include center;
      }
      .slide-contents-search-input {
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        border: none;
        background: transparent;
        &:focus {
          outline: none;
        }
      }
    }
    .slide-contents-cancel {
      flex: 0 0 px2rem(50);
      font-size: px2rem(14);
      @include center;
    }
  }
  .slide-contents-book-wrapper {
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
    box-sizing: border-box;
    .slide-contents-img-wrapper {
      flex: 0 0 px2rem(45);
      .slide-img {
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-book-info-wrapper {
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-title {
        width: px2rem(154);
        font-size: px2rem(14);
        line-height: px2rem(18);
        @include ellipsis2(2);
      }
      .slide-contents-author {
        width: px2rem(154);
        font-size: px2rem(12);
        margin-top: px2rem(6);
        @include ellipsis;
      }
    }
    .slide-contents-book-progress-wrapper {
      flex: 0 0 px2rem(70);
      padding-top: px2rem(14);
      .slide-contents-book-progress {
        .progress {
          font-size: px2rem(14);
        }
        .progress-text {
          font-size: px2rem(12);
        }
      }
      .slide-contents-book-time {
        font-size: px2rem(12);
        margin-top: px2rem(6);
      }
    }
  }
  .slide-contents-lists {
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item {
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label {
        flex: 1;
        font-size: px2rem(14);
        @include ellipsis;
      }
      .active {
        font-weight: bold;
        color: #84602c;
      }
      .slide-contents-item-page {
      }
    }
  }
  .slide-search-list {
    width: 100%;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item {
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>