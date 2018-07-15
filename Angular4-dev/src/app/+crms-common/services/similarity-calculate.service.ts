import { Injectable } from '@angular/core';
import { UtilHelper } from '../../core/';
import { LevenshteinDistanceService } from './LevenshteinDistance.service';
import { CrimeNoticeQuery } from '../../model/crime-integrated-business/CrimeNoticeQuery';
import { CrimePersonInfo } from '../../model/crime-notice/crimePersonInfo';
import { ApplyPersonQuery } from '../../model/certificate-apply/ApplyPersonQuery';
import { ApplyBasicInfo } from '../../model/certificate-apply/ApplyBasicInfo';
/**
 * 相似度计算帮助类，使用文史特距离
 * 申请人员回填，罪犯人员回填使用
 * Create By zhangqiang 2017/11/16
 * @export
 * @class SimilarityCalculate
 */
@Injectable()
export class SimilarityCalculate {
  // 比较对象1
  compareObjectFrom: any;
  // 比较对象2
  compareObjectTo: any;

  constructor(private levenshteinDistanceService: LevenshteinDistanceService, private utilHelper: UtilHelper) {
    this.compareObjectFrom = {
      firstName: '',
      lastName: '',
      sexId: '',
      certificateType: '',
      certificateNumber: ''
    };
    this.compareObjectTo = {
      firstName: '',
      lastName: '',
      sexId: '',
      certificateType: '',
      certificateNumber: ''
    };
  }
  /**
   *
   * 用于计算申请回填的人员匹配度 政府申请
   * @param {ApplyBasicInfo} applyBasicInfo
   * @param {ApplyPersonQuery} applyPersonQuery
   * @returns
   * @memberof SimilarityCalculate
   */
  applicantSimilarityBF(applyBasicInfo: ApplyBasicInfo, applyPersonQuery: ApplyPersonQuery) {
    this.compareObjectFromSet(applyBasicInfo, true);
    this.compareObjectToSet(applyPersonQuery, true);
    let similarity: number = this.commonCompare();
    similarity = parseFloat('' + similarity) * 100;
    return Math.floor(similarity) + '%';
  }
  /**
   * 用于计算罪犯回填匹配度
   * @param crimePersonInfo
   * @param crimeNoticeQuery
   */
  criminalSimilarityBF(crimePersonInfo: CrimePersonInfo, crimeNoticeQuery: CrimeNoticeQuery) {
    this.compareObjectFromSet(crimePersonInfo, false);
    this.compareObjectToSet(crimeNoticeQuery, false);
    let similarity: any = this.commonCompare();
    similarity = parseFloat(similarity) * 100;
    return Math.floor(similarity) + '%';
  }
  /**
   * 比较对象1赋值
   * isApply:是申请对象吗
   * @param {*} objectFrom
   * @memberof SimilarityCalculate
   */
  private compareObjectFromSet(objectFrom: any, isApply: boolean) {
    this.compareObjectFrom.firstName = objectFrom.firstName;
    this.compareObjectFrom.lastName = objectFrom.lastName;
    if (isApply) {
      this.compareObjectFrom.sexId = objectFrom.sexId;
    } else {
      this.compareObjectFrom.sexId = objectFrom.sexId;
    }
    this.compareObjectFrom.certificateType = objectFrom.certificateType;
    this.compareObjectFrom.certificateNumber = objectFrom.certificateNumber;
  }

  /**
   * 比较对象2赋值
   * isApply:是申请对象吗
   * @param {*} objectTo
   * @memberof SimilarityCalculate
   */
  private compareObjectToSet(objectTo: any, isApply: boolean) {
    this.compareObjectTo.firstName = objectTo.firstName;
    this.compareObjectTo.lastName = objectTo.lastName;
    this.compareObjectTo.sexId = objectTo.sexId;
    this.compareObjectTo.certificateType = objectTo.certificateType;
    if (isApply) {
      this.compareObjectTo.certificateNumber = objectTo.certificateId;
    } else {
      this.compareObjectTo.certificateNumber = objectTo.certificateNumber;
    }
  }
  /**
   *
   * 公共对象比较方法
   *
   * @param {any} compareObjectFrom
   * @param {any} compareObjectTo
   * @returns
   * @memberof SimilarityCalculate
   */
  private commonCompare() {
    let sum: number = 0;
    let sumSimilarity: number = 0;
    let similarity: number;

    // 姓名比对：姓+名
    let crimepersonName = this.compareObjectFrom.lastName + this.compareObjectFrom.firstName;
    let crimeQueryName = this.compareObjectTo.lastName + this.compareObjectTo.firstName;
    if (this.utilHelper.AssertNotNull(crimepersonName) && this.utilHelper.AssertNotNull(crimeQueryName)) {
      // 计算文史特距离
      let nameSimilarity = this.levenshteinDistanceService.levenshteinDistancePercent(crimepersonName, crimeQueryName);
      sum += 1;
      sumSimilarity = sumSimilarity + parseFloat(nameSimilarity);
    }

    // 性别比对
    if (this.utilHelper.AssertNotNull(this.compareObjectFrom.sexId)
      && this.utilHelper.AssertNotNull(this.compareObjectTo.sexId)) {
      // 计算文史特距离
      let sexSimilarity = this.levenshteinDistanceService.
        levenshteinDistancePercent(this.compareObjectFrom.sexId, this.compareObjectTo.sexId);
      sum += 1;
      sumSimilarity = sumSimilarity + parseFloat(sexSimilarity);
    }
    // 证件类型比对
    if (this.utilHelper.AssertNotNull(this.compareObjectFrom.certificateType) &&
      this.utilHelper.AssertNotNull(this.compareObjectTo.certificateType)) {
      // 计算文史特距离
      let certificateTypeSimilarity = this.levenshteinDistanceService.
        levenshteinDistancePercent(this.compareObjectFrom.certificateType, this.compareObjectTo.certificateType);
      sum += 1;
      sumSimilarity = sumSimilarity + parseFloat(certificateTypeSimilarity);
      // 如果证件类型相同并且证件号码都不为空时，才比较证件号码
      if (this.compareObjectFrom.certificateType === this.compareObjectTo.certificateType) {
        if (this.utilHelper.AssertNotNull(this.compareObjectFrom.certificateNumber)
          && this.utilHelper.AssertNotNull(this.compareObjectTo.certificateNumber)) {
          let certificateNumberSimilarity = this.levenshteinDistanceService.
            levenshteinDistancePercent(this.compareObjectFrom.certificateNumber, this.compareObjectTo.certificateNumber);
          sum += 1;
          sumSimilarity = sumSimilarity + parseFloat(certificateNumberSimilarity);
        }
      }
    }

    if (sum !== 0) {
      similarity = Number((sumSimilarity / sum).toFixed(2));
    }
    return similarity;
  }

}
