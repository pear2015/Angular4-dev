import { Component, OnChanges, Input, ViewChild, Output, EventEmitter, SimpleChanges, ViewChildren, QueryList } from '@angular/core';


import { DxDataGridComponent } from 'devextreme-angular';
import { TranslateService } from 'ng2-translate';
import { ToastrService } from 'ngx-toastr';
import { ApplyCommonService } from '../../../+crms-common/services/apply-common.service';
import { ApplyPersonQuery } from '../../../model/certificate-apply/ApplyPersonQuery';
import { OperationLog } from '../../../model/logs/operationLog';
import { ApplyAndCriminalRelation } from '../../../model/certificate-apply/ApplyAndCriminalRelation';
import { SimilarityCalculate } from '../../../+crms-common/services/similarity-calculate.service';
import { SortorderAlgorithmService } from '../../../+crms-common/services/sortorder-algorithm.service';
import { EnumInfo } from '../../../enum';
import { UtilHelper, ConfigService } from '../../../core';
import * as moment from 'moment';
import { DxValidationGroupComponent } from 'devextreme-angular';
@Component({
  selector: 'govementBasic-info',
  templateUrl: './basic-info.component.html',
  providers: [EnumInfo]
})
export class ApplyGovermentBasicInfoComponent implements OnChanges {
  @Input() applyBasicInfo;
  @Input() applyInfo;
  @Input() isAnalysised;
  @Input() criminalInfo;
  @Input() dataCount;
  @Input() isEdit;
  @Input() crimeNoticeQuery;
  @Output() crimeNoticeEmit = new EventEmitter();
  @Output() basicInfoEmit = new EventEmitter();
  @Output() clearInfo: EventEmitter<any>;
  @ViewChild('crimeGrid')
  crimeGrid: DxDataGridComponent;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  /**
   * 证件类型
   */
  certificateTypeList: any[];
  /**
  * 性别
  */
  genderEnum: any[];
  now: Date = new Date();
  applyRejectReasonLength: number = 0;
  isRejected: boolean = true;
  /**
   * 查询弹窗的分页对象
   */
  applyPersonQuery: ApplyPersonQuery;
  personInfoList: any[] = [];
  /**
   * 弹窗分页--总数
   */
  personTotalCount: number;
  /**
   * 弹窗显示控制
   */
  fillDataVisible: boolean;
  /**
   * 分页按钮的显示和隐藏
   */
  pageMenuVisible: boolean;
  /**
   * loading是否显示
   */
  loadingVisible: boolean;
  /**
   * 操作记录日志
   */
  operationLog: OperationLog;
  /**
   * 婚姻状态
   */
  marriageEnum: any[];

  /**
   *  回填按钮是否可用
   */
  isDataBackFill: boolean = true;

  // 提交分析按钮是否显示
  showAnalysised: boolean = false;
  /**
* 国籍
*/
  countryOfCitizenshipEnum: any[];
  /**
   * 是否按照证件类型查询
   */
  isSelectByCerNumber: boolean = true;
  /**
* 是否姓名+性别查询
*/
  isSelectByNameAndSex: boolean = false;

  /**
   * 回填选中的对象储存
   */
  backSelectData: any;
  otherFeatureLength: number;
  applyDescriptionLength: number;
  applyBasicDetaileAddressLength: number;
  applyOtherPurposeReasonLength: number;
  noticeIDs: any;
  popupNoticeVisible: boolean;
  applyAndCriminalRelation: ApplyAndCriminalRelation;

  // 清空按钮tooltip
  clearPageTolVisible: boolean = false;

  /**
 * 分析结果
 */
  analysisResultEnum: any[];
  totalCount: number;
  // 身份证证件号码正则
  idNumberRegex: string;
  // 其他证件号码正则
  otherCertificateTypeRegex: string;
  // 父母身份证正则
  idCardNumberRegex: string;
  // regex 中间变量
  certificateRegexTemp: string;
  // 证件号码是否必填
  certificateNumberDisabled: boolean = true;
  // 必填星号是否显示
  certificateRequired: boolean = true;
  credentialsIssuePlaceLength: number = 0;
  // 匹配度模型
  applyPersonParamter: ApplyPersonQuery;
  // 最小出生年份
  minDateOfBirth: any;
  constructor(
    private utilHelper: UtilHelper,
    private applyCommonService: ApplyCommonService,
    private enumInfo: EnumInfo,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private configService: ConfigService,
    private similarityCalculate: SimilarityCalculate,
    private sortorderAlgorithmService: SortorderAlgorithmService
  ) {
    this.applyPersonQuery = new ApplyPersonQuery();
    this.applyPersonParamter = new ApplyPersonQuery();
    this.operationLog = new OperationLog();
    this.applyAndCriminalRelation = new ApplyAndCriminalRelation();
    this.applyPersonQuery.pages = 0;
    this.applyPersonQuery.pageSize = 5;
    this.genderEnum = this.enumInfo.getGenderEnum;
    // this.marriageEnum = this.enumInfo.getMarriageEnum;
    // 分析结果
    this.analysisResultEnum = this.enumInfo.getAnalysisResult;
    this.bindCertificateTypeData();
    this.bindMarriageData();
    this.clearInfo = new EventEmitter();
    this.getMinDateOfBirth();
    this.countryOfCitizenshipEnum = this.enumInfo.getCountryOfCitizenshipEnum;
  }

  // 清除当前页按钮提示
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }

  /**
   * 通过路由传来的applyBasicInfo获取相关犯罪信息
   */
  async bindNoticesByName() {
    this.crimeNoticeQuery.certificateType = this.applyBasicInfo.certificateType;
    this.crimeNoticeQuery.certificateNumber = this.applyBasicInfo.certificateNumber;
    this.crimeNoticeQuery.firstName = this.applyBasicInfo.firstName;
    this.crimeNoticeQuery.lastName = this.applyBasicInfo.lastName;
    try {
      let result = await this.applyCommonService.getNoticeListByNumberAndName(this.crimeNoticeQuery);
      if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.data)) {
        this.isAnalysised = true;
        this.criminalInfo = result.data;
        this.dataCount = result.totalCount;
      }
    } catch (error) {
      console.log(error);
    }
  }
  /**
* 点击分页按钮，重新拉取数据
*
*/
  changeCriminalInfo(obj) {
    this.crimeNoticeQuery.pages = obj.pages;
    this.crimeNoticeEmit.emit(this.crimeNoticeQuery.pages);
  }

  /**
       * 初始化身份证和联系电话的正则表达式
       *
       * @memberof CrmsPersonApplyBasicInfoComponent
       */
  async getIdNumberAndPhoneRegx() {
    let result = await this.configService.get(['idnumberRegex', 'otherCertificateTypeRegex']);
    this.certificateRegexTemp = result[0];
    this.idNumberRegex = result[0];
    this.otherCertificateTypeRegex = result[1];
    this.idCardNumberRegex = result[0];
  }
  /**
   * 根据证件类型生成不同正则
   * certificateType 0 身份证      1其他      2 一般证件     3无
   *
   * @param {any} e
   * @memberof CrmsPersonApplyBasicInfoComponent
   */
  selectedCertificateType(e) {
    if (this.utilHelper.AssertNotNull(this.certificateTypeList) && e.selectedItem !== null) {
      this.applyBasicInfo.certificateNumber = '';
      let certificateType = e.selectedItem.type;
      this.exChangeCertificateNum(certificateType);
    }
  }
  /**
   *
   * 根据证件类型 发生变化证件规则发生变化
   *
   */
  exChangeCertificateNum(certificateType: string) {
    // 身份证
    if (this.utilHelper.AssertNotNull(certificateType) && certificateType === '0') {
      this.idNumberRegex = this.certificateRegexTemp;
      this.certificateNumberDisabled = false;
      this.certificateRequired = false;
      this.isSelectByCerNumber = true;
      this.isSelectByNameAndSex = false;
    } else if (this.utilHelper.AssertNotNull(certificateType) && certificateType === '3') {// 证件类型为无
      this.certificateNumberDisabled = true;
      this.certificateRequired = true;
      this.isSelectByCerNumber = false;
      this.isSelectByNameAndSex = true;
    } else {
      this.idNumberRegex = this.otherCertificateTypeRegex;
      this.certificateNumberDisabled = false;
      this.certificateRequired = false;
      this.isSelectByCerNumber = true;
      this.isSelectByNameAndSex = false;

    }
  }

  /**
   * select性别控件选中内容事件
   * @param e
   */
  public selectIndenxOfGender(e) {
    if (e != null && e !== undefined) {
      this.applyBasicInfo.sexId = e.value;
    }
  }
  /**
   * 获取证件类型
   */
  private bindCertificateTypeData() {
    this.applyCommonService.getCertificateTypeList('GOVENMENT').then(result => {
      this.certificateTypeList = result;
    }).catch(err => {
      console.log(err);
    });
  }
  /**
   *  国际化
   */
  private getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }


  // 6、个人描述
  countCredentialsIssuePlaceCharacter() {
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.credentialsIssuePlace)) {
      this.credentialsIssuePlaceLength = this.applyBasicInfo.credentialsIssuePlace.length;
    }
  }
  /**
   * 根据证件类型+证件编号对申请信息进行人口回填
   */
  async getPersonInfoByNumber() {
    let certificateTypeId = this.certificateTypeList[this.certificateTypeList.length - 1].certificateTypeId;
    let certificateType = this.applyBasicInfo.certificateType;
    let certificateNumber = '';
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.certificateNumber)) {
      certificateNumber = this.applyBasicInfo.certificateNumber;
    } else {
      certificateNumber = '';
    }
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
    if ((this.utilHelper.AssertEqualNull(certificateType) && this.utilHelper.AssertEqualNull(certificateNumber))
      || (certificateType !== certificateTypeId && certificateNumber === '')) {
      tips = this.utilHelper.AssertEqualNull(certificateNumber) ? tips + this.getTranslateName('certificateNumber') + ' ' : tips;
    }
    if ((this.utilHelper.AssertNotNull(certificateType) && this.utilHelper.AssertNotNull(certificateNumber))
      || (certificateType === certificateTypeId && certificateNumber === '')) {

      this.applyPersonQuery.certificateType = certificateType;
      this.applyPersonQuery.certificateId = certificateNumber;
      this.applyPersonQuery.firstName = '';
      this.applyPersonQuery.lastName = '';
      this.applyPersonQuery.sexId = '';
      this.searchByApplyPersonQuery(this.applyPersonQuery);
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
  /**
   * 根据姓名姓别查询
   *
   */
  async   getPersonInfoByName() {
    let firstName = this.applyBasicInfo.firstName;
    let lastName = this.applyBasicInfo.lastName;
    let sexId = this.applyBasicInfo.sexId;
    let tips: string = this.getTranslateName('please entering') + ':';
    tips = this.utilHelper.AssertEqualNull(lastName) ? tips + this.getTranslateName('lastName') + ' ' : tips;
    tips = this.utilHelper.AssertEqualNull(firstName) ? tips + this.getTranslateName('firstName') + ' ' : tips;
    tips = this.utilHelper.AssertEqualNull(sexId) ? tips + this.getTranslateName('sexName') + ' ' : tips;
    let obj: any = {
      certificateType: this.applyBasicInfo.certificateType,
      certificateId: this.applyBasicInfo.certificateNumber,
      firstName: this.applyBasicInfo.firstName,
      lastName: this.applyBasicInfo.lastName,
      sexId: this.applyBasicInfo.sexId
    };
    this.applicationExchange(obj);
    if (this.utilHelper.AssertNotNull(firstName) && this.utilHelper.AssertNotNull(lastName) && this.utilHelper.AssertNotNull(sexId)
    ) {
      this.applyPersonQuery.firstName = firstName;
      this.applyPersonQuery.lastName = lastName;
      this.applyPersonQuery.sexId = sexId;
      this.applyPersonQuery.certificateType = '';
      this.applyPersonQuery.certificateId = '';
      this.searchByApplyPersonQuery(this.applyPersonQuery);
    } else {

      this.toastr.clear();
      this.toastr.error(tips);
    }
  }
  /**
   * 调用服务 查询申请人信息列表
   */
  async searchByApplyPersonQuery(applyPersonQuery: ApplyPersonQuery) {
    try {
      let result = await this.applyCommonService.getPersonInfoListByCertificateNumber(this.applyPersonQuery);
      if (this.utilHelper.AssertNotNull(result)) {
        this.personInfoList = result;
        this.fillDataVisible = true;
        this.personInfoList.forEach(item => {
          item.point = this.similarityCalculate.applicantSimilarityBF(item, this.applyPersonParamter);
          item.name = item.firstName + ' ' + item.lastName;
        });
        this.personInfoList = this.sortorderAlgorithmService.insertSortSimilarityUse(this.personInfoList);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 回填按钮是否可用
   */
  public isDisabledBackFill(obj) {
    if (this.utilHelper.AssertNotNull(obj.selectedRowKeys[0]) && obj.selectedRowKeys.length > 0) {
      this.isDataBackFill = false;
      this.backSelectData = obj.selectedRowKeys[0];
    }
  }

  /**
   * 数据回填
   */
  public dataBackFill() {
    if (this.utilHelper.AssertNotNull(this.backSelectData)) {
      this.applyBasicInfo = this.backSelectData;
      if (this.utilHelper.AssertNotNull(this.applyBasicInfo.dateOfBirth)) {
        this.applyBasicInfo.dateOfBirth = new Date(this.backSelectData.dateOfBirth);
      }
      if (this.utilHelper.AssertNotNull(this.applyBasicInfo.credentialsIssueDate)) {
        this.applyBasicInfo.credentialsIssueDate = new Date(this.backSelectData.credentialsIssueDate);
      }
      /**
       * 回填后更新文本域统计字符
       */
      if (this.utilHelper.AssertNotNull(this.applyBasicInfo.otherFeature)) {
        this.otherFeatureLength = this.applyBasicInfo.otherFeature.length;
      }
      if (this.utilHelper.AssertNotNull(this.applyBasicInfo.description)) {
        this.applyDescriptionLength = this.applyBasicInfo.description.length;
      }
      if (this.utilHelper.AssertNotNull(this.applyBasicInfo.detailAddress)) {
        this.applyBasicDetaileAddressLength = this.applyBasicInfo.detailAddress.length;
      }

      if (this.utilHelper.AssertNotNull(this.applyInfo.otherPurposeReason)) {
        this.applyOtherPurposeReasonLength = this.applyInfo.otherPurposeReason.length;
      }
      this.fillDataVisible = false;
    } else {
      this.fillDataVisible = false;
    }

    if (this.utilHelper.AssertEqualNull(this.applyBasicInfo.countryOfCitizenship)) {
      this.applyBasicInfo.countryOfCitizenship = this.countryOfCitizenshipEnum[0].name;
    }
    if (this.utilHelper.AssertEqualNull(this.applyBasicInfo.livingCountryName)) {
      this.applyBasicInfo.livingCountryName = this.countryOfCitizenshipEnum[0].name;
    }
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.certificateNumber)) {
      this.exChangeCertificateNum(this.applyBasicInfo.certificateNumber);
    }

    this.basicInfoEmit.emit(this.applyBasicInfo);
  }
  /**
      * 根据证件类型生成不同正则
      *
      * @param {any} e
      * @memberof CrmsPersonApplyBasicInfoComponent
      */


  outPutApplyBasicInfo() {
    return this.applyBasicInfo;
  };

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

  getAge() {
    if (this.utilHelper.AssertNotNull(this.applyBasicInfo.dateOfBirth)) {
      this.applyBasicInfo.age = this.getFullAge(this.applyBasicInfo.dateOfBirth);
    } else {
      this.applyBasicInfo.age = null;
    }
  }


  ngOnChanges(changes: SimpleChanges) {
    this.totalCount = this.dataCount;
    this.getIdNumberAndPhoneRegx();
    if (this.utilHelper.AssertNotNull(changes.isEdit) && this.utilHelper.AssertNotNull(changes.isEdit.currentValue)) {
    }
    this.getAge();
    this.getMinDateOfBirth();
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


  /**
* 去除证件号码前后空格
*/
  certificateNumberTrim() {
    if (this.applyBasicInfo.certificateNumber !== undefined && this.applyBasicInfo.certificateNumber != null) {
      this.applyBasicInfo.certificateNumber = this.applyBasicInfo.certificateNumber.trim();
    }
  }
  // 婚姻状态
  bindMarriageData() {
    this.applyCommonService.getMarriageList().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.marriageEnum = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }
}
