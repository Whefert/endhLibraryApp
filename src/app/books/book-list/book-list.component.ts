import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from '../model/book';
import { BookService } from '../service/book.service';
import { MessageService } from 'src/app/messages/service/message.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  constructor(
    private bookService: BookService,
    private messageService: MessageService
  ) {}

  books: Book[] = [];

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
  }

  ngOnInit(): void {
    this.bookService.getBooks();
    this.bookService.subject.subscribe((books) => (this.books = books));
  }
}
