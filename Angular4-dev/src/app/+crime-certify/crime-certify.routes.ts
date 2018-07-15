import { Routes, RouterModule } from '@angular/router';
// 犯罪证明组件模块
import { ApplyPersonComponent } from './apply-person/apply-person.component';
import { ApplyGovermentComponent } from './apply-government/apply-goverment.component';
import { ApplyCompleteComponent } from './apply-complete/apply-complete.component';
import { ApplyAnalysisComponent } from './apply-analysis/apply-analysis.component';
import { ApplyPriorityComponent } from './apply-priority/apply-priority.component';
import { ApplyRejectComponent } from './apply-reject/apply-reject.component';
import { ApplyHistoryComponent } from './apply-history/apply-history.component';
import { CertificateManagementComponent } from './certificate-management/certificate-management.component';
import { ApplyInCompleteComponent } from './apply-incomplete/apply-incomplete.component';
import { ApplyAuditPendingComponent } from './apply-audit/audit-pending/applyAudit-pending.component';
import { ApplyAuditDetailComponent } from './apply-audit/audit-detail/applyAudit-detail.component';
import { ApplyAuditCompleteComponent } from './apply-audit/audit-complete/applyAudit-complete.component';
// tslint:disable-next-line:max-line-length
import { ApplyAnalysisGovermentDetailComponent } from './apply-government/apply-analysisGovernmentDetail/apply-analysisGovernmentDetail.component';
import { ApplyGovermentDetailComponent } from './apply-government/apply-governmentDetail/apply-governmentDetail.component';
import { PersonApplyDetailComponent } from './apply-person/personApply-detail/personApply-detail.component';
import { CanDeactivateGuard } from '../+crms-common/guards/canDeactivate';
import { ApplyAuditInfoDetailComponent } from './apply-audit/audit-info-detail/applyAudit-info-detail.component';
const routes: Routes = [
    {
        path: 'apply-person',  // 个人申请
        component: ApplyPersonComponent,
        canDeactivate: [CanDeactivateGuard]
    },
    {
        path: 'apply-person/:applyIdAndStatus', // 个人申请带参数
        component: ApplyPersonComponent
    },
    {
        path: 'apply-goverment',   // 政府申请
        component: ApplyGovermentComponent,
        canDeactivate: [CanDeactivateGuard]
    }, {
        path: 'apply-govermentDetail/:analystInfo', // 政府申请详细页带参数
        component: ApplyGovermentDetailComponent
    },
    {
        path: 'apply-govermentDetail', // 政府申请详细页
        component: ApplyGovermentDetailComponent,
    },
    {
        path: 'apply-analysisgovermentDetail/:analystInfo',
        component: ApplyAnalysisGovermentDetailComponent
    },
    {
        path: 'apply-analysisgovermentDetail',
        component: ApplyAnalysisGovermentDetailComponent,
    },
    {
        path: 'apply-goverment/:analystInfo',
        component: ApplyGovermentComponent
    },
    {
        path: 'apply-goverment/:applyIdAndStatus',
        component: ApplyPersonComponent
    },
    {
        path: 'apply-analysis', // 个人申请分析
        component: ApplyAnalysisComponent
    },
    {
        path: 'apply-analysis/:analystInfo', // 个人申请分析带参数
        component: ApplyAnalysisComponent,
    },
    {
        path: 'apply-reject', // 重新申请分析
        component: ApplyRejectComponent,
    },
    {
        path: 'applyAudit-pending', // 待审核申请
        component: ApplyAuditPendingComponent,
    },
    {
        path: 'applyAudit-complete', // 已审核申请
        component: ApplyAuditCompleteComponent
    },
    {
        path: 'applyAudit-detail', //  申请审核页面
        component: ApplyAuditDetailComponent
    },
    {
      path: 'applyAudit-info-detail', //  申请审核详细页面
      component: ApplyAuditInfoDetailComponent
  },
    {
        path: 'apply-complete', // 已完成申请
        component: ApplyCompleteComponent
    },
    {
        path: 'apply-incomplete', // 未完成申请
        component: ApplyInCompleteComponent
    },
    {
        path: 'certificate-management', // 证书信息查询
        component: CertificateManagementComponent
    },
    {
        path: 'apply-history', // 申请历史记录
        component: ApplyHistoryComponent
    },
    {
        path: 'apply-priority', // 申请优先级调整
        component: ApplyPriorityComponent
    },
    {
        path: 'personApply-detail', // 个人申请详细页
        component: PersonApplyDetailComponent
    }
];

// tslint:disable-next-line:eofline
export const moduleRoutes = RouterModule.forChild(routes);
