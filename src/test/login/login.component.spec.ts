// import { ComponentFixture, TestBed, async } from '@angular/core/testing';
// import { FormsModule } from '@angular/forms';
// import { TranslateService } from 'ng2-translate';


// import { IpcRendererService } from '../../app/shared';
// // import { MockLoggerFactory } from '../mock-logger-factory.service';LoggerFactory,
// import { MockTranslateService } from '../mock-translate.service';
// import { LoginComponent } from '../../app/login/login.component';
// import { MockTranslatePipe } from '../mock-translate.pipe';

// describe('HomeComponent', () => {
//     // let mockLoggerFactory = new MockLoggerFactory();
//     let mockTranslateService = new MockTranslateService();

//     let fixture: ComponentFixture<LoginComponent>;
//     let comp: LoginComponent;
//     let ipcRenderer: IpcRendererService;


//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [{
//                 FormsModule,
//             }],
//             declarations: [{
//                 MockTranslatePipe,
//                 LoginComponent
//             }],
//             providers: [
//                 IpcRendererService,
//                 {
//                     provide: TranslateService,
//                     useValue: mockTranslateService
//                 },
//             ]
//         });
//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(LoginComponent);
//             comp = fixture.componentInstance;
//             ipcRenderer = fixture.debugElement.injector.get(IpcRendererService);

//         });
//     }));

//     // it('ngOnInit', () => {
//     //     comp.ngOnInit();
//     // });

//     // it('should mock user type username === zhangsan', () => {
//     //     let username = 'zhangsan';
//     //     comp.mockUserType(username);
//     //     expect(comp.role).toEqual('1');
//     // });

//     // it('should mock user type username === lisi', () => {
//     //     let username = 'lisi';
//     //     comp.mockUserType(username);
//     //     expect(comp.role).toEqual('2');
//     // });

//     // it('should mock user type username === wangwu', () => {
//     //     let username = 'wangwu';
//     //     comp.mockUserType(username);
//     //     expect(comp.role).toEqual('3');
//     // });

//     // it('should mock user type username === chenliu', () => {
//     //     let username = 'chenliu';
//     //     comp.mockUserType(username);
//     //     expect(comp.role).toBeUndefined();
//     // });

//     // it('should login', () => {
//     //     spyOn(comp, 'mockUserType');
//     //     spyOn(ipcRenderer, 'send');
//     //     comp.username = 'zhangsan';
//     //     comp.role = '1';

//     //     comp.login();
//     //     expect(comp.mockUserType).toHaveBeenCalled();
//     // });

// });

