import { Injectable, Optional } from '@angular/core';
import { Http, Response, RequestOptionsArgs } from '@angular/http';

/**
 * http请求代理服务
 */
@Injectable()
export class HttpProxyService {

  private charge: HttpRequestResultCharge;

  constructor(
    @Optional() private http: Http,
  ) {
    this.charge = new HttpRequestResultCharge();
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

    return this.http.get(uri, options).timeout(30000)
      .map(response => { return this.onRequestEnd(response, '[GET]', uri, caller.name); })
      .toPromise()
      .then(result => { return result; })
      .catch(r => {
        console.log(r);
      });
  }

  /**
   *
   *
   * @param {string} uri
   * @param {*} body
   * @param {Object} caller
   * @param {RequestOptionsArgs} [options]
   * @returns {Promise<any>}
   *
   * @memberOf HttpProxyService
   */
  postRequest(uri: string, body: any, caller: any, options?: RequestOptionsArgs): Promise<any> {

    return this.http.post(uri, body, options).timeout(30000)
      .map(response => { return this.onRequestEnd(response, '[POST]', uri, caller.name); })
      .toPromise()
      .then(result => { return result; })
      .catch(r => {
        console.log(r);
      });
  }

  /**
   *
   *
   * @param {string} uri
   * @param {*} body
   * @param {Object} caller
   * @param {RequestOptionsArgs} [options]
   * @returns {Promise<any>}
   *
   * @memberOf HttpProxyService
   */
  putRequest(uri: string, body: any, caller: any, options?: RequestOptionsArgs): Promise<any> {

    return this.http.put(uri, body, options).timeout(30000)
      .map(response => { return this.onRequestEnd(response, '[PUT]', uri, caller.name); })
      .toPromise()
      .then(result => { return result; })
      .catch(r => {
        console.log(r);
        return false;
      });
  }

  /**
   *
   *
   * @param {string} uri
   * @param {Object} caller
   * @param {RequestOptionsArgs} [options]
   * @returns {Promise<any>}
   *
   * @memberOf HttpProxyService
   */
  deleteRequest(uri: string, caller: any, options?: RequestOptionsArgs): Promise<any> {

    return this.http.delete(uri, options).timeout(30000)
      .map(response => { return this.onRequestEnd(response, '[DELETE]', uri, caller.name); })
      .toPromise()
      .then(result => { return result; })
      .catch(r => {
        console.log(r);
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
  private onRequestEnd(response: Response, method: string, uri: string, caller: string): Promise<any> {

    let status = response.status;
    let result;
    try {
      if (response.text('legacy') === '') {
        return null;
      }
      result = response.json();
      if (result === 'Server Inner Exception') {
        return null;
      }
      if (status === 200) {
        return result;
      }
    } catch (error) {
      console.log('json parse exception:' + error);
    }
    return result;

  }

}

export class HttpRequestResultCharge {

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
