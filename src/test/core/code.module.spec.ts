// import { TestBed, inject, async } from '@angular/core/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { CoreModule } from '../../app/core/core.module';
// import { TranslateModule, TranslateService } from 'ng2-translate';
// import { LoggerFactory, LocalStorageService, Logger } from '../../app/shared';
// import * as jsnlog from 'jsnlog';



// describe('CoreModule test', () => {
//     let JL = jsnlog.JL;
//     let loggerFactory = {
//         configLog: (logSvrUrl) => {
//             let consoleAppender = JL.createConsoleAppender('consoleAppender');
//             let ajaxAppender = JL.createAjaxAppender('ajaxAppender');
//             JL().setOptions(
//                 {
//                     appenders: [
//                         consoleAppender,
//                         ajaxAppender
//                     ]
//                 }
//             );
//         },
//         init: () => {
//         },
//         getLogger: (categoryName): Logger => {
//             return JL('categoryName');
//         }
//     };
//     let translateService = {
//         addLangs: ([]) => {
//         },
//         getLangs: () => {
//             return 'ANCB';
//         },
//         use: (storageLang) => {
//         },
//         getBrowserLang: () => {
//         }
//     };
//     let localStorageService = {
//         read: () => {
//         }
//     };
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [],
//             imports: [
//                 TranslateModule.forRoot(),
//             ],
//             providers: [CoreModule,
//                 {
//                     provide: LoggerFactory,
//                     useValue: loggerFactory
//                 }, {
//                     provide: LocalStorageService,
//                     useValue: localStorageService
//                 }, {
//                     provide: jsnlog,
//                     useValue: jsnlog
//                 }, {
//                     provide: TranslateService,
//                     useValue: translateService
//                 }
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA],
//         });
//     }));




//     // CoreModule.constructor
//     it('loggerFactory init', inject([CoreModule, LoggerFactory], (comp: CoreModule, LoggerFactory) => {

//         CoreModule.constructor();
//     }));
// });
