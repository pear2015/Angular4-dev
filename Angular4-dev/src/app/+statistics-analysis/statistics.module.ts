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
import {CrmsCommonModule} from '../+crms-common/crms-common.module';
import { SharedModule } from '../shared';
// 服务
import { StatisticsAnalysisService } from './common/statistics-analysis.service';
import { LogAuditService } from './log-audit/log-audit.service';
import { StatisticsBusinessService } from './statistics-business/statistics-business.service';
import { StatisticsCrimeService } from './statistics-crime/statistics-crime.service';
import { StatisticsCrimeinfoService } from './statistics-crimeinfo/statistics-crimeinfo.service';
import { StatisticsGovernmentService } from './statistics-government/statistics-government.service';
import { StatisticsPersonalService } from './statistics-personal/statistics-personal.service';
import { StatisticsSystemUseInfoService } from './statistics-systemuseinfo/statistics-systemuseinfo.service';
import {CrimeNoticeStatisticsMapper} from './common/mapper/crime-notice-statistics.mapper';
import { EnumInfo } from '../enum';
 // 日志审计
import { LogAuditComponent } from './log-audit/log-audit.component';
// 统计分析组件模块
import { StatisticsBusinessComponent } from './statistics-business/statistics-business.component';
import { StatisticsPersonalComponent } from './statistics-personal/statistics-personal.component';
import { StatisticsGovernmentComponent } from './statistics-government/statistics-government.component';
import { StatisticsCrimeinfoComponent } from './statistics-crimeinfo/statistics-crimeinfo.component';
// 犯罪公告统计
import { StatisticsCrimeComponent } from './statistics-crime/statistics-crime.component';
import { StatisticsDimensionComponent } from './common/statistics-dimension/statistics-dimension.component';
import { StatisticsSystemUseInfoComponent } from './statistics-systemuseinfo/statistics-systemuseinfo.component';
import { moduleRoutes } from './statistics.routes';
/**
* 业务模块
*/
@NgModule({
    imports: [
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
       SharedModule,
        CrmsCommonModule,
        moduleRoutes
    ],
    providers: [
        StatisticsPersonalService,
        StatisticsAnalysisService,
        LogAuditService,
        StatisticsBusinessService,
        StatisticsCrimeService,
        StatisticsCrimeinfoService,
        StatisticsGovernmentService,
        StatisticsPersonalService,
        StatisticsSystemUseInfoService,
        CrimeNoticeStatisticsMapper,
        EnumInfo
    ],
    declarations: [
        LogAuditComponent,
        // 统计分析
        StatisticsBusinessComponent,
        StatisticsPersonalComponent,
        StatisticsGovernmentComponent,
        // StatisticsCriminalInfoComponent,
        StatisticsCrimeinfoComponent,
        StatisticsCrimeComponent,
        StatisticsDimensionComponent,
        StatisticsSystemUseInfoComponent

    ],
    exports: [
    ]
})

export class StatisticsModule {
}
