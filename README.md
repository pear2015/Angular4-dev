# electron-seed

> __目录：__
> * [1 说明][#1]
> * [2 环境准备][#2]
> * [3 快速指南][#3]
> * [4 发布][#4]
> * [5 工程结构][#5]
> * [6 技术特性][#6]
> * [7 依赖包批量升级][#7]
> * [8 种子工程相关使用介绍][#8]
> * [9 部署参考][#9]
> * [10 常见问题][#10]


## 1 说明

electron-seed是基于electron的前端壳工程，内部集成了基于Angular4的owlet4-seed的相关特性。

[![Build Status](http://172.18.24.25:8001/job/electron-seed_build/badge/icon)](http://172.18.24.25:8001/job/electron-seed_build/)
[![gate status](http://172.18.24.25:9000/api/badges/gate?key=electron-seed)](http://172.18.24.25:9000/overview?id=electron-seed)

## 2 环境准备

* 源码管理：SmartGit, 最新版本即可

    安装文件：`\\172.18.3.26\共享资源\git\软件\SmartGit\smartgit-win32-setup-jre-17_0_3.zip`
    
    安装及使用向导： [smartGitGuid](http://172.18.3.103/vNextDevTechs/Cooperation/blob/master/docs/learn-git/git-usage.md)

* 开发IDE：visual studio code, 最新版本即可

* 依赖环境：Nodejs v6.11.0, npm v3.10.10, Python 2.7.x（<3.0版本）

    安装文件：`\\172.18.3.26\共享资源\nodejs\node-v6.11.0-x64.msi`

    安装文件：`\\172.18.3.26\共享资源\python\python-2.7.12.msi`
      

* 浏览器：chrome，v58或以上

    安装文件：`\\172.18.3.26\共享资源\浏览器\Chrome\58.0.3029.96_ChromeStandaloneSetup.exe`


## 3. 快速指南

1. 使用 git clone，将代码clone至本地仓库
2. 使用node执行 `npm install` 安装项目依赖。  

    已在 nexus 上传了目前使用的 node-sass v4.5.0 版本（在 nodejs v5.x/6.x 版本下的 linux、windows 环境支持文件，所以只能在这几个版本的nodejs下使用），如要增加更多支持版本，需在 node-sass github 网站 release 页面下载相应支持文件并上传到 nexus。
    
3. 执行 `npm run build` 执行构建。

    当需要快速执行开发构建时，可用 `npm run build:dev` 替代。

4. 执行 `npm start` 开启 webpack dev server，然后在vscode按下F5即可启动Electron壳程序。关于vscode中的调试配置文件，请参见: [launch.json](./docs/files/launch.json)

    开发人员在编辑ts和html且保存后，`webpack dev server`会自动对改动的文件进行编译打包，并且会通知浏览器自动刷新。  
    编译sass文件使用的是`node-sass`组件，没有使用`webpack`。如需要实现sass自动编译，需要执行`npm run watch-sass`。
    
5. 编程风格指南

    [参考指南](https://angular.cn/docs/ts/latest/guide/style-guide.html)

## 4 发布

1. 执行 `npm run build:dist` 执行构建，文件会放入dist目录。
2. 执行 `npm run upload:dev` ，会将`dist`目录上传到开发 tomcat 服务器，自动部署。

    > 部署到 Tomcat 时，需根据需要修改`main-conf.json`配置文件。
3. 执行 `npm run upload:nexus` ，会将`dist`目录打成 zip 包，并上传到 nexus 服务器上。

## 5 工程结构
```
macaw-frontend/
    |- build/                                 - 开发时代码输出目录，包含sourceMap文件。
    |    |- libs/                             - 第三方依赖库，例如bootstrap等。
    |    |- scripts/                          - webpack打包输出目录。
    |    |- themes/                           - 主题样式目录，存放.css文件。
    |    |- main-conf.json                       - 应用程序配置文件。
    |    └─ index.html                        - 首页。
    |- config/                                - 工程配置文件目录，包含webpack的配置和gulp的配置。
    |    |- webpack/                          - webpack配置目录
    |    |    |- webpack.common.js            - 通用打包配置
    |    |    |- webpack.dev.js               - 开发环境打包配置
    |    |    |- webpack.prod.js              - 发布环境打包配置
    |    |    └─ webpack.test.js              - 单元测试打包配置
    |    |- gulp.config.js                    - gulp配置文件
    |    └─ helpers.js                        - 打包配置帮助类
    |- dist/                                  - 发布时代码输出目录，与build类似，不包含sourceMap文件。
    |- electron/                              - electron壳工程目录
    |    |- windows/                          - 窗体定义目录
    |    |    |- auxiliary-window.js          - 辅助屏窗体及相关内容定义
    |    |    |- gis-window.js                - GIS屏窗体及相关内容定义
    |    |    |- login-window.js              - 登录窗体及相关内容定义
    |    |    └─ main-window.js               - 主屏窗体及相关内容定义
    |    |- test/                             - 针对electron的单元测试目录
    |    |- electron-install.js               - electron打包安装命令配置类
    |    └─ exception-handler.js              - electron壳环境下的全局异常处理类
    |    └─ ipcMain-handler.js                - electon主进程用于处理和接受渲染进程的事件通知
    |    └─ logger.js                         - electron壳环境下的日志帮助类
    |    └─ main.js                           - electron工程入口定义
    |    └─ screen.manager.js                 - 多屏管理帮助类
    |- node_modules/                          - 第三方npm包。
    |- reports/                               - 单元测试报告。
    |- src/                                   - 源码目录。
    |    |- app/                              - 应用程序目录，存放未编译.ts文件。
    |    |    |- core/                        - 核心模块, 存放应用级的单例服务。
    |    |    |- shared/                      - 共享模块
    |    |    |- +appeal-table/            - 业务发展趋势模块
    |    |    |- app.component.ts
    |    |    |- app.module.ts                - 主模块
    |    |    └─ app.routes.ts                - 主路由
    |    |- i18n/                             - 多语言词条目录。
    |    |- test/                             - 单元测试目录。
    |    |- themes/                           - 主题样式目录.
    |    |    └─ default
    |    |         |- images                  - 存放图片。
    |    |         └─ scss                    - 存放未编译的.scss文件。
    |    |- main-conf.json                       - 应用程序配置文件。
    |    |- favicon.ico                       - 站点图标。
    |    |- index.html                        - 首页
    |    |- main.ts                           - 应用程序入口
    |    |- polyfills.ts                      - 兼容性文件入口
    |    └─ vendor.ts                         - 第三方库文件入口
    |- .editorconfig                          - 统一文件格式配置
    |- .gitattributes                         - git属性配置
    |- .gitignore                             - git忽略配置
    |- CHANGELOG.md                           - 版本变更历史
    |- gulpfile.js                            - 构建任务
    |- karma-shim.js
    |- karma.conf.js                          - karma配置
    |- package.json                           - npm包配置文件
    |- README.md
    |- tsconfig.json                          - typescript配置文件
    |- tslint.json                            - ts检查规范配置
    └─ webpack.config.js                      - 打包配置
```

## 6 技术特性

* electron 多屏交互
* electron 进程间交互
* electron 无边框
* electron 多屏(登录屏与主屏)
* winston日志组件
* 加载owlet4-seed工程
* TypeScript
* tslint 检查ts代码
* typings 管理ts类型定义文件
* Angular 4
* Angular 4 模块延迟加载
* i18n
* Webpack
* Sass
* karma 单元测试，单元测试报告和代码覆盖率。
* jenkins 持续构建
* 质量控制与SonarQuber平台整合

## 7 依赖包批量升级

* 批量升级依赖组件的版本: 借助 [npm-check-updates](http://172.18.24.36:7002/package/npm-check-updates)

    ```
    npm install -g npm-check-updates
    ncu
    ncu -u
    ```

## 8 种子工程相关使用介绍

[使用指南](./docs/how-to-use.md) 

## 9 部署参考

暂无内容

## 10 常见问题

[常见问题](./docs/issues.md)

[#1]: #1-说明
[#2]: #2-环境准备
[#3]: #3-快速指南
[#4]: #4-发布
[#5]: #5-工程结构
[#6]: #6-技术特性
[#7]: #7-依赖包批量升级
[#8]: #8-种子工程相关使用介绍
[#9]: #9-部署参考
[#10]: #10-常见问题
