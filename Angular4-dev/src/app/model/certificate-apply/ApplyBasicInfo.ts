/**
 * 申请人基本信息DTO
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class ApplyBasicInfo
 */
export class ApplyBasicInfo {
    // 申请人ID
    public applyBasicId: string;

    /**
     * 年龄
     */
    public age: number;
    /**
     * 学历
     */
    public careerId: string;
      /**
     * 学历名称
     */
    public careerName: string;
    /**
     * 证件编号
     *
     */
    public certificateNumber: string;
    /**
     * 证件类型
     *
     */
    public certificateType: string;
    /**
     * 证件有效期
     *
     */
    public certificateValidity: string;
    /**
     * 城市名
     *
     */
    public cityName: string;
    /**
     * 社区名
     *
     */
    public communityName: string;
    /**
     * 联系电话
     *
     */
    public contractPhone: string;
    /**
     * 国籍
     *
     */
    // public countryName: string;
    /**
     * 描述
     *
     */
    public description: string;
    /**
     * 详细地址
     *
     */
    public detailAddress: string;
    /**
     * 名
     *
     */
    public firstName: string;
    /**
     * 父亲名
     */
    public fatherFirstName: string;
    /**
     * 父亲姓
     *
     */
    public fatherLastName: string;
    /**
     * 父亲发音
     *
     */
    public fatherNameSoundex: string;
    /**
     * 姓
     *
     */
    public lastName: string;
    /**
     * 婚姻状态
     *
     */
    public marriageId: string;
    /**
     * 母亲名
     *
     */
    public motherFirstName: string;
    /**
     * 母亲姓
     *
     */
    public motherLastName: string;
    /**
     * 母亲发音
     *
     */
    public motherNameSoundex: string;
    /**
     * 民族
     *
     */
    public nation: string;
    /**
     * 其他特征
     *
     */
    public otherFeature: string;
    /**
     * 职业
     *
     */
    public profession: string;
    /**
     * 省份
     *
     */
    public provinceName: string;
    /**
     * 性别
     *
     */
    public sexId: string;
    /**
     * 出生日期
     *
     */
    public dateOfBirth: Date;
    /**
     * 国籍
     *
     */
    public countryOfCitizenship: string;
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
     * 性别名称
     *
     */
    public sexName: string;
    /**
     * 婚姻状态
     *
     */
    public marriageName: string;
    /**
     * 证件名称
     *
     */
    public certificateName: string;
    /**
     * 申请人照片
     *
     */
    public registrationPhoto: any;
    /**
     * 当前居住国家
     *
     */
    public livingCountryName: string;
    /**
     * 当前居住省
     *
     */
    public livingProvinceName: string;
    /**
     * 当前居住城市
     *
     */
    public livingCityName: string;
    /**
     * 当前居住社区
     *
     */
    public livingCommunityName: string;
    /**
    * 母亲身份证号码
     */
    public motherCertificateNumber: string;
    /**
     * 父亲身份证号码
     */
    public fatherCertificateNumber: string;


    constructor() { }
}
