import { FileItem } from 'ng2-file-upload';

export class ImageFile {
    filePath: string;
    // 附件byte数组
    public filePathContent: any;
    fileName: string;
    fileItem: FileItem;
}

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
    // 附件byte数组
    public filePathContent: any;
    // .....
    public url: string;
    public uploadId: number;
    constructor() { }
}
