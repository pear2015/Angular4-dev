import { SortOrder } from '../common/SortOrder';
/**
 * 匹配人员列表分页model
 *
 * @export
 * @class ApplyPersonQuery
 *
 */
export class ApplyPersonQuery {
    public firstName: string;
    public lastName: string;
    public sexId: string;
    public certificateId: string;
    public certificateType: string;
    public pages: number;
    public pageSize: number;
    public sortOrder: SortOrder[];
    constructor() { }
}
