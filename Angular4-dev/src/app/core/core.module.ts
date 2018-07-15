import { NgModule, ErrorHandler, Optional, SkipSelf } from '@angular/core';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateService } from 'ng2-translate';
import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { GlobalErrorHandler } from './global-error.handler';
import { SocketClient } from './socket-io.client';
import { LocalStorageService } from './services/localstorage.service';
import { HttpProxyService } from './services/http.proxy.service';
import { HttpLoginProxyService } from './services/http.login.service';
import { LocalCookieService } from './services/localcookies.service';
import { ConfigService } from './services/config.service';
import { EventAggregator } from './services/eventaggregator.service';
import { IpcRendererService } from './services/ipcRenderer.service';
import { NumberConvertService } from './services/number-convert.service';
import { TypeConvertService } from './services/type-convert.service';
import { LevelConvertService } from './services/level-convert.service';
import { OrgPersonService } from './services/orgperson.service';
import { UtilHelper } from './common/utilhelper';
import { DateFormatHelper } from './common/dateformat-helper';
import { UrlHelperService } from './services/urlhelper.service';
import { ServiceBase } from './servicebase';
import { LoggerRecordService } from './services/logger-record.service';
import { SocketService } from './services/socket.service';
import { locale, loadMessages } from 'devextreme/localization';
import 'devextreme-intl';
let ptMessage = require('../../dev-i18n/pt-PT.json');
let zhMessage = require('../../dev-i18n/zh-CN.json');
let enMessage = require('../../dev-i18n/en-US.json');
@NgModule({
    imports: [
        HttpModule,
        BootstrapModalModule,
        TranslateModule.forRoot(),
        ModalModule.forRoot()
    ],
    exports: [
        ModalModule
    ],
    providers: [
        {
            provide: ErrorHandler,
            useClass: GlobalErrorHandler
        },
        IpcRendererService,
        LocalStorageService,
        LocalCookieService,
        HttpProxyService,
        ConfigService,
        EventAggregator,
        ServiceBase,
        NumberConvertService,
        TypeConvertService,
        LevelConvertService,
        UtilHelper,
        OrgPersonService,
        UrlHelperService,
        LoggerRecordService,
        SocketClient,
        DateFormatHelper,
        SocketService,
        HttpLoginProxyService
    ]
})

export class CoreModule {

    constructor(
        @Optional() @SkipSelf() parentModule: CoreModule,
        translate: TranslateService,
        localStorageService: LocalStorageService,
        configService: ConfigService) {
        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only.'
            );
        }
        try {
            loadMessages(ptMessage);
            loadMessages(zhMessage);
            loadMessages(enMessage);
            configService.get('lang').then(result => {
                let languageArr = ['zh-CN', 'pt-PT', 'en-US', 'es-EC'];
                let lang;
                let storageLang = navigator.language;
                if (languageArr.indexOf(result) > -1) {
                    lang = result;
                } else {
                    if (languageArr.indexOf(storageLang) > -1) {
                        lang = storageLang;
                    } else {
                        lang = 'en-US';
                    }
                }
                translate.use(lang);
                localStorageService.write('lang', lang);
                locale(lang);
            }).catch(error => {
                translate.use('en-US');
                locale('en-US');
            });

        } catch (error) {
            translate.use('en-US');
            locale('en-US');
        }

    }
}
