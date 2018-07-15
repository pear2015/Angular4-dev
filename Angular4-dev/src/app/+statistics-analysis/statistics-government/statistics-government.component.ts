import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import * as echarts from 'echarts';
import { EnumInfo } from '../../enum';
import { StatisticsAnalysisService } from '../common/statistics-analysis.service';
import { CrimeNoticeStatisticsMapper } from '../common/mapper/crime-notice-statistics.mapper';

import { StatisticsGovernmentService, DataList } from './statistics-government.service';
import {
    EventAggregator, UtilHelper, DateFormatHelper
    // TypeConvertService
} from '../../core';
import { StatisticsType } from '../../enum';
import { CriminalNoticeInfoStatistics } from '../../model';
import * as moment from 'moment';
import { asEnumerable } from 'linq-es2015';
import { DxDateBoxComponent } from 'devextreme-angular';

/**
 * 政府申请业务统计
 *
 * @export
 * @class GovernmentStatisticComponent
 * @implements {OnInit}
 */
@Component({
    templateUrl: './statistics-government.component.html',
    providers: [StatisticsGovernmentService, DateFormatHelper, StatisticsAnalysisService, CrimeNoticeStatisticsMapper, EnumInfo]
})
export class StatisticsGovernmentComponent implements OnInit, OnDestroy {
    @ViewChild('governmentStatisticsChartDiv') governmentStatisticsChartDiv: ElementRef;    //  将展示图表的div注入组件
    @ViewChild('dateBox') dateBox: DxDateBoxComponent;

    private governmentStatisticsChart: any;
    /**
       * 词条数组
       */
    translates = [];
    // 按年/月/日统计查询 默认为年
    statisticsByDate = [];
    // 选中的样式
    public isCountByYears: boolean = false;
    public isCountByMonth: boolean = false;
    public isCountByCustom: boolean = false;
    isCountByDay: boolean = false;

    // 统计图颜色
    colorBar: string;

    /**
      * 政府申请统计矩形图标统计类型
      */
    governmentStatisticsType: StatisticsType = StatisticsType.currentYear;

    dataSource: any;
    // 自定义时间弹框
    customTimeVisible: boolean = false;

    minForStartMonth: any;
    maxForStartMonth: any;
    maxForEndMonth: any;

    // 自定义查询

    yearStatistics: boolean = true;
    monthStatistics: boolean = true;
    dayStatistics: boolean = true;
    searchBtn: boolean = true;
    // 自定义统计类型
    statisticsDateType: string;
    yearSearchBeginTime = null;
    yearSearchEndTime = null;
    monthSearchBeginTime = null;
    monthSearchEndTime = null;
    daySearchBeginTime = null;
    daySearchEndTime = null;
    // 自定义最晚日期
    now: Date = new Date;

    // 统计条件
    conditionFirst: string;
    conditionSecond: string;

    // 统计条件二是否可见
    isConditionFirst: boolean = true;
    // 默认统计时查询条件是否可见
    isCondition: boolean = false;
    isPurpose: boolean = true;
    isResult: boolean = true;
    isSearchbtn: boolean = true;
    // 办理用途
    purposeList: any[] = [];
    // 办理结果
    resultEnum: any[] = [];
    // 查询对象
    criminalNoticeInfoStatistics: any;
    // 当前页
    pageStatus: string;
    // 结果选所有
    resultAll: any[];
    // 当前统计图标题
    subTitle: string;
    // 当前时间
    currentDate: any;
    // 是否按自定义年月日统计
    isCountByCustomYear: boolean = false;
    isCountByCustomMonth: boolean = false;
    isCountByCustomDay: boolean = false;
    // 查询按钮是否可用
    isSearch: boolean = true;

    // 政府名称
    governmentName: string;
    // 办理用途
    applyPurpose: string;
    // 办理结果
    applyResult: string;
    // 办理结果Id
    resultId: string;
    // 办理用途
    purposeId: string;
    applyResultId: string;
    // 维度控制
    isGovernmentAndTime: boolean = false;
    isGovernmentNameAndTime: boolean = false;
    isGovernmentAndPurpose: boolean = false;
    isGovernmentAndResult: boolean = false;
    isResultAndPurpose: boolean = false;
    //  自定义时间
    nowForYear: Date = new Date(new Date(new Date().setMonth(11)).setDate(31));
    nowForMonth: Date;
    firstMonthOfYear: Date;
    firstDayOfMonth: Date;
    seriesData: any[] = [];

    // 列表数据提示
    nodata: string;
    grandTotal: string;
    // 纬度提示
    // governmentAndTimeVisible: boolean = false;
    // governmentNameAndTimeVisible: boolean = false;
    // governmentAndPurposeVisible: boolean = false;
    // governmentAndResultVisible: boolean = false;
    // resultAndPurposeVisible: boolean = false;

    constructor(
        private statisticsGovernmentService: StatisticsGovernmentService,
        private translateService: TranslateService,
        //    private statisticsAnalysisService: StatisticsAnalysisService,
        //  private typeConvertService: TypeConvertService,
        private utilHelper: UtilHelper,
        //  private numberConvertService: NumberConvertService,
        private dateFormatHelper: DateFormatHelper,
        private eventAggregator: EventAggregator,
        private enumInfo: EnumInfo,
        private toastr: ToastrService,
    ) {
        this.criminalNoticeInfoStatistics = new CriminalNoticeInfoStatistics();
        this.pageStatus = 'governmentNameAndTime';
    }


    ngOnInit() {
        this.initTranslate();
        // this.firstMonthOfYear = new Date(new Date(new Date().setMonth(0)).setDate(1)); // 获取今年的第一天
        // this.firstDayOfMonth = new Date(new Date().setDate(1)); // 获取本月的第一天
        let year = (new Date()).getFullYear();
        let month = (new Date()).getMonth() + 1;
        this.nowForMonth = new Date(new Date().setDate(this.getLastDay(year, month)));

        this.translateService.get(['searchByYear', 'searchByMonth', 'searchByDay']).subscribe(result => {
            this.statisticsByDate = [
                {
                    id: '1',
                    name: result.searchByYear
                },
                {
                    id: '2',
                    name: result.searchByMonth
                },
                {
                    id: '3',
                    name: result.searchByDay
                },
            ];
        });
        // 初始化图表
        this.initCharts();
        // 初始化表格词条
        this.initTranslate().then(() => {
            this.nodata = this.translates['search no data'];
            this.grandTotal = this.translates['total'] + '(' + this.translates['secondary'] + ')';
        }).catch(err => {
            console.log(err);
        });

        // 缓存路由
        sessionStorage.setItem('currentRouter', 'government-statistics');
        // 路由信息
        this.bindRoutUrl('StatisticalAnalysis', 'GovernmentApplicationStatistics');

        this.toastr.toastrConfig.positionClass = 'toast-center-center';

        this.statisticsGovernmentService.initialCrmsService()
            .then(result => {
                this.getApplyPurposeList();
                this.getApplyResults();
                this.countByDay();
            }).catch(err => {
                console.log(err);
            });
        this.isGovernmentAndTime = true;

    };

    /**
     * 初始化词条
     */
    initTranslate(): Promise<any> {
        return new Promise((r, j) => {
            let translateKeys = ['year', 'month', 'day', 'bussiness application', 'to',
                'secondary', 'government-statistics-chart', 'business-purpose', 'hasCriminalRecord', 'noCriminalRecord',
                'governmentType', 'business-result', 'ALL', 'search no data', 'total', 'applyGovernment', 'switch to line chart',
                'switch to bar chart', 'reduction', 'save as images', 'other', 'business', 'chart', 'grid'];
            this.translateService.get(translateKeys).toPromise().then(values => {
                translateKeys.forEach((key) => {
                    this.translates[key] = values[key];
                });
                r(this.translates);
            }).catch(err => {
                console.log(err);
            });
        });
    }

    // 获取办理用途
    getApplyPurposeList() {
        this.statisticsGovernmentService.getApplyPurposeList().then(result => {
            if (this.utilHelper.AssertNotNull(result)) {
                this.purposeList = [{ name: this.translates['ALL'], applyPurposeId: '0' }].concat(result);
            }
        }).catch(err => {
            console.log(err);
        });
    }

    // 获取办理结果
    getApplyResults() {
        this.resultEnum = this.enumInfo.getAnalysisResult;
        this.resultAll = [{ name: this.translates['ALL'], value: '0' }];
        this.resultAll = this.resultAll.concat(this.resultEnum);
    }

    ngOnDestroy() {
        this.governmentStatisticsChart.clear();
        echarts.dispose(this.governmentStatisticsChart);

    }

    // 路由绑定header路径

    bindRoutUrl(parentUrl: string, childrenUrl: string) {
        this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }

    /**
         * 浏览器窗口尺寸改变时，调整图表尺寸
         */
    onResize(event) {
        this.governmentStatisticsChart.resize();
    }

    // 初始化图表
    initCharts() {
        if (this.governmentStatisticsChartDiv) {
            this.governmentStatisticsChart = echarts.init(this.governmentStatisticsChartDiv.nativeElement);
        }

    }


    // 清空查询条件
    clearCondition() {
        if (this.utilHelper.AssertNotNull(this.applyPurpose)) {
            this.applyPurpose = null;
        }
        if (this.utilHelper.AssertNotNull(this.governmentName)) {
            this.governmentName = null;
        }
        if (this.utilHelper.AssertNotNull(this.applyResult)) {
            this.applyResult = null;
        }
    }

    //  清除Custom条件
    clearCustomCondition() {
        this.isCountByCustom = false;
        this.criminalNoticeInfoStatistics = new CriminalNoticeInfoStatistics();
    }

    // 维度控制
    controlDimensionality() {
        this.isGovernmentAndTime = false;
        this.isGovernmentNameAndTime = false;
        this.isGovernmentAndPurpose = false;
        this.isGovernmentAndResult = false;
        this.isResultAndPurpose = false;
    }

    //  政府申请和时间
    governmentNameAndTime() {
        this.controlDimensionality();
        this.isGovernmentAndTime = true;
        this.clearCondition();
        this.isCondition = false;
        this.isConditionFirst = true;
        this.isPurpose = true;
        this.isResult = true;
        this.isSearchbtn = true;
        this.pageStatus = 'governmentNameAndTime';
        this.colorBar = '#0275d8';
        //    this.clearCustomCondition();
        this.bindCurrentData();
    }

    // 政府名称与时间
    governmentAndTime() {
        this.controlDimensionality();
        this.isGovernmentNameAndTime = true;
        this.clearCondition();
        this.isConditionFirst = false;
        this.isCondition = false;
        this.isPurpose = true;
        this.isResult = true;
        this.isSearchbtn = false;
        this.pageStatus = 'governmentAndTime';
        this.colorBar = '#5cb85c';
        //    this.clearCustomCondition();
        this.bindCurrentData();
    }
    // 政府名称与用途
    governmentAndPurpose() {
        this.controlDimensionality();
        this.isGovernmentAndPurpose = true;
        this.clearCondition();
        this.applyPurpose = '0';
        this.isConditionFirst = false;
        this.isCondition = false;
        this.isPurpose = false;
        this.isResult = true;
        this.isSearchbtn = false;
        this.pageStatus = 'governmentAndPurpose';
        this.colorBar = '#5bc0de';
        //   this.clearCustomCondition();
        this.bindCurrentData();
    }

    // 政府名称与结果
    governmentAndResult() {
        this.controlDimensionality();
        this.isGovernmentAndResult = true;
        this.clearCondition();
        this.isConditionFirst = false;
        this.isCondition = false;
        this.isPurpose = true;
        this.isResult = false;
        this.isSearchbtn = false;
        this.pageStatus = 'governmentAndResult';
        this.colorBar = '#f0ad4e';
        this.applyResult = '0';
        //   this.clearCustomCondition();
        this.bindCurrentData();
    }

    // 用途与结果
    resultAndPurpose() {
        this.controlDimensionality();
        this.isResultAndPurpose = true;
        this.clearCondition();
        this.isConditionFirst = true;
        this.isCondition = false;
        this.isPurpose = false;
        this.isResult = false;
        this.isSearchbtn = false;
        this.pageStatus = 'resultAndPurpose';
        this.applyResult = '0';
        this.applyPurpose = '0';
        this.colorBar = '#d9534f';
        //    this.clearCustomCondition();
        this.bindCurrentData();
    }

    // 获取查询条件
    getCondition() {
        switch (this.pageStatus) {
            case 'governmentAndTime':
                if (this.utilHelper.AssertNotNull(this.governmentName)) {
                    this.criminalNoticeInfoStatistics.govermentInfo = this.governmentName.replace(/(^\s+)|(\s+$)/g, '');
                } else {
                    this.criminalNoticeInfoStatistics.govermentInfo = null;
                }
                break;
            case 'governmentAndPurpose':
                if (this.applyPurpose === '0') {
                    this.purposeId = null;
                } else {
                    this.purposeId = this.applyPurpose;
                }
                this.criminalNoticeInfoStatistics.applyPurposeId = this.purposeId;
                if (this.utilHelper.AssertNotNull(this.governmentName)) {
                    this.criminalNoticeInfoStatistics.govermentInfo = this.governmentName.replace(/(^\s+)|(\s+$)/g, '');
                } else {
                    this.criminalNoticeInfoStatistics.govermentInfo = null;
                }
                break;
            case 'governmentAndResult':
                if (this.applyResult === '0') {
                    this.resultId = null;
                } else if (this.applyResult === '1') {
                    this.resultId = '2';
                } else {
                    this.resultId = '1';
                }
                this.criminalNoticeInfoStatistics.applyResultId = this.resultId;
                if (this.utilHelper.AssertNotNull(this.governmentName)) {
                    this.criminalNoticeInfoStatistics.govermentInfo = this.governmentName.replace(/(^\s+)|(\s+$)/g, '');
                } else {
                    this.criminalNoticeInfoStatistics.govermentInfo = null;
                }
                break;
            case 'resultAndPurpose':
                if (this.applyPurpose === '0') {
                    this.purposeId = null;
                } else {
                    this.purposeId = this.applyPurpose;
                }
                this.criminalNoticeInfoStatistics.applyPurposeId = this.purposeId;
                if (this.applyResult === '0') {
                    this.applyResultId = null;
                } else if (this.applyResult === '1') {
                    this.applyResultId = '2';
                } else {
                    this.applyResultId = '1';
                }
                this.criminalNoticeInfoStatistics.applyResultId = this.applyResultId;

                break;
        }
        this.checkCondition();
        this.getCurrentData();
    }


    /**
     * 按年统计
     */
    countByYear() {
        this.clearCustomCondition();
        this.isCountByYears = true;
        this.isCountByMonth = false;
        this.isCountByDay = false;
        this.isCountByCustom = false;
        this.bindCurrentData();
    }

    /**
     * 按月统计
     */
    countByMonth() {
        this.clearCustomCondition();
        this.isCountByYears = false;
        this.isCountByMonth = true;
        this.isCountByDay = false;
        this.isCountByCustom = false;
        this.bindCurrentData();
    }

    // 当天
    countByDay() {
        this.clearCustomCondition();
        this.isCountByYears = false;
        this.isCountByMonth = false;
        this.isCountByCustom = false;
        this.isCountByDay = true;
        this.bindCurrentData();
    }


    /**
     * 按自定义时间统计
     */
    countByCustomTime() {
        this.isCountByYears = false;
        this.isCountByMonth = false;
        this.isCountByCustom = true;
        this.isCountByDay = false;
        this.customTimeVisible = true;
    }

    // 按自定义时间统计提交
    searchByCustomTime() {
        this.customTimeVisible = false;
        this.getCustomTime();
        this.bindCurrentData();
        this.searchBtn = true;
    }

    // 选择查询日期类型
    selectedIndexOfDateType(e) {
        //   this.yearSearchEndTime = this.monthSearchEndTime = this.daySearchEndTime = this.now;
        if (this.utilHelper.AssertNotNull(e.selectedItem)) {
            this.statisticsDateType = e.selectedItem.id;
            if (this.statisticsDateType === '1') {
                this.yearStatistics = false;
                this.monthStatistics = true;
                this.dayStatistics = true;
            }
            if (this.statisticsDateType === '2') {
                this.yearStatistics = true;
                this.monthStatistics = false;
                this.dayStatistics = true;
            }
            if (this.statisticsDateType === '3') {
                this.yearStatistics = true;
                this.monthStatistics = true;
                this.dayStatistics = false;
            }
        }
    }

    /**
    * 获取月份的最后一天
    * @param e
    */
    getLastDay(year, month) {
        let new_year = year;
        let new_month = month++;
        if (month > 12) {
            new_month -= 12;
            new_year++;
        }
        let new_date = new Date(new_year, new_month, 1);
        return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
    }


    // 改变时间时，判断button能否被点击
    public timeChanged(e) {
        if (this.utilHelper.AssertNotNull(this.statisticsDateType)) {
            let custonTime = this.getCustomTime();
            if (this.utilHelper.AssertNotNull(custonTime.start && custonTime.end && custonTime.type)) {
                this.searchBtn = false;
            } else {
                this.searchBtn = true;
            }
            // 按年查询
            if (this.statisticsDateType === '1') {
                if (this.utilHelper.AssertNotNull(this.yearSearchBeginTime)) {
                    this.yearSearchBeginTime = new Date(new Date(this.yearSearchBeginTime.setMonth(0)).setDate(1)); // 获取今年的第一天
                }
                if (this.utilHelper.AssertNotNull(this.yearSearchEndTime)) {
                    this.yearSearchEndTime = new Date(new Date(this.yearSearchEndTime.setMonth(11)).setDate(31));
                }
            }


            // 按天查询
            if (custonTime.type === 5) {
                this.firstDayOfMonth = null;
                if (this.utilHelper.AssertNotNull(custonTime.start)) {
                    this.getCurrentDatedata(this.daySearchBeginTime);
                    let year = this.currentDate.year;
                    let month = this.currentDate.month;
                    this.now = new Date(new Date(custonTime.start).setDate(this.getLastDay(year, month))); // 获取当月的最后一天
                }

                if (this.utilHelper.AssertNotNull(this.daySearchEndTime)) {
                    this.firstDayOfMonth = new Date(new Date(this.daySearchEndTime).setDate(1)); // 获取当月的第一天
                }

            }

        }
    }

    /**
  * 按月查询的开始时间
  */
    startMonthChanged(e) {
        if (this.utilHelper.AssertNotNull(this.statisticsDateType)) {
            let custonTime = this.getCustomTime();
            if (this.utilHelper.AssertNotNull(custonTime.start && custonTime.end && custonTime.type)) {
                this.searchBtn = false;
            } else {
                this.searchBtn = true;
            }
            let nowForYear = moment(new Date()).format('YYYY');
            let nowForMonth = moment(new Date()).format('MM');
            if (this.utilHelper.AssertEqualNull(this.monthSearchEndTime)) { // 无结束时间
                this.minForStartMonth = null;
                this.firstMonthOfYear = null;
                this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
            } else { // 有结束时间
                this.firstMonthOfYear = null;
                this.minForStartMonth = new Date(new Date(new Date(this.monthSearchEndTime).setMonth(0)).setDate(1));
                this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
            }


            if (this.utilHelper.AssertEqualNull(this.monthSearchBeginTime)) { // 无开始时间
                this.minForStartMonth = null;
                this.firstMonthOfYear = null;
                this.dateBox.instance.reset();
                this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
            } else { // 有开始时间
                this.minForStartMonth = null;
                let year = moment(this.monthSearchBeginTime).format('YYYY');
                let month = moment(this.monthSearchBeginTime).format('MM');
                if (year === nowForYear) {
                    this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
                } else {
                    this.maxForEndMonth = new Date(new Date(new Date(new Date(this.monthSearchBeginTime).setMonth(11))
                        .setDate(31)).setHours(0, 0, 0));
                }
            }


            if (this.utilHelper.AssertNotNull(this.monthSearchBeginTime) && this.utilHelper.AssertNotNull(this.monthSearchEndTime)) {
                // 有开始时间，有结束时间
                let year = moment(this.monthSearchEndTime).format('YYYY');
                let month = moment(this.monthSearchEndTime).format('MM');
                if (year === nowForYear) {
                    this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
                } else {
                    this.maxForEndMonth = new Date(new Date(new Date(this.monthSearchEndTime).setMonth(11)).
                        setDate(31));
                }
                this.minForStartMonth = new Date(new Date(new Date(this.monthSearchEndTime).setMonth(0)).setDate(1));
            }
        }
    }

    /**
     * 按月查询结束时间
     */
    endMonthChanged(e) {
        if (this.utilHelper.AssertNotNull(this.statisticsDateType)) {
            let custonTime = this.getCustomTime();
            if (this.utilHelper.AssertNotNull(custonTime.start && custonTime.end && custonTime.type)) {
                this.searchBtn = false;
            } else {
                this.searchBtn = true;
            }
            let nowForYear = moment(new Date()).format('YYYY');
            let nowForMonth = moment(new Date()).format('MM');
            if (this.utilHelper.AssertEqualNull(this.monthSearchBeginTime) && this.utilHelper.AssertEqualNull(
                this.monthSearchEndTime)) {
                // 无开始时间，无结束时间
                this.minForStartMonth = null;
                this.firstMonthOfYear = null;
                this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
            } else if (this.utilHelper.AssertNotNull(this.monthSearchBeginTime) && this.utilHelper.AssertEqualNull(
                this.monthSearchEndTime)) {
                // 有开始时间，无结束时间
                this.minForStartMonth = null;
                let year = moment(this.monthSearchBeginTime).format('YYYY');
                let month = moment(this.monthSearchBeginTime).format('MM');
                if (year === nowForYear) {
                    this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
                } else {
                    this.maxForEndMonth = new Date(new Date(new Date(new Date(this.monthSearchBeginTime).setMonth(11))
                        .setDate(31)).setHours(0, 0, 0));
                }
            } else if (this.utilHelper.AssertEqualNull(this.monthSearchBeginTime) && this.utilHelper.AssertNotNull(
                this.monthSearchEndTime)) {
                // 无开始时间，有结束时间
                this.firstMonthOfYear = null;
                this.minForStartMonth = new Date(new Date(new Date(this.monthSearchEndTime).setMonth(0)).setDate(1));
                this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
            } else if (this.utilHelper.AssertNotNull(this.monthSearchBeginTime) && this.utilHelper.AssertNotNull(
                this.monthSearchEndTime)) {
                // 有开始时间，有结束时间
                let year = moment(this.monthSearchEndTime).format('YYYY');
                let month = moment(this.monthSearchEndTime).format('MM');
                if (year === nowForYear) {
                    this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
                } else {
                    this.maxForEndMonth = new Date(new Date(new Date(this.monthSearchEndTime).setMonth(11)).
                        setDate(31));
                }
                this.minForStartMonth = new Date(new Date(new Date(this.monthSearchEndTime).setMonth(0)).setDate(1));
            }
            if (this.utilHelper.AssertNotNull(this.monthSearchEndTime)) {
                let year = moment(this.monthSearchEndTime).format('YYYY');
                let month = moment(this.monthSearchEndTime).format('MM');
                if (year === nowForYear && month === nowForMonth) {
                    this.monthSearchEndTime = new Date(moment(new Date()).format('YYYY-MM-DD' + ' ' + '23:59:59'));
                } else {
                    this.monthSearchEndTime = new Date(new Date(new Date(this.monthSearchEndTime)
                        .setDate(this.getLastDay(year, month))).setHours(23, 59, 59));
                }
            }
        }
    }


    /**
     * 获取当前选择的开始时间和结束时间
     */
    private getCustomTime() {
        switch (this.statisticsDateType) {
            case '1':
                this.criminalNoticeInfoStatistics.dateType = '3';
                if (this.utilHelper.AssertNotNull(this.yearSearchBeginTime) && this.utilHelper.AssertNotNull(this.yearSearchEndTime)) {
                    this.criminalNoticeInfoStatistics.startDate = this.dateFormatHelper
                        .RestURLBeignDateTimeFormat(this.yearSearchBeginTime);
                    this.criminalNoticeInfoStatistics.endDate = this.dateFormatHelper.RestURLEndDateTimeFormat(this.yearSearchEndTime);
                } else {
                    // this.yearSearchBeginTime = null;
                    this.criminalNoticeInfoStatistics.startDate = null;
                }
                break;
            case '2':
                this.criminalNoticeInfoStatistics.dateType = '4';
                if (this.utilHelper.AssertNotNull(this.monthSearchBeginTime) && this.utilHelper.AssertNotNull(this.monthSearchBeginTime)) {
                    this.criminalNoticeInfoStatistics.startDate = this.dateFormatHelper
                        .RestURLBeignDateTimeFormat(this.monthSearchBeginTime);
                    this.criminalNoticeInfoStatistics.endDate = this.dateFormatHelper.RestURLEndDateTimeFormat(this.monthSearchEndTime);
                } else {
                    //  this.monthSearchBeginTime = null;
                    this.criminalNoticeInfoStatistics.startDate = null;
                }
                break;
            case '3':
                this.criminalNoticeInfoStatistics.dateType = '5';
                if (this.utilHelper.AssertNotNull(this.daySearchBeginTime) && this.utilHelper.AssertNotNull(this.daySearchEndTime)) {
                    this.criminalNoticeInfoStatistics.startDate = this.dateFormatHelper
                        .RestURLBeignDateTimeFormat(this.daySearchBeginTime);
                    this.criminalNoticeInfoStatistics.endDate = this.dateFormatHelper.RestURLEndDateTimeFormat(this.daySearchEndTime);
                } else {
                    // this.daySearchBeginTime = null;
                    this.criminalNoticeInfoStatistics.startDate = null;
                }
                break;
        }
        return {
            start: this.criminalNoticeInfoStatistics.startDate,
            end: this.criminalNoticeInfoStatistics.endDate,
            type: this.criminalNoticeInfoStatistics.dateType
        };
    }

    // 绑定当前数据
    bindCurrentData() {
        //   this.checkCondition();
        this.getCondition();
        //  this.getCurrentData();
    }

    // 获取当前条件下的数据
    getCurrentData() {
        switch (this.pageStatus) {
            case 'governmentAndTime':
                this.statisticsGovernmentService.getQuantityOfGovernmentType(this.criminalNoticeInfoStatistics).then(result => {
                    this.setTableAndChart(result);
                }).catch(err => {
                    console.log(err);
                });
                break;
            case 'governmentAndPurpose':
                this.statisticsGovernmentService.getQuantityOfPurpose(this.criminalNoticeInfoStatistics).then(result => {
                    if (this.utilHelper.AssertNotNull(result)) {
                        this.setTableAndChart(result);
                    }
                }).catch(err => {
                    console.log(err);
                });

                break;
            case 'governmentAndResult':
                this.statisticsGovernmentService.getQuantityOfResult(this.criminalNoticeInfoStatistics).then(result => {
                    if (this.utilHelper.AssertNotNull(result)) {
                        this.setTableAndChart(result);
                    }
                }).catch(err => {
                    console.log(err);
                });
                break;
            case 'resultAndPurpose':
                this.statisticsGovernmentService.getQuantityByPurposeAndResult(this.criminalNoticeInfoStatistics).then(result => {
                    if (this.utilHelper.AssertNotNull(result)) {
                        this.setTableAndChart(result);
                    }
                }).catch(err => {
                    console.log(err);
                });
                break;
            case 'governmentNameAndTime':
                this.statisticsGovernmentService.getCurrentList(this.criminalNoticeInfoStatistics).then(result => {
                    if (this.utilHelper.AssertNotNull(result)) {
                        this.setTableAndChart(result);
                    }
                }).catch(err => {
                    console.log(err);
                });
                break;
        }
    }

    // 分别设置不同条件的图表
    setTableAndChart(result) {
        if (this.isCountByYears === true) {
            this.setYearTable(result);
        }
        if (this.isCountByMonth === true) {
            this.setMonthTable(result);
        }
        if (this.isCountByDay === true) {
            this.setDayTable(result);
        }
        if (this.isCountByCustom === true) {
            let startYear: string;
            let endYear: string;
            let startMonth: string;
            let endMonth: string;
            let startDay: string;
            let endDay: string;

            if (this.utilHelper.AssertNotNull(this.criminalNoticeInfoStatistics.startDate)) {
                startYear = this.criminalNoticeInfoStatistics.startDate
                    .split(' ')[0].split('-')[0];
                startMonth = this.criminalNoticeInfoStatistics.startDate
                    .split(' ')[0].split('-')[1];
                startDay = this.criminalNoticeInfoStatistics.startDate
                    .split(' ')[0].split('-')[2];
            }
            if (this.utilHelper.AssertNotNull(this.criminalNoticeInfoStatistics.endDate)) {
                endYear = this.criminalNoticeInfoStatistics.endDate
                    .split(' ')[0].split('-')[0];
                endMonth = this.criminalNoticeInfoStatistics.endDate
                    .split(' ')[0].split('-')[1];
                endDay = this.criminalNoticeInfoStatistics.endDate
                    .split(' ')[0].split('-')[2];
            }

            switch (this.statisticsDateType) {
                case '1':
                    this.isCountByCustomYear = true;
                    if ((this.utilHelper.AssertNotNull(startYear)) && (this.utilHelper.AssertNotNull(endYear))) {
                        if (startYear !== endYear) {
                            this.subTitle = startYear + this.translates['year'] + '-' + endYear + this.translates['year'];
                        } else {
                            this.subTitle = startYear + this.translates['year'];
                        }
                    } else {
                        this.subTitle = '';
                    }
                    this.setYearTable(result);
                    break;
                case '2':
                    this.isCountByCustomMonth = true;
                    if ((this.utilHelper.AssertNotNull(startMonth)) && (this.utilHelper.AssertNotNull(endMonth))) {
                        if (startMonth !== endMonth) {
                            this.subTitle = startYear + this.translates['year'] + startMonth + this.translates['month']
                                + '-' + endYear + this.translates['year'] + endMonth + this.translates['month'];
                        } else {
                            this.subTitle = startYear + this.translates['year'] + startMonth + this.translates['month'];
                        }
                    } else {
                        this.subTitle = '';
                    }
                    this.setMonthTable(result);
                    break;
                case '3':
                    this.isCountByCustomDay = true;
                    if ((this.utilHelper.AssertNotNull(startDay)) && (this.utilHelper.AssertNotNull(endDay))) {
                        if (startDay !== endDay) {
                            this.subTitle = startYear + this.translates['year'] + startMonth + this.translates['month']
                                + startDay + this.translates['day'] + '-' + endYear + this.translates['year'] + endMonth +
                                this.translates['month'] + endDay + this.translates['day'];
                        } else {
                            this.subTitle = startYear + this.translates['year'] + startMonth + this.translates['month']
                                + startDay + this.translates['day'];
                        }
                    } else {
                        this.subTitle = '';
                    }
                    this.setDayTable(result);
                    break;
            }
        }
        this.setChartOption(result);
    }

    // 获取当前年月日
    getCurrentDatedata(data) {
        if (this.utilHelper.AssertNotNull(data)) {
            return this.currentDate = {
                year: data.getFullYear(),
                month: data.getMonth() + 1,
                day: data.getDate(),
            };
        }
    }

    //  按年、月、日、自定义时间
    checkCondition() {
        if (this.isCountByYears === true) {
            if (this.utilHelper.AssertEqualNull(this.criminalNoticeInfoStatistics.startDate) &&
                this.utilHelper.AssertEqualNull(this.criminalNoticeInfoStatistics.endDate)) {
                this.criminalNoticeInfoStatistics.dateType = '0';
                this.subTitle = this.currentDate.year + this.translates['year'];
            } else {
                this.criminalNoticeInfoStatistics.startDate = null;
                this.criminalNoticeInfoStatistics.endDate = null;
            }
        }
        if (this.isCountByMonth === true) {
            if (this.utilHelper.AssertEqualNull(this.criminalNoticeInfoStatistics.startDate) &&
                this.utilHelper.AssertEqualNull(this.criminalNoticeInfoStatistics.endDate)) {
                this.criminalNoticeInfoStatistics.dateType = '1';
                this.getCurrentDatedata(new Date());
                this.subTitle = this.currentDate.year + this.translates['year'] + this.currentDate.month + this.translates['month'];
            } else {
                this.criminalNoticeInfoStatistics.startDate = null;
                this.criminalNoticeInfoStatistics.endDate = null;
            }
        }
        if (this.isCountByDay === true) {
            if (this.utilHelper.AssertEqualNull(this.criminalNoticeInfoStatistics.startDate) &&
                this.utilHelper.AssertEqualNull(this.criminalNoticeInfoStatistics.endDate)) {
                this.criminalNoticeInfoStatistics.dateType = '2';
                this.getCurrentDatedata(new Date());
                this.subTitle = this.currentDate.year + this.translates['year'] + this.currentDate.month +
                    this.translates['month'] + this.currentDate.day + this.translates['day'];
            } else {
                this.criminalNoticeInfoStatistics.startDate = null;
                this.criminalNoticeInfoStatistics.endDate = null;
            }

        }

    }

    // 设置day表格
    setDayTable(data) {
        if (this.utilHelper.AssertNotNull(data) && data.length > 0) {
            data.forEach(item => {
                if (item.coord_Y === 'other') {
                    item.coord_Y = this.translates['other'];
                }
            });
            if (this.isCountByCustomDay === true) {
                if (this.pageStatus === 'governmentAndPurpose' || this.pageStatus === 'governmentAndResult' ||
                    this.pageStatus === 'resultAndPurpose') {
                    this.getDataSourceByPagestatus(data);
                } else {
                    data.forEach(item => {
                        if (this.utilHelper.AssertNotNull(item.coord_X)) {
                            item.day = item.coord_X.split('-')[2] + this.translates['day'];
                        }
                    });
                    this.dataSource = {
                        fields: [
                            {
                                width: 180,
                                dataField: 'coord_Y',
                                dataType: 'string',
                                area: 'row',
                                sortOrder: '',
                                sortingMethod: () => {
                                    return '';
                                }
                            },
                            {
                                dataField: 'day',
                                dataType: 'string',
                                area: 'column'
                            },
                            {
                                caption: 'count',
                                dataField: 'count',
                                dataType: 'number',
                                summaryType: 'sum',
                                area: 'data'
                            }
                        ],
                        store: data,
                    };
                }
            } else if (this.pageStatus === 'governmentAndPurpose' || this.pageStatus === 'governmentAndResult' ||
                this.pageStatus === 'resultAndPurpose') {
                this.getDataSourceByPagestatus(data);
            } else {
                data.forEach(item => {
                    // item.year = this.currentDate.year + this.translates['year'];
                    // item.month = this.currentDate.month + this.translates['month'];
                    item.day = this.currentDate.day + this.translates['day'];
                });
                this.dataSource = {
                    fields: [
                        {
                            width: 180,
                            dataField: 'coord_Y',
                            dataType: 'string',
                            area: 'row',
                            sortOrder: '',
                            sortingMethod: () => {
                                return '';
                            }
                        },
                        {
                            dataField: 'day',
                            dataType: 'string',
                            area: 'column'
                        },
                        {
                            caption: 'count',
                            dataField: 'count',
                            dataType: 'number',
                            summaryType: 'sum',
                            area: 'data'
                        }
                    ],
                    store: data,
                };
            }
        } else {
            this.dataSource = null;
        }
    }

    // 设置month表格
    setMonthTable(data) {
        if (this.utilHelper.AssertNotNull(data) && data.length > 0) {
            data.forEach(item => {
                if (item.coord_Y === 'other') {
                    item.coord_Y = this.translates['other'];
                }
            });
            if (this.isCountByCustomMonth === true) {
                if (this.pageStatus === 'governmentAndPurpose' || this.pageStatus === 'governmentAndResult' ||
                    this.pageStatus === 'resultAndPurpose') {
                    this.getDataSourceByPagestatus(data);
                } else {
                    data.forEach(item => {
                        item.month = item.coord_X + this.translates['month'];
                    });
                    this.dataSource = {
                        fields: [
                            {
                                width: 180,
                                dataField: 'coord_Y',
                                dataType: 'string',
                                area: 'row',
                                sortOrder: '',
                                sortingMethod: () => {
                                    return '';
                                }
                            },
                            {
                                dataField: 'month',
                                dataType: 'string',
                                area: 'column'
                            },
                            {
                                caption: 'count',
                                dataField: 'count',
                                dataType: 'number',
                                summaryType: 'sum',
                                area: 'data'
                            }
                        ],
                        store: data,
                    };
                }
            } else if (this.pageStatus === 'governmentAndPurpose' || this.pageStatus === 'governmentAndResult' ||
                this.pageStatus === 'resultAndPurpose') {
                this.getDataSourceByPagestatus(data);
            } else {
                data.forEach(item => {
                    // item.year = this.currentDate.year + this.translates['year'];
                    if (this.utilHelper.AssertNotNull(item.coord_X)) {
                        item.month = item.coord_X.split('-')[1] + this.translates['month'];
                        item.day = item.coord_X.split('-')[2] + this.translates['day'];
                    }
                });
                this.dataSource = {
                    fields: [
                        {
                            width: 180,
                            dataField: 'coord_Y',
                            dataType: 'string',
                            area: 'row',
                            sortOrder: '',
                            sortingMethod: () => {
                                return '';
                            }
                        },
                        {
                            dataField: 'day',
                            dataType: 'string',
                            area: 'column'
                        },
                        {
                            caption: 'count',
                            dataField: 'count',
                            dataType: 'number',
                            summaryType: 'sum',
                            area: 'data'
                        }
                    ],
                    store: data,
                };
            }
        } else {
            this.dataSource = null;
        }
    }

    // 设置year表格
    setYearTable(data) {
        if (this.utilHelper.AssertNotNull(data) && data.length > 0) {
            data.forEach(item => {
                if (item.coord_Y === 'other') {
                    item.coord_Y = this.translates['other'];
                }
            });
            if (this.isCountByCustomYear === true) {
                if (this.pageStatus === 'governmentAndPurpose' || this.pageStatus === 'governmentAndResult' ||
                    this.pageStatus === 'resultAndPurpose') {
                    this.getDataSourceByPagestatus(data);
                } else {
                    data.forEach(item => {
                        item.year = item.coord_X + this.translates['year'];
                    });
                    this.dataSource = {
                        fields: [
                            {
                                width: 180,
                                dataField: 'coord_Y',
                                dataType: 'string',
                                area: 'row',
                                sortOrder: '',
                                sortingMethod: () => {
                                    return '';
                                }
                            },
                            {
                                dataField: 'year',
                                dataType: 'string',
                                area: 'column'
                            },
                            {
                                caption: 'count',
                                dataField: 'count',
                                dataType: 'number',
                                summaryType: 'sum',
                                area: 'data'
                            }
                        ],
                        store: data,
                    };
                }
            } else if (this.pageStatus === 'governmentAndPurpose' || this.pageStatus === 'governmentAndResult' ||
                this.pageStatus === 'resultAndPurpose') {
                this.getDataSourceByPagestatus(data);
            } else {
                data.forEach(item => {
                    item.year = this.currentDate.year + this.translates['year'];
                    item.month = item.coord_X + this.translates['month'];
                });
                this.dataSource = {
                    fields: [
                        {
                            width: 180,
                            dataField: 'coord_Y',
                            dataType: 'string',
                            area: 'row',
                            sortOrder: '',
                            sortingMethod: () => {
                                return '';
                            }
                        },
                        {
                            dataField: 'month',
                            dataType: 'string',
                            area: 'column'
                        },
                        {
                            caption: 'count',
                            dataField: 'count',
                            dataType: 'number',
                            summaryType: 'sum',
                            area: 'data'
                        }
                    ],
                    store: data,
                };
            }
        } else {
            this.dataSource = null;
        }
    }

    // 设置Custom表格


    // 设置option
    private setChartOption(quantityOfYear: Array<any>) {
        let quantity: any[];
        let xAxis: any[];
        let quantityName: string;
        //   let quantityName: string;
        if (this.utilHelper.AssertNotNull(quantityOfYear) && quantityOfYear.length > 0) {
            if (this.pageStatus === 'governmentNameAndTime' || this.pageStatus === 'governmentAndTime'
                || this.pageStatus === 'governmentAndPurpose'
                || this.pageStatus === 'governmentAndResult' || this.pageStatus === 'resultAndPurpose') {
                if ((this.pageStatus === 'governmentAndTime') || (this.pageStatus === 'governmentAndPurpose' &&
                    this.applyPurpose === '0')) {
                    let xAxisData: any = [];
                    xAxisData = this.utilHelper.distinct(quantityOfYear.map(m => m.coord_Y));
                    let data = [];
                    /**
                     * 遍历所有同采集点的count并求和
                     */
                    xAxisData.forEach((item, index) => {
                        data[index] = asEnumerable(quantityOfYear).Where(x => x.coord_Y === item).Select(x => Number(x.count)).Sum();
                    });
                    quantity = data;
                    xAxis = xAxisData;
                    quantityName = this.translates['business'];
                    this.setOption(xAxis, quantity, quantityName);
                } else if ((this.pageStatus === 'governmentAndResult' && this.applyResult === '0') || (
                    this.pageStatus === 'resultAndPurpose' && this.applyResult === '0')) {
                    let result = this.getDataGroup(quantityOfYear);
                    this.setOptionByPageStatus(result);
                } else if (this.pageStatus === 'governmentAndPurpose' && this.applyPurpose === '0') {

                } else if (this.pageStatus === 'governmentNameAndTime') {
                    if (this.utilHelper.AssertNotNull(quantityOfYear) && (this.isCountByDay || this.isCountByMonth
                        || (this.isCountByCustom && !this.dayStatistics))) {
                        quantityOfYear.forEach(element => {
                            element.coord_X = this.utilHelper.format(element.coord_X, 'dd-MM-yyyy');
                        });
                    }
                    this.setOptions(quantityOfYear);
                } else {
                    this.setOptions(quantityOfYear);
                }
            } else {
                this.setOptions(quantityOfYear);
            }
        } else {
            // this.governmentStatisticsChart.clear();
            this.setOption(null, null, null);
        }
    }

    // 根据所在纬度加载数据
    getDataSourceByPagestatus(data) {
        if (this.utilHelper.AssertNotNull(data)) {
            data.forEach(item => {
                if (this.pageStatus === 'governmentAndPurpose' && this.applyPurpose === '0' &&
                    this.utilHelper.AssertEqualNull(this.governmentName)) {
                    // item.coord_X = this.translates['applyGovernment'];
                } else if (item.coord_X === 'other') {
                    item.coord_X = this.translates['other'];
                }
            });
            this.dataSource = {
                fields: [
                    {
                        width: 180,
                        dataField: 'coord_X',
                        dataType: 'string',
                        area: 'row',
                        sortOrder: '',
                        sortingMethod: () => {
                            return '';
                        }
                    },
                    {
                        dataField: 'coord_Y',
                        dataType: 'string',
                        area: 'column'
                    },
                    {
                        caption: 'count',
                        dataField: 'count',
                        dataType: 'number',
                        summaryType: 'sum',
                        area: 'data'
                    }
                ],
                store: data,
            };
        }
    }


    // 设置option
    setOption(xAxis, quantity, quantityName) {
        this.getColor();
        this.translateService.get(['count']).subscribe(result => {
            let option = {
                title: {
                    text: '',
                    subtext: '',
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        fontSize: 16,
                        fontFamily: 'Microsoft YaHei'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: [quantityName],
                    top: 30,
                    left: '13%',
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: { // 图表类型转换
                            type: ['line', 'bar'],
                            title: {
                                line: this.utilHelper.formatString(this.translates['switch to line chart']),
                                bar: this.utilHelper.formatString(this.translates['switch to bar chart'])
                            }
                        },
                        restore: {
                            title: this.utilHelper.formatString(this.translates['reduction'])
                        },
                        saveAsImage: { // 保存为图片
                            title: this.utilHelper.formatString(this.translates['save as images'])
                        }
                    },
                    right: '2%'
                },
                grid: [
                    {

                    }, {
                        left: '8%',
                        right: '8%',
                        bottom: '10%',
                        containLabel: true
                    }],
                xAxis: [
                    {
                        name: '',
                        type: 'category',
                        show: true,
                        data: xAxis,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: 0,
                            fontSize: 12,
                            formatter: (value) => {
                                if (value.length > 10) {
                                    let str = '';
                                    str = value.substring(0, 10) + '...';
                                    return str;
                                } else {
                                    return value;
                                }
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: true,
                        name: this.translates['secondary']
                    }
                ],
                minInterval: 1,
                dataZoom: [
                    {
                        type: 'slider',
                        start: 0,
                        end: 40,
                        showDetail: false,
                        zoomLock: true
                    },
                    {
                        type: 'inside',
                        start: 0,
                        end: 40,
                        showDetail: false,
                        zoomLock: true
                    }
                ],
                series: [
                    {
                        name: quantityName,
                        type: 'bar',
                        z: 1,
                        data: quantity,
                        // barWidth: 70,
                        itemStyle: {
                            normal: {
                                color: this.colorBar
                            }
                        }
                    }
                ]
            };

            this.governmentStatisticsChart.clear();
            option.title.text = this.translates['government-statistics-chart'];
            option.title.subtext = this.subTitle;
            this.governmentStatisticsChart.setOption(option);
            //  this.governmentStatisticsChart.on('click', this.selectYear, this);
        });
    }

    // 设置柱子颜色
    getColor() {
        switch (this.pageStatus) {
            case 'governmentAndTime':
                this.colorBar = '#5cb85c';
                break;
            case 'governmentAndPurpose':
                this.colorBar = '#5bc0de';
                break;
            case 'governmentAndResult':
                this.colorBar = '#f0ad4e';
                break;
            case 'resultAndPurpose':
                this.colorBar = '#d9534f';
                break;
            case 'governmentNameAndTime':
                this.colorBar = '#0275d8';
                break;
        }
    }

    // 设置两个条件均为所有时
    setOptionByPageStatus(optionData) {
        this.translateService.get(['count']).subscribe(result => {
            let option = {
                title: {
                    text: '',
                    subtext: '',
                    x: 'center',
                    y: 'top',
                    textStyle: {
                        fontSize: 16,
                        fontFamily: 'Microsoft YaHei'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: optionData.yAxisData,
                    top: 30,
                    left: '13%',
                },
                toolbox: {
                    show: true,
                    feature: {
                        magicType: { // 图表类型转换
                            type: ['line', 'bar'],
                            title: {
                                line: this.utilHelper.formatString(this.translates['switch to line chart']),
                                bar: this.utilHelper.formatString(this.translates['switch to bar chart'])
                            }
                        },
                        restore: {
                            title: this.utilHelper.formatString(this.translates['reduction'])
                        },
                        saveAsImage: { // 保存为图片
                            title: this.utilHelper.formatString(this.translates['save as images'])
                        }
                    },
                    right: '2%'
                },
                grid: [
                    {

                    }, {
                        left: '8%',
                        right: '8%',
                        bottom: '10%',
                        containLabel: true
                    }],
                xAxis: [
                    {
                        name: '',
                        type: 'category',
                        show: true,
                        data: optionData.xAxisData,
                        axisTick: {
                            alignWithLabel: true
                        },
                        axisLabel: {
                            show: true,
                            interval: 0,
                            rotate: 0,
                            fontSize: 12,
                            formatter: (value) => {
                                if (value.length > 20) {
                                    let str = '';
                                    str = value.substring(0, 20) + '...';
                                    return str;
                                } else {
                                    return value;
                                }
                            }
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        show: true,
                        name: this.translates['secondary']
                    }
                ],
                minInterval: 1,
                dataZoom: [
                    {
                        type: 'slider',
                        start: 0,
                        end: 40,
                        showDetail: false,
                        zoomLock: true
                    },
                    {
                        type: 'inside',
                        start: 0,
                        end: 40,
                        showDetail: false,
                        zoomLock: true
                    }
                ],
                series: optionData.seriesData
            };

            this.governmentStatisticsChart.clear();
            option.title.text = this.translates['government-statistics-chart'];
            option.title.subtext = this.subTitle;
            this.governmentStatisticsChart.setOption(option);
        });
    }

    getDataGroup(quantityOfYear: DataList[]) {
        if (this.utilHelper.AssertNotNull(quantityOfYear)) {
            let quantity: any[] = [];
            let seriesData1: any[] = [];
            let seriesData2: any[] = [];
            let xAxisData: any[] = [];
            let yAxisData: any[] = [];
            let arr_final: any[] = [];

            let arr = asEnumerable(quantityOfYear).GroupBy(element => element.coord_X).ToArray();
            // 循环二维数组，查找是否有缺失项
            // length为1为有缺失项

            arr.forEach((element, index) => {
                let item = element as DataList[];
                if (item.length === 1) {
                    // 循环缺失数据项，进行补全
                    // 从已有项进行深拷贝，并重新赋值
                    let copyItem = JSON.parse(JSON.stringify(item[0])) as DataList;
                    // 设为默认值0
                    copyItem.count = '0';
                    // 修改复制项类型
                    let flag = false;
                    if (copyItem.coord_Y === 'Tem registo criminal') {
                        copyItem.coord_Y = 'Não tem registo criminal';
                        flag = true;
                    } else {
                        copyItem.coord_Y = 'Tem registo criminal';
                        flag = false;
                    }
                    // 将复制项添加到二维数组
                    let arr_inner = arr[index] as DataList[];
                    // 判断复制项是加在数组头部，还是尾部
                    if (flag) {
                        arr_inner.push(copyItem);
                    } else {
                        arr_inner.unshift(copyItem);
                    }
                }
            });


            // 将二维数组转为一维数组
            arr_final = [].concat.apply([], arr) as DataList[];

            // 将处理之后的数据放入数据表中
            // this.setDateSource(arr_final);

            // 取x 轴
            xAxisData = asEnumerable(arr_final).Select(element => element.coord_X).Distinct().ToArray();
            // 柱子名
            yAxisData = asEnumerable(arr_final).Select(element => element.coord_Y).Distinct().ToArray();
            // 取 y 轴
            quantity = asEnumerable(arr_final).GroupBy(element => element.coord_Y).ToArray();

            if (this.utilHelper.AssertNotNull(quantity[0])) {
                // 取无犯罪
                seriesData1 = asEnumerable(quantity[0] as DataList[]).Select(element => element.count).ToArray();
            }
            if (this.utilHelper.AssertNotNull(quantity[1])) {
                // 取有犯罪
                seriesData2 = asEnumerable(quantity[1] as DataList[]).Select(element => element.count).ToArray();
            }
            this.setSeriesData(yAxisData, seriesData1, seriesData2);

            return {
                xAxisData: xAxisData,
                yAxisData: yAxisData,
                seriesData: this.seriesData
            };

        }
    }


    // 设置图表的柱子数量和name
    setSeriesData(yAxisData, seriesData1, seriesData2) {
        if (yAxisData.length === 1) {
            this.seriesData = [
                {
                    name: yAxisData[0],
                    type: 'bar',
                    data: seriesData1,
                    itemStyle: {
                        normal: {
                            color: this.colorBar
                        }
                    }
                }
            ];
        } else {
            this.seriesData = [
                {
                    name: yAxisData[0],
                    type: 'bar',
                    data: seriesData1,
                    itemStyle: {
                        normal: {
                            color: this.colorBar
                        }
                    }
                },
                {
                    name: yAxisData[1],
                    type: 'bar',
                    data: seriesData2,
                    itemStyle: {
                        normal: {
                            color: '#8555e9'
                        }
                    }
                }
            ];
        }
    }


    // 设置图表数据展现
    // setDateSource(data) {
    //     this.dataSource = {
    //         fields: [{
    //             dataField: 'coord_X',
    //             width: 180,
    //             area: 'row'
    //         }, {
    //             dataField: 'coord_Y',
    //             area: 'column'
    //         }, {
    //             dataField: 'count',
    //             dataType: 'number',
    //             summaryType: 'sum',
    //             area: 'data'
    //         }],
    //         store: data
    //     };
    // }



    // 只有有犯罪或无犯罪
    setOptions(quantityOfYear: DataList[]) {
        let xAxisData: any = [];
        let quantity: any[];
        let xAxis: any[];
        let yAxis: any[];
        let quantityName: string;
        xAxisData = this.utilHelper.distinct(quantityOfYear.map(m => m.coord_X));
        yAxis = this.utilHelper.distinct(quantityOfYear.map(m => m.coord_Y));
        let data = [];
        /**
         * 遍历所有同采集点的count并求和
         */
        xAxisData.forEach((item, index) => {
            data[index] = asEnumerable(quantityOfYear).Where(x => x.coord_X === item).Select(x => Number(x.count)).Sum();
        });
        quantity = data;
        xAxis = xAxisData;
        quantityName = yAxis[0];
        this.setOption(xAxis, quantity, quantityName);
    }

}

