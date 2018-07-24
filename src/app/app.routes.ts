import { Routes, RouterModule } from '@angular/router';
import { PreloadStrategy } from './preload-strategy';
const routes: Routes = [
    {
        path: '',
        loadChildren: './home#HomeModule'
    }
];

export const routing = RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadStrategy });
