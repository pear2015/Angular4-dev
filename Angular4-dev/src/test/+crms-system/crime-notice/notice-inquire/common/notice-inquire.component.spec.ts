// import { ComponentFixture, TestBed, async } from '@angular/core/testing';
// import { MockBackend, } from '@angular/http/testing';
// import { BaseRequestOptions, Http } from '@angular/http';
// import { NgForm, FormsModule } from '@angular/forms';
// import {
//     DxDataGridComponent,
//     DevExtremeModule,
//     DxPopupModule,
//     DxButtonModule,
//     DxTooltipModule,
//     DxTemplateModule,
//     DxDateBoxModule
// } from 'devextreme-angular';
// import { TranslateService } from 'ng2-translate';

// import { LoggerFactory, ConfigService, HttpProxyService } from '../../../app/shared';
// import { MockLoggerFactory } from '../../mock-logger-factory.service';
// import { MockTranslateService } from '../../mock-translate.service';
// import { MockTranslatePipe } from '../../mock-translate.pipe';
// import { NoticeInquireComponent } from '../../../app/+business-trends/crime-notice/notice-inquire.component';
// import { CrimeAndNoticeService } from '../../../app/+business-trends/crime-notice/crime-notice.service';
// import { DateFormatHelper } from '../../../app/+business-trends/common/dateformat-helper';


// import { CourtInfo } from '../../../app/model/crime-notice/CourtInfo';

// describe('NoticeInquireComponent', () => {
//     let mockLoggerFactory = new MockLoggerFactory();
//     let mockTranslateService = new MockTranslateService();

//     let mockCrimeAndNoticeService = {};
//     let mockDateFormatHelper = {};

//     // let e = {
//     //     'value': '1'
//     // };

//     let notices = [
//         {
//             'crimeInfo': {},
//             'crimePersonInfo': {},
//             'noticeInfo': {},
//             'attachmentInfo': []
//         }];
//     let notices_Null = [];
//     let result = '';

//     let fixture: ComponentFixture<NoticeInquireComponent>;
//     let comp: NoticeInquireComponent;
//     let service: CrimeAndNoticeService;
//     let translate: TranslateService;
//     let dateformat: DateFormatHelper;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 FormsModule,
//                 DevExtremeModule,
//                 DxPopupModule,
//                 DxButtonModule,
//                 DxTooltipModule,
//                 DxTemplateModule,
//                 DxDateBoxModule
//             ],
//             declarations: [
//                 MockTranslatePipe,
//                 NoticeInquireComponent
//             ],
//             providers: [
//                 MockBackend,
//                 BaseRequestOptions,
//                 ConfigService,
//                 HttpProxyService,
//                 CrimeAndNoticeService,
//                 DateFormatHelper,
//                 {
//                     provide: Http,
//                     useFactory: (backend, options) => {
//                         return new Http(backend, options);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 {
//                     provide: LoggerFactory,
//                     useValue: mockLoggerFactory
//                 },
//                 {
//                     provide: TranslateService,
//                     useValue: mockTranslateService
//                 },
//                 {
//                     provide: CrimeAndNoticeService,
//                     useValue: mockCrimeAndNoticeService
//                 },
//                 {
//                     provide: DateFormatHelper,
//                     useValue: mockDateFormatHelper
//                 },
//                 {
//                     provide: DxDataGridComponent,
//                     useValue: DxDataGridComponent
//                 },
//                 {
//                     provide: NgForm,
//                     useValue: NgForm
//                 }
//             ]
//         });

//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(NoticeInquireComponent);
//             comp = fixture.componentInstance;
//             service = fixture.debugElement.injector.get(CrimeAndNoticeService);
//             translate = fixture.debugElement.injector.get(TranslateService);
//             dateformat = fixture.debugElement.injector.get(DateFormatHelper);
//             fixture.detectChanges();
//         });
//     }));


//     it('ngOnInit', () => {
//         spyOn(service, 'initialCrmsService').and.returnValue(Promise.resolve());
//         spyOn(comp, 'bindCourtListData');
//         comp.ngOnInit();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.courtInfo).toEqual([]);
//         });
//     });

//     it('ngOnInit fail', () => {
//         spyOn(service, 'initialCrmsService').and.returnValue(Promise.reject('error'));
//         comp.ngOnInit();
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.courtInfo).toEqual([]);
//         });
//     });

//     it('should toggle default', () => {
//         comp.defaultVisible = false;
//         comp.toggleDefault();
//     });

//     it('should bind courtList data', () => {
//         spyOn(service, 'getCourtDataForDisplay').and.returnValue(Promise.resolve());
//         comp.bindCourtListData();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             comp.courtInfo = [new CourtInfo()];
//             expect(comp.courtInfo).toBeDefined();
//         });
//     });

//     it('should bind courtList data failed', () => {
//         spyOn(service, 'getCourtDataForDisplay').and.returnValue(Promise.reject('error'));
//         comp.bindCourtListData();
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.courtInfo).toEqual([]);
//         });
//     });

//     // it('should select court', () => {
//     //     comp.selectIndexOfCourt(e);
//     //     // expect(comp.noticequeryInfo.courtID).toEqual(e.selectItem.v);
//     // });

//     it('should popup operation info', () => {
//         comp.popupOperationInfo('1');
//         expect(comp.allowSubmit).toBeFalsy();
//     });

//     it('should init entering time with begin time and end time', () => {
//         spyOn(dateformat, 'RestURLBeignDateTimeFormat');
//         spyOn(dateformat, 'RestURLEndDateTimeFormat');
//         spyOn(comp, 'popupOperationInfo');
//         comp.beginTime = new Date();
//         comp.endTime = new Date();
//         comp.initEnteringTime();
//         expect(dateformat.RestURLBeignDateTimeFormat).toHaveBeenCalled();
//         expect(dateformat.RestURLEndDateTimeFormat).toHaveBeenCalled();
//     });

//     // it('should init entering time without begin time and end time', () => {
//     //     comp.beginTime = null;
//     //     comp.endTime = null;
//     //     comp.initEnteringTime();
//     //     expect(comp.noticequeryInfo.enteringBeginTime).toEqual('1900-01-01 00:00:00');
//     //     expect(comp.noticequeryInfo.enteringEndTime).toEqual('2200-12-12 23:59:59');
//     // });

//     it('should init entering time with begin time but without end time', () => {
//         spyOn(comp, 'popupOperationInfo');

//         comp.beginTime = new Date();
//         comp.endTime = null;
//         comp.initEnteringTime();
//     });

//     it('should init entering time with end time but without begin time', () => {
//         spyOn(comp, 'popupOperationInfo');

//         comp.beginTime = null;
//         comp.endTime = new Date();
//         comp.initEnteringTime();
//     });

//     it('should init entering time when  begin time greater than end time', () => {
//         spyOn(comp, 'popupOperationInfo');

//         comp.beginTime = new Date(2017, 10, 13);
//         comp.endTime = new Date(2000, 10, 1);
//         comp.initEnteringTime();
//     });

//     it('should show load panel', () => {
//         comp.loadingVisible = false;
//         comp.showLoadPanel();
//         expect(comp.loadingVisible).toEqual(true);
//     });

//     it('should onsubmit', () => {
//         spyOn(service, 'getNoticeAndCrimeDataForDisplay').and.returnValue(Promise.resolve(notices));
//         spyOn(comp, 'showLoadPanel');
//         let form = new NgForm([], []);
//         comp.allowSubmit = true;
//         comp.onSubmit(form);
//     });

//     it('should onsubmit failed', () => {
//         spyOn(service, 'getNoticeAndCrimeDataForDisplay').and.returnValue(Promise.reject('error'));
//         let form = new NgForm([], []);
//         comp.allowSubmit = true;
//         comp.onSubmit(form);
//     });

//     it('should onsubmit not be allow', () => {
//         spyOn(comp, 'initEnteringTime');
//         comp.allowSubmit = false;
//         let form = new NgForm([], []);
//         comp.onSubmit(form);
//     });


//     it('should onsubmit without notices', () => {
//         spyOn(service, 'getNoticeAndCrimeDataForDisplay').and.returnValue(Promise.resolve(notices_Null));
//         comp.allowSubmit = true;
//         let form = new NgForm([], []);
//         comp.onSubmit(form);
//     });

//     it('should preview a image', () => {
//         spyOn(service, 'getImageFormUploaded').and.returnValue(Promise.resolve(result));
//         let filePath = '1';
//         comp.onPreview(filePath);
//         fixture.whenStable().then(() => {
//             expect(comp.seeSrc).toEqual(result);
//         });
//     });

//     it('should preview a image failed', () => {
//         spyOn(service, 'getImageFormUploaded').and.returnValue(Promise.reject('error'));
//         let filePath = '1';
//         comp.onPreview(filePath);
//         fixture.whenStable().catch(() => {
//             expect(comp.seeSrc).toEqual('');
//         });

//     });

// });
