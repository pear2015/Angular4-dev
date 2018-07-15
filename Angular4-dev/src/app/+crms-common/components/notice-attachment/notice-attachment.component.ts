import { Component, Input, Output, OnChanges, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ImageFile } from '../crms-attchment/crms-attchment';
import { AttachmentInfo } from '../crms-attchment/crms-attchment';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { UtilHelper, ConfigService, EventAggregator } from '../../../core';
import { AttchemntFileService } from '../crms-attchment/crms-attchment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { Router } from '@angular/router';
import { CrimePersonInfo } from '../../../model/crime-notice/crimePersonInfo';
import { NoticeInfo } from '../../../model/crime-notice/noticeInfo';
import { CrimeInfo } from '../../../model/crime-notice/crimeInfo';
declare let Tesseract: any;
@Component({
  selector: 'notice-attachment',
  templateUrl: './notice-attachment.component.html',
  providers: [AttchemntFileService]
})

export class NoticeAttachmentComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * 历史附件数据，用于第一次上传，第二次或之后的上传
   * @memberof NoticeAttachmentComponent
   */
  @Input() imageFileList;
  @Input() controllFlag;
  @Input() viewAttachmentFlag: boolean = false; // 为ture 时显示列表模式 false 为预览模式
  @Output() ocrFillBackEvent = new EventEmitter();
  /**
   * 是否显示高拍仪
   */
  popupCameraVisible: boolean = false;
  uploader: FileUploader;
  /**
   * 上传按钮是否变色
   */
  isWillUpload: boolean = false;
  /**
  * 图片格式要求
  * 1. 类型
  * 2. 大小
  */
  imageTypeFormat: string[];
  imageSizeFormat: number;
  popupImageVisible: boolean = false;
  activeSlideIndex: number;
  loadingVisible: boolean = false;
  ocrTextVisible: boolean = false;
  ocrText: string = '';
  ocrObject: any;
  crimePersonInfo: CrimePersonInfo;
  noticeInfo: NoticeInfo;
  crimeInfo: CrimeInfo;
  imageCount: Number;
  nofileFlag: boolean;

  // 以计数的方式判断是否应该重新上传文件
  shouldUploadersum: number = 0;
  // 文件上传成功后返回的mongoID
  storeFileIdList: any[] = [];
  // 上传成功的附件列表
  attachmentList: any[] = [];
  // 点击移除按钮标志计数
  removeFileSigalSun: number = 0;

  number: number;
  onlyForNoticeEntry: boolean = false;
  ocrFillBackRulesObj: Array<any>;
  constructor(
    private utilHelper: UtilHelper,
    private configService: ConfigService,
    private attchemntFileService: AttchemntFileService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private eventAggregator: EventAggregator,
    private router: Router
  ) {
    this.uploader = new FileUploader({});
    this.number = 0;
  }


  /**
   * 显示高拍仪
   */
  popupCamera() {
    this.popupCameraVisible = true;
  }
  /**
   * base64 转换成 blob
   */
  dataURLtoBlob(dataUrl) {
    let byte = atob(dataUrl.split(',')[1]);
    let mime = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    let ab = new ArrayBuffer(byte.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byte.length; i++) {
      ia[i] = byte.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  }
  /**
   * 将高拍仪图片添加至上传对象
   */
  addCapture2Uploader(imgPath) {
    let _this = this;
    let fs = require('fs');
    fs.readFile(imgPath, 'base64', function (err, data) {
      if (!err) {
        let base64Data = 'data:image/jpg;base64,' + data;
        let blob = _this.dataURLtoBlob(base64Data);
        let f = new File([blob], imgPath);
        let imageFile = new ImageFile();
        imageFile.filePathContent = base64Data;
        if (imgPath.lastIndexOf('\\') > 0) {
          imageFile.fileName = imgPath.substring(imgPath.lastIndexOf('\\') + 1, imgPath.length);
        } else {
          imageFile.fileName = imgPath;
        }
        imageFile.fileItem = new FileItem(_this.uploader, f, null);
        if (_this.imageFileList && _this.imageFileList.length < _this.imageCount) {
          _this.imageFileList.push(imageFile);
          _this.shouldUploadersum = _this.shouldUploadersum + 1;
        } else {
          _this.translateService.get(['fileIsExceed', 'sheet']).subscribe(result => {
            _this.toastr.toastrConfig.maxOpened = 1;
            _this.toastr.clear();
            _this.toastr.error(result.fileIsExceed + 0 + result.sheet);

          });
        }
      } else {
        console.error(err);
      }
    });
  };




  clearQueue() {
    this.uploader.clearQueue();
    this.attachmentList = [];
    this.imageFileList = [];
    this.shouldUploadersum = 0;
  }

  // 上传附件的方法
  async upLoadFile() {
    this.bindAttachmentListData();
    this.uploadAllFile();
    // await this.uploadSuccess();
    // // 文件上传失败的操作
    // this.uploader.onErrorItem = (item, res, status, headers) => {
    //     this.errorUpload.emit(item.file);
    // };
    // 文件上传结束后的操作，将已上传的附件和附件基本信息关联
    // await this.uploaderCompleteAll();
    // return true;
  }
  /**
   * 获取uploder对象
   * @returns
   * @memberof NoticeAttachmentComponent
   */
  getUploaderObject() {
    return this.uploader;
  }
  /**
   * 单个文件上传成功的操作
   * @param {any} res
   * @memberof NoticeAttachmentComponent
   */
  uploadSuccess(res) {
    // 上传文件成功的操作
    if (this.utilHelper.AssertNotNull(res)) {
      let result = JSON.parse(res);
      this.storeFileIdList.push(result);
    }
  }
  /**
   * 文件上传完成的操作
   * @memberof NoticeAttachmentComponent
   */
  uploaderCompleteAll() {
    if (this.utilHelper.AssertNotNull(this.attachmentList) && this.attachmentList.length > 0) {
      for (let i = 0; i < this.attachmentList.length; i++) {
        this.attachmentList[i].filePath = this.storeFileIdList[i];
      }
      // 将需要上传的计数重置为0
      this.shouldUploadersum = 0;
    }
  }
  /**
   * 给上传完成的附件对象赋值
   * @memberof NoticeAttachmentComponent
   */
  bindAttachmentListData() {
    if (this.imageFileList.length !== 0) {
      let queueLength = this.imageFileList.length;
      for (let i = 0; i < queueLength; i++) {
        let attachment = new AttachmentInfo();
        if (this.imageFileList[i].fileItem) {
          let fileNameLength = this.imageFileList[i].fileItem._file.name.length;
          let fileName = this.imageFileList[i].fileItem._file.name;
          attachment.fileName = fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length);
          attachment.attachmenttypeId = '2';
          /**
           * 文件后缀名
           */
          attachment.fileFormatType = this.imageFileList[i].fileItem
            ._file.name.substr(this.imageFileList[i].fileItem._file.name.indexOf('.') + 1, fileNameLength);
          this.attachmentList.push(attachment);
        }
      }
    }
  }

  /**
   * 上传所有的附件
   */
  uploadAllFile() {
    let flag: boolean = false;
    if (this.utilHelper.AssertNotNull(this.imageFileList.length) && this.imageFileList.length > 0) {
      let count = 0;
      this.imageFileList.forEach((item, i) => {
        if (item.fileItem) {
          this.uploader.queue[count] = item.fileItem;
          count++;
          flag = true;
        } else {
          let attachment = new AttachmentInfo();
          attachment.attachmentId = item.attachmentId;
          attachment.fileFormatType = item.fileFormatType;
          attachment.fileName = item.fileName;
          attachment.attachmenttypeId = '2';
          attachment.filePath = item.filePath;
          this.attachmentList.push(attachment);
        }
      });
    }
    if (flag) {
      this.uploader.uploadAll();
    }
  }
  /**
   *  点击上传按钮变色
   */
  willUpload() {
    this.isWillUpload = true;
  }

  activeUpload() {
    this.isWillUpload = false;
  }

  /**
  * 预览
  */
  seeAllImage(index) {
    this.thumbnailClick(index);
    this.popupImageVisible = true;
    // this.activeSlideIndex = index;

  }

  /**
   * 缩略图点击
   */
  thumbnailClick(index) {
    console.log(index);
    this.activeSlideIndex = index;
  }

  /**
  * 移除单个文件
  */
  removeSingle(index: any) {
    this.imageFileList.splice(index, 1);
    if (this.shouldUploadersum > 0) {
      this.shouldUploadersum = this.shouldUploadersum - 1;
    }
    if (this.utilHelper.AssertNotNull(this.uploader.queue[index])) {
      this.uploader.removeFromQueue(index);
    }
    this.removeFileSigalSun = this.removeFileSigalSun - 1;
  }

  /**
   * ocr 识别
   */
  async ocrRecognize(imgUrl) {
    try {
      let blob = this.dataURLtoBlob(imgUrl);
      this.loadingVisible = true;
      let dataText = await Tesseract.create({
        workerPath: 'ocr/worker.js',
        corePath: 'index.js',
        langPath: 'lang/'
      }).recognize(blob, {
        lang: 'por'
      }).catch(res => {
      });
      this.ocrObject = dataText;
      this.loadingVisible = false;
      this.ocrTextVisible = true;
      this.ocrText = dataText.text;
    } catch (e) {
      this.loadingVisible = false;
    }
  }

  async fillBcakData() {
    let fillBackObj: any = {
      crimePersonInfo: null,
      noticeInfo: null,
      crimeInfo: null
    };
    if (this.utilHelper.AssertNotNull(this.ocrObject) && this.utilHelper.AssertNotNull(this.ocrObject.lines)
      && this.ocrObject.lines.length > 0) {
      this.crimePersonInfo = new CrimePersonInfo();
      this.noticeInfo = new NoticeInfo();
      this.crimeInfo = new CrimeInfo();
      this.ocrFillBackRulesObj = await this.configService.get('ocrFillBackRulesObj');
      if (this.utilHelper.AssertNotNull(this.ocrFillBackRulesObj) && this.ocrFillBackRulesObj.length > 0) {
        this.ocrFillBackRulesObj.forEach(fillBackRule => {
          let matchValue = this.ocrText.match(new RegExp(fillBackRule.rule));
          if (this.utilHelper.AssertNotNull(matchValue)) {
            if (fillBackRule.belongModel === 'crimePsesonInfo') {
              this.crimePersonInfo[fillBackRule.mapToAttributes] = matchValue.toString()
                .replace(new RegExp(fillBackRule.keyOfAfterReplace), '').trim();
            } else if (fillBackRule.belongModel === 'crimeInfo') {
              this.crimeInfo[fillBackRule.mapToAttributes] = matchValue.toString()
                .replace(new RegExp(fillBackRule.keyOfAfterReplace), '').trim();
            } else if (fillBackRule.belongModel === 'noticeInfo') {
              this.noticeInfo[fillBackRule.mapToAttributes] = matchValue.toString()
                .replace(new RegExp(fillBackRule.keyOfAfterReplace), '').trim();
            }
          }
        });
      }
      fillBackObj.crimePersonInfo = this.crimePersonInfo;
      fillBackObj.noticeInfo = this.noticeInfo;
      fillBackObj.crimeInfo = this.crimeInfo;
      console.log(fillBackObj);
    }
    this.ocrFillBackEvent.emit(fillBackObj);
    this.ocrTextVisible = false;
  }

  ngOnChanges() {
  }
  /**
   * 获取上传完成后的附件DTO
   * @returns {any[]}
   * @memberof NoticeAttachmentComponent
   */
  getCompleteUploaderFile(): any[] {
    return this.attachmentList;
  }
  /**
   * 获取移除信号量
   * @memberof NoticeAttachmentComponent
   */
  getRemoveSigalSum(): number {
    return this.removeFileSigalSun;
  }

  /**
   * 获取需要上传的数目
   * @returns {number}
   * @memberof NoticeAttachmentComponent
   */
  getShouldUploaderSum(): number {
    return this.shouldUploadersum;
  }


  /**
   * 重新录入时调用
   * 通过附件列表中的filePath获取文件Byte
   * @param imageFileList
   */
  getImageFileListByteData(imageFileList: any[]) {
    this.imageFileList = imageFileList;
    if (this.utilHelper.AssertNotNull(this.imageFileList) && this.imageFileList.length > 0) {
      this.imageFileList.forEach((item, i) => {
        this.attchemntFileService.getImageFormUploaded(item.filePath)
          .then(fileByte => {
            item.filePathContent = 'data:image/jpg;base64,' + fileByte;
          }).catch(e => {
            console.log(e);
          });
      });
    } else {
      this.imageFileList = [];
    }
  }

  ngOnInit() {
    /**
     *  初始化文件类型和大小限制配置
     */
    this.configService.get(['imageFormat', 'imageSize', 'storeFileUrl', 'imageCount'])
      .then(result => {
        if (this.utilHelper.AssertNotNull(result)) {
          this.imageTypeFormat = result[0];
          this.imageSizeFormat = Number(result[1]) * 1024 * 1024;
          this.uploader = new FileUploader({
            url: result[2],
            method: 'Post',
          });
          this.imageCount = result[3];
        }
      });
    if (this.controllFlag.uploadFile === true || (this.imageFileList.length && this.imageFileList.length > 0)) {
      this.nofileFlag = false;
    }
    if (this.router.url.indexOf('notice-input') > -1) { // 重新录入页面隐藏附件放大按钮
      this.onlyForNoticeEntry = false;
    } else {
      this.onlyForNoticeEntry = true;
    }
  }

  ngOnDestroy() {
    this.eventAggregator.publish('hiddenLeftBar', true);
  }

}
