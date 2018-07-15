// import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';
// import { NgForm, FormsModule } from '@angular/forms';
// import {
//     DxDataGridComponent,
//     DevExtremeModule,
//     DxPopupModule,
//     DxButtonModule,
//     DxTooltipModule,
//     DxTemplateModule,
//     DxDateBoxModule
// } from 'devextreme-angular';
// import { TranslateService } from 'ng2-translate';
// import { FileUploader, FileItem, FileUploadModule, FileUploaderOptions } from 'ng2-file-upload';
// import { TabsModule, TabsetConfig } from 'ngx-bootstrap';  // ngx-bootstrap


// import { LoggerFactory, ConfigService, HttpProxyService } from '../../../app/shared';
// import { MockLoggerFactory } from '../../mock-logger-factory.service';
// import { MockTranslateService } from '../../mock-translate.service';
// import { MockTranslatePipe } from '../../mock-translate.pipe';
// import { CrimeAndNoticeComponent } from '../../../app/+business-trends/crime-notice/crime-notice.component';
// import { CrimeAndNoticeService } from '../../../app/+business-trends/crime-notice/crime-notice.service';
// import { DateFormatHelper } from '../../../app/+business-trends/common/dateformat-helper';
// import { EnumInfo } from '../../../app/+business-trends/common/enum/enuminfo';

// import { NoticeInfo } from '../../../app/model/crime-notice/NoticeInfo';
// import { AttachmentInfo } from '../../../app/model/certificate-apply/AttachmentInfo';

// describe('CrimeNoticeComponent', () => {

//     let config = {
//         imageFormat: ['png', 'jpg', 'jpeg', 'bmp'],
//         imageSize: 5,
//         storeFileUrl: 'http://localhost:8089/api/v1/crms/file/store',
//     };

//     let countryList = [];
//     let provinceList = [];
//     let cityList = [];
//     let communityList = [];
//     let groupList = [];
//     let courtInfo = [];
//     let noticeList = [new NoticeInfo()];

//     let e = {
//         value: new Date(2017, 10, 1),
//         selectedItem: {
//             value: '1',
//             countryName: 'china',
//             provinceName: 'hubei',
//             cityName: 'wuhan',
//             communityName: 'jiangxia',
//             groupID: '1',
//             courtID: '1',
//         }
//     };


//     let mockLoggerFactory = new MockLoggerFactory();
//     let mockTranslateService = new MockTranslateService();

//     let mockCrimeAndNoticeService = {};
//     let mockDateFormatHelper = {};
//     let mockEnumInfo = {};
//     let mockFileUploader = {};
//     let mockFileItem = {};
//     // let mockTabsetConfig = {};

//     let fixture: ComponentFixture<CrimeAndNoticeComponent>;
//     let comp: CrimeAndNoticeComponent;
//     let service: CrimeAndNoticeService;
//     let translate: TranslateService;
//     let dateformat: DateFormatHelper;
//     let uploader: FileUploader;

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
//                 TabsModule,
//                 FileUploadModule
//             ],
//             declarations: [
//                 MockTranslatePipe,
//                 CrimeAndNoticeComponent
//             ],
//             providers: [
//                 MockBackend,
//                 BaseRequestOptions,
//                 ConfigService,
//                 HttpProxyService,
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
//                     provide: CrimeAndNoticeService,
//                     useValue: mockCrimeAndNoticeService
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
//                     provide: TabsetConfig,
//                     useValue: TabsetConfig
//                 },
//                 {
//                     provide: NgForm,
//                     useValue: NgForm
//                 }, {
//                     provide: FileUploader,
//                     useValue: mockFileUploader
//                 },
//                 {
//                     provide: FileItem,
//                     useValue: mockFileItem
//                 },

//             ]
//         });

//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(CrimeAndNoticeComponent);
//             comp = fixture.componentInstance;
//             service = fixture.debugElement.injector.get(CrimeAndNoticeService);
//             translate = fixture.debugElement.injector.get(TranslateService);
//             dateformat = fixture.debugElement.injector.get(DateFormatHelper);
//             uploader = fixture.debugElement.injector.get(FileUploader);

//             fixture.detectChanges();
//         });
//     }));

//     it('ngOnInit', async(inject([MockBackend], (mockBackend: MockBackend) => {
//         mockBackend.connections.subscribe((mockConnection: MockConnection) => {
//             mockConnection.mockRespond(new Response(
//                 new ResponseOptions({
//                     body: JSON.stringify(config),
//                     status: 200
//                 })
//             ));
//         });
//         spyOn(service, 'initialCrmsService').and.returnValue(Promise.resolve());
//         spyOn(service, 'initialOrganizationService').and.returnValue(Promise.resolve());
//         spyOn(comp, 'bindNoticeGroupData');
//         spyOn(comp, 'bindCourtListData');
//         spyOn(comp, 'bindCountryData');

//         comp.ngOnInit();
//         fixture.detectChanges();
//         fixture.whenStable().then(result => {
//             expect(comp.groupInfo).toBeDefined();
//             expect(comp.courtInfo).toBeDefined();
//             expect(comp.countryList).toBeDefined();
//             expect(comp.imageTypeFormat).toEqual(config.imageFormat);
//             expect(comp.imageSizeFormat).toEqual(config.imageSize * 1024 * 1024);
//             expect(comp.uploader.options.url).toEqual(config.storeFileUrl);
//         });
//     })));

//     it('ngOnInit failed', () => {
//         spyOn(service, 'initialCrmsService').and.returnValue(Promise.reject('error'));
//         spyOn(service, 'initialOrganizationService').and.returnValue(Promise.reject('error'));
//         comp.ngOnInit();
//         fixture.whenStable().catch(result => {
//             expect(comp.groupInfo).toEqual([]);
//             expect(comp.courtInfo).toEqual([]);
//             expect(comp.countryList).toEqual([]);
//         });
//     });

//     it('should bind country data', () => {
//         spyOn(service, 'getCountryDataForDisplay').and.returnValue(Promise.resolve(countryList));
//         comp.bindCountryData();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.countryList).toEqual(countryList);
//         });
//     });

//     it('should bind country data failed', () => {
//         spyOn(service, 'getCountryDataForDisplay').and.returnValue(Promise.reject('error'));
//         comp.bindCountryData();
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.countryList).toEqual([]);
//         });
//     });

//     it('should bind province data ', () => {
//         spyOn(service, 'getProvinceDataForDisplay').and.returnValue(Promise.resolve(provinceList));
//         comp.bindProvinceData('7');
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.provinceList).toEqual(provinceList);
//         });
//     });

//     it('should bind province data failed', () => {
//         spyOn(service, 'getProvinceDataForDisplay').and.returnValue(Promise.reject('error'));
//         comp.bindProvinceData('1');
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.provinceList).toEqual([]);
//         });
//     });

//     it('should bind city data ', () => {
//         spyOn(service, 'getCityDataForDisplay').and.returnValue(Promise.resolve(cityList));
//         comp.bindCityData('1');
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.cityList).toEqual(cityList);
//         });
//     });

//     it('should bind city data failed', () => {
//         spyOn(service, 'getCityDataForDisplay').and.returnValue(Promise.reject('error'));
//         comp.bindCityData('1');
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.cityList).toEqual([]);
//         });
//     });

//     it('should bind community data ', () => {
//         spyOn(service, 'getCommunityDataForDisplay').and.returnValue(Promise.resolve(communityList));
//         comp.bindCommunityData('1');
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.communityList).toEqual(communityList);
//         });
//     });

//     it('should bind community data failed', () => {
//         spyOn(service, 'getCommunityDataForDisplay').and.returnValue(Promise.reject('error'));
//         comp.bindCommunityData('1');
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.communityList).toEqual([]);
//         });
//     });

//     it('should bind notice group data ', () => {
//         spyOn(service, 'getNoticeGroupDataForDisplay').and.returnValue(Promise.resolve(groupList));
//         comp.bindNoticeGroupData();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.groupInfo).toEqual(groupList);
//         });
//     });

//     it('should bind notice group data failed', () => {
//         spyOn(service, 'getNoticeGroupDataForDisplay').and.returnValue(Promise.reject('error'));
//         comp.bindNoticeGroupData();
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.groupInfo).toEqual([]);
//         });
//     });

//     it('should bind court list data ', () => {
//         spyOn(service, 'getCourtDataForDisplay').and.returnValue(Promise.resolve(courtInfo));
//         comp.bindCourtListData();
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.courtInfo).toEqual(courtInfo);
//         });
//     });

//     it('should bind court list data failed', () => {
//         spyOn(service, 'getCourtDataForDisplay').and.returnValue(Promise.reject('error'));
//         comp.bindCourtListData();
//         fixture.whenStable().catch(() => {
//             fixture.detectChanges();
//             expect(comp.courtInfo).toEqual([]);
//         });
//     });

//     it('should bind notice list data by groupid', () => {
//         spyOn(service, 'getNoticeListByGroupID').and.returnValue(Promise.resolve(noticeList));
//         comp.bindNoticeListByGroupID('1');
//         fixture.whenStable().then(() => {
//             fixture.detectChanges();
//             expect(comp.noticeList).toEqual(noticeList);
//         });
//     });

//     it('should bind notice list data by groupid', () => {
//         spyOn(service, 'getNoticeListByGroupID').and.returnValue(Promise.reject('error'));
//         comp.bindNoticeListByGroupID('1');
//         fixture.whenStable().catch(result => {
//             fixture.detectChanges();
//             expect(result).toEqual('error');
//         });
//     });

//     it('should select a gender', () => {
//         comp.selectIndexOfGender(e);
//         expect(comp.crimepersonInfo.sexID).toEqual(e.selectedItem.value);
//     });

//     it('should select a marriage', () => {
//         comp.selectIndexOfMarriage(e);
//         expect(comp.crimepersonInfo.marriageID).toEqual(e.selectedItem.value);
//     });

//     it('should select a country', () => {
//         spyOn(comp, 'bindProvinceData');
//         comp.selectIndexOfCountry(e);
//         expect(comp.crimepersonInfo.countryName).toEqual(e.selectedItem.countryName);
//     });

//     it('should select a province', () => {
//         spyOn(comp, 'bindCityData');
//         spyOn(comp, 'bindCommunityData');
//         comp.selectIndexOfProvince(e);
//         expect(comp.crimepersonInfo.provinceName).toEqual(e.selectedItem.provinceName);
//     });

//     it('should select a city', () => {
//         spyOn(comp, 'bindCommunityData');
//         comp.selectIndexOfCity(e);
//         expect(comp.crimepersonInfo.cityName).toEqual(e.selectedItem.cityName);
//     });

//     it('should select a community', () => {
//         comp.selectIndexOfCommunity(e);
//         expect(comp.crimepersonInfo.communityName).toEqual(e.selectedItem.communityName);
//     });

//     it('should select a group', () => {
//         spyOn(comp, 'bindNoticeListByGroupID');
//         comp.selectIndexOfGroup(e);
//         expect(comp.noticeListHidden).toBeTruthy();
//         expect(comp.noticeInfo.groupID).toEqual(e.selectedItem.groupID);
//     });

//     it('should select a court', () => {
//         comp.selectIndexOfCourt(e);
//         expect(comp.noticeInfo.courtID).toEqual(e.selectedItem.courtID);
//     });

//     it('should format date', () => {
//         comp.noticeInfo.noticeCreateTime = new Date();
//         comp.crimeInfo.crimeJudgeTime = new Date();
//         comp.formatDate();
//         expect(comp.noticeInfo.noticeCreateTime).toBeDefined();
//         expect(comp.crimeInfo.crimeJudgeTime).toBeDefined();
//     });

//     it('should select file to upload with illegal image', () => {
//         spyOn(comp, 'preMeet');
//         let imageSize: number;
//         let imageFormat: string;
//         let file = new File([], '1');
//         let options: FileUploaderOptions;
//         comp.uploader = new FileUploader({});
//         comp.uploader.queue = [new FileItem(new FileUploader({}), file, options)];
//         comp.uploader.queue[0]._file = new File([new Blob()], '1');
//         comp.uploader.queue.length = 1;
//         imageSize = 10000000;
//         imageFormat = 'abc';
//         comp.imageTypeFormat = ['png'];
//         comp.illegalImage.length = 1;

//         comp.selectedFileOnChanged();
//     });

//     it('should select file to upload without illegal image', () => {
//         spyOn(comp, 'preMeet');
//         let imageSize: number;
//         let imageFormat: string;
//         let file = new File([], '1');
//         let options: FileUploaderOptions;
//         comp.uploader = new FileUploader({});
//         comp.uploader.queue = [new FileItem(new FileUploader({}), file, options)];
//         comp.uploader.queue[0]._file = new File([new Blob()], '1');
//         comp.uploader.queue.length = 1;
//         imageSize = 1000;
//         imageFormat = 'png';
//         comp.imageSizeFormat = 500000;
//         comp.imageTypeFormat = ['png'];
//         comp.illegalImage.length = 1;

//         comp.selectedFileOnChanged();
//     });

//     it('should select file to upload without illegal image', () => {
//         spyOn(comp, 'preMeet');

//         comp.uploader.queue.length = 0;
//         comp.illegalImage.length = 0;

//         comp.selectedFileOnChanged();
//     });

//     it('should  bind attachment list data', () => {
//         let file = new File([], '1');
//         let options: FileUploaderOptions;
//         comp.uploader.queue.length = 1;
//         comp.uploader.queue[0] = new FileItem(new FileUploader({}), file, options);

//         comp.bindAttachmentListData();
//     });

//     it('should  bind attachment list data failed', () => {
//         comp.uploader.queue.length = 0;

//         comp.bindAttachmentListData();
//     });

//     it('should upload all file', () => {
//         comp.uploader = new FileUploader({});

//         comp.uploadAllFile();
//     });

//     it('should clear queue', () => {
//         comp.uploader = new FileUploader({});
//         comp.attachmentList = [new AttachmentInfo()];

//         comp.clearAqueueAll();
//     });

//     // it('should remove single file', () => {
//     //     let file = new File([], '1');
//     //     let options: FileUploaderOptions;
//     //     comp.uploader.queue[0] = new FileItem(new FileUploader({}), file, options);
//     //     let item = comp.uploader.queue[0];
//     //     item.isUploading = true;

//     //     comp.removeSingle(item);
//     // });

//     it('should preview a image', () => {
//         let file = new File([], '1');
//         let options: FileUploaderOptions;
//         let item = new FileItem(new FileUploader({}), file, options);

//         comp.preMeet(item);
//         expect(comp.imageSrc).toBeDefined();
//     });

//     it('should hidden loading panel after 3s', () => {
//         comp.onShown();
//         expect(comp.loadingVisible).toBeFalsy();
//     });

//     it('should hidden loading panel', () => {
//         spyOn(comp, 'popupOperationInfo');
//         comp.onHidden();
//     });

//     it('should show loading panel', () => {
//         comp.showLoadPanel();
//         expect(comp.loadingVisible).toBeTruthy();
//     });

//     it('should show operation message when save success', () => {
//         let isSuccess = true;
//         comp.popupOperationInfo(isSuccess);
//     });

//     it('should show operation message when save failure', () => {
//         let isSuccess = false;
//         comp.popupOperationInfo(isSuccess);
//     });

//     it('should count entering character', () => {
//         comp.noticeInfo.note = 'b';
//         comp.noticeInfo.noticeDescription = 'a';
//         comp.crimeInfo.description = 'd';
//         comp.crimeInfo.crimeDescription = 'c';
//         comp.crimepersonInfo.description = 'e';

//         comp.countNoticeDescriptionCharacter();
//         comp.countNoticeNoteCharacter();
//         comp.countCrimeCriDescriptionCharacter();
//         comp.countCrimeDescriptionCharacter();
//         comp.countPersonInfoDescriptionCharacter();
//     });

//     it('should toggle a tooltip', () => {
//         comp.toggleDefault();
//         comp.selectTolToggle();
//         comp.removeSingleFileTolToggle();
//         comp.previewTolToggle();
//         comp.removeAllFileTolToggle();
//     });

//     it('should init max crime judge time', () => {
//         comp.initMaxCrimeJudgeTime(e);
//         expect(comp.maxCrimeJudgeTime).toEqual(e.value);
//     });

//     it('should clear character count', () => {
//         comp.clearCharacterCount();
//         expect(comp.noticeNoteLength).toEqual(0);
//     });

//     it('should onsubmit with attachment', () => {
//         spyOn(comp, 'showLoadPanel');
//         spyOn(comp, 'bindAttachmentListData');
//         spyOn(comp, 'uploadAllFile').and.returnValue(Promise.resolve());
//         spyOn(comp, 'savaNoticeAndCrimeBasicInfo');

//         let file = new File([], '1');
//         let options: FileUploaderOptions;
//         let fileItem = new FileItem(new FileUploader({}), file, options);
//         let headers = { headerName: '' };
//         let form = new NgForm([], []);

//         comp.uploader.queue.length = 1;
//         comp.uploader.onSuccessItem(fileItem, '', 200, headers);
//         comp.uploader.onCompleteAll();
//         comp.attachmentList.length = 1;
//         comp.attachmentList = [new AttachmentInfo()];

//         comp.onSubmit(form);
//     });

//     it('should onsubmit without attachment', () => {
//         spyOn(comp, 'showLoadPanel');
//         spyOn(comp, 'savaNoticeAndCrimeBasicInfo');

//         comp.uploader.queue.length = 0;
//         let form = new NgForm([], []);
//         comp.onSubmit(form);
//     });

//     it('should save notice and crime info', () => {
//         spyOn(service, 'saveNoticeAndCrimeInfo').and.returnValue(Promise.resolve(true));
//         spyOn(comp, 'formatDate');
//         spyOn(comp, 'clearCharacterCount');

//         let form = new NgForm([], []);
//         comp.uploader = new FileUploader({});
//         fixture.detectChanges();

//         fixture.whenStable().then(result => {
//             comp.isSaveSuccess = result;
//             expect(result).toBeTruthy();
//         });
//         comp.savaNoticeAndCrimeBasicInfo(form);
//     });

//     it('should save notice and crime info when isSaveSuccess', () => {
//         spyOn(service, 'saveNoticeAndCrimeInfo').and.returnValue(Promise.resolve(false));
//         spyOn(comp, 'formatDate');
//         spyOn(comp, 'clearCharacterCount');

//         let form = new NgForm([], []);
//         comp.uploader = new FileUploader({});
//         fixture.detectChanges();

//         comp.savaNoticeAndCrimeBasicInfo(form);
//     });

//     it('should save notice and crime info failed', () => {
//         spyOn(service, 'saveNoticeAndCrimeInfo').and.returnValue(Promise.reject('error'));
//         spyOn(comp, 'formatDate');

//         let form = new NgForm([], []);
//         fixture.detectChanges();

//         fixture.whenStable().catch(result => {
//             expect(result).toEqual('error');
//         });
//         comp.savaNoticeAndCrimeBasicInfo(form);
//     });

// });
