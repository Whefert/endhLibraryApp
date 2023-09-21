import { Component, OnInit } from '@angular/core';
import { BookService } from '../books/service/book.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.setDashboardView();
    this.bookService.getBooks();
  }
}
