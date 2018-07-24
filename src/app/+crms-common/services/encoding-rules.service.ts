import { Injectable } from '@angular/core';
import { LocalStorageService, DateFormatHelper, UtilHelper } from '../../core/';
import { UserInfo } from '../../model/auth/userinfo';
/**
 * 编码生成规则
 * Create By zhangqiang 2017/11/2
 * @export
 * @class EncodingRulesService
 */
@Injectable()
export class EncodingRulesService {

    private centerCode: string;
    private user: UserInfo;

    constructor(private localStorageService: LocalStorageService,
        private dateFormatHelper: DateFormatHelper,
        private utilHelper: UtilHelper) {
        // 获取登录人员的信息的中心编码
        this.user = this.localStorageService.readObject('currentUser') as UserInfo;
        this.centerCode = this.user.centerCode;
    }

    /**
     * 证书验证码生成规则
     * 中心编码+时间戳+6位随机数  乱序
     * @returns {string}
     * @memberof EncodingRulesService
     */
    verificationCodeCreate(): string {
        let centerCode = '';
        if (this.utilHelper.AssertNotNull(this.centerCode)) {
            centerCode = this.centerCode;
        }
        let verificationCode = this.timestampGeneration() + this.randomNumber(6);
        verificationCode = this.commaSeparationString(verificationCode);
        verificationCode = this.shuffler(this.stringToArray(verificationCode));
        return centerCode + verificationCode;
    }

    /**
     * 个人档案号生成规则
     * 身份证后6位+时间戳+6为随机数  乱序
     * @param {string} certificateNumber
     * @returns {string}
     * @memberof EncodingRulesService
     */
    archivesCodeCreate(certificateNumber: string): string {
        if (this.utilHelper.AssertNotNull(certificateNumber)) {
            let temp = certificateNumber.substring(certificateNumber.length - 6, certificateNumber.length - 1)
                + this.timestampGeneration() + this.randomNumber(6);
            let archivesCode = this.shuffler(this.stringToArray(this.commaSeparationString(temp)));
            return archivesCode;
        } else {
            let temp = this.timestampGeneration() + this.randomNumber(12);
            let archivesCode = this.shuffler(this.stringToArray(this.commaSeparationString(temp)));
            return archivesCode;
        }
    }

    /**
     * 申请回执单号生成规则
     *
     * @param {string} certificateNumber
     * @memberof EncodingRulesService
     */
    deliveryReceiptNumber(certificateNumber: string) {
        if (this.utilHelper.AssertNotNull(certificateNumber)) {
            let temp = certificateNumber.substring(certificateNumber.length - 4, certificateNumber.length - 1)
                + this.timestampGeneration();
            let deliveryReceiptNumber = this.shuffler(this.stringToArray(this.commaSeparationString(temp)));
            return deliveryReceiptNumber;
        } else {
            return this.verificationCodeCreate();
        }
    }

    /**
     * n位随机数生成
     * @param {number} n
     * @returns {string}
     * @memberof EncodingRulesService
     */
    private randomNumber(n: number): string {
        let number = '';
        for (let i = 0; i < n; i++) {
            number += Math.floor(Math.random() * 10);
        }
        return number;
    }

    /**
     * 用逗号分隔字符串
     * @param {string} str
     * @returns {string}
     * @memberof EncodingRulesService
     */
    private commaSeparationString(str: string): string {
        if (this.utilHelper.AssertNotNull(str)) {
            return str.replace(/\d(?=(\d{1})+$)/g, '$&,');
        } else {
            return '';
        }
    }

    /**
     *
     * 字符串转数组
     *
     * @param {string} buffer
     * @returns {*}
     * @memberof EncodingRulesService
     */
    private stringToArray(buffer: string): any[] {
        if (this.utilHelper.AssertNotNull(buffer)) {
            return buffer.split(',');
        } else {
            return [];
        }
    }

    /**
     * 数组乱序
     * @param {any[]} array
     * @returns {any[]}
     * @memberof EncodingRulesService
     */
    private shuffler(array: any[]): string {
        if (this.utilHelper.AssertNotNull(array)) {
            let currentIndex = array.length, temporayValue, randomIndex;

            while (0 !== currentIndex) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                temporayValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporayValue;
            }

            return array.join('');
        } else {
            return '';
        }
    }

    /**
     * 字符串时间戳生成
     * @memberof EncodingRulesService
     */
    private timestampGeneration(): string {
        let currentTime = this.dateFormatHelper.HoursMinutesDateTimeFormat(new Date());
        let timeStamp = Date.parse(currentTime);
        timeStamp = timeStamp / 1000;
        return timeStamp.toString();
    }

}
