import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnChanges } from '@angular/core';
import { UtilHelper } from '../../../../core/';
import { CrimeNoticeQuery } from '../../../../model/crime-integrated-business/CrimeNoticeQuery';
import { DxDataGridComponent } from 'devextreme-angular';
import { CrimeAndNoticeService } from '../../../../+crms-common/services/crime-notice.service';
import { UserInfo } from '../../../../model/auth/userinfo';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
    selector: 'waitmerge-criminal',
    templateUrl: './waitmerge-criminal.component.html',
    providers: []
})
export class WaitmergeCriminalComponent implements OnInit, OnChanges {
    // 是否已点击查询可合并罪犯列表
    @Input() isMergeCriminalQuery: boolean;
    // 可合并罪犯列表
    @Input() canMergeCriminalList: any[] = [];
    // 可合并罪犯列表查询分页对象
    @Input() canMergeCriminalQuery: CrimeNoticeQuery;
    // 可合并罪犯列表数目
    @Input() canMergeCriminalDataCount: any = 0;
    // 已勾选的罪犯数目
    @Input() criminalIds: string[] = [];
    // 回填的罪犯
    @Input() backFillCriminalId: string;
    // 已锁的数据列表
    @Input() lockList: string[] = [];
    /**
     * 罪犯录入信息
     */
    @Input() crimePersonInfo;
    @ViewChild('canMergeDataGrid') canMergeDataGrid: DxDataGridComponent;
    // 返回给父组件的勾选结果
    // @Output() returnSelectedCriminal = new EventEmitter();
    // 返回给父组件的页码切换事件
    @Output() changeQueryPage = new EventEmitter();
    // 重新分析时 返回待合并列表改变之后
    @Input() waitCriminalIds: string[];
    // 重新分析时 返回待合并列表这个是改变
    @Input() startWaitCriminalIds: string[];
    // 将之前选中的待合并的列表清除掉
    @Output() changeMergeCrimePerson = new EventEmitter();
    // 是否显示罪犯列表
    dataGridShow: boolean = true;
    /**
     * 数据比对的犯罪的对象
     */
    criminalInfoObj: any = {};
    dataCompareVisible: boolean = false;
    // 犯罪人ID
    crimePersonId: string;
    // 公告详情
    popupNoticeVisible: boolean = false;

    /**
    * 数据选中的提示框
    * 选中后数据提示信息
    * 当前临时选中的数据的index
    */
    confirmVisible: boolean = false;
    message: string;
    // 当前选中行
    currentselectIndex: number;
    // 用户信息
    userInfo: UserInfo;
    // 所选的待合并罪犯列表 和之前的有出入 之前只能支持单页选中 现在要改成多页选中
    allSelectWaitMerged: string[] = [];

    constructor(private utilHelper: UtilHelper,
        private crimeAndNoticeService: CrimeAndNoticeService,
        private toastr: ToastrService,
        private translateService: TranslateService
    ) {

    }
    ngOnInit() {
        this.userInfo = JSON.parse(localStorage.currentUser);
        this.showDatagrid();
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.toastrConfig.timeOut = 3000;
        // 初始化消息配置
        this.toastr.toastrConfig.positionClass = 'toast-center-center';
    }
    ngOnChanges() {
        this.showDatagrid();
        if (this.utilHelper.AssertNotNull(this.canMergeCriminalList) && this.canMergeCriminalList.length > 0) {
            this.canMergeCriminalList.forEach(item => {
                if (this.utilHelper.AssertEqualNull(item.isChecked)) {
                    item.isChecked = false;
                }
                item.isCheckedDisabled = this.utilHelper.AssertNotNull(item.isCheckedDisabled) ? item.isCheckedDisabled : false;
            });
        }
    }
    /**
     *
     * 控制子组件的可合并罪犯列表是否显示
     *
     * @memberof WaitmergeCriminalComponent
     */
    showDatagrid() {
        if (this.utilHelper.AssertNotNull(this.canMergeCriminalDataCount) && this.canMergeCriminalDataCount !== 0) {
            this.dataGridShow = false;
        }
        if (this.isMergeCriminalQuery === true) {
            this.dataGridShow = true;
        } else {
            this.dataGridShow = false;
        }
    }
    /**
   * 确认选中数据
   * 此处调用socket服务进行加锁 加锁成功
   *
   */
    async  configSelected() {
        this.confirmVisible = false;
        let data = this.canMergeDataGrid.dataSource[this.currentselectIndex];
        data.isChecked = true;
        this.checkMergeStatus(data.crimePersonId, this.userInfo.orgPersonId);
    }
    // 使用translateService对component字段进行国际化
    getTranslateName(code: string) {
        if (this.utilHelper.AssertNotNull(code)) {
            let key: any = this.translateService.get(code);
            return key.value;
        }
    }
    /**
  * redis 锁数据检测
  * 1、判断当前数据是否已经被别人合并
  * 2、判断当前是否正在被合并
  * crimePersonId 犯罪人id
  * orgPersonId 当前用户
  * isLock 是否加锁
  */
    async  checkMergeStatus(crimePersonId: string, orgPersonId: string) {
        let crimePersonInfo = await this.crimeAndNoticeService.getCrimePerson(crimePersonId);
        if (this.utilHelper.AssertNotNull(crimePersonInfo) && this.utilHelper.AssertNotNull(crimePersonInfo.crimePersonId)
            && crimePersonInfo.isMerging === '1') {
            this.checkReplyBackData(this.startWaitCriminalIds, crimePersonInfo.crimePersonId);
        } else if (this.utilHelper.AssertNotNull(crimePersonInfo) && crimePersonInfo.isMerging === '0') {
            this.onRedisLock(crimePersonId, orgPersonId);
        } else {
            this.invalidateData('this criminal has merged');
        }
    }

    /**
     * 重新分析时 数据合并要判断当前数据是否是上次合并的数据
    */
    async  checkReplyBackData(waitMerges: string[], crimePersonId: string) {
        if (this.utilHelper.AssertNotNull(waitMerges) && waitMerges.length > 0) {
            if (waitMerges.indexOf(crimePersonId) === -1) {
                this.invalidateData('this criminal has merged');
            } else {
                this.addCriminalToList(crimePersonId);
            }

        } else {
            this.addCriminalToList(crimePersonId);
        }
    }

    /**
     * 数据加锁
     */
    async onRedisLock(crimePersonId: string, orgPersonId: string) {
        await this.crimeAndNoticeService.onRedisLock(crimePersonId, orgPersonId).then(result => {
            if (this.utilHelper.AssertNotNull(result) && result === false) {
                this.invalidateData('this criminal has merging from other notice');
            } else {
                this.addCriminalToList(crimePersonId);

            }
        }).catch(e => {

        });
    }
    /**
     * 选择无效后数据处理
     * isCheckedDisabled 是否不可勾选
     * @param {string} message
     * @memberof WaitmergeCriminalComponent
     */
    invalidateData(message: string) {
        this.canMergeDataGrid.dataSource[this.currentselectIndex].isChecked = false;
        this.canMergeDataGrid.dataSource[this.currentselectIndex].isCheckedDisabled = true;
        this.canMergeDataGrid.dataSource[this.currentselectIndex].redOrGreen = true;
        this.toastr.clear();
        this.toastr.toastrConfig.maxOpened = 1;
        this.toastr.error(this.getTranslateName(message));
    }
    /**
     *
     * 取消选中 解锁
     * 将之前已选中标记 isAfterChecked 改为false
     */
    cancelSelected() {
        if (this.utilHelper.AssertNotNull(this.canMergeDataGrid.dataSource)) {
            this.canMergeDataGrid.dataSource[this.currentselectIndex].isChecked = false;
            // 将当前的数据从已选择列表中移除
            let data = this.canMergeDataGrid.dataSource[this.currentselectIndex];
            this.remoteCriminalFromList(data.crimePersonId);
        }
        this.confirmVisible = false;
    }
    /**
     * 合并罪犯时 选中弹框提示
     * 所选的数据发生变化时 会触发这个方法  此时要解决从第二页调到第一页时 第一页已选中的数据
     * 当前是选中操作时 先判断当前是否确认选中
     * 当前进行取消操作时 先进行解锁 再把当前列表从已选的列表中剔除掉
     */
    selectMergeCrimnal(e) {
        if (this.utilHelper.AssertNotNull(e) && e.row.data.isChecked && !e.row.data.isCheckedDisabled && !e.row.data.isAfterChecked) {
            this.confirmVisible = true;
            this.currentselectIndex = e.rowIndex;
            this.message = 'confirm selected this criminal to merge';
        } else if (this.utilHelper.AssertNotNull(e) && !e.row.data.isChecked && !e.row.data.isCheckedDisabled) {
            this.crimeAndNoticeService.onRedisRelease(e.row.data.crimePersonId, this.userInfo.orgPersonId).then(result => {
                e.row.data.isAfterChecked = false;
                e.row.data.isChecked = false;
                this.remoteCriminalFromList(e.row.data.crimePersonId);
            }).catch(e1 => {
                console.log(e1);

            });
        }

    }
    /**
     * 将之前勾选的罪犯选上
     * 重新录入的时候 把之前选择的罪犯勾选上
     *
     * @memberof WaitmergeCriminalComponent
     */
    selectedCriminalIds(canMergeCriminalList: any[]) {
        this.canMergeCriminalList = canMergeCriminalList;
        // 重新录入时，将之前的勾选的罪犯勾选上（除了回填的罪犯）
        if (this.utilHelper.AssertNotNull(this.criminalIds) && this.criminalIds.length > 0 && this.canMergeCriminalList.length > 0) {
            for (let i = 0; i < this.criminalIds.length; i++) {
                for (let j = 0; j < this.canMergeCriminalList.length; j++) {
                    if (this.criminalIds[i] === this.canMergeCriminalList[j].crimePersonId) {
                        this.canMergeCriminalList[j].isChecked = true;
                        this.addCriminalToList(this.canMergeCriminalList[j].crimePersonId);
                    }
                }
            }
        }
    }
    /**
     * 第一次录入将正在合并中的设置不可勾选
     * @memberof WaitmergeCriminalComponent
     */
    async  deselectRowsBecauseIsMerging(e) {
        // 如果这个罪犯正在被合并不能勾选
        if (this.utilHelper.AssertNotNull(e) && e.length > 0) {
            for (let j = 0; j < e.length; j++) {
                if (e[j].isMerging === '1') {
                    e[j].redOrGreen = true;
                    e[j].isCheckedDisabled = true;
                } else {
                    e[j].isCheckedDisabled = false;
                    e[j].redOrGreen = false;
                }
            }
        }
    }
    /**
     * 判断改犯罪人是否已经被别人勾选
     */
    async isCheckCriminalHasSelected(item: any) {
        if (this.utilHelper.AssertNotNull(this.criminalIds) && this.criminalIds.length > 0) {
            await this.criminalIds.forEach(i => {
                if (item.crimePersonId === i) {
                    item.redOrGreen = false;
                }
            });
        }
    }
    /**
     * 重新录入时，默认将所有带合并列表设置为不可选
     */
    disabledRowsCheckedReplyEnter(canMergeCriminalList: any[]) {
        if (this.utilHelper.AssertNotNull(canMergeCriminalList) && canMergeCriminalList.length > 0) {
            canMergeCriminalList.forEach(element => {
                element.isCheckedDisabled = true;
            });
        }
    }
    /**
     * 重新录入分析时控制可合并罪犯列表可否勾选
     * @param all 所有匹配到和可合并罪犯
     * @param exclude 需要排除的罪犯
     */
    deselectRowsBecauseReplyEnter(all: any[], exclude: any[], isOnReplyAnalyst) {
        // 将历史勾选的公告，可勾选。其他正在合并的罪犯，设置为不可勾选
        if (this.utilHelper.AssertNotNull(all) && all.length > 0) {
            for (let j = 0; j < all.length; j++) {
                // 如果排除的集合不为空
                if (this.utilHelper.AssertNotNull(exclude) && exclude.length > 0) {
                    // 正在被合并，不在排除的集合中，将此设置为不可选
                    if (all[j].isMerging === '1' && exclude.indexOf(all[j].crimePersonId) === -1) {
                        all[j].isCheckedDisabled = true;
                        all[j].redOrGreen = true;
                    } else {
                        // 否则设置为可选
                        all[j].isCheckedDisabled = isOnReplyAnalyst ? true : false;
                        all[j].redOrGreen = false;
                    }
                    // 如果排除的集合为空
                } else {
                    if (all[j].isMerging === '1') {
                        all[j].isCheckedDisabled = true;
                        all[j].redOrGreen = true;
                    } else {
                        all[j].isCheckedDisabled = isOnReplyAnalyst ? true : false;
                        all[j].redOrGreen = false;
                    }
                }
            }
        }
    }
    /**
     *
     * 查询可合并罪犯，分页跳转
     *
     * @param {any} e
     * @memberof WaitmergeCriminalComponent
     */
    changeCanMergeCriminalPage(e) {
        this.canMergeCriminalQuery.pages = e.pages;
        this.changeQueryPage.emit(this.canMergeCriminalQuery.pages);
    }
    /**
     * 获取已勾选的犯罪嫌疑人列表
     */
    getDataGridCheckedCriminal(): any[] {
        return this.allSelectWaitMerged;
    }
    /**
     * 检测勾选的数据是否已失效被其他公告合并
     * @param {any} item
     * @memberof WaitmergeCriminalComponent
     */
    resolveLockList(lockList: string[], backFillCriminalId: string) {
        let backFillflag = 0;
        if (lockList.length > 0) {
            if (this.utilHelper.AssertNotNull(backFillCriminalId)) {
                lockList.forEach(item => {
                    if (item === backFillCriminalId) {
                        this.toastr.clear();
                        this.toastr.toastrConfig.maxOpened = 1;
                        this.toastr.error(this.getTranslateName('this backWrite criminal has inValidate and had selected by others'));
                        backFillflag++;
                    }
                });
            }
            if (backFillflag === 0) {
                this.toastr.clear();
                this.toastr.toastrConfig.maxOpened = 1;
                this.toastr.error(this.getTranslateName('this merged current selected criminal has inValidate and had selected by others'));
            }
        }
    }


    dataCompare(item) {
        if (this.utilHelper.AssertNotNull(item)) {
            this.criminalInfoObj = item;
            this.dataCompareVisible = true;

        }
    }

    watchNotice(data) {
        if (this.utilHelper.AssertNotNull(data) && this.utilHelper.AssertNotNull(data.crimePersonId)) {
            this.crimePersonId = data.crimePersonId;
            this.popupNoticeVisible = true;
        } else {
            this.crimePersonId = null;
            this.popupNoticeVisible = false;
        }
    }

    /**
     * 将当前的罪犯添加到罪犯列表中
     */
    addCriminalToList(crimePersonId: string) {
        if (this.allSelectWaitMerged.length > 0 && !this.isHasSelectedCriminal(crimePersonId)) {
            console.log('this criminal has selected');
        } else {
            this.allSelectWaitMerged.push(crimePersonId);
        }


    }
    /**
     * 判断所选的嫌疑人是否已经选择
     */
    isHasSelectedCriminal(crimePersonId: string) {
        return this.allSelectWaitMerged.indexOf(crimePersonId) === -1;
    }

    /**
     * 将当前罪犯从待合并列表中移除
     * 此处要是之前就选中的要从待合并列表中移除
     */
    async  remoteCriminalFromList(crimePersonId: string) {
        await this.changeMergeCrimePerson.emit(crimePersonId);
        if (this.allSelectWaitMerged.length > 0 && !this.isHasSelectedCriminal(crimePersonId)) {
            this.allSelectWaitMerged = this.allSelectWaitMerged.filter(item => item !== crimePersonId
            );

        }
    }

    /**
     * 罪犯列表加载完成后
     * 数据处理
     * 用于分页切换时 上一页选中的数据保持选中
     * isAfterChecked 是否是已之前选中的
     */
    criminalContentReady(e) {
        if (this.allSelectWaitMerged.length > 0 && this.canMergeCriminalList.length > 0) {
            this.canMergeCriminalList.forEach(item => {
                if (!this.isHasSelectedCriminal(item.crimePersonId)) {
                    item.isAfterChecked = true;
                    item.isChecked = true;
                } else {
                    item.isAfterChecked = false;
                }
            });
        }
    }
}
