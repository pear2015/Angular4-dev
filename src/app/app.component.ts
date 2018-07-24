import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'electron-app',
    template: `<span defaultOverlayTarget></span> <router-outlet></router-outlet>`
})
export class AppComponent implements OnInit {

    constructor(private router: Router) {
    }

    ngOnInit() {
    }
    /**
     * 监听页面所有点击事件
     * 每一次点击都会触发过期时间刷新
     * @memberOf AppComponent
     */
    clickEventListener() {
        if (this.router.url === '/login') {
            return;
        }
    };

}
