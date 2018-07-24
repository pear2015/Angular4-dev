import { Component, OnInit, ViewChild } from '@angular/core';
import { EventAggregator, ConfigService, IpcRendererService, UtilHelper } from '../core';
import { SocketClient } from '../core';
import { NoticeMessage } from '../model/socket-info/NoticeMessage';
import { SocketQuery } from '../model/socket-info/SocketQuery';
import { SocketService } from '../core/services/socket.service';
import { HomeService } from './home.service';
import { UserInfo, RoleType } from '../model/auth/userinfo';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { LoginOutComponent } from './login-out/login-out.component';
import { CrmsTokenService } from './crms.token.service';
declare let electron: any;
@Component({
  templateUrl: './home.component.html',
  providers: [HomeService, IpcRendererService, CrmsTokenService]
})
export class HomeComponent implements OnInit {
  // 消息通知连接Url
  socketConnectUrl: string = '';
  // 查询参数
  socketQuery: SocketQuery;

  // 消息体
  noticeMessage: NoticeMessage;
  // 用户信息
  userInfo: UserInfo;
  // 事件监听列表
  private evenList: string[];
  private noticeMessageList: NoticeMessage[] = [];
  // 订阅消息名称
  publishName: string;
  // 账户是否在别处登陆
  isHasLogin: boolean = false;
  @ViewChild(LoginOutComponent) loginOutComponent: LoginOutComponent;
  login_token: any;
  constructor(
    private socketClient: SocketClient,
    private eventAggregator: EventAggregator,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private socketService: SocketService,
    private configService: ConfigService,
    private utilHelper: UtilHelper,
    private crmsTokenService: CrmsTokenService,

  ) {
    this.noticeMessage = new NoticeMessage();
  }

  ngOnInit() {
    if (this.utilHelper.AssertNotNull(electron.remote.process.env.token)) {
      this.crmsTokenService.login(electron.remote.process.env.token);
    }
    this.userInfo = JSON.parse(localStorage.currentUser);
    // 初始化socket event事件列表
    this.configService.get('socketEvent').then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.evenList = result;
      }
    }).catch(e => {
      console.log(e);
    });

    // 初始化socket的连接地址
    this.socketService.initSocketConnectionService()
      .then(result => {
        this.buildSocketIOConnect();
        this.socketService.getSocketCurrentStatus(this.userInfo);
      }).catch(err => {
        console.log(err);
      });

    // 初始化socketapi服务基地址
    this.socketService.initialSocketService()
      .then(result => {
        this.addEventListenerList();
      }).catch(error => {
        console.log(error);
      });

    // 掉线时 收到消息退出登陆
    this.eventAggregator.subscribe('quitLogin', '', result => {
      this.loginOutComponent.openMessageTip();
    });

    // 收到消息 成功登陆
    this.eventAggregator.subscribe('loginSuccess', '', result => {
      this.loginOutComponent.closeMessageTip();
    });
    // redis异常
    this.eventAggregator.subscribe('redisException', '', result => {
      this.loginOutComponent.redisException();
    });
  }

  // 连接检测
  socketConnectCheck() {
    let connFlag = this.socketService.checkSocketConnect();
    // 如果未连接
    if (!connFlag) {
      this.socketService.initSocketConnectionService();
    }
  }
  /**
   * 建立socket连接
   * @memberof HomeComponent
   */
  buildSocketIOConnect() {
    // 初始化查询参数，后面接入统一认证平台后需要修改此处
    this.socketService.buildSocketIOConnect();
    this.subscribleSocketEvent(this.userInfo.roleType);
  }

  /**
   * 注册监听
   * */
  addEventListenerList() {
    this.socketService.addEventListener(this.evenList).then(result => {
    }).catch(err => {
      console.log(err);
    });
  }


  /**
     * 根据角色订阅不同的消息事件
     * @param role
     */
  subscribleSocketEvent(roleType: string) {
    if (roleType === RoleType[0]) {
      this.messagePublish('operatorEvent', 'businnessTask');
    } else if (roleType === RoleType[1]) {
      this.messagePublish('analystEvent', 'businnessTask');
    } else if (roleType === RoleType[2]) {
      this.messagePublish('auditorEvent', 'businnessTask');
    } else if (roleType === RoleType[3]) {
      this.messagePublish('filerEvent', 'businnessTask');
    }
    // 账户在别处登陆
    this.socketClient.Listen('LeaveEvent', result => {
      this.socketService.disconnetSocket();
      this.loginOutComponent.ipHasLogin(result);
    });

    // 同一个账户登录两次
    this.socketClient.Listen('RepeatLoginEvent', result => {
      this.socketService.disconnetSocket();
      this.loginOutComponent.ipRepeatLogin();
    });
  }


  /***
   * 给navBar传递消息
   */
  messagePublish(event: string, publishName: string) {
    this.socketClient.Listen(event, result => {
      this.saveMessageStorage(result);
      if (result.messageType === undefined || result.messageType === null) {
        result.messageType = '';
      }
      // 发布消息
      this.eventAggregator.publish(publishName, [result.messageType]);
    });
  }

  /**
 *消息存储
 *判断离线缓存中是否存在消息数据
 * 1、存在
 *  1.1 将存储的消息json转化为对象
 *  1.2 将对象付给消息列表
 *  1.3将最新的一条数据push到列表中
 *  1.4将消息转化为json字符串存储在离线缓存中
 * 2.不存在
 *  2.1 将最新的一条数据push到userMessage列表中
 *  2.2 将消息转化为json字符串存储在离线缓存中
 */
  saveMessageStorage(result) {
    this.translateService.get([result.content]).subscribe(value => {
      this.toastr.info('', value[result.content],
        { timeOut: 3000, positionClass: 'toast-top-right' });
    });
    let userMessage = this.userInfo.orgPersonId;
    if (sessionStorage.getItem(userMessage) === undefined || sessionStorage.getItem(userMessage) === '' ||
      sessionStorage.getItem(userMessage) === null) {
      this.noticeMessageList.push(result);
    } else {
      this.noticeMessageList = JSON.parse(sessionStorage.getItem(userMessage)) || [];
      this.noticeMessageList.push(result);

    }
    sessionStorage.setItem(userMessage, JSON.stringify(this.noticeMessageList));
    sessionStorage.setItem(userMessage + 'count', JSON.stringify(this.noticeMessageList.length));
  }
}

