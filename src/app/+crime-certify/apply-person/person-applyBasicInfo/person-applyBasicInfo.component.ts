import { Component, OnInit, Input, EventEmitter, Output, OnChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { EventAggregator, UtilHelper, ConfigService } from '../../../core';
import { ApplyPersonQuery } from '../../../model/certificate-apply/ApplyPersonQuery';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { DxDataGridComponent } from 'devextreme-angular';
import { SimilarityCalculate } from '../../../+crms-common/services/similarity-calculate.service';
import { SortorderAlgorithmService } from '../../../+crms-common/services/sortorder-algorithm.service';
import { ApplyCommonService } from '../../../+crms-common/services/apply-common.service';
import * as moment from 'moment';
import { DxValidationGroupComponent } from 'devextreme-angular';
@Component({
  selector: 'person-applyBasicInfo',
  templateUrl: './person-applyBasicInfo.component.html',
  providers: []
})

export class CrmsPersonApplyBasicInfoComponent implements OnInit, OnChanges {

  @ViewChild(DxDataGridComponent) personInfoGrids: DxDataGridComponent;

  applyPersonQuery: ApplyPersonQuery;
  // 匹配度模型
  applyPersonParamter: ApplyPersonQuery;

  // 时间输入域控制
  now: Date = new Date();

  showLivingDetailAddress: boolean = false;
  showCountryDetailPlace: boolean = false;

  /**
   * 文本域输入字符统计
   */
  applyBasicOtherFeatureLength: number = 0;
  applyBasicDetaileAddressLength: number = 0;
  applyBasicDescriptionLength: number = 0;
  credentialsIssuePlaceLength: number = 0;

  // 清空按钮tooltip
  clearPageTolVisible: boolean = false;

  fillDataVisible: boolean = false;
  dataBackDisabled: boolean = false;

  // 电话号码正则
  telephoneRegex: string;
  // 身份证证件号码正则
  idNumberRegex: string;
  // 父母身份证正则
  idCardNumberRegex: string;
  // 其他证件号码正则
  otherCertificateTypeRegex: string;
  // regex 中间变量
  certificateRegexTemp: string;
  // 证件号码是否必填
  certificateNumberDisabled: boolean = true;
  // 必填星号是否显示
  certificateRequired: boolean = false;
  // 分页组件
  pageMenuVisible: boolean;
  // 最小出生年份
  minDateOfBirth: any;
  @Input() applyBasicInfo: any;
  @Input() genderEnum: any;
  @Input() marriageEnum: any;
  @Input() careerList: any;
  @Input() certificateTypeList: any;

  @Input() countryOfCitizenshipEnum: any;
  @Input() provinceList: any;
  @Input() cityList: any;
  @Input() communityList: any;
  @Input() livingCountryName: any;
  @Input() livingProvinceList: any;
  @Input() livingCityList: any;
  @Input() livingCommunityList: any;
  personInfoList: any;
  @Input() dataCount: any;

  @Input() dateOfBirth: any;
  @Input() credentialsIssueDate: any;

  @Output() selectedCountryShip: EventEmitter<any>;
  @Output() selectedProvince: EventEmitter<any>;
  @Output() selectedCity: EventEmitter<any>;
  @Output() selectedlivingCountry: EventEmitter<any>;
  @Output() selectedLivingProvince: EventEmitter<any>;
  @Output() selectedLivingCity: EventEmitter<any>;
  @Output() getPersonInfoByNameAndId: EventEmitter<any>;
  @Output() sendPersonInfoOut: EventEmitter<any>;

  @Input() isReadOnly: boolean;
  @Input() clearBtnVisible: boolean;
  @Output() clearInfo: EventEmitter<any>;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  constructor(
    private eventAggregator: EventAggregator,
    private utilHelper: UtilHelper,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private configService: ConfigService,
    private similarityCalculate: SimilarityCalculate,
    private sortorderAlgorithmService: SortorderAlgorithmService,
    private applyCommonService: ApplyCommonService,
  ) {
    this.clearInfo = new EventEmitter();
    this.applyPersonQuery = new ApplyPersonQuery();
    this.applyPersonParamter = new ApplyPersonQuery();
    this.selectedCountryShip = new EventEmitter();
    this.selectedProvince = new EventEmitter();
    this.selectedCity = new EventEmitter();
    this.selectedlivingCountry = new EventEmitter();
    this.selectedLivingProvince = new EventEmitter();
    this.selectedLivingCity = new EventEmitter();
    this.getPersonInfoByNameAndId = new EventEmitter();
    this.sendPersonInfoOut = new EventEmitter();

    this.toastr.toastrConfig.timeOut = 3000;
    this.toastr.toastrConfig.maxOpened = 1;
  }

  ngOnInit() {
    // 全局清空事件订阅
    this.eventAggregator.subscribe('cleanCharacterCount', '', result => {
      this.clearCharacterCount();
    });
    // 局部清空事件订阅
    this.eventAggregator.subscribe('cleanPersonApplyBasicInfoCharacterCount', '', result => {
      this.clearCharacterCount();
    });

    this.applyPersonQuery.pages = 0;
    this.applyPersonQuery.pageSize = 5;

    this.getIdNumberAndPhoneRegx();
    this.getMinDateOfBirth();
  }

  ngOnChanges() {
    this.countCharacter();
    this.getAge();
    this.getMinDateOfBirth();
  }

  /**
   * 去除证件号码前后空格
   */
  certificateNumberTrim() {
    if (this.applyBasicInfo.certificateNumber !== undefined && this.applyBasicInfo.certificateNumber != null) {
      this.applyBasicInfo.certificateNumber = this.applyBasicInfo.certificateNumber.trim();
    }
  }
  /**
   * 初始化身份证和联系电话的正则表达式
   *
   * @memberof CrmsPersonApplyBasicInfoComponent
   */
  async getIdNumberAndPhoneRegx() {
    let result = await this.configService.get(['idnumberRegex', 'telephoneRegex', 'otherCertificateTypeRegex']);
    this.certificateRegexTemp = result[0];
    this.idNumberRegex = result[0];
    this.telephoneRegex = result[1];
    this.otherCertificateTypeRegex = result[2];
    this.idCardNumberRegex = result[0];
  }

  /**
   * 根据证件类型生成不同正则
   * 此处正则表达式有两种种情况
   * 0 身份证
   * 1 一般证件或其他证件
   *
   * @param {any} e
   * @memberof CrmsPersonApplyBasicInfoComponent
   */
  selectedCertificateType(e) {
    if (this.utilHelper.AssertNotNull(this.certificateTypeList) && e.selectedItem !== null) {
      let certificateType = e.selectedItem.type;
      this.applyBasicInfo.certificateNumber = '';
      if (this.utilHelper.AssertNotNull(certificateType) && certificateType === '0') {
        // 身份证时
        this.idNumberRegex = this.certificateRegexTemp;
        this.certificateNumberDisabled = false;
        this.certificateRequired = false;
      } else {
        this.idNumberRegex = this.otherCertificateTypeRegex;
        this.certificateNumberDisabled = false;
        this.certificateRequired = false;
      }
    }
  }

  /**
   * 限制年龄输入非数字字符
   * @param e
   */
  ageOnkeyPress(e) {
    if (this.utilHelper.AssertNotNull(e)) {
      let keycode = e.keyCode;
      let regex = new RegExp('^[0-9]*$');
      let keychar = String.fromCharCode(keycode);
      if (regex.test(keychar)) {
        return true;
      } else {
        return false;
      }
    }
  }
  // 4、其他特征
  countApplyBasicOtherFeatureCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.otherFeature)) {
      this.applyBasicOtherFeatureLength = this.applyBasicInfo.otherFeature.length;
    }
  }
  // 5、详细地址
  countApplyBasicDetileAddressCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.detailAddress)) {
      this.applyBasicDetaileAddressLength = this.applyBasicInfo.detailAddress.length;
    }
  }
  // 6、个人描述
  countApplyBasicDescriptionCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.description)) {
      this.applyBasicDescriptionLength = this.applyBasicInfo.description.length;
    }
  }
  // 6、个人描述
  countCredentialsIssuePlaceCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.credentialsIssuePlace)) {
      this.credentialsIssuePlaceLength = this.applyBasicInfo.credentialsIssuePlace.length;
    }
  }
  // 7.提交完成后清除所有统计字符
  clearCharacterCount() {
    this.applyBasicOtherFeatureLength = 0;
    this.applyBasicDetaileAddressLength = 0;
    this.applyBasicDescriptionLength = 0;
    this.credentialsIssuePlaceLength = 0;
  }

  // 统计字符
  countCharacter() {
    this.countApplyBasicOtherFeatureCharacter();
    this.countApplyBasicDetileAddressCharacter();
    this.countApplyBasicDescriptionCharacter();
    this.countCredentialsIssuePlaceCharacter();
  }

  // 清除当前页按钮提示
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }


  /**
   * 选择国籍处理省市区可见性
   * 国籍切换时清除其他数据
   */
  selectIndexOfCountryShip(e) {
    if (e.selectedItem !== null) {
      if (e.selectedItem.value === '1') {
        this.showCountryDetailPlace = false;
        this.cityList = [];
        this.communityList = [];
      } else {
        // 国家不为本国时不可编辑并清除数据
        this.showCountryDetailPlace = true;
        this.clearCountryShipAddressData();
      }
    }

  }

  /**
   * 选择国籍处理省市区可见性
   * 国籍切换时清除其他数据
   */
  selectIndexOfLivingCountry(e) {
    if (e.selectedItem !== null) {
      if (e.selectedItem.value === '1') {
        this.showLivingDetailAddress = false;
        this.livingCityList = [];
        this.livingCommunityList = [];
      } else {
        this.showLivingDetailAddress = true;
        this.clearLivingAddressData();
      }
    }
  }

  // 清除现下拉选择的省市区数据
  clearCountryShipAddressData() {
    this.applyBasicInfo.provinceName = '';
    this.applyBasicInfo.cityName = '';
    this.applyBasicInfo.communityName = '';
  }
  clearLivingAddressData() {
    this.applyBasicInfo.livingProvinceName = '';
    this.applyBasicInfo.livingCityName = '';
    this.applyBasicInfo.livingCommunityName = '';
  }
  /**
   * 此处做修改
   * 个人申请查询只按照证件类型查 不按照身份证号查询
   * date 2017-12-28 15:07
   */
  // 通过姓名和身份证号码查询犯罪库数据
  async getPersonInfoByNameAndNumber() {
    let certificateTypeId = this.certificateTypeList[this.certificateTypeList.length - 1].certificateTypeId;
    let certificateType = this.applyBasicInfo.certificateType;
    let certificateNumber = this.applyBasicInfo.certificateNumber;
    let obj: any = {
      certificateType: certificateType,
      certificateId: certificateNumber,
      firstName: this.applyBasicInfo.firstName,
      lastName: this.applyBasicInfo.lastName,
      sexId: this.applyBasicInfo.sexId
    };
    this.applicationExchange(obj);
    let tips: string = this.getTranslateName('please entering') + ':';
    tips = this.utilHelper.AssertEqualNull(certificateType) ? tips + this.getTranslateName('certificateType') + ' ' : tips;
    tips = this.utilHelper.AssertEqualNull(certificateNumber) ? tips + this.getTranslateName('certificateNumber') + ' ' : tips;
    if ((this.utilHelper.AssertNotNull(certificateType) && this.utilHelper.AssertNotNull(certificateNumber))
      || (certificateType === certificateTypeId && certificateNumber === '')) {
      this.applyPersonQuery.certificateType = certificateType;
      this.applyPersonQuery.certificateId = certificateNumber;
      this.applyPersonQuery.firstName = '';
      this.applyPersonQuery.lastName = '';
      this.applyPersonQuery.sexId = '';
      try {
        /**
         * 此处修改  2017-12-26 11：36
         * 1、先从人口库查询数据
         *  a、输入身份证 根据身份证来查询
         *  b、未输入身份证 根据姓名来查询
         * 2、人口库没有查询到数据 从犯罪库查询数据
         *  a、通过证件类型+证件号码  或 姓名   性别
         *  b、通过姓名查询
         */
        let result = await this.applyCommonService.getPersonInfoListByCertificateNumber(this.applyPersonQuery);
        if (this.utilHelper.AssertNotNull(result)) {
          this.personInfoList = result;
          this.fillDataVisible = true;
          this.personInfoList.forEach(item => {
            item.point = this.similarityCalculate.applicantSimilarityBF(item, this.applyPersonParamter);
            item.name = item.firstName + ' ' + item.lastName;
          });
          this.personInfoList = this.sortorderAlgorithmService.insertSortSimilarityUse(this.personInfoList);
          if (this.dataCount !== 0) {
            this.pageMenuVisible = false;
          } else {
            this.pageMenuVisible = true;
            this.fillDataVisible = false;
            this.toastr.clear();
            this.toastr.toastrConfig.maxOpened = 1;
            this.toastr.warning(this.getTranslateName('searched and no result'));
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {

      this.toastr.clear();
      this.toastr.error(tips);
    }
  }
  applicationExchange(obj?: any) {
    this.applyPersonParamter.certificateId = obj.certificateId ? obj.certificateId : '';
    this.applyPersonParamter.certificateType = obj.certificateType ? obj.certificateType : '';
    this.applyPersonParamter.firstName = obj.firstName ? obj.firstName : '';
    this.applyPersonParamter.lastName = obj.lastName ? obj.lastName : '';
    this.applyPersonParamter.sexId = obj.sexId ? obj.sexId : '';
  }

  // 点击分页按钮，重新拉取数据
  pageIndexChange(obj) {
    if (this.utilHelper.AssertNotNull(obj)) {
      this.applyPersonQuery.pages = obj.pages;
      this.getPersonInfoByNameAndNumber();
    }
  }

  selectChangedHandle(e) {
    if (this.utilHelper.AssertNotNull(e.selectedRowKeys) && e.selectedRowKeys.length > 0) {
      this.dataBackDisabled = false;
    }
  }


  dataBackFill() {
    if (this.personInfoGrids.selectedRowKeys.length > 0) {
      // 数据回填
      this.applyBasicInfo = this.personInfoGrids.selectedRowKeys[0];
      if (this.utilHelper.AssertNotNull(this.applyBasicInfo.dateOfBirth)) {
        this.applyBasicInfo.dateOfBirth = new Date(this.applyBasicInfo.dateOfBirth);
      }
      if (this.utilHelper.AssertNotNull(this.applyBasicInfo.credentialsIssueDate)) {
        this.applyBasicInfo.credentialsIssueDate = new Date(this.applyBasicInfo.credentialsIssueDate);
      }
      if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
        this.applyBasicInfo.age = null;
      }
      if (this.utilHelper.AssertEqualNull(this.applyBasicInfo.countryOfCitizenship)) {
        this.applyBasicInfo.countryOfCitizenship = this.countryOfCitizenshipEnum[0].name;
      }
      if (this.utilHelper.AssertEqualNull(this.applyBasicInfo.livingCountryName)) {
        this.applyBasicInfo.livingCountryName = this.countryOfCitizenshipEnum[0].name;
      }
      this.countCharacter();
      this.fillDataVisible = false;
      this.sendPersonInfoOut.emit(this.applyBasicInfo);
    };

  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  /**
   * 计算年龄
   * @param {any} strBirthday
   * @returns
   * @memberof ApplyGovermentBasicInfoComponent
   */
  getFullAge(strBirthday) {
    let returnAge: number;
    let birthYear = Number(moment(strBirthday).format('YYYY'));  // 出生日期的年份
    let birthMonth = Number(moment(strBirthday).format('MM'));  // 出生日期的月份
    let birthDay = Number(moment(strBirthday).format('DD')); // 出生日期的日
    let nowYear = Number(new Date().getFullYear());
    let nowMonth = Number(new Date().getMonth()) + 1;
    let nowDay = Number(new Date().getDate());
    if (nowYear === birthYear) {
      returnAge = 0; // 同年为0岁
    } else {
      let ageDiff = nowYear - birthYear; // 年之差
      if (ageDiff > 0) {
        if (nowMonth === birthMonth) {
          let dayDiff = nowDay - birthDay; // 日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        } else {
          let monthDiff = nowMonth - birthMonth;
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        }
      }
    }
    return returnAge;
  }

  /**
   * 获取年龄
   *
   * */
  getAge() {
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.dateOfBirth)) {
      this.applyBasicInfo.age = this.getFullAge(this.applyBasicInfo.dateOfBirth);
    } else {
      this.applyBasicInfo.age = null;
    }
  }

  //  获取最小出生日期
  getMinDateOfBirth() {
    let yearForNow: any = new Date().getFullYear();
    let monthForNow: any = new Date().getMonth() + 1;
    let day: any = new Date().getDate();
    let hour: any = new Date().getHours();
    let minute: any = new Date().getMinutes();
    let second: any = new Date().getSeconds();
    let year: any = yearForNow - 200;
    this.minDateOfBirth = new Date(year + '-' + monthForNow + '-' + day + ' ' + hour + ':' + minute + ':' + second);
  }
}
