import { SortOrder } from '../common/SortOrder';
/**
 * 申请人匹配犯罪公告列表
 *
 * @export
 * @class CrimeNoticeQuery
 */
export class CrimeNoticeQuery {
    public certificateType: string;
    public certificateNumber: string;
    public firstName: string;
    public lastName: string;
    public sexId: string;
    public pages: number;
    public pageSize: number;
    public sortOrder: SortOrder[];
    constructor() { }
}
