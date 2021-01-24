import {
    getReadTime
} from "./localStorage";

export const FONT_SIZE_LIST = [{
        fontSize: 12
    },
    {
        fontSize: 14
    },
    {
        fontSize: 16
    },
    {
        fontSize: 18
    },
    {
        fontSize: 20
    },
    {
        fontSize: 22
    },
    {
        fontSize: 24
    },
]

// 设置主题
export function themeList(vue) {
    return [{
            alias: vue.$t('book.themeDefault'), //vue 实例上的 $t 国际化
            name: "Default",
            style: {
                body: {
                    'color': "#4c5059",
                    'background': "#cecece"
                }
            }
        },
        {
            alias: vue.$t('book.themeGold'), //vue 实例上的 $t 国际化
            name: "Gold",
            style: {
                body: {
                    'color': "#5c5b56",
                    'background': "#c6c2b6"
                }
            }
        },
        {
            alias: vue.$t('book.themeEye'), //vue 实例上的 $t 国际化
            name: "Eye",
            style: {
                body: {
                    'color': "#404c42",
                    'background': "#a9c1a9"
                }
            }
        },
        {
            alias: vue.$t('book.themeNight'),
            name: "Night",
            style: {
                body: {
                    'color': "#cecece",
                    'background': "#000"
                }
            }
        }
    ]
};

// 设置全局主题
export function addCss(href) {
    const link = document.createElement('link');
    // 对link标签设置属性
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    link.setAttribute('href', href)
    // 实现动态添加css
    document.getElementsByTagName('head')[0].appendChild(link)
}
// 清除css，由于上面添加css会不断的在head标签里，插入新的link标签，
export function removeCss(href) {
    const links = document.getElementsByTagName('link'); //获取所有的link标签
    for (let i = links.length; i >= 0; i--) {
        const link = links[i];
        if (link && link.getAttribute('href') && link.getAttribute('href') === href) {
            link.parentNode.removeChild(link);
        }
    }
}
// 设置全局主题的时候，清除之前的css
export function removeAllCss() {
    removeCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_default.css`);
    removeCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_eye.css`);
    removeCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_gold.css`);
    removeCss(`${process.env.VUE_APP_RESOURCE_URL}/theme/theme_night.css`);
}

export function getReadTimeByMinutes(fileName) {
    const readTime = getReadTime(fileName)
    if (!readTime) {
        return 0;
    } else {
        return Math.ceil(readTime / 60);
    }
}

// 将 二维数组合并成一维数组
export function flatter(array) {
    return [].concat(
        ...array.map((item) => [].concat(item, ...flatter(item.subitems)))
    );
}