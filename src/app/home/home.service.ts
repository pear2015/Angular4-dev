import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService, HttpProxyService, EventAggregator } from '../core/';
import { MessageType } from '../model/socket-info/NoticeMessage';
import { Router } from '@angular/router';
/**
 * 犯罪公告和犯罪信息服务
 */
@Injectable()
export class HomeService {
    private socketApiBaseUrl: string;
    // 数据传输格式必须在GET和POST方法中加入 默认的数据格式 text/plain
    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });

    constructor(private configService: ConfigService, private httpProxy: HttpProxyService,
        private router: Router, private eventAggregator: EventAggregator) {

    }


    /**
    * 初始socket基地址
    */
    initialHomeService(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.configService.get('socketApiBaseUrl').then(url => {
                if (url) {
                    this.socketApiBaseUrl = url + '/api/v1';
                    return resolve();
                } else {
                    return reject('can not read apiBaseUrl config.');
                }
            });
        });
    }

    /**
     * 注册监听
     */
    addEventListener(eventList: string[]): Promise<any> {
        let url = this.socketApiBaseUrl + '/socket/event/add/';
        let result = this.httpProxy.postRequest(url,
            JSON.stringify(eventList),
            'addEventListener', { headers: this.Requestheaders });
        return result;
    }
    /**
     * 消息类型匹配
     * 判断是否在当前页面
     * 当前页面 刷新记录（只刷新列表）
     * 不在当前页面 进行路由跳转
     * @param {string} messageType   消息类型
     * @param {string} currentRouter 缓存中当前路由
     * @param {boolean} isRefresh   是否进行路由跳转
     * @memberof HomeService
     */
    matchMessageTypeByCurrentRoter(messageType: string, currentRouter: string, isRefresh: boolean, orgPersonId: String) {
        if ((messageType === MessageType[0]) && currentRouter === 'apply-analysis') {
            this.eventAggregator.publish('goAnalysisRefreshTask', orgPersonId);
        } else if ((messageType === MessageType[1] || messageType === MessageType[5]) && currentRouter === 'apply-reject') {
            this.eventAggregator.publish('replyAnalysisRefreshTask', []);
        } else if ((messageType === MessageType[2] || messageType === MessageType[4]) && currentRouter === 'applyAudit-pending') {
            this.eventAggregator.publish('applyAuditRefreshTask', []);

        } else if ((messageType === MessageType[7] || messageType === MessageType[8]) && currentRouter === 'apply-incomplete') {
            this.eventAggregator.publish('recordIncompleteRefreshTask', []);
        } else if ((messageType === MessageType[6] || messageType === MessageType[3]) && currentRouter === 'apply-complete') {
            this.eventAggregator.publish('applyGovermentRecordRefreshTask', []);
        } else if (messageType === MessageType[9] && currentRouter === 'noticeAudit-pending') {
            this.eventAggregator.publish('noticeAuditPendingRecordRefreshTask', []);
        } else if (messageType === MessageType[10] && currentRouter === 'notice-reject') {
            this.eventAggregator.publish('noticeRejectRecordRefreshTask', []);
        } else if (messageType === MessageType[11] && currentRouter === 'notice-history') {
            this.eventAggregator.publish('noticeHistoryRecordRefreshTask', []);
        } else {
            if (isRefresh) {
                this.goToNewRouter(messageType);
            }
        }

    }

    /**
    * 消息跳转 数据验证
    * @param {string} messageType
    * @param {string} currentRoute
    */
    messageCheck(messageType: string, currentRouter: string, isJump: boolean, orgPersonId: String) {
        if (messageType === undefined || messageType === null || messageType === '') {
            return false;
        }
        if (isJump) {
            this.goToNewRouter(messageType);
        } else {
            this.matchMessageTypeByCurrentRoter(messageType, currentRouter, isJump, orgPersonId);
        }
        return true;
    }
    /**
     * 非当前页，进行页面跳转
    * 消息路由类型
    * 0个人申请 分析员首次申请
    * 1个人申请 分析员处理驳回申请
    * 2个人申请 审核员审核分派
    * 3个人申请 审核通过 拒绝
    * 4政府申请 分派审核员
    * 5政府申请 分析员处理驳回
    * 6政府申请 政府申请结束 拒绝
    * 7个人申请 待打印
    * 8政府申请 待打印
    * 9 公告申请 审核员待分派
    * 10公告申请  审核拒绝
    * 11公告申请  审核通过
   */

    async  goToNewRouter(messageType) {
        switch (messageType) {
            case MessageType[0]: await this.router.navigateByUrl('');
            this.router.navigate(['/crms-system/crime-certify/apply-analysis']);
            break;
            case MessageType[1]:
            case MessageType[5]: await this.router.navigateByUrl('');
             this.router.navigate(['/crms-system/crime-certify/apply-reject']);
              break;
            case MessageType[2]: await this.router.navigateByUrl('');
            this.router.navigate(['/crms-system/crime-certify/applyAudit-pending']);
            break;
            case MessageType[4]: await this.router.navigateByUrl('');
            this.router.navigate(['/crms-system/crime-certify/applyAudit-pending']);
            break;
            case MessageType[3]:
            case MessageType[6]: await this.router.navigateByUrl('');
            this.router.navigate(['/crms-system/crime-certify/apply-complete']);
             break;
            case MessageType[7]:
            case MessageType[8]: await this.router.navigateByUrl('');
            this.router.navigate(['/crms-system/crime-certify/apply-incomplete']);
            break;
            case MessageType[9]: await this.router.navigateByUrl('');
            this.router.navigate(['/crms-system/crime-notice/noticeAudit-pending']);
            break;
            case MessageType[10]: await this.router.navigateByUrl('');
            this.router.navigate(['/crms-system/crime-notice/notice-reject']);
            break;
            case MessageType[11]: await this.router.navigateByUrl('');
            this.router.navigate(['/crms-system/crime-notice/notice-history']);
            break;
        }
    }

}
