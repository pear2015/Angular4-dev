import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';
import { ConfigService } from './config.service';
import { HttpProxyService } from './http.proxy.service';
import { UtilHelper } from '../common/utilhelper';
/**
 * 配置服务
 */
@Injectable()
export class OrgPersonService {
    private apiBaseUrl: string;

    private Requestheaders = new Headers({ 'Content-Type': 'application/json' });
    constructor(private configService: ConfigService,
        private httpProxy: HttpProxyService,
        private utilHelper: UtilHelper
    ) {

    }



    /**
    * 获取人员信息列表
    *
    */
    async getPersonByPersonId(personId: string): Promise<any> {
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/orgPerson/find/' + personId;
        let result = await this.httpProxy.getRequest(url, 'getPersonByPersonId', { headers: this.Requestheaders });
        this.storeCacheImage(result);
        return result;
    }



    /**
    * 根据用户ID获取人员实体信息
    *
    */
    async getPersonByUserId(userId: string): Promise<any> {
        if (this.apiBaseUrl == null || this.apiBaseUrl === undefined) {
            await this.initialCrmsService();
        }
        let url = this.apiBaseUrl + '/orgPerson/' + userId;
        try {
            let result = await this.httpProxy.getRequest(url, 'getPersonByUserId', { headers: this.Requestheaders });
            if (this.utilHelper.AssertNotNull(result)) {
                this.storeCacheImage(result.personInfo);
                return result.personInfo;
            }
        } catch (err) {
            console.log(err);
        }
    }
    /**
      * 初始化犯罪服务基地址
      */
     async initialCrmsService(): Promise<any> {
        try {
            let url = await this.configService.get('OrganizationUrl');
            if (url) {
                this.apiBaseUrl = url + '/api';
            }
        } catch (error) {
            console.log(error);
        }
        return this.apiBaseUrl;

    }

    /**
      *  缓存人员图片
      */
    private storeCacheImage(person: any) {
        if (this.utilHelper.AssertNotNull(person) && this.utilHelper.AssertNotNull(person.orgPersonId)
            && this.utilHelper.AssertNotNull(person.gif)) {
            let fs = require('fs');
            fs.exists('../' + 'localImgFile', (exists) => {
                if (exists) {
                } else {
                    fs.mkdir('../' + 'localImgFile');
                }
            });
            fs.exists('../localImgFile/' + person.orgPersonId + '.txt', (exists) => { // 判断文件是否已经存在
                if (exists) {
                } else {
                    fs.writeFile('../localImgFile/' + person.orgPersonId + '.txt', person.gif, (err) => { // 创建新的文件夹
                        if (err) { // 判断是否写入成功
                            console.log('write success');
                        } else {
                            console.log('write failed');
                        }
                    });
                }
            });
        }
    }

    async readCacheImage(personId: string) {
        let fs = require('then-fs');
        return await fs.readFile('../localImgFile/' + personId + '.txt', 'utf8');
    }



}
