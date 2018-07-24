/**
 * 犯罪人员基本信息DTO
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class CrimePersonInfo
 */
export class CrimePersonInfo {
  /**
  * 主键ID
  */
  public crimePersonId: string;
  /**
   * 性别ID
   */
  public sexId: string;
  /**
   * 性别名称
   */
  public sexName: string;
  /**
   * 婚姻
   */
  public marriageId: string;

  /**
   * 婚姻名称
   */
  public marriageName: string;

  /**
   * 姓
   */
  public firstName: string;
  /**
   * 名
   */

  public lastName: string;
  /**
   * 证件号码
   */

  public certificateNumber: string;

  /**
   * 证件类型
   */

  public certificateType: string;

  /**
   * 证件有效期
   */
  public certificateValidity: string;

  /**
  * 证件颁发地
  *
  */
  public credentialsIssuePlace: string;
  /**
   * 证件颁发日期
   *
   */
  public credentialsIssueDate: Date;

  /**
   * 年龄
   */

  public age: Number;

  /**
   * 身高
   */

  public height: Number;

  /**
   * 鼻型
   */
  public noseType: string;

  /**
   * 职业
   */
  public profession: string;

  /**
   * 联系电话
   */
  public contractPhone: string;

  /**
   * 眼睛颜色
   */
  public eyeColor: string;

  /**
   * 肤色
   */

  public skinColor: string;

  /**
   * 头发颜色
   */
  public hairColor: string;

  /**
   * 民族
   */

  public nation: string;
    /**
     * 学历
     */
    public careerId: string;
      /**
     * 学历名称
     */
    public careerName: string;

  /**
   * 其他特征
   */
  public otherFeature: string;

  /**
   * 母亲名
   */
  public motherLastName: string;
  /**
   * 母亲姓
   */
  public motherFirstName: string;
  /**
   * 母亲姓名发音
   */
  public motherNameSoundex: string;

  /**
   * 父亲名
   */
  public fatherLastName: string;
  /**
   * 父亲姓
   */
  public fatherFirstName: string;

  /**
   * 父亲姓名发音
   */
  public fatherNameSoundex: string;
  /**
   * 出生国家名称
   */
  public countryName: string;

  /**
   * 出生省名称
   */
  public provinceName: string;
  /**
   * 出生市名称
   */
  public cityName: string;
  /**
   * 出生社区名称
   */

  public communityName: string;
  /**
   * 出生详细地址
   */
  public detailAddress: string;
  /**
   * 描述
   */
  public description: string;

  /**
   * 登记照片
   */

  public registrationPhoto: any;

  /**
   * 出生日期
   */

  public dateOfBirth: Date;

  /**
   * 居住国家
   */
  public livingCountryName: string;
  /**
   * 居住省
   */

  public livingProvinceName: string;
  /**
   * 居住城市
   */

  public livingCityName: string;
  /**
   * 居住社区
   */

  public livingCommunityName: string;
  /**
   * 删除标志
   */

  public isActive: string;
  /**
   * 录入人ID
   */
  public enterPersonId: string;
  /**
   * 录入时间
   */
  public enteringTime: Date;
  /**
   * 录入人员姓名
   */
  public enteringPersonName: string;
  /**
   * 是否是回填
   */
  public isBack: string;
  /**
    * 个人档案编号
    */
  public archivesCode: string;

  /**
   * 回填罪犯Id
   */
  public backFillCriminalId: string;

  /**
   * 合并状态：0，合并完成。1.正在合并
   */
  public isMerging: string;
  /**
   * 匹配度
   */
  public point: string;
  /**
   * 姓名
   */
  public name: string;
  /**
   * 是否选中
   */
  public isChecked: boolean;
  /**
   * 是否选中标记
   */
  public isCheckedflag: boolean;
  /**
   * 是否失效
   */
  public isCheckedDisabled: boolean;
  /**
   * 公告创建建时间
   */
  public noticeCreateTime: any;
  /**
   * 母亲身份证号码
   */
  public motherCertificateNumber: string;
  /**
   * 父亲身份证号码
   */
  public fatherCertificateNumber: string;
  /**
   * 姓名
   */
  public ciminalName: string;
  // 是否可选
  public redOrGreen: boolean;
  constructor() { }
}
