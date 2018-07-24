/**
 * 证书打印信息
 * Created by xuqicai on 2017/10/20.
 * @export
 * @class CertificateInfo
 */
export class CertificateInfo {
    /**
     * 主键
     */
    public certificateId: string;
    // 申请Id
    public applyId: string;
    // 证书状态
    public certificateStatus: string;
    // 失效时间
    public invalidTime: Date;
    // 创建人
    public createPersonName: string;
    // 修改时间
    public modifyTime: Date;
    // 修改人
    public modifyPersonName: string;
    // 验证号
    public validateCode: string;
    // 打印时间
    public printTime: Date;
    // 证书文件（mongodb中文件id）
    public attachmentId: string;
    // 证书类型
    public certificateType: string;
    // 是否有效
    public valid: boolean;

    constructor() { }
}
