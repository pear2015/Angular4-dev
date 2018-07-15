// import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
// import { MockBackend, } from '@angular/http/testing';
// import { Router } from '@angular/router';
// import { BaseRequestOptions, Http } from '@angular/http';
// import {
//     DxDataGridComponent,
//     DevExtremeModule,
//     DxButtonModule,
//     DxTooltipModule,
//     DxTemplateModule,
// } from 'devextreme-angular';
// import { TranslateService } from 'ng2-translate';

// import { LoggerFactory, ConfigService, HttpProxyService } from '../../../../app/shared';
// import { MockLoggerFactory } from '../../../mock-logger-factory.service';
// import { MockTranslateService } from '../../../mock-translate.service';
// import { ApplyAuditService } from '../../../../app/+business-trends/certificate-apply/apply-audit/apply-audit.service';
// import { MockTranslatePipe } from '../../../mock-translate.pipe';
// import { ApplyAuditComponent } from '../../../../app/+business-trends/certificate-apply/apply-audit/apply-audit.component';
// import { DateFormatHelper } from '../../../../app/+business-trends/common/dateformat-helper';

// describe('ApplyAuditComponent Test', () => {
//     let mockLoggerFactory = new MockLoggerFactory();
//     let mockTranslateService = new MockTranslateService();

//     let RouterStub = {
//         navigateByUrl(url: string) {
//             return url;
//         },
//         navigate: () => {

//         }
//     };

//     let mockApplyAuditService = {
//         initialCrmsService: function () {
//             return Promise.resolve();
//         }
//     };

//     let auditInfoList = [];

//     let DxDataGridComponent = {

//         selectedRowKeys: [{
//             age: 2,
//             career: 'string',
//             certificateNumber: 'string',
//             certificateType: 'string',
//             certificateValidity: 'string',
//             cityName: 'string',
//             communityName: 'string',
//             contractPhone: 'string',
//             countryName: 'string',
//             description: 'string',
//             detailAddress: 'string',
//             firstName: 'string',
//             fatherCertificateNumber: 'string',
//             fatherFamilyName: 'string',
//             fatherLastName: 'string',
//             fatherNameSoundex: 'string',
//             lastName: 'string',
//             marriageID: 'string',
//             motherCertificateNumber: 'string',
//             motherFamilyName: 'string',
//             motherLastName: 'string',
//             motherNameSoundex: 'string',
//             nation: 'string',
//             otherFeature: 'string',
//             profession: 'string',
//             provinceName: 'string',
//             sexID: 'string',
//             dateOfBirth: new Date,
//             countryOfCitizenship: 'string',
//             credentialsIssuePlace: 'string',
//             credentialsIssueDate: new Date,
//             sexName: 'string',
//             marriageName: 'string',
//             registrationPhoto: 'any',
//         }]
//     };

//     let fixture: ComponentFixture<ApplyAuditComponent>;
//     let comp: ApplyAuditComponent;
//     let service: ApplyAuditService;
//     let translate: TranslateService;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 DevExtremeModule,
//                 DxButtonModule,
//                 DxTooltipModule,
//                 DxTemplateModule,
//             ],
//             declarations: [
//                 MockTranslatePipe,
//                 ApplyAuditComponent
//             ],
//             providers: [
//                 MockBackend,
//                 BaseRequestOptions,
//                 ConfigService,
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
//                     provide: DxDataGridComponent,
//                     useValue: DxDataGridComponent
//                 },
//                 {
//                     provide: Router,
//                     useValue: RouterStub
//                 }

//             ]
//         });

//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(ApplyAuditComponent);
//             comp = fixture.componentInstance;
//             service = fixture.debugElement.injector.get(ApplyAuditService);
//             translate = fixture.debugElement.injector.get(TranslateService);
//             fixture.detectChanges();
//         });
//     }));

//     it('ngOnInit', async(() => {
//         spyOn(service, 'initialCrmsService').and.returnValue(Promise.resolve(auditInfoList));
//         spyOn(comp, 'bindWaitAuditApplyInfoData');
//         comp.ngOnInit();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.auditInfoList).toBeUndefined();
//         });
//     }));

//     it('ngOnInit failed', async(() => {
//         spyOn(service, 'initialCrmsService').and.returnValue(Promise.reject('error'));
//         spyOn(comp, 'bindWaitAuditApplyInfoData');
//         comp.ngOnInit();
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.auditInfoList).toBeUndefined();
//         });
//     }));

//     it('should bindWaitAuditApplyInfoData', async(() => {
//         spyOn(service, 'getWaitAuditApplyInfoForDisplay').and.returnValue(Promise.resolve(auditInfoList));
//         comp.bindWaitAuditApplyInfoData();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.auditInfoList).toEqual([]);
//         });
//     }));

//     it('should bindWaitAuditApplyInfoData failed', async(() => {
//         spyOn(service, 'getWaitAuditApplyInfoForDisplay').and.returnValue(Promise.reject('error'));
//         comp.bindWaitAuditApplyInfoData();
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.auditInfoList).toEqual([]);
//         });
//     }));

//     it('should navigateToAuditDetail', inject([Router, DxDataGridComponent],
//  (router: Router, dxDataGridComponent: DxDataGridComponent) => {
//         spyOn(router, 'navigateByUrl');
//         comp.auditInfoGrids = dxDataGridComponent;
//         comp.navigateToAuditDetail();
//     }));


//     it('should selectChangedHandle', () => {
//         comp.isAllow = true;
//         comp.selectChangedHandle();
//         expect(comp.isAllow).toEqual(false);
//     });
// });
