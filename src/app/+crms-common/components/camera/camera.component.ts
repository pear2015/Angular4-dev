import { Component, Input, Output, OnInit, OnChanges, OnDestroy, EventEmitter } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'camera',
    templateUrl: './camera.component.html',
    providers: []
})

// 高拍仪组件
export class CameraComponent implements OnInit, OnChanges, OnDestroy {

    @Input() isVisible: boolean = false;
    @Output() captureEvent: EventEmitter<any>;

    private isSecondDev = false; // 是否有两个canvas显示视频
    private camidMain = 0;    // 主头ID
    private camidSub = 0;     // 副头ID
    private cameraWidth: number = 2048;
    private cameraHeight: number = 1536;
    private cameraWidth2: number = 200;
    private cameraHeight2: number = 200;
    private orignalCanvasW = 760;
    private orignalCanvasH = 760;
    private orignalCanvasW2 = 100;
    private orignalCanvasH2 = 100;

    private cameraSavePath: string = 'D://';
    private cameraFilePath: string;

    private ws;
    private canvas;
    private context;

    private canvasSecond;
    private contextSecond;

    private canvasX;
    private canvasY;
    private canvasLastX;
    private canvasLastY;

    private isDragging = false;
    private canvasX_manual = 0;
    private canvasY_manual = 0;

    private recX_manual = 0;
    private recY_manual = 0;
    private recW_manual = 0;
    private recH_manual = 0;
    private rec_ww = 0;
    private rec_hh = 0;
    private CutType = 0;

    private orientationType = [0, 1, 2, 3];
    private current_orientation = 1;
    loadingVisible: boolean = false;
    canClick: boolean = false;
    translates: any = [];
    constructor(
        private translateService: TranslateService
    ) {
        this.captureEvent = new EventEmitter<any>(false);
        let os = require('os');
        this.cameraSavePath = os.tmpdir();
        // console.log(os.tmpdir());
    }

    async ngOnInit() {
        console.log('init-> init camera component.');
        await this.initTranslate();
        let _this = this;
        _this.WsInit(this.orignalCanvasW, this.orignalCanvasH,
            this.orignalCanvasW2, this.orignalCanvasH2, true);
    }

    ngOnChanges() {
        if (this.isVisible && this.ws) {
            console.log('ngOnChanges-> open camera component.');
            // 打开设备(主头)，开启视频
            this.sendMsgStartVideo(this.camidMain, this.cameraWidth, this.cameraHeight);
        } else {
            // 关闭摄像头
            if (this.ws && this.ws.readyState === 1) {
                console.log('ngOnChanges-> close camera component on change.');
                this.sendMsgCloseVideo();
            }
        }
    }

    ngOnDestroy() {
        console.log('ngOnDestroy-> destroy camera component.');
        if (this.ws) {
            this.sendMsgCloseVideo();
            console.log('destroy websocket connetion');
            this.ws.close();
        }
    }


    /**
    * 初始化词条
    */
    initTranslate(): Promise<any> {
        return new Promise((r, j) => {
            let translateKeys = ['camera', 'System Exception'];
            this.translateService.get(translateKeys).toPromise().then(values => {
                translateKeys.forEach((key) => {
                    this.translates[key] = values[key];
                });
                r(this.translates);
            });
        });
    }
    /**
     * 点击拍照时的动作
     * @memberof CameraComponent
     */
    sendCapture() {
        this.loadingVisible = true;
    }

    /**
     * loading出现时执行
     * @memberof CameraComponent
     */
    onShown() {
        this.canClick = true;
        this.sendMsgCapture(0);
        setTimeout(() => {
            this.loadingVisible = false;
        }, 1000);
    }

    /**
     * loading隐藏时执行
     * @memberof CameraComponent
     */
    onHidden() {
        this.canClick = false;
    }

    private WsInit(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2, enableCanvas) {
        let _this = this;
        if (enableCanvas) {
            _this.canvas = document.getElementById('cameraCanvas');
            _this.context = _this.canvas.getContext('2d');
            if (_this.isSecondDev) {
                _this.canvasSecond = document.getElementById('cameraCanvasSecond');
                _this.contextSecond = _this.canvasSecond.getContext('2d');
            }
            _this.canvas.onmousedown = _this.canvasClick;
            _this.canvas.onmouseup = _this.stopDragging;
            _this.canvas.onmouseout = _this.stopDragging;
            _this.canvas.onmousemove = _this.canvasMove;
            _this.canvasX = 0;
            _this.canvasY = 0;
            _this.canvasLastX = 0;
            _this.canvasLastY = 0;
        }

        _this.ws = new WebSocket('ws://localhost:9002');
        _this.ws.binaryType = 'arraybuffer';
        _this.ws.onmessage = function (event) {

            let aDataArray = new Uint8Array(event.data);
            if (aDataArray.length > 0) {
                if (aDataArray[0] === 0xef && aDataArray[1] === 0x01) {
                    _this.getUsbCamareMessage(aDataArray, 5);
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x17) {
                    let camNum = aDataArray[3];
                    _this.GetDevCount(camNum);
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x19) {
                    _this.getResolution(aDataArray, 5);
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x23) {
                    let type = aDataArray[3];
                    let len = aDataArray[4];
                    let data = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        data[i] = aDataArray[5 + i];
                    }
                    let str = _this.byteToString(data);
                    let text = decodeURIComponent(str);
                    _this.InfoTextCallback(type, text);
                    if (type === 0) {
                        // 返回图片路径
                        _this.cameraFilePath = text;
                    }
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x05) {
                    let ww = aDataArray[3] * 256 + aDataArray[4];
                    let hh = aDataArray[5] * 256 + aDataArray[6];
                    _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                    // sendMsgRefreshCam();
                    let imgData = _this.context.createImageData(ww, hh);
                    let dataNum = 0;
                    for (let i = 0; i < imgData.data.length; i += 4) {
                        imgData.data[i + 0] = aDataArray[dataNum];
                        imgData.data[i + 1] = aDataArray[dataNum + 1];
                        imgData.data[i + 2] = aDataArray[dataNum + 2];
                        imgData.data[i + 3] = 255;
                        dataNum = dataNum + 3;
                    }
                    _this.sendMsgRefreshCam();
                    if (_this.CutType === 2) {
                        _this.rec_ww = ww;
                        _this.rec_hh = hh;
                        _this.context.putImageData(imgData, _this.canvas.width / 2 - ww / 2, _this.canvas.height / 2 - hh / 2);
                        _this.refreshRect();
                    } else {
                        _this.context.putImageData(imgData, _this.canvas.width / 2 - ww / 2 + _this.canvasX,
                            _this.canvas.height / 2 - hh / 2 + _this.canvasY);
                    }

                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x0c) {
                    let ww = aDataArray[3] * 256 + aDataArray[4];
                    let hh = aDataArray[5] * 256 + aDataArray[6];
                    _this.context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
                    // sendMsgRefreshCam();
                    let imgData = _this.context.createImageData(ww, hh);
                    let dataNum = 0;
                    for (let i = 0; i < imgData.data.length; i += 4) {
                        imgData.data[i + 0] = aDataArray[dataNum];
                        imgData.data[i + 1] = aDataArray[dataNum + 1];
                        imgData.data[i + 2] = aDataArray[dataNum + 2];
                        imgData.data[i + 3] = 255;
                        dataNum = dataNum + 3;
                    }
                    _this.sendMsgRefreshCam();
                    let Xdis = _this.canvas.width / 2 - ww / 2 + _this.canvasX;
                    let Ydis = _this.canvas.height / 2 - hh / 2 + _this.canvasY;
                    _this.context.putImageData(imgData, Xdis, Ydis);

                    let lenJiubian = aDataArray[7];


                    _this.context.beginPath();
                    _this.context.strokeStyle = 'rgb(0, 255, 0)';
                    _this.context.lineWidth = 2;

                    for (let j = 0; j < lenJiubian; j++) {
                        for (let i = 0; i < 3; i++) {
                            let aa = 1;
                            if (aDataArray[8 + i * 6 + j * 24] === 1) {
                                aa = -1;
                            }
                            let bb = 1;
                            if (aDataArray[11 + i * 6 + j * 24] === 1) {
                                bb = -1;
                            }
                            let cc = 1;
                            if (aDataArray[14 + i * 6 + j * 24] === 1) {
                                cc = -1;
                            }
                            let dd = 1;
                            if (aDataArray[17 + i * 6 + j * 24] === 1) {
                                dd = -1;
                            }
                            _this.context.moveTo(aDataArray[9 + i * 6 + j * 24] * 256 * aa + aDataArray[10 + i * 6 + j * 24] * aa + Xdis,
                                aDataArray[12 + i * 6 + j * 24] * 256 * bb + aDataArray[13 + i * 6 + j * 24] * bb + Ydis);
                            _this.context.lineTo(aDataArray[15 + i * 6 + j * 24] * 256 * cc + aDataArray[16 + i * 6 + j * 24] * cc + Xdis,
                                aDataArray[18 + i * 6 + j * 24] * 256 * dd + aDataArray[19 + i * 6 + j * 24] * dd + Ydis);
                            _this.context.stroke();
                        }
                        let ee = 1;
                        if (aDataArray[26 + j * 24] === 1) {
                            ee = -1;
                        }
                        let ff = 1;
                        if (aDataArray[8 + j * 24] === 1) {
                            ff = -1;
                        }
                        _this.context.moveTo(aDataArray[27 + j * 24] * 256 + aDataArray[28 + j * 24] + Xdis,
                            aDataArray[30 + j * 24] * 256 + aDataArray[31 + j * 24] + Ydis);
                        _this.context.lineTo(aDataArray[9 + j * 24] * 256 + aDataArray[10 + j * 24] + Xdis,
                            aDataArray[12 + j * 24] * 256 + aDataArray[13 + j * 24] + Ydis);
                        _this.context.stroke();
                    }
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x14) {
                    let tmp = aDataArray[3];
                    _this.InfoCallback(tmp);

                    if (tmp === 0x04) {
                        let __this = _this;
                        setTimeout(function () {
                            if (__this.cameraFilePath) {
                                __this.captureEvent.emit(__this.cameraFilePath);
                            } else {
                                console.error('CameraFilePath is null.');
                            }
                        }, 200);
                    }
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x26) {

                    if (_this.isSecondDev) {
                        let ww = aDataArray[3] * 256 + aDataArray[4];
                        let hh = aDataArray[5] * 256 + aDataArray[6];
                        _this.contextSecond.clearRect(0, 0, _this.canvasSecond.width, _this.canvasSecond.height);

                        let imgData = _this.contextSecond.createImageData(ww, hh);
                        let dataNum = 0;
                        for (let i = 0; i < imgData.data.length; i += 4) {
                            imgData.data[i + 0] = aDataArray[dataNum];
                            imgData.data[i + 1] = aDataArray[dataNum + 1];
                            imgData.data[i + 2] = aDataArray[dataNum + 2];
                            imgData.data[i + 3] = 255;
                            dataNum = dataNum + 3;

                        }
                        _this.sendMsgRefreshCamSecond();

                        _this.contextSecond.putImageData(imgData, _this.canvasSecond.width / 2 - ww / 2,
                            _this.canvasSecond.height / 2 - hh / 2);
                    }
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x30) {
                    let type1 = aDataArray[3];
                    let ret = 1;
                    if (type1 === 0) {
                        ret = -1;
                    }
                    // let min = aDataArray[4] * ret;

                    let type2 = aDataArray[5];
                    ret = 1;
                    if (type2 === 0) {
                        ret = -1;
                    }
                    // let max = aDataArray[6] * ret;
                    // GetBrightnessRange_ws(min,max);
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x32) {
                    let type1 = aDataArray[3];
                    let ret = 1;
                    if (type1 === 0) {
                        ret = -1;
                    }
                    // let min = aDataArray[4] * ret;

                    let type2 = aDataArray[5];
                    ret = 1;
                    if (type2 === 0) {
                        ret = -1;
                    }
                    // let max = aDataArray[6] * ret;
                    // GetExposureRange_ws(min,max);
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x36) {
                    let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
                    let baseDataArray = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        baseDataArray[i] = aDataArray[6 + i];
                    }
                    let str = _this.byteToString(baseDataArray);
                    let text = decodeURIComponent(str);

                    _this.InfoTextCallback(5, text);
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x3b) {
                    _this.camidMain = aDataArray[3];
                    if (_this.isSecondDev) {
                        _this.camidSub = aDataArray[4];
                    }
                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x3e) {
                    let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
                    let baseDataArray = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        baseDataArray[i] = aDataArray[6 + i];
                    }
                    let str = _this.byteToString(baseDataArray);
                    let text = decodeURIComponent(str);

                    _this.InfoTextCallback(19, text);

                } else if (aDataArray[0] === 0xef && aDataArray[1] === 0x43) {
                    let len = aDataArray[3] * 65536 + aDataArray[4] * 256 + aDataArray[5];
                    let baseDataArray = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        baseDataArray[i] = aDataArray[6 + i];
                    }
                    let str = _this.byteToString(baseDataArray);
                    let text = decodeURIComponent(str);

                    _this.InfoTextCallback(21, text);
                }
            }

        };

        _this.ws.onopen = function (event) {
            console.log('open websocket connection');
            if (enableCanvas) {
                _this.sendMsgGetMainCameraID();
                _this.sendMsgRefreshDev();
                _this.initParameter(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2);
            }

            _this.InfoCallback(0x24);
        };

        _this.ws.onclose = function (event) {
            console.log('close websocket connection');
            _this.InfoCallback(0xa3);
            _this.showAlert('0xa3');
        };

        _this.ws.onerror = function (event) {
            console.log('websocket connection error');
            _this.InfoCallback(0xa4);
            _this.showAlert('0xa4');
        };
    }

    private initParameter(orignalCanvasW, orignalCanvasH, orignalCanvasW2, orignalCanvasH2) {
        this.sendMsgBestSize();
        this.sendMsgSetCutType(0);
        this.sendMsgSetFileType(0);
        this.sendMsgSetImageColorMode(0);
        this.sendMsgSetConntinousShotModel(0);
        this.sendMsgChangeOrientation();
        this.sendMsgSetCanvasOriginalSize(orignalCanvasW, orignalCanvasH);
        this.sendMsgSetCanvasSecondOriginalSize(orignalCanvasW2, orignalCanvasH2);

        // 在自动模式下,选择单图与多图捕抓 0单图 1多图
        this.sendMsgSetJiubianModel(0);
        // 关闭水印
        this.sednMsgWaterMarkClose();
        // 设置文件命名格式为日期格式
        this.sendMsgSetFileNameModelTime();
        // 设置图片存储路径
        this.sendMsgSetFilePath(this.cameraSavePath);
    }

    private canvasClick(e) {
        this.isDragging = true;
    }

    private stopDragging() {
        this.isDragging = false;
        this.canvasLastX = 0;
        this.canvasLastY = 0;
        this.canvasX_manual = 0;
        this.canvasY_manual = 0;
    }

    private canvasMove(e) {
        if (this.isDragging === true) {
            if (this.CutType !== 2) {
                if (this.canvasLastX === 0 && this.canvasLastY === 0) {
                    this.canvasLastX = e.pageX - this.canvas.offsetLeft;
                    this.canvasLastY = e.pageY - this.canvas.offsetTop;

                } else {
                    let mx = e.pageX - this.canvas.offsetLeft;
                    let my = e.pageY - this.canvas.offsetTop;
                    this.canvasX = this.canvasX + (mx - this.canvasLastX);
                    this.canvasY = this.canvasY + (my - this.canvasLastY);
                    this.canvasLastX = mx;
                    this.canvasLastY = my;
                }
            } else {
                let mx = e.pageX - this.canvas.offsetLeft;
                let my = e.pageY - this.canvas.offsetTop;

                if (this.canvasLastX === 0 && this.canvasLastY === 0) {

                    this.canvasLastX = mx;
                    this.canvasLastY = my;
                    this.recX_manual = mx;
                    this.recY_manual = my;
                } else {
                    this.canvasX_manual = this.canvasX_manual + (mx - this.canvasLastX);
                    this.canvasY_manual = this.canvasY_manual + (my - this.canvasLastY);
                    this.canvasLastX = mx;
                    this.canvasLastY = my;
                    this.recW_manual = this.canvasX_manual;
                    this.recH_manual = this.canvasY_manual;
                }

            }
        }
    }

    private getResolution(arrayData, tmpNum) {
        let type = arrayData[3];
        let len = arrayData[4];
        let data = new Int32Array(len * 2);
        let num = 0;
        for (let i = 0; i < len; i++) {
            data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1];
            num++;
            data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3];
            num++;
            tmpNum += 4;
        }
        if (type === 0) {
            // this.GetDeviceResolution(data);
            this.sendMsgStartVideo(this.camidMain, this.cameraWidth, this.cameraHeight);
        } else {
            if (this.isSecondDev) {
                // this.GetDeviceResolutionSecond(data);
                this.sendMsgStartVideo2(this.camidSub, this.cameraWidth2, this.cameraHeight2);
            }
        }

    }

    private getUsbCamareMessage(arrayData, tmpNum) {
        let numCam = arrayData[3];
        let len = arrayData[4];
        let data = new Int32Array(len * 2);
        let num = 0;
        for (let i = 0; i < len; i++) {
            data[num] = arrayData[tmpNum] * 256 + arrayData[tmpNum + 1];
            num++;
            data[num] = arrayData[tmpNum + 2] * 256 + arrayData[tmpNum + 3];
            num++;
            tmpNum += 4;
        }
        // this.GetDeviceResolution(data);
        this.sendMsgStartVideo(this.camidMain, this.cameraWidth, this.cameraHeight);

        let strUsbNamr = new Array();
        for (let i = 0; i < numCam; i++) {
            let tmpLen = arrayData[tmpNum];
            let tmpData = new Uint8Array(tmpLen);
            tmpNum++;
            for (let j = 0; j < tmpLen; j++) {
                tmpData[j] = arrayData[tmpNum];
                tmpNum++;
            }
            // let arr =       Utf8ToUnicode(tmpData)
            let str = this.byteToString(tmpData);
            let text = decodeURIComponent(str);
            strUsbNamr[i] = text;
        }
        // this.GetDevName(numCam, strUsbNamr);
        this.sendMsgGetResolutionSecond(this.camidSub);
    }

    private sendMsgRefreshCam() {
        let aDataArray = new Uint8Array(3);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x04;
        aDataArray[2] = 0x00;
        this.ws.send(aDataArray.buffer);
    }

    private sendMsgStartVideo2(camId, width, height) {

        let aDataArray = new Uint8Array(8);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x25;
        aDataArray[2] = 0x05;
        aDataArray[3] = camId;
        aDataArray[4] = width / 256;
        aDataArray[5] = width % 256;
        aDataArray[6] = height / 256;
        aDataArray[7] = height % 256;
        this.ws.send(aDataArray.buffer);
    }

    private sendMsgRefreshCamSecond() {
        let aDataArray = new Uint8Array(3);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x27;
        aDataArray[2] = 0x00;
        this.ws.send(aDataArray.buffer);
    }

    private sendMsgSetCanvasOriginalSize(ww, hh) {
        let aDataArray = new Uint8Array(7);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x15;
        aDataArray[2] = 0x04;
        aDataArray[3] = ww / 256;
        aDataArray[4] = ww % 256;
        aDataArray[5] = hh / 256;
        aDataArray[6] = hh % 256;
        this.ws.send(aDataArray.buffer);
    }

    private sendMsgSetCanvasSecondOriginalSize(ww, hh) {
        let aDataArray = new Uint8Array(7);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x37;
        aDataArray[2] = 0x04;
        aDataArray[3] = ww / 256;
        aDataArray[4] = ww % 256;
        aDataArray[5] = hh / 256;
        aDataArray[6] = hh % 256;
        this.ws.send(aDataArray.buffer);
    }

    private sendMsgRefreshDev() {
        let aDataArray = new Uint8Array(3);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x00;
        aDataArray[2] = 0x00;
        this.ws.send(aDataArray.buffer);
    }

    private sendMsgStartVideo(camId, width, height) {

        let aDataArray = new Uint8Array(8);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x02;
        aDataArray[2] = 0x05;
        aDataArray[3] = camId;
        aDataArray[4] = width / 256;
        aDataArray[5] = width % 256;
        aDataArray[6] = height / 256;
        aDataArray[7] = height % 256;
        this.ws.send(aDataArray.buffer);
    }

    /**
     *  true 为正旋转，false 为逆时针旋转
     */
    private sendMsgChangeOrientation(type?) {
        if (type) {
            if (this.current_orientation === this.orientationType.length - 1) {
                this.current_orientation = 0;
            } else {
                this.current_orientation++;
            }
        } else {
            if (this.current_orientation === 0) {
                this.current_orientation = 3;
            } else {
                if (type === undefined || type === null) {
                    this.current_orientation = 1;
                } else {
                    this.current_orientation--;
                }
            }
        }

        let aDataArray = new Uint8Array(4);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x06;
        aDataArray[2] = 0x01;
        aDataArray[3] = this.current_orientation;
        this.ws.send(aDataArray.buffer);
        if (this.ws && this.ws.readyState === 1) {
            this.ws.send(aDataArray.buffer);
        }
    }

    private sendMsgSetImageColorMode(type) {
        let aDataArray2 = new Uint8Array(4);
        aDataArray2[0] = 0xef;
        aDataArray2[1] = 0x07;
        aDataArray2[2] = 0x01;
        aDataArray2[3] = type;
        this.ws.send(aDataArray2.buffer);
    }

    private sendMsgCloseVideo() {

        let aDataArray = new Uint8Array(3);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x08;
        aDataArray[2] = 0x00;
        this.ws.send(aDataArray.buffer);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    private sendMsgCloseVideoSecond() {

        let aDataArray = new Uint8Array(3);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x28;
        aDataArray[2] = 0x00;
        this.ws.send(aDataArray.buffer);
        this.contextSecond.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // private sendMsgChangeResolution(camId, width, height) {
    //     let aDataArray = new Uint8Array(8);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x02;
    //     aDataArray[2] = 0x05;
    //     aDataArray[3] = camId;
    //     aDataArray[4] = width / 256;
    //     aDataArray[5] = width % 256;
    //     aDataArray[6] = height / 256;
    //     aDataArray[7] = height % 256;
    //     this.ws.send(aDataArray.buffer);
    // }

    private sendMsgSetFilePath(pathUnicode) {
        let path = encodeURI(pathUnicode);
        let pathdata = this.stringToByte(path);
        let len = path.length;
        let aDataArray = new Uint8Array(3 + len);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x1c;
        aDataArray[2] = len;
        for (let i = 0; i < len; i++) {
            aDataArray[3 + i] = pathdata[i];
        }
        this.ws.send(aDataArray.buffer);
    }

    // private sendMsgSetFileNameModelCustom(index, pathUnicode) {
    //     let path = encodeURI(pathUnicode);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;
    //     let aDataArray = new Uint8Array(6 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x1d;
    //     aDataArray[2] = len + 3;
    //     aDataArray[3] = index / 256;
    //     aDataArray[4] = index % 256;
    //     aDataArray[5] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[6 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgSetFileNameModelFixed(pathUnicode) {
    //     let path = encodeURI(pathUnicode);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;
    //     let aDataArray = new Uint8Array(3 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x1f;
    //     aDataArray[2] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[3 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    private sendMsgSetFileNameModelTime() {
        let aDataArray = new Uint8Array(3);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x1e;
        aDataArray[2] = 0x00;
        this.ws.send(aDataArray.buffer);
    }

    // private sendMsgSetFileNameModelBarcode() {
    //     let aDataArray = new Uint8Array(3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x2b;
    //     aDataArray[2] = 0x00;
    //     this.ws.send(aDataArray.buffer);
    // }

    private sendMsgSetFileType(type) {
        let aDataArray = new Uint8Array(4);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x20;
        aDataArray[2] = 0x01;
        aDataArray[3] = type;
        this.ws.send(aDataArray.buffer);
    }

    private sendMsgSetConntinousShotModel(type) {
        let aDataArray = new Uint8Array(4);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x21;
        aDataArray[2] = 0x01;
        aDataArray[3] = type;
        this.ws.send(aDataArray.buffer);
    }

    // private sendMsgSetConntinousShotModelTime(len) {
    //     let aDataArray = new Uint8Array(5);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x22;
    //     aDataArray[2] = 0x02;
    //     aDataArray[3] = len / 256;
    //     aDataArray[4] = len % 256;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgUploadFile(uploadSerHead, uploadSerLast, uploadSerFile) {
    //     let path = encodeURI(uploadSerHead);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;

    //     let path2 = encodeURI(uploadSerLast);
    //     let pathdata2 = this.stringToByte(path2);
    //     let len2 = path2.length;

    //     let path3 = encodeURI(uploadSerFile);
    //     let pathdata3 = this.stringToByte(path3);
    //     let len3 = path3.length;

    //     let aDataArray = new Uint8Array(8 + len + len2 + len3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x24;
    //     aDataArray[2] = 5 + len + len2 + len3;
    //     aDataArray[3] = 0x00;
    //     aDataArray[4] = 80 % 256;
    //     aDataArray[5] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[6 + i] = pathdata[i];
    //     }
    //     aDataArray[6 + len] = len2;
    //     for (let i = 0; i < len2; i++) {
    //         aDataArray[7 + len + i] = pathdata2[i];
    //     }
    //     aDataArray[7 + len + len2] = len3;
    //     for (let i = 0; i < len3; i++) {
    //         aDataArray[8 + len + len2 + i] = pathdata3[i];
    //     }
    //     this.ws.send(aDataArray.buffer);

    // }

    // private sendMsgUploadFilePort(port, uploadSerHead, uploadSerLast, uploadSerFile) {
    //     let path = encodeURI(uploadSerHead);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;

    //     let path2 = encodeURI(uploadSerLast);
    //     let pathdata2 = this.stringToByte(path2);
    //     let len2 = path2.length;

    //     let path3 = encodeURI(uploadSerFile);
    //     let pathdata3 = this.stringToByte(path3);
    //     let len3 = path3.length;

    //     let aDataArray = new Uint8Array(8 + len + len2 + len3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x24;
    //     aDataArray[2] = 5 + len + len2 + len3;
    //     aDataArray[3] = port / 256;
    //     aDataArray[4] = port % 256;
    //     aDataArray[5] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[6 + i] = pathdata[i];
    //     }
    //     aDataArray[6 + len] = len2;
    //     for (let i = 0; i < len2; i++) {
    //         aDataArray[7 + len + i] = pathdata2[i];
    //     }
    //     aDataArray[7 + len + len2] = len3;
    //     for (let i = 0; i < len3; i++) {
    //         aDataArray[8 + len + len2 + i] = pathdata3[i];
    //     }
    //     this.ws.send(aDataArray.buffer);

    // }

    private sendMsgCapture(type) {
        if (type !== 2) {
            let aDataArray = new Uint8Array(4);
            aDataArray[0] = 0xef;
            aDataArray[1] = 0x0a;
            aDataArray[2] = 0x01;
            aDataArray[3] = 0x00;
            this.ws.send(aDataArray.buffer);
        } else {
            let xsend = this.recX_manual - (this.canvas.width / 2 - this.rec_ww / 2);
            let ysend = this.recY_manual - (this.canvas.height / 2 - this.rec_hh / 2);
            if (xsend < 0) {
                xsend = 0;
            }
            if (ysend < 0) {
                ysend = 0;
            }
            let aDataArray = new Uint8Array(11);
            aDataArray[0] = 0xef;
            aDataArray[1] = 0x0f;
            aDataArray[2] = 0x08;
            aDataArray[3] = xsend / 256;
            aDataArray[4] = xsend % 256;
            aDataArray[5] = ysend / 256;
            aDataArray[6] = ysend % 256;
            aDataArray[7] = this.recW_manual / 256;
            aDataArray[8] = this.recW_manual % 256;
            aDataArray[9] = this.recH_manual / 256;
            aDataArray[10] = this.recH_manual % 256;
            this.ws.send(aDataArray.buffer);
        }

    }

    // private sendMsgCaptureSecond() {
    //     let aDataArray = new Uint8Array(3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x29;
    //     aDataArray[2] = 0x00;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgShowImageSettingWindow() {
    //     let aDataArray = new Uint8Array(3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x0b;
    //     aDataArray[2] = 0x00;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgShowImageSettingWindowB() {
    //     let aDataArray = new Uint8Array(3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x45;
    //     aDataArray[2] = 0x00;
    //     this.ws.send(aDataArray.buffer);
    // }


    // private sendMsgZoom(type) {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x0d;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = type;
    //     this.ws.send(aDataArray.buffer);
    // }

    private sendMsgSetCutType(type) {
        this.canvasX = 0;
        this.canvasY = 0;
        this.CutType = type;
        let aDataArray = new Uint8Array(4);

        aDataArray[0] = 0xef;
        aDataArray[1] = 0x0e;
        aDataArray[2] = 0x01;
        aDataArray[3] = type;
        this.ws.send(aDataArray.buffer);

    }

    private sendMsgSetJiubianModel(type) {
        let aDataArray = new Uint8Array(4);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x10;
        aDataArray[2] = 0x01;
        aDataArray[3] = type;
        this.ws.send(aDataArray.buffer);

    }

    // private sendMsgGetCamNum() {
    //     let aDataArray = new Uint8Array(3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x16;
    //     aDataArray[2] = 0x00;
    //     this.ws.send(aDataArray.buffer);

    // }

    // private sendMsgGetResolution(camid) {
    //     let aDataArray = new Uint8Array(5);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x18;
    //     aDataArray[2] = 0x02;
    //     aDataArray[3] = 0x00;
    //     aDataArray[4] = camid;
    //     this.ws.send(aDataArray.buffer);
    // }

    private sendMsgGetResolutionSecond(camid) {
        let aDataArray = new Uint8Array(5);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x18;
        aDataArray[2] = 0x02;
        aDataArray[3] = 0x01;
        aDataArray[4] = camid;
        this.ws.send(aDataArray.buffer);
    }

    // private sednMsgSavePDF(pathUnicode) {
    //     let path = encodeURI(pathUnicode);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;
    //     let aDataArray = new Uint8Array(3 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x11;
    //     aDataArray[2] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[3 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sednMsgAddPDF(pathUnicode) {
    //     let path = encodeURI(pathUnicode);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;
    //     let aDataArray = new Uint8Array(3 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x12;
    //     aDataArray[2] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[3 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sednMsgWaterMarkOpen(pathUnicode, fontSize, fontStyleIndex, r, g, b, xoffset, yoffset) {
    //     let path = encodeURI(pathUnicode);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;

    //     let aDataArray = new Uint8Array(11 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x1a;
    //     aDataArray[2] = 8 + len;
    //     aDataArray[3] = fontSize;
    //     aDataArray[4] = fontStyleIndex;
    //     aDataArray[5] = r;
    //     aDataArray[6] = g;
    //     aDataArray[7] = b;
    //     aDataArray[8] = xoffset;
    //     aDataArray[9] = yoffset;
    //     aDataArray[10] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[11 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    private sednMsgWaterMarkClose() {
        let aDataArray = new Uint8Array(3);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x1b;
        aDataArray[2] = 0x00;
        this.ws.send(aDataArray.buffer);
    }

    // private sednMsgBubaiType(type) {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x2c;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = type;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sednMsgQuqudiseType(type) {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x34;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = type;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgCombineTwoImage(path1Unicode, path2Unicode, path3Unicode, type) {
    //     let path1 = encodeURI(path1Unicode);
    //     let pathdata1 = this.stringToByte(path1);
    //     let len1 = path1.length;

    //     let path2 = encodeURI(path2Unicode);
    //     let pathdata2 = this.stringToByte(path2);
    //     let len2 = path2.length;

    //     let path3 = encodeURI(path3Unicode);
    //     let pathdata3 = this.stringToByte(path3);
    //     let len3 = path3.length;

    //     let aDataArray = new Uint8Array(7 + len1 + len2 + len3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x13;
    //     aDataArray[2] = len1 + len2 + len3 + 4;
    //     aDataArray[3] = type;
    //     aDataArray[4] = len1;
    //     for (let i = 0; i < len1; i++) {
    //         aDataArray[5 + i] = pathdata1[i];
    //     }
    //     aDataArray[5 + len1] = len2;
    //     for (let i = 0; i < len2; i++) {
    //         aDataArray[6 + len1 + i] = pathdata2[i];
    //     }

    //     aDataArray[6 + len1 + len2] = len3;
    //     for (let i = 0; i < len3; i++) {
    //         aDataArray[7 + len1 + len2 + i] = pathdata3[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgSetAutoExposure(type) {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x2d;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = type;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgGetExposureRange() {
    //     let aDataArray = new Uint8Array(3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x31;
    //     aDataArray[2] = 0x00;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgGetBrightnessRange() {
    //     let aDataArray = new Uint8Array(3);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x2e;
    //     aDataArray[2] = 0x00;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgSetBrightness(temp) {
    //     let type;
    //     if (temp < 0) {
    //         type = 0;
    //     } else {
    //         type = 1;
    //     }
    //     temp = Math.abs(temp);
    //     let aDataArray = new Uint8Array(5);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x2f;
    //     aDataArray[2] = 0x02;
    //     aDataArray[3] = type;
    //     aDataArray[4] = temp;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgSetExposure(temp) {
    //     let type;
    //     if (temp < 0) {
    //         type = 0;
    //     } else {
    //         type = 1;
    //     }
    //     temp = Math.abs(temp);
    //     let aDataArray = new Uint8Array(5);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x33;
    //     aDataArray[2] = 0x02;
    //     aDataArray[3] = type;
    //     aDataArray[4] = temp;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sednMsgGetBase64(filename) {
    //     let path = encodeURI(filename);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;
    //     let aDataArray = new Uint8Array(3 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x35;
    //     aDataArray[2] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[3 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgDeleteFile(pathUnicode) {
    //     let path = encodeURI(pathUnicode);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;
    //     let aDataArray = new Uint8Array(3 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x38;
    //     aDataArray[2] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[3 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgQrcode(pathUnicode) {
    //     let path = encodeURI(pathUnicode);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;
    //     let aDataArray = new Uint8Array(3 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x39;
    //     aDataArray[2] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[3 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgBarcode(pathUnicode) {
    //     let path = encodeURI(pathUnicode);
    //     let pathdata = this.stringToByte(path);
    //     let len = path.length;
    //     let aDataArray = new Uint8Array(3 + len);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x44;
    //     aDataArray[2] = len;
    //     for (let i = 0; i < len; i++) {
    //         aDataArray[3 + i] = pathdata[i];
    //     }
    //     this.ws.send(aDataArray.buffer);
    // }

    private sendMsgGetMainCameraID() {
        let aDataArray = new Uint8Array(4);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x3a;
        aDataArray[2] = 0x01;
        aDataArray[3] = 0x01;
        this.ws.send(aDataArray.buffer);
    }

    // private sendMsgStartIDCard() {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x3c;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = 0x00;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgGetOneIC() {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x3c;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = 0x01;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgGetICValues(type) {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x3d;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = type;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgRotateL() {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x40;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = 0;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgRotateR() {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x40;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = 1;
    //     this.ws.send(aDataArray.buffer);
    // }

    private sendMsgBestSize() {
        this.canvasX = 0;
        this.canvasY = 0;
        let aDataArray = new Uint8Array(4);
        aDataArray[0] = 0xef;
        aDataArray[1] = 0x0d;
        aDataArray[2] = 0x01;
        aDataArray[3] = 2;
        this.ws.send(aDataArray.buffer);
    }

    // private sendMsgTrueSize() {
    //     this.canvasX = 0;
    //     this.canvasY = 0;
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x0d;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = 3;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgWorkIDCard() {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x41;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = 0x01;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgStopWorkIDCard() {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x41;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = 0x00;
    //     this.ws.send(aDataArray.buffer);
    // }

    // private sendMsgShotBase64(type) {
    //     let aDataArray = new Uint8Array(4);
    //     aDataArray[0] = 0xef;
    //     aDataArray[1] = 0x42;
    //     aDataArray[2] = 0x01;
    //     aDataArray[3] = type;
    //     this.ws.send(aDataArray.buffer);
    // }

    // 手动裁边时的长方形
    private refreshRect() {
        this.context.beginPath();
        this.context.rect(this.recX_manual, this.recY_manual, this.recW_manual, this.recH_manual);
        this.context.lineWidth = 2;
        this.context.strokeStyle = '#0000ff';
        this.context.stroke();
    }

    private stringToByte(str) {
        let bytes = new Array();
        let len, c;
        len = str.length;
        for (let i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }

    private byteToString(arr) {
        if (typeof arr === 'string') {
            return arr;
        }
        let str = '',
            _arr = arr;
        for (let i = 0; i < _arr.length; i++) {
            let one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length === 8) {
                let bytesLength = v[0].length;
                let store = _arr[i].toString(2).slice(7 - bytesLength);
                for (let st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }

    // private base64Encode(input) {
    //     let rv;
    //     rv = encodeURIComponent(input);
    //     rv = unescape(rv);
    //     rv = window.btoa(rv);
    //     return rv;
    // }

    // private isIE() { //ie?
    //     if (!!window.ActiveXObject || 'ActiveXObject' in window)
    //         return true;
    //     else
    //         return false;
    // }

    private GetDevCount(camNum) {
        this.sendMsgCloseVideo();
        this.sendMsgCloseVideoSecond();
        this.sendMsgRefreshDev();
        // alert("摄像头数量:" + camNum);
    }

    private InfoTextCallback(type, str) {
        let text = '';
        if (type === 0) {
            text = '图片路径:' + str + '\r\n';
        } else if (type === 1) {
            text = '默认路径:    ' + str + '\r\n';
        } else if (type === 2) {
            text = '条码:    ' + str + '\r\n';
        } else if (type === 3) {
            text = '文件上传服务器成功:' + str + '\r\n';
        } else if (type === 4) {
            text = '文件上传服务器失败:' + str + '\r\n';
        } else if (type === 5) {
            text = 'base64编码成功,请自行处理str\r\n';
            // text ='data:;base64,' +str+'\r\n';
        } else if (type === 6) {
            text = '删除文件成功:' + str + '\r\n';
        } else if (type === 7) {
            text = '二维码:' + str + '\r\n';
        } else if (type === 8) {
            text = '拍照失败:' + str + '\r\n';
        } else if (type === 9) {
            text = '身份证名字:' + str + '\r\n';
        } else if (type === 10) {
            text = '身份证号码:' + str + '\r\n';
        } else if (type === 11) {
            text = '身份证性别:' + str + '\r\n';
        } else if (type === 12) {
            text = '身份证民族:' + str + '\r\n';
        } else if (type === 13) {
            text = '身份证生日:' + str + '\r\n';
        } else if (type === 14) {
            text = '身份证地址:' + str + '\r\n';
        } else if (type === 15) {
            text = '身份证签发机关:' + str + '\r\n';
        } else if (type === 16) {
            text = '身份证有效开始日期:' + str + '\r\n';
        } else if (type === 17) {
            text = '身份证有效截至日期:' + str + '\r\n';
        } else if (type === 18) {
            text = '安全模块号:' + str + '\r\n';
        } else if (type === 19) {
            // 身份证头像
            text = 'data:;base64,' + str;
        } else if (type === 21) {
            text = 'base64编码成功,请自行处理str(副头)\r\n';
        }
        console.log(type + '-->' + text);
    }

    private InfoCallback(op) {
        let text = '';
        if (op === 0) {
            text = '连接成功\r\n';
        } else if (op === 0x01) {
            text = '断开成功\r\n';
        } else if (op === 0x02) {
            text = '设备已经连接\r\n';
        } else if (op === 0x03) {
            text = '设备已经关闭\r\n';
            this.showAlert('0x03');
        } else if (op === 0x04) {
            text = '拍照成功\r\n';
        } else if (op === 0x05) {
            text = 'pdf添加文件成功\r\n';
        } else if (op === 0x06) {
            text = 'pdf保存成功\r\n';
        } else if (op === 0x07) {
            text = '图片合并成功\r\n';
        } else if (op === 0x08) {
            text = '智能连拍启动\r\n';
        } else if (op === 0x09) {
            text = '定时连拍启动\r\n';
        } else if (op === 0x10) {
            text = '定时连拍成功\r\n';
        } else if (op === 0x11) {
            text = '定时连拍关闭\r\n';
        } else if (op === 0x12) {
            text = '文件上传服务器成功\r\n';
        } else if (op === 0x13) {
            text = '水印开启\r\n';
        } else if (op === 0x14) {
            text = '水印关闭\r\n';
        } else if (op === 0x15) {
            text = '此设备属于本公司\r\n';
        } else if (op === 0x16) {
            text = '此设备不属于本公司\r\n';
        } else if (op === 0x17) {
            text = '自动曝光启动\r\n';
        } else if (op === 0x18) {
            text = '自动曝光关闭\r\n';
        } else if (op === 0x19) {
            text = '身份证功能启动成功\r\n';
        } else if (op === 0x1a) {
            text = '身份证功能启动失败\r\n';
        } else if (op === 0x1b) {
            text = '身份证读卡成功\r\n';
        } else if (op === 0x1c) {
            text = '身份证读卡失败\r\n';
        } else if (op === 0x1d) {
            text = '重新操作\r\n';
        } else if (op === 0x1e) {
            text = '未发现模块\r\n';
        } else if (op === 0x1f) {
            text = '未启动身份证功能\r\n';
        } else if (op === 0x20) {
            text = '启动身份证自动读卡\r\n';
        } else if (op === 0x21) {
            text = '关闭身份证自动读卡\r\n';
        } else if (op === 0x22) {
            text = '启动拍照只生成base64\r\n';
        } else if (op === 0x23) {
            text = '关闭拍照只生成base64\r\n';
        } else if (op === 0x24) {
            text = '初始化完成\r\n';
        } else if (op === 0xa0) {
            text = '没有对应分辨率\r\n';
        } else if (op === 0xa1) {
            text = 'pdf没有添加任何文件\r\n';
        } else if (op === 0xa2) {
            text = '文件不存在\r\n';
        } else if (op === 0xa3) {
            text = '意外断开\r\n';
        } else if (op === 0xa4) {
            text = '连接不上\r\n';
        } else if (op === 0xa5) {
            text = 'pdf添加文件不是jpg格式\r\n';
        } else if (op === 0xa6) {
            text = '没有发现摄像头\r\n';
        } else if (op === 0xa7) {
            text = 'camid无效\r\n';
        } else if (op === 0xa8) {
            text = '图片尺寸太小\r\n';
        } else if (op === 0xa9) {
            text = '文件上传服务器失败\r\n';
        } else if (op === 0xaa) {
            text = '该设备没有副头\r\n';
        } else if (op === 0xab) {
            text = '条码识别失败\r\n';
        } else if (op === 0xac) {
            text = '二维码识别失败\r\n';
        } else if (op === 0xad) {
            text = '图片合并失败\r\n';
        } else if (op === 0xae) {
            text = '设置路径文件不存在\r\n';
        }
        console.log(op + '-->' + text);
    }

    private showAlert(code) {
        if (this.isVisible) {
            alert(this.translates['camera'] + ':' + this.translates['System Exception'] + '[' + code + ']');
        }
    }

}
