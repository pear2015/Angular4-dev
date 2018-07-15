## 种子工程使用介绍

### 1. 配置与创建自定义窗体

在 `electron/windows` 目录下定义了目前用于承载页面的四个业务窗体，分别为：

* [auxiliary-window.js](../electron/windows/auxiliary-window.js)

    用于承载辅助业务模块的壳窗体。

* [gis-window.js](../electron/windows/gis-window.js)

    用于承载GIS地图业务的壳窗体。

* [login-window.js](../electron/windows/login-window.js)

    用于授权登录时所使用的壳窗体。

* [main-window.js](../electron/windows/main-window.js)

    用于承载主要业务模块的壳窗体。


每个壳窗体内部均可以配置自己内部的属性，这些属性来自于electron官网的介绍。当配置好这些窗体内容后，只需要按照以下方式在 `electron` 的入口函数 `main.js` 中进行创建即可，具体窗体创建代码如下：

    const ELECTRON = require('electron');
    const BrowserWindow = ELECTRON.BrowserWindow;
    mainWindow = require('./windows/main-window') (BrowserWindow,
            middleScreen ? {
                x: middleScreen.bounds.x,
                y: middleScreen.bounds.y,
                width: middleScreen.bounds.width,
                height: middleScreen.bounds.height
            } : null);


### 2. 如何在electron中实现渲染进程与主进程的交互

在electron的定义中，任何以网页形式展现的内容都属于渲染进程，而主进程则是与窗体壳程序相关的内容，比如与本地硬件通讯等。由于太多的业务场景需要有网页和壳之间的交互需求，因此工程内部提供了一种交互机制，这种机制也是来源自 `electron` 的 `ipcRender` 和 `ipcMain` API.

在基于Angular的业务层面（网页内容），工程内定义了 [IpcRendererService](../src/app/shared/services/ipcRenderer.service.ts) 服务，服务中定义了如何在页面中向主进程发送交互请求的API, 接下来我们将通过该服务提供的API向主进程发送消息，这里我们使用的场景是用户登录

* 在业务模块的登录方法中发送登录成功的事件消息：

        import { IpcRendererService } from '../shared'
        export class LoginComponent implements OnInit {

        constructor(private router: Router,
            private ipcRendererService: IpcRendererService) {
        }

        ngOnInit() {

        }

        login(): void {
            this.ipcRendererService.send('loginSucceedEvent', null);
        }
    }

* 在主进程中接受业务消息，并弹出三屏。

    `electron/ipcMain-handler.js`

        const { ipcMain } = require('electron');
        var ipcMainEventHandler = function (mainWindow, callback) {

        var hasLogin = false;

        ipcMain.on('loginSucceedEvent', function (event, arg) {
                if (!hasLogin) {
                    mainWindow.close();
                    hasLogin = !hasLogin;
                }
                if (callback) {
                    callback(event, arg);
                }
            });
        };

        module.exports = ipcMainEventHandler;

以上我们就成功的进行了一次渲染进程和主进程交互的，当ipcMain监听到登录成功的事件之后，就会将当前的login-window关闭, 同时执行登录成功后的后续逻辑。

### 3. 如何在前端界面中使用国际化特性。

内容国际化是为了满足在不同的语言环境下，通过一定的语言配置能力能够使软件的界面展现出与当前语言环境相匹配的内容。在electron-seed种子工程中，我们也使用了相关组件和自定义服务来达到这种软件国际化的目的。以下例子将展示如何通过工程中的特性来完成国际化工作：

1. 首先需要在 `src/i18n` 的目录下新增语言文件, 项目中目前使用的语言文件是json格式的，而命名规范是按照标准的语言缩写来命名，如 `zh-CN.json`.

2. 在对应语言的json文件中配置词条信息, 由于json中是以键值的方式来表现内容的，对应到国际化翻译中，键就是我们需要翻译的内容，而值就是翻译的结果，具体如下:

        {
            'hello world': '你好世界'
        }

3. 在界面中利用组件的特性自动对界面上的词条进行翻译

    `前端界面`

        <button class="login-button" type="submit">
            {{'login' | translate}}
        </button>

    `组件引用`

    为了支撑前端页面自动翻译的特性，后台代码必须要在相应的业务模块中引入 `TranslateModule`,具体内容如下：

        import { NgModule } from '@angular/core';
        import { BrowserModule } from '@angular/platform-browser';
        import { FormsModule } from '@angular/forms';
        import { TranslateModule } from 'ng2-translate';
        import { LoginComponent } from './login.component';
        import { routing } from './login.routes';

        /**
        * 登录模块
        */
        @NgModule({
            imports: [
                BrowserModule,
                FormsModule,
                routing,
                TranslateModule,
            ],
            declarations: [
                LoginComponent
            ]
        })
        export class LoginModule {
        }
        

### 4. 使用http代理访问Restful API

由于es6中提供了promise等特性，使得客户端通过http请求访问restful服务的时候性能更加有优势，并且在编码写法上也摒弃了传统的callback嵌套模式，在种子工程中我们对这种服务调用方式进行了封装。

封装的服务类：[HttpProxyService](../app/shared/services/http.proxy.service.ts)

使用例子：

      var getCentersForDisplay = function getCentersForDisplay(): Promise<any> {
        let url = this.apiBaseUrl + '/queries/centers?hasData=appeal&locale=' + this.language;
        return this.httpProxy.getRequest(url, getCentersForDisplay);
    };


