import { SortOrder } from '../common/SortOrder';
/**
 * Created By zhangqiang 2017/10-17
 * 犯罪信息查询Model
 * 根据个人信息
 * @export
 * @class CrimePersonQuery
 */
export class CrimePersonQuery {
    // 名
    public firstName: string;

    // 姓
    public lastName: string;

    // 父亲的名
    public fatherFirstName: string;

    // 父亲的姓
    public fatherLastName: string;

    // 母亲的名
    public motherFirstName: string;

    // 母亲的姓
    public motherLastName: string;

    // 出生日期
    public dateOfBirth: Date;

    // 证件号码
    public certificateNumber: string;

    // 单页数据量
    public pageSize: number;

    // 页数索引
    public pages: number;

    // 排序规则集合
    public sortOrder: SortOrder[];

    constructor() { }
}
