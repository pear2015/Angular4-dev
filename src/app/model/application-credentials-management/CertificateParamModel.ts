import { SortOrder } from '../common/SortOrder';
export class CertificateParamModel {
    // 证书编号
    public certificateId: string;
    // 验证码
    public authCode: string;
    // 名
    public firstName: string;
    // 姓
    public lastName: string;
    // 身份证
    public certificateNum: string;
    // 申请编号
    public applyId: string;
    // 政府名称
    public govermentInfo: string;
    // 证书类型
    public certificateType: string;
    // 申请状态
    public certificateStatus: string;
    // 申请类型
    public printTime: Date;
    // 打印开始时间
    public printStartTime: Date;
    // 证书结束时间
    public printEndTime: Date;
    // 单页数据量
    public pageSize: number;
    // 页数索引
    public pages: number;
    // 排序规则
    public sortOrder: SortOrder[];

    constructor() { }

}
