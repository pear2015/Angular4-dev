import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import * as echarts from 'echarts';

import { StatisticsPersonalService, DataList } from './statistics-personal.service';
import { UtilHelper, DateFormatHelper, EventAggregator } from '../../core';
import { StatisticsAnalysisService } from '../common/statistics-analysis.service';
import { EnumInfo } from '../../enum';
import { ApplyCommonService } from '../../+crms-common/services/apply-common.service';
import * as moment from 'moment';
import { asEnumerable } from 'linq-es2015';

@Component({
  templateUrl: './statistics-personal.component.html',
})

export class StatisticsPersonalComponent implements OnInit, OnDestroy {


  dataSource: any;

  /**
   * 图表DOM容器
   */
  @ViewChild('chartDiv')
  chartDiv: ElementRef;
  /**
   * 图表
   */
  chart: any;
  /**
   * 词条数组
   */
  translates: any[] = [];
  /**
   * 所有采集点
   */
  collectOfficesList: any[] = [];
  /**
   * 选中的采集点
   *
   * @type {string}
   * @memberof StatisticsPersonalComponent
   */
  stationCode: string = '';
  /**
   * 选中时的样式
   *
   * @type {boolean}
   * @memberof StatisticsPersonalComponent
   */
  isCountByYear: boolean = false;  // 按年
  isCountByMonth: boolean = false; // 按月
  isCountByDay: boolean = false; // 当天
  isCountByCustom: boolean = false; // 自定义日期
  /**
   * 自定义日期弹框开关
   *
   * @type {boolean}
   * @memberof StatisticsPersonalComponent
   */
  customDateVisible: boolean = false;
  /**
   * 自定义日期查询类型下拉列表（按年、月、日）
   *
   * @type {any[]}
   * @memberof StatisticsPersonalComponent
   */
  customDateList: any[] = [];
  /**
   * 自定义日期类型ID
   *
   * @type {string}
   * @memberof StatisticsPersonalComponent
   */
  customDateId: string;
  customSelectedId: string;
  /**
   * 年、月、日是否隐藏
   *
   * @type {boolean}
   * @memberof StatisticsPersonalComponent
   */
  yearSwitch: boolean = true;
  monthSwitch: boolean = true;
  daySwitch: boolean = true;
  /**
   * 自定义开始和结束日期
   *
   * @type {*}
   * @memberof StatisticsPersonalComponent
   */
  startDate: any;
  endDate: any;
  nowDate: any;
  /**
   * 禁止跨越时段的时间标记
   *
   * @type {*}
   * @memberof StatisticsPersonalComponent
   */
  startFlagDate: any;
  endFlagDate: any;
  /**
   * 查询框
   *
   * @type {boolean}
   * @memberof StatisticsPersonalComponent
   */
  box2: boolean = false;
  box3: boolean = false;
  box4: boolean = false;
  box1: boolean = true;
  /**
   * 当前选中的办理用途ID
   *
   * @type {string}
   * @memberof StatisticsPersonalComponent
   */
  applyPurposeId: string;
  /**
     * 办理用途下拉列表
     *
     * @type {any[]}
     * @memberof StatisticsPersonalComponent
     */
  applyPurposeList: any[] = [];
  /**
   * 办理结果下拉列表
   *
   * @type {any[]}
   * @memberof StatisticsPersonalComponent
   */
  applyResultList: any[] = [];
  /**
   * 办理结果ID
   *
   * @type {string}
   * @memberof StatisticsPersonalComponent
   */
  value: string;
  /**
   * 职业ID
   *
   * @type {*}
   * @memberof StatisticsPersonalComponent
   */
  // occId: any;
  /**
   * 职业名称
   *
   * @type {string}
   * @memberof StatisticsPersonalComponent
   */
  occName: string;
  /**
   * 请求参数
   *
   * @type {CriminalNoticeInfoStatistics}
   * @memberof StatisticsPersonalComponent
   */
  rp: any = {};
  /**
   * 数据列表
   *
   * @type {*}
   * @memberof StatisticsPersonalComponent
   */
  dataList: any[] = [];
  /**
   * 日期对象
   *
   * @type {*}
   * @memberof StatisticsPersonalComponent
   */
  dateList: any;
  /**
   * 图表标题
   */
  chartTitle: any;
  /**
   * 图表模型
   *
   * @memberof StatisticsPersonalComponent
   */
  options: any;
  /**
   * 数据源名称数组
   *
   * @memberof StatisticsPersonalComponent
   */
  names: any;
  /**
   * 柱子自定义颜色
   *
   * @type {*}
   * @memberof StatisticsPersonalComponent
   */
  columnColor: any;
  colorList: any[] = [];
  /**
   * 维度标记
   */
  flag: string;
  /**
   * 图表初始化字段
   *
   * @type {*}
   * @memberof StatisticsPersonalComponent
   */
  grandTotal: any;
  constructor(
    private service: StatisticsPersonalService,
    public translateService: TranslateService,
    public statisticsAnalysisService: StatisticsAnalysisService,
    public utilHelper: UtilHelper,
    public enumInfo: EnumInfo,
    public applyCommonService: ApplyCommonService,
    public dateFormatHelper: DateFormatHelper,
    public eventAggregator: EventAggregator,

  ) {
    this.initTranslate();
  }

  ngOnDestroy(): void {
    // 图表销毁，释放资源
    this.chart.clear();
    echarts.dispose(this.chart);
  }
  ngOnInit(): void {
    this.customDateList = [
      {
        id: '3',
        name: this.translates['searchByYear']
      },
      {
        id: '4',
        name: this.translates['searchByMonth']
      },
      {
        id: '5',
        name: this.translates['searchByDay']
      }
    ];
    this.nowDate = new Date();
    // this.endDate = this.nowDate;
    this.applyResultList = this.enumInfo.getAnalysisResultOther;

    this.dateList = {
      startYear: '',
      startMonth: '',
      startDay: '',
      endYear: '',
      endMonth: '',
      endDay: '',
    };
    this.names = [this.translates['business'], this.translates['noCriminalRecord'], this.translates['hasCriminalRecord']];
    this.colorList = ['#0275d8', '#5cb85c', '#5bc0de', '#f0ad4e'];
    this.columnColor = this.colorList[0];
    /**
     *  初始化采集点服务基地址并获取所有采集点
     */
    this.statisticsAnalysisService.initialOrganizationService()
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.getCollectOffices();
        }
      }).catch(err => {
        console.log(err);
      });
    this.getApplyPurpose();
    this.initCharts();
    this.countByDay();
    this.bindRoutUrl('StatisticalAnalysis', 'PersonalApplicationStatistics');
    this.grandTotal = this.translates['total'] + '(' + this.translates['secondary'] + ')';
  }


  /**
   * 初始化词条
   * @returns {Promise<any>}
   * @memberof StatisticsPersonalComponent
   */

  private initTranslate(): Promise<any> {
    return new Promise((r, j) => {
      let translateKeys = ['year', 'month', 'day', 'searchByYear', 'searchByMonth', 'searchByDay', 'business',
        'noCriminalRecord', 'hasCriminalRecord', 'ALL', 'person-statistics-chart', 'secondary',
        'profession and applyPurpose', 'profession and applyResult', 'applyPurpose and applyResult',
        'switch to bar chart', 'switch to line chart', 'reduction', 'save as images', 'loading', 'total', 'chart', 'user_not_fill_in'];
      this.translateService.get(translateKeys).toPromise().then(values => {
        translateKeys.forEach((key) => {
          this.translates[key] = values[key];
        });
        r(this.translates);
      });
    });
  }
  /**
   * 获取所有采集点
   *
   * @memberof StatisticsPersonalComponent
   */
  private getCollectOffices() {
    this.statisticsAnalysisService.getFrontOffices()
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          let stationObj = {
            stationName: this.translates['ALL'],
            stationCode: ''
          };
          this.collectOfficesList.push(stationObj);
          this.collectOfficesList = this.collectOfficesList.concat(result);
        }
      }).catch(e => {
        console.warn(e);
      });
  }
  /**
   * 获取办理用途
   *
   * @memberof StatisticsPersonalComponent
   */
  private getApplyPurpose() {
    this.applyCommonService.getApplyPurposeList().then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        let obj = {
          applyPurposeId: '',
          name: this.translates['ALL']
        };
        this.applyPurposeList.push(obj);
        this.applyPurposeList = this.applyPurposeList.concat(result);

      }
    }).catch(err => {
      console.log(err);
    });
  }

  /**
   * 弹出查询框
   *
   * @memberof StatisticsPersonalComponent
   */
  // 进入时间和采集点维度
  public showBox1() {
    this.columnColor = this.colorList[0];
    this.applyPurposeId = null;
    this.value = null;
    this.occName = null;
    this.box2 = false;
    this.box3 = false;
    this.box4 = false;
    this.box1 = true;
    this.rp.applyResultId = null;
    this.rp.applyPurposeId = null;
    this.rp.profession = null;
    this.stationCode = '';
    this.rp.centerCode = this.stationCode;
    this.getDataByTimeAndOffice();
  }
  // 进入职业和办理用途维度
  public showBox2() {
    this.columnColor = this.colorList[1];
    this.applyPurposeId = '';
    this.value = '';
    this.occName = '';
    this.box2 = true;
    this.box3 = false;
    this.box4 = false;
    this.box1 = false;
    this.rp.profession = this.occName;
    this.rp.applyPurposeId = this.applyPurposeId;
    this.rp.applyResultId = null;
    this.getDataByOccupationAndApplyPurpose();
  }
  // 进入职业和办理结果维度
  public showBox3() {
    this.columnColor = this.colorList[2];
    this.applyPurposeId = '';
    this.value = '';
    this.occName = '';
    this.box2 = false;
    this.box3 = true;
    this.box4 = false;
    this.box1 = false;
    this.rp.profession = this.occName;
    this.rp.applyResultId = this.value;
    this.rp.applyPurposeId = null;
    this.getDataByOccupationAndApplyResult();
  }
  // 进入办理结果和办理用途维度
  public showBox4() {
    this.columnColor = this.colorList[3];
    this.applyPurposeId = '';
    this.value = '';
    this.occName = '';
    this.box2 = false;
    this.box3 = false;
    this.box4 = true;
    this.box1 = false;
    this.rp.applyResultId = this.value;
    this.rp.applyPurposeId = this.applyPurposeId;
    this.rp.profession = null;
    this.getDataByApplyResultAndApplyPurpose();
  }

  /**
   * 初始化图表
   *
   * @memberof StatisticsPersonalComponent
   */
  private initCharts() {
    if (this.chartDiv) {
      this.chart = echarts.init(this.chartDiv.nativeElement);
    }
  }
  /**
   * 图表自适应
   *
   * @memberof StatisticsPersonalComponent
   */
  public onResize() {
    if (this.chart != null && this.chart !== undefined) {
      this.chart.resize();
    }
  }

  private creatList(dataList: any[]) {
    if (this.utilHelper.AssertNotNull(dataList)) {
      // 在按日期为纵轴统计的情况，给数据加上年、月、日后缀
      if (this.box1) {
        dataList.forEach(item => {
          if (this.flag === 'customYear') {
            item.coord_Y += this.translates['year'];
          }
          if (this.flag === 'box1-year' || this.flag === 'customMonth') {
            item.coord_Y = moment(item.coord_Y).format('MM') + this.translates['month'];
          }
          if (this.flag === 'box1-month' || this.flag === 'box1-day' || this.flag === 'customDay') {
            item.coord_Y = moment(item.coord_Y).format('DD') + this.translates['day'];
          }


        });
      };
      this.dataSource = {
        fields: [{
          caption: 'X',
          width: 200,
          dataField: 'coord_X',
          area: 'row',
        },
        {
          dataField: 'coord_Y',
          dataType: 'string',
          area: 'column'
        },
        {
          caption: 'Y',
          dataField: 'count',
          dataType: 'number',
          summaryType: 'sum',
          area: 'data'
        }],
        store: dataList
      };
    }
  }
  /**
   * 创建图表
   *
   * @memberof StatisticsPersonalComponent
   */
  private creatChart(dataList: DataList[]) {
    this.chart.clear();
    this.options = {};
    // 一根柱子的图表模型
    let options0 = {
      title: {
        text: this.translates['person-statistics-chart'],
        subtext: this.chartTitle,
        x: 'center',
        textStyle: {
          fontSize: 16,
          fontFamily: 'Microsoft YaHei'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [this.names[0]],
        top: 30,
        left: '15%'
      },
      toolbox: {
        show: true,
        feature: {
          magicType: {
            type: ['line', 'bar'],
            title: {
              bar: this.translates['switch to bar chart'],
              line: this.translates['switch to line chart']
            }
          }, // 图表类型转换
          restore: {
            title: this.translates['reduction']
          },
          saveAsImage: {
            title: this.translates['save as images']
          }  // 保存为图片
        },
        right: '2%'
      },
      grid: [
        {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          }
        }, {
          left: '8%',
          right: '8%',
          bottom: '10%',
          containLabel: true
        }],
      xAxis: [
        {
          type: 'category',
          data: [],
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
          name: this.translates['secondary'],
          minInterval: 1
        }
      ],
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
          name: this.names[0],
          type: 'bar',
          data: [],

        }

      ],
      color: [this.columnColor]
    };
    // 两根柱子的模型
    let options1 = {
      title: {
        text: this.translates['person-statistics-chart'],
        subtext: this.chartTitle,
        x: 'center',
        textStyle: {
          fontSize: 16,
          fontFamily: 'Microsoft YaHei'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: [this.names[1], this.names[2]],
        top: 30,
        left: '15%'
      },
      toolbox: {
        show: true,
        feature: {
          magicType: { type: ['line', 'bar'] }, // 图表类型转换
          restore: {},
          saveAsImage: {}  // 保存为图片
        },
        right: '2%'
      },
      grid: [
        {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          }
        }, {
          left: '8%',
          right: '8%',
          bottom: '10%',
          containLabel: true
        }],
      xAxis: [
        {
          type: 'category',
          data: []
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: this.translates['secondary'],
          minInterval: 1
        }
      ],
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
          name: this.names[1],
          type: 'bar',
          data: []
        },
        {
          name: this.names[2],
          type: 'bar',
          data: [],
          itemStyle: {
            normal: {
              color: '#8555e9'
            }
          }
        }

      ],
      color: [this.columnColor]
    };

    // 需要两根柱子展示的情况
    if (this.box3 || this.box4 || this.flag === 'box3-year' || this.flag === 'box3-month' || this.flag === 'box4-year'
      || this.flag === 'box4-month' || this.flag === 'box3-custom' || this.flag === 'box4-custom') {
      this.chart.setOption(options1);
      if (this.utilHelper.AssertNotNull(dataList) && dataList.length > 0) {
        // 按照x轴分组 生成一个二维数组;
        let arr = asEnumerable(dataList).GroupBy(element => element.coord_X).ToArray();
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
            let flags = false;
            if (copyItem.coord_Y === 'Tem registo criminal') {
              copyItem.coord_Y = 'Não tem registo criminal';
              flags = true;
            } else {
              copyItem.coord_Y = 'Tem registo criminal';
              flags = false;
            }

            // 将复制项添加到二维数组
            let arr_inner = arr[index] as DataList[];
            // 判断复制项是加在数组头部，还是尾部
            if (!flags) {
              arr_inner.push(copyItem);
            } else {
              arr_inner.unshift(copyItem);
            }
          }

        });
        // 将二维数组转为一维数组
        let arr_final = [].concat.apply([], arr) as DataList[];
        // 取x 轴
        let xAxisData = asEnumerable(arr_final).Select(element => element.coord_X).Distinct().ToArray();
        // 取 y 轴
        let seriesData = asEnumerable(arr_final).GroupBy(element => element.coord_Y).ToArray();
        // 取 无犯罪记录
        let seriesData1 = asEnumerable(seriesData[0] as DataList[]).Select(element => element.count).ToArray();
        // 取 有犯罪记录
        let seriesData2 = asEnumerable(seriesData[1] as DataList[]).Select(element => element.count).ToArray();
        this.options = {
          xAxis: {
            data: xAxisData
          },
          series: [
            {
              name: this.names[1],
              data: seriesData1
            },
            {
              name: this.names[2],
              data: seriesData2
            }
          ]
        };
      }
    } else if (this.box2 || this.flag === 'box1-year' || this.flag === 'box1-month') { // 需要把纵轴数量合并的展示情况
      this.chart.setOption(options0);
      if (this.utilHelper.AssertNotNull(dataList) && dataList.length > 0) {
        let sum: any;
        let counts: any[] = [];
        // 按照x轴分组 生成一个二维数组;
        let arr = asEnumerable(dataList).GroupBy(element => element.coord_X).ToArray();
        arr.forEach((item, i) => {
          sum = asEnumerable(arr[i] as DataList[]).Select(element => Number(element.count)).Sum();
          counts.push(sum);
          // 将二维数组转为一维数组
          let arr_final = [].concat.apply([], arr) as DataList[];

          let xAsData;
          let yAsData;
          // 取x 轴
          xAsData = asEnumerable(arr_final).Select(element => element.coord_X).Distinct().ToArray();
          // 柱子名
          yAsData = asEnumerable(arr_final).Select(element => element.count).Distinct().ToArray();
          this.options = {
            xAxis: {
              data: xAsData
            },
            series: [
              {
                name: this.names[0],
                data: counts
              }
            ]
          };
        });
      }
    } else { // 只需要一根柱子展示的情况
      this.chart.setOption(options0);
      let xData = dataList.map(element => element.coord_X);
      let sDate = dataList.map(element => element.count);
      this.options = {
        xAxis: {
          data: xData
        },
        series: [
          {
            name: this.names[0],
            data: sDate
          }
        ]
      };
    }
    // this.chart.hideLoading();
    this.chart.setOption(this.options);

  }
  /**
   * 按年统计
   *
   * @memberof StatisticsPersonalComponent
   */
  public countByYear() {
    this.isCountByYear = true;
    this.isCountByMonth = false;
    this.isCountByDay = false;
    this.isCountByCustom = false;
    this.rp.dateType = '0'; // 日期类型，按年
    this.rp.centerCode = this.stationCode;
    this.rp.profession = this.occName;
    this.rp.applyPurposeId = this.applyPurposeId;
    this.rp.applyResultId = this.value;
    this.getDateList(new Date(), new Date());
    this.chartTitle = this.dateList.startYear;
    if (this.box1) {
      this.getDataByTimeAndOffice();
      this.flag = 'box1-year'; // 表示第一个维度，按日期年、月、日和采集点
    };
    if (this.box2) {
      this.getDataByOccupationAndApplyPurpose();
    }
    if (this.box3) {
      this.getDataByOccupationAndApplyResult();
      this.flag = 'box3-year'; // 表示第三个维度，按职业和办理结果
    }
    if (this.box4) {
      this.getDataByApplyResultAndApplyPurpose();
      this.flag = 'box4-year';
    }
  }
  /**
  * 按月统计
  *
  * @memberof StatisticsPersonalComponent
  */
  public countByMonth() {
    this.isCountByYear = false;
    this.isCountByMonth = true;
    this.isCountByDay = false;
    this.isCountByCustom = false;
    this.rp.dateType = '1'; // 日期类型，按月
    this.rp.centerCode = this.stationCode;
    this.rp.profession = this.occName;
    this.rp.applyPurposeId = this.applyPurposeId;
    this.rp.applyResultId = this.value;
    this.getDateList(new Date(), new Date());
    this.chartTitle = this.dateList.startYear + this.dateList.startMonth;
    if (this.box1) {
      this.getDataByTimeAndOffice();
      this.flag = 'box1-month';
    };
    if (this.box2) {
      this.getDataByOccupationAndApplyPurpose();
    }
    if (this.box3) {
      this.getDataByOccupationAndApplyResult();
      this.flag = 'box3-month';
    }
    if (this.box4) {
      this.getDataByApplyResultAndApplyPurpose();
      this.flag = 'box4-month';
    }
  }

  /**
   * 按天统计
   *
   * @memberof StatisticsPersonalComponent
   */
  public countByDay() {
    this.isCountByYear = false;
    this.isCountByMonth = false;
    this.isCountByDay = true;
    this.isCountByCustom = false;
    this.rp.dateType = '2';
    this.rp.centerCode = this.stationCode;
    this.rp.profession = this.occName;
    this.rp.applyPurposeId = this.applyPurposeId;
    this.rp.applyResultId = this.value;
    this.getDateList(new Date(), new Date());
    this.chartTitle = this.dateList.startYear + this.dateList.startMonth + this.dateList.startDay;

    if (this.box1) {
      this.getDataByTimeAndOffice();
      this.flag = 'box1-day';
    };
    if (this.box2) {
      this.getDataByOccupationAndApplyPurpose();
    }
    if (this.box3) {
      this.getDataByOccupationAndApplyResult();
    }
    if (this.box4) {
      this.getDataByApplyResultAndApplyPurpose();
    }
  }
  /**
   * 自定义日期弹框
   *
   * @memberof StatisticsPersonalComponent
   */
  public customDatePopup() {
    this.isCountByYear = false;
    this.isCountByMonth = false;
    this.isCountByDay = false;
    this.isCountByCustom = true;
    this.customDateVisible = true;
  }
  /**
   * 选择查询条件（按年或按月或按日）
   *
   * @param {any} data
   * @memberof StatisticsPersonalComponent
   */
  public selectedCustomDate() {
    this.customDateId = this.customSelectedId;
    if (this.customDateId === '3') {
      this.yearSwitch = false;
      this.monthSwitch = true;
      this.daySwitch = true;
      this.flag = 'customYear';
    } else if (this.customDateId === '4') {
      this.yearSwitch = true;
      this.monthSwitch = false;
      this.daySwitch = true;
      this.flag = 'customMonth';
    } else if (this.customDateId === '5') {
      this.yearSwitch = true;
      this.monthSwitch = true;
      this.daySwitch = false;
      this.flag = 'customDay';
    }
    this.clearDate();
  }
  /**
   *自定义年查询时选到最后一天
   *
   * @memberof StatisticsPersonalComponent
   */
  public changeDate(data) {
    let MM = parseInt(moment(this.nowDate).format('MM'), null) - 1;
    let DD = parseInt(moment(this.nowDate).format('DD'), null);
    this.startFlagDate = null;
    this.endFlagDate = null;
    if (this.customDateId === '3') {
      if (this.utilHelper.AssertNotNull(this.endDate) && this.endDate !== this.nowDate) {
        if (moment(this.endDate).format('YYYY') === moment(this.nowDate).format('YYYY')) {
          this.endDate = new Date(new Date(this.endDate.setMonth(MM)).setDate(DD));
          return;
        }
        this.endDate = new Date(new Date(this.endDate.setMonth(11)).setDate(31));
      }
    } else if (this.customDateId === '4') {
      if (this.utilHelper.AssertNotNull(this.startDate)) {
        if (moment(this.startDate).format('YYYY') === moment(new Date()).format('YYYY')) {
          this.endFlagDate = new Date();
        } else {
          this.endFlagDate = this.startDate;
          this.endFlagDate = new Date(new Date(new Date(this.endFlagDate).setMonth(11)).setDate(31));
        }
      }
      if (this.utilHelper.AssertNotNull(this.endDate)) {
        this.startFlagDate = this.endDate;
        this.startFlagDate = new Date(new Date(new Date(this.startFlagDate).setMonth(0)).setDate(1));
        if (moment(this.endDate).format('YYYY-MM') === moment(this.nowDate).format('YYYY-MM')) {
          this.endDate = new Date(new Date(this.endDate.setMonth(MM)).setDate(DD));
          return;
        }
        let EndYYYY = parseInt(moment(this.endDate).format('YYYY'), null);
        let EndMM = parseInt(moment(this.endDate).format('MM'), null);
        this.endDate = new Date(new Date(this.endDate).setDate(this.getLastDay(EndYYYY, EndMM)));
      }
    } else {
      if (this.utilHelper.AssertNotNull(this.startDate)) {
        this.endFlagDate = this.startDate;
        let EndYYYY = parseInt(moment(this.endFlagDate).format('YYYY'), null);
        let EndMM = parseInt(moment(this.endFlagDate).format('MM'), null);
        this.endFlagDate = new Date(new Date(this.endFlagDate).setDate(this.getLastDay(EndYYYY, EndMM)));
      }
      if (this.utilHelper.AssertNotNull(this.endDate)) {
        this.startFlagDate = this.endDate;
        this.startFlagDate = new Date(new Date(this.startFlagDate).setDate(1));
      }

    }
  }

  /**
   * 获取月份最后一天
   *
   * @param {any} year
   * @param {any} month
   * @returns
   * @memberof StatisticsPersonalComponent
   */
  private getLastDay(year, month) {
    let new_year = year;
    let new_month = month++;
    if (month > 12) {
      new_month -= 12;
      new_year++;
    }
    let new_date = new Date(new_year, new_month, 1);
    return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate();
  }
  /**
   * 按自定义日期统计
   *
   * @memberof StatisticsPersonalComponent
   */
  public countByCustomDate() {

    this.rp.dateType = this.customDateId;
    this.rp.centerCode = this.stationCode;
    this.rp.profession = this.occName;
    this.rp.applyPurposeId = this.applyPurposeId;
    this.rp.applyResultId = this.value;
    this.dateFormat(this.startDate, this.endDate);
    this.getDateList(this.startDate, this.endDate);
    if (this.rp.dateType === '3') {
      this.chartTitle = this.dateList.startYear + '--' + this.dateList.endYear;
    } else if (this.rp.dateType === '4') {
      this.chartTitle = this.dateList.startYear + this.dateList.startMonth + '--' +
        this.dateList.endYear + this.dateList.endMonth;
    } else {
      this.chartTitle = this.dateList.startYear + this.dateList.startMonth + this.dateList.startDay + '--' +
        this.dateList.endYear + this.dateList.endMonth + this.dateList.endDay;
    }
    if (this.box1) {
      this.getDataByTimeAndOffice();
    };
    if (this.box2) {
      this.getDataByOccupationAndApplyPurpose();
    }
    if (this.box3) {
      this.getDataByOccupationAndApplyResult();
      this.flag = 'box3-custom';
    }
    if (this.box4) {
      this.getDataByApplyResultAndApplyPurpose();
      this.flag = 'box4-custom';
    }
    this.customDateVisible = false;
  }
  /**
   * 格式化日期
   *
   * @param {any} startDate
   * @param {any} endDate
   * @memberof StatisticsPersonalComponent
   */
  private dateFormat(startDate, endDate) {
    if (this.utilHelper.AssertNotNull(startDate && endDate)) {
      this.rp.startDate = this.dateFormatHelper.RestURLBeignDateTimeFormat(startDate);
      this.rp.endDate = this.dateFormatHelper.RestURLBeignDateTimeFormat(endDate);
    }
  }
  /**
   * 清空上一次所选的时间
   *
   * @memberof StatisticsPersonalComponent
   */
  private clearDate() {
    this.startDate = null;
    // this.endDate = this.nowDate;
    this.endDate = null;
    this.startFlagDate = null;
    this.endFlagDate = null;
  }
  /**
   * 格式化日期
   *
   * @private
   * @param {any} date
   * @memberof StatisticsPersonalComponent
   */
  private getDateList(startDate, endDate) {
    this.dateList.startYear = moment(startDate).format('YYYY') + this.translates['year'];
    this.dateList.startMonth = moment(startDate).format('MM') + this.translates['month'];
    this.dateList.startDay = moment(startDate).format('DD') + this.translates['day'];
    this.dateList.endYear = moment(endDate).format('YYYY') + this.translates['year'];
    this.dateList.endMonth = moment(endDate).format('MM') + this.translates['month'];
    this.dateList.endDay = moment(endDate).format('DD') + this.translates['day'];
  }
  /**
   * 弹框关闭后恢复初始化
   *
   * @memberof StatisticsPersonalComponent
   */
  popupClose() {
    this.yearSwitch = true;
    this.monthSwitch = true;
    this.daySwitch = true;
    this.customSelectedId = null;
  }
  /**
   * 按查询维度统计
   *
   * @memberof StatisticsPersonalComponent
   */
  public countBySearch() {
    this.rp.centerCode = null;
    if (this.box1) {
      this.rp.centerCode = this.stationCode;
      this.getDataByTimeAndOffice();
    }
    if (this.box2) {// 职业和办理用途
      this.rp.profession = this.occName.replace(/(^\s+)|(\s+$)/g, '');
      this.rp.applyPurposeId = this.applyPurposeId;
      this.rp.applyResultId = null;
      this.getDataByOccupationAndApplyPurpose();
    } else if (this.box3) { // 职业和办理结果
      this.rp.profession = this.occName.replace(/(^\s+)|(\s+$)/g, '');
      this.rp.applyResultId = this.value;
      this.rp.applyPurposeId = null;
      this.getDataByOccupationAndApplyResult();
    } else if (this.box4) { // 办理结果和办理用途
      this.rp.applyResultId = this.value;
      this.rp.applyPurposeId = this.applyPurposeId;
      this.rp.profession = null;
      this.getDataByApplyResultAndApplyPurpose();
    }
  }
  /**
   * 按时间和采集点统计接口方法
   *
   * @memberof StatisticsPersonalComponent
   */
  private async getDataByTimeAndOffice() {
    try {
      // this.chart.showLoading({ text: this.translates['loading'] });
      this.dataList = [];
      let result = await this.service.postDataListByTimeAndOffice(this.rp).catch(error => { console.log(error); });
      if (this.utilHelper.AssertNotNull(result)) {
        this.dataList = result;
      }
      this.creatChart(this.dataList);
      this.creatList(this.dataList);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 按职业和办理途统计接口方法
   *
   * @memberof StatisticsPersonalComponent
   */
  private async getDataByOccupationAndApplyPurpose() {
    try {
      // this.chart.showLoading({ text: this.translates['loading'] });
      this.dataList = [];
      let result = await this.service.postDataListByOccupationAndApplyPurpose(this.rp);
      if (this.utilHelper.AssertNotNull(result)) {
        this.dataList = result;
        let remark = this.translates['user_not_fill_in'];
        this.dataList.forEach(item => {
          if (item.coord_X === 'Outro') {
            item.coord_X = item.coord_X + '(' + remark + ')';
          }
        });
      }
      this.creatChart(this.dataList);
      this.creatList(this.dataList);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 按职业和办理结果统计接口方法
   *
   * @memberof StatisticsPersonalComponent
   */
  private async getDataByOccupationAndApplyResult() {
    try {
      // this.chart.showLoading({ text: this.translates['loading'] });
      this.dataList = [];
      let result = await this.service.postDataListByOccupationAndApplyResult(this.rp);
      if (this.utilHelper.AssertNotNull(result)) {
        this.dataList = result;
        let remark = this.translates['user_not_fill_in'];
        this.dataList.forEach(item => {
          if (item.coord_X === 'Outro') {
            item.coord_X = item.coord_X + '(' + remark + ')';
          }
        });
      }
      this.creatChart(this.dataList);
      this.creatList(this.dataList);
    } catch (error) {
      console.log(error);
    }
  }
  /**
   * 按办理结果和办理用途统计接口方法
   *
   * @memberof StatisticsPersonalComponent
   */
  private async getDataByApplyResultAndApplyPurpose() {
    try {
      // this.chart.showLoading({ text: this.translates['loading'] });
      this.dataList = [];
      let result = await this.service.postDataListByApplyResultAndApplyPurpose(this.rp);
      if (this.utilHelper.AssertNotNull(result)) {
        this.dataList = result;
      }
      this.creatChart(this.dataList);
      this.creatList(this.dataList);
    } catch (error) {
      console.log(error);
    }
  }

  // 路由绑定header路径

  bindRoutUrl(parentUrl: string, childrenUrl: string) {
    this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
  }
}


