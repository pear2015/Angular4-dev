/**
 * 发送给服务端socket消息体
 * Created by zhangqiang on 2017/9/2.
 * @export
 * @class NoticeMessage
 */
export class NoticeMessage {
    /**
     * id
     */
    public id: string;
    /**
     * 消息体
     */
    public content: string;
    /**
     * 创建的时间
     */
    public time: Date;
    /**
     * 发送人
     */
    public senderId: string;
    /**
    * 发送人图片
    */
    public senderImg: string;
    /**
     * 发送人名称
     */
    public senderName: string;
    /**
     * 接收人
     */
    public receiverId: string;
    /**
     * 已读
     */
    public isRead: boolean = false;
    /**
     * 订阅的事件名称
     */
    public event: string;
    /**
     * 消息类型
     */
    public messageType: string;

    /**
    * 业务key
    */
    public businessKey: string;
    /**
     * 时区时间
     */
    public zoneTime: String;

    constructor() { }
}
/**
 * 消息路由类型
 * 个人申请 分析员首次申请
 * 个人申请 分析员处理驳回申请
 * 个人申请 审核员审核分派
 * 个人申请 审核通过
 * 政府申请 分派审核员
 * 政府申请 分析员处理驳回
 * 政府申请 政府申请结束
 * 个人申请 待打印
 * 政府申请 待打印
 * 公告申请 审核员待分派
 * 公告申请  审核拒绝
 * 公告申请  审核通过
 */
export enum MessageType {
    PERSON_APPLY_ANALYST = 0,
    PERSON_APPLY_AUDITOR_REFUSE = 1,
    PERSON_APPLY_AUDITOR_START = 2,
    PERSON_APPLY_END = 3,
    GOVERNMENT_APPLY_AUDITOR_START = 4,
    GOVERNMENT_AUDITOR_REFUSE = 5,
    GOVERMENT_AUDITOR_END = 6,
    PERSON_APPLY_READY_PRINT = 7,
    GOVERMENT_APPLY_READY_PRINT = 8,
    NOTICE_APPLY_AUDITOR_START = 9,
    NOTICE_AUDITOR_REFUSE = 10,
    NOTICE_AUDITOR_END = 11
}


