import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ODataConfiguration, ODataService, ODataServiceFactory } from 'ng2-odata';
import { ConfigService } from '../core';


/**
 * ODataServiceFactoryProxy 客户端Odata访问服务代理
 *
 * @export
 * @class ODataServiceFactoryProxy
 */
@Injectable()
export class ODataServiceFactoryProxy {
    private odataFactory: ODataServiceFactory;
    private baseUrl: string;

    constructor(private http: HttpClient,
        private ConfigService: ConfigService,
    ) {
        let conf = new ODataConfiguration();
        this.getBaseUrl().then(url => {
            conf.baseUrl = url;
        });
        this.odataFactory = new ODataServiceFactory(this.http, conf);
    }

    /**
     * 初始化Odata服务
     *
     * @template T 服务接口类型：如INoitication接口
     * @param {string} typeName 类型名称定义
     * @param {Function} func 异常回调
     * @returns {ODataService<T>} 基于服务接口类型的Odata服务
     * @memberof ODataServiceFactoryProxy
     */
    init<T>(typeName: string, func: Function): ODataService<T> {
        return this.odataFactory.CreateService<T>(typeName, (error) => {
            if (func) {
                func(error);
                throw error;
            }
        });
    }

    /**
     * 获取odata服务地址
     *
     * @private
     * @returns {Promise<any>} odata服务地址
     * @memberof ODataServiceFactoryProxy
     */
    private getBaseUrl(): Promise<any> {

        return new Promise((resolve, reject) => {
            this.ConfigService.get('odataBaseUrl').then(url => {
                if (url) {
                    this.baseUrl = url;
                    return resolve(url);
                } else {
                    return reject('can not read odataBaseUrl config.');
                }
            });
        });

    }
};
