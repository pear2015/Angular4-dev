// import { inject, TestBed, async } from '@angular/core/testing';
// import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';

// import { ApplyCommonService } from '../../../app/+business-trends/certificate-apply/apply-common.service';
// import { LoggerFactory, HttpProxyService, ConfigService } from '../../../app/shared';
// import { MockLoggerFactory } from '../../mock-logger-factory.service';



// describe('ApplyCommonService', () => {

//     let mockLoggerFactory = new MockLoggerFactory();

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
//                 HttpProxyService,
//                 ConfigService,
//                 ApplyCommonService,
//                 {
//                     provide: LoggerFactory,
//                     useValue: mockLoggerFactory
//                 }
//             ]
//         });
//     });


//     it('should be injected', inject([ApplyCommonService], (applyCommonService: ApplyCommonService) => {
//         expect(ApplyCommonService).toBeDefined();
//     }));


//     it('should initialCrmsService', inject([MockBackend, ConfigService, ApplyCommonService],
//         (mockBackend: MockBackend, configService: ConfigService, applyCommonService: ApplyCommonService) => {
//             mockBackend.connections.subscribe(
//                 (mockConnection: MockConnection) => {
//                     if (mockConnection.request.url === './main-conf.json') {
//                         mockConnection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: '{"apiBaseUrl":"http://localhost"}',
//                                 status: 200,
//                             })
//                         ));
//                     }
//                 });
//             applyCommonService.initialCrmsService().then(result => {
//                 expect(result).toBeUndefined();
//             });
//         }));

//     it('service should initial applyGovermentService without url', inject([MockBackend, ConfigService, ApplyCommonService],
//         (mockBackend: MockBackend, configService: ConfigService, applyCommonService: ApplyCommonService) => {
//             mockBackend.connections.subscribe(
//                 (mockConnection: MockConnection) => {
//                     mockConnection.mockRespond(new Response(
//                         new ResponseOptions({
//                             body: '{"errorKey":"http://localhost"}',
//                             status: 200,
//                         })
//                     ));

//                 });
//             applyCommonService.initialCrmsService().catch(result => {
//                 expect(result).toEqual('can not read apiBaseUrl config.');
//             });
//         }));

//     it('should getApplyPurposeList', async(inject([ApplyCommonService, MockBackend],
//         (applyCommonService: ApplyCommonService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         status: 200
//                     })
//                 ));
//             });
//             applyCommonService.getApplyPurposeList().then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('should getPersonInfoListByNumberAndName', async(inject([ApplyCommonService, MockBackend],
//         (applyCommonService: ApplyCommonService, mockBackend: MockBackend) => {
//             let certificateNumber: String, firstName: String, lastName: string;
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         status: 200
//                     })
//                 ));
//             });
//             applyCommonService.getPersonInfoListByNumberAndName(certificateNumber, firstName, lastName).then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('should getApplyInfoByApplyID', async(inject([ApplyCommonService, MockBackend],
//         (applyCommonService: ApplyCommonService, mockBackend: MockBackend) => {
//             let applyID: string;
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         status: 200
//                     })
//                 ));
//             });
//             applyCommonService.getApplyInfoByApplyID(applyID).then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('should getNoticeListByNumberAndName', async(inject([ApplyCommonService, MockBackend],
//         (applyCommonService: ApplyCommonService, mockBackend: MockBackend) => {
//             let certificateNumber: string, firstName: string, lastName: string;
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         status: 200
//                     })
//                 ));
//             });
//             applyCommonService.getNoticeListByNumberAndName(certificateNumber, firstName, lastName).then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('should getImageFormUploaded', async(inject([ApplyCommonService, MockBackend],
//         (applyCommonService: ApplyCommonService, mockBackend: MockBackend) => {
//             let filePath: string;
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         status: 200
//                     })
//                 ));
//             });
//             applyCommonService.getImageFormUploaded(filePath).then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

// });
