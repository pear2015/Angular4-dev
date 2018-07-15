
// import { ApplyPersonComponent } from '../../../app/+business-trends/certificate-apply/apply-person.component';
// import { TestBed, inject, } from '@angular/core/testing';
// import { ApplyPersonService } from '../../../app/+business-trends/certificate-apply/apply-person.service';

// import { DateFormatHelper } from '../../../app/+business-trends/common/dateformat-helper';
// import { ApplyCommonService } from '../../../app/+business-trends/certificate-apply/apply-common.service';
// import { OrganizationService } from '../../../app/+business-trends/certificate-apply/organization-data.service';
// import { EnumInfo } from '../../../app/+business-trends/common/enum/enuminfo';
// import { ConfigService } from '../../../app/shared';
// import { DxDataGridComponent, DxTemplateHost, WatcherHelper, IterableDifferHelper, NestedOptionHost } from 'devextreme-angular';
// import { ElementRef, NgZone, IterableDiffers, } from '@angular/core';
// import { FileUploader, FileItem } from 'ng2-file-upload';
// import { NgForm } from '@angular/forms';









// describe('ApplyPersonComponent', () => {

//     // 变量
//     let applyBasicInfo = {

//         age: 1,
//         career: '',
//         certificateNumber: '',
//         certificateType: '',
//         certificateValidity: '',
//         cityName: '',
//         communityName: '',
//         contractPhone: '',
//         countryName: '',
//         description: '',
//         detailAddress: '',
//         firstName: '',
//         fatherFirstName: '',
//         motherLastName: '',
//         motherFirstName: '',
//         lastName: '',
//         fatherLastName: '',
//         fatherCertificateNumber: '',
//         fatherNameSoundex: '',
//         marriageID: '',
//         motherCertificateNumber: '',
//         motherNameSoundex: '',
//         nation: '',
//         otherFeature: '',
//         otherName: '',
//         profession: '',
//         provinceName: '',
//         sexID: '',
//         dateOfBirth: new Date(),
//         countryOfCitizenship: '',
//         credentialsIssuePlace: '',
//         credentialsIssueDate: new Date(),
//         sexName: '',
//         marriageName: '',
//         registrationPhoto: '',

//     };

//     let event_Value_One = {
//         selectedItem: {
//             value: '1'
//         }
//     };
//     let event_Value_Two = {
//         selectedItem: {
//             value: '2'
//         }
//     };

//     let event_applyPurposeID_Five = {
//         selectedItem: {
//             applyPurposeID: '5'
//         }
//     };
//     let event_applyPurposeID_One = {
//         selectedItem: {
//             applyPurposeID: '1'
//         }
//     };

//     let event_provinceID = {
//         selectedItem: {
//             provinceID: '1'
//         }
//     };
//     let event_cityID = {
//         selectedItem: {
//             cityID: '1'
//         }
//     };

//     let event_Value = {
//         value: '1'
//     };

//     let personInfoGrids = new DxDataGridComponent(new ElementRef(''), new NgZone(''),
//         new DxTemplateHost(), new WatcherHelper(),
//         new IterableDifferHelper(new IterableDiffers([])), new NestedOptionHost());

//     let FileItem = {
//         queue: [
//             {
//                 _file: {},
//             }
//         ],
//         _file: new Blob(),
//         remove: () => { },
//     };

//     let FileUploader = {
//         url: '',
//         method: 'Post',
//         itemAlias: 'uploadedfile',
//         queue: [
//             {
//                 _file: {
//                     name: '1.png',
//                     size: '200*200',
//                     indexOf: () => { },

//                 }
//             }
//         ],
//         removeFromQueue: () => { },
//         uploadAll: () => { },
//         clearQueue: () => { },
//         onCompleteAll: () => { },
//         onSuccessItem: () => { }
//     };


//     beforeEach(() => {
//         // 替代服务
//         let applyCommonService = {


//             initialCrmsService(): Promise<any> {
//                 return Promise.resolve();
//             },

//             getApplyPurposeList(): Promise<any> {

//                 return Promise.resolve();
//             },

//             getPersonInfoListByNumberAndName(certificateNumber: String, name: String): Promise<any> {
//                 return Promise.resolve();
//             },

//             getApplyInfoByApplyID(applyID: ''): Promise<any> {
//                 return Promise.resolve();
//             },


//             getNoticeListByNumberAndName(certificateNumber: '', name: ''): Promise<any> {
//                 return Promise.resolve();
//             },

//             getImageFormUploaded(filePath: ''): Promise<any> {
//                 return Promise.resolve();
//             }
//         };

//         let organizationService = {

//             initialOrganizationService(): Promise<any> {
//                 return Promise.resolve();
//             },

//             getOrganizaitonDataForDisplay(): Promise<any> {
//                 return Promise.resolve();
//             },

//             getCountryDataForDisplay(): Promise<any> {
//                 return Promise.resolve();
//             },

//             getProvinceDataForDisplay(countryID: ''): Promise<any> {
//                 return Promise.resolve();
//             },

//             getCityDataForDisplay(provinceID: ''): Promise<any> {
//                 return Promise.resolve();
//             },

//             getCommunityDataForDisplay(cityID: ''): Promise<any> {
//                 return Promise.resolve();
//             },

//         };
//         let applyPersonService = {

//             initialCrmsService(): Promise<any> {
//                 return Promise.resolve();
//             },

//             saveCertificateApplyInfo(CertificateApplyInfo): Promise<any> {
//                 return Promise.resolve();
//             }
//         };

//         let configService = {

//             get(key: string | Array<string>): Promise<any> {
//                 return Promise.resolve();

//             },

//             readKeys(keys: Array<string>) {
//                 return Promise.resolve();
//             }
//         };

//         let dateFormatHelper = {

//             RestURLBeignDateTimeFormat(begindate: Date): any {
//                 let dformat = new Date;
//                 return dformat;
//             },

//             RestURLEndDateTimeFormat(enddate: Date): any {
//                 let dformat = new Date;
//                 return dformat;
//             },

//             HoursMinutesDateTimeFormat(time: Date): any {
//                 let dformat = new Date;
//                 return dformat;
//             }
//         };

//         TestBed.configureTestingModule({
//             providers: [
//                 ApplyPersonComponent,
//                 {
//                     provide: ApplyPersonService,
//                     useValue: ApplyPersonService
//                 },
//                 {
//                     provide: DateFormatHelper,
//                     useValue: DateFormatHelper

//                 },
//                 {
//                     provide: ApplyCommonService,
//                     useValue: applyCommonService

//                 },
//                 {
//                     provide: OrganizationService,
//                     useValue: organizationService

//                 },
//                 {
//                     provide: EnumInfo,
//                     useValue: EnumInfo

//                 },
//                 {
//                     provide: ConfigService,
//                     useValue: configService

//                 },

//                 {
//                     provide: ApplyPersonService,
//                     useValue: applyPersonService

//                 },
//                 {
//                     provide: DateFormatHelper,
//                     useValue: dateFormatHelper

//                 },
//                 {
//                     provide: FileUploader,
//                     useValue: FileUploader

//                 },
//                 {
//                     provide: FileItem,
//                     useValue: FileItem

//                 },
//                 {
//                     provide: NgForm,
//                     useValue: NgForm

//                 },

//             ],
//         });
//     });

//     // ngOnInit 方法
//     it('ngOnInit', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.ngOnInit();
//     }));

//     // showLoadPanel方法
//     it('showLoadPanel', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.showLoadPanel();
//     }));

//     // bindApplyPurposeData方法
//     it('bindApplyPurposeData', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.bindApplyPurposeData();
//     }));

//     // bindProvinceData方法
//     it('bindProvinceData', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.bindProvinceData('');
//     }));

//     // bindCityData方法
//     it('bindCityData', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.bindCityData('');
//     }));

//     // bindCommunityData方法
//     it('bindCommunityData', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.bindCommunityData('');
//     }));

//     // bindPersonInfoData方法
//     it('bindPersonInfoData', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.bindPersonInfoData();
//     }));

//     // countApplyOtherPurposeReasonCharacter方法
//     it('countApplyOtherPurposeReasonCharacter', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.applyInfo.otherPurposeReason = 'a';
//         comp.countApplyOtherPurposeReasonCharacter();
//     }));

//     // countApplyDescriptionCharacter方法
//     it('countApplyDescriptionCharacter', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.applyInfo.applyDescription = 'b';
//         comp.countApplyDescriptionCharacter();
//     }));

//     // countApplyNoteCharacter方法
//     it('countApplyNoteCharacter', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.applyInfo.note = 'c';
//         comp.countApplyNoteCharacter();
//     }));

//     // countApplyBasicOtherFeatureCharacter 方法
//     it('countApplyBasicOtherFeatureCharacter', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.applyBasicInfo = applyBasicInfo;
//         comp.countApplyBasicOtherFeatureCharacter();
//     }));

//     // countApplyBasicDetileAddressCharacter 方法
//     it('countApplyBasicDetileAddressCharacter', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.applyBasicInfo = applyBasicInfo;
//         comp.countApplyBasicDetileAddressCharacter();
//     }));

//     // countApplyBasicDescriptionCharacter 方法
//     it('countApplyBasicDescriptionCharacter', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.applyBasicInfo = applyBasicInfo;
//         comp.countApplyBasicDescriptionCharacter();
//     }));

//     // clearCharacterCount 方法
//     it('clearCharacterCount', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.clearCharacterCount();
//     }));

//     // selectIndexOfApplyPersonType 方法
//     it('selectIndexOfApplyPersonType_Value_One', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectIndexOfApplyPersonType(event_Value_One);
//     }));
//     it('selectIndexOfApplyPersonType_Value_Two', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectIndexOfApplyPersonType(event_Value_Two);
//     }));

//     // selectIndexOfApplyPurposeID 方法
//     it('selectIndexOfApplyPurposeID_Five', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectIndexOfApplyPurposeID(event_applyPurposeID_Five);
//     }));
//     it('selectIndexOfApplyPurposeID_One', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectIndexOfApplyPurposeID(event_applyPurposeID_One);
//     }));

//     // selectIndexOfCountryShip 方法
//     it('selectIndexOfCountryShip', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectIndexOfCountryShip(event_Value_One);
//     }));
//     it('selectIndexOfCountryShip', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectIndexOfCountryShip(event_Value_Two);
//     }));

//     // selectIndexOfProvince 方法
//     it('selectIndexOfProvince', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectIndexOfProvince(event_provinceID);
//     }));

//     // selectIndexOfCity 方法
//     it('selectIndexOfCity', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectIndexOfCity(event_cityID);
//     }));

//     // initMaxCredentialsIssueDateTime 方法
//     it('initMaxCredentialsIssueDateTime', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.initMaxCredentialsIssueDateTime(event_Value);
//     }));

//     // removeSingleFileTolToggle 方法
//     it('removeSingleFileTolToggle', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.removeSingleFileTolToggle();
//     }));

//     // previewTolToggle 方法
//     it('previewTolToggle', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.previewTolToggle();
//     }));

//     // removeAllFileTolToggle 方法
//     it('removeAllFileTolToggle', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.removeAllFileTolToggle();
//     }));

//     // selectFileTolToggle 方法
//     it('selectFileTolToggle', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.selectFileTolToggle();
//     }));

//     // submitToggle 方法
//     it('submitToggle', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.submitToggle();
//     }));

//     // dataBackFillTolToggle 方法
//     it('dataBackFillTolToggle', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.dataBackFillTolToggle();
//     }));

//     // showOperationResult 方法
//     it('showOperationResult', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.showOperationResult();
//     }));

//     // showLoadPanel 方法
//     it('showLoadPanel', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.showLoadPanel();
//     }));

//     // getPersonInfoByNameAndNumber 方法
//     it('getPersonInfoByNameAndNumber', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.getPersonInfoByNameAndNumber();
//     }));

//     // dataBackFill 方法
//     it('dataBackFill', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         personInfoGrids.selectedRowKeys = [];
//         comp.personInfoGrids = personInfoGrids;

//         comp.personInfoGrids.selectedRowKeys = personInfoGrids.selectedRowKeys;

//         comp.dataBackFill();
//         expect(comp.applyBasicInfo).toBeDefined();
//     }));

//     // selectedFileOnChanged 方法

//     it('selectedFileOnChanged', inject([ApplyPersonComponent, FileUploader, FileItem],
//         (comp: ApplyPersonComponent, fileUploader: FileUploader, fileItem: FileItem) => {
//             comp.uploader = fileUploader;
//             comp.imageTypeFormat = [];
//             comp.selectedFileOnChanged();
//         }));

//     // clearAqueueAll 方法
//     it('clearAqueueAll', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.clearAqueueAll();
//     }));

//     // removeSingle 方法

//     it('removeSingle', inject([ApplyPersonComponent, FileItem], (comp: ApplyPersonComponent, fileItem: FileItem) => {
//         comp.removeSingle(fileItem);
//     }));

//     // preMeet 方法
//     it('preMeet', inject([ApplyPersonComponent, FileItem], (comp: ApplyPersonComponent, fileItem: FileItem) => {
//         comp.preMeet(fileItem);
//     }));

//     // bindAttachmentListData 方法
//     it('bindAttachmentListData', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.bindAttachmentListData();
//     }));

//     // uploadAllFile 方法
//     it('uploadAllFile', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.uploadAllFile();
//     }));

//     // formatDate 方法
//     it('formatDate', inject([ApplyPersonComponent], (comp: ApplyPersonComponent) => {
//         comp.formatDate();
//     }));

//     // saveCertificateApplyBasicInfo 方法
//     it('saveCertificateApplyBasicInfo_true', inject([ApplyPersonComponent, NgForm], (comp: ApplyPersonComponent, form: NgForm) => {

//         comp.saveCertificateApplyBasicInfo(form);
//     }));
//     it('saveCertificateApplyBasicInfo_false', inject([ApplyPersonComponent, NgForm], (comp: ApplyPersonComponent, form: NgForm) => {
//         comp.isSaveSucess = null;
//         comp.saveCertificateApplyBasicInfo(form);
//     }));

//     // onSubmit 方法
//     it('onSubmit', inject([ApplyPersonComponent, NgForm], (comp: ApplyPersonComponent, form: NgForm) => {
//         comp.onSubmit(form);
//     }));
//     it('onSubmit', inject([ApplyPersonComponent, NgForm, FileUploader, FileItem],
//         (comp: ApplyPersonComponent, form: NgForm, fileUploader: FileUploader, fileItem: FileItem) => {
//             comp.uploader = fileUploader;

//             comp.onSubmit(form);

//         }));

//     // popupOperationInfo 方法
//     it('popupOperationInfo', inject([ApplyPersonComponent, NgForm], (comp: ApplyPersonComponent, form: NgForm) => {
//         comp.popupOperationInfo(true, 0);
//     }));
//     it('popupOperationInfo', inject([ApplyPersonComponent, NgForm], (comp: ApplyPersonComponent, form: NgForm) => {
//         comp.popupOperationInfo(true, 1);
//     }));
//     it('popupOperationInfo', inject([ApplyPersonComponent, NgForm], (comp: ApplyPersonComponent, form: NgForm) => {
//         comp.popupOperationInfo(false, null);
//     }));
// });
