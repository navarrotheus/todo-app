import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @ViewChild('f') signInForm: NgForm;

  constructor(public authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.getToken() && this.router.navigate(['/dashboard']);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const { value: formData } = this.signInForm;

    const { user } = formData;

    const checkIsEmail = user.indexOf('@');

    checkIsEmail > -1 ? formData.email = user : formData.username = user;

    delete formData.user;

    this.authService.signIn(formData);
  }

}
