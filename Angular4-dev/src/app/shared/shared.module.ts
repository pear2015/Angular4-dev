import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { TranslateModule } from 'ng2-translate';
import { NavBarComponent } from './components/navbar/navbar.component';
import { SearchComponent } from './components/search/search.component';
import { FootBarComponent } from './components/footbar/footbar.component';
import { CommonFromComponent } from './components/form/commonForm.component';
import { CenterSelectorComponent } from './components/center-selector/center-selector.component';
import { PopoverModule, CollapseModule, AccordionModule, CarouselModule } from 'ngx-bootstrap';
import { HelperComponent } from './components/helper/helper.component';
import { FormsModule } from '@angular/forms';
import { DevExtremeModule } from 'devextreme-angular';
import { DxDataGridModule, DxTemplateModule } from 'devextreme-angular';
import { MarkdownComponent } from './components/markdown/markdown.component';
import { MarkdownModule } from 'angular2-markdown';
import { PaginationComponent } from './components/pagination/pagination.component';
import { WizardComponent } from './components/wizard/wizard.component';
import { WizardStepComponent } from './components/wizard/wizard-step.component';
import { ProgressComponent } from './components/progress/progress.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PersonImgPipe } from './pipes/personimg.pipe';
import { WholeNamePipe } from './pipes/name.pipe';
import { ZeroToNullPipe } from './pipes/zeroToNull.pipe';
import { EnumService } from './enum.service';
import { MultipleSelectComponent } from './components/multiple-select-box/multiple-select-box.component';
import { SexPipe } from './pipes/sex.pipe';
import { MarriagePipe } from './pipes/marriage.pipe';
import { PriorityPipe } from './pipes/priority.pipe';
import { ResultPipe } from './pipes/result.pipe';
import { CertificatePipe } from './pipes/certificate.pipe';
import { I18nDatePie } from './pipes/I18ndate.pipe';
import { ComparePercentPipe } from './pipes/compare.percent.pipe';
import { NoticeInputStatusPipe } from './pipes/noticeinputstatus.pipe';
import { ApplyInputStatusPipe } from './pipes/applyinputstatus.pipe';
import { AduitResultPipe } from './pipes/aduitstresult.pipe';
import { PtMonthPipe } from './pipes/ptmonth.pipe';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    HttpModule,
    TranslateModule,
    PopoverModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    DevExtremeModule,
    DxDataGridModule,
    DxTemplateModule,
    AccordionModule.forRoot(),
    MarkdownModule.forRoot(),
    PaginationModule.forRoot(),
    CarouselModule.forRoot()
  ],
  entryComponents: [
  ],
  exports: [
    NavBarComponent,
    SearchComponent,
    FootBarComponent,
    HelperComponent,
    MarkdownComponent,
    CenterSelectorComponent,
    PaginationComponent,
    PersonImgPipe,
    WholeNamePipe,
    ZeroToNullPipe,
    CommonFromComponent,
    MultipleSelectComponent,
    WizardComponent,
    WizardStepComponent,
    ProgressComponent,
    SexPipe,
    MarriagePipe,
    PriorityPipe,
    ResultPipe,
    CertificatePipe,
    ComparePercentPipe,
    NoticeInputStatusPipe,
    ApplyInputStatusPipe,
    AduitResultPipe,
    I18nDatePie,
    PtMonthPipe
  ],
  declarations: [
    NavBarComponent,
    SearchComponent,
    FootBarComponent,
    HelperComponent,
    MarkdownComponent,
    CenterSelectorComponent,
    PaginationComponent,
    ProgressComponent,
    PersonImgPipe,
    WholeNamePipe,
    ZeroToNullPipe,
    CommonFromComponent,
    MultipleSelectComponent,
    WizardComponent,
    WizardStepComponent,
    SexPipe,
    MarriagePipe,
    PriorityPipe,
    ResultPipe,
    CertificatePipe,
    ComparePercentPipe,
    NoticeInputStatusPipe,
    ApplyInputStatusPipe,
    AduitResultPipe,
    I18nDatePie,
    PtMonthPipe
  ],
  providers: [
    EnumService,
  ]
})

export class SharedModule {
}
