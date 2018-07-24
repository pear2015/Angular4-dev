/**
 * 附件基本信息DTO
 * Created by zhangqiang on 2017/8/23.
 * @export
 * @class AttachmentInfo
 */
export class AttachmentInfo {
    // 附件ID
    public attachmentId: string;
    // 文件类型
    public fileFormatType: string;
    // 文件名
    public fileName: string;
    // 附件类型ID
    public attachmenttypeId: string;
    // MongoDB位置
    public filePath: string;
    // .....
    public url: string;
    public uploadId: number;
    public fileItem: any;
    constructor() { }
}
