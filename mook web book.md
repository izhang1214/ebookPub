mook web book

1、引入外部的web字体

在main.js中引入 

```javascript
import "./assets/fonts/daysOne.css"; //引入web字体
```

rem的设置

```javascript
DOMContentLoaded
　　当初始的 HTML 文档被完全加载和解析完成之后，DOMContentLoaded 事件被触发，而无需等待样式表、图像和子框架的完成加载。

load
　　load 仅用于检测一个完全加载的页面，页面的html、css、js、图片等资源都已经加载完之后才会触发 load 事件。
  
document.addEventListener('DOMContentLoaded',()=>{
    const html = document.querySelector('html');
    let fontsize = window.innerWidth / 10;
    fontsize = fontsize>=50?50:fontsize;
    html.style.fontSize = fontsize +'px';
});
```

