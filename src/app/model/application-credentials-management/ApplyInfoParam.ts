import { SortOrder } from '../common/SortOrder';
export class ApplyInfoParam {
    // 证件号码
    public certificateNum: string;
    // 名
    public firstName: string;
    // 姓
    public lastName: string;
    // 申请ID
    public applyId: string;
    // 申请状态
    public applyStatus: string;
    // 回执单号
    public deliveryReceiptNumbr: string;
    // 申请时间开始时间
    public applyStartTime: Date;
    // 申请时间结束时间
    public applyEndTime: Date;
    // 申请目的
    public applyPurpose: string;
    // 申请类型
    public applyType: string;
    // 单页数据量
    public pageSize: number;
    // 页数索引
    public pages: number;
    // 排序规则
    public sortOrder: SortOrder[];
    // 审核人
    public auditPersonId: string;
    constructor() { }
}
