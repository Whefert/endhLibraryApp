import { Component, OnDestroy, OnInit } from '@angular/core';
import { Book } from '../books/model/book';
import { BookService } from '../books/service/book.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  constructor(
    private bookService: BookService,
    private authService: AuthService
  ) {}
  authListenerSub?: Subscription;
  isAuthenticated?: boolean = false;
  isAuthorised?: boolean;
  public userRole?: string;

  books: Book[] = [];

  ngOnInit(): void {
    this.authListenerSub = this.authService
      .getauthStatusListener()
      .subscribe((authStatus) => (this.isAuthenticated = authStatus));
    // this.bookService
    //   .getBooks()
    //   .subscribe((books) => (this.books = books.slice(1, 5)));
    this.isAuthenticated = this.authService.getIsAuth();
    this.isAuthorised = this.authService.getUserRole() == 'admin';
    this.bookService.resetView();
    this.bookService.getBooks();
  }
  ngOnDestroy(): void {
    this.authListenerSub?.unsubscribe();
  }
}
