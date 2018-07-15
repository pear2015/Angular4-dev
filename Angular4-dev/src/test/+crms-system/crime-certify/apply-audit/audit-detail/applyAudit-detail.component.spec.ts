// import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
// import { MockBackend } from '@angular/http/testing';
// import { BaseRequestOptions, Http } from '@angular/http';
// import { ActivatedRoute, Router } from '@angular/router';
// import { NgForm, FormsModule } from '@angular/forms';
// import {
//     DxDataGridComponent,
//     DevExtremeModule,
//     DxPopupModule,
//     DxButtonModule,
//     DxTooltipModule,
//     DxTemplateModule,
//     DxDateBoxModule,
// } from 'devextreme-angular';
// import { TranslateService } from 'ng2-translate';
// import { CollapseModule } from 'ngx-bootstrap';

// import { SocketClient } from '../../../../app/core';
// import { LoggerFactory, ConfigService, HttpProxyService } from '../../../../app/shared';
// import { MockLoggerFactory } from '../../../mock-logger-factory.service';
// import { MockTranslateService } from '../../../mock-translate.service';
// import { ApplyCommonService } from '../../../../app/+business-trends/certificate-apply//apply-common.service';
// import { ApplyAuditService } from '../../../../app/+business-trends/certificate-apply/apply-audit/apply-audit.service';
// import { MockTranslatePipe } from '../../../mock-translate.pipe';
// import { ApplyAuditDetailComponent } from '../../../../app/+business-trends/certificate-apply/apply-audit/apply-audit-detail.component';
// import { DateFormatHelper } from '../../../../app/+business-trends/common/dateformat-helper';

// import { CertificateApplyInfo } from '../../../../app/model/certificate-apply/CertificateApplyInfo';
// import { ApplyBasicInfo } from '../../../../app/model/certificate-apply/ApplyBasicInfo';
// import { ApplyInfo } from '../../../../app/model/certificate-apply/ApplyInfo';
// import { ApplyAndNoticeRelation } from '../../../../app/model/certificate-apply/ApplyAndNoticeRelation';
// import { AttachmentInfo } from '../../../../app/model/certificate-apply/AttachmentInfo';



// describe('ApplyAuditDetailComponent', () => {
//     let certificateApplyInfo = new CertificateApplyInfo(new ApplyBasicInfo(), new ApplyInfo(),
//         [new AttachmentInfo()], [new ApplyAndNoticeRelation()]);

//     let mockLoggerFactory = new MockLoggerFactory();
//     let mockTranslateService = new MockTranslateService();

//     let mockApplyAuditService = {
//         initialCrmsService: () => {
//             return Promise.resolve();
//         }
//     };

//     let mockActivatedRoute = {
//         params: {
//             subscribe: (a) => { }
//         }
//     };

//     let mockApplyCommonService = {
//         initialCrmsService: () => {
//             return Promise.resolve();
//         }
//     };

//     let RouterStub = {
//         navigateByUrl(url: string) {
//             return url;
//         },
//         navigate: () => {

//         }
//     };

//     let socketClient = {
//         SendEvent: () => {

//         }
//     };

//     let fixture: ComponentFixture<ApplyAuditDetailComponent>;
//     let comp: ApplyAuditDetailComponent;
//     let auditService: ApplyAuditService;
//     let commonService: ApplyCommonService;
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
//                 DxDateBoxModule,
//                 CollapseModule
//             ],
//             declarations: [
//                 MockTranslatePipe,
//                 ApplyAuditDetailComponent
//             ],
//             providers: [
//                 MockBackend,
//                 BaseRequestOptions,
//                 ConfigService,
//                 ApplyCommonService,
//                 HttpProxyService,
//                 DateFormatHelper,
//                 ApplyAuditService,
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
//                     provide: ApplyAuditService,
//                     useValue: mockApplyAuditService
//                 },
//                 {
//                     provide: ApplyCommonService,
//                     useValue: mockApplyCommonService
//                 },
//                 {
//                     provide: DxDataGridComponent,
//                     useValue: DxDataGridComponent
//                 },
//                 {
//                     provide: NgForm,
//                     useValue: NgForm
//                 },
//                 {
//                     provide: ActivatedRoute,
//                     useValue: mockActivatedRoute
//                 },
//                 {
//                     provide: Router,
//                     useValue: RouterStub
//                 },
//                 {
//                     provide: SocketClient,
//                     useValue: socketClient
//                 },
//                 {
//                     provide: ApplyInfo,
//                     useValue: ApplyInfo
//                 }

//             ]
//         });

//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(ApplyAuditDetailComponent);
//             comp = fixture.componentInstance;
//             auditService = fixture.debugElement.injector.get(ApplyAuditService);
//             commonService = fixture.debugElement.injector.get(ApplyCommonService);
//             dateformat = fixture.debugElement.injector.get(DateFormatHelper);
//             translate = fixture.debugElement.injector.get(TranslateService);
//             fixture.detectChanges();
//         });
//     }));

//     it('ngOnInit', () => {
//         spyOn(auditService, 'initialCrmsService').and.returnValue(Promise.resolve());
//         spyOn(comp, 'bindNoticeInfoListData');
//         spyOn(commonService, 'initialCrmsService').and.returnValue(Promise.resolve());
//         spyOn(comp, 'bindApplyInfoListData');
//         comp.ngOnInit();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.notices).toBeUndefined();
//             expect(comp.certificateApplyInfo).toBeUndefined();
//         });
//     });

//     it('ngOnInit failed', () => {
//         spyOn(auditService, 'initialCrmsService').and.returnValue(Promise.reject('error'));
//         spyOn(comp, 'bindNoticeInfoListData');
//         spyOn(commonService, 'initialCrmsService').and.returnValue(Promise.reject('error'));
//         spyOn(comp, 'bindApplyInfoListData');
//         comp.ngOnInit();
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.notices).toBeUndefined();
//             expect(comp.certificateApplyInfo).toBeUndefined();
//         });
//     });

//     it('should bind apply info data', () => {
//         spyOn(commonService, 'getApplyInfoByApplyID').and.returnValue(Promise.resolve(certificateApplyInfo));
//         comp.bindApplyInfoListData();
//         fixture.whenStable().then(result => {
//             expect(comp.certificateApplyInfo).toBeDefined();
//         });

//     });

//     it('should bind apply info data failed', () => {
//         spyOn(commonService, 'getApplyInfoByApplyID').and.returnValue(Promise.reject('error'));
//         comp.bindApplyInfoListData();
//         fixture.whenStable().catch(result => {
//             fixture.detectChanges();
//             expect(result).toEqual('error');
//         });
//     });

//     it('should bind notice info data', () => {
//         spyOn(auditService, 'getNoticeInfoListByApplyID').and.returnValue(Promise.resolve());
//         comp.bindNoticeInfoListData();
//     });

//     it('should bind notice info data failed', () => {
//         spyOn(auditService, 'getNoticeInfoListByApplyID').and.returnValue(Promise.reject('error'));
//         comp.bindNoticeInfoListData();
//         fixture.whenStable().catch(result => {
//             fixture.detectChanges();
//             expect(result).toEqual('error');
//         });
//     });

//     it('should select a reson', () => {
//         let e = { selectedItem: { value: '2' } };
//         comp.selectChangedHandle(e);
//         expect(comp.isReason).toBeTruthy();
//     });

//     it('should select a reson', () => {
//         let e = { selectedItem: { value: '3' } };
//         comp.selectChangedHandle(e);
//         expect(comp.isReason).toBeFalsy();
//     });

//     it('should toggle a save button tooltip', () => {
//         comp.defaultVisible = true;
//         comp.toggleDefault();
//     });


//     it('should toggle a cancel button tooltip', () => {
//         comp.backDefaultVisible = true;
//         comp.backToggleDefault();
//     });


//     it('should count audit description character', () => {
//         comp.applyInfo.auditDescription = 'q';
//         comp.countAuditDescriptionCharacter();
//         expect(comp.auditDescriptionLength).toEqual(comp.applyInfo.auditDescription.length);
//     });

//     it('should count audit reason character', () => {
//         comp.applyInfo.auditRejectReason = 'q';
//         comp.countAuditReasonCharacter();
//         expect(comp.auditRejectReasonLength).toEqual(comp.applyInfo.auditRejectReason.length);
//     });


//     it('should on preview', async(() => {
//         spyOn(commonService, 'getImageFormUploaded').and.returnValue(Promise.resolve());
//         let filePath = '';
//         comp.onPreview(filePath);
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.seeSrc).toBeUndefined();
//         });
//     }));

//     it('should on preview failed', async(() => {
//         spyOn(commonService, 'getImageFormUploaded').and.returnValue(Promise.reject('err'));
//         let filePath = '';
//         comp.onPreview(filePath);
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.seeSrc).toEqual('');
//         });
//     }));

//     it('should go back', inject([Router], (router: Router) => {
//         spyOn(router, 'navigateByUrl');
//         comp.goBack();
//     }));

//     it('should show loading panel', () => {
//         comp.showLoadPanel();
//         expect(comp.loadingVisible).toEqual(true);
//     });

//     it('should on hidden', () => {
//         comp.isSaveSucess = true;
//         comp.onHidden();
//     });

//     it('should formatDate', () => {
//         comp.applyInfo.auditTime = new Date;
//         comp.formatDate();
//     });

//     it('should popupOperationInfo success', () => {
//         let isSuccess = true;
//         comp.popupOperationInfo(isSuccess);
//     });

//     it('should popupOperationInfo failed', () => {
//         let isSuccess = false;
//         comp.popupOperationInfo(isSuccess);
//     });

//     it('should onSubmit', inject([NgForm, Router], (ngForm: NgForm, router: Router) => {
//         spyOn(comp, 'showLoadPanel');
//         spyOn(comp, 'setApplyInfoStatus');
//         spyOn(comp, 'formatDate');
//         spyOn(auditService, 'updateCertificateApplyInfo').and.returnValue(Promise.resolve(true));
//         spyOn(comp, 'sendMessagetoSocket');
//         spyOn(router, 'navigateByUrl');
//         comp.onSubmit(ngForm);
//     }));

//     it('should onSubmit', inject([NgForm, Router], (ngForm: NgForm, router: Router) => {
//         spyOn(comp, 'showLoadPanel');
//         spyOn(comp, 'setApplyInfoStatus');
//         spyOn(comp, 'formatDate');
//         spyOn(auditService, 'updateCertificateApplyInfo').and.returnValue(Promise.resolve(false));
//         spyOn(comp, 'sendMessagetoSocket');
//         spyOn(router, 'navigateByUrl');
//         comp.onSubmit(ngForm);
//     }));

//     it('should setApplyInfoStatus ', inject([ApplyInfo], (ApplyInfo: ApplyInfo) => {
//         comp.applyInfo.auditResultID = '1';
//         comp.applyInfo.analysisResultID = '3';
//         comp.setApplyInfoStatus();
//     }));

//     it('should setApplyInfoStatus ', inject([ApplyInfo], (ApplyInfo: ApplyInfo) => {
//         comp.applyInfo.auditResultID = '2';
//         comp.setApplyInfoStatus();
//     }));

//     it('should setApplyInfoStatus ', inject([ApplyInfo], (ApplyInfo: ApplyInfo) => {
//         comp.applyInfo.auditResultID = '1';
//         comp.setApplyInfoStatus();
//     }));


//     it('should setApplyInfoStatus ', inject([ApplyInfo], (ApplyInfo: ApplyInfo) => {
//         comp.applyInfo.auditResultID = '3';
//         comp.setApplyInfoStatus();
//     }));

//     it('should sendMessagetoSocket true', inject([ApplyInfo], (ApplyInfo: ApplyInfo) => {
//         let auditorID: string;
//         ApplyInfo.enteringPersonName = '1';
//         ApplyInfo.analysisPersonName = '1';
//         ApplyInfo.applyStatusID = '4';
//         let content = '';
//         comp.sendMessagetoSocket(auditorID, ApplyInfo);
//         expect(content).toBeDefined();
//     }));

//     it('should sendMessagetoSocket true', inject([ApplyInfo], (ApplyInfo: ApplyInfo) => {
//         let auditorID: string;
//         ApplyInfo.enteringPersonName = '1';
//         ApplyInfo.analysisPersonName = '1';
//         ApplyInfo.applyStatusID = '6';
//         let content = '';
//         comp.sendMessagetoSocket(auditorID, ApplyInfo);
//         expect(content).toBeDefined();
//     }));

//     it('should sendMessagetoSocket false', inject([ApplyInfo, SocketClient], (ApplyInfo: ApplyInfo) => {
//         let auditorID: string;
//         ApplyInfo.enteringPersonName = '1';
//         ApplyInfo.analysisPersonName = '2';
//         ApplyInfo.applyStatusID = '4';
//         let content = '';
//         comp.sendMessagetoSocket(auditorID, ApplyInfo);
//         expect(content).toBeDefined();
//     }));

//     it('should sendMessagetoSocket false', inject([ApplyInfo, SocketClient], (ApplyInfo: ApplyInfo) => {
//         let auditorID: string;
//         ApplyInfo.enteringPersonName = '1';
//         ApplyInfo.analysisPersonName = '2';
//         ApplyInfo.applyStatusID = '6';
//         let content = '';
//         comp.sendMessagetoSocket(auditorID, ApplyInfo);
//         expect(content).toBeDefined();
//     }));
// });
