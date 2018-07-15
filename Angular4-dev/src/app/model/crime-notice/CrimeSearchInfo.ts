import { SortOrder } from '../common/SortOrder';
/**
 * 公告信息搜素体DTO
 * Created by zhengyali on 2017/8/23.
 * @export
 * @class NoticeQueryInfo
 */
export class CrimeSearchInfo {
  /**
 * 公告编号
 */
  public noticeNumber: string;
  /**
   * 法院
   */
  public courtId: string;
  /**
   * 公告录入开始时间
   */
  public enteringTime: Date;

  /**
   * 角色类型
   */
  public roleType: string;
  /**
  * 用户ID
  */
  public enterPersonId: string;

  /**
   * 证件编号
   */
  public certificateNumber: string;

  /**
   * 页码
   */
  public pages: Number;
  /**
   * 每页页码
   */
  public pageSize: Number;

  /**
   *公告状态
   */
  public noticeStatus: string;


  /**
     *创建人员
     */
  public enterPersonName: string;

  /**
   * 排序规则
   */
  public sortOrders: SortOrder[];

  /**
 *查询公告开始时间
 */
  public startNoticeCreateTime: Date;

  /**
   *查询公告结束时间
   */
  public endNoticeCreateTime: Date;

  /**
      * 审核员Id
      */
  public auditPersonId: string;
  constructor() { }
}
  // // 公告编号
  // public noticeNumber: string;
  // // 法院ID
  // public courtID: string;
  // // 开始时间
  // public enteringBeginTime: Date;
  // // 结束时间
  // public enteringEndTime: Date;

  // /**
  //   * 页码
  //   */
  // public pages: number;

  // /**
  //  * 每页页码
  //  */
  // public pageSize: number;
  // /**
  //  * 排序规则
  //  */
  // public sortOrders: SortOrder[];
