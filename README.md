# jevictek-ui
讯飞皆成--后端UI界面

### Demo 预览
尽快更新部署域名 ``http://demo.test.com``

### 功能与特点
1. 采用 ``Require.js`` 模块管理。
2. 提供 表单、下拉菜单、按钮组、分页、警告框、等等组件。
3. 采用 ``font-awesome`` 字体图标。
4. PC端栅格系统。
5. 默认 JS 基本小组件.
6. 因其为了兼容 ``IE`` 浏览器，所以抛弃了响应式布局。

### 说明
1. 首先，本框架借鉴了 [Bootstrap](http://getbootstrap.com/) 的一些CSS样式和组件，在此感谢开源精神；其次，此UI界面是用于本公司项目后台界面，并不一定适应用于其任何项目中；
2. 框架只提供了一些默认组件的 CSS 及 JavaScript；采用 ``Require.js`` 模块加载器；其核心库是 ``jQuery`` 。
3. 本框架支持浏览器 ``IE7+、Chrome、FireFox、Safari``；在使用中难免会出现意料之外的Bug，您反馈于我们，我们将用心处理。
4. 采用 ``Require.js`` 来编写 JS 模块，一定程度上增加了上手的难度。
5. 项目打包采用 ``Require.js`` 所提供的打包工具 ``r.js`` 来打包压缩合并 JS 和 CSS。

### 目录结构
```
jevictek/
├── component/                    (组件文件夹)
├── css/
│   ├── main.css                  (所有组件样式)
│   ├── font-awesome-ie7.css      (字体图标IE7样式)
│   └── theme.css                 (界面主题，默认不加载)   
├── images/                       (图片文件夹)
├── js/
│   ├── config.js                 (默认模块配置文件)
│   └── common.js                 (公用JS文件)
├── index.html                    (界面Demo)
└── build.js                      (r.js 项目打包配置文件)
```

### Document 文档
尽快更新部署域名 ``http://demo.test.com``

### Update Logs 更新日志
#### Update Ver 1.0.0
1. 创建默认版本。

### 版权
本项目最终解释权归 [安徽讯飞皆成软件技术有限公司](http://www.jevictek.com/) 所有。
