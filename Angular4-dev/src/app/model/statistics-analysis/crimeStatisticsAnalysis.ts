

/**
 * 犯罪公告和信息计分析
 */
export class CriminalNoticeInfoStatistics {
    /**
     * 办理用途
     */
    public applyPurposeId: string;
    /**
     * 办理结果
     */
    public applyResultId: string;
    /**
     * 申请类型
     */
    public applyTypeId: string;
    /**
   * 时间枚举类型
   */
    public dateType: any;
    /**
     * 自定义日期开始时间
     */
    public startDate: any;
    /**
    * 自定义日期结束时间
    */
    public endDate: any;
    /**
    * 时间点: 年:[yyyy];月:[yyyy-MM];日:[yyyy-MM-dd]
    */
    public timePoint: any;
    /**
    * 政府名称
    */
    public govermentInfo: string;
    /**
    * 法院
    */
    public courts: string[];
    /**
    * 犯罪类型
    */
    public crimeTypes: string[];
    /**
    * 中心编码
    */
    public centerCodes: string[];
    /**
     * 采集点Id
     */
    public fo: string;
}
