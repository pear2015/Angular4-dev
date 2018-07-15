import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApplyAnalysisService } from '../services/apply-analysis.service';
import { LocalStorageService, UtilHelper } from '../../core';
import { UserInfo } from '../../model/auth/userinfo';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class NoDataGuard implements CanActivate {
    constructor(
        private applyAnalysisService: ApplyAnalysisService,
        private localStorageService: LocalStorageService,
        private toastrService: ToastrService,
        private utilHelper: UtilHelper,
    ) {
        this.toastrService.toastrConfig.positionClass = 'toast-center-center';
    }

    // 判断是否存在分析数据，存在跳转，不存在弹出提醒
    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        try {
            // 获取路由参数
            if (route.params['applyId'] === null || route.params['applyId'] === undefined) {
                // 从缓存中获取登陆的分析员ID
                let user = await this.localStorageService.readObject('currentUser') as UserInfo;
                await this.applyAnalysisService.initialApplyService();
                let result = await this.applyAnalysisService.getAnalystTasksByAnalystId(user.orgPersonId);
                if (this.utilHelper.AssertNotNull(result)) {
                    await this.toastrService.error('no data');
                    return false;
                } else if (this.utilHelper.AssertNotNull(result.certificateApplyInfo)) {
                    await this.toastrService.error('data isNull');
                    return false;
                }
                return true;
            } else {
                return true;
            }
        } catch (error) {
            this.toastrService.error('connection err and no data');
            return false;
        }
    }
}
