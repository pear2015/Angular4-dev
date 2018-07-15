import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DxPopupModule,
  DxButtonModule,
  DxTooltipModule,
  DxTemplateModule,
  DxDateBoxModule,
  DevExtremeModule
} from 'devextreme-angular';
import {
  ButtonsModule
} from 'ngx-bootstrap';
import { TranslateModule } from 'ng2-translate';

import { SharedModule } from '../shared';
import { moduleRoutes } from './crime-notice.routes';
import { CrmsCommonModule } from '../+crms-common/crms-common.module';

// 服务
import { CrimeAndNoticeService } from '../+crms-common/services/crime-notice.service';
import { NoticeAuditService } from './common/services/notice-audit.service';
import { NoticeInputService } from './common/services/notice-input.service';
import { OrganizationDictionaryService } from './common/services/organization-dictionary.service';
import { NoticeInquireService } from './common/services/notice-inquire.service';
import { NoticePriorityService } from './common/services/notice-priority.service';
// 犯罪公告组件模块
import { NoticeDetailComponent } from './common/components/notice-detail/notice-detail.component';
import { NoticeInputComponent } from './notice-input/notice-input.component';
import { NoticeRejectComponent } from './notice-reject/notice-reject.component';
import { NoticeHistoryComponent } from './notice-history/notice-history.component';
import { NoticeAuditingComponent } from './notice-auditing/notice-auditing.component';
import { NoticeInquireComponent } from './common/components/notice-inquire/notice-inquire.component';
import { NoticeAuditPendingComponent } from './notice-audit/audit-pending/noticeAudit-pending.component';
import { NoticeAuditDetailComponent } from './notice-audit/audit-detail/noticeAudit-detail.component';
import { NoticePriorityComponent } from './notice-priority/notice-priority.component';
import { NoticeAuditCompleteComponent } from './notice-audit/audit-complete/noticeAudit-complete.component';
import { WaitmergeCriminalComponent } from './common/components/waitmerge-criminal/waitmerge-criminal.component';
import { NoticeAuditProcessInfoComponent } from './common/components/noticeAudit-processInfo/noticeAudit-processInfo.component';
import {NoticeReInputComponent} from './notice-reinput/notice-reinput.component';
/**
* 业务模块
*/
@NgModule({
  imports: [
    SharedModule,
    HttpModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    DevExtremeModule,
    DxPopupModule,
    DxButtonModule,
    DxTooltipModule,
    DxTemplateModule,
    DxDateBoxModule,
    ButtonsModule,
    CrmsCommonModule,
    moduleRoutes
  ],
  providers: [
    CrimeAndNoticeService,
    NoticeAuditService,
    NoticeInputService,
    OrganizationDictionaryService,
    NoticeInquireService,
    NoticePriorityService
  ],
  declarations: [
    NoticeDetailComponent,
    NoticeInputComponent,
    NoticeRejectComponent,
    NoticeHistoryComponent,
    NoticeAuditingComponent,
    NoticePriorityComponent,
    NoticeAuditPendingComponent,
    NoticeAuditDetailComponent,
    NoticeAuditCompleteComponent,
    NoticeInquireComponent,
    WaitmergeCriminalComponent,
    NoticeAuditProcessInfoComponent,
    NoticeReInputComponent
  ],
  exports: [
    NoticeDetailComponent,
    NoticeInputComponent,
    NoticeRejectComponent,
    NoticeHistoryComponent,
    NoticeAuditingComponent,
    NoticePriorityComponent,
    NoticeAuditPendingComponent,
    NoticeAuditDetailComponent,
    NoticeAuditCompleteComponent,
    NoticeInquireComponent,
    WaitmergeCriminalComponent,
    NoticeAuditProcessInfoComponent,
    NoticeReInputComponent
  ]
})

export class CrimeNoticeModule {
}
