// import { TestBed, ComponentFixture, async } from '@angular/core/testing';
// import { NavBarComponent } from '../../../../app/shared/components/navbar/navbar.component';
// import { EventAggregator } from '../../../../app/shared';
// import { DevExtremeModule } from 'devextreme-angular';
// import { TranslateModule } from 'ng2-translate';


// describe('NavBarComponent Test', () => {
//     let comp: NavBarComponent;
//     let fixture: ComponentFixture<NavBarComponent>;
//     let eventAggregatorStub = {
//         subscribe(event: string) { },
//     };
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             declarations: [NavBarComponent],
//             imports: [DevExtremeModule, TranslateModule],
//             providers: [
//                 {
//                     provide: EventAggregator,
//                     useValue: eventAggregatorStub
//                 },

//             ]
//         }).compileComponents();
//     }));
//     beforeEach(() => {
//         fixture = TestBed.createComponent(NavBarComponent);
//         comp = fixture.componentInstance;
//     });

//     // Components should be created
//     it('Components should be created', () => {
//         expect(comp).toBeDefined();
//     });

//     // ngOnInit 方法
//     it('ngOnInit Test', () => {
//         comp.ngOnInit();
//     });
//     it('ngOnInit Test', () => {
//         comp.ngOnInit();
//     });

//     // judgeRoleNameByRole 方法
//     it('judgeRoleNameByRole1 Test', () => {
//         comp.role = '1';
//         comp.judgeRoleNameByRole();
//     });
//     it('judgeRoleNameByRole2 Test', () => {
//         comp.role = '2';
//         comp.judgeRoleNameByRole();
//     });
//     it('judgeRoleNameByRole2 Test', () => {
//         comp.role = '3';
//         comp.judgeRoleNameByRole();
//     });


//     // toggleDefault 方法
//     it('toggleDefault Test', () => {
//         comp.toggleDefault();
//     });

//     // hoverIn 方法
//     it('hoverIn Test', () => {

//         comp.hoverIn();
//     });

//     // hoverOut 方法
//     it('hoverOut Test', () => {
//         comp.messageTipVisible = true;
//         comp.hoverOut();
//     });
// });
