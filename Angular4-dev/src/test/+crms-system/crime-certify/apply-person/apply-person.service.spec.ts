// import { MockLoggerFactory } from '../../../test/mock-logger-factory.service';
// import { TestBed, inject, async } from '@angular/core/testing';

// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
// import { ConfigService, HttpProxyService, LoggerFactory } from '../../../app/shared';
// import { ApplyPersonService } from '../../../app/+business-trends/certificate-apply/apply-person.service';
// import { CertificateApplyInfo } from '../../../app/model/certificate-apply/CertificateApplyInfo';
// import { ApplyBasicInfo } from '../../../app/model/certificate-apply/ApplyBasicInfo';
// import { ApplyInfo } from '../../../app/model/certificate-apply/ApplyInfo';

// import { ApplyAndNoticeRelation } from '../../../app/model/certificate-apply/ApplyAndNoticeRelation';
// import { AttachmentInfo } from '../../../app/model/crime-notice/AttachmentInfo';


// describe('ApplyPersonService', () => {
//     let mockLoggerFactory = new MockLoggerFactory();
//     let certificateApplyInfo = new CertificateApplyInfo(new ApplyBasicInfo(), new ApplyInfo(),
//         [new AttachmentInfo()], [new ApplyAndNoticeRelation()]);
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 ApplyPersonService,
//                 MockBackend,
//                 BaseRequestOptions,
//                 ConfigService,
//                 HttpProxyService,
//                 {
//                     provide: Http,
//                     useFactory: (backend, options) => {
//                         return new Http(backend, options);
//                     },
//                     deps: [MockBackend, BaseRequestOptions],

//                 },
//                 {
//                     provide: LoggerFactory,
//                     useValue: mockLoggerFactory
//                 },
//             ],
//         });
//     });


//     it('service should be injected', inject([ApplyPersonService], (service) => {
//         expect(service).toBeDefined();
//     }));


//     it('service should  be initial', inject([MockBackend, ConfigService, ApplyPersonService],
//         (mockBackend: MockBackend, configService: ConfigService, service: ApplyPersonService) => {
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
//             service.initialCrmsService().then(result => {
//                 expect(result).toBeUndefined();
//             });
//         }));



//     it('service should be initial  url', inject([MockBackend, ConfigService, ApplyPersonService],
//         (mockBackend: MockBackend, configService: ConfigService, service: ApplyPersonService) => {
//             mockBackend.connections.subscribe(
//                 (mockConnection: MockConnection) => {
//                     mockConnection.mockRespond(new Response(
//                         new ResponseOptions({
//                             body: '{"errorKey":"http://localhost"}',
//                             status: 200,
//                         })
//                     ));

//                 });
//             service.initialCrmsService().catch(result => {
//                 expect(result).toEqual('can not read apiBaseUrl config.');
//             });
//         }));


//     it('service should  be get data', async(inject([ApplyPersonService, ConfigService, MockBackend],
//         (service: ApplyPersonService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(certificateApplyInfo),
//                         status: 200
//                     })
//                 ));
//             });
//             service.saveCertificateApplyInfo(certificateApplyInfo).then(result => {
//                 expect(result).toBeDefined();

//             });
//         })));
// });
