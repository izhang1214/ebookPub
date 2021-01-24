// 本项目中使用了 web-storage-cache 库 ，帮助实现本地缓存,可以将json字符串转成对象
// 导入文件
import {
    locale
} from 'core-js';
import Storage from 'web-storage-cache';
const localStorage = new Storage();

export function setLocalStorage(key, value) {
    return localStorage.set(key, value)
}

export function getLocalStorage(key) {
    return localStorage.get(key)
}

export function removeLocalStorage(key) {
    return localStorage.delete(key)
}

export function clearLocalStorage() {
    return localStorage.clear();
}

export function setBookObject(fileName, key, value) {
    let book = getLocalStorage(`${fileName}-info`);
    // 判断是否可以取到 本地缓存,取不到则声明一个空对象
    if (!book) {
        book = {};
    }
    book[key] = value; //否则就给对象 赋值
    setLocalStorage(`${fileName}-info`, book);
}


export function getBookObject(fileName, key) {
    let book = getLocalStorage(`${fileName}-info`);
    if (book) {
        return book[key]
    } else {
        return null;
    }
}
// 字体的缓存
export function getFontFamily(fileName) {
    return getBookObject(fileName, 'fontFamily')
}

export function saveFontFamily(fileName, font) {
    return setBookObject(fileName, 'fontFamily', font)
}

// 字号的缓存
export function getFontSize(fileName) {
    return getBookObject(fileName, 'fontSize')
}

export function saveFontSize(fileName, size) {
    return setBookObject(fileName, 'fontSize', size)
}

// 国际化字体的缓存
export function getLocale() {
    return getLocalStorage('locale')
}
export function saveLocale(locale) {
    return setLocalStorage('locale', locale)
}

// 主题缓存
export function getTheme(fileName) {
    return getBookObject(fileName, 'theme')
}
export function saveTheme(fileName, theme) {
    return setBookObject(fileName, 'theme', theme)
}

// 进度条缓存
export function getLocation(fileName) {
    return getBookObject(fileName, 'location')
}
export function saveLocation(fileName, location) {
    return setBookObject(fileName, 'location', location)
}

// 阅读时间
export function getReadTime(fileName) {
    return getBookObject(fileName, 'time')
}
export function saveReadTime(fileName, time) {
    setBookObject(fileName, 'time', time)
}

// 书签
export function getBookmark(fileName) {
    return getBookObject(fileName, 'bookmark')
}
export function saveBookmark(fileName, bookmark) {
    console.log(fileName,bookmark);
    setBookObject(fileName, 'bookmark', bookmark)
}