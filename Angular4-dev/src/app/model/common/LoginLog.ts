/**
 * 登陆登出日志
 * Create By zhangqiang 2017/11/2
 * @export
 * @class LoginLog
 */
export class LoginLog {
    /**
     * 主键ID
     */
    public id: string;

    /**
     * 登陆时间
     */
    public loginTime: Date;

    /**
     * 登出时间
     */
    public loginOutTime: Date;

    /**
     * 时间差 单位：分钟（登录时间登出时间）
     */
    public timeSpan: number;

    /**
     * 人员ID
     */
    public userId: string;

    /**
     * 中心编码
     */
    public centerCode: string;
    /**
     * 中心名称
     */
    public centerName: string;

    constructor() { }
}
