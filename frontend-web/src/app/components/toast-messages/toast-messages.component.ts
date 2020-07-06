import { Component, OnInit, Input } from '@angular/core';
import { ToastsService } from 'src/app/services/toasts.service';

interface IToast {
  type?: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-toast-messages',
  templateUrl: './toast-messages.component.html',
  styleUrls: ['./toast-messages.component.scss']
})
export class ToastMessagesComponent implements OnInit {
  toasts = [];

  constructor(private toastsService: ToastsService) {
    this.toasts = toastsService.toasts;
  }

  ngOnInit(): void {
  }

  removeToast(id: string) {
    this.toastsService.removeToast(id);
  }

  getSrc(type: string) {
    if (type === '') {
      return 'assets/info.svg';
    } else if (type === 'error') {
      return 'assets/alert-circle.svg';
    } else {
      return 'assets/check-circle.svg';
    }
  }

  getCloseSrc(type: string) {
    if (type === '') {
      return 'assets/x-circle-blue.svg';
    } else if (type === 'error') {
      return 'assets/x-circle-red.svg';
    } else {
      return 'assets/x-circle-green.svg';
    }
  }
}
