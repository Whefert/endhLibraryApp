import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css'],
})
export class VerificationComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  verificationMessage = { heading: '', text: '' };
  token: string = '';
  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('token')) {
        const token = paramMap.get('token');

        this.authService.verifyUser(token as string).subscribe((res) => {
          if (res.verified) {
            this.verificationMessage.heading =
              'User account verification successful.';
            this.verificationMessage.text =
              'You may now reserve books. Please login to do so.';
          } else {
            this.verificationMessage.heading =
              'User account verification failed.';
            this.verificationMessage.text = 'Please try again.';
          }
        });
      }
    });
  }
}
