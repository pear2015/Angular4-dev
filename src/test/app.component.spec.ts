// import { ComponentFixture, TestBed, async } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// // import { DebugElement } from '@angular/core';
// import { MockBackend } from '@angular/http/testing';
// import { Http, BaseRequestOptions} from '@angular/http';
// import { Router } from '@angular/router';

// import { AppComponent } from '../app/app.component';
// import { TranslateService } from 'ng2-translate';
// import { MockTranslateService } from './mock-translate.service';

// describe('AppComponent', () => {
//     let fixture: ComponentFixture<AppComponent>;
//     let comp: AppComponent;
//     // let element: DebugElement;

//     let mockRouter = {
//         url: '/login'
//     };

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 RouterTestingModule,
//             ],
//             declarations: [
//                 AppComponent
//             ],
//             providers: [
//                 {
//                     provide: Http,
//                     useFactory: (backend, options) => {
//                         return new Http(backend, options);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 {
//                     provide: TranslateService,
//                     useValue: new MockTranslateService()
//                 },
//                 {
//                     provide: Router,
//                     useValue: mockRouter
//                 },
//                 MockBackend,
//                 BaseRequestOptions,
//             ]
//         }).compileComponents().then(() => {
//             fixture = TestBed.createComponent(AppComponent);
//             comp = fixture.componentInstance;
//         });
//     }));

//     // it('shoule have defaultOverlay', async(() => {
//     //     spyOn(document, 'getElementById').and.returnValue(element.nativeElement);
//     //     comp.ngOnInit();
//     //     expect(element.nativeElement.localName).toEqual('span');
//     // }));

//     it('shoule hava clickEventListener', () => {
//         comp.clickEventListener();
//     });
// });
