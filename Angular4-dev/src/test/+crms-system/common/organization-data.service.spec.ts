// import { TestBed, inject, async } from '@angular/core/testing';
// import { OrganizationService } from '../../../app/+business-trends/certificate-apply/organization-data.service';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
// import { ConfigService, HttpProxyService, LoggerFactory } from '../../../app/shared';
// import { MockLoggerFactory } from '../../../test/mock-logger-factory.service';
// describe('OrganizationService', () => {
//     beforeEach(() => {
//         let mockLoggerFactory = new MockLoggerFactory();
//         TestBed.configureTestingModule({
//             providers: [
//                 OrganizationService,
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

//     it('the service should be injected', inject([OrganizationService], (service) => {
//         expect(service).toBeDefined();
//     }));

//     it('initialOrganizationService should initial crime service', inject([MockBackend, ConfigService, OrganizationService],
//         (mockBackend: MockBackend, configService: ConfigService, service: OrganizationService) => {
//             mockBackend.connections.subscribe(
//                 (mockConnection: MockConnection) => {
//                     if (mockConnection.request.url === './main-conf.json') {
//                         mockConnection.mockRespond(new Response(
//                             new ResponseOptions({
//                                 body: '{"OrganizationUrl":"http://localhost"}',
//                                 status: 200,
//                             })
//                         ));
//                     }
//                 });
//             service.initialOrganizationService().then(result => {
//                 expect(result).toBeUndefined();
//             });
//         }));



//     it('service should initial  url', inject([MockBackend, ConfigService, OrganizationService],
//         (mockBackend: MockBackend, configService: ConfigService, service: OrganizationService) => {
//             mockBackend.connections.subscribe(
//                 (mockConnection: MockConnection) => {
//                     mockConnection.mockRespond(new Response(
//                         new ResponseOptions({
//                             body: '{"errorKey":"http://localhost"}',
//                             status: 200,
//                         })
//                     ));

//                 });
//             service.initialOrganizationService().catch(result => {
//                 expect(result).toEqual('can not read organizaitonUrl config.');
//             });
//         }));

//     it('getOrganizationDataForDisplay should  be get data', async(inject([OrganizationService, ConfigService, MockBackend],
//         (service: OrganizationService, configService: ConfigService, mockBackend: MockBackend) => {
//             service.getOrganizationDataForDisplay().then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('getCountryDataForDisplay should  be get data', async(inject([OrganizationService, ConfigService, MockBackend],
//         (service: OrganizationService, configService: ConfigService, mockBackend: MockBackend) => {
//             service.getCountryDataForDisplay().then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('getProvinceDataForDisplay should  be get data', async(inject([OrganizationService, ConfigService, MockBackend],
//         (service: OrganizationService, configService: ConfigService, mockBackend: MockBackend) => {
//             service.getProvinceDataForDisplay('string').then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('getCityDataForDisplay should  be get data', async(inject([OrganizationService, ConfigService, MockBackend],
//         (service: OrganizationService, configService: ConfigService, mockBackend: MockBackend) => {
//             service.getCityDataForDisplay('string').then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('getCommunityDataForDisplay should  be get data', async(inject([OrganizationService, ConfigService, MockBackend],
//         (service: OrganizationService, configService: ConfigService, mockBackend: MockBackend) => {
//             service.getCommunityDataForDisplay('string').then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));
// });
