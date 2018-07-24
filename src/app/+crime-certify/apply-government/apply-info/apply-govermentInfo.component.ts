import { Component, OnInit, OnChanges, Input, EventEmitter, Output, ViewChildren, QueryList } from '@angular/core';


import { UserInfo } from '../../../model/auth/userinfo';
import { OrganizationService } from '../../../+crms-common/services/organization-data.service';
import { EventAggregator, UtilHelper, ConfigService } from '../../../core';

import { DxValidationGroupComponent } from 'devextreme-angular';
@Component({
  selector: 'govement-info',
  templateUrl: './apply-govermentInfo.component.html',
  providers: [OrganizationService]
})
export class ApplyGovermentInfoComponent implements OnInit, OnChanges {
  @Input() applyInfo;
  @Input() applyPurposeList;
  @Input() priorityList;
  @Input() isHasReason;
  @Input() isEdit;
  @ViewChildren(DxValidationGroupComponent) validator: QueryList<DxValidationGroupComponent>;
  @Output() clearInfo: EventEmitter<any>;

  /**
   * 省
   */
  govermentProvinceList: any[] = [];
  /**
  * 市
  */
  govermentCityList: any[] = [];
  /**
  * 区
  */
  govermentCommunityList: any[] = [];


  /**
   * 统计备注描述字符数
   */
  applynoteDescriptionLength: number = 0;

  // 其他目的原因字符数
  applyOtherPurposeReasonLength: number = 0;

  // 清空按钮tooltip
  clearPageTolVisible: boolean = false;

  /**
*  判断其他目的原因是否必填
* */
  otherReason: boolean;
  isReason: boolean;

  /**
   * 用户信息
   */
  userInfo: UserInfo = null;

  /**
   * 采集点
   */
  centerCodeName: string;

  constructor(
    private eventAggregator: EventAggregator,
    private organizationService: OrganizationService,
    private utilHelper: UtilHelper,
    private configService: ConfigService
  ) {
    this.clearInfo = new EventEmitter();
  }

  ngOnInit() {
    // 清空事件订阅
    this.eventAggregator.subscribe('cleanCharacterCount', '', result => {
      this.clearCountCharacter();
    });
  }

  // 清除当前页按钮提示
  clearPageTolToggle() {
    this.clearPageTolVisible = !this.clearPageTolVisible;
  }

  /**
   * 获取countryId和省得数据
   */
  async getCountryIdAndProvince() {
    try {
      let countryId = await this.configService.get('countryId');
      if (this.utilHelper.AssertNotNull(countryId)) {
        this.bindProvinceData(countryId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 获取省基础数据
   */
  bindProvinceData(countryId: string) {
    this.organizationService.getProvinceDataForDisplay(countryId).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.govermentProvinceList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }

  /**
 * 获取政府城市基础数据
 */
  bindGovernmentCityData(provinceid: string) {
    this.organizationService.getCityDataForDisplay(provinceid).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.govermentCityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }


  /**
   * 选择所在省
   */
  selectIndexOfGovernmentProvince(e) {
    if (e.selectedItem !== null && e.selectedItem !== undefined) {
      // 绑定城市数据
      this.bindGovernmentCityData(e.selectedItem.provinceId);
      this.govermentCommunityList = [];
    }
  }

  /**
  * 选择政府所在城市
  * 根据选择的城市id绑定城市下的社区数据
  * @param e
  */
  selectIndexOfGovernmentCity(e) {
    if (e.selectedItem !== null && e.selectedItem !== undefined) {
      this.bindGovernmentCommunityData(e.selectedItem.cityId);
    }
  }

  /**
* 获取政府社区基础数据
*/
  bindGovernmentCommunityData(relationid: string) {
    this.organizationService.getCommunityDataForDisplay(relationid).then(result => {
      if (this.utilHelper.AssertNotNull(result)) {
        this.govermentCommunityList = result;
      }
    }).catch(err => {
      console.log(err);
    });
  }


  /**
   * select申请目的选中内容事件
   * @param e
   */
  selectIndexOfApplyPurposeID(e) {
    if (e.selectedItem != null && e.selectedItem !== undefined) {
      this.applyInfo.applyPurposeId = e.selectedItem.applyPurposeId;
      this.isReason = false;
      let descriptionType = e.selectedItem.description;
      if (this.utilHelper.AssertNotNull(descriptionType) && descriptionType === '0') {
        this.isReason = true;
        this.otherReason = false;
      } else {
        this.isReason = false;
        this.otherReason = true;
        this.applyInfo.otherPurposeReason = null;
      }
    }
  }




  outPutApplyInfo() {
    return this.applyInfo;
  };

  ngOnChanges() {
    this.getCountryIdAndProvince();
    this.centerCodeName = this.applyInfo.applyCenterName;
    this.isReason = this.isHasReason;
    this.clearCountCharacter();
    if (this.utilHelper.AssertNotNull(this.applyInfo.note)) {
      this.applynoteDescriptionLength = this.applyInfo.note.length;
    }

  }

  clearCountCharacter() {
    this.applynoteDescriptionLength = 0;
    this.applyOtherPurposeReasonLength = 0;
  }
}
