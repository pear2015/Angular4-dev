import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { DateFormatHelper, UtilHelper } from '../../../core';
import { StatisticsAnalysisService } from '../statistics-analysis.service';
import { TranslateService } from 'ng2-translate';
import { StatisticsDateType, StatisticsType } from '../../../enum';
import { EnumService } from '../../../shared';
import * as moment from 'moment';
import { DxDateBoxComponent } from 'devextreme-angular';
/**
 * 统计分析纬度组建
 *
 * @export
 * @class PersonalStatisticsComponent
 * @implements {OnInit}
 */
@Component({
  templateUrl: './statistics-dimension.component.html',
  selector: 'crms-statistics-dimension',
  providers: [DateFormatHelper]
})
export class StatisticsDimensionComponent implements OnInit {

  // 选中的样式
  isByYear: boolean = false;
  isByMonth: boolean = false;
  isByToday: boolean = true;
  isByCustom: boolean = false;
  currentPoint = { provinceName: '', id: '', code: '' };
  customTimeVisible: boolean = false;
  customStartTimeByYear: Date;
  customEndTimeByYear: Date;
  customStartTimeByMonth: Date;
  customEndTimeByMonth: Date;
  customStartTimeByDay: Date;
  customEndTimeByDay: Date;
  yearStatistics: boolean = true;
  monthStatistics: boolean = true;
  dayStatistics: boolean = true;
  searchBtn: boolean = true;
  firstMonthOfYear: Date;
  firstDayOfMonth: Date;
  // 自定义最晚日期
  now: Date = new Date();
  // 所有法院
  courts: any;
  currentCourt = { courtId: '', courtName: '' };
  // 选中的采集点
  selectedFrontOffice = { name: '', id: '', code: '' };

  // 默认的采集点
  defaultFrontOffice = { name: '', id: '', code: '' };

  // 选中的法院
  selectedCourtOffice = { courtId: '', courtName: '' };

  // 默认的法院
  defaultCourtOffice = { courtId: '', courtName: '' };

  statisticsDateType: StatisticsDateType;
  // select选择年月日
  statisticsByDate = [];
  // 中心
  centers: any[] = [];
  // 默认中心
  defaultCenter = { id: '', name: '' };
  currentCenter = { id: '', name: '' };
  // 控制法院选择或中心点选择显示或者隐藏
  nowForYear: Date = new Date(new Date(new Date().setMonth(11)).setDate(31));
  maxForEndMonth: any;
  maxForStartDay: any;
  minForStartDay: any;
  /**
   * 开始时间最小值
   */
  minForStartMonth: any;
  maxForStartMonth: any;
  selectType: any;
  @ViewChild('startYearDom') startYearDom: DxDateBoxComponent;
  @ViewChild('endYearDom') endYearDom: DxDateBoxComponent;
  @ViewChild('startMonthDom') startMonthDom: DxDateBoxComponent;
  @ViewChild('endMonthDom') endMonthDom: DxDateBoxComponent;
  @ViewChild('startDayDom') startDayDom: DxDateBoxComponent;
  @ViewChild('endDayDom') endDayDom: DxDateBoxComponent;

  @Input() isHideCourt: boolean = false;
  @Input() isHideCenter: boolean = false;
  @Output() statisticsByYearClicked = new EventEmitter<void>();
  @Output() statisticsByMonthClicked = new EventEmitter<void>();
  @Output() statisticsByTodayClicked = new EventEmitter<void>();
  @Output() statisticsByPointSelectChanged = new EventEmitter<any>();
  @Output() statisticsByCourtSelectChanged = new EventEmitter<any>();
  @Output() statisticsByCustomTimeClicked = new EventEmitter<any>();
  @Output() statisticsByCenterSelectChanged = new EventEmitter<any>();
  constructor(private utilHelper: UtilHelper,
    private statisticsService: StatisticsAnalysisService, private enumService: EnumService,
    private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.getCourts();
    this.getCenters();
    this.initTranslate();
    // this.firstMonthOfYear = new Date(new Date(new Date().setMonth(0)).setDate(1)); // 获取今年的第一天
    // this.firstDayOfMonth = new Date(new Date().setDate(1)); // 获取本月的第一天
    this.statisticsByDate = this.enumService.getList(StatisticsDateType);
    let year = moment(new Date()).format('YYYY');
    let month = moment(new Date()).format('MM');
    this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
    this.maxForStartMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
    this.maxForStartDay = new Date();
  }

  initTranslate() {
    // 设置当前的中心名称
    this.translateService.get('ALL')
      .subscribe(value => {
        this.currentPoint.provinceName = value;
      });

    // 设置当前的法院名称
    this.translateService.get('ALL')
      .subscribe(value => {
        this.currentCourt.courtName = value;
      });

    // 设置当前的法院名称
    this.translateService.get('ALL')
      .subscribe(value => {
        this.currentCenter.name = value;
      });
  }

  /**
   * 年统计按钮事件
   */
  statisticsByYear() {
    this.isByYear = true;
    this.isByMonth = false;
    this.isByToday = false;
    this.isByCustom = false;
    if (this.utilHelper.AssertNotNull(this.statisticsByYearClicked)) {
      this.statisticsByYearClicked.emit();
    }
  }

  /**
   * 月统计按年事件
   */
  statisticsByMonth() {
    this.isByYear = false;
    this.isByMonth = true;
    this.isByToday = false;
    this.isByCustom = false;
    if (this.utilHelper.AssertNotNull(this.statisticsByMonthClicked)) {
      this.statisticsByMonthClicked.emit();
    }
  }
  /**
  * 当日统计按钮事件
  */
  statisticsByToday() {
    this.isByYear = false;
    this.isByMonth = false;
    this.isByToday = true;
    this.isByCustom = false;
    if (this.utilHelper.AssertNotNull(this.statisticsByTodayClicked)) {
      this.statisticsByTodayClicked.emit();
    }
  }


  /**
    * 获取法院名称
    *
    * @private
    */
  private async getCourts() {
    let result = await this.statisticsService.getCourtOffices();
    if (this.utilHelper.AssertNotNull(result)) {
      this.courts = result;
    }
  }
  /**
   * 获取采集点列表
   * @private
   * @memberof StatisticsDimensionComponent
   */
  private async getCenters() {
    let result = await this.statisticsService.getFrontOffices();
    if (this.utilHelper.AssertNotNull(result)) {
      this.centers = result;
    }
  }

  /**
   * 采集点选择项发生改变的时候事件
   * @param e
   */
  pointSelectChanged(e) {
    if (this.utilHelper.AssertNotNull(this.statisticsByPointSelectChanged)) {
      this.statisticsByPointSelectChanged.emit(e);
    }
  }

  /**
   * 选择法院发生改变时事件
   */
  courtSelectChanged(e) {
    if (this.utilHelper.AssertNotNull(this.statisticsByCourtSelectChanged)) {
      this.statisticsByCourtSelectChanged.emit(e);
    }
  }

  /**
 * 选择中心发生改变时事件
 */
  centerSelectChanged(e) {
    if (this.utilHelper.AssertNotNull(this.statisticsByCenterSelectChanged)) {
      this.statisticsByCenterSelectChanged.emit(e);
    }
  }
  /**
   * 展示自定义时间的popup
   */
  showCustomTimePopup() {
    this.isByYear = false;
    this.isByMonth = false;
    this.isByToday = false;
    this.isByCustom = true;
    this.customTimeVisible = true;
    this.yearStatistics = true;
    this.monthStatistics = true;
    this.dayStatistics = true;
    this.statisticsDateType = null;
    this.searchBtn = true;
  }


  /**
  * 关闭自定义时间的popup
  */
  closeCustomTimePopup() {
    this.customTimeVisible = false;
  }

  /**
   * 自定义时间统计
   */
  statisticsByCustomTime() {
    if (this.utilHelper.AssertNotNull(this.statisticsByCustomTimeClicked)) {
      this.statisticsByCustomTimeClicked.emit({});
    }
  }

  /**
   * 通过选择select值，显示对应的时间选择框
   */

  // 选择自定义查询时间类型
  selectedIndexOfDateType(e) {
    // this.searchBtn = false;
    // this.customEndTimeByYear = this.customEndTimeByMonth = this.customEndTimeByDay;
    // this.statisticsDateType = e.selectedItem.value;
    if (this.statisticsDateType === 0) {
      this.yearStatistics = false;
      this.monthStatistics = true;
      this.dayStatistics = true;
    }
    if (this.statisticsDateType === 1) {
      this.yearStatistics = true;
      this.monthStatistics = false;
      this.dayStatistics = true;
    }
    if (this.statisticsDateType === 2) {
      this.yearStatistics = true;
      this.monthStatistics = true;
      this.dayStatistics = false;
    }
    // this.clearStatisticsSearchTime();
    this.setSearchButtonDisable();
  }

  /**
   * 自定义时间点击查询按钮
   */
  countByCustomTime() {
    let custonTime = this.getCustomTime();
    this.statisticsByCustomTimeClicked.emit(custonTime);
    this.closeCustomTimePopup();
    this.isByYear = false;
    this.isByMonth = false;
    this.isByToday = false;
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



  popupHidden() {
    this.startYearDom.instance.reset();
    this.endYearDom.instance.reset();
    this.startMonthDom.instance.reset();
    this.endMonthDom.instance.reset();
    this.startDayDom.instance.reset();
    this.endDayDom.instance.reset();
    this.firstDayOfMonth = null;
    this.minForStartDay = null;
    this.now = new Date();
    this.maxForStartDay = new Date();
  }
  timeChanged(e) {
    if (this.utilHelper.AssertNotNull(this.statisticsDateType)) {
      let custonTime = this.getCustomTime();
      if (this.utilHelper.AssertNotNull(custonTime.start && custonTime.end && custonTime.type)) {
        this.searchBtn = false;
      } else {
        this.searchBtn = true;
      }

      // 按年查询
      if (custonTime.type === 3) {
        let nowForYear = moment(new Date()).format('YYYY');
        if (this.utilHelper.AssertNotNull(custonTime.start)) {
          this.customStartTimeByYear = new Date(new Date(this.customStartTimeByYear.setMonth(0)).setDate(1)); // 获取今年的第一天
        }
        if (this.utilHelper.AssertNotNull(custonTime.end)) {
          let endForYear = moment(this.customEndTimeByYear).format('YYYY');
          let endForMonth = Number(moment(new Date()).format('MM'));
          let endForDay = Number(moment(new Date()).format('DD'));
          if (endForYear === nowForYear) {
            this.customEndTimeByYear = new Date(new Date(new Date(this.customEndTimeByYear).setMonth(endForMonth - 1)).setDate(endForDay));
          } else {
            this.customEndTimeByYear = new Date(new Date(this.customEndTimeByYear.setMonth(11)).setDate(31));
          }
        }
      }

      // 按天查询
      if (custonTime.type === 5) {
        this.firstDayOfMonth = null;
        this.minForStartDay = null;
        this.now = new Date();
        this.maxForStartDay = new Date();
        if (this.utilHelper.AssertNotNull(custonTime.start)) {
          let year = moment(this.customStartTimeByDay).format('YYYY');
          let month = moment(this.customStartTimeByDay).format('MM');
          let monthLastDate: Date = new Date(new Date(custonTime.start).setDate(this.getLastDay(year, month))); // 获取该月的最后一天
          // 该月正好是当年当月 时间不能大于系统当前时间
          this.now = (monthLastDate.getFullYear() === new Date().getFullYear() && monthLastDate.getMonth() === new Date().getMonth()) ?
            (monthLastDate.getTime() < new Date().getTime() ? monthLastDate : new Date()) : monthLastDate;
          if (this.utilHelper.AssertNotNull(this.customEndTimeByDay)) {
            this.maxForStartDay = new Date(new Date(this.customEndTimeByDay).setDate(this.getLastDay(year, month)));
          } else {
            this.minForStartDay = null;
            this.maxForStartDay = new Date();
          }
        }

        if (this.utilHelper.AssertNotNull(custonTime.end)) {
          this.customEndTimeByDay = new Date(moment(this.customEndTimeByDay).format('YYYY-MM-DD' + ' ' + '23:59:59'));
          this.firstDayOfMonth = new Date(new Date(this.customEndTimeByDay).setDate(1)); // 获取当月的第一天
          if (this.utilHelper.AssertNotNull(this.customStartTimeByDay)) {
            this.minForStartDay = new Date(new Date(this.customStartTimeByDay).setDate(1));
            this.maxForStartDay = new Date(new Date(this.customStartTimeByDay).setDate(1));
          } else {
            this.firstDayOfMonth = null;
            this.minForStartDay = new Date(new Date(this.customEndTimeByDay).setDate(1));
            this.now = new Date();
          }
        }

        if (this.utilHelper.AssertEqualNull(custonTime.start) && this.utilHelper.AssertEqualNull(custonTime.end)) {
          this.firstDayOfMonth = null;
          this.minForStartDay = null;
          this.now = new Date();
          this.maxForStartDay = new Date();
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
      if (this.utilHelper.AssertEqualNull(this.customEndTimeByMonth)) { // 无结束时间
        this.minForStartMonth = null;
        this.firstMonthOfYear = null;
        this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
      } else { // 有结束时间
        this.firstMonthOfYear = null;
        this.minForStartMonth = new Date(new Date(new Date(this.customEndTimeByMonth).setMonth(0)).setDate(1));
        this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
      }


      if (this.utilHelper.AssertEqualNull(this.customStartTimeByMonth)) { // 无开始时间
        this.minForStartMonth = null;
        this.firstMonthOfYear = null;
        this.endMonthDom.instance.reset();
        this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
      } else { // 有开始时间
        this.minForStartMonth = null;
        let year = moment(this.customStartTimeByMonth).format('YYYY');
        let month = moment(this.customStartTimeByMonth).format('MM');
        if (year === nowForYear) {
          this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
        } else {
          this.maxForEndMonth = new Date(new Date(new Date(new Date(this.customStartTimeByMonth).setMonth(11))
            .setDate(31)).setHours(0, 0, 0));
        }
      }


      if (this.utilHelper.AssertNotNull(this.customStartTimeByMonth) && this.utilHelper.AssertNotNull(this.customEndTimeByMonth)) {
        // 有开始时间，有结束时间
        let year = moment(this.customEndTimeByMonth).format('YYYY');
        let month = moment(this.customEndTimeByMonth).format('MM');
        if (year === nowForYear) {
          this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
        } else {
          this.maxForEndMonth = new Date(new Date(new Date(this.customEndTimeByMonth).setMonth(11)).
            setDate(31));
        }
        this.minForStartMonth = new Date(new Date(new Date(this.customEndTimeByMonth).setMonth(0)).setDate(1));
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
      if (this.utilHelper.AssertEqualNull(this.customStartTimeByMonth) && this.utilHelper.AssertEqualNull(this.customEndTimeByMonth)) {
        // 无开始时间，无结束时间
        this.minForStartMonth = null;
        this.firstMonthOfYear = null;
        this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
      } else if (this.utilHelper.AssertNotNull(this.customStartTimeByMonth) && this.utilHelper.AssertEqualNull(this.customEndTimeByMonth)) {
        // 有开始时间，无结束时间
        this.minForStartMonth = null;
        let year = moment(this.customStartTimeByMonth).format('YYYY');
        let month = moment(this.customStartTimeByMonth).format('MM');
        if (year === nowForYear) {
          this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
        } else {
          this.maxForEndMonth = new Date(new Date(new Date(new Date(this.customStartTimeByMonth).setMonth(11))
            .setDate(31)).setHours(0, 0, 0));
        }
      } else if (this.utilHelper.AssertEqualNull(this.customStartTimeByMonth) && this.utilHelper.AssertNotNull(this.customEndTimeByMonth)) {
        // 无开始时间，有结束时间
        this.firstMonthOfYear = null;
        this.minForStartMonth = new Date(new Date(new Date(this.customEndTimeByMonth).setMonth(0)).setDate(1));
        this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(nowForYear, nowForMonth)));
      } else if (this.utilHelper.AssertNotNull(this.customStartTimeByMonth) && this.utilHelper.AssertNotNull(this.customEndTimeByMonth)) {
        // 有开始时间，有结束时间
        let year = moment(this.customEndTimeByMonth).format('YYYY');
        let month = moment(this.customEndTimeByMonth).format('MM');
        if (year === nowForYear) {
          this.maxForEndMonth = new Date(new Date().setDate(this.getLastDay(year, month)));
        } else {
          this.maxForEndMonth = new Date(new Date(new Date(this.customEndTimeByMonth).setMonth(11)).
            setDate(31));
        }
        this.minForStartMonth = new Date(new Date(new Date(this.customEndTimeByMonth).setMonth(0)).setDate(1));
      }
      if (this.utilHelper.AssertNotNull(this.customEndTimeByMonth)) {
        let year = moment(this.customEndTimeByMonth).format('YYYY');
        let month = moment(this.customEndTimeByMonth).format('MM');
        if (year === nowForYear && month === nowForMonth) {
          this.customEndTimeByMonth = new Date(moment(new Date()).format('YYYY-MM-DD' + ' ' + '23:59:59'));
        } else {
          this.customEndTimeByMonth = new Date(new Date(new Date(this.customEndTimeByMonth)
            .setDate(this.getLastDay(year, month))).setHours(23, 59, 59));
        }
      }
    }
  }



  private setSearchButtonDisable() {
    if (this.utilHelper.AssertNotNull(this.statisticsDateType)) {
      let custonTime = this.getCustomTime();
      if (this.utilHelper.AssertNotNull(custonTime.start && custonTime.end && custonTime.type)) {
        this.searchBtn = false;
      } else {
        this.searchBtn = true;
      }
    }
  }

  private getCustomTime(): any {
    let start: Date;
    let end: Date;
    let type: StatisticsType;
    switch (this.statisticsDateType) {
      case StatisticsDateType.searchByYear:
        start = this.customStartTimeByYear;
        end = this.customEndTimeByYear;
        type = StatisticsType.customYear;
        break;
      case StatisticsDateType.searchByMonth:
        start = this.customStartTimeByMonth;
        end = this.customEndTimeByMonth;
        type = StatisticsType.customMonth;
        break;
      case StatisticsDateType.searchByDay:
        start = this.customStartTimeByDay;
        end = this.customEndTimeByDay;
        type = StatisticsType.customDay;
        break;
    }
    return {
      start: start,
      end: end,
      type: type
    };
  }
}

