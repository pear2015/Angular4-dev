import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

/**
 * 配置服务
 */
@Injectable()
export class ConfigService {
    static instance: ConfigService = null;

    config: any = undefined;

    static getInstance(http: Http): ConfigService {
        if (ConfigService.instance === null) {
            ConfigService.instance = new ConfigService(http);
        }
        return ConfigService.instance;
    }

    constructor(private http: Http) {
    }

    /**
     * @param {string| Array<string>} key - config.json中的属性名称
     * 通过配置键值名称(单个或者数组)获取config.json中的配置数据
     */
    get(key: string | Array<string>): Promise<any> {
        if (this.config) {
            if (key instanceof Array) {
                return Promise.resolve(this.readKeys(key));
            } else {
                return Promise.resolve(this.config[key]);
            }
        } else {
            return this.http.get('./main-conf.json')
                .map(res => {
                    let config = res.json();
                    this.config = config;
                    return config;
                })
                .map(res => {
                    if (key instanceof Array) {
                        return this.readKeys(key);
                    } else {
                        return res[key];
                    }
                })
                .toPromise();
        }
    }

    /**
     * 读取key
     */
    private readKeys(keys: Array<string>) {
        let result: any = [];
        keys.forEach(key => {
            result.push(this.config[key]);
        });
        return result;
    }
}

/**
 * 配置服务的适配器
 */
export const ConfigServiceProvider = {
    provide: ConfigService,
    useFactory: (http: Http) => ConfigService.getInstance(http),
    deps: [Http]
};
