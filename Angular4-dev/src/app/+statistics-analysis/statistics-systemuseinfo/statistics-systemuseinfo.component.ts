import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { StatisticsAnalysisService } from '../common/statistics-analysis.service';
// import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import * as echarts from 'echarts';
import { StatisticsSystemUseInfoService } from './statistics-systemuseinfo.service';
import { EventAggregator, UtilHelper, NumberConvertService } from '../../core';
import { StatisticsType } from '../../enum';
import { SystemUseStatisticsMapper } from '../common/mapper/system-use-statistics.mapper';
import { CrimeNoticeStatisticsMapper } from '../common/mapper/crime-notice-statistics.mapper';
import { ReportCrimeParamModel } from '../../model';
import * as moment from 'moment';
import { asEnumerable } from 'linq-es2015';
// import { SystemUseStatistics } from '../../../model';

/**
 * 系统使用情况统计
 */
@Component({
  templateUrl: './statistics-systemuseinfo.component.html',
  providers: [StatisticsAnalysisService, StatisticsSystemUseInfoService, SystemUseStatisticsMapper, CrimeNoticeStatisticsMapper]
})
export class StatisticsSystemUseInfoComponent implements OnInit, OnDestroy {
  /**
   * 声明echars初始化变量
   */
  systemUseStatisticsChart: any;
  @ViewChild('SystemUseStatisticsDiv') systemUseStatisticsDiv: ElementRef;
  options: any;
  dataSource: any;
  totalText: string = '{0} total';
  currentStatisticsType: StatisticsType = StatisticsType.currentDay;
  /**
   * 响应式标题
   */
  translates = [];
  customStartTime: any;
  customEndTime: any;
  currentSelectCenters = [];
  /**
   * 定义当前点击选择类型
   */
  currentStatisticsClickType: StatisticsType;
  queryInfo: ReportCrimeParamModel;
  grandTotal: string;
  loadingVisible: boolean = false;
  export: string;
  titleData: string;
  noData: string;
  centerString: string;
  dateString: string;
  constructor(
    private statisticsSystemUseInfoService: StatisticsSystemUseInfoService,
    private utilHelper: UtilHelper,
    private translateService: TranslateService,
    private numberConvertService: NumberConvertService,
    private eventAggregator: EventAggregator
  ) {
    this.queryInfo = new ReportCrimeParamModel();
    this.export = this.utilHelper.formatString(this.translates['export']);
  }



  /**
  * 浏览器窗口尺寸改变时，调整图表尺寸
  *
  * @param {any} event
  */
  public onResize(event) {
    if (this.systemUseStatisticsChart != null && this.systemUseStatisticsChart !== undefined
    ) {
      this.systemUseStatisticsChart.resize();
    }

  }

  /**
* echart初始化
*/
  private async initCharts() {
    if (this.systemUseStatisticsDiv) {
      this.systemUseStatisticsChart = echarts.init(this.systemUseStatisticsDiv.nativeElement);
    }
    this.getPieChartTitle(true);
    this.noData = this.utilHelper.formatString(this.translates['no data']);
    await Promise.all([
      await this.bindDateCenterChart(),
    ]);
  }


  /**
   *
   * @param date 点击年份按钮
   */
  public statisticsQuantityByYear(date) {
    this.currentStatisticsType = StatisticsType.currentYear;
    this.queryInfo.dateType = 0;
    this.systemUseStatisticsChart.clear();
    echarts.dispose(this.systemUseStatisticsChart);
    this.initCharts();
  }

  /**
   * 点击月份按钮
   * @memberof StatisticsSystemUseInfoComponent
   */
  public statisticsQuantityByMonth(date) {
    this.currentStatisticsType = StatisticsType.currentMonth;
    this.queryInfo.dateType = 1;
    this.systemUseStatisticsChart.clear();
    echarts.dispose(this.systemUseStatisticsChart);
    this.initCharts();
  }

  /**
   * 点击当日按钮
   */
  statisticsQuantityByToday(date) {
    this.currentStatisticsType = StatisticsType.currentDay;
    this.queryInfo = new ReportCrimeParamModel();
    this.systemUseStatisticsChart.clear();
    echarts.dispose(this.systemUseStatisticsChart);
    this.initCharts();
  }
  /**
   * 点击查询
   * @param {any} date
   */
  public statisticsQuantitByCustomTime(data) {
    this.queryInfo = new ReportCrimeParamModel();
    this.queryInfo.dateType = data.type;
    this.currentStatisticsType = data.type;
    this.customStartTime = data.start;
    this.customEndTime = data.end;
    this.queryInfo.startDate = moment(data.start).format('YYYY-MM-DD HH:mm:ss');
    this.queryInfo.endDate = moment(data.end).format('YYYY-MM-DD HH:mm:ss');
    this.systemUseStatisticsChart.clear();
    echarts.dispose(this.systemUseStatisticsChart);
    this.initCharts();
  }

  /**
  * 路由绑定header路径
  */
  private bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }


  /**
  * 初始化词条
  */
  initTranslate(): Promise<any> {
    return new Promise((r, j) => {
      let translateKeys = ['year', 'month', 'day', 'somecourt', 'systemuseinfo-statistics-chart',
        'total', 'practical minutes', 'statistics', 'year', 'month', 'day', 'export', 'minutes', 'switch to line chart',
        'switch to bar chart', 'save as images', 'reduction', 'no data', 'total minutes'];
      this.translateService.get(translateKeys).toPromise().then(values => {
        translateKeys.forEach((key) => {
          this.translates[key] = values[key];
        });
        r(this.translates);
      });
    });
  }

  /**
   * 获取上部分标题
   */
  private getPieChartTitle(isShowCenter: boolean = true, currentDayTime?: any) {
    let dateString = '';
    switch (this.currentStatisticsType) {
      case StatisticsType.currentYear: // 当年 0
        dateString = new Date().getFullYear().toString() + this.translates['year'];
        break;
      case StatisticsType.currentMonth: // 当月 1
        dateString = moment(new Date()).format('YYYY') + this.translates['year']
          + moment(new Date()).format('MM') + this.translates['month'];
        break;
      case StatisticsType.customYear: // 自定义年 3
        dateString = moment(this.customStartTime).format('YYYY') + this.translates['year']
          + '-' + moment(this.customEndTime).format('YYYY') + this.translates['year'];
        break;
      case StatisticsType.customMonth: // 自定义月 4
        dateString = moment(this.customStartTime).format('YYYY') + this.translates['year']
          + moment(this.customStartTime).format('MM') + this.translates['month']
          + '-' + moment(this.customEndTime).format('YYYY') + this.translates['year']
          + moment(this.customEndTime).format('MM') + this.translates['month'];
        break;
      case StatisticsType.customDay: // 自定义日 5
        dateString = moment(this.customStartTime).format('YYYY') + this.translates['year']
          + moment(this.customStartTime).format('MM') + this.translates['month']
          + moment(this.customStartTime).format('DD') + this.translates['day']
          + '-' + moment(this.customEndTime).format('YYYY') + this.translates['year']
          + moment(this.customEndTime).format('MM') + this.translates['month']
          + moment(this.customEndTime).format('DD') + this.translates['day'];
        break;
      case StatisticsType.currentDay:
        if (!currentDayTime) {
          dateString = moment(new Date()).format('YYYY') + this.translates['year']
            + moment(new Date()).format('MM') + this.translates['month']
            + moment(new Date()).format('DD') + this.translates['day'];
        } else {
          let currentDayTimeArr = currentDayTime.split('-');
          dateString = currentDayTimeArr[0] + this.translates['year'] +
            (currentDayTimeArr[1] ? (currentDayTimeArr[1]) + this.translates['month'] : '') +
            (currentDayTimeArr[2] ? (currentDayTimeArr[2]) + this.translates['day'] : '');
        }
    }
    let centerString = '';
    if (isShowCenter) {
      if (this.currentSelectCenters.length === 0) {
        centerString = this.translates['ALL'];
      } else {
        centerString = this.translates['somecourt'];
      }
    } else {
      centerString = this.translates['ALL'];
    }
    this.centerString = centerString;
    this.dateString = dateString;
    let title = this.utilHelper.formatString(this.translates['systemuseinfo-statistics-chart'], dateString, centerString);
    return title;
  }

  /**
   * 获取随机颜色
   */
  getRandomColor() {
    let colorArr = ['#0275d8'];
    return colorArr[Math.floor(Math.random() * colorArr.length)];
  }
  /**
   * 绑定日期中心的矩形图
   */
  private async bindDateCenterChart() {
    let seriesData: any[] = [{
      data: [],
      type: 'bar',
      name: this.utilHelper.formatString(this.translates['practical minutes'])
    }];
    let xAxisData: any = [];
    let data = await this.getCenterAllDate();
    let titleData = this.getPieChartTitle(true);
    this.titleData = titleData;
    if (this.utilHelper.AssertNotNull(data) && data.length > 0) {
      xAxisData = this.utilHelper.distinct(data.map(m => m.coord_X));
      // let data1 = this.utilHelper.distinct(data.map(item => item.count));
      let data1 = [];
      /**
       * 遍历所有同采集点的count并求和
       */
      xAxisData.forEach((item, index) => {
        data1[index] = asEnumerable(data).Where(x => x.coord_X === item).Select(x => Number(x.count)).Sum();
      });
      if (this.utilHelper.AssertNotNull(data1) && data1.length > 0) {
        data1.forEach(item => {
          let seriesObj = {
            value: item,
            /* itemStyle: {
                 normal: {
                     color: this.getRandomColor()
                 }
             },*/
          };
          seriesData[0].data.push(seriesObj);
        });
      }
    }
    this.bindRecChart(this.systemUseStatisticsChart, xAxisData, seriesData, titleData);
  }



  /**
   * 获取数据
   * 当年---0
   * 当月----1
   * 自定义年----3
   * 自定义月----4
   * 自定义日----5
   * 当日----null 或2
   */
  private async getCenterAllDate() {
    let data: any[] = [];
    this.loadingVisible = true;
    try {
      data = await this.statisticsSystemUseInfoService.getStatisticsData(this.queryInfo);
      this.loadingVisible = false;
      if (this.utilHelper.AssertEqualNull(data)) {
        data = [];
      }
      if (this.utilHelper.AssertNotNull(data) && data.length > 0) {
        // 数组补0
        // let x_Arr = asEnumerable(data).Select(item => item.coord_X).Distinct().ToArray();
        /* let y_Arr = asEnumerable(data).Select(item => item.coord_Y).Distinct().ToArray();
         let suppment_Zero_Arr = [];
         data.forEach(itemData => {
             y_Arr.forEach(itemY => {
                 if (itemData.coord_Y !== itemY) {
                     let suppment_Zero_Obj = JSON.parse(JSON.stringify(itemData));
                     suppment_Zero_Arr.push(suppment_Zero_Obj);
                 }
             });
         });
         console.log(suppment_Zero_Arr);
         // console.log(x_Arr);
          console.log(y_Arr);
          console.log(data);*/
        data.forEach((item, index) => {
          item.year = moment(new Date(item.coord_Y)).format('YYYY') + this.translates['year'];
          item.month = moment(new Date(item.coord_Y)).format('MM') + this.translates['month'];
          item.day = moment(new Date(item.coord_Y)).format('DD') + this.translates['day'];
          item.count = Number(item.count);
          if (item.count === 0) {
            item.count = null;
          }
        });
      }
      this.dataSource = {
        fields: [
          {
            width: 240,
            dataField: 'coord_X',
            caption: this.utilHelper.formatString(this.translates['statistics']),
            area: 'row',
            sortOrder: '',
            sortingMethod: () => {
              return '';
            }
          }, {
            dataField: 'year',
            dataType: 'string',
            area: 'column'
          }, {
            dataField: 'month',
            dataType: 'string',
            area: 'column'
          }, {
            dataField: 'day',
            dataType: 'string',
            area: 'column'
          }, {
            dataField: 'count',
            dataType: 'number',
            summaryType: 'sum',
            area: 'data',
          }],
        store: data
      };
      this.grandTotal = this.utilHelper.formatString(this.translates['total minutes']);
      switch (this.queryInfo.dateType) {
        case 0:    // 当年的数据统计
          this.dataSource.fields.splice(1, 1);
          this.dataSource.fields.splice(2, 1);
          break;
        case 1: // 当月的数据
          this.dataSource.fields.splice(1, 2);
          break;
        case 3: // 自定义年
          this.dataSource.fields.splice(2, 2);
          break;
        case 4: // 自定义月
          this.dataSource.fields.splice(1, 1);
          this.dataSource.fields.splice(2, 1);
          break;
        case 5: // 自定义日
          this.dataSource.fields.splice(1, 2);
          break;
        default:
          this.dataSource.fields.splice(1, 3);

      }
    } catch (error) {
      console.log(error);
    }
    return data;
  }



  /**
   * 绑定矩形图
   */
  bindRecChart(chart: any, xAxisData: any, seriesData: any, titleData: any) {
    // 折线图数据源
    let options = {
      title: {
        text: this.translates['systemuseinfo-statistics-chart'],
        subtext: this.dateString,
        x: 'center',
        y: 'top',
        textStyle: {
          fontSize: 16,
          fontFamily: 'Microsoft YaHei'
        }
      },
      color: [this.getRandomColor()],
      legend: {
        data: [this.utilHelper.formatString(this.translates['practical minutes'])],
        top: 30,
        show: true,
        left: '13%'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
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
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 35,
          showDetail: false,
          zoomLock: true
        }, {
          type: 'inside',
          start: 0,
          end: 35,
          showDetail: false,
          zoomLock: true
        }
      ],
      grid: [
        {

        }, {
          left: '8%',
          right: '8%',
          bottom: '10%',
          containLabel: true
        }],
      xAxis: {
        type: 'category',
        boundaryGap: true,
        gridIndex: 1,
        data: xAxisData, // 横轴
        max: (value) => {
          return value.max - 10;
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
        nameLocation: 'center',
      },
      yAxis: {
        type: 'value',
        gridIndex: 1,
        name: this.utilHelper.formatString(this.translates['minutes']),
        axisLabel: {
          formatter: this.numberConvertService.convert // 纵轴
        }
      },
      series: seriesData,
    };
    if (chart) {
      // 创建图表
      chart.clear();
      chart.setOption(options);

    }
  }

  ngOnInit(): void {
    // 路由信息
    this.bindRoutUrl('StatisticalAnalysis', 'systemusestatistics');
    this.initTranslate().then(result => {
      this.initCharts();
    });

  }


  /**
   * 组件释放
   */
  ngOnDestroy(): void {
    this.systemUseStatisticsChart.clear();
    echarts.dispose(this.systemUseStatisticsChart);
  }


}

