import { Routes, RouterModule } from '@angular/router';
// 统计分析组件模块
import { StatisticsBusinessComponent } from './statistics-business/statistics-business.component';
import { StatisticsPersonalComponent } from './statistics-personal/statistics-personal.component';
import { StatisticsGovernmentComponent } from './statistics-government/statistics-government.component';
// import { StatisticsCriminalInfoComponent } from './statistics-analysis/statistics-criminal-info/statistics-criminal.component';
import { StatisticsCrimeinfoComponent } from './statistics-crimeinfo/statistics-crimeinfo.component';
import { StatisticsCrimeComponent } from './statistics-crime/statistics-crime.component';
import { StatisticsSystemUseInfoComponent } from './statistics-systemuseinfo/statistics-systemuseinfo.component';
import { LogAuditComponent } from './log-audit/log-audit.component';
const routes: Routes = [
    {
        path: 'statistics-business',
        component: StatisticsBusinessComponent
    },
    {
        path: 'statistics-government',
        component: StatisticsGovernmentComponent
    },
    {
        path: 'statistics-personal',
        component: StatisticsPersonalComponent
    },
    {
        path: 'statistics-crime',
        component: StatisticsCrimeComponent
    },
    {
        path: 'statistics-criminal-info',
        component: StatisticsCrimeinfoComponent
    },
    {
        path: 'statistics-system-use',
        component: StatisticsSystemUseInfoComponent
    },
    {
      path: 'logs-audit',
      component: LogAuditComponent
  }
];

// tslint:disable-next-line:eofline
export const moduleRoutes = RouterModule.forChild(routes);
