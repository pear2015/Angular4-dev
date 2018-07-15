import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { IpcRendererService, LoggerRecordService, LocalStorageService, UtilHelper } from '../../core';
import { OperationLog } from '../../model/logs/operationLog';
import { LoginLog } from '../../model/common/LoginLog';
import { LoginService } from '../../login/login.service';
import { UserInfo } from '../../model/auth/userinfo';
import * as ip from 'internal-ip';
/**
 * footbar 组件
 */
@Component({
  selector: 'login-out',
  templateUrl: './login-out.component.html',
  providers: [Modal, LoginService]
})
export class LoginOutComponent implements OnInit {
  // 订阅消息名称
  publishName: string;

  // 确认退出提示框
  confirmVisible: boolean = false;
  // socket消息提示
  socketQuitLoginMessage: string;
  // 重新登录的提示
  sockeTipeMessage: string;
  isOpenTimeCount: boolean = false; // 是否打开了计时器
  poupHours: number = 0;
  poupMinutes: number = 0;
  poupSeconds: number = 0;
  timer: string = '00  : 00 : 00';
  Interval: any;
  // 账户是否在别处登陆
  isHasLogin: boolean = false;
  // 日志记录
  operationLog: OperationLog;
  loginLog: LoginLog; // 用户登陆日志
  loginId: string;

  constructor(public modal: Modal,
    private changeDet: ChangeDetectorRef,
    private ipcRendererService: IpcRendererService,
    private logger: LoggerRecordService,
    private loginService: LoginService,
    private localStorageService: LocalStorageService,
    private utilHelper: UtilHelper
  ) {
    this.operationLog = new OperationLog();
    this.loginLog = new LoginLog();
  }

  ngOnInit(): void {
    this.loginService.initialData();
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    this.loginId = this.localStorageService.read('loginId');
    // 日志记录操作员的name 和 Id
    this.operationLog.operator = user.userName;
    this.operationLog.operatorId = user.orgPersonId;

  }

  /**
* 打开消息弹框
*/
  openMessageTip() {
    if (!this.confirmVisible) {
      this.isStartCountTime();
    }
  }
  /**
* 关闭消息弹框
*/
  closeMessageTip() {
    this.confirmVisible = false;
    this.changeDet.detach();
    clearInterval(this.Interval);
    this.changeDet.detectChanges();
  }
  /**
   * ip 在别处登录
   */
  ipHasLogin(message: string) {
    this.changeDet.detach();
    this.isHasLogin = true;
    this.confirmVisible = true;
    this.socketQuitLoginMessage = message;
    this.sockeTipeMessage = 'this account has login in other ip';
    this.changeDet.detectChanges();
  }
  /**
   *同一个ip登录两次
   */
  ipRepeatLogin() {
    this.changeDet.detach();
    this.isHasLogin = true;
    this.confirmVisible = true;
    this.socketQuitLoginMessage = '';
    this.sockeTipeMessage = 'you had login,please do not login again';
    this.changeDet.detectChanges();
  }
  /**
   * redis 服务异常
   */
  redisException() {
    this.changeDet.detach();
    this.isHasLogin = true;
    this.confirmVisible = true;
    this.socketQuitLoginMessage = '';
    this.sockeTipeMessage = 'Socket Server Inner Exception';
    this.changeDet.detectChanges();
  }
  // 开始计时

  isStartCountTime() {
    this.socketQuitLoginMessage = 'you have disconnect the server,attempt to connect';
    this.poupSeconds = 0;
    this.confirmVisible = true;
    this.changeDet.detach();
    this.Interval = setInterval(() => {
      this.poupTimeCount(this.poupSeconds);
    }, 1000);
  }

  /**
 * 计时器
 */
  poupTimeCount(num: number) {
    num++;
    this.poupSeconds = num;
    if (num > 0 && (num % 60) === 0) {
      this.poupMinutes += 1; this.poupSeconds = 0;
    };
    if (this.poupMinutes > 0 && (this.poupMinutes % 60) === 0) {
      this.poupHours += 1; this.poupMinutes = 0;
    }
    this.timer = this.addZero(this.poupHours) + ' : ' + this.addZero(this.poupMinutes) + ' : ' + this.addZero(this.poupSeconds);
    this.changeDet.detectChanges();
  }
  /**
* 补0的方法
*/
  addZero(value: number) {
    let result: string;
    if (value < 10) {
      result = '0' + value.toString();
    } else {
      result = value.toString();
    }
    return result;
  }
  /**
   * 确认退出点击事件
   * @memberof HomeComponent
   */
  async exitApp() {
    // // 人口库查询日志记录
    // this.operationLog.level = 'info';
    // this.operationLog.action = 'DELETE';
    // this.operationLog.actionDesc = 'sign up from system';
    // this.logRecord();
    // if (this.utilHelper.AssertEqualNull(this.loginId)) {
    //   this.loginId = '';
    // }
    // this.loginLog.id = this.loginId;
    // await this.loginService.updateLoginLog(this.loginLog);
    this.ipcRendererService.send('onExitApp', null);
  }
  // 操作日志记录
  logRecord() {
    this.operationLog.business = 'login-system';
    this.operationLog.isBatchAction = false;
    this.operationLog.module = 'login';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.oldContent = null;
    this.operationLog.newContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }
}
