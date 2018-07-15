import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { OperationLog } from '../../model/logs/operationLog';
import { ConfigService } from './config.service';
import { HttpProxyService } from './http.proxy.service';
import { ServiceBase } from '../servicebase';
// import {}

/**
 * 业务系统操作日志
 */
@Injectable()
export class LoggerRecordService extends ServiceBase {
    operationLog: OperationLog;
    private logSvrUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(
        public serviceBase: ServiceBase,
        public configService: ConfigService,
        private httpProxy: HttpProxyService
    ) {
        super(configService);
        this.initialLoggerRecordService();
    }

    /**
     * 初始化日志服务基地址
     */
    async initialLoggerRecordService() {
        this.logSvrUrl = await this.inititLogAuditUrl();
    }

    /**
     * 日志记录
     * @param loginOperationLog
     */
    record(OperationLog) {

        let url = this.logSvrUrl;
        try {
            this.httpProxy.postRequest(url, JSON.stringify(OperationLog),
                'record', { headers: this.Requestheaders });
        } catch (error) {
            console.log('log record error');
        }

    }

}
