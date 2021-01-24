const getters = {
    fileName(state) {
        return state.book.fileName
    },
    menuVisible(state) {
        return state.book.menuVisible
    },
    settingVisible(state) {
        return state.book.settingVisible
    },
    defaultFontSize(state) {
        return state.book.defaultFontSize
    },
    currentBook(state) {
        return state.book.currentBook
    },
    defaultFontFamily(state) {
        return state.book.defaultFontFamily
    },
    fontFamilyVisible(state) {
        return state.book.fontFamilyVisible
    },
    defaultTheme(state) {
        return state.book.defaultTheme
    },
    ebookprogress(state) {
        return state.book.ebookprogress
    },
    ebookAvailable(state) {
        return state.book.ebookAvailable
    },
    section(state) {
        return state.book.section
    },
    cover(state) {
        return state.book.cover
    },
    metadata(state) {
        console.log(state.book.metadata)
        return state.book.metadata
    },
    navigation(state) {
        return state.book.navigation
    },
    offsetY(state) {
        return state.book.offsetY
    },
    isBookmark(state) {
        return state.book.isBookmark
    }
}

export default getters;