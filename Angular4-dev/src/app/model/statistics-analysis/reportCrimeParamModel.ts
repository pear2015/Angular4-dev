/**
 * 犯罪信息统计、犯罪类型分析、犯罪公告统计查询model
 * create by zhangqiang 2017/11/22
 * @export
 * @class ReportCrimeParamModel
 */
export class ReportCrimeParamModel {
    // "日期类型:[1]:按年;[2]:按月;[3]按天;[4]:自定义年;[5]:自定义月;[6]:自定义日")
    public dateType: any;
    // "自定义日期开始时间")
    public startDate: any;
    // "自定义日期结束时间")
    public endDate: any;
    //  "采集点Id")
    public fo: string;
    // "法院Id")
    public courtId;
    //  "犯罪类型")
    public crimeTypeId: string;
    // value = "犯罪区域Id")
    public crimeRegionId: string;
      // value = "犯罪区域name")
    public crimeRegionName: string;
    // "时间点: 年:[yyyy];月:[yyyy-MM];日:[yyyy-MM-dd]")
    public timePoint: Date;
    constructor() { }
}
