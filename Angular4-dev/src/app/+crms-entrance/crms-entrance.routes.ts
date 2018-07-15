import { Routes, RouterModule } from '@angular/router';

import { CrmsEntranceComponent } from './crms-entrance.component';
// 公共组件
import { CrmsDefaultComponent } from './crms-default.component';


const routes: Routes = [
    {
        path: '',
        component: CrmsEntranceComponent,
        children: [
            {
                path: '',
                component: CrmsDefaultComponent
            },
            {
                path: 'home',
                component: CrmsDefaultComponent
            },
            {
                path: 'crime-certify',
                loadChildren: '../+crime-certify/crime-certify.module#CrimeCertifyModule',
                data: { preload: true }
            },
            {
                path: 'crime-notice',
                loadChildren: '../+crime-notice/crime-notice.module#CrimeNoticeModule'
            },
            {
                path: 'statistics',
                loadChildren: '../+statistics-analysis/statistics.module#StatisticsModule'
            }
        ]
    }];

export const routing = RouterModule.forChild(routes);
