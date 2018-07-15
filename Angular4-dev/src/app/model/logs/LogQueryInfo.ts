/**
 * 日志信息搜索对象
 */
export class LogQueryInfo {
    /**
     * 业务动作 ADD/UPDATE/DELETE/QUERY
     */
    public action: string;
    /**
     * 操作人员
     */
    public operator: string;
    /**
     * 开始时间
     */
    public startOperateDate: string;
    /**
     * 结束时间
     */
    public endOperationDate: string;
    /**
     * 当前页数，默认1
     */
    public pages: number;
    /**
     * 查询条数，默认10
     */
    public size: number;
    /**
     * 日志产生模块
     */
    public module: string;
     /**
      *  日志产生系统
      */
    public system: string;
}
