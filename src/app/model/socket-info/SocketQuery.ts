/**
 * 建立socket时的查询参数
 *
 * @export
 * @class SocketQuery
 */
export class SocketQuery {
    // 用户ID
    public userId: string;
    // 用户状态：0-空闲,1-忙碌
    public status: string;
    // 中心编码
    public centerCode: string;
    // 用户名称
    public userName: string;
    // 用户类型：0：操作员，1：分析员，2：审核员
    public roleType: string;
    constructor(userId: string, userName: string, roleType: string , centerCode: string) {
        this.userId = userId;
        this.status = status;
        this.userName = userName;
        this.centerCode = centerCode;
        this.roleType = roleType;
    }
}
