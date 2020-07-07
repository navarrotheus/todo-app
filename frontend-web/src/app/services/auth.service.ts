import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { ToastsService } from './toasts.service';

interface ISignUpBodyData {
  email: string;
  username: string;
  password: string;
  confirm_password: string;
}

interface ISignUpResponseData {
  username: string;
  email: string;
  id: string;
  created_at: string;
  updated_at: string | null;
}

interface ISignInBodyData {
  username?: string;
  email?: string;
  password: string;
}

interface ISignInResponseData {
  user: {
    id: string;
    username: string;
    email: string;
    created_at: string;
    updated_at: string | null;
  };
  token: string;
}

@Injectable()
export class AuthService {
  isLoading = false;

  constructor(
    private http: HttpClient,
    private toastsService: ToastsService,
    private router: Router
    ) {}

  getToken() {
    return localStorage.getItem('@ToDoApp:token');
  }

  getUsername() {
    return localStorage.getItem('@ToDoApp:username');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  signUp(bodyData: ISignUpBodyData) {
    this.isLoading = true;
    this.http.post(
      'http://localhost:3333/users',
      bodyData
    ).subscribe(() => {
      this.isLoading = false;
      this.toastsService.addToast('Conta criada com sucesso', 'Você já pode realizar login', 'sucess');
      this.router.navigate(['/']);
    }, ({ error }) => {
      this.isLoading = false;
      this.toastsService.addToast('Erro ao criar conta', error.error, 'error');
    });
  }

  signIn(bodyData: ISignInBodyData) {
    this.isLoading = true;
    this.http.post(
      'http://localhost:3333/sessions',
      bodyData
    ).subscribe(({ token, user }: ISignInResponseData) => {
      this.isLoading = false;
      localStorage.setItem('@ToDoApp:token', token);
      localStorage.setItem('@ToDoApp:username', user.username);
      this.toastsService.addToast('Sucesso ao realizar login', 'Você já pode gerenciar suas tarefas!', 'sucess');
      this.router.navigate(['/dashboard']);
    }, ({ error }) => {
      this.isLoading = false;
      this.toastsService.addToast('Erro ao realizar login', error.error, 'error');
    });
  }

  signOut() {
    localStorage.removeItem('@ToDoApp:token');
    localStorage.removeItem('@ToDoApp:username');
  }
}