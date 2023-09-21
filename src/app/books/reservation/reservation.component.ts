import { Component, OnInit } from '@angular/core';
import { ReservationService } from './service/reservation.service';
import { Reservation } from './model/reservation';
import { map, Observable, Subscriber, Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Input } from '@angular/core';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
})
export class ReservationComponent implements OnInit {
  constructor(
    private resService: ReservationService,
    private authService: AuthService
  ) {}
  @Input() bookId?: string;
  @Input() userId?: string;
  reservationsSub?: Subscription;

  reservations: Reservation[] = [];
  public isAuthorised?: boolean;
  public isAuthenticated?: boolean;
  private authListenerSubs?: Subscription;

  ngOnInit(): void {
    this.reservationsSub = this.resService
      .getResSubListener()
      .subscribe((reservations) => {
        this.reservations = reservations;
      });
    this.authListenerSubs = this.authService
      .getauthStatusListener()
      .subscribe((status) => {
        this.isAuthenticated = status;
      });
    this.isAuthenticated = this.authService.getIsAuth();
    // this.resService.getReservationsByBookId(this.bookId as string);
  }

  ngOnDestroy(): void {
    this.authListenerSubs?.unsubscribe();
    this.reservationsSub?.unsubscribe();
  }
}
