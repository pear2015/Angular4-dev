// import { TestBed, inject, async, } from '@angular/core/testing';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { NgForm } from '@angular/forms';
// import { DxDataGridComponent } from 'devextreme-angular';
// import { FileUploader, FileItem } from 'ng2-file-upload';

// import { ApplyGovermentComponent } from '../../../app/+business-trends/certificate-apply/apply-goverment.component';

// import { ApplyCommonService } from '../../../app/+business-trends/certificate-apply/apply-common.service';
// import { OrganizationService } from '../../../app/+business-trends/certificate-apply/organization-data.service';
// import { ConfigService } from '../../../app/shared/services/config.service';
// import { ApplyGovermentService } from '../../../app/+business-trends/certificate-apply/apply-goverment.service';
// import { CrimeAndNoticeService } from '../../../app/+business-trends/crime-notice/crime-notice.service';
// import { DateFormatHelper } from '../../../app/+business-trends/common/dateformat-helper';

// import { EnumInfo } from '../../../app/+business-trends/common/enum/enuminfo';
// import { ApplyPurpose } from '../../../app/model/certificate-apply/ApplyPurpose';
// import { ApplyAndNoticeRelation } from '../../../app/model/certificate-apply/ApplyAndNoticeRelation';
// import { ApplyInfo } from '../../../app/model/certificate-apply/ApplyInfo';
// import { AttachmentInfo } from '../../../app/model/certificate-apply/AttachmentInfo';
// import { ApplyBasicInfo } from '../../../app/model/certificate-apply/ApplyBasicInfo';






// describe('ApplyGovermentComponent Test', () => {
//     let applyPurposeList = [
//         {
//             applyPurposeID: '1',
//             name: '持枪证'
//         },
//         {
//             applyPurposeID: '2',
//             name: '驾驶证'
//         },
//     ];

//     let e = {
//         selectedItem: {
//             provinceID: '1',
//             cityID: '1',
//         }

//     };


//     let applyInfo = {
//         applyTime: new Date,
//         analysisDescription: 'ewr',
//         note: 'w',

//     };

//     let applyBasicInfo = {
//         credentialsIssueDate: new Date,
//         dateOfBirth: new Date,
//         otherFeature: 'string',
//         description: 'string',
//         detailAddress: 'string',
//     };

//     let noticeIDs = [
//         {
//             noticeInfo: {
//                 noticeID: 'string',
//                 crimePersonID: 'string',
//                 crimeID: 'string',
//                 courtID: 'string',
//                 courtName: 'string',
//                 groupID: 'string',
//                 groupName: 'string',
//                 noticeNumber: 'string',
//                 noticeCreateTime: Date,
//                 enteringPersonName: 'string',
//                 modifyTime: Date,
//                 modifyPersonName: 'string',
//                 noticeDescription: 'string',
//                 note: 'string',
//                 enteringTime: Date,
//                 attchmentID: 'string',
//             }
//         }
//     ];

//     let applyCommonService = {
//         getApplyPurposeList: () => {
//             return Promise.resolve(
//                 [
//                     {
//                         applyPurposeID: '1',
//                         name: '持枪证'
//                     },
//                     {
//                         applyPurposeID: '2',
//                         name: '驾驶证'
//                     },
//                 ]
//             );
//         },
//         initialCrmsService: () => {
//             return Promise.resolve(
//                 ''
//             );
//         },
//         getNoticeListByNumberAndName: (certificateNumber, familyName, lastName) => {
//             return Promise.resolve(
//                 [

//                 ]
//             );
//         },
//         getPersonInfoListByNumberAndName: (certificateNumber, familyName, lastName) => {
//             return Promise.resolve(
//                 [

//                 ]
//             );
//         },
//         getImageFormUploaded: (filePath) => {
//             return Promise.resolve(
//                 [

//                 ]
//             );
//         }
//     };

//     let configService = {
//         get: (param: string) => {
//             return Promise.resolve(
//                 ''
//             );
//         }
//     };

//     let applyGovermentService = {
//         initialCrmsService: () => {
//             return Promise.resolve(
//                 ''
//             );
//         },
//         saveCertificateApplyInfo: () => {
//             return Promise.resolve();
//         }
//     };

//     let crimeAndNoticeService = {
//         initialCrmsService: () => {
//             return Promise.resolve(
//                 ''
//             );
//         },
//     };

//     let organizationService = {
//         initialOrganizationService: (): Promise<any> => {
//             return new Promise((r, j) => {
//             });
//         },
//         getProvinceDataForDisplay: () => {
//             return Promise.resolve(
//                 [
//                     {
//                         provinceID: '1',
//                         provinceName: 'BENGO',
//                     },
//                     {
//                         provinceID: '2',
//                         provinceName: 'BENGUELA',
//                     },
//                 ]
//             );
//         },
//         getCityDataForDisplay: () => {
//             return Promise.resolve(
//                 [
//                     {
//                         cityID: '1',
//                         cityName: 'DANDE',
//                     },
//                     {
//                         cityID: '2',
//                         cityName: 'AMBRIZ',
//                     },
//                 ]
//             );
//         },
//         getCommunityDataForDisplay: () => {
//             return Promise.resolve(
//                 [
//                     {
//                         communityID: '1',
//                         communityName: 'CAXITO',
//                     },
//                     {
//                         communityID: '2',
//                         communityName: 'BARRA DO DANDE',
//                     },
//                 ]
//             );
//         }
//     };

//     let dateFormatHelper = {
//         RestURLBeignDateTimeFormat: (time: Date) => {
//             return 'string';
//         }
//     };

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
//         authToken: 'string',
//         isUploading: true,
//         url: '',
//         method: 'Post',
//         itemAlias: 'uploadedfile',
//         queue: [
//             {
//                 _file: {
//                     name: '1.png',
//                     size: '200*200',
//                 }
//             }
//         ],
//         removeFromQueue: () => { },
//         uploadAll: () => { },
//         clearQueue: () => { },
//         onCompleteAll: () => { },
//         onSuccessItem: () => { }
//     };

//     let form = {
//         _submitted: '',
//         form: 'FormGroup',
//         ngSubmit: '',
//         onSubmit: true,
//         resetForm: () => { },
//     };

//     let attachmentList = [
//         {
//             attachmentID: 'string',
//             fileFormatType: 'string',
//             fileName: 'string',
//             attachmenttypeID: 'string',
//             filePath: 'string',
//         }
//     ];


//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             providers: [
//                 ApplyGovermentComponent,
//                 {
//                     provide: ApplyCommonService,
//                     useValue: applyCommonService
//                 },
//                 {
//                     provide: ApplyPurpose,
//                     useValue: applyPurposeList
//                 }, {
//                     provide: OrganizationService,
//                     useValue: organizationService
//                 }, {
//                     provide: ConfigService,
//                     useValue: configService
//                 },
//                 {
//                     provide: ApplyGovermentService,
//                     useValue: applyGovermentService
//                 }, {
//                     provide: DateFormatHelper,
//                     useValue: dateFormatHelper
//                 }, {
//                     provide: CrimeAndNoticeService,
//                     useValue: crimeAndNoticeService
//                 }, {
//                     provide: EnumInfo,
//                     useValue: EnumInfo
//                 }, {
//                     provide: ApplyAndNoticeRelation,
//                     useValue: ApplyAndNoticeRelation
//                 }, {
//                     provide: ApplyInfo,
//                     useValue: applyInfo
//                 }, {
//                     provide: ApplyBasicInfo,
//                     useValue: ApplyBasicInfo
//                 }, {
//                     provide: AttachmentInfo,
//                     useValue: attachmentList
//                 }, {
//                     provide: DxDataGridComponent,
//                     useValue: DxDataGridComponent
//                 }, {
//                     provide: FileUploader,
//                     useValue: FileUploader
//                 }, {
//                     provide: FileItem,
//                     useValue: FileItem
//                 }, {
//                     provide: NgForm,
//                     useValue: form
//                 }
//             ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA]
//         });
//     }));

//     // ngOnInit
//     it('ngOnInit initialCrmsService success', inject([ApplyGovermentComponent, ApplyCommonService,
//         ApplyGovermentService, ApplyCommonService, CrimeAndNoticeService, ConfigService, OrganizationService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService, ApplyGovermentService: ApplyGovermentService,
//             CrimeAndNoticeService: CrimeAndNoticeService, ConfigService: ConfigService, OrganizationService: OrganizationService) => {
//             spyOn(ApplyCommonService, 'initialCrmsService').and.returnValue(Promise.resolve());
//             spyOn(ApplyGovermentService, 'initialCrmsService').and.returnValue(Promise.resolve());
//             spyOn(comp, 'bindProvinceData');
//             spyOn(comp, 'bindGovernmentProvinceData');
//             OrganizationService.initialOrganizationService = () => {
//                 return new Promise((r, j) => {
//                     r({});
//                 });
//             };
//             ConfigService.get = () => {
//                 return new Promise((r, j) => {
//                     r({});
//                 });
//             };
//             spyOn(comp, 'bindApplyPurposeData');
//             comp.ngOnInit();

//         }));

//     it('ngOnInit initialCrmsService failed', inject([ApplyGovermentComponent, ApplyCommonService,
//         ApplyGovermentService, ApplyCommonService, CrimeAndNoticeService, ConfigService, OrganizationService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService, ApplyGovermentService: ApplyGovermentService,
//             CrimeAndNoticeService: CrimeAndNoticeService, ConfigService: ConfigService, OrganizationService: OrganizationService) => {
//             spyOn(ApplyCommonService, 'initialCrmsService').and.returnValue(Promise.reject('err'));
//             spyOn(ApplyGovermentService, 'initialCrmsService').and.returnValue(Promise.reject('err'));
//             OrganizationService.initialOrganizationService = () => {
//                 return new Promise((r, j) => {
//                     j('err');
//                 });
//             };
//             comp.ngOnInit();
//         }));


//     //  显示loading
//     it('showLoadPanel', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.showLoadPanel();
//         expect(comp.loadingVisible).toEqual(true);
//     }));


//     // 提交按钮tooltip
//     it('toggleDefault', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.toggleDefault();
//         expect(comp.defaultVisible).toEqual(true);
//     }));

//     // 提交按钮tooltip
//     it('toggleDefault', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.defaultVisible = true;
//         comp.toggleDefault();
//         expect(comp.defaultVisible).toEqual(false);
//     }));

//     // 回填按钮
//     it('dataBackFillTolToggle', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.dataBackFillTolToggle();
//         expect(comp.dataBackFillTolVisible).toEqual(true);
//     }));

//     it('dataBackFillTolToggle', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.dataBackFillTolVisible = true;
//         comp.dataBackFillTolToggle();
//         expect(comp.dataBackFillTolVisible).toEqual(false);
//     }));


//     // 移除单个文件tooltip
//     it('removeSingleFileTolToggle', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.removeSingleFileTolVisible = true;
//         comp.removeSingleFileTolToggle();
//         expect(comp.removeSingleFileTolVisible).toEqual(false);
//     }));

//     it('removeSingleFileTolToggle', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.removeSingleFileTolVisible = false;
//         comp.removeSingleFileTolToggle();
//         expect(comp.removeSingleFileTolVisible).toEqual(true);
//     }));

//     // 预览tooltip
//     it('previewTolToggle', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.previewTolToggle();
//         expect(comp.previewTolVisible).toEqual(true);
//     }));

//     it('previewTolToggle', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.previewTolVisible = true;
//         comp.previewTolToggle();
//         expect(comp.previewTolVisible).toEqual(false);
//     }));


//     // 初始化最小颁发日期
//     it('initMincredentialsIssueDate', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let event = {
//             date: ''
//         };
//         comp.initMincredentialsIssueDate(event);
//     }));

//     // 统计地址描述字符数
//     it('countAdressDescriptionCharacter', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyBasicInfo.detailAddress = applyBasicInfo.detailAddress;
//         comp.countAdressDescriptionCharacter();
//         expect(comp.adressDescriptionLength).toEqual(comp.applyBasicInfo.detailAddress.length);
//     }));

//     // 统计描述字符数
//     it('countApplyDescriptionCharacter', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyBasicInfo.description = applyBasicInfo.description;
//         comp.countApplyDescriptionCharacter();
//         expect(comp.applyDescriptionLength).toEqual(comp.applyBasicInfo.description.length);
//     }));

//     // 统计备注描述字符数
//     it('countnoteDescriptionCharacter', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyInfo.note = applyInfo.note;
//         comp.countnoteDescriptionCharacter();
//         expect(comp.applynoteDescriptionLength).toEqual(comp.applyInfo.note.length);
//     }));

//     // 统计分析描述字符数
//     it('countAnalysisDescriptionCharacter', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyInfo.analysisDescription = applyInfo.analysisDescription;
//         comp.countAnalysisDescriptionCharacter();
//         expect(comp.analysisDescriptionLength).toEqual(comp.applyInfo.analysisDescription.length);
//     }));

//     // 统计其他特征描述字符数
//     it('countOtherFeatureCharacter', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyBasicInfo.otherFeature = applyBasicInfo.otherFeature;
//         comp.countOtherFeatureCharacter();
//         expect(comp.otherFeatureLength).toEqual(comp.applyBasicInfo.otherFeature.length);
//     }));

//     // 性别选中
//     it('selectIndenxOfGender', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.selectIndenxOfGender(e);
//     }));


//     // 申请目的选中
//     it('selectIndenxOfapplyPurpose', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let applyPurpose = {
//             selectedItem: {
//                 applyPurposeID: '5'
//             }
//         };
//         comp.selectIndexOfapplyPurpose(applyPurpose);
//         expect(comp.isReason).toEqual(true);
//         expect(comp.otherReason).toEqual(false);
//     }));

//     it('selectIndenxOfapplyPurpose', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let applyPurpose = {
//             selectedItem: {
//                 applyPurposeID: '3'
//             }
//         };
//         comp.selectIndexOfapplyPurpose(applyPurpose);
//         expect(comp.isReason).toEqual(false);
//         expect(comp.otherReason).toEqual(true);
//         expect(comp.applyInfo.otherPurposeReason).toEqual(null);


//     }));

//     // 国籍选中
//     it('selectIndenxOfcountryOfCitizenship', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let countryOfCitizenship = { selectedItem: { value: '2' } };
//         comp.selectIndenxOfcountryOfCitizenship(countryOfCitizenship);
//         expect(comp.showCountryName).toEqual(false);
//     }));

//     // 国籍选中
//     it('selectIndenxOfcountryOfCitizenship', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let countryOfCitizenship = { selectedItem: { value: '1' } };
//         comp.selectIndenxOfcountryOfCitizenship(countryOfCitizenship);
//         expect(comp.showCountryName).toEqual(true);
//     }));

//     // 分析结果选中
//     it('selectIndenxOfAnalysisResult', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let analysisResultID = { 'value': '3' };
//         comp.selectIndenxOfAnalysisResult(analysisResultID);
//         expect(comp.isOther).toEqual(true);
//     }));

//     it('selectIndenxOfAnalysisResult', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let analysisResultID = { 'value': '2' };
//         comp.selectIndenxOfAnalysisResult(analysisResultID);
//     }));

//     // 获取选中犯罪公告
//     it('selectionChangeHandle', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let noticeIDList = { 'selectedRowsData': [] };
//         comp.selectionChangeHandle(noticeIDList);
//         expect(comp.noticeIDs).toEqual([]);
//     }));

//     // 申请和公告关联
//     it('getApplyAndNoticeRelationList', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.noticeIDList = ['1', '2', '3'];
//         comp.getApplyAndNoticeRelationList();
//     }));

//     // 获取人口信息列表
//     it('getCertificateNumber', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyBasicInfo.certificateNumber = '124153476848';
//         comp.applyBasicInfo.firstName = 'Tom';
//         comp.applyBasicInfo.lastName = 'Smith';
//         comp.getCertificateNumber();

//     }));

//     it('getCertificateNumber', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyBasicInfo.certificateNumber = '124153476848';
//         comp.applyBasicInfo.firstName = undefined;
//         comp.applyBasicInfo.lastName = 'Smith';
//         comp.getCertificateNumber();

//     }));

//     // 加载犯罪公告
//     it('bindNoticesByIDAndName', inject([ApplyGovermentComponent, ApplyCommonService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService) => {
//             comp.applyBasicInfo.certificateNumber = '124153476848';
//             comp.applyBasicInfo.firstName = '杨';
//             comp.applyBasicInfo.lastName = '过';
//             spyOn(ApplyCommonService, 'getNoticeListByNumberAndName').and.returnValue(Promise.resolve());
//             comp.bindNoticesByIDAndName(comp.applyBasicInfo.certificateNumber,
// comp.applyBasicInfo.firstName, comp.applyBasicInfo.lastName);
//         }));

//     it('bindNoticesByIDAndName', inject([ApplyGovermentComponent, ApplyCommonService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService) => {
//             comp.applyBasicInfo.certificateNumber = '124153476848';
//             comp.applyBasicInfo.firstName = '杨';
//             comp.applyBasicInfo.lastName = '过';
//             spyOn(ApplyCommonService, 'getNoticeListByNumberAndName').and.returnValue(Promise.reject('err'));
//             comp.bindNoticesByIDAndName(comp.applyBasicInfo.certificateNumber,
// comp.applyBasicInfo.firstName, comp.applyBasicInfo.lastName);
//         }));

//     // 加载人口信息
//     it('bindApplyPersonListByIDAndName success', inject([ApplyGovermentComponent, ApplyCommonService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService) => {
//             comp.applyBasicInfo.certificateNumber = '124153476848';
//             comp.applyBasicInfo.firstName = '杨';
//             comp.applyBasicInfo.lastName = '过';
//             spyOn(ApplyCommonService, 'getPersonInfoListByNumberAndName').and.returnValue(Promise.resolve());
//             comp.bindApplyPersonListByIDAndName(comp.applyBasicInfo.certificateNumber, comp.applyBasicInfo.firstName,
//                 comp.applyBasicInfo.lastName);
//         }));

//     it('bindApplyPersonListByIDAndName failed', inject([ApplyGovermentComponent, ApplyCommonService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService) => {
//             comp.applyBasicInfo.certificateNumber = '124153476848';
//             comp.applyBasicInfo.firstName = '杨';
//             comp.applyBasicInfo.lastName = '过';
//             spyOn(ApplyCommonService, 'getPersonInfoListByNumberAndName').and.returnValue(Promise.reject('err'));
//             comp.bindApplyPersonListByIDAndName(comp.applyBasicInfo.certificateNumber, comp.applyBasicInfo.firstName,
//                 comp.applyBasicInfo.lastName);
//         }));

//     // 获取申请目的基础数据
//     it('bindApplyPurposeData success', inject([ApplyGovermentComponent, ApplyCommonService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService) => {
//             spyOn(ApplyCommonService, 'getApplyPurposeList').and.returnValue(Promise.resolve());
//             comp.bindApplyPurposeData();
//         }));

//     it('bindApplyPurposeData failed', inject([ApplyGovermentComponent, ApplyCommonService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService) => {
//             spyOn(ApplyCommonService, 'getApplyPurposeList').and.returnValue(Promise.reject('err'));
//             comp.bindApplyPurposeData();
//         }));

//     // 获取省数据
//     it('bindProvinceData', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let countryId = '';
//             spyOn(OrganizationService, 'getProvinceDataForDisplay').and.returnValue(Promise.resolve());
//             comp.bindProvinceData(countryId);
//         }));

//     it('bindProvinceData failed', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let countryId = '';
//             spyOn(OrganizationService, 'getProvinceDataForDisplay').and.returnValue(Promise.reject('err'));
//             comp.bindProvinceData(countryId);
//         }));

//     it('bindGovernmentProvinceData', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let countryId = '';
//             spyOn(OrganizationService, 'getProvinceDataForDisplay').and.returnValue(Promise.resolve());
//             comp.bindGovernmentProvinceData(countryId);
//         }));

//     it('bindGovernmentProvinceData falied', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let countryId = '';
//             spyOn(OrganizationService, 'getProvinceDataForDisplay').and.returnValue(Promise.reject('err'));
//             comp.bindGovernmentProvinceData(countryId);
//         }));

//     // 获取城市数据
//     it('bindCityData', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let provinceid = '';
//             spyOn(OrganizationService, 'getCityDataForDisplay').and.returnValue(Promise.resolve());
//             comp.bindCityData(provinceid);
//         }));

//     it('bindCityData', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let provinceid = '';
//             spyOn(OrganizationService, 'getCityDataForDisplay').and.returnValue(Promise.reject('err'));
//             comp.bindCityData(provinceid);
//         }));

//     it('bindGovermentCityData', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let provinceid = '';
//             spyOn(OrganizationService, 'getCityDataForDisplay').and.returnValue(Promise.resolve());
//             comp.bindGovermentCityData(provinceid);
//         }));

//     it('bindGovermentCityData', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let provinceid = '';
//             spyOn(OrganizationService, 'getCityDataForDisplay').and.returnValue(Promise.reject('err'));
//             comp.bindGovermentCityData(provinceid);
//         }));

//     // 获取社区数据
//     it('bindCommunityData', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let relationid = '';
//             spyOn(OrganizationService, 'getCommunityDataForDisplay').and.returnValue(Promise.resolve());
//             comp.bindCommunityData(relationid);
//         }));

//     it('bindCommunityData failed', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let relationid = '';
//             spyOn(OrganizationService, 'getCommunityDataForDisplay').and.returnValue(Promise.reject('err'));
//             comp.bindCommunityData(relationid);
//         }));

//     it('bindGovermentCommunityData', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let relationid = '';
//             spyOn(OrganizationService, 'getCommunityDataForDisplay').and.returnValue(Promise.resolve());
//             comp.bindGovermentCommunityData(relationid);
//         }));

//     it('bindGovermentCommunityData failed', inject([ApplyGovermentComponent, OrganizationService],
//         (comp: ApplyGovermentComponent, OrganizationService: OrganizationService) => {
//             let relationid = '';
//             spyOn(OrganizationService, 'getCommunityDataForDisplay').and.returnValue(Promise.reject('err'));
//             comp.bindGovermentCommunityData(relationid);
//         }));

//     // 选中省
//     it('selectIndexOfProvince', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.selectIndexOfProvince(e);
//     }));

//     it('selectIndexOfGovermentProvince', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.selectIndexOfGovermentProvince(e);
//     }));

//     // 选中市
//     it('selectIndexOfCity', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.selectIndexOfCity(e);
//     }));

//     it('selectIndexOfGovermentCity', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.selectIndexOfGovermentCity(e);
//     }));

//     // 时间数据转化
//     it('formatdDate', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyInfo.applyTime = applyInfo.applyTime;
//         comp.applyBasicInfo.credentialsIssueDate = applyBasicInfo.credentialsIssueDate;
//         comp.applyBasicInfo.dateOfBirth = applyBasicInfo.dateOfBirth;
//         comp.formatDate();
//     }));

//     it('formatdDate', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyInfo.applyTime = null;
//         comp.applyBasicInfo.credentialsIssueDate = null;
//         comp.applyBasicInfo.dateOfBirth = null;
//         comp.formatDate();
//     }));

//     // 数据回填
//     it('dataBackFill', inject([ApplyGovermentComponent, DxDataGridComponent],
//         (comp: ApplyGovermentComponent, dxDataGridComponent: DxDataGridComponent) => {
//             comp.grids = dxDataGridComponent;
//             comp.applyBasicInfo.otherFeature = applyBasicInfo.otherFeature;
//             comp.applyBasicInfo.description = applyBasicInfo.description;
//             comp.applyBasicInfo.detailAddress = applyBasicInfo.detailAddress;
//             comp.dataBackFill();
//             expect(comp.applyDescriptionLength).toEqual(comp.applyBasicInfo.description.length);
//             expect(comp.otherFeatureLength).toEqual(comp.applyBasicInfo.otherFeature.length);
//             expect(comp.adressDescriptionLength).toEqual(comp.applyBasicInfo.detailAddress.length);
//         }));

//     // 附件查询预览
//     it('onPerview success', inject([ApplyGovermentComponent, ApplyCommonService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService) => {
//             let filePath = '';
//             spyOn(ApplyCommonService, 'getImageFormUploaded').and.returnValue(Promise.resolve());
//             comp.onPerview(filePath);
//             expect(comp.pupopSee).toEqual(true);
//         }));

//     it('onPerview failed', inject([ApplyGovermentComponent, ApplyCommonService],
//         (comp: ApplyGovermentComponent, ApplyCommonService: ApplyCommonService) => {
//             let filePath = '';
//             spyOn(ApplyCommonService, 'getImageFormUploaded').and.returnValue(Promise.reject('err'));
//             comp.onPerview(filePath);
//         }));

//     // 审核
//     it('setApplyInfoStatus', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyInfo.analysisResultID = '1';
//         comp.setApplyInfoStatus();
//     }));

//     it('setApplyInfoStatus', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyInfo.analysisResultID = '2';
//         comp.setApplyInfoStatus();
//     }));

//     it('setApplyInfoStatus', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.applyInfo.analysisResultID = '4';
//         comp.setApplyInfoStatus();
//     }));

//     // 选择文件时判断文件是否合法
//     it('selectedFileOnChanged', inject([ApplyGovermentComponent, FileUploader, FileItem],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader, fileItem: FileItem) => {
//             comp.uploader = fileUploader;
//             let imageFormat: string;
//             comp.uploader.queue.length = 1;
//             comp.illegalImage.length = 1;
//             imageFormat = 'string';
//             comp.imageTypeFormat = ['jpg'];
//             comp.selectedFileOnChanged();
//             expect(comp.illegalImageVisible).toEqual(true);
//         }));

//     it('selectedFileOnChanged with imageTypeFormat null', inject([ApplyGovermentComponent, FileUploader, FileItem],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader, fileItem: FileItem) => {
//             comp.uploader = fileUploader;
//             let imageFormat: string;
//             comp.uploader.queue.length = 0;
//             comp.illegalImage.length = 0;
//             imageFormat = 'jpg';
//             comp.imageTypeFormat = ['jpg'];
//             spyOn(comp, 'preMeet');
//             comp.selectedFileOnChanged();
//         }));

//     //  预览图片
//     it('preMeet', inject([ApplyGovermentComponent, FileItem], (comp: ApplyGovermentComponent, fileItem: FileItem) => {
//         let item = fileItem;
//         comp.preMeet(item);
//     }));

//     // 上传所有文件
//     it('uploadAllFile', inject([ApplyGovermentComponent, FileUploader],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader) => {
//             comp.uploader = fileUploader;
//             comp.uploadAllFile();
//         }));

//     // loading显示时
//     it('onShown', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.onShown();
//         expect(comp.loadingVisible).toEqual(false);
//     }));


//     // loading消失后
//     it('onHidden', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.onHidden();
//     }));

//     // 弹出操作结果提示信息
//     it('popupOperationInfo', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let isSucess = true;
//         let isHasCrimeRecord = 1;
//         let isCrime = false;
//         comp.popupOperationInfo(isSucess, isHasCrimeRecord, isCrime);
//         expect(comp.operationInfo).toEqual('save success');
//     }));

//     it('popupOperationInfo', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let isSucess = false;
//         let isHasCrimeRecord = 1;
//         let isCrime = true;
//         comp.popupOperationInfo(isSucess, isHasCrimeRecord, isCrime);
//         expect(comp.operationInfo).toEqual('save success');
//     }));

//     // 弹出操作结果提示信息
//     it('popupOperationInfo', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         let isSucess = false;
//         let isHasCrimeRecord = 0;
//         let isCrime = false;
//         comp.popupOperationInfo(isSucess, isHasCrimeRecord, isCrime);
//         expect(comp.operationInfo).toEqual('save failure');
//     }));


//     // 将上传的附加信息绑定给附件列表
//     it('bindAttachmentListData queue.length > 0', inject([ApplyGovermentComponent, FileUploader],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader) => {
//             comp.uploader = fileUploader;
//             comp.uploader.queue.length = 1;
//             comp.bindAttachmentListData();
//         }));

//     it('bindAttachmentListData queue.length = 0', inject([ApplyGovermentComponent, FileUploader],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader) => {
//             comp.uploader = fileUploader;
//             comp.uploader.queue.length = 0;
//             comp.bindAttachmentListData();
//         }));


//     // 清空附件列表
//     it('clearCharacterCount', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent) => {
//         comp.clearCharacterCount();
//         expect(comp.adressDescriptionLength).toEqual(0);
//         expect(comp.applyDescriptionLength).toEqual(0);
//         expect(comp.otherFeatureLength).toEqual(0);
//         expect(comp.applynoteDescriptionLength).toEqual(0);
//     }));

//     // 移除单个文件
//     it('removeSingle', inject([ApplyGovermentComponent, FileItem],
//         (comp: ApplyGovermentComponent, fileItem: FileItem) => {
//             let item = fileItem;
//             let idx = 1;
//             comp.removeSingle(item, idx);
//         }));

//     // 调用服务，保存3类基本信息
//     it('saveApplyGovermentInfo success', inject([ApplyGovermentComponent, ApplyGovermentService, NgForm, FileUploader],
//         (comp: ApplyGovermentComponent, ApplyGovermentService: ApplyGovermentService, NgForm: NgForm, fileUploader: FileUploader) => {
//             let ngform = NgForm;
//             spyOn(ApplyGovermentService, 'saveCertificateApplyInfo').and.returnValue(Promise.resolve(true));
//             comp.uploader = fileUploader;
//             comp.saveApplyGovermentInfo(ngform);
//         }));

//     it('saveApplyGovermentInfo err', inject([ApplyGovermentComponent, ApplyGovermentService, NgForm],
//         (comp: ApplyGovermentComponent, ApplyGovermentService: ApplyGovermentService, NgForm: NgForm) => {
//             let ngform = NgForm;
//             spyOn(ApplyGovermentService, 'saveCertificateApplyInfo').and.returnValue(Promise.resolve(false));
//             comp.saveApplyGovermentInfo(ngform);
//         }));

//     it('saveApplyGovermentInfo err', inject([ApplyGovermentComponent, ApplyGovermentService, NgForm],
//         (comp: ApplyGovermentComponent, ApplyGovermentService: ApplyGovermentService, NgForm: NgForm) => {
//             let ngform = NgForm;
//             spyOn(ApplyGovermentService, 'saveCertificateApplyInfo').and.returnValue(Promise.reject('error'));
//             comp.saveApplyGovermentInfo(ngform);
//         }));

//     // 将勾选的公告存入公告ID数组
//     it('pushSelectNoticeToList', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent, ngform: NgForm) => {
//         comp.noticeIDList = ['2'];
//         comp.applyAndNoticeRelationList = [];
//         comp.noticeIDs.length = 1;
//         comp.noticeID = '1';
//         comp.pushSelectNoticeToList();
//     }));

//     it('pushSelectNoticeToList', inject([ApplyGovermentComponent], (comp: ApplyGovermentComponent, ngform: NgForm) => {
//         comp.noticeIDList = ['1'];
//         comp.applyAndNoticeRelationList = [];
//         comp.noticeIDs.length = 0;
//         comp.noticeID = '1';
//         comp.pushSelectNoticeToList();
//     }));

//     // 保存
//     it('onSubmit', inject([ApplyGovermentComponent, NgForm], (comp: ApplyGovermentComponent, ngform: NgForm) => {
//         let from = ngform;
//         comp.applyInfo.analysisResultID = '1';
//         comp.noticeIDList = [];
//         comp.applyAndNoticeRelationList = [];
//         comp.noticeIDs = [];
//         comp.onSubmit(from);
//         expect(comp.noticeWarnming).toBe(true);
//     }));

//     it('onSubmit', inject([ApplyGovermentComponent, NgForm, FileUploader],
//         (comp: ApplyGovermentComponent, ngform: NgForm, fileUploader: FileUploader) => {
//             let from = ngform;
//             comp.applyInfo.analysisResultID = '1';
//             comp.noticeIDList = [];
//             comp.applyAndNoticeRelationList = [];
//             comp.noticeIDs = noticeIDs;
//             comp.uploader = fileUploader;
//             comp.uploader.queue = [];
//             comp.onSubmit(from);
//             expect(comp.onSubmit(from)).toBe(comp.saveApplyGovermentInfo(form));
//         }));

//     it('onSubmit', inject([ApplyGovermentComponent, FileUploader, FileItem, NgForm],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader, fileItem: FileItem, ngform: NgForm) => {
//             let from = ngform;
//             comp.applyInfo.analysisResultID = '1';
//             comp.noticeIDList = [];
//             comp.applyAndNoticeRelationList = [];
//             comp.noticeIDs = noticeIDs;
//             comp.uploader = fileUploader;
//             let item = fileItem;
//             let res = '1';
//             let status = 200;
//             let headers = {};
//             comp.storeFileID = [];
//             comp.onSubmit(from);
//             comp.uploader.onSuccessItem(item, res, status, headers);

//             expect(comp.storeFileID).toEqual([JSON.parse('1')]);
//         }));

//     it('onSubmit', inject([ApplyGovermentComponent, FileUploader, FileItem, NgForm],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader, fileItem: FileItem, ngform: NgForm) => {
//             let from = ngform;
//             comp.applyInfo.analysisResultID = '1';
//             comp.noticeIDList = [];
//             comp.applyAndNoticeRelationList = [];
//             comp.noticeIDs = noticeIDs;
//             comp.uploader = fileUploader;
//             let item = fileItem;
//             let res = '';
//             let status = 400;
//             let headers = {};
//             comp.uploader.onSuccessItem(item, res, status, headers);
//             comp.onSubmit(from);
//             expect(comp.uploader.onSuccessItem(item, res, status, headers)).toBe(console.log('error'));
//         }));

//     it('onSubmit', inject([ApplyGovermentComponent, FileUploader, FileItem, NgForm],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader, fileItem: FileItem, ngform: NgForm) => {
//             let from = ngform;
//             comp.applyInfo.analysisResultID = '1';
//             comp.noticeIDList = [];
//             comp.applyAndNoticeRelationList = [];
//             comp.noticeIDs = noticeIDs;
//             comp.uploader = fileUploader;
//             let item = fileItem;
//             let res = '';
//             let status = 200;
//             let headers = {};
//             comp.attachmentList = [];
//             comp.uploader.onSuccessItem(item, res, status, headers);
//             comp.onSubmit(from);
//             expect(comp.onSubmit(from)).toBe(comp.saveApplyGovermentInfo(form));
//         }));

//     it('onSubmit', inject([ApplyGovermentComponent, FileUploader, FileItem, NgForm],
//         (comp: ApplyGovermentComponent, fileUploader: FileUploader, fileItem: FileItem, ngform: NgForm) => {
//             let from = ngform;
//             comp.applyInfo.analysisResultID = '1';
//             comp.noticeIDList = [];
//             comp.applyAndNoticeRelationList = [];
//             comp.noticeIDs = noticeIDs;
//             comp.uploader = fileUploader;
//             let item = fileItem;
//             let res = '';
//             let status = 200;
//             let headers = {};
//             let i = 1;
//             comp.attachmentList = attachmentList;
//             comp.storeFileID = ['1'];
//             comp.uploader.onSuccessItem(item, res, status, headers);
//             comp.uploader.onCompleteAll();
//             comp.onSubmit(from);
//             expect(comp.uploader.onCompleteAll()).toEqual(comp.attachmentList[i].filePath = comp.storeFileID[i]);
//         }));


// });

