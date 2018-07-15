// import { ComponentFixture, TestBed, async } from '@angular/core/testing';
// import { MockBackend } from '@angular/http/testing';
// import { BaseRequestOptions, Http } from '@angular/http';
// import { TranslateService } from 'ng2-translate';


// import { LoggerFactory, EventAggregator, ConfigService } from '../../app/shared';
// import { MockLoggerFactory } from '../mock-logger-factory.service';
// import { MockTranslateService } from '../mock-translate.service';
// import { MockTranslatePipe } from '../mock-translate.pipe';
// import { HomeComponent } from '../../app/home/home.component';
// // import { SocketQuery } from '../../app/model/socket-info/SocketQuery';
// import { SocketClient } from '../../app/core';

// describe('HomeComponent', () => {
//     let mockLoggerFactory = new MockLoggerFactory();
//     let mockTranslateService = new MockTranslateService();

//     let fixture: ComponentFixture<HomeComponent>;
//     let comp: HomeComponent;
//     let eventAggregator: EventAggregator;
//     let config: ConfigService;
//     let socketClient: SocketClient;

//     // let translate: TranslateService;

//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [{
//                 MockTranslatePipe,
//                 HomeComponent
//             }],
//             providers: [
//                 MockBackend,
//                 ConfigService,
//                 EventAggregator,
//                 BaseRequestOptions,
//                 {
//                     provide: Http,
//                     useFactory: (backend, options) => {
//                         return new Http(backend, options);
//                     },
//                     deps: [MockBackend, BaseRequestOptions]
//                 },
//                 {
//                     provide: LoggerFactory,
//                     useValue: mockLoggerFactory
//                 },
//                 {
//                     provide: TranslateService,
//                     useValue: mockTranslateService
//                 }
//             ]
//         });

//         TestBed.compileComponents().then(() => {
//             fixture = TestBed.createComponent(HomeComponent);
//             comp = fixture.componentInstance;
//             eventAggregator = fixture.debugElement.injector.get(EventAggregator);
//             config = fixture.debugElement.injector.get(ConfigService);
//             socketClient = fixture.debugElement.injector.get(SocketClient);
//         });
//     }));

//     // it('ngOnInit', () => {
//     //     spyOn(localStorage, 'userID');
//     //     spyOn(localStorage, 'role');
//     //     spyOn(comp, 'getSocketConnectUrl');
//     //     spyOn(eventAggregator, 'subscribe');

//     //     comp.ngOnInit();
//     // });

//     // it('should get socket connect url', () => {
//     //     spyOn(config, 'get').and.returnValue(Promise.resolve('1'));
//     //     spyOn(comp, 'buildSocketIOConnect');
//     //     spyOn(comp, 'subscribleSocketEvent');
//     //     comp.getSocketConnectUrl();
//     //     fixture.detectChanges();
//     //     expect(comp.socketConnectUrl).toEqual('1');
//     // });

//     // it('should build socket connect', () => {
//     //     spyOn(socketClient, 'Init');
//     //     spyOn(socketClient, 'Connect');
//     //     comp.socketQuery = new SocketQuery('', '', '', '', '');

//     //     comp.buildSocketIOConnect();
//     //     expect(socketClient.Init).toHaveBeenCalled();
//     // });

//     // it('should subscrible socket event role === 1', () => {
//     //     spyOn(socketClient, 'Listen');
//     //     spyOn(eventAggregator, 'publish');
//     //     comp.subscribleSocketEvent('1');
//     // });

//     // it('should subscrible socket event role === 1', () => {
//     //     spyOn(socketClient, 'Listen');
//     //     spyOn(eventAggregator, 'publish');
//     //     comp.subscribleSocketEvent('2');
//     // });

//     // it('should subscrible socket event role === 3', () => {
//     //     spyOn(socketClient, 'Listen');
//     //     spyOn(eventAggregator, 'publish');
//     //     comp.subscribleSocketEvent('3');
//     // });
// });
