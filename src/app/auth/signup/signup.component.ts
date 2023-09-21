import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthData } from '../models/auth-data';
import { User } from '../models/user';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub?: Subscription;

  token: string | undefined;

  onSignUp(form: NgForm) {
    if (form.invalid) {
      for (const control of Object.keys(form.controls)) {
        form.controls[control].markAsTouched();
      }
      console.debug(`Token [${this.token}] generated`);
      return;
    }

    const newUser: User = {
      userId: null,
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      phoneNumber: form.value.number,
      dob: form.value.dob,
      country: form.value.country,
      state: form.value.state,
      city: form.value.city,
      street: form.value.street,
    };
    console.log(newUser);
    this.isLoading = true;
    this.authService.createUser(newUser);
  }

  constructor(public authService: AuthService) {
    this.token = undefined;
  }

  ngOnInit(): void {
    this.authStatusSub = this.authService
      .getauthStatusListener()
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub?.unsubscribe();
  }
}
