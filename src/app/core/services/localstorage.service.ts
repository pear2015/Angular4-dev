import { Injectable } from '@angular/core';

// import { Logger, LoggerFactory } from './logger-factory.service';

/**
 * 本地存储服务操作类
 */
@Injectable()
export class LocalStorageService {

    // private logger: Logger;

    constructor() {
        // this.logger = loggerFactory.getLogger('LocalStorageService');
    }

    /**
     * @param {string} key - 关键字
     * 读取
     */
    read(key: string): string {
        let text: string = localStorage.getItem(key);

        if (text === null || typeof (text) === undefined || text === 'undefined') {
            // this.logger.warn('LocalStorageService read(' + key + ') - key not found, returned null.');
            return null;
        } else {
            // this.logger.debug('LocalStorageService read [' + key + ': ' + text + ']');
            return text;
        }
    }

    /**
     * @param {string} key - 关键字
     * 读取一个对象
     */
    readObject<T>(key: string): T {
        let text = this.read(key);
        let data: T;

        try {
            data = <T>JSON.parse(text);
        } catch (error) {
            // this.logger.error('LocalStorageService readObject: can not convert string from local storage '
            //     + 'to object using JSON.pares(). Error:' + error);
            data = null;
        }

        return data;
    }

    /**
     * @param {string} key - 关键字
     * @param {string} data - 保存到期时间
     * 写
     */
    write(key: string, data: string): void {
        localStorage.setItem(key, data);
        // this.logger.debug('LocalStorageService write(' + key + ')');
    }

    /**
     * @param {string} key - 关键字
     * @param {any} data - 数据
     * 写一个对象
     */
    writeObject(key: string, data: any): void {
        let text = JSON.stringify(data);
        this.write(key, text);
    }

    /**
     * @param {string} key - 关键字
     * 移除
     */
    remove(key: string): void {
        localStorage.removeItem(key);
        // this.logger.debug('LocalStorageService remove' + key + ')');
    }

    /**
     * 清楚所有缓存
     */
    clear(): void {
        localStorage.clear();
        // this.logger.debug('LocalStorageService clear() - all items removed from local storage.');
    }
}
