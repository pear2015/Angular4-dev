import { CrimeInfo } from './CrimeInfo';
import { CrimePersonInfo } from './CrimePersonInfo';
import { NoticeInfo } from './NoticeInfo';
import { AttachmentInfo } from '../common/AttachmentInfo';
/**
 * 公告信息，犯罪信息，犯罪人员基本信息，附件列表DTO
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class CrimeAndNoticeExtendInfo
 */
export class CrimeAndNoticeExtendInfo {

    public crimeInfo: CrimeInfo;  //  犯罪信息
    public crimePersonInfo: CrimePersonInfo;  // 犯罪人信息
    public noticeInfo: NoticeInfo; // 犯罪公告信息
    public attachmentInfo: AttachmentInfo[]; // 附件列表DTO
    public waitCriminalIds: string[]; // 带合并罪犯Id列表

    /**
     * 带参数的构造函数需要初始化
     * @param crimeInfo
     * @param crimePersonInfo
     * @param noticeInfo
     * @param attachmentInfo
     */
    constructor(
        crimeInfo: CrimeInfo,
        crimePersonInfo: CrimePersonInfo,
        noticeInfo: NoticeInfo,
        attachmentInfo: AttachmentInfo[],
        waitCriminalIds: string[]
    ) {
        this.crimeInfo = crimeInfo;
        this.crimePersonInfo = crimePersonInfo;
        this.noticeInfo = noticeInfo;
        this.attachmentInfo = attachmentInfo;
        this.waitCriminalIds = waitCriminalIds;
    }
}
