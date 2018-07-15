import { CertificateApplyInfo } from './CertificateApplyInfo';
import { CrimeAndNoticeExtendInfo } from '../crime-notice/crimeAndNoticeExtendInfo';
/**
 * 包含犯罪公告和申请详情的model
 *
 * @export
 * @class ApplicationDetailAndNotice
 */

export class ApplicationDetailAndNotice {
    /// 申请，申请人，附件
    public certificateApplyInfo: CertificateApplyInfo;
    // 公告，罪犯，犯罪，附件
    public crimeAndNoticeExtendInfo: CrimeAndNoticeExtendInfo[];

    constructor() { }
}
