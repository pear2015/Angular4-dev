/**
 * 业务操作日志
 */
export class OperationLog {
  /**
   * 业务动作 ADD/UPDATE/DELETE/QUERY
   */
  public action: string;
  /**
   * 动作描述
   */
  public actionDesc: string;
  /**
   * 业务名称
   */
  public business: string;
  /**
   * 是否批量操作
   */
  public isBatchAction: boolean;
  /**
   * 日志等级
   */
  public level: string;
  /**
   * 系统模块
   */
  public module: string;
  /**
   * 新内容
   */
  public newContent: string;
  /**
   * 源实体内容
   */
  public oldContent: string;
  /**
   * 操作时间
   */
  public operateDate: string;
  /**
   * 操作ip
   */
  public operationIp: string;
  /**
   * 操作人名
   */
  public operator: string;
  /**
   * 操作人id
   */
  public operatorId: string;
  /**
   * 系统名称
   */
  public system: string;
}
