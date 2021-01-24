const book = {
  state: {
    fileName: "",
    menuVisible: false,
    settingVisible: -1, // -1:不显示，0:字号和字体设置，1:主题，2:进度条，3:目录
    defaultFontSize: 12, //设置默认字号
    currentBook: null, //ebook 对象
    defaultFontFamily: "Default", //字体
    fontFamilyVisible: false, //字体的显示隐藏
    defaultTheme: "Default", //默认主题
    ebookprogress: 0, //进度
    ebookAvailable: false, //进度条是否可拖动
    section: 0, //指定当前章节的位置，0 第一章节  1 第二章节 .....
    isPagination: true, //
    cover: null, //封面图片
    metadata: null,
    navigation: null, //电子书的目录
    offsetY: 0, //页面下拉偏移量
    isBookmark: null, //当前页是否为书签页，如果是书签页，会带有一个蓝色的书签的标志
  },

  mutations: {
    // 获取电子书名称
    SET_FILENAME(state, fileName) {
      state.fileName = fileName;
    },
    // 设置电子书 标题和底部菜单的显示 隐藏
    SET_MENUVISIBLE(state, menuVisible) {
      state.menuVisible = menuVisible;
    },
    // 底部菜单的设置
    SET_SETTINGVISIBLE(state, settingVisible) {
      state.settingVisible = settingVisible;
    },
    // 字体大小设置
    SET_DEFAULT_FONT_SIZE(state, defaultFontSize) {
      state.defaultFontSize = defaultFontSize;
    },
    // 存取 ebook 对象 到vuex
    SET_CURRENT_BOOK(state, currentBook) {
      state.currentBook = currentBook;
    },
    // 设置字体的显示隐藏
    FONT_FAMILY_VISIBLE(state, fontFamilyVisible) {
      state.fontFamilyVisible = fontFamilyVisible;
    },
    // 设置字体
    SET_DEFAULT_FONT_FAMILY(state, defaultFontFamily) {
      state.defaultFontFamily = defaultFontFamily;
    },
    // 设置主题
    SET_THEME(state, defaultTheme) {
      state.defaultTheme = defaultTheme;
    },
    // 进度条是否可拖动
    SET_BOOK_AVAILABLE(state, ebookAvailable) {
      state.ebookAvailable = ebookAvailable;
    },
    // 设置进度条
    SET_PROGRESS(state, ebookprogress) {
      state.ebookprogress = ebookprogress
    },
    // 设置章节
    SET_SECTION(state, section) {
      state.section = section;
    },
    // 设置图片
    SET_COVER(state, cover) {
      state.cover = cover;
    },
    SET_METADATA(state, metadata) {
      state.metadata = metadata
    },
    // 电子书目录的数据
    SET_NAVIGATION(state, navigation) {
      state.navigation = navigation;
    },
    SET_OFFSETY(state, offsetY) {
      state.offsetY = offsetY;
    },
    SET_BOOKMARK(state, isBookmark) {
      state.isBookmark = isBookmark;
    }
  },

  actions: {
    // 获取电子书名称
    SetFileName: ({
      commit
    }, fileName) => {
      return commit('SET_FILENAME', fileName);
    },
    // 设置电子书 标题和底部菜单的显示 隐藏
    SetMenuVisible: ({
      commit
    }, menuVisible) => {
      return commit('SET_MENUVISIBLE', menuVisible); //这里return出去的话，会返回一个promise对象
    },
    // 点击字体，主题等的设置
    SettingVisible: ({
      commit
    }, settingVisible) => {
      console.log(settingVisible);
      return commit('SET_SETTINGVISIBLE', settingVisible); //这里return出去的话，会返回一个promise对象
    },
    // 设置字号
    SetDefaultFontSize: ({
      commit
    }, defaultFontSize) => {
      // console.log(defaultFontSize)
      return commit('SET_DEFAULT_FONT_SIZE', defaultFontSize)
    },
    // 设置全局的 ebook 对象
    SetCurrentBook: ({
      commit
    }, currentBook) => {
      return commit('SET_CURRENT_BOOK', currentBook)
    },
    // 设置字体弹框的显示隐藏
    FontFamilyVisible: ({
      commit
    }, fontFamilyVisible) => {
      return commit('FONT_FAMILY_VISIBLE', fontFamilyVisible)
    },
    // 设置字体
    SettingFontFamily({
      commit
    }, defaultFontFamily) {
      // console.log(defaultFontFamily,'字体设置')
      return commit('SET_DEFAULT_FONT_FAMILY', defaultFontFamily)
    },
    // 设置主题
    SetTheme({
      commit
    }, defaultTheme) {
      return commit('SET_THEME', defaultTheme)
    },
    //设置进度 SET_BOOK_AVAILABLE
    SetBookAvailable({
      commit
    }, ebookAvailable) {
      return commit('SET_BOOK_AVAILABLE', ebookAvailable)
    },
    // 章节切换和进度条同步
    SetProgress({
      commit
    }, ebookprogress) {
      if (ebookprogress == 99) {
        ebookprogress = 100
      }
      return commit('SET_PROGRESS', ebookprogress)
    },
    // 章节设置
    SetSection({
      commit
    }, section) {
      return commit('SET_SECTION', section)
    },
    // 设置图片
    SetCover({
      commit
    }, cover) {
      return commit('SET_COVER', cover)
    },
    // 作者
    SetMetadata({
      commit
    }, metadata) {
      return commit('SET_METADATA', metadata)
    },
    // 电子书目录
    SetNavigation({
      commit
    }, navigation) {
      return commit('SET_NAVIGATION', navigation)
    },
    SetOffsetY({
      commit
    }, offsetY) {
      return commit('SET_OFFSETY', offsetY)
    },
    setBookMark({
      commit
    }, isBookmark) {
      console.log(isBookmark);
      return commit('SET_BOOKMARK', isBookmark)
    }
  }
}


export default book;