import { Injectable, OnInit } from '@angular/core';
import { BookService } from '../service/book.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService implements OnInit {
  constructor(private bookService: BookService) {}

  ngOnInit(): void {}
}
