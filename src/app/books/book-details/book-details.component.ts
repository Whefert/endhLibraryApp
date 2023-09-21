import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../model/book';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { BookService } from '../service/book.service';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { ReservationService } from '../reservation/service/reservation.service';
import { MessageService } from 'src/app/messages/service/message.service';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit, OnDestroy {
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private bookService: BookService,
    private location: Location,
    private reservationService: ReservationService,
    private messageService: MessageService
  ) {}

  book?: Book;
  userId?: string;
  public isAuthorised?: boolean;
  public isAuthenticated?: boolean;
  private authListenerSubs?: Subscription;
  public userRole?: string;
  editMode: boolean = false;
  id = this.activatedRoute.snapshot.paramMap.get('id') || '';

  changeEditMode() {
    this.editMode = !this.editMode;
  }

  getBook(): void {
    this.bookService.getBook(this.id).subscribe((res) => {
      this.book = res.book;
    });
  }

  delete() {
    this.bookService.deleteBook(this.id.toString()).subscribe();
    // this.bookService.getBooks();
  }

  goBack() {
    this.location.back();
  }

  reserveBook() {
    if (!this.isAuthenticated) {
      this.messageService.add(
        'You must be logged in in order to reserve a book. Please login and try again',
        'danger'
      );
      return;
    }
    this.reservationService.addReservation({
      book: this.book?._id,
      reservedBy: this.userId,
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.getBook();

    this.authListenerSubs = this.authService
      .getauthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.isAuthenticated = this.authService.getIsAuth();
    this.userRole = this.authService.getUserRole();
    this.isAuthorised = this.userRole === 'admin';
  }

  ngOnDestroy(): void {
    this.authListenerSubs?.unsubscribe();
  }
}
