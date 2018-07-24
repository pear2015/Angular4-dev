import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import {exceptionHandle} from '../../../../shared/decorator/catch.decorator';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../../../core/';
/**
 * 附件服务
 * Create By yuxiong 2017/11/3
 * @export
 * @class AttchemntFileService
 */
@Injectable()
export class PersonHasCrimeFileService extends ServiceBase {
    private apiBaseUrl: string;
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });
     constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
        private utilHelper: UtilHelper,
    ) {
        super(configService);
        this.initialCrmsService();
    }

      /**
   * 初始化犯罪服务基地址
   */
    private async initialCrmsService(): Promise<any> {
        return this.apiBaseUrl = await this.initialcrmsBaseUrl();
    }

    /**
     * 获取图片，返回字节数组
     */
    @exceptionHandle
    async getImageFormUploaded(filePath: string): Promise<any> {
        if (this.utilHelper.AssertEqualNull(filePath)) {
            return null;
        }
        if (this.utilHelper.AssertEqualNull(this.apiBaseUrl)) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/crms/file/get/' + filePath;
        let result = await this.httpProxy.getRequest(url, 'getImageFormUploaded', { headers: this.Requestheaders });
        if (!this.utilHelper.AssertEqualNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}
