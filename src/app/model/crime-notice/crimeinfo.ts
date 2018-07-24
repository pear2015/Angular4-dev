/**
 * 犯罪信息DTO
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class CrimeInfo
 */
export class CrimeInfo {
  /**
   * 主键ID
   */
  public crimeId: string;

  /**
   * 诉讼号
   */
  public litigationNumber: string;

  /**
   * 犯罪描述
   */
  public crimeDescription: string;
  /**
   * 犯罪区域id
   */
  public crimeRegionId: string;
  /**
   * 犯罪区域名称
   */
  public crimeRegionName: string;

  /**
   * 简要案情 描述
   */
  public description: string;
  /**
   * 判决罪名类型Id
   */
  public crimeNameTypeId: string;
  /**
   * 判决罪名名称
   */
  public crimeName: string;
  /**
   * 判决类型id
   */
  public crimeTypeId: string;
  /**
   * 判决类型名称
   */
  public crimeTypeName: string;
  /**
   * 判决依据
   */
  public crimeResult: string;
  /**
   * 法院判决时间
   */
  public crimeJudgeTime: Date;

  /**
   * 删除标志
   */
  public isActive: string;
  /**
   * 录入人id
   */
  public enterPersonId: string;
  /**
   * 录入时间
   */
  public enteringTime: Date;
  /**
   * 录入人名称
   */
  public enteringPersonName: string;

  // 匹配度
  public point: any;

  public crimeTime: Date;

  constructor() { }
}
