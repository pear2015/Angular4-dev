import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import * as ip from 'internal-ip';
import { EventAggregator, IpcRendererService, LocalStorageService, LoggerRecordService, UtilHelper } from '../../../core';
import { NoticeMessage } from '../../../model/socket-info/NoticeMessage';
import { DxDataGridComponent, DxValidationGroupComponent } from 'devextreme-angular';
import { UserInfo } from '../../../model/auth/userinfo';
import { HomeService } from '../../../home/home.service';
import { OperationLog } from '../../../model/logs/operationLog';
import { LoginService } from '../../../login/login.service';
import { LoginLog } from '../../../model/common/LoginLog';
import { EditPasswordService } from '../../../+crms-common/services/edit-password.service';
// import { timeout } from 'rxjs/operator/timeout';
declare let electron: any;
@Component({
  selector: 'mf-navbar',
  templateUrl: './navbar.component.html',
  styles: ['.dx-overlay-content.dx-popup-normal.dx-resizable{z-index:0;}'],
  providers: [IpcRendererService, HomeService, LoginService, EditPasswordService]
})

/**
 * 导航组件
 */
export class NavBarComponent implements OnInit {
  @ViewChild(DxDataGridComponent)
  dataGrids: DxDataGridComponent;
  /**
   * 设置弹出层的是否可见的属性
   */
  private defaultVisible = false;

  public messageTipVisible = false;

  // 用户名，角色，角色名
  personName: string = '';
  roleId: string = '';
  roleType: string = '';

  // 父路由路径 子路由路径
  parentUrl: string = '';
  childrenUrl: string = '';

  // 消息个数，消息体
  messegeCount: number = 0;

  // socket信息标记
  userMessage: string = '';

  // 确认退出提示框
  confirmVisible: boolean = false;

  // 帮助弹出框
  helper: boolean = false;
  public oneAtTime: boolean = true;
  // 消息列表
  private noticeMessageList: NoticeMessage[] = [];
  personId: string; // 人物头像

  operationLog: OperationLog; // 日志记录

  loginLog: LoginLog; // 用户登陆日志
  centerCodeName: string; // 中心编码

  loginId: string;
  hiddenBar: boolean = true;
  menuSwitch: boolean = true;
  editPasswordVisible: boolean = false;
  newUser: any;
  token: string;
  userName: string;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  constructor(
    private localStorageService: LocalStorageService,
    private eventAggregator: EventAggregator,
    private ipcRendererService: IpcRendererService,
    private homeService: HomeService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private logger: LoggerRecordService,
    private utilHelper: UtilHelper,
    private loginService: LoginService,
    private editPasswordService: EditPasswordService
  ) {
    this.operationLog = new OperationLog();
    this.loginLog = new LoginLog();
  }


  ngOnInit(): void {
    if (this.utilHelper.AssertNotNull(electron.remote.process.env.token)) {
      this.eventAggregator.subscribe('localStorageDataSuccess', null, () => {
        this.initFunc();
      });
    } else {
      this.initFunc();
    }
    this.eventAggregator.subscribe('hiddenLeftBar', '', result => { // 附件预览模式接收事件
      if (result === false) {
        this.hiddenBar = false;
      } else {
        this.hiddenBar = true;
      }
    });
    this.newUser = {
      oldPassword: null,
      newPassword: null
    };
  }

  /**
   * 初始化执行的方法
   * @memberof NavBarComponent
   */
  initFunc() {
    this.loginService.initialData();
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    this.personName = user.personName;
    this.token = user.token;
    this.roleId = user.roleId;
    this.roleType = user.roleType;
    this.personId = user.orgPersonId;
    this.userMessage = user.orgPersonId;
    this.userName = user.userName;
    this.centerCodeName = user.centerCodeName;
    this.loginId = this.localStorageService.read('loginId');
    // 日志记录操作员的name 和 Id
    this.operationLog.operator = user.userName;
    this.operationLog.operatorId = user.orgPersonId;
    // 初始化session中 消息设置
    if (this.utilHelper.AssertNotNull(sessionStorage.getItem(this.userMessage))) {
      this.messageResolve();
    } else {
      this.messegeCount = 0;
      sessionStorage.setItem(this.userMessage + 'count', '0');
      sessionStorage.setItem(this.userMessage, JSON.stringify(this.noticeMessageList));
    }
    // 消息接收以列表的形式展示
    // 收到消息 消息指定页和当前页一致 刷新数据
    this.eventAggregator.subscribe('businnessTask', '', result => {
      this.messageResolve();
      this.homeService.messageCheck(result[0], sessionStorage.getItem('currentRouter'), false, this.userMessage);
    });
    // 订阅路由参数
    this.eventAggregator.subscribe('routUrl', '', result => {
      this.parentUrl = result[0];
      this.childrenUrl = result[1];
    });
    this.toastr.toastrConfig.positionClass = 'toast-center-center';
  }

  // 国际化
  getTranslateName(code: string) {
    if (this.utilHelper.AssertNotNull(code)) {
      let key: any = this.translateService.get(code);
      return key.value;
    }
  }
  // 菜单隐藏与展开
  /*  menuToggle() {
     if (this.menuSwitch) {
       this.menuSwitch = false;
     } else {
       this.menuSwitch = true;
     }
     this.eventAggregator.publish('hiddenLeftBar', this.menuSwitch);
   } */

  /**
   * popover是否可见
   *
   * @memberof HomeComponent
   */
  toggleDefault() {
    this.defaultVisible = !this.defaultVisible;
  }

  /**
   *  确认退出
   */
  confirmExitApp() {
    this.confirmVisible = true;
  }
  // 查询消息
  lookMessage() {
    if (this.messegeCount !== 0) {
      this.messageTipVisible = true;
      // 消息接收以列表的形式展示
      this.noticeMessageList = JSON.parse(sessionStorage.getItem(this.userMessage));
    } else {
      this.toastr.clear();
      this.toastr.toastrConfig.maxOpened = 1;
      this.toastr.error(this.getTranslateName('no message'));
    }
  }
  /*
   * 清除已读消息
   */
  async hasRead(message: any, idx: any) {
    let noticeDivList = document.getElementsByClassName('tips');
    noticeDivList[idx].classList.add('tipsDelete');
    let messageList = [];
    setTimeout(
      await this.messegeExchange(message, messageList)
      , 1000);

  }
  /**
   * 收到消息 消息列表和消息数量处理
   * @param {any} message
   * @param {any} messageList
   * @memberof NavBarComponent
   */
  messageResolve() {
    this.noticeMessageList = JSON.parse(sessionStorage.getItem(this.userMessage));
    this.messegeCount = this.noticeMessageList.length;
    sessionStorage.setItem(this.userMessage + 'count', JSON.stringify(this.messegeCount));
  }
  /***
   * 清除已读消息
   *1.清除当前选中列
   *2.未读数量减1
   *3.更新消息数量和消息内容
   */
  messegeExchange(message, messageList) {
    let userMessageKey = this.userMessage;
    this.noticeMessageList.forEach((item, index) => {
      if (message.id !== item.id) {
        messageList.push(item);
      }
    });
    this.noticeMessageList = messageList;
    if (this.messegeCount <= 0 || this.noticeMessageList.length === 0) {
      this.noticeMessageList = [];
      sessionStorage.setItem(userMessageKey + 'count', '0');
      sessionStorage.setItem(userMessageKey, JSON.stringify(this.noticeMessageList));
      this.messegeCount = 0;
    } else {
      this.messegeCount = this.messegeCount - 1;
      sessionStorage.setItem(userMessageKey + 'count', JSON.stringify(this.messegeCount));
      sessionStorage.setItem(userMessageKey, JSON.stringify(this.noticeMessageList));
    }
  }
  // 清空
  clearAll() {
    this.noticeMessageList = [];
    sessionStorage.setItem(this.userMessage, JSON.stringify(this.noticeMessageList));
    this.messegeCount = 0;
    sessionStorage.setItem(this.userMessage + 'count', '0');
  }

  /**
   * 确认退出点击事件
   * @memberof HomeComponent
   */
  async exitApp() {
    this.operationLog.level = 'info';
    this.operationLog.action = 'DELETE';
    this.operationLog.actionDesc = 'sign up from system';
    this.logRecord();
    if (this.utilHelper.AssertEqualNull(this.loginId)) {
      this.loginId = '';
    }
    this.loginLog.id = this.loginId;
    await this.loginService.updateLoginLog(this.loginLog);
    this.ipcRendererService.send('onExitApp', null);
  }
  /**
   * 最小化
   */
  conMinApp() {
    this.ipcRendererService.send('hide-window', null);
  }

  /**
   * 取消退出点击事件
   * @memberof NavBarComponent
   */
  cancelExitApp() {
    this.confirmVisible = false;
  }
  /**
   * @param {string} messageType  消息跳转
   */
  onRouter(message: any, idx: any) {
    this.hasRead(message, idx);
    this.messageTipVisible = false;
    this.homeService.messageCheck(message.messageType, sessionStorage.getItem('currentRouter'), true, this.userMessage);
  }
  /**
   * 帮助点击事件
   */
  help() {
    this.helper = true;
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

  /**
 * 修改密码
*/
  editPassword() {
    this.editPasswordVisible = true;
  }
  cancel() {
    this.editPasswordVisible = false;
  }

  async  sureEditPassword(e) {
    let validaResult = this.validator.first.instance.validate(); // 验证
    if (validaResult.isValid === true) {
      let result: any = await this.editPasswordService.editPassword(this.newUser, this.token);
      if (result !== false) {
        this.editPasswordVisible = false;
        this.toastr.success(this.getTranslateName('successfully modified, will return to the login screen'));
        setTimeout(() => { this.ipcRendererService.send('editPasswordSuccess', null); }, 2000);
      } else {
        this.toastr.clear();
        this.toastr.error(this.getTranslateName('old passsword is incorrect'));
      }
    } else {
      this.toastr.clear();
      this.toastr.error(this.getTranslateName('username or password can not be null'));
    }
  }
}

