import Vue from 'vue'
import VueI18N from 'vue-i18n'; //引入 i18n库，中英文转换的库
import en from './en';
import cn from './cn';
import {
  getLocale,
  saveLocale
} from '../utils/localStorage';

Vue.use(VueI18N)

const messages = {
  en,
  cn
}

const locale = getLocale();
if (!locale) {
  saveLocale('cn')
}

// 实例化 i18n
const i18n = new VueI18N({
  locale, //当前的语言
  messages //这个参数名是固定，不能变的
})

export default i18n;