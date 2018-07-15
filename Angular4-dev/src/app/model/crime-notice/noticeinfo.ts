/**
 * 公告信息DTO
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class NoticeInfo
 */
export class NoticeInfo {
    /**
 * 公告id
 * */
    public noticeId: string;
    /**
     * 犯罪人Id
     * */
    public crimePersonId: string;
    /**
     * 犯罪信息id
     */
    public crimeId: string;
    /***
     *法院id
     */
    public courtId: string;
    /**
     * 公告号
     */
    public noticeNumber: string;
    /**
     * 公告发布时间
     */
    public noticeCreateTime: Date;

    /**
     * 公告描述
     */
    public noticeDescription: string;
    /**
     备注
      */
    public note: string;
    /**
     附件ID集合以,分隔 如：aaa,bbb,ccc
      */
    public attchmentId: string;
    /**
     * 录入意见
     */
    public noticeInputStatus: string;

    /**
     * 拒绝录入原因
     */
    public rejectEnterReason: string;

    /**
     * 优先级
     */
    public priority: string;

    /**
     * 优先级名称
     */
    public priorityName: string;

    /**
     * 删除标志（0代表保存、1代表删除）
     */
    public isActive: string;

    /**
     * 公告状态
     */
    public status: string;

    /**
     * 审核员ID
     */
    public auditPersonId: string;

    /**
     * 审核员姓名
     */
    public auditPersonName: string;
    /**
     * 审核结果ID
     */
    public auditResultId: string;
    /**
     * 审核结果名称
     * @type {string}
     * @memberof NoticeInfo
     */
    public auditResultName: string;
    /**
     * 审核时间
     */
    public auditTime: Date;
    /**
     * 审核描述
     */
    public auditDescription: string;
    /**
     * 录入人ID
     */
    public enterPersonId: string;
    /**
     * 录入时间
     */
    public enteringTime: Date;
    /**
     * 录入人员姓名
     */
    public enteringPersonName: string;

    // 匹配度
    public point: string;

    // 法院名称
    public courtName: string;

    // 是否是回填信息
    public isBack: string;

    public noticeInputStatusName: string;
   // 状态名称
    public statusName: string;
     // 分派时间
    public apportionTime: Date;

    constructor() { }
}

    // // 公告ID
    // public noticeID: string:
    // // 罪犯ID
    // public crimePersonID: string:
    // // 犯罪ID
    // public crimeID: string:
    // // 法院ID
    // public courtID: string:
    // // 法院名称
    // public courtName: string:
    // // 公告组ID
    // public groupID: string:
    // // 公告组名称
    // public groupName: string:
    // // 公告编号
    // public noticeNumber: string:
    // // 公告发布时间
    // public noticeCreateTime: Date:
    // // 公告录入人
    // public enteringPersonName: string:
    // public modifyTime: Date:
    // public modifyPersonName: string:
    // // 公告描述
    // public noticeDescription: string:
    // // 备注
    // public note: string:
    // // 录入时间
    // public enteringTime: Date:
    // // 附件ID
    // public attchmentID: string:
