// import { inject, TestBed, async } from '@angular/core/testing';
// import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';

// import { LoggerFactory, ConfigService, HttpProxyService } from '../../../../app/shared';
// import { MockLoggerFactory } from '../../../../test/mock-logger-factory.service';
// import { ApplyAnalysisService } from '../../../../app/+business-trends/certificate-apply/apply-analysis/apply-analysis.service';
// import { CertificateApplyInfo } from '../../../../app/model/certificate-apply/CertificateApplyInfo';
// import { ApplyBasicInfo } from '../../../../app/model/certificate-apply/ApplyBasicInfo';
// import { ApplyInfo } from '../../../../app/model/certificate-apply/ApplyInfo';
// import { AttachmentInfo } from '../../../../app/model/certificate-apply/AttachmentInfo';
// import { ApplyAndNoticeRelation } from '../../../../app/model/certificate-apply/ApplyAndNoticeRelation';

// describe('ApplyAnalysisService', () => {
//     let mockLoggerFactory = new MockLoggerFactory();

//     let noticeInfoList = [
//         {
//             'age': 20,
//             'career': '博士后',
//             'certificateNumber': '12345673213213123',
//             'certificateType': '身份证',
//             'certificateValidity': '10年',
//             'cityName': 'BOCOIO',
//             'communityName': 'CHILA',
//             'contractPhone': '17600000000',
//             'countryName': null,
//             'description': '武功盖世 大雕',
//             'detailAddress': '绝情谷',
//             'fatherCertificateNumber': '340826198003151256',
//             'fatherLastName': '杨',
//             'fatherFirstName': '康',
//             'fatherNameSoundex': 'yangkang',
//             'marriageID': '2',
//             'motherCertificateNumber': '340826198003194512',
//             'motherLastName': '穆',
//             'motherFirstName': '念慈',
//             'motherNameSoundex': 'munianci',
//             'lastName': '杨',
//             'firstName': '过',
//             'nation': '汉族',
//             'otherFeature': '独臂',
//             'profession': '侠客',
//             'provinceName': 'BENGUELA',
//             'sexID': '1',
//             'dateOfBirth': '1995-03-15 08:00:00',
//             'countryOfCitizenship': '本国',
//             'credentialsIssuePlace': '湖北武汉',
//             'credentialsIssueDate': '2017-09-05 08:00:00',
//             'sexName': '男',
//             'marriageName': '已婚',
//             'registrationPhoto': null
//         }];

//     let certificateApplyInfo = new CertificateApplyInfo(new ApplyBasicInfo(), new ApplyInfo(),
//         [new AttachmentInfo()], [new ApplyAndNoticeRelation()]);

//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [{
//                 provide: Http,
//                 useFactory: (backend, options) => {
//                     return new Http(backend, options);
//                 },
//                 deps: [MockBackend, BaseRequestOptions]
//             },
//             {
//                 provide: LoggerFactory,
//                 useValue: mockLoggerFactory
//             },
//                 MockBackend,
//                 BaseRequestOptions,
//                 ConfigService,
//                 HttpProxyService,
//                 ApplyAnalysisService]
//         });
//     });

//     it('service should be injected', inject([ApplyAnalysisService],
//         (service) => {
//             expect(service).toBeDefined();
//         }));

//     it('service should initial crime service', inject([MockBackend, ConfigService, ApplyAnalysisService],
//         (mockBackend: MockBackend, configService: ConfigService, service: ApplyAnalysisService) => {
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

//     it('service should initial crime service failed', inject([MockBackend, ConfigService, ApplyAnalysisService],
//         (mockBackend: MockBackend, configService: ConfigService, service: ApplyAnalysisService) => {
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


//     it('service should get noticeinfo list by number and name', async(inject([ApplyAnalysisService, MockBackend],
//         (service: ApplyAnalysisService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(noticeInfoList),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getNoticeInfoListByNumberAndName('123456', 'Tom', 'Smith').then(result => {
//                 expect(result).toEqual(noticeInfoList);
//             });
//         })));

//     it('service should updata certificate apply info', async(inject([ApplyAnalysisService, MockBackend],
//         (service: ApplyAnalysisService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: true,
//                         status: 200
//                     })
//                 ));
//             });
//             service.updateCertificateApplyInfo(certificateApplyInfo).then(result => {
//                 expect(result).toEqual(true);
//             });
//         })));

//     it('service should get analyst tasks by analystid', async(inject([ApplyAnalysisService, ConfigService, MockBackend],
//         (service: ApplyAnalysisService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify('analysistask'),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getAnalystTasksByAnalystID('zhangsan').then(result => {
//                 expect(result).toEqual('analysistask');
//             });
//         })));


// });
