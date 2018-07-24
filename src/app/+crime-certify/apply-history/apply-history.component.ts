import { Component, OnInit, trigger, state, style, animate, transition, ViewChild } from '@angular/core';
import { ApplyHistoryService } from './apply-history.service';
import { PaginationComponent, CommonFromComponent } from '../../shared';
import { EnumInfo } from '../../enum';
// import { ApplyInfo } from '../../../model/certificate-apply/ApplyInfo';
import { UserInfo } from '../../model/auth/userinfo';
import { LocalStorageService, EventAggregator, UtilHelper, DateFormatHelper } from '../../core';
import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
import { ApplyInfoParam } from '../../model/application-credentials-management/applyInfoParam';
/**
 * 申请历史记录
 */
@Component({
  templateUrl: './apply-history.component.html',
  providers: [ApplyHistoryService, EnumInfo, PaginationComponent, DateFormatHelper],
  animations: [
    trigger('formAnimation', [
      state('show', style({
        right: 0,
        opacity: 1,
        display: 'block'
      })),
      state('hidden', style({
        right: -500,
        opacity: 0,
        display: 'none'
      })),
      transition('hidden=>show', animate('500ms linear')),
      transition('show=>hidden', animate('500ms linear'))
    ])

  ]
})
export class ApplyHistoryComponent implements OnInit {
  /**
   * 右侧弹窗的显示和隐藏
   *
   */
  popupImageVisible: boolean;
  /**
   *表单循环的对象
   *
   */
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;
  /**
   * 当前操作员ID
   *
   */
  analystId: string;
  // ApplyInfoData: ApplyInfo[]; // 列表数据
  ApplyInfoData: any;
  /**
   * 分页对象
   *
   */
  pageObj: ApplyInfoParam;
  /**
   * 路由ID
   *
   */
  applyObj: any;
  totalCount: number;
  historyRecordList: any[];
  isAllow: boolean = true;
  confirmVisible: boolean = false;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  constructor(private applyHistoryService: ApplyHistoryService,
    private localStorageService: LocalStorageService, private router: Router, private dateFormatHelper: DateFormatHelper,
    private eventAggregator: EventAggregator,
    private utilHelper: UtilHelper) {
    this.pageObj = new ApplyInfoParam();
    this.pageObj.pages = 0;
    this.pageObj.pageSize = 10;
  }

  /**
   * 点击显示搜索
   *
   */
  async showForm(num) {
    try {
      if (this.utilHelper.AssertNotNull(this.formObjEmit)) {
        if (num === 1) {
          this.formAnimate = 'hidden';
          this.formNum = 0;
        } else {
          this.confirmVisible = true;
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 查询所有的数据
   *
   */
  bindReanalyseInfoList() {
    this.applyHistoryService.getHandleHistory(this.pageObj)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result) && result.success) {
          // this.formNum = 0;
          this.ApplyInfoData = result.data;
          if (this.utilHelper.AssertNotNull(this.ApplyInfoData) && this.ApplyInfoData.length > 0) {
            this.ApplyInfoData.forEach(item => {
              if (!this.utilHelper.AssertNotNull(item.applyBasicInfo.firstName)) {
                item.applyBasicInfo.firstName = '';
              }
              if (!this.utilHelper.AssertNotNull(item.applyBasicInfo.lastName)) {
                item.applyBasicInfo.lastName = '';
              }
              item.name = item.applyBasicInfo.firstName + ' ' + item.applyBasicInfo.lastName;
            });
          }
          this.totalCount = result.totalCount;
        } else {
          this.ApplyInfoData = [];
          this.totalCount = 0;
        }
      }).catch(err => {
        console.log(err);
      });
  }



  /**确定隐藏搜索表单
 */
  srueHiddenForm() {
    this.form.form.reset();
    this.formAnimate = 'show';
    this.formNum = 1;
    this.pageObj = new ApplyInfoParam();
    this.pageObj.pages = 0;
    this.pageObj.pageSize = 10;
    this.bindReanalyseInfoList();
    this.confirmVisible = false;
    this.applyObj = null;
  }
  /**
   * 关闭弹窗
   */
  cancelPounp() {
    this.confirmVisible = false;
  }
  /**
   * 点击提交表单
   *
   */
  getFormObjChange(data) {
    this.applyObj = null;
    if (this.utilHelper.AssertNotNull(data)) {
      // this.formAnimate = 'hidden';
      this.formNum = 1;
      data.startApplyTime = this.formatBeginDate(data.startApplyTime);
      data.endApplyTime = this.formatEndDate(data.endApplyTime);
      this.pageObj.certificateNum = data.certificateNum;
      this.pageObj.firstName = data.firstName;
      this.pageObj.lastName = data.lastName;
      this.pageObj.deliveryReceiptNumbr = data.deliveryReceiptNumbr;
      this.pageObj.applyStatus = data.applyStatus;
      this.pageObj.applyStartTime = data.startApplyTime;
      this.pageObj.applyEndTime = data.endApplyTime;
      this.pageObj.applyPurpose = data.applyPurpose;
      this.pageObj.applyType = data.applyType;
      this.pageObj.sortOrder = null;
      this.pageObj.pages = 0;
      this.bindReanalyseInfoList();
    }
  }

  // 时间转化
  formatBeginDate(value) {
    if (this.utilHelper.AssertNotNull(value)) {
      value = this.dateFormatHelper.RestURLBeignDateTimeFormat(value);
    }
    return value;
  }

  formatEndDate(value) {
    if (this.utilHelper.AssertNotNull(value)) {
      value = this.dateFormatHelper.RestURLEndDateTimeFormat(value);
    }
    return value;
  }

  /**
   * 点击的时候就已选中，可获得当前行的数据
   *
   */
  selectRecordHandle(e) {
    if (this.utilHelper.AssertNotNull(e.selectedRowKeys[0])) {
      this.applyObj = e.selectedRowKeys[0].applyInfo;
    }
  }
  /**
   * 点击查看
   */
  seeApplyInformation(): void {
    let applyIdAndFlag = {
      applyId: this.applyObj.applyId,
      flag: 'apply-history',
      historyFlag: '1'
    };

    if (this.applyObj.applyTypeId === '1') {
      this.router.navigate(['/crms-system/crime-certify/personApply-detail', applyIdAndFlag]);
    } else if (this.applyObj.applyTypeId === '2') {
      this.router.navigate(['/crms-system/crime-certify/apply-govermentDetail', applyIdAndFlag]);
    }
  }

  /**
   * 分页传输的数据
   *
   */
  getpageObjChange(obj) {
    this.pageObj = obj;
    this.bindReanalyseInfoList();
  }


  /**
* 刷新路由
*/
  async refreshRouter() {
    let nowUrl = this.router.url;
    await this.router.navigateByUrl('');
    this.router.navigate([nowUrl]);
  }
  /**
   * 点击刷新
   */

  refreshList() {
    this.refreshRouter();
  }

  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

  /**
   * 查看历史记录
   */
  watchHistoryRecord() {
    this.applyHistoryService.getHandleHistoryById(this.applyObj.applyId)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.historyRecordList = result;
        }
      }).catch(e => {
        console.log(e);
      });
  }



  async  ngOnInit() {
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    this.analystId = user.orgPersonId;
    this.bindReanalyseInfoList();
    this.bindRoutUrl('CrimeCertifyManagement', 'ApplyHistoryRecordInquire');

    /**
      * 获取搜索表单的配置对象
      */
    this.formObjEmit = await this.applyHistoryService.searchFormObj();
    sessionStorage.setItem('currentRouter', 'apply-history');
  }

}
