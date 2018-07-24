import { Component, OnInit, trigger, state, style, animate, transition, ViewChild } from '@angular/core';
import { CrimeInfoInquireService } from './crimeInfo-inquire.service';
import { UtilHelper, DateFormatHelper, LocalStorageService, EventAggregator } from '../../../core';
import { CrimePersonQuery } from '../../../model/crime-integrated-business/CrimePersonQuery';
import { UserInfo } from '../../../model/auth/userinfo';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridComponent } from 'devextreme-angular';
import { TranslateService } from 'ng2-translate';
import * as moment from 'moment';
import { asEnumerable } from 'linq-es2015';
import { CrimePersonInfo } from '../../../model/crime-notice/crimepersoninfo';
import { PaginationComponent, CommonFromComponent } from '../../../shared';
/**
 * Created By yuxiong 2017/10-30
 * 犯罪信息查询组件
 */
@Component({
  templateUrl: './crimeInfo-inquire.component.html',
  providers: [CrimeInfoInquireService, DateFormatHelper],
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
export class CrimeInfoSearchComponent implements OnInit {
  /**
   * 列表数据
   */
  crimeInfoList: any = [];
  /**
   * 搜索查询
   *
   */
  advanceQuery: CrimePersonQuery;
  /**
   * 分页总数据
   */
  totalCount: number;
  /**
   * 是否显示复选框
   */
  forAdmin: boolean = false;
  /**
   * 响应式标题
   */
  translates = [];
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;
  routerId: string;
  selectArr: Array<CrimePersonInfo> = [];
  selectFlag: boolean = false;
  @ViewChild('grid1') grid1: DxDataGridComponent;
  @ViewChild(PaginationComponent) pagination: PaginationComponent;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  confirmVisible: boolean = false;
  constructor(
    private utilHelper: UtilHelper,
    private crimeInfoInquireService: CrimeInfoInquireService,
    private localStorageService: LocalStorageService,
    private route: ActivatedRoute,
    private router: Router,
    private dateFormatHelper: DateFormatHelper,
    private eventAggregator: EventAggregator,
    private translateService: TranslateService
  ) {
    this.advanceQuery = new CrimePersonQuery();
    this.advanceQuery.pages = 0;
    this.advanceQuery.pageSize = 10;
    this.formObjEmit = this.crimeInfoInquireService.searchFormObj();
  }

  /**
   * 获取犯罪列表数据
   */
  async getCrimeInfoList() {
    try {
      this.routerId = null;
      let result = await this.crimeInfoInquireService.findAllCrimeInfoByPersonalInfo(this.advanceQuery);
      if (this.utilHelper.AssertNotNull(result)) {
        this.crimeInfoList = result.data;
        this.totalCount = result.totalCount;
        if (this.crimeInfoList.length > 0) {
          this.crimeInfoList.forEach(item => {
            item.isChecked = false;
          });
        };
        this.crimeInfoList.forEach(item => {
          if (!this.utilHelper.AssertNotNull(item.firstName)) {
            item.firstName = '';
          }
          if (!this.utilHelper.AssertNotNull(item.lastName)) {
            item.lastName = '';
          }
          if (!this.utilHelper.AssertNotNull(item.fatherFirstName)) {
            item.fatherFirstName = '';
          }
          if (!this.utilHelper.AssertNotNull(item.fatherLastName)) {
            item.fatherLastName = '';
          }
          if (!this.utilHelper.AssertNotNull(item.motherFirstName)) {
            item.motherFirstName = '';
          }
          if (!this.utilHelper.AssertNotNull(item.motherLastName)) {
            item.motherLastName = '';
          }
          if (item.age === 0 && this.utilHelper.AssertEqualNull(item.dateOfBirth)) {
            item.age = null;
          }
          item.name = item.firstName + ' ' + item.lastName;
          item.fatherName = item.fatherFirstName + ' ' + item.fatherLastName;
          item.motherName = item.motherFirstName + ' ' + item.motherLastName;
        });
      } else {
        this.crimeInfoList = [];
      }
      this.grid1.instance.collapseAll(-1);
    } catch (error) {
      this.crimeInfoList = [];
      console.log(error);
    }
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
* 点击显示搜索
*
*/
  async showForm(num) {
    if (num === 1) {
      this.formAnimate = 'hidden';
      this.formNum = 0;
    } else {
      this.confirmVisible = true;
    }
  }

  /**确定隐藏搜索表单
   */
  srueHiddenForm() {
    this.refreshRouter();
  }
  /**
   * 关闭弹窗
   */
  cancelPounp() {
    this.confirmVisible = false;
  }
  /**
   * 点击查询提交按钮
   */
  getFormObjChange(data) {
    if (this.utilHelper.AssertNotNull(data)) {
      // this.formAnimate = 'hidden';
      this.formNum = 1;
      this.advanceQuery = data;
      this.advanceQuery.pages = 0;
      this.pagination.numPage = 0;
      this.advanceQuery.pageSize = 10;
      if (this.utilHelper.AssertNotNull(this.advanceQuery.dateOfBirth)) {
        this.advanceQuery.dateOfBirth = this.dateFormatHelper.HoursMinutesDateTimeFormat(this.advanceQuery.dateOfBirth);
      }
      this.getCrimeInfoList();
      this.grid1.selectedRowKeys = [];
      this.selectArr = [];
      this.grid1.instance.refresh();
    }
  };

  /**
   * 单行选中事件
   */
  selectedRow(e) {
    if (e.rowType === 'header') { // 判断是否是全选的操作
      if (e.cellElement[0].innerHTML.indexOf('dx-checkbox-checked') > -1) {  // 全选操作
        this.crimeInfoList.forEach((item, index) => {
          this.selectArr.push(item);
        });
      } else {  // 取消全选操作
        this.crimeInfoList.forEach(item => {
          this.selectArr.forEach((selectItem, index) => {
            if (item.crimePersonId === selectItem.crimePersonId) {
              this.selectArr.splice(index, 1);
            }
          });
        });
      }

    } else { // 单选操作
      if (e.component.isRowSelected(e.data)) {
        this.selectArr.push(e.data);
      } else {
        this.selectArr = asEnumerable(this.selectArr).Where(item => item.crimePersonId !== e.data.crimePersonId).ToArray();
      }
    }
    if (this.forAdmin) { //  判断是什么角色
      if (this.utilHelper.AssertNotNull(this.grid1.selectedRowKeys) && this.grid1.selectedRowKeys.length > 0) {
        this.routerId = this.grid1.selectedRowKeys[0].crimePersonId;
        if (this.grid1.selectedRowKeys.length !== 1) {
          this.selectFlag = true;
        } else {
          this.selectFlag = false;
        }
      } else {
        this.selectFlag = true;
      }
    } else {
      this.routerId = e.data.crimePersonId;
    }
    this.selectArr = this.arrDistinct(this.selectArr);
  }


  contentReady(e) {
    if (this.selectArr.length > 0) {
      this.selectArr = this.arrDistinct(this.selectArr);
    }
    let selectIndexArr = [];
    if (this.selectArr.length > 0 && this.crimeInfoList.length > 0) {
      this.selectArr.forEach(selectItem => {
        this.crimeInfoList.forEach((item, index) => {
          if (item.crimePersonId === selectItem.crimePersonId) {
            selectIndexArr.push(index);
          }
        });
      });
    }
    // 去重操作
    if (selectIndexArr.length > 0) {
      selectIndexArr = asEnumerable(selectIndexArr).Distinct().ToArray();
    } else {
      selectIndexArr = [];
    }
    e.component.selectRowsByIndexes(selectIndexArr);
  }

  /**
   * 点击查看
   */
  seeView() {
    this.router.navigate(['../crimeinfo-detail', this.routerId], { relativeTo: this.route });
  }

  /**
   * 分页传输的数据
   */
  pageIndexChange(obj) {
    this.advanceQuery = obj;
    this.routerId = null;
    this.getCrimeInfoList();
  }

  /**
   * 刷新
   */
  refresh() {
    this.advanceQuery = new CrimePersonQuery();
    this.advanceQuery.pages = 0;
    this.advanceQuery.pageSize = 10;
    this.routerId = null;
    this.getCrimeInfoList();
    this.grid1.selectedRowKeys = [];
    this.selectArr = [];
    this.grid1.instance.refresh();
  }

  /**
    * 渲染面包屑导航
    */
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }



  /**
   * 初始化词条
   */
  initTranslate(): Promise<any> {
    return new Promise((r, j) => {
      let translateKeys = ['lastName', 'firstName', 'sexName', 'age', 'dateOfBirth', 'career',
        'certificateNumber', 'certificateType', 'certificateValidity', 'countryName', 'provinceName', 'cityName', 'communityName',
        'detailAddress', 'contractPhone', 'credentialsIssueDate', 'credentialsIssuePlace', 'crimePersonDescription',
        'eyeColor', 'hairColor', 'height', 'nation', 'skinColor', 'noseType', 'livingCountryName',
        'livingProvinceName', 'livingCityName', 'livingCommunityName', 'fatherFirstName', 'fatherLastName',
        'fatherNameSoundex', 'motherFirstName', 'motherLastName', 'motherNameSoundex', 'otherFeature', 'profession'];
      this.translateService.get(translateKeys).toPromise().then(values => {
        translateKeys.forEach((key) => {
          this.translates[key] = values[key];
        });
        r(this.translates);
      });
    });
  }

  /**
   * 选择查询出来的数据点击展开
   */
  expendIndexOfRowData(e) {
    e.component.selectRows(e.data);
    if (e.component.isRowExpanded(e.data)) {
      e.component.collapseRow(e.data);
      this.routerId = null;
    } else {
      e.component.collapseAll(-1);
      e.component.expandRow(e.data);
    }
  }

  /**
   * 获取对象的属性值,并转化为数组
   */
  getObjectValue(object) {
    let valueArr = [];
    if (this.utilHelper.AssertNotNull(object)) {
      Object.keys(object).forEach(item => {
        valueArr.push(object[item]);
      });
    }
    return valueArr;
  }

  /**
   * 数组去重的方法
   */
  arrDistinct(Arr) {
    let newArr = [];
    if (this.utilHelper.AssertNotNull(Arr) && Arr.length > 0) {
      for (let i = 0; i < Arr.length; i++) {
        let flag = true;
        for (let j = 0; j < newArr.length; j++) {
          if (Arr[i].crimePersonId === newArr[j].crimePersonId) {
            flag = false;
          }
        }
        if (flag) {
          newArr.push(Arr[i]);
        }
      }
    } else {
      newArr = [];
    }
    return newArr;
  }

  /**
   * 导出
   */
  export() {
    // 映射对应的属性
    if (this.utilHelper.AssertNotNull(this.crimeInfoList) && this.crimeInfoList.length > 0) {
      console.log(this.crimeInfoList);
      this.crimeInfoList.forEach(item => {
        if (this.utilHelper.AssertNotNull(item.dateOfBirth)) {
          item.dateOfBirth = moment(item.dateOfBirth).format('YYYY-MM-DD');
        } else {
          item.dateOfBirth = null;
        }
        if (item.height === 0) {
          item.height = null;
        }
        item.certificateType = item.certificateName;
        item.crimePersonDescription = item.description;
      });
    }
    // 引入导出的类
    const ExportJsonExcel = require('js-export-excel');
    let option = {
      fileName: '',
      datas: [],
    };
    option.fileName = 'excel';
    option.datas = [{
      sheetData: [], // 导出的数据
      sheetFilter: Object.keys(this.translates), // 需要显示的属性
      sheetHeader: this.getObjectValue(this.translates) // excel头部
    }];
    if (this.utilHelper.AssertNotNull(this.selectArr) && this.selectArr.length > 0) {
      let exportArr = this.arrDistinct(this.selectArr);
      option.datas[0].sheetData = exportArr;
    };
    let toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
    this.grid1.instance.refresh();
  }



  ngOnInit(): void {
    this.initTranslate().then(result => {
      let user = this.localStorageService.readObject('currentUser') as UserInfo;
      if (this.utilHelper.AssertNotNull(user)) {
        if (user.roleType === 'MONITOR') {
          this.forAdmin = true;
        }
      }
      this.getCrimeInfoList();
    });
    this.bindRoutUrl('crimeBasicinfo manage', 'crimeBasicinfo inquire');
  }
}

