import { Injectable } from '@angular/core';
import { uuid } from 'uuidv4';

interface IToast {
  id: string;
  type?: string;
  title: string;
  description: string;
}

@Injectable()
export class ToastsService {
  toasts: IToast[] = [];

  addToast(title: string, description: string, type = '') {
    const id = uuid();

    this.toasts.push({ id, title, description, type });

    const timer = setTimeout(() => {
      this.removeToast(id);
    }, 4000);

    return () => {
      clearTimeout(timer);
    }
  }

  removeToast(id: string) {
    const toastIndex = this.toasts.findIndex(toast => toast.id === id);

    this.toasts.splice(toastIndex, 1);
  }
}