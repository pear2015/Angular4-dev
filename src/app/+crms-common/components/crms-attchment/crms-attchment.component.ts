import { Component, Input, OnChanges, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ImageFile } from './crms-attchment';
import { AttachmentInfo } from './crms-attchment';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { UtilHelper, ConfigService, EventAggregator } from '../../../core';
import { AttchemntFileService } from './crms-attchment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';

declare let Tesseract: any;
@Component({
  selector: 'crms-attchment',
  templateUrl: './crms-attchment.component.html',
  providers: [AttchemntFileService]
})

export class CrmsAttchmentComponent implements OnChanges, OnInit, OnDestroy {
  /**
   * 附件列表数据
   * @memberof CrmsAttchmentComponent
   */
  @Input() imageFileList;
  @Input() controllFlag;
  @Input() noticeStatus: string;
  @Input() viewAttachmentFlag: boolean = false; // 为ture 时显示列表模式 false 为预览模式
  @Input() onlyForApplyAnalysis: boolean = false;
  @Output() completeUpload: EventEmitter<any>;
  @Output() updateUpload: EventEmitter<any>;
  @Output() errorUpload: EventEmitter<any>;
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
  storeFileIdList: any[] = [];
  attachmentList: any[] = [];
  popupImageVisible: boolean = false;
  activeSlideIndex: number;
  loadingVisible: boolean = false;
  ocrTextVisible: boolean = false;
  ocrText: string = '';
  newImageFileList: any[] = [];
  imageCount: Number;
  nofileFlag: boolean;
  timer = null;
  constructor(
    private utilHelper: UtilHelper,
    private configService: ConfigService,
    private attchemntFileService: AttchemntFileService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private eventAggregator: EventAggregator

  ) {
    this.uploader = new FileUploader({});
    this.completeUpload = new EventEmitter();
    this.updateUpload = new EventEmitter();
    this.errorUpload = new EventEmitter();
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
    if (this.utilHelper.AssertNotNull(this.imageFileList.length) && this.imageFileList.length > 0) {
      let count = 0;
      this.imageFileList.forEach((item, i) => {
        if (item.fileItem) {
          this.uploader.queue[count] = item.fileItem;
          count++;
        }
      });
    }
    this.uploader.uploadAll();
  }

  clearQueue() {
    this.uploader.clearQueue();
    this.attachmentList = [];
    this.imageFileList = [];
  }

  // 上传附件的方法
  upLoadFile() {
    this.bindAttachmentListData();
    this.uploadAllFile();

    // 上传文件成功的操作
    this.uploader.onSuccessItem = (item, res, status, headers) => {
      if (status === 200) {
        let result = JSON.parse(res);
        this.storeFileIdList.push(result);
      }
    };

    // 文件上传失败的操作
    this.uploader.onErrorItem = (item, res, status, headers) => {
      this.errorUpload.emit(item.file);
    };

    // 文件上传结束后的操作
    this.uploader.onCompleteAll = () => {
      /**
       * 将已上传的附件和附件基本信息关联
       */
      for (let i = 0; i < this.attachmentList.length; i++) {
        this.attachmentList[i].filePath = this.storeFileIdList[i];
      }
      if (this.noticeStatus === '2') {

        this.imageFileList.forEach((item, i) => {
          if (!item.fileItem) {
            this.newImageFileList[i] = item;
          }
        });
        this.attachmentList = this.attachmentList.concat(this.newImageFileList);
        this.updateUpload.emit(this.attachmentList);
      } else {
        this.completeUpload.emit(this.attachmentList);
      }
    };
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
    this.activeSlideIndex = index;
    this.popupImageVisible = true;

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.activeSlideIndex = index;
    }, 1000);

  }

  /**
   * 缩略图点击
   */
  thumbnailClick(index) {
    this.activeSlideIndex = index;
  }

  /**
  * 移除单个文件
  */
  removeSingle(index: any) {
    this.imageFileList.splice(index, 1);

    if (this.utilHelper.AssertNotNull(this.uploader.queue[index])) {
      this.uploader.removeFromQueue(index);
    }
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
      this.loadingVisible = false;
      this.ocrTextVisible = true;
      this.ocrText = dataText.text;
    } catch (e) {
      this.loadingVisible = false;
    }
  }

  ngOnChanges() {
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
      // this.imageFileList = [];
    }
  }


  ngOnInit() {
    this.activeSlideIndex = 0;
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
    if (this.controllFlag.uploadFile === true ||
      (this.utilHelper.AssertNotNull(this.imageFileList) && this.imageFileList.length > 0)) {
      this.nofileFlag = false;
    }
  }


  ngOnDestroy() {
    this.eventAggregator.publish('hiddenLeftBar', true);
  }

}
