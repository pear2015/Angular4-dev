// import { Observable } from 'rxjs';

// export class MockTranslateService {
//     private translations: Object;

//     get(key: string | Array<string>): Observable<string | any> {
//         if (key instanceof Array) {
//             let result = {};
//             key.forEach(r => {
//                 result[r] = r;
//             });
//             return Observable.of(result);
//         } else {
//             return Observable.of(key);
//         }
//     }

//     setTranslation(lang: string, translations: Object, shouldMerge?: boolean): void {
//         this.translations = translations;
//     }

//     getTranslation(lang: string): Object {
//         return this.translations;
//     }
// }
