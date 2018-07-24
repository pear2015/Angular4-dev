import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

// import { confirm } from 'devextreme/ui/dialog';
// import { TranslateService } from 'ng2-translate';

export interface CanComponentDeactivate {
    canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
@Injectable() // : boolean | Observable<boolean> | Promise<boolean>
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
    // constructor(public translateService: TranslateService) { }
    canDeactivate(component: CanComponentDeactivate) {
        // return new Observable((observer) => {

        //     this.translateService.get(['Are you sure exit', 'Hint']).subscribe(value => {
        //         confirm(value['Are you sure exit'] + '？', value['Hint']).then(() => {
        //             observer.next();
        //             observer.complete();
        //         });
        //     });


        // });

        return component.canDeactivate ? component.canDeactivate() : true;

    }

}

