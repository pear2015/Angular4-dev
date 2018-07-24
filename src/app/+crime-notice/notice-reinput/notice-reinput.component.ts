import { Component } from '@angular/core';
import { Router } from '@angular/router';
/**
 *  被驳回的公告，需要重新录入
 */
@Component({
  templateUrl: './notice-reinput.component.html'
})
export class NoticeReInputComponent {
  constructor(private router: Router) {

  }
  goBack() {
    this.router.navigate(['/crms-system/crime-notice/notice-reject']);
  }
}
