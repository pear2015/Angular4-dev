import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CrmsBaseService } from './crms.baseService';
import { UserInfo, RoleType } from '../model/auth/userinfo';
import { OperationLog } from '../model/logs/operationLog';
import { SocketService } from '../core/services/socket.service';
import { LoginLog } from '../model/common/LoginLog';
import { EventAggregator } from '../core';
import * as ip from 'internal-ip';
import {
  OrgPersonService,
  LocalStorageService,
  IpcRendererService,
  LoggerRecordService,
  UtilHelper
} from '../core/';
/**
 * 犯罪公告和犯罪信息服务
 */
@Injectable()
export class CrmsTokenService {
  username: string = '';
  password: string = '';
  version = '';
  copyright = '';
  isNotAuth = true;
  usernameNotEmpty = true;
  passwordNotEmpty = true;
  errorMessage = '';
  // 操作日志记录
  operationLog: OperationLog;
  // 登陆日志
  private loginLog: LoginLog;
  // 词条数组
  translates: any[] = [];
  // gauth获取的token
  private gauthToken: any;
  private crimeClient: any[] = [];
  private gauthUserInfo: any;
  private systemUserInfo: any;
  private login_token: any;
  constructor(
    private getTokenService: CrmsBaseService,
    public ipcRendererService: IpcRendererService,
    private localStorageService: LocalStorageService,
    private orgPersonService: OrgPersonService,
    private utilHelper: UtilHelper,
    private logger: LoggerRecordService,
    private socketService: SocketService,
    private router: Router,
    private eventAggregator: EventAggregator
  ) {
    this.operationLog = new OperationLog();
    this.loginLog = new LoginLog();
    this.systemUserInfo = new UserInfo();
  }

  /**
   直接调用token执行方法
  */
  async login(token) {
    this.login_token = token;
    this.socketService.initSocketConnectionService();
    // 验证服务是否发布成功
    await this.getTokenService.initialData();
    // 初始化系统管理服务基地址
    await this.orgPersonService.initialCrmsService();
    // 建立socket连接
    await this.socketService.buildSocketIOConnect();
    await this.checkCrimeClientByGauth();
  }

  /**
   * 登陆
   * 3.通过token检查犯罪的client
   * @memberof LoginComponent
   */
  async checkCrimeClientByGauth() {
    this.gauthToken = this.login_token;
    try {
      let client: any = await this.getTokenService.getAccessSystem(this.gauthToken);
      if (this.utilHelper.AssertNotNull(client)) {
        this.crimeClient = client;
        await this.getUserInfoByCrimeTokenAndClientId();
      }
    } catch (error) {
      console.log(error);
    }

  }

  /**
  * 登陆
  * 4.通过clientID和token获取用户信息
  */
  async getUserInfoByCrimeTokenAndClientId() {
    try {
      let userInfo = await this.getTokenService.getUserInfo(this.gauthToken);
      // userInfo 获取失败
      this.gauthUserInfo = userInfo;
      await this.checkUserRole();
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * 登陆
  * 5.角色检查
  * @memberof LoginComponent
  */
  async checkUserRole() {
    // 角色设置
    this.systemUserInfo = this.resolveUser(this.systemUserInfo, this.crimeClient, this.gauthUserInfo);
    await this.getUserInfoFromOrganizationServer();
  }

  /**
  * 登陆
  * 6.从系统管理服务检查用户
  * @returns
  * @memberof LoginComponent
  */
  async  getUserInfoFromOrganizationServer() {
    let personInfo = await this.orgPersonService.getPersonByUserId(this.gauthUserInfo.id);
    // 系统管理 获取person为空
    // 给人员赋值
    this.systemUserInfo.userName = personInfo.userName;
    this.systemUserInfo.password = this.password;
    this.systemUserInfo.token = this.gauthToken;
    this.systemUserInfo.centerCodeName = personInfo.stationName;
    this.systemUserInfo.centerCode = personInfo.stationCode;
    this.systemUserInfo.orgPersonId = personInfo.orgPersonId;
    this.systemUserInfo.personName = personInfo.orgPersonName;
    this.systemUserInfo.personImg = personInfo.gif;

    // 登陆日志记录赋值
    this.loginLog.centerCode = this.systemUserInfo.centerCode;
    this.loginLog.userId = this.systemUserInfo.orgPersonId;
    this.loginLog.centerName = this.systemUserInfo.centerCodeName;
    await this.registerSocketConnectAndLogger();
  }

  /**
  * 7.连接socket并记录操作日志，存储user
  * @memberof LoginComponent
  */
  async  registerSocketConnectAndLogger() {
    // 注册socket
    let socketResult: any = await this.socketService.checkSocketConnect();
    if (socketResult) {
      await this.resolveLoginData(this.systemUserInfo);
    }
  }

  /**
   * 登录处理
   * 前提条件：
   * 统一认证验证通过
   * 系统管理验证通过
   * socket 服务连接成功
   * 保存日志和登录数据
   */
  async resolveLoginData(user: UserInfo) {
    let res = await this.getTokenService.saveLoginLog(this.loginLog);
    await this.localStorageService.write('loginId', res.toString());
    // 操作日志记录
    await this.loggerRecord();
    await this.localStorageService.writeObject('currentUser', user);
    // this.ipcRendererService.send('onLoginSuccess', null);
    this.eventAggregator.publish('localStorageDataSuccess', null);
    this.router.navigate(['crms-system']);
  }

  /**
  *将公共平台获取的用户赋给本地的用户模型中
  */
  resolveUser(user: UserInfo, result: any, userInfo: any): any {
    // user.token = token;
    user.accessSystem = result[0].name;
    user.accessSystemId = result[0].id;
    let roleList: any = userInfo.roles;
    if (this.utilHelper.AssertNotNull(roleList) && roleList.length > 0) {
      roleList = roleList.filter(item => item.configuration === '-1');
      user.roleId = roleList[0].id;
      user.roleName = roleList[0].name;
      user.roleCode = roleList[0].code;
      if (user.roleCode === '4') {
        user.roleType = RoleType[0];
      } else if (user.roleCode === '5') {
        user.roleType = RoleType[1];
      } else if (user.roleCode === '6') {
        user.roleType = RoleType[2];
      } else if (user.roleCode === '7') {
        user.roleType = RoleType[3];
      } else if (user.roleCode === '1') {
        user.roleType = RoleType[5];
      } else if (user.roleCode === '8') {
        user.roleType = RoleType[4];
      }
    }
    return user;
  }


  /**
  * 操作日志记录
  */
  loggerRecord() {
    // this.operationLog.operator = this.username;
    this.operationLog.operatorId = this.systemUserInfo.orgPersonId;
    this.operationLog.action = 'QUERY';
    this.operationLog.actionDesc = 'sign in crms system';
    this.operationLog.business = 'login-system';
    this.operationLog.isBatchAction = false;
    this.operationLog.level = 'info';
    this.operationLog.module = 'login';
    this.operationLog.operateDate = this.utilHelper.format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.operationLog.system = 'crms';
    this.operationLog.newContent = null;
    this.operationLog.oldContent = null;
    this.operationLog.operationIp = ip();
    this.logger.record(this.operationLog);
  }


}
