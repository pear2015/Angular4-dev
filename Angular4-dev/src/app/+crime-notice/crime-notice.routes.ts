import { Routes, RouterModule } from '@angular/router';
// 犯罪公告组件模块
import { NoticeDetailComponent } from './common/components/notice-detail/notice-detail.component';
import { NoticeInputComponent } from './notice-input/notice-input.component';
import { NoticeRejectComponent } from './notice-reject/notice-reject.component';
import { NoticeHistoryComponent } from './notice-history/notice-history.component';
import { NoticeAuditingComponent } from './notice-auditing/notice-auditing.component';
import { NoticeAuditPendingComponent } from './notice-audit/audit-pending/noticeAudit-pending.component';
import { NoticeAuditDetailComponent } from './notice-audit/audit-detail/noticeAudit-detail.component';
import { NoticePriorityComponent } from './notice-priority/notice-priority.component';
import { NoticeAuditCompleteComponent } from './notice-audit/audit-complete/noticeAudit-complete.component';
import { NoticeReInputComponent } from './notice-reinput/notice-reinput.component';
import { CanDeactivateGuard } from '../+crms-common/guards/canDeactivate';
const routes: Routes = [
  {
    path: 'notice-input', // 公告录入
    component: NoticeInputComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'notice-reinput', // 公告录入
    component: NoticeReInputComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'notice-auditing', // 审核中公告
    component: NoticeAuditingComponent
  },
  {
    path: 'notice-reject', // 重新录入公告
    component: NoticeRejectComponent
  },
  {
    path: 'notice-history', // 历史公告查询
    component: NoticeHistoryComponent
  },
  {
    path: 'noticeAudit-pending', // 待审核公告
    component: NoticeAuditPendingComponent
  },
  {
    path: 'noticeAudit-detail', // 公告审核详细页
    component: NoticeAuditDetailComponent
  },
  {
    path: 'notice-detail', // 公告详细页
    component: NoticeDetailComponent
  },
  {
    path: 'noticeAudit-complete', // 已审核公告
    component: NoticeAuditCompleteComponent
  },
  {
    path: 'notice-priority', // 公告优先级调整
    component: NoticePriorityComponent
  }
];

// tslint:disable-next-line:eofline
export const moduleRoutes = RouterModule.forChild(routes);
