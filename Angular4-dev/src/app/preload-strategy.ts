import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
@Injectable()
export class PreloadStrategy implements PreloadingStrategy {
    preLoadedModules: string[] = [];
    preload(route: Route, load: () => Observable<any>) {
        if (route.data && route.data['preload']) {
            this.preLoadedModules.push(route.path);
            return load();
        } else {
            return Observable.of(null);
        }
    };
}
