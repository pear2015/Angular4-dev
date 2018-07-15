import { Component, OnInit } from '@angular/core';
import { LocalStorageService, EventAggregator, UtilHelper, ConfigService } from '../core';
import { UserInfo } from '../model/auth/userinfo';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { TranslateService } from 'ng2-translate';
declare let electron: any;

/**
 * @Component和export中间不能有注释会影响this作用域
 */
@Component({
  templateUrl: './crms-entrance.component.html',
  providers: [LoginService]
})
export class CrmsEntranceComponent implements OnInit {
  menus: any = [];
  routeId: any;
  version: string;
  hiddenBar: boolean = true;
  constructor(
    private localStorageService: LocalStorageService,
    private loginService: LoginService,
    public router: Router,
    private eventAggregator: EventAggregator,
    private utilHelper: UtilHelper,
    private translateService: TranslateService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    if (this.utilHelper.AssertNotNull(electron.remote.process.env.token)) {
      this.eventAggregator.subscribe('localStorageDataSuccess', null, () => {
        this.getMenu(electron.remote.process.env.token);
      });
    } else {
      this.getMenu();
    }
    this.getVersion();
    this.eventAggregator.subscribe('hiddenLeftBar', '', result => { // 附件预览模式接收事件
      if (result === false) {
        this.hiddenBar = false;
      } else {
        this.hiddenBar = true;
      }
    });
  }

  /**
   * 根据登录用户的角色查询角色能访问的菜单
   */
  getMenu(token?) {
    let user = this.localStorageService.readObject('currentUser') as UserInfo;
    this.loginService.getMenu(user.accessSystemId, user.roleCode, token ? token : user.token).then((result) => {
      if (result.ok !== false) {
        this.menus = result;
      }
    });
  }

  async nav(data) {
    this.routeId = this.router.url;
    if (this.routeId === data) {
      await this.router.navigateByUrl('');
      this.router.navigate([data]);
    }
  }
  async getVersion() {
    try {
      let verValue = await this.configService.get('version');
      if (this.utilHelper.AssertNotNull(verValue)) {
        this.version = this.translateService.instant('version', { value: verValue });
      }
    } catch (ex) {
      console.log(ex);
    }

  }
}
