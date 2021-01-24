// 由于组件中的 mapGetters 多个组件使用，这里通过vue的 mixin 混合机制，将mapGetters 混合到组件中
import {
    mapGetters,
    mapActions
} from 'vuex';
import {
    removeAllCss,
    themeList,
    addCss,
    getReadTimeByMinutes
} from './book';

import {
    saveLocation,
    getReadTime,
    getBookmark
} from './localStorage';

const ebookMixin = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            "settingVisible",
            "defaultFontSize",
            "currentBook",
            "defaultFontFamily",
            "fontFamilyVisible",
            "defaultTheme",
            "ebookprogress",
            "ebookAvailable",
            "section",
            "cover",
            "metadata",
            "navigation",
            "offsetY",
            "isBookmark",
        ]),
        // 混入 样式主题
        themeList() {
            return themeList(this)
        }
    },
    methods: {
        // ...mapActions(['SetProgress', 'SetSection']),
        ...mapActions(["SetProgress", "SetSection", "SetMenuVisible", "SettingVisible", "FontFamilyVisible","setBookMark"]),
        // 隐藏目录的方法，因为EbookSlide.vue组件也使用，因此放在mixins中共享
        hideSlide() {
            this.SetMenuVisible(false);
            this.SettingVisible(-1);
            this.FontFamilyVisible(false);
        },
        // 设置全局Style样式
        initGlobalStyle() {
            removeAllCss(); //调用全局样式之前，先清除所有的
            let _style;
            switch (this.defaultTheme) {
                case 'Default':
                    _style = 'default'
                    break;
                case 'Eye':
                    _style = 'eye'
                    break;
                case 'Gold':
                    _style = 'gold'
                    break;
                case "Night":
                    _style = 'night'
                    break;
                default:
                    _style = 'defult'
                    break;
            };
            addCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_${_style}.css`)
        },
        // 章节切换 和 进度条同步
        refreshLocation() {
            // currentLocation 这个api可获取到当前章节的位置
            const currentLocation = this.currentBook.rendition.currentLocation();
            if (currentLocation && currentLocation.start) {
                const startCfi = currentLocation.start.cfi; //获得本章节的 开始位置
                const progress = this.currentBook.locations.percentageFromCfi(startCfi);
                this.SetProgress(Math.floor(progress * 100));
                this.SetSection(currentLocation.start.index); //调用vuex的SetSection，传入 index，章节标识
                saveLocation(this.fileName, startCfi); //将当前阅读进度 存入缓存
                const bookmark = getBookmark(this.fileName);
                if (bookmark) {
                    // 通过some方法，判断，只要结果有一个返回true，整体就会为true
                    if (bookmark.some(item => item.cfi === startCfi)) {
                        this.setBookMark(true)
                    } else {
                        this.setBookMark(false)
                    }
                } else {
                    this.setBookMark(false)
                }
                console.log(bookmark);
            }
        },
        // 电子书显示的方法
        display(target, cb) {
            if (target) {
                this.currentBook.rendition.display(target).then(() => {
                    this.refreshLocation();
                    if (cb) cb();
                })
            } else {
                this.currentBook.rendition.display().then(() => {
                    this.refreshLocation()
                    if (cb) cb();
                })
            }
        },
        //阅读时间
        getReadTimeText() {
            return this.$t("book.haveRead").replace("$1", getReadTimeByMinutes(this.fileName));
        },
    },
}

export default ebookMixin;