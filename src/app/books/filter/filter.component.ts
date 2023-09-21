import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../service/book.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  category: string = 'all';
  type: string = 'all';
  categories: [] = [];

  updateCategory(evt: any) {
    this.bookService.updateSearchCategory(evt.target.value);
    this.updateView();
  }
  updateType(evt: any) {
    this.bookService.updateSearchType(evt.target.value);
    this.updateView();
  }

  updateView() {
    this.bookService.getBooks();
  }

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.categorySubject.subscribe(
      (categories) => (this.categories = categories)
    );
    this.bookService.getBookCategories();
  }
}
