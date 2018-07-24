import { Component, OnInit, trigger, state, style, animate, transition, ViewChild } from '@angular/core';
import { LogQueryInfo } from '../../model/logs/LogQueryInfo';
import { OperationLog } from '../../model/logs/operationLog';
import { LogAuditService } from './log-audit.service';
import { PaginationComponent, CommonFromComponent } from '../../shared';
import { UtilHelper, EventAggregator } from '../../core';
import { EnumInfo } from '../../enum';
import { TranslateService } from 'ng2-translate';
import { DxDataGridComponent } from 'devextreme-angular';
/**
 * 日志审计查询组价
 */
@Component({
  templateUrl: './log-audit.component.html',
  providers: [LogAuditService, EnumInfo],
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
export class LogAuditComponent implements OnInit {

  /**
   * 日志查询参数对象
   */
  logQueryInfo: LogQueryInfo;
  /**
   * 日志信息
   */
  logInfoList: OperationLog[] = [];

  totalCount: number; // 返回数据总条数
  logActionInfo: any[]; // 日志操作动作

  /**
   * 点击查询时的loading
   */
  loadingVisible: boolean = false;

  logAuditEnum: any;

  beginTime: Date;
  endTime: Date;
  forAdmin: boolean = false;
  formObjEmit: any;
  formAnimate: string = 'show';
  formNum: number = 1;
  expendIndex: number;
  @ViewChild(PaginationComponent) pagination: PaginationComponent;
  @ViewChild(CommonFromComponent) form: CommonFromComponent;
  @ViewChild('datagrid') datagrid: DxDataGridComponent;
  confirmVisible: boolean = false;
  constructor(
    private logAuditService: LogAuditService,
    private utilHelper: UtilHelper,
    private enumInfo: EnumInfo,
    private eventAggregator: EventAggregator,
    private translateService: TranslateService,
  ) {

    this.logActionInfo = this.enumInfo.getActionEnum;
    this.logAuditEnum = this.enumInfo.getLogAuditEnum;

    // 日志查询参数初始化
    this.logQueryInfo = {
      action: '',
      endOperationDate: '',
      module: '',
      operator: '',
      pages: 1,
      size: 10,
      startOperateDate: '',
      system: 'crms'
    };
    this.formObjEmit = {
      textDatas: [
        // {
        //     title: 'module',
        //     value: '',
        //     class: '',
        //     labelName: 'module',
        // },
        {
          title: 'operator',
          value: '',
          class: '',
          labelName: 'operator',
        }
      ],
      selectDatas: [
        {
          data: this.logAuditEnum,
          class: '',
          value: '',
          title: 'systemModule',
          labelName: 'module',

        },
        {
          data: this.enumInfo.getActionEnum,
          class: '',
          value: '',
          title: 'businessAction',
          labelName: 'action',

        },
      ],
      dateDatas: [
        {
          title: 'enteringBeginTime',
          value: '',
          maxTime: new Date(),
          labelName: 'startOperateDate',
        }
        , {
          title: 'enteringEndTime',
          value: '',
          minTime: new Date(),
          labelName: 'endOperationDate',
          end: true
        }
      ]
    };


  }

  ngOnInit() {
    this.loadingVisible = true;
    this.getLogInfo();
    // 缓存路由
    sessionStorage.setItem('currentRouter', 'log-auditor');

    this.bindRoutUrl('LogAuditManagement', 'LogAudit');
  }

  // 导航路径绑定
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }



  /**
   * 初始化日志信息
   */
  getLogInfo() {
    this.logAuditService.getLogInfos(this.logQueryInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result) && this.utilHelper.AssertNotNull(result.total)) {
          // this.formNum = 0;
          this.totalCount = result.total;
          this.logInfoList = result.operationLogsList;
          this.logInfoList.forEach(item => {
            item.action = this.getTranslateName(item.action);
            item.actionDesc = this.getTranslateName(item.actionDesc);
            item.business = this.getTranslateName(item.business);
            item.level = this.getTranslateName(item.level);
            item.module = this.getTranslateName(item.module);
            item.system = this.getTranslateName(item.system);
            if (item.newContent) {
              item.newContent = JSON.stringify(item.newContent);
            }
            if (item.oldContent) {
              item.oldContent = JSON.stringify(item.oldContent);
            }
          });
        }
        this.datagrid.instance.collapseAll(-1);
        this.loadingVisible = false;
      }).catch(e => {
        this.loadingVisible = false;
        console.log(e);
      });
  }

  /**
   * 选择查询出来的数据点击展开
   */
  expendIndexOfRowData(e) {
    if (e.component.isRowExpanded(e.data)) {
      e.component.collapseRow(e.data);
    } else {
      e.component.collapseAll(-1);
      e.component.expandRow(e.data);
    }
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

  /**确定显示搜索表单
   */
  srueHiddenForm() {
    this.form.form.reset();
    this.formAnimate = 'show';
    this.formNum = 1;
    this.logQueryInfo = {
      action: '',
      endOperationDate: '',
      module: '',
      operator: '',
      pages: 1,
      size: 10,
      startOperateDate: '',
      system: 'crms'
    };
    this.getLogInfo();
    this.confirmVisible = false;
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
      this.logQueryInfo = data;
      this.logQueryInfo.system = 'crms';
      this.logQueryInfo.pages = 1;
      this.pagination.numPage = 0;
      this.logQueryInfo.size = 10;
      this.getLogInfo();
    }
  };

  /**
   * 获取分页对象改变的事件
   */
  getPageObjChange(event: any) {
    this.logQueryInfo.pages = event.pages + 1;
    this.getLogInfo();
  }

  /**
   * 刷新
   */
  refreshList() {
    this.logQueryInfo.pages = 1;
    this.getLogInfo();
    this.datagrid.instance.refresh();
    this.pagination.numPage = 0;
  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }

}
