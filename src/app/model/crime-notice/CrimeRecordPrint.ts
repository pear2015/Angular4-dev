import { CrimeInfo } from './CrimeInfo';
import { NoticeInfo } from './NoticeInfo';
/**
 * 犯罪公告打印
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class CrimeAndNoticeExtendInfo
 */
export class CrimeRecordPrint {

    public crimeInfo: CrimeInfo;  //  犯罪信息
    public noticeInfo: NoticeInfo; // 犯罪公告信息

    constructor(crimeInfo: CrimeInfo, noticeInfo: NoticeInfo) {
        this.crimeInfo = crimeInfo;
        this.noticeInfo = noticeInfo;
    }
}
