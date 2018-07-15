import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { StatisticsType } from '../../enum';
import { UtilHelper, EventAggregator, DateFormatHelper, NumberConvertService } from '../../core';
import { ReportCrimeParamModel } from '../../model/';
import { StatisticsCrimeinfoService, DataList } from './statistics-crimeinfo.service';
import { StatisticsAnalysisService } from '../common/statistics-analysis.service';
import * as echarts from 'echarts';
import * as moment from 'moment';
import { asEnumerable } from 'linq-es2015';
/**
 * 犯罪信息统计和犯罪类型分析
 * @export
 * @class StatisticsCrimeComponent
 * @implements {OnInit, OnDestroy}
 */
@Component({
    templateUrl: './statistics-crimeinfo.component.html',
    providers: [StatisticsCrimeinfoService, DateFormatHelper, DataList]
})
export class StatisticsCrimeinfoComponent implements OnInit, OnDestroy {
    // 柱状图盒子
    @ViewChild('chartDiv') chartDiv: ElementRef;
    // 具体柱状图对象
    chart: any;
    // 表格行列和数据源
    dataSource: any;
    // 不同纬度统计结果
    statisticsResult: any[] = [];
    // 词条数组
    translates: any[] = [];
    // 统计中时间类型
    currentStatisticsType: StatisticsType = StatisticsType.currentDay;
    // 自定义起始日期
    customStartTime: Date;
    // 自定义结束日期
    customEndTime: Date;
    // 查询对象
    reportCrimeParamModel: ReportCrimeParamModel;
    // 柱状图XY轴
    xy: any;
    // 柱状图tittle
    echartsTitle: string;
    // 犯罪类型集合
    crimeTypeList: any[] = [];
    // 默认犯罪类型-全部
    defaultCrimeTypeId: string = '';
    // 柱状图/折线图
    seriesType: string = 'bar';
    // 统计纬度类型
    dimensionType = '1';
    // 犯罪类型可见
    crimeTypeVisible: boolean = true;
    // 犯罪区域可见
    crimeRegionVisible: boolean = true;
    provinceList: any[] = []; // 所有区域
    // 默认省-全国
    defaultProvinceId: string = '';
    // 当前选中的省
    currentSelectedProvince: string = '';
    currentSelectedCrimeType: string = '';
    // 表格总计国际化
    grandTotal: string = '';
    // 没有数据国际化
    noData: string = '';
    // 柱状图颜色
    barColors: string[] = ['#0275d8', '#5cb85c', '#31b0d5'];
    box1: boolean = true;
    box2: boolean = false;
    box3: boolean = false;
    constructor(private translateService: TranslateService,
        private utilHelper: UtilHelper,
        private eventAggregator: EventAggregator,
        private numberConvertService: NumberConvertService,
        private statisticsCrimeinfoService: StatisticsCrimeinfoService,
        private statisticsAnalysisService: StatisticsAnalysisService,
        private dateFormatHelper: DateFormatHelper
    ) {
        this.reportCrimeParamModel = new ReportCrimeParamModel();
        this.xy = {
            xAxisData: [],
            seriesData: []
        };
    }
    ngOnInit(): void {
        // 路由信息
        this.bindRoutUrl('StatisticalAnalysis', 'CrimeInfoStatistics');
        this.initTranslate().then(result => {
            // 1.默认统计当天全国，所有犯罪类型，各省的犯罪数量
            this.defaultStatistics();
            // 2.初始化柱状图
            this.initCharts();
            // 3.设置柱状图标题和xy轴
            this.setCharXAxisCrimeRegion();
            this.grandTotal = this.translates['total'] + '(' + this.translates['item'] + ')';
            this.noData = this.translates['search no data'];
            this.provinceList = [{ provinceId: '', provinceName: this.translates['ALL'] }]; // 所有区域
            this.crimeTypeList = [{ crimeTypeId: '', crimeTypeName: this.translates['ALL'] }];
            // this.defaultProvinceId = this.translates['ALL'];
            this.getProvinceList();
            this.getCrimeTypeList();
        }).catch(err => {
            console.log(err);
        });
    }
    /**
     * 组件销毁时，销毁图表释放资源
     * @memberof StatisticsCrimeinfoComponent
     */
    ngOnDestroy(): void {
        this.chart.clear();
        echarts.dispose(this.chart);
    }
    /**
    * 初始化图表
    *
    * @memberof StatisticsPersonalComponent
    */
    initCharts() {
        if (this.chartDiv) {
            this.chart = echarts.init(this.chartDiv.nativeElement);
        }
    }
    /**
     * 图表自适应
     *
     * @memberof StatisticsPersonalComponent
     */
    onResize() {
        if (this.chart != null && this.chart !== undefined) {
            this.chart.resize();
        }
    }
    /**
     * 默认显示按天统计全国全部犯罪类型，各省的犯罪数量
     * @memberof StatisticsCrimeinfoComponent
     */
    defaultStatistics() {
        // 将所有使用到的词条初始化
        this.initTranslate();
        this.reportCrimeParamModel.dateType = StatisticsType.currentDay;
        this.reportCrimeParamModel.crimeTypeId = '';
        this.reportCrimeParamModel.crimeRegionName = '';
        this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }
    /**
     * 默认图表dataSource数据
     * @memberof StatisticsCrimeinfoComponent
     */
    defaultFromDataSource(data: any) {
        this.dataSource = this.setPivotGridDataSource(this.statisticsResult);
    }
    /**
     * 按年统计点击事件
     */
    async  statisticsByYearClicked(param) {
        this.reportCrimeParamModel.dateType = StatisticsType.currentYear;
        this.currentStatisticsType = StatisticsType.currentYear;
        await this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }
    /**
     * 按月统计点击事件
     */
    async statisticsByMonthClicked(param) {
        this.reportCrimeParamModel.dateType = StatisticsType.currentMonth;
        this.currentStatisticsType = StatisticsType.currentMonth;
        await this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }
    /**
     * 按日统计点击事件
     * @param {any} param
     * @memberof StatisticsCrimeinfoComponent
     */
    async statisticsByTodayClicked(param) {
        this.reportCrimeParamModel.dateType = StatisticsType.currentDay;
        this.currentStatisticsType = StatisticsType.currentDay;
        await this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }
    /**
     * 按自定义时间统计点击事件
     */
    async  statisticsByCustomTime(e) {
        this.customStartTime = e.start;
        this.customEndTime = e.end;
        // 时间转化
        if (this.customStartTime !== null && this.customStartTime !== undefined) {
            this.reportCrimeParamModel.startDate = this.dateFormatHelper.RestURLBeignDateTimeFormat(this.customStartTime);
        }
        if (this.customEndTime !== null && this.customEndTime !== undefined) {
            this.reportCrimeParamModel.endDate = this.dateFormatHelper.RestURLBeignDateTimeFormat(this.customEndTime);
        }
        this.currentStatisticsType = e.type;
        this.reportCrimeParamModel.dateType = e.type;
        await this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }
    /**
     * 切换犯罪类型点击事件
     * @memberof StatisticsCrimeinfoComponent
     */
    async selectedIndexOfCrimeTypeChanged(e) {
        if (this.utilHelper.AssertNotNull(e)) {
            // 1.选中的犯罪类型
            this.reportCrimeParamModel.crimeTypeId = e.selectedItem.crimeTypeId;
            this.currentSelectedCrimeType = e.selectedItem.crimeTypeName;
        }
    }
    /**
     * 切换省点击事件
     * @param {any} e
     * @memberof StatisticsCrimeinfoComponent
     */
    async selectedIndexOfProvince(e) {
        if (this.utilHelper.AssertNotNull(e)) {
            // 1.选中的犯罪区域，判断如果是全国，将provinceName置空
            if (this.translates['ALL'] === e.selectedItem.provinceName) {
                this.reportCrimeParamModel.crimeRegionName = '';
            } else {
                this.reportCrimeParamModel.crimeRegionName = e.selectedItem.provinceName;
            }
            this.currentSelectedProvince = e.selectedItem.provinceName;
        }
    }
    /**
     * 点击搜索加载数据
     */
    async search() {
        this.reportCrimeParamModel.crimeRegionName = this.currentSelectedProvince =
            asEnumerable(this.provinceList).Where(x => x.provinceId === this.defaultProvinceId).Select(x => x.provinceName)
                .ToArray().toString();
        this.reportCrimeParamModel.crimeTypeId = this.defaultCrimeTypeId;
        if (this.reportCrimeParamModel.crimeRegionName === this.translates['ALL']) {
            this.reportCrimeParamModel.crimeRegionName = '';
        }
        await this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }

    /**
     * 初始化词条
     * @returns {Promise<any>}
     * @memberof StatisticsPersonalComponent
     */
    initTranslate(): Promise<any> {
        return new Promise((r, j) => {
            let translateKeys: any[] = ['year', 'month', 'day', 'CrimeInfoStatistics', 'provinceName',
                'count', 'total', 'search no data', 'ALL', 'count',
                'crime-quantity-distribution', 'various-province', 'quantity-distribution',
                'various-crimetype-quantity-distribution', 'switch to line chart', 'switch to bar chart',
                'reduction', 'save as images', 'crimeInfo-statistics-chart', 'chart', 'item', 'business', 'month', 'user_not_fill_in'];
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
     * 根据不同纬度获取统计结果
     * @param reportCrimeParamModel
     */
    async getCrimeStatisticsData(reportCrimeParamModel: ReportCrimeParamModel) {
        try {
            let result: any = [];
            if (this.dimensionType === '1') {
                // 犯罪区域和犯罪类型
                result = await this.statisticsCrimeinfoService.getCrimeInfoStatisticsCrimeRegionMain(reportCrimeParamModel);
                await this.setChartTitleByCrimRegion();
                this.seriesType = 'bar';
                this.statisticsResult = result;
                if (this.utilHelper.AssertNotNull(this.statisticsResult)) {
                    let remark = this.translates['user_not_fill_in'];
                    this.statisticsResult.forEach(item => {
                        if (item.coord_X === 'Outro') {
                            item.coord_X = item.coord_X + '(' + remark + ')';
                        }
                    });
                }
                this.setXyAndCreateChart(this.barColors[0]);

            } else if (this.dimensionType === '2') {
                // 犯罪类型和犯罪时间
                result = await this.statisticsCrimeinfoService.getCrimeInfoStatisticsCrimeTypeMain(reportCrimeParamModel);
                await this.setChartTitleByCrimType();
                this.seriesType = 'bar';
                this.statisticsResult = result;
                if (this.utilHelper.AssertNotNull(result) && result.length > 0 &&
                    this.currentStatisticsType === StatisticsType.currentYear) {
                    result.forEach(item => {
                        item.coord_X += this.translates['month'];
                    });
                } else if (this.utilHelper.AssertNotNull(result) && result.length > 0
                    && (this.currentStatisticsType === StatisticsType.currentDay ||
                        this.currentStatisticsType === StatisticsType.currentMonth
                        || this.currentStatisticsType === StatisticsType.customDay)) {
                    result.forEach(item => {
                        item.coord_X = this.utilHelper.format(item.coord_X, 'dd-MM-yyyy');
                    });
                }
                this.setXyAndCreateChart(this.barColors[1]);

            } else {
                // 犯罪区域和犯罪时间
                result = await this.statisticsCrimeinfoService.getCrimeInfoStatisticsCrimeTimeMain(reportCrimeParamModel);
                if (this.utilHelper.AssertNotNull(result) && result.length > 0 &&
                    this.currentStatisticsType === StatisticsType.currentYear) {
                    result.forEach(item => {
                        item.coord_X += this.translates['month'];
                    });
                } else if (this.utilHelper.AssertNotNull(result) && result.length > 0
                    && (this.currentStatisticsType === StatisticsType.currentDay ||
                        this.currentStatisticsType === StatisticsType.currentMonth
                        || this.currentStatisticsType === StatisticsType.customDay)) {
                    result.forEach(item => {
                        item.coord_X = this.utilHelper.format(item.coord_X, 'dd-MM-yyyy');
                    });
                }
                await this.setChartTitleByCrimeDate();
                this.seriesType = 'bar';
                this.statisticsResult = result;
                this.setXyAndCreateChart(this.barColors[2]);
            }
        } catch (err) {
            console.log(err);
        }
    }
    /**
     * 设置xy轴并创建图表
     * @memberof StatisticsCrimeinfoComponent
     */
    setXyAndCreateChart(colorBar: string) {
        this.xy.xAxisData = [];
        this.xy.seriesData = [];
        let xGroup: any[] = [];
        let count: any[] = [];
        if (this.utilHelper.AssertNotNull(this.statisticsResult) && this.statisticsResult.length > 0) {
            // 取x 轴
            this.xy.xAxisData = asEnumerable(this.statisticsResult).Select(element => element.coord_X).Distinct().ToArray();
            // 根据x轴犯罪区域或者犯罪时间分组
            xGroup = asEnumerable(this.statisticsResult).GroupBy(element => element.coord_X).ToArray();
            // 计算每组所有犯罪类型的总数量
            if (this.utilHelper.AssertNotNull(xGroup) && xGroup.length > 0) {
                xGroup.forEach(element => {
                    let sum = asEnumerable(element as DataList[]).Select(item => Number(item.count)).Sum();
                    count.push(sum);
                });
            }
            this.xy.seriesData = count;
        }
        this.creatChart(this.echartsTitle, this.xy.xAxisData, this.xy.seriesData, colorBar);
        this.dataSource = this.setPivotGridDataSource(this.statisticsResult);
    }
    /**
     * 犯罪区域和犯罪时间
     * @param {any} e
     * @memberof StatisticsCrimeinfoComponent
     */
    async dateXAixsSwitch(e) {
        this.box1 = false;
        this.box2 = false;
        this.box3 = true;
        this.crimeRegionVisible = true;
        this.crimeTypeVisible = false;
        this.dimensionType = '3';
        this.defaultProvinceId = '';  // 清空犯罪区域的值
        this.defaultCrimeTypeId = ''; // 清空犯罪类型的值
        await this.setChartXAxisCrimeDate();
    }
    /**
     * 犯罪类型和犯罪时间
     * @memberof StatisticsCrimeinfoComponent
     */
    async typeXAixsSwitch() {
        this.box1 = false;
        this.box2 = true;
        this.box3 = false;
        this.crimeRegionVisible = false;
        this.crimeTypeVisible = true;
        this.dimensionType = '2';
        this.defaultProvinceId = '';  // 清空犯罪区域的值
        this.defaultCrimeTypeId = ''; // 清空犯罪类型的值
        await this.setCharXAxisCrimeType();
    }
    /**
     * 犯罪区域和犯罪类型
     * @param {any} e
     * @memberof StatisticsCrimeinfoComponent
     */
    async regionXAixsSwitch(e) {
        this.box1 = true;
        this.box2 = false;
        this.box3 = false;
        this.crimeRegionVisible = true;
        this.crimeTypeVisible = true;
        this.dimensionType = '1';
        this.defaultProvinceId = '';  // 清空犯罪区域的值
        this.defaultCrimeTypeId = ''; // 清空犯罪类型的值
        await this.setCharXAxisCrimeRegion();
    }
    /**
     * 设置柱状图，犯罪时间为x轴，表格datasource，柱状图标题
     */
    async  setChartXAxisCrimeDate() {
        await this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }
    /**
     * 设置柱状图，犯罪类型为x轴，表格datasource
     */
    async setCharXAxisCrimeType() {
        await this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }
    /**
    * 设置柱状图，犯罪区域为x轴，表格datasource
    */
    async setCharXAxisCrimeRegion() {
        await this.getCrimeStatisticsData(this.reportCrimeParamModel);
    }
    /**
     * 犯罪区域和犯罪时间
     * @memberof StatisticsCrimeinfoComponent
     */
    async  setChartTitleByCrimeDate() {
        let timeTitle = await this.formatInputTimeForTitle();
        if (this.reportCrimeParamModel.crimeRegionName === '') {
            this.echartsTitle = timeTitle + ' ' + this.translates['ALL'];
        }
        if (this.reportCrimeParamModel.crimeRegionName !== '') {
            this.echartsTitle = timeTitle + ' ' + this.currentSelectedProvince;
        }
    }
    /**
     * 犯罪区域和犯罪类型
     * @memberof StatisticsCrimeinfoComponent
     */
    async setChartTitleByCrimRegion() {
        let timeTitle = await this.formatInputTimeForTitle();
        if (this.utilHelper.AssertNotNull(this.defaultCrimeTypeId)) {
            this.currentSelectedCrimeType = asEnumerable(this.crimeTypeList).Where(x => x.crimeTypeId === this.defaultCrimeTypeId)
                .Select(x => x.crimeTypeName).ToArray().toString();
        } else {
            this.currentSelectedCrimeType = this.translates['ALL'];
        }
        if (this.reportCrimeParamModel.crimeTypeId === '' && this.reportCrimeParamModel.crimeRegionName === '') {
            this.echartsTitle = timeTitle + ' ' + this.translates['ALL'];
        } else if (this.reportCrimeParamModel.crimeTypeId === '' && this.reportCrimeParamModel.crimeRegionName !== '') {
            this.echartsTitle = timeTitle + ' ' + this.currentSelectedProvince;
        } else if (this.reportCrimeParamModel.crimeTypeId !== '' && this.reportCrimeParamModel.crimeRegionName === '') {
            this.echartsTitle = timeTitle + this.translates['ALL'];
        } else {
            this.echartsTitle = timeTitle + ' ' + this.currentSelectedProvince + ' ' + this.currentSelectedCrimeType;
        }
    }
    /**
     * 犯罪类型和犯罪时间
     * @memberof StatisticsCrimeinfoComponent
     */
    async setChartTitleByCrimType() {
        let timeTitle = await this.formatInputTimeForTitle();
        if (this.reportCrimeParamModel.crimeTypeId === '') {
            this.echartsTitle = timeTitle + ' ' + this.translates['ALL']
                ;
        } else {
            this.echartsTitle = timeTitle + ' ' + this.translates['ALL']
                + ' ' + this.currentSelectedCrimeType;
        }
    }
    /**
    *格式化输入的统计时间，用作标题拼接
    */
    async formatInputTimeForTitle() {
        let dateString = '';
        switch (this.currentStatisticsType) {
            case StatisticsType.currentYear:
                dateString = new Date().getFullYear().toString() + this.translates['year'];
                break;
            case StatisticsType.currentMonth:
                dateString = moment(new Date()).format('YYYY') + this.translates['year']
                    + moment(new Date()).format('MM') + this.translates['month'];
                break;
            case StatisticsType.currentDay:
                dateString = moment(new Date()).format('YYYY') + this.translates['year']
                    + moment(new Date()).format('MM') + this.translates['month']
                    + moment(new Date()).format('DD') + this.translates['day'];
                break;
            case StatisticsType.customYear:
                dateString = moment(this.customStartTime).format('YYYY') + this.translates['year']
                    + '-' + moment(this.customEndTime).format('YYYY')
                    + this.translates['year'];
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
        }
        return dateString;
    }

    /**
     * 创建柱状图表
     *
     * @memberof StatisticsPersonalComponent
     */
    creatChart(titleText: string, xAxisData: any, seriesData: any, colorBar) {
        this.chart.clear();
        // 1.首先获取数据
        this.chart.showLoading();
        let options = {
            title: {
                text: this.translates['crimeInfo-statistics-chart'],
                subtext: titleText,
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
                data: [this.translates['count']],
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
                    type: 'category',
                    boundaryGap: true,
                    gridIndex: 1,
                    data: xAxisData,
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
                    name: this.translates['item'],
                    gridIndex: 1,
                    axisLabel: {
                        formatter: this.numberConvertService.convert // 纵轴
                    },
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
                    name: this.translates['count'],
                    type: this.seriesType,
                    data: seriesData,
                    itemStyle: {
                        normal: {
                            color: colorBar
                        }
                    }
                }
            ]
        };
        this.chart.hideLoading();
        this.chart.setOption(options);
    }
    /**
    * 路由绑定header路径
    */
    private bindRoutUrl(parentUrl: string, childrenUrl: string) {
        this.eventAggregator.publish('routUrl', [parentUrl, childrenUrl]);
    }
    /**
     * 获取犯罪类型
     */
    private async getCrimeTypeList() {
        let result = await this.statisticsAnalysisService.getCrimeTypeList();
        if (this.utilHelper.AssertNotNull(result)) {
            this.crimeTypeList = this.crimeTypeList.concat(result);
        }
    }
    /**
     * 获取省数据
     *
     * @private
     */
    private async getProvinceList() {
        let result = await this.statisticsAnalysisService.getProviceOffice();
        if (this.utilHelper.AssertNotNull(result)) {
            this.provinceList = this.provinceList.concat(result);
        }
    }
    /**
     * 表格行列
     */
    setPivotGridDataSource(data: any) {
        return this.dataSource = {
            fields: [{
                dataField: 'coord_X',
                width: 150,
                area: 'row',
                sortOrder: '',
                sortingMethod: () => {
                    return '';
                }
            }, {
                dataField: 'coord_Y',
                dataType: 'string',
                area: 'column'
            }, {
                caption: this.translates['count'],
                dataField: 'count',
                dataType: 'number',
                summaryType: 'sum',
                area: 'data'
            }],
            store: data
        };
    }
}
