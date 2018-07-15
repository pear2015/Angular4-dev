import { Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { UserInfo, RoleType } from '../model/auth/userinfo';
import { OperationLog } from '../model/logs/operationLog';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SocketService } from '../core/services/socket.service';
import { LoginLog } from '../model/common/LoginLog';
import * as ip from 'internal-ip';
import {
    OrgPersonService,
    LocalStorageService,
    IpcRendererService,
    LoggerRecordService,
    UtilHelper
} from '../core/';

@Component({
    templateUrl: './login.component.html',
    providers: [LoginService, ToastrService]
})
export class LoginComponent implements OnInit {
    username: string = '';
    password: string = '';
    version = '';
    copyright = '';
    isNotAuth = true;
    usernameNotEmpty = true;
    passwordNotEmpty = true;
    loginBtnDisabled: boolean = false;
    confirmVisible: boolean = false;
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
    private validateFlag: boolean = true;
    constructor(
        public ipcRendererService: IpcRendererService,
        private localStorageService: LocalStorageService,
        private loginService: LoginService,
        private orgPersonService: OrgPersonService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private utilHelper: UtilHelper,
        private logger: LoggerRecordService,
        private socketService: SocketService
    ) {
        this.operationLog = new OperationLog();
        this.loginLog = new LoginLog();
        this.systemUserInfo = new UserInfo();
        this.toastr.toastrConfig.positionClass = 'toast-bottom-right';
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.toastrConfig.timeOut = 3000;
    }

    ngOnInit() {
    }

    /**
     * 初始化词条
     * @returns {Promise<any>}
     * @memberof StatisticsPersonalComponent
     */
    async initTranslate() {
        let translateKeys: any[] = ['username or password error',
            'Login Failed,Gauth Server Inner Exception',
            'role not set,not allowed login',
            'Login Failed,Socket Server Inner Exception',
            'Login Failed,System Server Inner Exception',
            'username or password can not be null',
            'Login Failed,Server Inner Exception',
            'did not install a certificate or can be accessed gauth server',
            'username does not exist'];
        let values: any = await this.translateService.get(translateKeys);
        translateKeys.forEach((key) => {
            this.translates[key] = values.value[key];
        });

    }

    /**
     * 登录验证
     * 1、验证用户名和密码
     * 2、验证token
     * 3、验证client
     * 4、验证用户信息userInfo 验证角色
     * 5、验证person信息 personInfo
     * 6、验证socket
     *
     */
    async login() {
        await this.initTranslate();
        this.validateFlag = true;
        this.loginBtnDisabled = true;
        this.socketService.initSocketConnectionService();
        // 验证服务是否发布成功
        await this.loginService.initialData();
        // 初始化系统管理服务基地址
        await this.orgPersonService.initialCrmsService();
        // 初始化socketservice
        // 1判断用户名和密码是否为空
        this.checkUserNameAndPassWordIsNull();
        // 建立socket连接
        this.socketService.buildSocketIOConnect();
    }
    /**
     * 登陆
     * 1.检查用户名和密码是否为空
     * @memberof LoginComponent
     */
    checkUserNameAndPassWordIsNull() {
        if (this.utilHelper.AssertEqualNull(this.username) || this.utilHelper.AssertEqualNull(this.password)) {
            this.toastr.clear();
            this.toastr.error(this.translates['username or password can not be null']);
            this.validateFlag = false;
            this.loginBtnDisabled = false;
        } else {
            this.checkGauthServer();
        }
    }
    /**
     * 登陆
     * 2.检查统一认证服务
     * @memberof LoginComponent
     */
    async checkGauthServer() {
        if (this.validateFlag) {
            this.loginService.getToken(this.username, this.password).then(result => {
                if (this.utilHelper.AssertNotNull(result.error) && result.error === 'invalid_grant') {
                    // 密码错误
                    this.toastr.clear();
                    this.toastr.error(this.translates['username or password error']);
                    this.validateFlag = false;
                    this.loginBtnDisabled = false;
                } else {
                    if (result.ok === true || this.utilHelper.AssertNotNull(result.access_token)) {
                        this.gauthToken = result.access_token;
                        this.checkCrimeClientByGauth();
                    } else {
                        if (result.status === 0 && result.type === 3) {
                            // 没有安装证书或者无法访问统一认证服务
                            this.toastr.clear();
                            this.toastr.error(this.translates['did not install a certificate or can be accessed gauth server']);
                            this.validateFlag = false;
                            this.loginBtnDisabled = false;
                        } else if (result.status === 401 && result.type === 2) {
                            // 用户名不存在
                            this.toastr.clear();
                            this.toastr.error(this.translates['username does not exist']);
                            this.validateFlag = false;
                            this.loginBtnDisabled = false;
                        } else {
                            // 用户名不存在
                            this.toastr.clear();
                            this.toastr.error(this.translates['username does not exist']);
                            this.validateFlag = false;
                            this.loginBtnDisabled = false;
                        }
                    }
                }
            }).catch(err => {
                this.toastr.clear();
                this.toastr.error(this.translates['Login Failed,Gauth Server Inner Exception']);
                this.validateFlag = false;
                this.loginBtnDisabled = false;
            });
        }
    }
    /**
     * 登陆
     * 3.通过token检查犯罪的client
     * @memberof LoginComponent
     */
    async checkCrimeClientByGauth() {
        if (this.validateFlag) {
            let client: any = await this.loginService.getAccessSystem(this.gauthToken);
            if (this.utilHelper.AssertEqualNull(client)) {
                this.toastr.clear();
                this.toastr.error(this.translates['username or password error']);
                this.validateFlag = false;
                this.loginBtnDisabled = false;
            }
            if (this.validateFlag) {
                if (client.length === 0) {
                    this.toastr.clear();
                    this.toastr.error(this.translates['username or password error']);
                    this.validateFlag = false;
                    this.loginBtnDisabled = false;
                } else {
                    this.crimeClient = client;
                    this.getUserInfoByCrimeTokenAndClientId();
                }
            }

        }

    }
    /**
     * 登陆
     * 4.通过clientID和token获取用户信息
     * @memberof LoginComponent
     */
    async getUserInfoByCrimeTokenAndClientId() {
        if (this.validateFlag) {
            let userInfo = await this.loginService.getUserInfo(this.gauthToken);
            // userInfo 获取失败
            if (this.utilHelper.AssertEqualNull(userInfo)) {
                this.toastr.clear();
                this.toastr.error(this.translates['username or password error']);
                this.validateFlag = false;
                this.loginBtnDisabled = false;
            } else {
                this.gauthUserInfo = userInfo;
                this.checkUserRole();
            }
        }

    }
    /**
     * 登陆
     * 5.角色检查
     * @memberof LoginComponent
     */
    async checkUserRole() {
        if (this.validateFlag) {
            // 角色设置
            this.systemUserInfo = this.resolveUser(this.systemUserInfo, this.crimeClient, this.gauthUserInfo);
            // 角色为空不允许登录
            if (this.utilHelper.AssertEqualNull(this.systemUserInfo.roleId)) {
                this.toastr.error(this.translates['role not set,not allowed login']);
                this.validateFlag = false;
                this.loginBtnDisabled = false;
            } else {
                this.getUserInfoFromOrganizationServer();
            }
        }
    }
    /**
     * 登陆
     * 6.从系统管理服务检查用户
     * @returns
     * @memberof LoginComponent
     */
    async  getUserInfoFromOrganizationServer() {
        if (this.validateFlag) {
            let personInfo = await this.orgPersonService.getPersonByUserId(this.gauthUserInfo.id);
            // 系统管理 获取person为空
            if (this.utilHelper.AssertEqualNull(personInfo)) {
                this.toastr.error(this.translates['username or password error']);
                this.validateFlag = false;
                this.loginBtnDisabled = false;
            } else if (this.utilHelper.AssertEqualNull(personInfo.stationCode) || this.utilHelper.AssertEqualNull(personInfo.stationName)) {
                this.toastr.error(this.translates['username or password error']);
                this.validateFlag = false;
                this.loginBtnDisabled = false;
            } else {
                // 给人员赋值
                this.systemUserInfo.userName = this.username;
                this.systemUserInfo.password = this.password;
                this.systemUserInfo.token = this.gauthToken;
                this.systemUserInfo.centerCodeName = personInfo.stationName;
                this.systemUserInfo.centerCode = personInfo.stationCode;
                this.systemUserInfo.applyCenterProvince = personInfo.province;
                this.systemUserInfo.orgPersonId = personInfo.orgPersonId;
                this.systemUserInfo.personName = personInfo.orgPersonName;
                this.systemUserInfo.personImg = personInfo.gif;

                // 登陆日志记录赋值
                this.loginLog.centerCode = this.systemUserInfo.centerCode;
                this.loginLog.userId = this.systemUserInfo.orgPersonId;
                this.loginLog.centerName = this.systemUserInfo.centerCodeName;

                this.registerSocketConnectAndLogger();
            }
        }
    }
    /**
     * 7.连接socket并记录操作日志，存储user
     * @memberof LoginComponent
     */
    async  registerSocketConnectAndLogger() {
        if (this.validateFlag) {
            // 注册socket
            let socketResult: any = await this.socketService.checkSocketConnect();
            if (socketResult) {
                this.resolveLoginData(this.systemUserInfo);
            } else {
                this.validateFlag = false;
                this.loginBtnDisabled = false;
                this.toastr.error(this.translates['Login Failed,Socket Server Inner Exception']);
            }
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
        let res = await this.loginService.saveLoginLog(this.loginLog);
        if (res === false) {
            this.toastr.error(this.translates['Login Failed,Server Inner Exception']);
            this.validateFlag = false;
            this.loginBtnDisabled = false;
        } else {
            this.localStorageService.write('loginId', res.toString());
        }
        if (this.validateFlag) {
            // 操作日志记录
            this.loggerRecord();
            this.localStorageService.writeObject('currentUser', user);
            this.ipcRendererService.send('onLoginSuccess', null);
        }
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
        this.operationLog.operator = this.username;
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

    /**
     * 退出登录提示
     */
    confirmExitApp() {
        this.confirmVisible = true;
    }

    // 退出登陆
    exitApp() {
        this.ipcRendererService.send('onExitApp', null);
    }

    /**
    * 取消退出点击事件
    * @memberof NavBarComponent
    */
    cancelExitApp() {
        this.confirmVisible = false;
    }
}
