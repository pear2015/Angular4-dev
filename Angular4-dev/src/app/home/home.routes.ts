import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'crms-system',
                loadChildren: '../+crms-entrance/crms-entrance.module#CrmsEntranceModule'
            }
        ]
    }

];

export const routing = RouterModule.forChild(routes);
