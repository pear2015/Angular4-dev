import { ApplyInfo } from './ApplyInfo';
import { ApplyBasicInfo } from './ApplyBasicInfo';
import { AttachmentInfo } from '../common/AttachmentInfo';
import { ApplyAndCriminalRelation } from './ApplyAndCriminalRelation';
/**
 * 申请信息，申请基本信息，附件信息，申请公告关联DTO
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class CertificateApplyInfo
 */
export class CertificateApplyInfo {
    // 申请人
    public applyBasicInfo: ApplyBasicInfo;
    // 申请
    public applyInfo: ApplyInfo;
    // 附件ID列表
    public attachmentInfoList: AttachmentInfo[];
    // 申请和公告关联
    public applyAndCriminalRelation: ApplyAndCriminalRelation;

    constructor(applyBasicInfo: ApplyBasicInfo, applyInfo: ApplyInfo,
        attachmentInfoList: AttachmentInfo[], applyAndCriminalRelation: ApplyAndCriminalRelation) {
        this.applyBasicInfo = applyBasicInfo;
        this.applyInfo = applyInfo;
        this.attachmentInfoList = attachmentInfoList;
        this.applyAndCriminalRelation = applyAndCriminalRelation;
    }
}
