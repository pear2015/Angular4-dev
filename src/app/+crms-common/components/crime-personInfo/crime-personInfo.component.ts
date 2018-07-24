import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { EventAggregator, UtilHelper, ConfigService } from '../../../core';
import { CrimeNoticeQuery } from '../../../model/crime-integrated-business/CrimeNoticeQuery';
import { DxDataGridComponent, DxValidationGroupComponent, DxValidatorComponent } from 'devextreme-angular';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import * as moment from 'moment';
import { CrimeAndNoticeService } from '../../services/crime-notice.service';
import { UserInfo } from '../../../model/auth/userinfo';
@Component({
  selector: 'crms-pesoninfo',
  templateUrl: './crime-personInfo.component.html',
  providers: []
})

export class CrmsCrimePersonInfoComponent implements OnInit, OnChanges {

  maxNum: number = 36; // input框最大字符数

  @ViewChild(DxDataGridComponent) personInfoGrids: DxDataGridComponent;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  @ViewChild('certificateNumberDom') certificateNumberDom: DxValidatorComponent;
  crimeNoticeQuery: CrimeNoticeQuery;
  // 匹配度模型
  crimeNoticePamter: CrimeNoticeQuery;
  crimePersonInfoDescriptionLength: number = 0;
  crimePersonInfoOtherFeatureLength: number = 0;
  crimePersonInfoDetailAddresstLength: number = 0;
  credentialsIssuePlaceLength: number = 0;
  now: Date = new Date();
  dataBackDisabled: boolean = true;
  @Input() fillDataVisible: boolean = false;
  clearPageTolVisible: boolean = false;
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
  certificateRequired: boolean = true;
  notRequiredCertificateType: string = '';
  // 最小出生年份
  minDateOfBirth: any;
  // 是否按照证件类型查询
  isSelectByCerNumber: boolean = true;
  // 是否姓名+性别查询
  isSelectByNameAndSex: boolean = false;
  // 用户信息
  userInfo: UserInfo;
  // 当前选中行
  currentselectIndex: number;
  @Input() crimePersonInfo: any;
  @Input() routerFlag: string;
  @Input() crimeInfo: any;

  @Input() certificateTypeList: any;
  @Input() genderEnum: any;
  @Input() marriageEnum: any;
  @Input() careerList: any;

  @Input() birthPlaceEnum: any;
  @Input() provinceList: any;
  @Input() cityList: any;
  @Input() communityList: any;

  @Input() livingCountryName: any;
  @Input() livingProvinceList: any;
  @Input() livingCityList: any;
  @Input() livingCommunityList: any;
  @Input() countryOfCitizenshipEnum: any;

  @Input() birthPlaceVisible: any;
  @Input() livingPlaceVisible: any;

  @Input() personInfoList: any;
  @Input() dataCount: Number;
  @Input() clearBtnVisible: boolean;
  @Input() isNeedEdit: boolean;
  @Input() backfillSearchVisible: boolean;
  @Input() isHasCertificate: boolean = false;
  @Input() waitCriminalIds: string[];

  @Output() selectedBirthCountry: EventEmitter<any>;
  @Output() selectedProvince: EventEmitter<any>;
  @Output() selectedCity: EventEmitter<any>;
  @Output() selectedlivingCountry: EventEmitter<any>;
  @Output() selectedLivingProvince: EventEmitter<any>;
  @Output() selectedLivingCity: EventEmitter<any>;
  @Output() getPersonInfoByName: EventEmitter<any>;
  @Output() sendPersonInfoOut: EventEmitter<any>;
  @Output() clearInfo: EventEmitter<any>;

  constructor(
    private eventAggregator: EventAggregator,
    private utilHelper: UtilHelper,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private configService: ConfigService,
    private crimeAndNoticeService: CrimeAndNoticeService,
  ) {
    this.selectedBirthCountry = new EventEmitter();
    this.selectedProvince = new EventEmitter();
    this.selectedCity = new EventEmitter();
    this.selectedlivingCountry = new EventEmitter();
    this.selectedLivingProvince = new EventEmitter();
    this.selectedLivingCity = new EventEmitter();
    this.getPersonInfoByName = new EventEmitter();
    this.sendPersonInfoOut = new EventEmitter();
    this.clearInfo = new EventEmitter();
    this.crimeNoticeQuery = new CrimeNoticeQuery();
  }


  ngOnInit() {
    this.userInfo = JSON.parse(localStorage.currentUser);
    this.crimeNoticeQuery.pages = 0;
    this.crimeNoticeQuery.pageSize = 5;
    // 订阅父组件清空字符
    this.eventAggregator.subscribe('cleanCharacterCount', '', result => {
      this.clearCharacterCount();
    });
    // 订阅父组件清空字符
    this.eventAggregator.subscribe('cleanPersonInfoCharacterCount', '', result => {
      this.clearCharacterCount();
    });

    this.getIdNumberAndPhoneRegx();
    this.getMinDateOfBirth();
    this.crimeNoticePamter = new CrimeNoticeQuery();
  }

  async ngOnChanges() {
    this.countCharacter();
    this.getMinDateOfBirth();
    if (this.utilHelper.AssertNotNull(this.personInfoList) && this.personInfoList.length > 0) {
      this.personInfoList.forEach(item => {
        item.isChecked = false;
      });
    }
    this.idCardNumberRegex = await this.configService.get('idnumberRegex');
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
  }

  /**
  * 根据证件类型生成不同正则
  *
  * @param {any} e
  * @memberof CrmsPersonApplyBasicInfoComponent
  */
  selectedCertificateType(e) {
    this.certificateNumberDom.instance.reset();
    if (this.utilHelper.AssertNotNull(this.certificateTypeList) && e.selectedItem !== null) {
      let certificateType = e.selectedItem.type;
      this.exChangeCertificateNum(certificateType);
    }
  }
  /**
  *
  * 根据证件类型 发生变化证件规则发生变化
  *
  */
  async exChangeCertificateNum(certificateType: string) {
    // 身份证
    if (this.utilHelper.AssertNotNull(certificateType) && certificateType === '0') {
      this.idNumberRegex = this.certificateRegexTemp;
      this.certificateNumberDisabled = false;
      this.certificateRequired = false;
      this.isSelectByCerNumber = true;
      this.isSelectByNameAndSex = false;
    } else if (this.utilHelper.AssertNotNull(certificateType) && certificateType === '3') {// 证件类型为无
      this.idNumberRegex = '';
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

  // 统计个人信息描述字符
  countPersonInfoDescriptionCharacter() {
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.description)) {
      this.crimePersonInfoDescriptionLength = this.crimePersonInfo.description.length;
    } else {
      this.crimePersonInfoDescriptionLength = 0;
    }
  }
  // 统计个人信息其他特征字符
  countPersonInfoOtherFeatureCharacter() {
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.otherFeature)) {
      this.crimePersonInfoOtherFeatureLength = this.crimePersonInfo.otherFeature.length;
    } else {
      this.crimePersonInfoOtherFeatureLength = 0;
    }
  }
  // 统计个人信息居住地详情字符
  countPersonInfoDetailAddressCharacter() {
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.detailAddress)) {
      this.crimePersonInfoDetailAddresstLength = this.crimePersonInfo.detailAddress.length;
    } else {
      this.crimePersonInfoDetailAddresstLength = 0;
    }
  }
  // 统计个人信息居住地详情字符
  countCredentialsIssuePlaceCharacter() {
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.credentialsIssuePlace)) {
      this.credentialsIssuePlaceLength = this.crimePersonInfo.credentialsIssuePlace.length;
    } else {
      this.credentialsIssuePlaceLength = 0;
    }
  }

  // 统计字符
  countCharacter() {
    this.countPersonInfoDescriptionCharacter();
    this.countPersonInfoOtherFeatureCharacter();
    this.countPersonInfoDetailAddressCharacter();
    this.countCredentialsIssuePlaceCharacter();
  }

  // 清除字符统计
  clearCharacterCount() {
    // 还原回填置灰输入框
    this.isHasCertificate = false;
    this.crimePersonInfoDescriptionLength = 0;
    this.crimePersonInfoOtherFeatureLength = 0;
    this.crimePersonInfoDetailAddresstLength = 0;
    this.credentialsIssuePlaceLength = 0;
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
  /**
   * 获取证件类型为无的ID
   * @memberof CrmsCrimePersonInfoComponent
   */
  getCertificateIdIsNotRequired() {
    if (this.utilHelper.AssertNotNull(this.certificateTypeList)) {
      this.certificateTypeList.forEach(element => {
        if (element.type === '3') {
          this.notRequiredCertificateType = element.certificateTypeId;
        }
      });
    }
  }

  /**
 * 根据证件类型+证件编号对申请信息进行人口回填
 */
  async getPersonInfoByNumber() {
    this.crimeNoticeQuery.certificateType = '';
    this.crimeNoticeQuery.certificateNumber = '';
    let obj: any = {
      certificateType: this.crimePersonInfo.certificateType,
      certificateNumber: this.crimePersonInfo.certificateNumber,
      firstName: this.crimePersonInfo.firstName,
      lastName: this.crimePersonInfo.lastName,
      sexId: this.crimePersonInfo.sexId
    };
    this.applicationExchange(obj);
    this.getCertificateIdIsNotRequired();
    let tips: string = this.getTranslateName('please entering') + ':';
    let flag: boolean = true;
    if (this.utilHelper.AssertEqualNull(this.crimePersonInfo.certificateType)) {
      flag = false;
      tips = tips + this.getTranslateName('certificateType') + ' ';

    } else {
      if (this.crimePersonInfo.certificateType !== this.notRequiredCertificateType
        && this.utilHelper.AssertEqualNull(this.crimePersonInfo.certificateNumber)) {
        flag = false;
        tips = tips + this.getTranslateName('certificateNumber') + ' ';
      }
    }
    if (flag) {
      this.crimeNoticeQuery.firstName = '';
      this.crimeNoticeQuery.lastName = '';
      this.crimeNoticeQuery.sexId = '';
      if (this.crimePersonInfo.certificateType !== this.notRequiredCertificateType) {
        this.crimeNoticeQuery.certificateType = this.crimePersonInfo.certificateType;
        this.crimeNoticeQuery.certificateNumber = this.crimePersonInfo.certificateNumber;
      }
      let objCrime: any = {
        crimeNoticeQuery: this.crimeNoticeQuery,
        crimeNoticePamter: this.crimeNoticePamter
      };
      this.getPersonInfoByName.emit(objCrime);
    } else {
      this.toastrConfirm(tips);
    }
  }
  applicationExchange(obj?: any) {
    this.crimeNoticePamter.certificateType = obj.certificateType ? obj.certificateType : '';
    this.crimeNoticePamter.certificateNumber = obj.crimeNoticePamter ? obj.certificateNumber : '';
    this.crimeNoticePamter.firstName = obj.firstName ? obj.firstName : '';
    this.crimeNoticePamter.lastName = obj.lastName ? obj.lastName : '';
    this.crimeNoticePamter.sexId = obj.sexId ? obj.sexId : '';
  }
  /**
   * 根据姓名姓别查询
   *
   */
  async   findPersonInfoByName() {

    this.getCertificateIdIsNotRequired();
    let tips: string = this.getTranslateName('please entering') + ':';

    let valiate: boolean = true;
    if (this.utilHelper.AssertEqualNull(this.crimePersonInfo.lastName)) {
      valiate = false;
      tips = tips + this.getTranslateName('lastName') + ' ';
    }
    if (this.utilHelper.AssertEqualNull(this.crimePersonInfo.firstName)) {
      valiate = false;
      tips = tips + this.getTranslateName('firstName') + ' ';
    }
    if (this.utilHelper.AssertEqualNull(this.crimePersonInfo.sexId)) {
      valiate = false;
      tips = tips + this.getTranslateName('sexName') + ' ';
    }
    // 匹配度模型
    let obj: any = {
      certificateType: this.crimePersonInfo.certificateType,
      certificateNumber: this.crimePersonInfo.certificateNumber,
      firstName: this.crimePersonInfo.firstName,
      lastName: this.crimePersonInfo.lastName,
      sexId: this.crimePersonInfo.sexId
    };
    this.applicationExchange(obj);
    if (valiate) {
      this.crimeNoticeQuery.firstName = this.crimePersonInfo.firstName;
      this.crimeNoticeQuery.lastName = this.crimePersonInfo.lastName;
      this.crimeNoticeQuery.sexId = this.crimePersonInfo.sexId;
      this.crimeNoticeQuery.certificateType = '';
      this.crimeNoticeQuery.certificateNumber = '';
      let objCrime: any = {
        crimeNoticeQuery: this.crimeNoticeQuery,
        crimeNoticePamter: this.crimeNoticePamter
      };
      this.getPersonInfoByName.emit(objCrime);

    } else {
      this.toastrConfirm(tips);
    }
  }

  /**
   * 第一次录入时，将正在合并中的设置不可勾选
   *
   * @memberof WaitmergeCriminalComponent
   */
  deselectRowsBecauseIsMerging(e) {
    // 如果这个罪犯正在被合并不能勾选
    if (this.utilHelper.AssertNotNull(e) && e.length > 0) {
      for (let j = 0; j < e.length; j++) {
        if (e[j].isMerging === '1') {
          e[j].isCheckedDisabled = true;
          e[j].redOrGreen = true;
        } else {
          e[j].isCheckedDisabled = false;
          e[j].redOrGreen = false;
        }
      }
    }
  }
  /**
   * 第二次重新录入公告时，将历史合并的罪犯设置为可回填
   *
   * @param {any} all
   * @param {any} exclude
   * @memberof CrmsCrimePersonInfoComponent
   */
  deselectRowsBecauseReplyEnter(all, exclude) {
    // 将历史勾选的公告，可勾选。其他正在合并的罪犯，设置为不可勾选
    if (this.utilHelper.AssertNotNull(all) && all.length > 0) {
      for (let j = 0; j < all.length; j++) {
        // 如果排除的集合不为空
        if (this.utilHelper.AssertNotNull(exclude) && exclude.length > 0) {
          // 正在被合并，不在排除的集合中，将此设置为不可选
          if (all[j].isMerging === '1' && exclude.indexOf(all[j].crimePersonId) === -1) {
            all[j].isCheckedDisabled = true;
            all[j].redOrGreen = true;
          } else {
            // 否则设置为可选
            all[j].isCheckedDisabled = false;
            all[j].redOrGreen = false;
          }
          // 如果排除的集合为空
        } else {
          if (all[j].isMerging === '1') {
            all[j].isCheckedDisabled = true;
            all[j].redOrGreen = true;
          } else {
            all[j].isCheckedDisabled = false;
            all[j].redOrGreen = false;
          }
        }
      }
    }
  }
  /**
   * checkbox勾选改变时触发
   * 此处要做判断该罪犯  是否已被合并或者正在被合并
   *
   * @param {any} e
   * @memberof CrmsCrimePersonInfoComponent
   */
  selectChangedHandle(e) {
    if (this.utilHelper.AssertNotNull(e) && e.row.data.isChecked && !e.row.data.isCheckedDisabled) {
      this.currentselectIndex = e.rowIndex;
      // }
      // if (this.utilHelper.AssertNotNull(this.personInfoList) && this.personInfoList.length > 0) {
      let checkedBoxs = 0;
      this.personInfoList.forEach(element => {
        if (element.isChecked === true) {
          checkedBoxs++;
        }
      });
      if (checkedBoxs === 1) {
        this.dataBackDisabled = false;
      } else {
        this.dataBackDisabled = true;
      }
    } else {
      this.dataBackDisabled = true;
    }
  }

  /**
    * 复选框单选中
    *
    */

  selectCrime(item) {
    if (this.utilHelper.AssertNotNull(this.personInfoList) && this.personInfoList.length > 0) {
      let checkedBoxs = 0;
      this.personInfoList.forEach(element => {
        // 清空之前选择的
        if (item.data.isChecked === true && element.crimePersonId !== item.data.crimePersonId) {
          element.isChecked = false;
          item.isCheckedflag = true;
        }
        if (element.isChecked === true) {
          checkedBoxs++;
        }
      });
      // 判断已选择的数据是否被选中
      if (item.data.isChecked === true) {
        this.currentselectIndex = item.rowIndex;
        this.checkMergeStatus(this.waitCriminalIds, item.data.crimePersonId, this.userInfo.orgPersonId, false);
      }

      if (checkedBoxs === 1) {
        this.dataBackDisabled = false;
      } else {
        this.dataBackDisabled = true;
      }
    } else {
      this.dataBackDisabled = true;
    }
  }

  /**
   * totar提示
   * @param message
   */
  toastrConfirm(message: string) {
    this.toastr.clear();
    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.toastrConfig.timeOut = 2000;
    this.toastr.error(message);
  }

  /**
   * 获取勾选的回填罪犯
   */
  getPeronIsChecked(): any[] {
    let selectBox = [];
    if (this.utilHelper.AssertNotNull(this.personInfoList) && this.personInfoList.length > 0) {
      this.personInfoList.forEach(element => {
        if (element.isChecked === true) {
          selectBox.push(element);
        }
      });
    }
    return selectBox;
  }
  /**
   * 数据回填
   * 若是从人口库回填的数据 此处不能加锁
   * 非人口库回填的数据 要进行加锁 回填成功后 把之前的回填的数据进行解锁
   *
   * @memberof CrmsCrimePersonInfoComponent
   */
  async dataBackFill() {
    // 数据回填,获取勾选的罪犯
    let checkPerson = this.getPeronIsChecked();
    this.crimePersonInfo = checkPerson[0];
    if (this.utilHelper.AssertNotNull(checkPerson[0]) && this.utilHelper.AssertNotNull(checkPerson[0].crimePersonId)) {
      await this.checkMergeStatus([], this.crimePersonInfo.crimePersonId, this.userInfo.orgPersonId, true);
      this.crimePersonInfo.backFillCriminalId = checkPerson[0].crimePersonId;
    }
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.dateOfBirth)) {
      this.crimePersonInfo.dateOfBirth = new Date(this.crimePersonInfo.dateOfBirth);
    }
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.credentialsIssueDate)) {
      this.crimePersonInfo.credentialsIssueDate = new Date(this.crimePersonInfo.credentialsIssueDate);
    }
    if (this.utilHelper.AssertEqualNull(this.crimePersonInfo.countryOfCitizenship)) {
      this.crimePersonInfo.countryOfCitizenship = this.countryOfCitizenshipEnum[0].name;
    }
    if (this.utilHelper.AssertEqualNull(this.crimePersonInfo.livingCountryName)) {
      this.crimePersonInfo.livingCountryName = this.countryOfCitizenshipEnum[0].name;
    }
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.certificateNumber)) {
      this.exChangeCertificateNum(this.crimePersonInfo.certificateNumber);
    }
    // 检测到加锁没有成功 说明回填失败
    if (this.dataBackDisabled) {
      return;
    }
    this.countCharacter();
    this.fillDataVisible = false;
    this.crimeNoticeQuery.pages = 0;
    this.sendPersonInfoOut.emit(this.crimePersonInfo);
  }

  /**
   * 清除当前页按钮提示
   */
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }

  // // 点击分页按钮，重新拉取数据
  // pageIndexChange(obj) {
  //     if (obj !== null && obj !== undefined) {
  //         this.crimeNoticeQuery.pages = obj.pages;
  //         this.getPersonInfoByNameAndNumber();
  //     }
  // }

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



  getAge() {
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo.dateOfBirth)) {
      this.crimePersonInfo.age = this.getFullAge(this.crimePersonInfo.dateOfBirth);
    } else {
      this.crimePersonInfo.age = null;
    }
  }
  /**
   * 数据检测
   * 1、判断当前数据是否已经被别人合并
   * 2、判断当前是否正在被合并
   * crimePersonId 犯罪人id
   * orgPersonId 当前用户
   * isLock 是否加锁
   * 重新回填 复杂逻辑
   * 上次当前公告回填和合并的数据这次都可以回填和待合并
   */
  async  checkMergeStatus(waitCriminalIds: string[], crimePersonId: string, orgPersonId: string, isLock: boolean) {
    let crimePersonInfo = await this.crimeAndNoticeService.getCrimePerson(crimePersonId);
    if (this.utilHelper.AssertNotNull(crimePersonInfo) && this.utilHelper.AssertNotNull(crimePersonInfo.crimePersonId)
      && crimePersonInfo.isMerging === '1') {
      return this.checkReplyBackData(waitCriminalIds, this.crimePersonInfo.backFillCriminalId);
    } else if (this.utilHelper.AssertNotNull(crimePersonInfo) && crimePersonInfo.isMerging === '0') {
      if (isLock) {
        this.onRedisLock(crimePersonId, orgPersonId);
      } else {
        this.isCanLock(crimePersonId, orgPersonId);
      }
    } else {
      this.invalidateData('this criminal has merged');
    }
  }
  /**
   * 数据回填重新分析时要判断当前数据是否是上次合并的数据
   */
  async  checkReplyBackData(waitMerges: string[], crimePersonId: string) {
    if (this.utilHelper.AssertNotNull(waitMerges) && waitMerges.length > 0) {
      await waitMerges.forEach(item => {
        if (item === crimePersonId) {
          return true;
        }
      });
      return false;
    } else {
      return true;
    }
  }
  /**
   * 数据加锁
   */
  async onRedisLock(crimePersonId: string, orgPersonId: string) {
    let result = await this.crimeAndNoticeService.onRedisLock(crimePersonId, orgPersonId);

    if (this.utilHelper.AssertNotNull(result) && result === false) {
      this.invalidateData('this criminal has merging from other notice');
    }
  }
  abc(params) {
    let result = params.validationGroup.validate();
    console.log(result);
  }
  /**
   * 判断当前数据能否加锁
   */
  async isCanLock(crimePersonId: string, orgPersonId: string) {
    let result = await this.crimeAndNoticeService.isCanLock(crimePersonId, orgPersonId);
    if (this.utilHelper.AssertNotNull(result) && result === false) {
      this.invalidateData('this criminal has merging from other notice');
    }
  }
  /**
  * 选择无效后数据处理
  * @param {string} message
  * @memberof WaitmergeCriminalComponent
  */
  invalidateData(message: string) {
    let currentIndex = this.utilHelper.AssertEqualNull(this.personInfoGrids.paging.pageIndex) ? 0 : this.personInfoGrids.paging.pageIndex;
    this.personInfoGrids.dataSource[currentIndex * 10 + this.currentselectIndex].isChecked = false;
    this.personInfoGrids.dataSource[currentIndex * 10 + this.currentselectIndex].isCheckedDisabled = true;
    this.personInfoGrids.dataSource[currentIndex * 10 + this.currentselectIndex].redOrGreen = true;
    this.toastr.clear();
    this.toastr.toastrConfig.maxOpened = 1;
    this.toastr.error(this.getTranslateName(message));
    this.dataBackDisabled = true;
  }


  /**
 * 去除证件号码前后空格
 */
  certificateNumberTrim() {
    if (this.crimePersonInfo.certificateNumber !== undefined && this.crimePersonInfo.certificateNumber != null) {
      this.crimePersonInfo.certificateNumber = this.crimePersonInfo.certificateNumber.trim();
    }
  }
}
