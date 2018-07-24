// import { inject, TestBed, async } from '@angular/core/testing';
// import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { TranslateService } from 'ng2-translate';

// import { MockTranslateService } from '../../../mock-translate.service';
// import { MockLoggerFactory } from '../../../mock-logger-factory.service';
// import { ApplyAuditService } from '../../../../app/+business-trends/certificate-apply/apply-audit/apply-audit.service';
// import { ConfigService, HttpProxyService, LoggerFactory } from '../../../../app/shared';

// import { CertificateApplyInfo } from '../../../../app/model/certificate-apply/CertificateApplyInfo';


// describe('AppealQuantityService', () => {
//     let mockTranslateService = new MockTranslateService();
//     let mockLoggerFactory = new MockLoggerFactory();


//     let noticeInfoList = [
//         {
//             applyPurposeID: '1',
//             name: '持枪证'
//         },
//         {
//             applyPurposeID: '2',
//             name: '驾驶证'
//         },
//     ];

//     let certificateApplyInfo = {
//         applyBasicInfo: {},
//         applyInfo: {},
//         attachmentInfoList: [],
//         applyAndNoticeRelationList: [],
//     };

//     let waitAuditApplyInfo = [{}];

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 {
//                     provide: Http,
//                     useFactory: (backend, options) => {
//                         return new Http(backend, options);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 MockBackend,
//                 BaseRequestOptions,
//                 ConfigService,
//                 HttpProxyService,
//                 {
//                     provide: LoggerFactory,
//                     useValue: mockLoggerFactory
//                 },
//                 {
//                     provide: TranslateService,
//                     useValue: mockTranslateService
//                 },
//                 ApplyAuditService,
//             ]
//         });
//     });

//     it('should be injected', inject([ApplyAuditService], (applyAuditService: ApplyAuditService) => {
//         expect(ApplyAuditService).toBeDefined();
//     }));

//     it('should get initial data', async(inject([MockBackend, ApplyAuditService],
//         (mockBackend: MockBackend, service: ApplyAuditService) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: '{"apiBaseUrl": "http://localhost"}',
//                         status: 200
//                     })
//                 ));
//             });
//             service.initialCrmsService().then(result => {
//                 expect(result).toBeUndefined();
//             });
//         })));

//     it('should get initial data failed', async(inject([MockBackend, ApplyAuditService],
//         (mockBackend: MockBackend, service: ApplyAuditService) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: '{"errorKey": "http://localhost"}',
//                         status: 200
//                     })
//                 ));
//             });
//             service.initialCrmsService().catch(result => {
//                 expect(result).toEqual('can not read apiBaseUrl config.');
//             });
//         })));

//     it('should getNoticeInfoListByApplyID', async(inject([MockBackend, ApplyAuditService],
//         (mockBackend: MockBackend, service: ApplyAuditService) => {
//             let applyID: string;
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(applyID),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getNoticeInfoListByApplyID(applyID).catch(result => {
//                 expect(result).toEqual(noticeInfoList);
//             });
//         })));

//     it('should getWaitAuditApplyInfoForDisplay', async(inject([MockBackend, ApplyAuditService],
//         (mockBackend: MockBackend, service: ApplyAuditService) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(waitAuditApplyInfo),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getWaitAuditApplyInfoForDisplay().catch(result => {
//                 expect(result).toEqual(waitAuditApplyInfo);
//             });
//         })));

//     it('should updateCertificateApplyInfo', async(inject([MockBackend, ApplyAuditService],
//         (mockBackend: MockBackend, service: ApplyAuditService) => {
//             let CertificateApplyInfo: CertificateApplyInfo;
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(certificateApplyInfo),
//                         status: 200
//                     })
//                 ));
//             });
//             service.updateCertificateApplyInfo(CertificateApplyInfo).catch(result => {
//                 expect(result).toEqual(certificateApplyInfo);
//             });
//         })));
// }
// );
