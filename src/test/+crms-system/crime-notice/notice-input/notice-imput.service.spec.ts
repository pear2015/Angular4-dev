// import { inject, TestBed, async } from '@angular/core/testing';
// import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
// import { MockBackend, MockConnection } from '@angular/http/testing';

// import { LoggerFactory, ConfigService, HttpProxyService } from '../../../app/shared';
// import { CrimeAndNoticeService } from '../../../app/+business-trends/crime-notice/crime-notice.service';
// import { MockLoggerFactory } from '../../../test/mock-logger-factory.service';

// import { CrimeInfo } from '../../../app/model/crime-notice/CrimeInfo';
// import { CrimePersonInfo } from '../../../app/model/crime-notice/CrimePersonInfo';
// import { NoticeInfo } from '../../../app/model/crime-notice/NoticeInfo';
// import { AttachmentInfo } from '../../../app/model/crime-notice/AttachmentInfo';
// import { CrimeAndNoticeExtendInfo } from '../../../app/model/crime-notice/CrimeAndNoticeExtendInfo';


// describe('CrimeAndNoticeService', () => {
//     let mockLoggerFactory = new MockLoggerFactory();

//     let orginizationList = [
//         {
//             'status': 1,
//             'updateTime': '2017-08-28 16:41:45',
//             'updatePersonName': null,
//             'createTime': '2017-08-16 13:12:40',
//             'createPersonName': 'pear',
//             'name': '法制宣传司',
//             'nodeType': 3,
//             'parentID': 6,
//             'id': 8
//         }];

//     let countryList = [
//         {
//             'countryID': '4',
//             'countryName': 'Algeria',
//             'createTime': '0014-01-07 00:00:00',
//             'createPersonName': '王书',
//             'modifyTime': null,
//             'modifyPersonName': '',
//             'description': '',
//             'countryCode': '',
//             'codeTwo': 'DZ',
//             'codeThree': 'DZA'
//         }];

//     let provinceList = [
//         {
//             'provinceID': '1',
//             'provinceName': 'BENGO',
//             'countryName': 'Angola',
//             'createTime': '2017-08-09 00:00:00',
//             'createPersonName': '',
//             'modifyTime': null,
//             'modifyPersonName': '',
//             'description': '',
//             'abbreviation': 'BO',
//             'provinceCode': '1'
//         }];

//     let cityList = [
//         {
//             'cityID': '1',
//             'cityName': 'DANDE',
//             'provinceID': '1',
//             'createTime': '0001-01-01 00:00:00',
//             'createPersonName': '杨洋',
//             'modifyTime': null,
//             'modifyPersonName': '',
//             'description': '',
//             'cityCode': '',
//             'abbreviation': 'DA'
//         }];

//     let communityList = [
//         {
//             'communityID': '1',
//             'communityName': 'CAXITO',
//             'createTime': '2017-08-09 00:00:00',
//             'createPersonName': '王瑟',
//             'modifyTime': null,
//             'modifyPersonName': '',
//             'description': '',
//             'relationId': '1'
//         }];

//     let groupList = [
//         {
//             'groupID': '1',
//             'groupName': '公告组1',
//             'description': '测试公告组1'
//         }];

//     let noticeQueryInfo = [
//         {
//             'noticeNumber': 'crms201709081725',
//             'courtID': '1',
//             'enteringBeginTime': '2017-09-05 00:00:00',
//             'enteringEndTime': '2017-09-10 23:59:59',
//         }];

//     let crimeNoticeInfo = [
//         {
//             crimeInfo: {},
//             crimePersonInfo: {},
//             noticeInfo: {},
//             attachmentInfo: {}
//         }];
//     let noticeInfo = [
//         {
//             'noticeID': '902c6f3f-0931-4bd0-aaa9-71b0d341deb1',
//             'crimePersonID': 'cc7a3921-5e85-404c-ab15-0c15e472e841',
//             'crimeID': '2c9bb19f-d45a-40a7-bf50-0e8c4151cd65',
//             'courtID': '1',
//             'courtName': '湖北省人民检察院',
//             'groupID': '1',
//             'groupName': '公告组1',
//             'noticeNumber': 'crms201708301110',
//             'noticeCreateTime': '2017-08-25 00:00:00',
//             'enteringPersonName': null,
//             'modifyTime': null,
//             'modifyPersonName': null,
//             'noticeDescription': '公告描述1',
//             'note': '备注1',
//             'enteringTime': '2017-08-30 11:20:53',
//             'attchmentID': '2c8a3b7c-0fce-46b7-9188-a09da5263d21'
//         }];

//     let courtInfo = [
//         {
//             'courtID': '1',
//             'courtName': '湖北省人民检察院'
//         },
//         {
//             'courtID': '2',
//             'courtName': '武汉市人民检察院'
//         }];

//     let crimeAndNoticeExtendInfo = new CrimeAndNoticeExtendInfo(new CrimeInfo(), new CrimePersonInfo(),
//         new NoticeInfo(), [new AttachmentInfo()]);

//     let imageByte: any;
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
//                 CrimeAndNoticeService]
//         });
//     });
//     it('service should be injected', inject([CrimeAndNoticeService],
//         (service) => {
//             expect(service).toBeDefined();
//         }));

//     it('service should initial crime service', inject([MockBackend, ConfigService, CrimeAndNoticeService],
//         (mockBackend: MockBackend, configService: ConfigService, service: CrimeAndNoticeService) => {
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

//     it('service should initial crime service without url', inject([MockBackend, ConfigService, CrimeAndNoticeService],
//         (mockBackend: MockBackend, configService: ConfigService, service: CrimeAndNoticeService) => {
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

//     it('service should initial orginzation service', inject([MockBackend, ConfigService, CrimeAndNoticeService],
//         (mockBackend: MockBackend, configService: ConfigService, service: CrimeAndNoticeService) => {
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

//     it('service should initial orginzation service without url', inject([MockBackend, ConfigService, CrimeAndNoticeService],
//         (mockBackend: MockBackend, configService: ConfigService, service: CrimeAndNoticeService) => {
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


//     it('service should get orginazation data', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(orginizationList),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getOrganizationDataForDisplay().then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('service should get country data', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(countryList),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getCountryDataForDisplay().then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('service should get province data by countryid', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(provinceList),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getProvinceDataForDisplay('7').then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('service should get city data by provinceid', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(cityList),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getCityDataForDisplay('1').then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('service should get community data by cityid', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(communityList),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getCommunityDataForDisplay('1').then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));

//     it('service should get group data', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(groupList),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getNoticeGroupDataForDisplay().then(result => {
//                 expect(result).toBeDefined();
//                 expect(result).toEqual(groupList);
//             });
//         })));

//     // it('service should get crime notices data by noticequeryinfo', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//     //     (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//     //         mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//     //             mockConnection.mockRespond(new Response(
//     //                 new ResponseOptions({
//     //                     body: JSON.stringify(crimeNoticeInfo),
//     //                     status: 200
//     //                 })
//     //             ));
//     //         });
//     //         service.getNoticeAndCrimeDataForDisplay(noticeQueryInfo).then(result => {
//     //             expect(result).toBeDefined();
//     //             expect(result).toEqual(crimeNoticeInfo);
//     //         });
//     //     })));

//     it('service should get noticeList data by groupid', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(noticeInfo),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getNoticeListByGroupID('1').then(result => {
//                 expect(result).toBeDefined();
//                 expect(result).toEqual(noticeInfo);
//             });
//         })));

//     it('service should get court data', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(courtInfo),
//                         status: 200
//                     })
//                 ));
//             });
//             service.getCourtDataForDisplay().then(result => {
//                 expect(result).toBeDefined();
//                 expect(result).toEqual(courtInfo);
//             });
//         })));

//     it('service should save crime and notice data', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(true),
//                         status: 200
//                     })
//                 ));
//             });
//             service.saveNoticeAndCrimeInfo(crimeAndNoticeExtendInfo).then(result => {
//                 expect(result).toBeDefined();
//                 expect(result).toBeTruthy();
//             });
//         })));

//     it('service should get image from mongoDB', async(inject([CrimeAndNoticeService, ConfigService, MockBackend],
//         (service: CrimeAndNoticeService, configService: ConfigService, mockBackend: MockBackend) => {
//             mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//                 mockConnection.mockRespond(new Response(
//                     new ResponseOptions({
//                         body: JSON.stringify(imageByte),
//                         status: 200
//                     })
//                 ));
//             });
//             let fileID = '59b37e44b5f628158c62eaf6';
//             service.getImageFormUploaded(fileID).then(result => {
//                 expect(result).toBeDefined();
//             });
//         })));



// });


