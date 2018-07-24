/**
 *
 * 分析人物和分析员用户关联DTO
 * Created by zhangqiang on 2017/8/31.
 * @export
 * @class ApplyAndAnalystRelation
 */
export class ApplyAndAnalystRelation {
    // 申请信息ID
    public applyInfoId: string;
    // 分析员ID
    public analystId: string;
    /**
     * 审核员ID
     */
    public auditorId: string;
    /**
     * 分析任务是新建还是驳回0新建1驳回
     */
    public analysisResultFail: number;
    /**
     * 创建时间
     */
    public createTime: Date;
    constructor() { }
}
