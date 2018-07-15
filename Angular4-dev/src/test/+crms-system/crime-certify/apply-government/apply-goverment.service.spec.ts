// import { inject, TestBed, async } from '@angular/core/testing';
// import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';

// import { ApplyGovermentService } from '../../../app/+business-trends/certificate-apply/apply-goverment.service';
// import { LoggerFactory, HttpProxyService, ConfigService } from '../../../app/shared';
// import { MockLoggerFactory } from '../../mock-logger-factory.service';

// import { CertificateApplyInfo } from '../../../app/model/certificate-apply/CertificateApplyInfo';


// describe('ApplyGovermentService', () => {

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
//                 ApplyGovermentService,
//                 {
//                     provide: LoggerFactory,
//                     useValue: mockLoggerFactory
//                 }
//             ]
//         });
//     });

//     it('should be injected', inject([ApplyGovermentService], (applyGovermentService: ApplyGovermentService) => {
//         expect(applyGovermentService).toBeDefined();
//     }));

//     it('service should initial crime service', inject([MockBackend, ConfigService, ApplyGovermentService],
//         (mockBackend: MockBackend, configService: ConfigService, applyGovermentService: ApplyGovermentService) => {
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
//             applyGovermentService.initialCrmsService().then(result => {
//                 expect(result).toBeUndefined();
//             });
//         }));


//     it('service should initial applyGovermentService without url', inject([MockBackend, ConfigService, ApplyGovermentService],
//         (mockBackend: MockBackend, configService: ConfigService, applyGovermentService: ApplyGovermentService) => {
//             mockBackend.connections.subscribe(
//                 (mockConnection: MockConnection) => {
//                     mockConnection.mockRespond(new Response(
//                         new ResponseOptions({
//                             body: '{"errorKey":"http://localhost"}',
//                             status: 200,
//                         })
//                     ));

//                 });
//             applyGovermentService.initialCrmsService().catch(result => {
//                 expect(result).toEqual('can not read apiBaseUrl config.');
//             });
//         }));


//     it('should saveCertificateApplyInfo', async(inject([ApplyGovermentService, MockBackend],
//         (applyGovermentService: ApplyGovermentService, mockBackend: MockBackend) => {
//             let certificateApplyInfo: CertificateApplyInfo;
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(certificateApplyInfo),
//                         status: 200
//                     })
//                 ));
//             });
//             applyGovermentService.saveCertificateApplyInfo(certificateApplyInfo).then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));



//     it('should getApplyPurposeForDisplay', async(inject([ApplyGovermentService, MockBackend],
//         (applyGovermentService: ApplyGovermentService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         status: 200
//                     })
//                 ));
//             });
//             applyGovermentService.getApplyPurposeForDisplay().then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

// });
