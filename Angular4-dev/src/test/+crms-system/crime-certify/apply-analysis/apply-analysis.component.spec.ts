// import { ComponentFixture, TestBed, async } from '@angular/core/testing';
// import { ElementRef, NgZone, IterableDiffers, } from '@angular/core';

// import { MockBackend } from '@angular/http/testing';
// import { BaseRequestOptions, Http } from '@angular/http';
// import { NgForm, FormsModule } from '@angular/forms';
// import {
//     DxDataGridComponent,
//     DevExtremeModule,
//     DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost
// } from 'devextreme-angular';
// import { TranslateService } from 'ng2-translate';
// import { CollapseModule } from 'ngx-bootstrap';  // ngx-bootstrap

// import { LoggerFactory, ConfigService, HttpProxyService, EventAggregator } from '../../../../app/shared';
// import { SocketClient } from '../../../../app/core';

// import { MockLoggerFactory } from '../../../mock-logger-factory.service';
// import { MockTranslateService } from '../../../mock-translate.service';
// import { MockTranslatePipe } from '../../../mock-translate.pipe';

// import { ApplyAnalysisComponent } from '../../../../app/+business-trends/certificate-apply/apply-analysis/apply-analysis.component';
// import { ApplyAnalysisService } from '../../../../app/+business-trends/certificate-apply/apply-analysis/apply-analysis.service';
// import { ApplyCommonService } from '../../../../app/+business-trends/certificate-apply/apply-common.service';
// import { DateFormatHelper } from '../../../../app/+business-trends/common/dateformat-helper';
// import { EnumInfo } from '../../../../app/+business-trends/common/enum/enuminfo';

// import { CertificateApplyInfo } from '../../../../app/model/certificate-apply/CertificateApplyInfo';
// import { ApplyBasicInfo } from '../../../../app/model/certificate-apply/ApplyBasicInfo';
// import { ApplyInfo } from '../../../../app/model/certificate-apply/ApplyInfo';
// import { ApplyAndNoticeRelation } from '../../../../app/model/certificate-apply/ApplyAndNoticeRelation';
// import { AttachmentInfo } from '../../../../app/model/certificate-apply/AttachmentInfo';

// describe('ApplyAnalysisComponent', () => {

//     let e_value_three = {
//         selectedItem: {
//             value: '3',
//         }
//     };
//     let e_value_other = {
//         selectedItem: {
//             value: '1',
//         }
//     };

//     let certificateApplyInfo = new CertificateApplyInfo(new ApplyBasicInfo(), new ApplyInfo(),
//         [new AttachmentInfo()], [new ApplyAndNoticeRelation()]);

//     let mockLoggerFactory = new MockLoggerFactory();
//     let mockTranslateService = new MockTranslateService();

//     let mockApplyAnalysisService = {};
//     let mockApplyCommonService = {};
//     let mockDateFormatHelper = {};
//     let mockEnumInfo = {};


//     let fixture: ComponentFixture<ApplyAnalysisComponent>;
//     let comp: ApplyAnalysisComponent;
//     let service: ApplyAnalysisService;
//     let commonService: ApplyCommonService;
//     let eventAggregator: EventAggregator;
//     let socketClient: SocketClient;
//     let translate: TranslateService;
//     let dateformat: DateFormatHelper;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 FormsModule,
//                 DevExtremeModule,
//                 CollapseModule
//             ],
//             declarations: [
//                 MockTranslatePipe,
//                 ApplyAnalysisComponent
//             ],
//             providers: [
//                 MockBackend,
//                 BaseRequestOptions,
//                 ConfigService,
//                 HttpProxyService,
//                 EventAggregator,
//                 SocketClient,
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
//                     provide: ApplyAnalysisService,
//                     useValue: mockApplyAnalysisService
//                 },

//                 {
//                     provide: ApplyCommonService,
//                     useValue: mockApplyCommonService
//                 },
//                 {
//                     provide: EnumInfo,
//                     useValue: mockEnumInfo
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
//                 },
//             ]
//         });

//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(ApplyAnalysisComponent);
//             comp = fixture.componentInstance;
//             service = fixture.debugElement.injector.get(ApplyAnalysisService);
//             commonService = fixture.debugElement.injector.get(ApplyCommonService);
//             eventAggregator = fixture.debugElement.injector.get(EventAggregator);
//             socketClient = fixture.debugElement.injector.get(SocketClient);
//             dateformat = fixture.debugElement.injector.get(DateFormatHelper);
//             translate = fixture.debugElement.injector.get(TranslateService);


//             fixture.detectChanges();
//         });

//     }));

//     it('ngOnInit', () => {
//         spyOn(eventAggregator, 'subscribe');
//         spyOn(comp, 'loadData');
//         comp.ngOnInit();
//     });

//     it('should load data', () => {
//         spyOn(comp, 'loadApplyInfoData');
//         spyOn(comp, 'loadApplyNoticeData');
//         comp.loadData();
//         expect(comp.loadApplyInfoData).toHaveBeenCalled();
//         expect(comp.loadApplyNoticeData).toHaveBeenCalled();
//     });

//     it('should load apply info data', () => {
//         spyOn(service, 'initialCrmsService').and.returnValue(Promise.resolve());
//         comp.loadApplyInfoData();
//     });

//     it('should load apply info data failed', () => {
//         spyOn(service, 'initialCrmsService').and.returnValue(Promise.reject('error'));
//         comp.loadApplyInfoData();
//         fixture.whenStable().catch(result => {
//             expect(result).toEqual('error');
//         });
//     });

//     it('should load apply notice data', () => {
//         spyOn(commonService, 'initialCrmsService').and.returnValue(Promise.resolve());
//         spyOn(comp, 'getAnalysisTasks');
//         comp.loadApplyNoticeData();
//     });

//     it('should load apply notice data failed', () => {
//         spyOn(commonService, 'initialCrmsService').and.returnValue(Promise.reject('error'));
//         comp.loadApplyNoticeData();
//         fixture.whenStable().catch(result => {
//             expect(result).toEqual('error');
//         });
//     });

//     it('should handle select crime recode to equal three', () => {
//         comp.selectChangedHandle(e_value_three);
//         expect(comp.isOtherCondition).toBeTruthy();
//     });

//     it('should handle select crime recode to not equal three', () => {
//         comp.selectChangedHandle(e_value_other);
//         expect(comp.isOtherCondition).toBeFalsy();
//     });

//     it('should bind apply info data', () => {
//         spyOn(commonService, 'getApplyInfoByApplyID').and.returnValue(Promise.resolve(certificateApplyInfo));
//         spyOn(comp, 'bindNoticeInfoListData');
//         comp.bindApplyInfoData('1');
//         fixture.whenStable().then(result => {
//             expect(comp.bindNoticeInfoListData).toHaveBeenCalled();
//         });

//     });

//     it('should bind apply info data failed', () => {
//         spyOn(commonService, 'getApplyInfoByApplyID').and.returnValue(Promise.reject('error'));
//         comp.bindApplyInfoData('1');
//         fixture.whenStable().catch(result => {
//             expect(result).toEqual('error');
//         });
//     });

//     it('should bind notice info data ', () => {
//         spyOn(service, 'getNoticeInfoListByNumberAndName').and.returnValue(Promise.resolve());
//         comp.bindNoticeInfoListData();
//         expect(comp.notices).toBeDefined();
//     });

//     it('should bind notice info data failed ', () => {
//         spyOn(service, 'getNoticeInfoListByNumberAndName').and.returnValue(Promise.reject('error'));
//         comp.bindNoticeInfoListData();
//         fixture.whenStable().catch(result => {
//             expect(result).toEqual('error');
//         });
//     });

//     it('should preview a image', () => {
//         spyOn(commonService, 'getImageFormUploaded').and.returnValue(Promise.resolve());
//         comp.onPreview('filePath');
//         expect(comp.pupopSee).toBeTruthy();
//         expect(comp.seeSrc).toBeDefined();
//     });

//     it('should preview a image failed', () => {
//         spyOn(commonService, 'getImageFormUploaded').and.returnValue(Promise.reject('error'));
//         comp.onPreview('filePath');
//         fixture.whenStable().catch(result => {
//             expect(result).toEqual('error');
//             expect(comp.pupopSee).toBeTruthy();
//         });

//     });

//     it('should format date', () => {
//         spyOn(dateformat, 'HoursMinutesDateTimeFormat');
//         comp.formatDate();
//     });

//     it('should bind notice relation data', () => {
//         let crimeNoticeGrids = new DxDataGridComponent(new ElementRef(''), new NgZone(''),
//             new DxTemplateHost(), new WatcherHelper(),
//             new IterableDifferHelper(new IterableDiffers([])), new NestedOptionHost());
//         crimeNoticeGrids.selectedRowKeys = [
//             { noticeInfo: { noticeID: '1' } },
//             { noticeInfo: { noticeID: '2' } }
//         ];
//         comp.crimeNoticeGrids = crimeNoticeGrids;
//         comp.applyID = '3';

//         comp.bindNoticeRelationData();
//         expect(comp.noticeIDList).not.toBeNull();
//         expect(comp.applyAndNoticeRelationList).not.toBeNull();
//     });

//     it('should bind notice relation data when noticeIDs_Null', () => {
//         let crimeNoticeGrids = new DxDataGridComponent(new ElementRef(''), new NgZone(''),
//             new DxTemplateHost(), new WatcherHelper(),
//             new IterableDifferHelper(new IterableDiffers([])), new NestedOptionHost());
//         crimeNoticeGrids.selectedRowKeys = [];
//         comp.crimeNoticeGrids = crimeNoticeGrids;

//         comp.bindNoticeRelationData();

//     });

//     it('should hidden loading panel after 3s', () => {
//         comp.onShown();
//         expect(comp.loadingVisible).toBeFalsy();
//     });

//     it('should hidden loading panel', () => {
//         spyOn(eventAggregator, 'publish');
//         spyOn(comp, 'popupOperationInfo');
//         spyOn(comp, 'toSetNullForData');
//         spyOn(comp, 'loadData');
//         spyOn(comp, 'isHasNextTask');
//         comp.isSaveSuccess = true;
//         comp.onHidden();
//         expect(comp.loadingVisible).toBeFalsy();
//     });

//     it('should hidden loading panel when isSaveSuccess_False', () => {
//         comp.isSaveSuccess = false;
//         comp.onHidden();
//         expect(comp.loadingVisible).toBeFalsy();
//     });

//     it('should show loading panel', () => {
//         comp.showLoadPanel();
//         expect(comp.loadingVisible).toBeTruthy();
//     });

//     it('should popup operation info success', () => {
//         let isSucess = true;
//         comp.popupOperationInfo(isSucess);
//         expect(comp.operationInfo).toEqual('save success');
//     });

//     it('should popup operation info failure', () => {
//         let isSucess = false;
//         comp.popupOperationInfo(isSucess);
//         expect(comp.operationInfo).toEqual('save failure');
//     });

//     it('should on submit', () => {
//         spyOn(service, 'updateCertificateApplyInfo').and.returnValue(Promise.resolve(true));
//         spyOn(comp, 'showLoadPanel');
//         spyOn(comp, 'bindNoticeRelationData');
//         spyOn(comp, 'formatDate');
//         let form = new NgForm([], []);
//         comp.certificateApplyInfo = new CertificateApplyInfo(new ApplyBasicInfo(), new ApplyInfo(),
//             [new AttachmentInfo()], [new ApplyAndNoticeRelation()]);

//         comp.onSubmit(form);
//         fixture.whenStable().then(result => {
//             expect(comp.isSaveSuccess).toBeTruthy();
//         });
//     });

//     it('should on submit failed', () => {
//         spyOn(service, 'updateCertificateApplyInfo').and.returnValue(Promise.reject('error'));
//         spyOn(comp, 'showLoadPanel');
//         spyOn(comp, 'bindNoticeRelationData');
//         spyOn(comp, 'formatDate');
//         let form = new NgForm([], []);
//         comp.certificateApplyInfo = new CertificateApplyInfo(new ApplyBasicInfo(), new ApplyInfo(),
//             [new AttachmentInfo()], [new ApplyAndNoticeRelation()]);

//         comp.onSubmit(form);
//         fixture.whenStable().catch(result => {
//             expect(result).toEqual('error');
//         });
//     });

//     it('should set null for data', () => {
//         comp.toSetNullForData();
//         expect(comp.applyInfo).toBeNull();
//     });

//     it('should has nest task', () => {
//         spyOn(comp, 'sendLazyMessage');
//         comp.certificateApplyInfo = null;
//         comp.isHasNextTask();
//         expect(comp.sendLazyMessage).toHaveBeenCalled();
//     });
//     it('should has nest task when certificateApplyInfo_Null', () => {
//         spyOn(comp, 'sendLazyMessage');
//         comp.certificateApplyInfo = new CertificateApplyInfo(new ApplyBasicInfo(), new ApplyInfo(),
//             [new AttachmentInfo()], [new ApplyAndNoticeRelation()]);
//         comp.isHasNextTask();
//     });

//     it('should get analysis tasks', () => {
//         spyOn(service, 'getAnalystTasksByAnalystID').and.returnValue(Promise.resolve());
//         spyOn(comp, 'bindApplyInfoData');
//         comp.getAnalysisTasks('zhangsan');
//         expect(comp.applyAndAnalystRelation).toBeDefined();
//     });

//     it('should get analysis tasks failed', () => {
//         spyOn(service, 'getAnalystTasksByAnalystID').and.returnValue(Promise.reject('error'));
//         comp.getAnalysisTasks('zhangsan');
//         fixture.whenStable().catch(result => {
//             expect(result).toEqual('error');
//         });
//     });

//     it('should send lazy message', () => {
//         spyOn(socketClient, 'SendEvent');
//         comp.sendLazyMessage();
//     });

// });
