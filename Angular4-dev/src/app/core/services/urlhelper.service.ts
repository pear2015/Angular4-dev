import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { ApiUrl } from '../../model/apiurl';
@Injectable()
export class UrlHelperService {
    public urls: ApiUrl[] = [];
    public gauthUrls: ApiUrl[] = [];
    public baseUrl: string;
    public gauthBaseUrl: string;
    constructor(private config: ConfigService) {
    }
    // 获取内部url
    getInternalUrl(key: string): Promise<string> {
        if (key === '' || key === undefined || key == null) {
            return Promise.resolve('');
        }
        if (this.urls.length === 0) {
            return this.config.get('apiBaseUrl').then(url => {
                if (url != null && url !== undefined && url !== '') {
                    this.baseUrl = url;
                    return this.config.get('urls').then(r => {
                        if (r != null && r !== undefined && r !== '') {
                            let webapiUrls = r as ApiUrl[];
                            this.urls = webapiUrls;
                            if (this.urls.length > 0) {
                                return this.baseUrl + this.urls.find(s => s.name === key).url;
                            }
                        }
                    });
                }
            });
        } else {
            return Promise.resolve(this.baseUrl + this.urls.find(s => s.name === key).url);
        }
    }

    /**
     * 获取认证平台baseUrl
     */
    getGauthBaseUrl(key: string): Promise<string> {
        if (key === '' || key === undefined || key == null) {
            return Promise.resolve('');
        }
        if (this.gauthUrls.length === 0) {
            return this.config.get('gauthBaseUrl').then(url => {
                if (url != null && url !== undefined && url !== '') {
                    this.gauthBaseUrl = url;
                    return this.config.get('urls').then(r => {
                        if (r != null && r !== undefined && r !== '') {
                            let webapiUrls = r as ApiUrl[];
                            this.gauthUrls = webapiUrls;
                            if (this.gauthUrls.length > 0) {
                                return this.gauthBaseUrl + this.gauthUrls.find(s => s.name === key).url;
                            }
                        }
                    });
                }
            });
        } else {
            return Promise.resolve(this.gauthBaseUrl + this.gauthUrls.find(s => s.name === key).url);
        }
    }

    /**
     * 格式化url
     */
    formatUrl(url: string, ...args): string {
        if (url != null && url !== undefined && url !== '') {
            if (args.length === 0) {
                return url;
            } else {
                for (let i = 0; i < args.length; i++) {
                    url = url.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
                }
                return url;
            }
        }
        return '';
    }

    /**
     * 获取统计api
     */
    getStatisticsUrl(key: string): Promise<string> {
        if (key === '' || key === undefined || key == null) {
            return Promise.resolve('');
        }
        return this.config.get('apiBaseUrl').then(url => {
            if (url != null && url !== undefined && url !== '') {
                return this.config.get('urls').then(r => {
                    if (r != null && r !== undefined && r !== '') {
                        let webapiUrls = r as ApiUrl[];
                        if (webapiUrls.length > 0) {
                            return url + webapiUrls.find(s => s.name === key).url;
                        }
                    }
                });
            }
        });
    }
}
