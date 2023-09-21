import { Component, OnInit } from '@angular/core';
import { BookService } from '../service/book.service';
import { Subscription } from 'rxjs';
import { Book } from '../model/book';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  constructor(private bookService: BookService) {}

  pageNumbers: number = 1;

  updatePage(event: any) {
    const pageNumber = event.target.innerHTML;
    this.bookService.updatePage(pageNumber);
    this.bookService.getBooks();
  }

  ngOnInit(): void {
    this.bookService.subject.subscribe((res) => {
      console.log('Books', res.length);
      this.pageNumbers = (res.length % 12) + 1;
      console.log(this.pageNumbers);
    });
  }
}
