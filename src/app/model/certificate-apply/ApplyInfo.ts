/**
 * 申请基本信息DTO
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class ApplyInfo
 */
export class ApplyInfo {
    public applyId: string;
    public analysisDescription: string;
    public analysisPersonName: string;
    public analysisResultId: string;
    public analysisTime: Date;
    public applyBasicId: string;
    // 采集点名称
    public applyCenterName: string;
    // 采集点中心编码
    public applyCenterId: string;
    // 申请描述
    public applyDescription: string;
    // 申请目的
    public applyPurposeId: string;
    // 申请状态
    public applyStatusId: string;
    // 申请时间
    public applyTime: Date;
    // 申请类型ID
    public applyTypeId: string;
    // 附件ID
    public attchmentId: string;
    // 审核描述
    public auditDescription: string;
    // 审核人姓名
    public auditPersonName: string;
    // 审核结果ID
    public auditResultId: string;
    // 审核和结果时间
    public auditTime: Date;
    // 回执单号
    public deliveryReceiptNumbr: string;
    // 城市名称
    public cityName: string;
    // 国家名称
    public countryName: string;
    // 社区名称
    public communityName: string;
    // 是否有犯罪记录
    public crimeRecord: number;
    // 政府机构名称
    public govermentInfo: string;
    // 政府申请流程号
    public govermentProcess: string;
    // 修改描述
    public modifyDescription: string;
    // 修改人
    public modifyPersonName: string;
    // 修改时间
    public modifyTime: Date;
    // 备注
    public note: string;
    // 省名称
    public provinceName: string;
    // 申请人类型
    public applyPersonType: string;
    // 代理人证件号码
    public agentIdNumber: string;
    // 代理人证件类型
    public agentIdType: string;
    // 代理人证件类型名称
    public agentIdTypeName: string;
    // 其他目的原因
    public otherPurposeReason: string;
    // 审核不通过原因
    public auditRejectReason: string;
    // 申请目的原因
    public applyPurposeName: string;
    // 申请状态名称
    public applyStatusName: string;
    // 申请类型名称
    public applyTypeName: string;
    // 录入人姓名
    public enteringPersonName: string;
    // 分析结果名称
    public analysisResultName: string;
    // 审核结果名称
    public auditResultName: string;
    // 申请结果ID
    public applyResultId: string;
    // 申请结果名称
    public applyResultName: string;
    // 优先级
    public priority: string;
    // 优先级名称
    public priorityName: string;
    // 录入员ID
    public enteringPersonId: string;
    // 分析员ID
    public analysisPersonId: string;
    // 审核员ID
    public auditPersonId;
    // 姓
    public lastName: string;
    //  名
    public firstName: string;
    // 证件编号
    public certificateNumber: string;
    // 证件类型
    public certificateType: string;
    // 分派时间
    public apportionTime: Date;
    /**
   * 采集点所在省
   */
    public applyCenterProvince: string;
    constructor() { }
}
