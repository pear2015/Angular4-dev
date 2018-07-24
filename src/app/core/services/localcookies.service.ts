import { Injectable } from '@angular/core';
import * as cookies from 'ng2-cookies';

@Injectable()
export class LocalCookieService {
    private cookie;
    constructor() {
        this.cookie = cookies.Cookie;
    }

    write(key: string, value: any, minute: number): void {
        let dt = new Date();
        dt.setMinutes(dt.getMinutes() + minute);
        this.cookie.set(key, value, dt);
        // this.logger.debug('LocalCookieService write [' + key + ': ' + value + '] and expiration on: ' + dt);
    }

    read(key: string): string {
        let myCookie = this.cookie.get(key);

        if (myCookie === null ||
            typeof (myCookie) === undefined ||
            myCookie === 'undefined' ||
            myCookie === '') {
            return null;
        } else {
            return myCookie;
        }
    }

    readObject<T>(key: string): T {
        let myCookie = this.cookie.get(key);
        if (myCookie === '' || myCookie === null || myCookie === undefined) {
            return null;
        }
        let data: T;
        try {
            data = <T>JSON.parse(myCookie);
        } catch (error) {
            data = null;
        }

        return data;
    }

    remove(key: string): void {
        this.cookie.delete(key);
    }
}
