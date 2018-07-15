import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'multiple-select-box',
    templateUrl: './multiple-select-box.component.html'
})
export class MultipleSelectComponent implements OnInit, OnChanges {


    /**
     * 是否需要显示在列表中显示国家候选
     *
     * @type {boolean}
     * @memberOf CenterSelectorComponent
     */
    @Input() needNationDisplay: boolean = true;

    /**
     * 默认中心
     *
     * @type {*}
     * @memberOf CenterSelectorComponent
     */
    @Input() default: any;

    /**
     * 中心列表数据源
     *
     * @type {any[]}
     * @memberOf CenterSelectorComponent
     */
    @Input() dataSource: any[];

    /**
     * 当前选择中心的界面显示内容
     *
     * @type {string}
     * @memberOf CenterSelectorComponent
     */
    @Input() chooseForDisplay: string;

    /**
     * 选择中心是的事件触发
     *
     * @type {EventEmitter<any>}
     * @memberOf CenterSelectorComponent
     */
    @Output() selectChanged: EventEmitter<any>;

    selectedItems: any[] = [];

    constructor(private translateService: TranslateService) {
        this.selectChanged = new EventEmitter();
        if (!this.default) {
            this.default = { id: 'all', name: '' };
            this.translateService.get('all').subscribe(value => {
                this.default.name = value;
            });
        }
    }

    ngOnInit(): void {
        if (this.dataSource !== undefined) {
            this.dataSource.forEach(item => {
                if (!item.hasOwnProperty('isChecked')) {
                    item['isChecked'] = false;
                }
            });
        }
    }

    checkBoxClick(item) {
        // 因为先触发click事件再改变选项的checked值，所以倒着判断
        if (item['isChecked'] === false) {
            if (this.selectedItems !== undefined) {
                if (this.selectedItems.filter(f => f['id'] === item['id']).length === 0) {
                    this.selectedItems.push(item);
                }
            }
        }
        // tslint:disable-next-line:one-line
        else {
            if (this.selectedItems !== undefined) {
                this.selectedItems.forEach((selectItem, index) => {
                    if (selectItem['id'] === item['id']) {
                        this.selectedItems.splice(index, 1);
                    }
                });
            }
        }
        if (this.selectChanged !== undefined) {
            this.selectChanged.emit(this.selectedItems);
        }
    }

    ngOnChanges() {
        if (this.dataSource !== undefined) {
            this.dataSource.forEach(item => {
                if (!item.hasOwnProperty('isChecked')) {
                    item['isChecked'] = false;
                }
            });
        }
    }

    /**
     * 全国点击
     */
    allCountryClick() {
        this.selectChanged.emit(this.dataSource);
    }

}
