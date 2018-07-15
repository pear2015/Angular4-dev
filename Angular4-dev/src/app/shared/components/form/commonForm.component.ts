import { Component, OnChanges, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { UtilHelper, DateFormatHelper } from '../../../core/';
@Component({
  selector: 'mf-form',
  templateUrl: './commonForm.component.html',
})

/**
 * 搜索组件
 */
export class CommonFromComponent implements OnChanges {
  @Input() formObjEmit; //  表单大对象
  // 总页数
  @Output() formSubmitEvent = new EventEmitter();
  maxTime: any;
  minTime: any;
  now: any;
  @ViewChild('commonForm') form;
  constructor(
    private utilHelper: UtilHelper,
    private dateFormatHelper: DateFormatHelper
  ) {
  }

  ngOnChanges(commonForm): void {
    this.now = new Date();
    if (this.formObjEmit === undefined || this.formObjEmit == null) {
      this.formObjEmit = {
        textDatas: [],
        selectDatas: [],
        dateDatas: []
      };
    }
  }

  /**
   * 设置开始时间和结束时间
   */
  timeChanged() {
    if (this.formObjEmit.dateDatas.length > 1) {
      this.formObjEmit.dateDatas.forEach(item => {
        if (!this.utilHelper.AssertNotNull(item.maxTime)) {
          this.maxTime = item.value;
        }
        if (!this.utilHelper.AssertNotNull(item.minTime)) {
          this.minTime = item.value;
        }
      });

    }
  }
  onFormSubmit(formData) {
    /**
     * 格式化开始时间和结束时间的格式
     */
    if (this.utilHelper.AssertNotNull(formData)) {
      for (let key in formData) {
        if (key.indexOf('end') > -1) {
          if (this.utilHelper.AssertNotNull(formData[key])) {
            formData[key] = this.dateFormatHelper.RestURLEndDateTimeFormat(formData[key]);
          } else {
            formData[key] = '';
          }
        }
      }
      for (let key in formData) {
        if (key.indexOf('start') > -1 || key.indexOf('begin') > -1) {
          if (this.utilHelper.AssertNotNull(formData[key])) {
            formData[key] = this.dateFormatHelper.RestURLBeignDateTimeFormat(formData[key]);
          } else {
            formData[key] = '';
          }
        }
      }
    }

    /**
     * 去掉每个属性的前后空格
     */
    if (this.utilHelper.AssertNotNull(formData)) {
      Object.keys(formData).forEach(key => {
        if (this.utilHelper.AssertNotNull(formData[key]) && Object.prototype.toString.call(formData[key]) === '[object String]') {
          if (key.indexOf('time') > -1 || key.indexOf('Time') > -1) {
            return;
          } else {
            formData[key] = encodeURIComponent(formData[key].trim().replace(/_/g, '#'));
          }
        }
      });
    }
    this.formSubmitEvent.emit(formData);
  }
}
