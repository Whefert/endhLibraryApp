import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BookService } from '../service/book.service';
import { Book } from '../model/book';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';

import { Location } from '@angular/common';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css'],
})
export class BookCreateComponent implements OnInit {
  form: UntypedFormGroup;

  public mode: string = 'create';
  book!: Book;
  imagePreview?: string;
  categories: [] = [];

  constructor(
    private bookService: BookService,
    public activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.form = new UntypedFormGroup({
      name: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      author: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      availability: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      type: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      category: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      description: new UntypedFormControl(null, {
        validators: [Validators.required],
      }),
      image: new UntypedFormControl(null, {
        asyncValidators: [mimeType],
        // validators: [Validators.required],
      }),
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  saveBook() {
    if (this.form.valid) {
      //if book is new, create a new book then post it to the database
      if (this.mode === 'create') {
        const newBook: Book = {
          _id: null,
          name: this.form.value.name,
          author: this.form.value.author,
          availability: this.form.value.availability,
          type: this.form.value.type,
          category: this.form.value.category,
          description: this.form.value.description,
          image: { url: this.form.value.image, filename: this.form.value.name },
          addedBy: '',
        };
        this.bookService.addBook(newBook);
      } else {
        this.updateBook();
        this.book.addedBy = '';
        this.bookService.updateBook(this.book);
      }
      this.router.navigate(['/dashboard']);
    }
  }

  updateBook() {
    this.book.name = this.form.value.name;
    this.book.author = this.form.value.author;
    this.book.availability = this.form.value.availability;
    this.book.type = this.form.value.type;
    this.book.category = this.form.value.category;
    this.book.description = this.form.value.description;
    this.book.image = {
      url: this.form.value.image,
      filename: this.form.value.name,
    };
  }

  ngOnInit(): void {
    this.bookService.categorySubject.subscribe(
      (categories) => (this.categories = categories)
    );
    this.bookService.getBookCategories();
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.mode = 'edit';
        const id = paramMap.get('id');
        this.bookService.getBook(id as string).subscribe((res) => {
          this.book = res.book;
          this.form.setValue({
            name: res.book.name,
            author: res.book.author,
            availability: res.book.availability,
            type: res.book.type,
            category: res.book.category,
            description: res.book.description,
            image: res.book.image.url,
          });
          this.imagePreview = res.book.image.url;
        });
      } else {
        this.imagePreview = '';
      }
    });
  }
}
