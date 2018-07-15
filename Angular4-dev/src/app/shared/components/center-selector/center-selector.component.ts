import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';

@Component({
    selector: 'mf-center-selector',
    templateUrl: './center-selector.component.html'
})
export class CenterSelectorComponent implements OnInit {


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

    }

}
