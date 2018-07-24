import { Routes, RouterModule } from '@angular/router';
// 犯罪公告组件模块
// 犯罪信息管理
import { CrimeInfoSearchComponent } from './components/crimeInfo-inquire/crimeInfo-inquire.component';
import { CrimeInfoDetailComponent } from './components/crimeInfo-detail/crimeInfo-detail.component';
const routes: Routes = [
    {
        path: 'crimeinfo-search',  // 犯罪信息查询
        component: CrimeInfoSearchComponent
    },
    {
        path: 'crimeinfo-detail/:id',
        component: CrimeInfoDetailComponent
    }
];

export const moduleRoutes = RouterModule.forChild(routes);
