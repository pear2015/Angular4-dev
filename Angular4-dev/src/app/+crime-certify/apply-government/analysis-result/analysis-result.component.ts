import { Component, OnChanges, Input, OnInit, Output, EventEmitter, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { UtilHelper, DateFormatHelper } from '../../../core';
import { EnumInfo } from '../../../enum';
import { ApplyAndCriminalRelation } from '../../../model/certificate-apply/ApplyAndCriminalRelation';
import { DxDataGridComponent } from 'devextreme-angular';
import { ApplyCommonService } from '../../../+crms-common/services/apply-common.service';
import { asEnumerable } from 'linq-es2015';
import { CrimePersonInfo } from '../../../model/crime-notice/crimePersonInfo';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CheckedCrimialPersonService } from './analysis-result.service';
import { PaginationComponent } from '../../../shared';
@Component({
  selector: 'analysis-result',
  templateUrl: './analysis-result.component.html',
  providers: [EnumInfo, ApplyAndCriminalRelation, CheckedCrimialPersonService]
})
export class ApplyGovermentAnalysisResultComponent implements OnInit, OnChanges {
  @Input() applyBasicInfo;
  @Input() applyInfo;
  @Input() isAnalysised;
  @Input() crimeNoticeQuery;
  @Input() criminalInfo: Array<CrimePersonInfo>;
  @Input() dataCount;
  @Input() rejectReason;
  @Input() applyRejectReasonLength;
  @Input() isRejected;
  @Input() isEdit;
  @Input() crimePersonInfo; // 选择的犯罪嫌疑人
  /**
   * 是否可以操作复选框
   */
  @Input() isCheckedDisabled;
  @Input() applyAndCriminalRelation;
  @Output() crimeNoticeEmit = new EventEmitter();
  @Input() hasSelectCrimePersonId; // 选择的犯罪嫌疑人 用来父子组件传递用
  @ViewChild('crimeGrid')
  crimeGrid: DxDataGridComponent;
  @ViewChildren(PaginationComponent) pagination: QueryList<PaginationComponent>;
  /**
   * 犯罪公告分页对象
   */
  isOther: boolean;
  isCrimed: boolean;
  popupNoticeVisible: boolean;
  /**
   * 数据选中的提示框
   * 选中后数据提示信息
   * 当前临时选中的数据
   */
  confirmVisible: boolean = false;
  message: string;
  currentselectItem: any;
  /**
   * 犯罪公告列表
   */
  noticeList: any = [];
  /**
 * 分析结果
 */
  analysisResultEnum: any[];
  /**
   *犯罪人Id
   */
  crimePersonId: string;
  /**
   *是否清除选中
   */
  isHasSelectCrime: boolean = false;
  dataCompareVisible: boolean = false;
  criminalInfoObj: any = {};
  // 清空按钮提示信息
  clearPageTolVisible: boolean = false;
  selectCriminalData: string; // 获取选中的数据列表
  selectDataVisible: boolean = false;
  checkedCrimialPerson: any;
  isHasCleandisabled: boolean = false; // 是否清除失效的选中
  constructor(
    private utilHelper: UtilHelper,
    private enumInfo: EnumInfo,
    private applyCommonService: ApplyCommonService,
    private criminalObj: ApplyAndCriminalRelation,
    private dateFormatHelper: DateFormatHelper,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private checkedCrimialPersonService: CheckedCrimialPersonService
  ) {
    this.criminalObj = new ApplyAndCriminalRelation();
    // 分析结果
    this.analysisResultEnum = this.enumInfo.getAnalysisResult;
  }
  ngOnInit() {

    this.toastr.toastrConfig.timeOut = 3000;
    // 初始化消息配置
    this.toastr.toastrConfig.positionClass = 'toast-center-center';
  }

  /**
   * 点击查看勾选罪犯信息
    */
  async showSelectData() {
    if (this.utilHelper.AssertNotNull(this.selectCriminalData)) {
      try {
        this.checkedCrimialPerson = await this.checkedCrimialPersonService.getCrimePerson(this.selectCriminalData);
        this.selectDataVisible = true;
      } catch (err) {
        console.log(err);
      }
    }
  }
  /**
   * 首次分析时将选中数据清空
   * 默认第一页选中
   */
  cleanHasSelectedCriminal() {
    this.hasSelectCrimePersonId = '';
    this.selectCriminalData = '';
  }
  /**
   *  默认选中第一页
   */
  defaultFirstCriminal() {
    this.pagination.first.numPage = 0;
  }

  /**
* 点击分页按钮，重新拉取数据
*
*/
  changeCriminalInfo(obj) {
    this.crimeNoticeQuery.pages = obj.pages;
    this.crimeNoticeEmit.emit(this.crimeNoticeQuery.pages);
  };


  /**
  * select分析结果选中内容事件
  *
  */
  public selectIndenxOfAnalysisResult(e) {
    if (e.value != null && e.value !== undefined) {
      this.isOther = false;
      if (e.value === '1') {
        this.isCrimed = true;
      };
      if (e.value === '2') {
        this.isCrimed = false;
      };
    }
  }

  /**
   * 点击犯罪嫌疑人列表时 查看公告详情
   */
  public lookNoticeList(e) {
    this.popupNoticeVisible = true;
    if (this.utilHelper.AssertNotNull(e)) {
      this.crimePersonId = e.crimePersonId;
    }
  }
  /**
   *
   * 复选框选中
   *
   */
  selectCrime(item) {
    if (item.data.isChecked === true && item.data.isActive === '1') {
      if (!this.isCheckedDisabled) {
        // 非审核 重新分析时 初始化之前选中的 此处不作提示
        if (!item.data.isCheckedflag) {
          this.confirmVisible = true;
          this.message = 'confirm selected this criminal';
          this.currentselectItem = item;
        }
      }
    } else if (this.utilHelper.AssertNotNull(item) && !item.data.isChecked &&
      this.selectCriminalData === item.data.crimePersonId) {
      this.selectCriminalData = '';
    } else {
      item.data.isCheckedflag = false;
    }
  }

  // 使用translateService对component字段进行国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

  selectdefaultCrimer() {
  }
  /**
   * 确认选中数据
   * isCheckedflag 选中标记 上次选中 页面加载时 不弹出是否确认选中的弹出框
   *
   */
  configSelected() {
    this.isHasCleandisabled = true;
    this.criminalInfo.forEach(ele => {
      if (ele.crimePersonId === this.currentselectItem.data.crimePersonId) {
        this.selectCriminalData = ele.crimePersonId;
        ele.isChecked = true;
      } else {
        ele.isChecked = false;
        ele.isCheckedflag = false;
      }
    });
    this.confirmVisible = false;
  }
  /**
   *
   * 清除选中
   */
  cancelSelected() {
    this.criminalInfo.forEach(ele => {
      if (ele.crimePersonId === this.currentselectItem.data.crimePersonId) {
        ele.isChecked = false;
        ele.isCheckedflag = false;
      }
    });
    this.confirmVisible = false;
  }
  /**
   *
   * 获取选中的数据
   * 修改时间 2018-2-8
   * 这个要重新修改
   *
   * @memberof ApplyGovermentAnalysisResultComponent
   */
  getCheckBoxSelectedData() {
    return this.selectCriminalData;
  }
  /**
   * 重新分析 犯罪人和可疑罪犯比对
   */
  dataCompare(item) {
    this.criminalInfoObj = item;
    this.dataCompareVisible = true;
  }
  /**
   * 把关联罪犯ID赋给 criminalObj(犯罪信息对象)
   */
  ngOnChanges() {
    let currentPage = this.crimeNoticeQuery.pages;
    this.crimeNoticeQuery.pageSize = 5;
    // 将失效的犯罪嫌疑人添加到列表中 设置为不可选
    if (this.utilHelper.AssertNotNull(this.crimePersonInfo) && this.utilHelper.AssertNotNull(this.crimePersonInfo.crimePersonId)) {
      if (this.utilHelper.AssertEqualNull(this.criminalInfo)) {
        this.criminalInfo = [];
      }
      // 只有第一页才把失效的罪犯加进去 若当前未选择有效的罪犯
      if (this.crimePersonInfo.isActive === '0' && currentPage === 0) {
        this.crimePersonInfo.isChecked = this.utilHelper.AssertEqualNull(this.hasSelectCrimePersonId);
        this.crimePersonInfo.redOrGreen = this.crimePersonInfo.isActive === '0';
        this.crimePersonInfo.isCheckedDisabled = this.crimePersonInfo.isActive === '0';
        this.criminalInfo.push(this.crimePersonInfo);
        this.crimePersonInfo.isCheckedflag = this.crimePersonInfo.isChecked;
      }
    }
    // 更新当前页的已选罪犯列表
    if (this.utilHelper.AssertNotNull(this.hasSelectCrimePersonId)) {
      this.selectCriminalData = this.hasSelectCrimePersonId;
    }
    // 遍历可疑罪犯列表 将分析中勾选的可疑罪犯选中
    if (this.utilHelper.AssertNotNull(this.criminalInfo) && this.criminalInfo.length > 0) {
      // 若之前勾选的犯罪人已经失效 将当前的犯罪人改为失效
      this.criminalInfo.forEach(item => {
        item.isChecked = item.isChecked === true ? true : false;
        item.isCheckedDisabled = item.isCheckedDisabled === true ? true : false;
        item.name = item.firstName + ' ' + item.lastName;
        item.redOrGreen = item.redOrGreen === true ? true : false;
        if (this.utilHelper.AssertNotNull(item.noticeCreateTime)) {
          item.noticeCreateTime = this.dateFormatHelper.YearMonthDayTimeFormat(item.noticeCreateTime);
        }
        if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
          item.age = null;
        }
        if (this.applyBasicInfo.age === 0 && this.utilHelper.AssertEqualNull(this.applyBasicInfo.dateOfBirth)) {
          this.applyBasicInfo.age = null;
        }
        item.point = this.applyCommonService.comparsionInformation(item, this.applyBasicInfo);
        if (this.utilHelper.AssertNotNull(this.hasSelectCrimePersonId)
          && item.crimePersonId === this.hasSelectCrimePersonId) {
          item.isChecked = true;
        }
        item.isCheckedflag = item.isChecked;
      });
      this.criminalInfo = asEnumerable(this.criminalInfo).OrderByDescending(item =>
        Number(item.point.substring(0, item.point.length - 1))).ThenByDescending(item => item.enteringTime).ToArray();
    } else {
      this.criminalInfo = [];
    }
  }
  /**
  * 清除当前页按钮提示
  */
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }
}
