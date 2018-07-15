import { ErrorHandler, Injectable } from '@angular/core';
/**
 * 全局异常捕获
 *
 * @export
 * @class GlobalErrorHandler
 * @extends {ErrorHandler}
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    constructor() {

    }

    /**
     * 捕获异常
     */
    handleError(error: any): void {
        console.log(`!error occure!: ${error.message} 
         >>>stack: ${error.stack}`);
    }
}
