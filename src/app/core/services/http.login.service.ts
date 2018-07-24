import { Injectable, Optional } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';

/**
 * 登陆http请求代理服务
 */
@Injectable()
export class HttpLoginProxyService {

    private charge: HttpRequestResultCharges;

    constructor(
        @Optional() private http: Http,
    ) {
        this.charge = new HttpRequestResultCharges();
    }

    /**
     *
     *
     * @param {string} uri
     * @param {Object} caller
     * @returns {Promise<any>}
     *
     * @memberOf HttpProxyService
     */
    getRequest(uri: string, caller: any, options?: RequestOptionsArgs): Promise<any> {

        return this.http.get(uri, options)
            .map(response => { return this.onRequestEnd(response, '[GET]', uri, caller.name); })
            .toPromise()
            .then(result => { return result; })
            .catch(r => {
                return r;
            });
    }

    /**
     * @param {string} uri
     * @param {*} body
     * @param {Object} caller
     * @param {RequestOptionsArgs} [options]
     * @returns {Promise<any>}
     *
     * @memberOf HttpProxyService
     */
    postRequest(uri: string, body: any, caller: any, options?: RequestOptionsArgs): Promise<any> {

        return this.http.post(uri, body, options)
            .map(response => { return this.onRequestEnd(response, '[POST]', uri, caller.name); })
            .toPromise()
            .then(result => { return result; })
            .catch(r => {
                return r;
            });
    }

    /**
     *
     *
     * @private
     * @param {Response} response
     * @param {string} method
     * @param {string} uri
     * @param {string} caller
     * @returns {Promise<any>}
     *
     * @memberOf HttpProxyService
     */
    public onRequestEnd(response: Response, method: string, uri: string, caller: string): Promise<any> {

        let status = response.status;

        if (response.text('legacy') === '') {
            return null;
        }
        let result = response.json();

        if (status === 200) {
            return result;
        }
        let error = {
            'status': status,
            'message': result.message
        };
        let jsonFlag = false;
        let arrayFlag = this.charge.ArrayCharge(result);
        if (!arrayFlag) {
            jsonFlag = this.charge.JsonCharge(result);
            if (!arrayFlag && status !== 208) { error.status = 204; }
        }
        throw error;
    }

}

export class HttpRequestResultCharges {

    /**
     *
     *
     * @param {*} result
     * @returns {Boolean}
     *
     * @memberOf HttpRequestResultCharge
     */
    public ArrayCharge(result: any): boolean {
        return Array.isArray(result) && (result as Array<any>).length > 0;
    }

    /**
     *
     *
     * @param {any} result
     * @param {string[]} [properties]
     * @returns {Boolean}
     *
     * @memberOf HttpRequestResultCharge
     */
    public JsonCharge(result: any, properties?: string[]): boolean {
        if (!result || !JSON.stringify(result)) {
            return false;
        }
        if (this.ArrayCharge(properties)) {
            properties.forEach(prop => {
                let flag = result.hasOwnProperty(prop);
                if (!flag) {
                    return flag;
                }
            });
        }
    }
}
