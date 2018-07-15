import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { SharedModule } from '../shared';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
import { moduleRoutes } from './crms-common.routes';
import { NoDataGuard } from './guards/canActivate';
import { CanDeactivateGuard } from './guards/canDeactivate';
import { SimilarityCalculate } from './services/similarity-calculate.service';
import { LevenshteinDistanceService } from './services/LevenshteinDistance.service';
import { EncodingRulesService } from './services/encoding-rules.service';
import { SortorderAlgorithmService } from './services/sortorder-algorithm.service';
import { CrimeAndNoticeService } from './services/crime-notice.service';
import { ApplyAnalysisService } from './services/apply-analysis.service';
import { ApplyCommonService } from './services/apply-common.service';
import { CameraComponent } from './components/camera/camera.component';
import { DataCompareComponent } from './components/data-compare/data-compare.component';
import { CrimeDataCompareComponent } from './components/crimeData-compare/crimeData-compare.component';
import { CrmsCrimeInfoComponent } from './components/crime-info/crime-info.component';
import { CrmsNoticeComponent } from './components/crime-notice/crime-notice.component';
import { CrmsCrimePersonInfoComponent } from './components/crime-personInfo/crime-personInfo.component';
import { CrmsAttchmentComponent } from './components/crms-attchment/crms-attchment.component';
import { NoticeAttachmentComponent } from './components/notice-attachment/notice-attachment.component';
import { PersonInfoReadComponent } from './components/readOnly-personInfo/personInfo-read.component';
import { CrimeInfoDetailComponent } from './components/crimeInfo-detail/crimeInfo-detail.component';
import { NoticeInfoReadComponent } from './components/readOnly-noticeInfo/noticeInfo-read.component';
import { CrimeInfoReadComponent } from './components/readOnly-crimeInfo/crimeInfo-read.component';
import { CrimeInfoSearchComponent } from './components/crimeInfo-inquire/crimeInfo-inquire.component';
import { CrimeInfoDetailService } from './components/crimeInfo-detail/crimeInfo-detail.service';
import { CrimeInfoInquireService } from './components/crimeInfo-inquire/crimeInfo-inquire.service';
import { EditPasswordService } from './services/edit-password.service';
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


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    FormsModule,
    SharedModule,
    TranslateModule,
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
    moduleRoutes
  ],
  entryComponents: [
  ],
  exports: [
    CameraComponent,
    DataCompareComponent,
    CrimeDataCompareComponent,
    CrmsCrimeInfoComponent,
    CrmsNoticeComponent,
    CrmsCrimePersonInfoComponent,
    CrmsAttchmentComponent,
    NoticeAttachmentComponent,
    PersonInfoReadComponent,
    CrimeInfoDetailComponent,
    NoticeInfoReadComponent,
    CrimeInfoReadComponent,
    CrimeInfoSearchComponent
  ],
  declarations: [
    CameraComponent,
    DataCompareComponent,
    CrimeDataCompareComponent,
    CrmsCrimeInfoComponent,
    CrmsNoticeComponent,
    CrmsCrimePersonInfoComponent,
    CrmsAttchmentComponent,
    NoticeAttachmentComponent,
    PersonInfoReadComponent,
    CrimeInfoDetailComponent,
    NoticeInfoReadComponent,
    CrimeInfoReadComponent,
    CrimeInfoSearchComponent
  ],
  providers: [
    NoDataGuard,
    CanDeactivateGuard,
    SimilarityCalculate,
    LevenshteinDistanceService,
    EncodingRulesService,
    SortorderAlgorithmService,
    CrimeAndNoticeService,
    ApplyAnalysisService,
    ApplyCommonService,
    CrimeInfoDetailService,
    CrimeInfoInquireService,
    EditPasswordService
  ]
})

export class CrmsCommonModule {
}
