import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { StatisticsAnalysisService } from '../common/statistics-analysis.service';
// import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import * as echarts from 'echarts';
import { StatisticsCrimeService } from './statistics-crime.service';
import { UtilHelper, EventAggregator, NumberConvertService } from '../../core';
import { StatisticsType } from '../../enum';
import { CrimeNoticeStatisticsMapper } from '../common/mapper/crime-notice-statistics.mapper';
import * as moment from 'moment';
import { asEnumerable } from 'linq-es2015';
import { ReportCrimeParamModel, CrimeCourtStatistics } from '../../model';

/**
 * 犯罪公告统计
 * @export
 * @class StatisticsCrimeComponent
 * @implements {OnInit, OnDestroy}
 */
@Component({
  templateUrl: './statistics-crime.component.html',
  providers: [StatisticsAnalysisService, StatisticsCrimeService, CrimeNoticeStatisticsMapper]
})
export class StatisticsCrimeComponent implements OnInit, OnDestroy {
  /**
   * 声明echars初始化变量
   */
  private quantityChart: any;
  // 选中的采集点
  selectedFrontOffice = { name: '', id: '', code: '' };
  // 默认的采集点
  defaultFrontOffice = { name: '', id: '', code: '' };
  customStartTime: any;
  customEndTime: any;
  currentSelectCenters = [];
  // 响应式标题
  translates = [];
  /**
   * 表格数据
   */
  dataSource: any;
  grandTotal: string;
  queryInfo: ReportCrimeParamModel;
  /**
   * 所有法院
   */
  courts: CrimeCourtStatistics[];
  stationCode: string = '';
  totalText: string = '{0} total';
  /**
   * 下拉选框的图标
   */
  // searchIcon: string = '<i class="fa fa-angle-down fa-2x"></i>';
  loadingVisible: boolean = false;
  export: string;
  titleData: string;
  // noData: string = '';
  centerString: string;
  dateString: string;
  private currentStatisticsType: StatisticsType = StatisticsType.currentDay;
  @ViewChild('CrimequantityStatisticsDiv') quantityDiv: ElementRef;
  constructor(
    private statisticsCrimeService: StatisticsCrimeService,
    private utilHelper: UtilHelper,
    private translateService: TranslateService,
    private numberConvertService: NumberConvertService,
    private eventAggregator: EventAggregator
  ) {
    this.queryInfo = new ReportCrimeParamModel();
    this.export = this.utilHelper.formatString(this.translates['export']);

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
      let translateKeys = ['year', 'month', 'day', 'somecourt', 'crimenotice-statistics-chart',
        'statistics', 'total', 'statistics-crime', 'export', 'item', 'switch to line chart',
        'switch to bar chart', 'save as images', 'reduction', 'search no data', 'ALL', 'notice items', 'total items'];
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

  /**
   * echart初始化
   */
  private async initCharts() {
    try {
      if (this.quantityDiv) {
        this.quantityChart = echarts.init(this.quantityDiv.nativeElement);
      }
      this.getPieChartTitle(true);

      // this.noData = this.utilHelper.formatString(this.translates['search no data']);
      await Promise.all([
        await this.bindDateCenterChart()
      ]);
    } catch (error) {
      console.log(error);
    }

  }


  /**
   * 获取法院名称
   *
   * @private
   */
  private async getCourts() {
    try {
      let result = await this.statisticsCrimeService.getCourtOffices();
      if (this.utilHelper.AssertNotNull(result)) {
        this.courts = [{ id: '', name: this.translates['ALL'], code: '', codeType: '', createTime: '' }];
        this.courts = this.courts.concat(result);
      }
    } catch (error) {
      console.log(error);
    }

  }
  /**
  * 点击当日按钮
  */
  public statisticsQuantityByToday(date) {
    this.currentStatisticsType = StatisticsType.currentDay;
    this.queryInfo = new ReportCrimeParamModel();
    this.queryInfo.courtId = this.stationCode;
    this.quantityChart.clear();
    echarts.dispose(this.quantityChart);
    this.initCharts();
  }


  /**
   *
   * @param date 点击当年按钮
   */
  public statisticsQuantityByYear(date) {
    this.currentStatisticsType = StatisticsType.currentYear;
    this.queryInfo.dateType = 0;
    this.queryInfo.courtId = this.stationCode;
    this.quantityChart.clear();
    echarts.dispose(this.quantityChart);
    this.initCharts();
  }

  /**
   * 点击月份按钮
   * @memberof StatisticsSystemUseInfoComponent
   */
  public statisticsQuantityByMonth(date) {
    this.currentStatisticsType = StatisticsType.currentMonth;
    this.queryInfo.dateType = 1;
    this.queryInfo.courtId = this.stationCode;
    this.quantityChart.clear();
    echarts.dispose(this.quantityChart);
    this.initCharts();
  }


  /**
   * 获得焦点清空法院的value
   */
  inputSearch(e) {
    this.stationCode = '';
  }

  /**
   * 点击查询
   */
  searchSistic() {
    this.queryInfo.courtId = this.stationCode;
    this.initCharts();
  }


  /**
  * 点击自定义时间查询
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
    this.queryInfo.courtId = this.stationCode;
    this.quantityChart.clear();
    echarts.dispose(this.quantityChart);
    this.initCharts();
  }
  /**
   * 绑定日期中心的柱状图
   */
  private async bindDateCenterChart() {
    try {
      let legendData = [this.utilHelper.formatString(this.translates['notice items'])];
      let seriesData: any[] = [{
        data: [],
        type: 'bar',
        name: this.utilHelper.formatString(this.translates['notice items'])
      }];
      let xAxisData: any = [];
      let data = await this.getCenterAllDate();
      let titleData = this.getPieChartTitle(true);
      this.titleData = titleData;
      if (this.utilHelper.AssertNotNull(data) && data.length > 0) {
        xAxisData = this.utilHelper.distinct(data.map(m => m.coord_X));
        let data1 = [];
        /**
         * 遍历所有同采集点的count并求和
         */
        xAxisData.forEach((item, index) => {
          data1[index] = asEnumerable(data).Where(x => x.coord_X === item).Select(x => Number(x.count)).Sum();
        });
        if (this.utilHelper.AssertNotNull(this.stationCode) && this.stationCode.length > 0) {
          legendData = asEnumerable(data).Select(item => item.coord_Y).Distinct().ToArray();
          seriesData[0].name = legendData[0];
        } else {
          legendData = [this.utilHelper.formatString(this.translates['notice items'])];
          seriesData[0].name = this.utilHelper.formatString(this.translates['notice items']);
        }
        if (this.utilHelper.AssertNotNull(data1) && data1.length > 0) {
          data1.forEach(item => {
            let seriesObj = {
              value: item
            };
            seriesData[0].data.push(seriesObj);
          });
        }
      }
      this.bindRecChart(this.quantityChart, xAxisData, seriesData, titleData, legendData);
    } catch (error) {
      console.log(error);
    }
  }



  /**
   * 柱状图配置
   */
  private bindRecChart(chart: any, xAxisData: any, seriesData: any, titleData: any, legendData: any) {
    // 折线图数据源
    let options = {
      title: {
        text: this.translates['crimenotice-statistics-chart'],
        subtext: this.dateString + ' ' + this.centerString,
        x: 'center',
        y: 'top',
        textStyle: {
          fontSize: 16,
          fontFamily: 'Microsoft YaHei'
        }
      },
      legend: {
        data: legendData,
        top: 30,
        show: true,
        left: '13%'
      },
      color: [this.getRandomColor()],
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
          end: 30,
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
        name: this.utilHelper.formatString(this.translates['item']),
        axisLabel: {
          formatter: this.numberConvertService.convert // 纵轴
        },
        minInterval: 1
      },
      series: seriesData
    };
    if (chart) {
      // 创建图表
      chart.clear();
      chart.setOption(options);

    }
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
      data = await this.statisticsCrimeService.getStatisticsData(this.queryInfo);
      this.loadingVisible = false;
      if (this.utilHelper.AssertEqualNull(data)) {
        data = [];
      }
      if (this.utilHelper.AssertNotNull(data) && data.length > 0) {
        asEnumerable(data).ToArray().forEach(item => {
          item.year = moment(new Date(item.coord_Y)).format('YYYY') + this.translates['year'];
          item.month = moment(new Date(item.coord_Y)).format('MM') + this.translates['month'];
          item.day = moment(new Date(item.coord_Y)).format('DD') + this.translates['day'];
          if (item.count === 0) {
            item.count = null;
          }
        });
        if (this.utilHelper.AssertNotNull(this.stationCode) && this.stationCode.length > 0) {
          asEnumerable(data).ToArray().forEach(item => {
            item.year = moment(new Date(item.coord_X)).format('YYYY') + this.translates['year'];
            item.month = moment(new Date(item.coord_X)).format('MM') + this.translates['month'];
            item.day = moment(new Date(item.coord_X)).format('DD') + this.translates['day'];
            if (item.count === 0) {
              item.count = null;
            }
          });
        }
      }
      this.dataSource = {
        fields: [
          {
            width: 120,
            dataField: 'coord_X',
            dataType: 'string',
            caption: this.utilHelper.formatString(this.translates['statistics-crime']),
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
      this.grandTotal = this.utilHelper.formatString(this.translates['total items']);
      if (this.utilHelper.AssertNotNull(this.stationCode)) {
        this.dataSource.fields[0].dataField = 'coord_Y';
      }
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
   * 获取上部分标题
   */
  private getPieChartTitle(isShowCenter: boolean = true, currentDayTime?: any) {
    let dateString = '';
    switch (this.currentStatisticsType) {
      case StatisticsType.currentYear:
        dateString = new Date().getFullYear().toString() + this.translates['year'];
        break;
      case StatisticsType.currentMonth:
        dateString = moment(new Date()).format('YYYY') + this.translates['year']
          + moment(new Date()).format('MM') + this.translates['month'];
        break;
      case StatisticsType.customYear:
        dateString = moment(this.customStartTime).format('YYYY') + this.translates['year']
          + '-' + moment(this.customEndTime).format('YYYY') + this.translates['year'];
        break;
      case StatisticsType.customMonth:
        dateString = moment(this.customStartTime).format('YYYY') + this.translates['year']
          + moment(this.customStartTime).format('MM') + this.translates['month']
          + '-' + moment(this.customEndTime).format('YYYY') + this.translates['year']
          + moment(this.customEndTime).format('MM') + this.translates['month'];
        break;
      case StatisticsType.customDay:
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
        if (this.stationCode) { // 判断是否选中法院
          centerString = asEnumerable(this.courts).Where(x => x.id === this.stationCode).Select(x => x.name).ToArray().toString();
        } else {
          centerString = this.translates['ALL'];
        }
      } else {
        if (this.stationCode) { // 判断是否选中法院
          centerString = asEnumerable(this.courts).Where(x => x.id === this.stationCode).Select(x => x.name).ToArray().toString();
        } else {
          centerString = this.translates['somecourt'];
        }
      }
    } else {
      centerString = this.translates['ALL'];
    }
    this.centerString = centerString;
    this.dateString = dateString;
    let title = this.utilHelper.formatString(this.translates['crimenotice-statistics-chart'], centerString, dateString);
    return title;
  }

  /**
  * 获取随机颜色
  */
  private getRandomColor() {
    let colorArr = ['#0275d8'];
    return colorArr[Math.floor(Math.random() * colorArr.length)];
  }

  /**
  * 下拉选框关闭
  */
  /*  public selectClose() {
        this.searchIcon = '<i class="fa fa-angle-down fa-2x"></i>';
    }*/

  /**
  * 下拉选框打开
  */
  /* public selectOpen() {
       this.searchIcon = '<i class="fa fa-angle-up fa-2x"></i>';
   }*/
  /**
  * 浏览器窗口尺寸改变时，调整图表尺寸
  *
  */
  public onResize(event) {
    if (this.quantityChart != null && this.quantityChart !== undefined
    ) {
      this.quantityChart.resize();
    }

  }

  ngOnInit(): void {
    // 获取默认的采集点(全国)
    this.translateService.get('ALL').subscribe(value => {
      this.defaultFrontOffice.name = value;
      this.defaultFrontOffice.id = '';
      this.selectedFrontOffice.name = value;
      this.selectedFrontOffice.id = '';
    });
    this.initTranslate().then(result => {
      this.getCourts();
      this.initCharts();
    }).catch(err => {
      console.log(err);
    });
    // 路由信息
    this.bindRoutUrl('StatisticalAnalysis', 'CrimeNoticeStatistics');
  }

  /**
* 组件释放
*/
  ngOnDestroy(): void {
    this.quantityChart.clear();
    echarts.dispose(this.quantityChart);
  }

}

