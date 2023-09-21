import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService) {}
  private authListenerSubs?: Subscription;

  private userListenerSub?: Subscription;

  isAuthenticated?: boolean;

  username?: string;

  onLogOut() {
    this.authService.logout();
  }

  ngOnInit(): void {
    this.authListenerSubs = this.authService
      .getauthStatusListener()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
        // this.username = this.authService.getUserName();
      });

    this.userListenerSub = this.authService
      .getuserListener()
      .subscribe((user) => {
        this.username = user.name;
      });
    // this.username = this.authService.getUserName();
    this.authService.autoAuthUser();
  }
}
