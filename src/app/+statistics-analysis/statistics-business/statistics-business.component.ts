import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { asEnumerable } from 'linq-es2015';
import * as echarts from 'echarts';
import * as moment from 'moment';

import { EnumInfo } from '../../enum';
import {
  // TypeConvertService,
  // LevelConvertService,
  NumberConvertService,
  EventAggregator,
  UtilHelper,
} from '../../core';
import { StatisticsBusinessService, BusinessQueryInfo, DataList } from './statistics-business.service';
import { StatisticsAnalysisService } from '../common/statistics-analysis.service';
import { CrimeNoticeStatisticsMapper } from '../common/mapper/crime-notice-statistics.mapper';
import { StatisticsDimensionComponent } from '../common/statistics-dimension/statistics-dimension.component';

/**
 * 业务办理情况统计
 *
 * @export
 * @class BusinessStatisticsComponent
 * @implements {OnInit}
 */
@Component({
  templateUrl: './statistics-business.component.html',
  providers: [StatisticsBusinessService, EnumInfo, StatisticsAnalysisService, CrimeNoticeStatisticsMapper]
})
export class StatisticsBusinessComponent implements OnInit, OnDestroy {
  centerName: string = '';
  titleData: string;

  averageTimeEnum: any[];
  auditResultEnum: any[];
  applyResultEnum: any[];
  applyTypeEnum: any;

  applyPurposeList: any;
  dataSource: any;
  seriesData: any[] = [];

  applyTypeVisible: boolean = true;
  CenterVisible: boolean = true;
  applyPurposeVisible: boolean = true;
  applyResultVisible: boolean = true;
  auditResultVisible: boolean = true;
  AverageTimeVisible: boolean = true;

  colorBar: string;

  @ViewChild('businessStatisticsChartDiv') businessStatisticsChartDiv: ElementRef;
  @ViewChild(StatisticsDimensionComponent) statisticsDimensionComponent: StatisticsDimensionComponent;


  private businessStatisticsChart: any;

  // 是否按年统计/按月统计
  isCountByDate: string = 'day';

  // 词条数组
  translates: any = [];

  // 选中按钮的样式
  public isCountByYear: boolean = false;
  public isCountByMonth: boolean = false;
  public isCountByCustom: boolean = false;
  public isCountByday: boolean = false;

  // 查询model
  businessQueryInfo: BusinessQueryInfo;

  /**
   * 业务办理情况柱状图标题
   */
  businessStatisticsChartTitle: string;

  // 中心名称、中心编码关联表
  centerCodeList: any[] = [];

  dimensionFlag: string;


  // 模拟采集点数据
  chooseForDisplay: string;
  statisticsByDate: any[] = [];

  // 列表数据提示
  nodata: string;
  grandTotal: string;

  constructor(
    private statisticsBusinessService: StatisticsBusinessService,
    private statisticsAnalysisService: StatisticsAnalysisService,
    // private typeConvertService: TypeConvertService,
    // private levelConvertService: LevelConvertService,
    private numberConvertService: NumberConvertService,
    private translateService: TranslateService,
    private utilHelper: UtilHelper,
    private eventAggregator: EventAggregator,
    public enumInfo: EnumInfo,
  ) {
    this.businessQueryInfo = new BusinessQueryInfo();

    this.applyTypeEnum = this.enumInfo.getApplyTypeEnum;
    this.applyResultEnum = this.enumInfo.getStatisticsApplyResultEnum;
    this.auditResultEnum = this.enumInfo.getStatisticsAuditResultEnum;
    this.averageTimeEnum = this.enumInfo.getStatisticsAverageTimeEnum;
  }

  ngOnInit(): void {
    // 初始化服务基地址，获取采集点信息，默认按年统计
    this.statisticsBusinessService.initialCrmsService()
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.initCharts();
          this.getApplyPurposeList();
          this.countByDay();
        }
      }).catch(err => {
        console.log(err);
      });

    this.statisticsAnalysisService.initialOrganizationService()
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.getCenterCodeList();
        }
      }).catch(err => {
        console.log(err);
      });

    this.typeAndCenterDimension('typeAndCenter');

    // 缓存路由
    sessionStorage.setItem('currentRouter', 'BusinessStatistics');
    // 路由信息
    this.bindRoutUrl('StatisticalAnalysis', 'BusinessStatistics');

    // 初始化词条
    this.initTranslate().then(() => {
      this.nodata = this.translates['search no data'];
      this.grandTotal = this.translates['total'] + '(' + this.translates['secondary'] + ')';
    });
    // 为查询条件赋默认值
    this.clearQueryInfo();
  }


  /**
   * 维度一：申请类型和所在地条件查询
   */
  typeAndCenterDimension(e) {
    this.applyTypeVisible = false;
    this.CenterVisible = false;
    this.applyPurposeVisible = true;
    this.AverageTimeVisible = true;
    this.applyResultVisible = true;
    this.auditResultVisible = true;

    this.colorBar = '#0275d8';
    this.dimensionFlag = e;
    this.clearQueryInfo();
    this.loadAndSetOption();
  }
  /**
   * 维度二：申请类型和所在地条件查询
   */
  typeAndPurposeDimension(e) {
    this.applyTypeVisible = false;
    this.applyPurposeVisible = false;
    this.CenterVisible = true;
    this.AverageTimeVisible = true;
    this.applyResultVisible = true;
    this.auditResultVisible = true;

    this.colorBar = '#5cb85c';
    this.dimensionFlag = e;
    this.clearQueryInfo();
    this.loadAndSetOption();
  }
  /**
   * 维度三：申请目的和所在地条件查询
   */
  purposeAndCenterDimension(e) {
    this.applyPurposeVisible = false;
    this.CenterVisible = false;
    this.applyTypeVisible = true;
    this.AverageTimeVisible = true;
    this.applyResultVisible = true;
    this.auditResultVisible = true;

    this.colorBar = '#5bc0de';
    this.dimensionFlag = e;
    this.clearQueryInfo();
    this.loadAndSetOption();
  }
  /**
   * 维度四：平均时长和申请结果分析
   */
  timeAndApplyResultDimension(e) {
    this.applyPurposeVisible = true;
    this.CenterVisible = true;
    this.applyTypeVisible = false;
    this.AverageTimeVisible = false;
    this.applyResultVisible = false;
    this.auditResultVisible = true;

    this.colorBar = '#f0ad4e';
    this.dimensionFlag = e;
    this.clearQueryInfo();
    this.loadAndSetOption();
  }
  /**
   * 维度五：平均时长和审核结果分析
   */
  timeAndAuditResultDimension(e) {
    this.applyPurposeVisible = true;
    this.CenterVisible = true;
    this.applyTypeVisible = false;
    this.AverageTimeVisible = false;
    this.applyResultVisible = true;
    this.auditResultVisible = false;

    this.colorBar = '#d9534f';
    this.dimensionFlag = e;
    this.clearQueryInfo();
    this.loadAndSetOption();
  }

  // 改变查询参数里的平均时长
  changeQueryAvgTime(startMinute, endMinute) {
    this.businessQueryInfo.startMinute = startMinute;
    this.businessQueryInfo.endMinute = endMinute;
  }

  /**
   * 输入查询条件点击查询
   */
  search() {
    if (this.utilHelper.AssertNotNull(this.businessQueryInfo.averageTime)) {
      switch (this.businessQueryInfo.averageTime) {
        case '1':
          this.changeQueryAvgTime(0, 15);
          break;
        case '2':
          this.changeQueryAvgTime(15, 30);
          break;
        case '3':
          this.changeQueryAvgTime(30, 45);
          break;
        case '4':
          this.changeQueryAvgTime(45, 60);
          break;
        case '5':
          this.changeQueryAvgTime(60, '');
          break;
      }
    } else {
      this.changeQueryAvgTime('', '');
    }
    this.loadAndSetOption();
  }

  /**
   * 清空并隐藏查询表单
   */
  resetSearchForm() {
    this.applyTypeVisible = true;
    this.CenterVisible = true;
    this.applyPurposeVisible = true;
    this.AverageTimeVisible = true;
    this.applyResultVisible = true;
    this.auditResultVisible = true;

    this.dimensionFlag = '';
    this.businessQueryInfo.dateType = '2';
    this.clearQueryInfo();
    this.typeAndCenterDimension('typeAndCenter');
    this.statisticsDimensionComponent.statisticsByToday();
    this.loadAndSetOption();
  }

  /**
   * 清空查询参数
   */
  clearQueryInfo() {
    this.businessQueryInfo.applyPurposeId = '';
    this.businessQueryInfo.applyTypeId = '';
    this.businessQueryInfo.centerCode = '';
    this.businessQueryInfo.applyResultId = '';
    this.businessQueryInfo.auditResultId = '';
    this.businessQueryInfo.averageTime = '';
    this.businessQueryInfo.startMinute = null;
    this.businessQueryInfo.endMinute = null;
  }


  // 日期类型转换
  dateFormat(beginDate, endDate) {
    this.businessQueryInfo.startDate = this.utilHelper.format(beginDate, 'yyyy-MM-dd HH:mm:ss');
    this.businessQueryInfo.endDate = this.utilHelper.format(endDate, 'yyyy-MM-dd HH:mm:ss');
  }

  /**
   * 获取采集点名称和编码
   */
  private getCenterCodeList() {
    this.statisticsAnalysisService.getFrontOffices()
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.centerCodeList = [{ stationCode: '', stationName: this.translates['ALL'] }];
          this.centerCodeList = this.centerCodeList.concat(result);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  /**
   * 获取申请目的集合
   */
  private getApplyPurposeList() {
    this.statisticsAnalysisService.getApplyPurposeList()
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.applyPurposeList = [{ applyPurposeId: '', name: this.translates['ALL'] }];
          this.applyPurposeList = this.applyPurposeList.concat(result);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  /**
   * 按年统计
   *
   * @private
   * @memberof BusinessStatisticsComponent
   */
  countByYear() {
    this.isCountByDate = 'year';
    this.businessQueryInfo.dateType = '0';

    this.isCountByYear = true;
    this.isCountByMonth = false;
    this.isCountByCustom = false;
    this.isCountByday = false;
    this.businessStatisticsChartTitle = moment(new Date()).format('YYYY') + this.translates['year'];

    this.loadAndSetOption();
  }

  /**
   * 按月统计
   *
   * @private
   * @memberof BusinessStatisticsComponent
   */
  countByMonth() {
    this.isCountByDate = 'month';
    this.businessQueryInfo.dateType = '1';

    this.isCountByYear = false;
    this.isCountByMonth = true;
    this.isCountByCustom = false;
    this.isCountByday = false;
    this.businessStatisticsChartTitle = moment(new Date()).format('YYYY') + this.translates['year'] +
      moment(new Date()).format('MM') + this.translates['month'];

    this.loadAndSetOption();
  }
  /**
   * 按天统计
   *
   * @private
   * @memberof BusinessStatisticsComponent
   */
  countByDay() {
    this.isCountByDate = 'day';
    this.businessQueryInfo.dateType = '2';

    this.isCountByYear = false;
    this.isCountByMonth = false;
    this.isCountByCustom = false;
    this.isCountByday = true;
    this.businessStatisticsChartTitle = moment(new Date()).format('YYYY') + this.translates['year'] +
      moment(new Date()).format('MM') + this.translates['month'] + moment(new Date()).format('DD') + this.translates['day'];

    this.loadAndSetOption();
  }

  /**
   * 按自定义时间统计
   *
   * @private
   * @memberof BusinessStatisticsComponent
   */
  countByCustomTime(data) {
    this.isCountByDate = 'customTime';

    this.businessQueryInfo.dateType = data.type;
    this.dateFormat(data.start, data.end);

    // 自定义年
    if (data.type === 3) {
      this.businessStatisticsChartTitle = moment(data.start).format('YYYY') + this.translates['year'] +
        '-' + moment(data.end).format('YYYY') + this.translates['year'];
    }
    // 自定义月
    if (data.type === 4) {
      this.businessStatisticsChartTitle = moment(data.start).format('YYYY') + this.translates['year'] +
        moment(data.start).format('MM') + this.translates['month'] + '-' + moment(data.end).format('YYYY') + this.translates['year'] +
        moment(data.end).format('MM') + this.translates['month'];
    }
    // 自定义日
    if (data.type === 5) {
      this.businessStatisticsChartTitle = moment(data.start).format('YYYY') + this.translates['year'] +
        moment(data.start).format('MM') + this.translates['month'] + moment(data.start).format('DD') + this.translates['day']
        + '-' + moment(data.end).format('YYYY') + this.translates['year'] +
        moment(data.end).format('MM') + this.translates['month'] + moment(data.end).format('DD') + this.translates['day'];
    }

    this.loadAndSetOption();
  }

  /**
   * 浏览器窗口尺寸改变时，调整图表尺寸
   */
  onResize(event) {
    this.businessStatisticsChart.resize();
  }
  /**
   * 初始化echarts图表
   */
  private initCharts() {
    if (this.businessStatisticsChartDiv) {
      // this.businessStatisticsChart.dispose();
      this.businessStatisticsChart = echarts.init(this.businessStatisticsChartDiv.nativeElement);
    }
  }

  /**
   * 通用数据加载及图表初始化
   */
  private loadAndSetOption() {
    if (this.utilHelper.AssertNotNull(this.dimensionFlag)) {
      if (this.dimensionFlag === 'typeAndCenter') {
        this.getQuantityOfTypeAndCenter();
      }
      if (this.dimensionFlag === 'typeAndPurpose') {
        this.getQuantityOfTypeAndPurpose();
      }
      if (this.dimensionFlag === 'purposeAndCenter') {
        this.getQuantityOfPurposeAndCenter();
      }
      if (this.dimensionFlag === 'timeAndApplyResult') {
        this.getQuantityOfResultAndAvg();
      }
      if (this.dimensionFlag === 'timeAndAuditResult') {
        this.getQuantityOfAuditAndAvg();
      }
    } else {
      this.getQuantityOfDateAndSetOption();
    }
  }

  /**
   * 按日期获取业务数量（统计维度未选）
   *
   * @private
   * @memberof BusinessStatisticsComponent
   */
  private getQuantityOfDateAndSetOption() {
    this.statisticsBusinessService.getQuantityByDate(this.businessQueryInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.setDateSource(result);
          this.setDateChartOption(result);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  /**
   * 按申请类型和采集点获取业务办理数量
   */
  getQuantityOfTypeAndCenter() {
    this.statisticsBusinessService.getQuantityByTypeAndCenter(this.businessQueryInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.setDateSource(result);
          this.setDateChartOption(result);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  /**
   * 按申请类型和申请目的获取业务办理数量
   */
  getQuantityOfTypeAndPurpose() {
    this.statisticsBusinessService.getQuantityByTypeAndPurpose(this.businessQueryInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.setDateSource(result);
          this.setDateChartOption(result);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  /**
   * 按申请类型和申请目的获取业务办理数量
   */
  getQuantityOfPurposeAndCenter() {
    this.statisticsBusinessService.getQuantityByPurposeAndCenter(this.businessQueryInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.setDateSource(result);
          this.setDateChartOption(result);
        }
      }).catch(err => {
        console.log(err);
      });
  }

  /**
   * 按申请结果和平均时长获取业务办理数量
   */
  getQuantityOfResultAndAvg() {

    this.statisticsBusinessService.getQuantityByResultAndAvg(this.businessQueryInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.setDateSource(result);
          this.setAverageTimeChartOption(result);
        }
      }).catch(err => {
        console.log(err);
      });
  }
  /**
   * 按审核结果和平均时长获取业务办理数量
   */
  getQuantityOfAuditAndAvg() {

    this.statisticsBusinessService.getQuantityByAuditAndAvg(this.businessQueryInfo)
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.setDateSource(result);
          this.setAverageTimeChartOption(result);
        }
      }).catch(err => {
        console.log(err);
      });
  }



  /**
   * 按日期统计生成柱状图
   */
  private setDateChartOption(quantityOfYear: Array<any>) {
    this.businessStatisticsChart.clear();
    if (this.utilHelper.AssertNotNull(quantityOfYear)) {
      let quantity: any[] = [];
      let seriesData1: any[] = [];
      let seriesData2: any[] = [];
      let xAxisData: any[] = [];
      let yAxisData: any[] = [];
      let arr_final: any[] = [];

      let arr = asEnumerable(quantityOfYear).GroupBy(element => element.coord_X).ToArray();

      // 申请类型和中心
      if (this.dimensionFlag === 'typeAndCenter' || this.dimensionFlag === 'typeAndPurpose'
        || this.utilHelper.AssertEqualNull(this.dimensionFlag)) {
        // 循环二维数组，查找是否有缺失项
        // length为1为有缺失项
        if (this.utilHelper.AssertEqualNull(this.businessQueryInfo.applyTypeId)
          && this.utilHelper.AssertEqualNull(this.businessQueryInfo.applyPurposeId)) {
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
              if (copyItem.coord_Y === 'Requisiçãol') {
                copyItem.coord_Y = 'Requisição governamental';
                flag = true;
              } else {
                copyItem.coord_Y = 'Requisição';
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
        }

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
          // 取 个人申请
          seriesData1 = asEnumerable(quantity[0] as DataList[]).Select(element => element.count).ToArray();
        }
        if (this.utilHelper.AssertNotNull(quantity[1])) {
          // 取 政府申请
          seriesData2 = asEnumerable(quantity[1] as DataList[]).Select(element => element.count).ToArray();
        }
        this.setSeriesData(yAxisData, seriesData1, seriesData2);
      }
      if (this.dimensionFlag === 'purposeAndCenter') {
        let sum: any;
        let count: any[] = [];
        // 将二维数组转为一维数组
        arr_final = [].concat.apply([], arr) as DataList[];
        arr.forEach((item, i) => {
          sum = asEnumerable(arr[i] as DataList[]).Select(element => Number(element.count)).Sum();
          count.push(sum);
        });
        // 取x 轴
        xAxisData = asEnumerable(arr_final).Select(element => element.coord_X).Distinct().ToArray();
        // 柱子名
        yAxisData = asEnumerable(arr_final).Select(element => element.coord_Y).Distinct().ToArray();

        if (yAxisData.length > 1) {
          yAxisData = [this.translates['business']];

          this.seriesData = [
            {
              name: this.translates['business'],
              type: 'bar',
              data: count,
              itemStyle: {
                normal: {
                  color: this.colorBar
                }
              }
            },
          ];
        } else {
          this.setSeriesData(yAxisData, count, null);
        }
      }

      this.titleData = this.businessStatisticsChartTitle + ' ' + this.centerName;

      this.bindRecChart(this.businessStatisticsChart, xAxisData, this.seriesData, this.titleData, yAxisData);
    }
  }

  // 平均时长分析
  setAverageTimeChartOption(quantityOfYear: Array<any>) {
    this.businessStatisticsChart.clear();
    if (this.utilHelper.AssertNotNull(quantityOfYear)) {

      let arr_final: any[] = [];
      let xAxisData: any[] = [];
      let yAxisData: any[] = [];
      let quantity: any[] = [];
      let seriesData2: any[] = [];
      let seriesData1: any[] = [];

      let arr = asEnumerable(quantityOfYear).GroupBy(element => element.coord_X).ToArray();

      if (this.utilHelper.AssertEqualNull(this.businessQueryInfo.applyResultId)
        && this.utilHelper.AssertEqualNull(this.businessQueryInfo.auditResultId)) {

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
            if (this.dimensionFlag === 'timeAndApplyResult') {
              if (copyItem.coord_Y === 'Não tem registo criminal') {
                copyItem.coord_Y = 'Tem registo criminal';
                flag = true;
              } else {
                copyItem.coord_Y = 'Não tem registo criminal';
                flag = false;
              }
            }
            if (this.dimensionFlag === 'timeAndAuditResult') {
              if (copyItem.coord_Y === 'Passou') {
                copyItem.coord_Y = 'Não passou';
                flag = true;
              } else {
                copyItem.coord_Y = 'Passou';
                flag = false;
              }
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
      }

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
        // 取 有犯罪记录/通过
        seriesData1 = asEnumerable(quantity[0] as DataList[]).Select(element => element.count).ToArray();
      }
      if (this.utilHelper.AssertNotNull(quantity[1])) {
        // 取 无犯罪记录/不通过
        seriesData2 = asEnumerable(quantity[1] as DataList[]).Select(element => element.count).ToArray();
      }

      this.titleData = this.businessStatisticsChartTitle + ' ' + this.centerName;

      this.setSeriesData(yAxisData, seriesData1, seriesData2);
      this.bindRecChart(this.businessStatisticsChart, xAxisData, this.seriesData, this.titleData, yAxisData);
    }
  }

  /**
   * 绑定矩形图
   */
  bindRecChart(chart: any, xAxisData: any, seriesData: any, titleData: any, legendData: any) {
    // 折线图数据源
    let options = {
      title: {
        text: this.translates['business-statistics-chart'],
        subtext: titleData,
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
        data: legendData,
        top: 30,
        left: '13%',
      },
      toolbox: {
        show: true,
        feature: {
          magicType: {
            type: ['line', 'bar'],
            title: {
              line: this.utilHelper.formatString(this.translates['switch to line chart']),
              bar: this.utilHelper.formatString(this.translates['switch to bar chart'])
            }
          }, // 图表类型转换
          restore: {
            title: this.utilHelper.formatString(this.translates['reduction'])
          },
          saveAsImage: {
            title: this.utilHelper.formatString(this.translates['save as images'])
          }  // 保存为图片
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
      },
      yAxis: {
        type: 'value',
        name: this.translates['secondary'],
        gridIndex: 1,
        axisLabel: {
          formatter: this.numberConvertService.convert // 纵轴
        },
        minInterval: 1
      },
      series: seriesData,
    };
    if (chart) {
      // 创建图表
      chart.clear();
      chart.setOption(options);

    }
  }

  // 设置图表数据展现
  setDateSource(data) {
    this.dataSource = {
      fields: [{
        dataField: 'coord_Y',
        width: 180,
        area: 'row',
        sortOrder: '',
        sortingMethod: () => {
          return '';
        }
      }, {
        dataField: 'coord_X',
        area: 'column'
      }, {
        dataField: 'count',
        dataType: 'number',
        summaryType: 'sum',
        area: 'data'
      }],
      store: data
    };
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

  /**
   * 初始化词条
   */
  initTranslate(): Promise<any> {
    return new Promise((r, j) => {
      let translateKeys = ['year', 'month', 'day', 'ALL', 'count', 'business-statistics-chart', 'hasCriminalRecord',
        'noCriminalRecord', 'applyPerson', 'applyGovernment', 'pass', 'fail', 'quantity', 'search no data', 'total',
        'switch to line chart', 'switch to bar chart', 'reduction', 'save as images', 'chart', 'secondary', 'business'];
      this.translateService.get(translateKeys).toPromise().then(values => {
        translateKeys.forEach((key) => {
          this.translates[key] = values[key];
        });
        r(this.translates);
      });
    });
  }

  // 组件退出后销毁echarts组件
  ngOnDestroy() {
    this.businessStatisticsChart.clear();
    echarts.dispose(this.businessStatisticsChart);
  }

  // 路由导航数组
  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }

}
