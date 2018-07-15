/**
 * 当前登录用户信息
 */
export class UserInfo {
    /**
     * 账户名
     * @type {string}
     * @memberof CurrentUserInfo
     */
    public userName: string;
    /**
     * 账户密码
     * @type {string}
     * @memberof CurrentUserInfo
     */
    public password: string;
    /**
     * 账户使用人姓名
     * @type {string}
     * @memberof CurrentUserInfo
     */
    public personName: string;
    /**
     * 访问授权码
     * @type {string}
     * @memberof CurrentUserInfo
     */
    public token: string;
    /**
     * 访问系统名
     * @type {string}
     * @memberof CurrentUserInfo
     */
    public accessSystem: string;
    /**
     *  返回系统编号
     * @type {string}
     * @memberof CurrentUserInfo
     */
    public accessSystemId: string;
    /**
     * 角色名
     * @type {string}
     * @memberof CurrentUserInfo
     */
    public roleName: string;
    /**
     *  角色编号
     * @type {string}
     * @memberof CurrentUserInfo
     */
    public roleId: string;
    /**
     *  角色类型
     * @type {RoleType}
     * @memberof UserInfo
     */
    public roleType: string;
    /**
     * 角色Code
     */
    public roleCode: string;
    /**
     * 人员编号
     */
    public orgPersonId: string;
    /**
     * 中心编码
     *
     */
    public centerCode: string;

    /**
     * 中心编码名称
     *
     */
    public centerCodeName: string;
    /**
     * 采集点所在省
     */
    public applyCenterProvince: string;
    public personImg: string;
    constructor() {

    }
}
/**
 * 角色类型
 * 操作员
 * 分析员
 * 审核员
 * 归档员
 * 业务监控席
 * 系统管理员
 */
export enum RoleType {
    OPERATOR = 0, ANALYST = 1, AUDITOR = 2, FILER = 3, MONITOR = 4, CRIMESM = 5
}
