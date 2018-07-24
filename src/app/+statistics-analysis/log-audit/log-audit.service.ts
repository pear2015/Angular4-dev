import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, ServiceBase, UtilHelper } from '../../core/';
import { LogQueryInfo } from '../../model/logs/LogQueryInfo';
import { exceptionHandle } from '../../shared/decorator/catch.decorator';
/**
 * 日志审计服务
 */
@Injectable()
export class LogAuditService extends ServiceBase {

    /**
     * 日志服务基地址
     */
    getlogSvrUrl: string;
    Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public configService: ConfigService,
        private httpProxy: HttpProxyService,
        private utilHelper: UtilHelper) {
        super(configService);
        this.initAuditLogService();
    }
    async  initAuditLogService(): Promise<any> {
        this.getlogSvrUrl = await this.initialGetLogAuditUrl();
    }

    /**
    * 获取日志信息
    */
    @exceptionHandle
    async getLogInfos(logQueryInfo: LogQueryInfo): Promise<any> {
        if (this.utilHelper.AssertEqualNull(logQueryInfo)) {
            return null;
        }
        if (this.getlogSvrUrl == null || this.getlogSvrUrl === undefined) {
            await this.initAuditLogService();
        }
        let url = this.getlogSvrUrl;
        let result = await this.httpProxy.postRequest(url, JSON.stringify(logQueryInfo),
            'getLogInfos', { headers: this.Requestheaders });

        if (this.utilHelper.AssertNotNull(result)) {
            return result;
        } else {
            return null;
        }
    }
}
