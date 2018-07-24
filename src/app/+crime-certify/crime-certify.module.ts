import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { moduleRoutes } from './crime-certify.routes';
import { CrmsCommonModule } from '../+crms-common/crms-common.module';
import { SharedModule } from '../shared';
// 犯罪证明组件模块
import { ApplyPersonComponent } from './apply-person/apply-person.component';
import { ApplyGovermentComponent } from './apply-government/apply-goverment.component';
import { ApplyCompleteComponent } from './apply-complete/apply-complete.component';
import { ApplyAnalysisComponent } from './apply-analysis/apply-analysis.component';
import { ApplyPriorityComponent } from './apply-priority/apply-priority.component';
import { ApplyRejectComponent } from './apply-reject/apply-reject.component';
import { HistoryComponent } from './common/components/history/history.component';
import { ApplyHistoryComponent } from './apply-history/apply-history.component';
import { NoDataComponent } from './common/components/noData/noData.component';
import { AuditPersonApplyInfoComponent } from './common/components/audit-personApplyInfo/audit-personApplyInfo.component';
import { AuditApplyBasicInfoComponent } from './common/components/audit-applyBasicInfo/audit-applyBasicInfo.component';
import { AuditGovernApplyInfoComponent } from './common/components/audit-governApplyInfo/audit-governApplyInfo.component';
import { CertificatePrintComponent } from './common/components/certificate-print/certificate-print.component';
import { CertificateManagementComponent } from './certificate-management/certificate-management.component';
import { CrmsPrintComponent } from './common/components/crms-print/crms-print.component';
import { ApplyInCompleteComponent } from './apply-incomplete/apply-incomplete.component';
import { ApplyAuditPendingComponent } from './apply-audit/audit-pending/applyAudit-pending.component';
import { ApplyAuditDetailComponent } from './apply-audit/audit-detail/applyAudit-detail.component';
import { ApplyAuditInfoDetailComponent } from './apply-audit/audit-info-detail/applyAudit-info-detail.component';
import { ApplyAuditCompleteComponent } from './apply-audit/audit-complete/applyAudit-complete.component';
import { ApplyGovermentInfoComponent } from './apply-government/apply-info/apply-govermentInfo.component';
import { ApplyGovermentBasicInfoComponent } from './apply-government/basic-info/basic-info.component';
import { ApplyGovermentAnalysisResultComponent } from './apply-government/analysis-result/analysis-result.component';
// tslint:disable-next-line:max-line-length
import { ApplyAnalysisGovermentDetailComponent } from './apply-government/apply-analysisGovernmentDetail/apply-analysisGovernmentDetail.component';
import { ApplyGovermentDetailComponent } from './apply-government/apply-governmentDetail/apply-governmentDetail.component';
import { CrimeRecordPrintComponent } from './common/components/crimerecord-print/crimerecord-print-component';
import { CrmsPersonApplyInfoComponent } from './apply-person/person-applyInfo/person-applyInfo.component';
import { CrmsPersonApplyBasicInfoComponent } from './apply-person/person-applyBasicInfo/person-applyBasicInfo.component';
import { ReadOnlyPersonApplyInfoComponent }
  from './common/components/readOnly-personApplyInfo/readOnly-personApplyInfo.component';
import { ReadOnlyPersonApplyBasicInfoComponent }
  from './common/components/readOnly-personApplyBasicInfo/readOnly-personApplyBasicInfo.component';
import { PersonApplyDetailComponent } from './apply-person/personApply-detail/personApply-detail.component';
import { ApplyAuditProcessInfoComponent } from './common/components/applyAudit-processInfo/applyAudit-processInfo.component';
import { ApplyCommonService } from '../+crms-common/services/apply-common.service';
import { PersonNoCrimePrintComponent } from './common/components/person-noCrimePrint/person-noCrimePrint.component';
import { PersonHasCrimePrintComponent } from './common/components/person-hasCrimePrint/person-hasCrimePrint.component';
import {
  DxPopupModule,
  DxButtonModule,
  DxTooltipModule,
  DxTemplateModule,
  DxDateBoxModule,
  DevExtremeModule,
  DxValidationSummaryModule,
  DxValidatorModule,
  DxValidationGroupModule,
} from 'devextreme-angular';

import {
  ButtonsModule,
  PopoverModule,
  CollapseModule,
  AccordionModule,
  CarouselModule,
  PaginationModule
} from 'ngx-bootstrap';
import { MarkdownModule } from 'angular2-markdown';
/**
* 业务模块
*/
@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    TranslateModule,
    moduleRoutes,
    SharedModule,
    DxPopupModule,
    DxButtonModule,
    DxTooltipModule,
    DxTemplateModule,
    DxDateBoxModule,
    DevExtremeModule,
    DxValidationSummaryModule,
    DxValidatorModule,
    DxValidationGroupModule,
    ButtonsModule,
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    MarkdownModule.forRoot(),
    PaginationModule.forRoot(),
    CarouselModule.forRoot(),
    CrmsCommonModule,
  ],
  providers: [
    ApplyCommonService
  ],
  declarations: [
    ApplyPersonComponent,
    ApplyGovermentComponent,
    ApplyCompleteComponent,
    ApplyAnalysisComponent,
    ApplyPriorityComponent,
    ApplyRejectComponent,
    HistoryComponent,
    ApplyHistoryComponent,
    NoDataComponent,
    CertificatePrintComponent,
    CertificateManagementComponent,
    CrmsPrintComponent,
    ApplyInCompleteComponent,
    ApplyAuditPendingComponent,
    ApplyAuditDetailComponent,
    ApplyAuditInfoDetailComponent,
    ApplyAuditCompleteComponent,
    ApplyGovermentInfoComponent,
    ApplyGovermentBasicInfoComponent,
    ApplyGovermentAnalysisResultComponent,
    ApplyAnalysisGovermentDetailComponent,
    ApplyGovermentDetailComponent,
    CrimeRecordPrintComponent,
    CrmsPersonApplyInfoComponent,
    CrmsPersonApplyBasicInfoComponent,
    ReadOnlyPersonApplyInfoComponent,
    ReadOnlyPersonApplyBasicInfoComponent,
    PersonApplyDetailComponent,
    ApplyAuditProcessInfoComponent,
    AuditPersonApplyInfoComponent,
    AuditApplyBasicInfoComponent,
    AuditGovernApplyInfoComponent,
    PersonNoCrimePrintComponent,
    PersonHasCrimePrintComponent
  ],
  exports: [
    ApplyPersonComponent,
    ApplyGovermentComponent,
    ApplyCompleteComponent,
    ApplyAnalysisComponent,
    ApplyPriorityComponent,
    ApplyRejectComponent,
    HistoryComponent,
    ApplyHistoryComponent,
    NoDataComponent,
    CertificatePrintComponent,
    CertificateManagementComponent,
    CrmsPrintComponent,
    ApplyInCompleteComponent,
    ApplyAuditPendingComponent,
    ApplyAuditDetailComponent,
    ApplyAuditInfoDetailComponent,
    ApplyAuditCompleteComponent,
    ApplyGovermentInfoComponent,
    ApplyGovermentBasicInfoComponent,
    ApplyGovermentAnalysisResultComponent,
    ApplyAnalysisGovermentDetailComponent,
    ApplyGovermentDetailComponent,
    CrimeRecordPrintComponent,
    CrmsPersonApplyInfoComponent,
    CrmsPersonApplyBasicInfoComponent,
    ReadOnlyPersonApplyInfoComponent,
    ReadOnlyPersonApplyBasicInfoComponent,
    PersonApplyDetailComponent,
    ApplyAuditProcessInfoComponent,
    AuditPersonApplyInfoComponent,
    AuditApplyBasicInfoComponent,
    AuditGovernApplyInfoComponent,
    PersonNoCrimePrintComponent,
    PersonHasCrimePrintComponent
  ]
})

export class CrimeCertifyModule {
}
