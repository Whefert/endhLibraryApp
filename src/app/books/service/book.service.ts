import { Injectable, OnInit } from '@angular/core';
import { Book } from '../model/book';
import { Observable, of, Subject } from 'rxjs';
import { MessageService } from 'src/app/messages/service/message.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookService implements OnInit {
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  private BASE_URL = environment.apiUrl + '/books';
  private category = 'all';
  private type = 'all';
  private currentPage = '1';
  private resultsCount = '12';
  private categories: [string] = [''];

  updateSearchCategory(term: string) {
    this.category = term;
  }

  updateSearchType(term: string) {
    this.type = term;
  }

  updatePage(term: string) {
    this.currentPage = term;
  }
  updateResultsCount(term: string) {
    this.resultsCount = term;
  }

  resetView() {
    this.updatePage('1');
    this.updateResultsCount('12');
    this.updateSearchCategory('all');
    this.updateSearchType('all');
  }

  setDashboardView() {
    this.updatePage('1');
    this.updateResultsCount('3');
    this.updateSearchCategory('all');
    this.updateSearchType('all');
  }

  public subject = new Subject<Book[]>();
  public categorySubject = new Subject<[]>();

  private log(message: string, type: string) {
    this.messageService.add(message, type);
  }
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  // // TODO: Keep this bit of code
  // public subject = new BehaviorSubject<Book[]>([]);

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`, 'warning');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  addBook(book: Book) {
    const bookData = new FormData();
    bookData.append('name', book.name);
    bookData.append('author', book.author);
    bookData.append('category', book.category);
    bookData.append('availability', book.availability);
    bookData.append('type', book.type);
    bookData.append('image', book.image.url, book.name);
    bookData.append('description', book.description);
    this.http
      .post<{ message: string }>(this.BASE_URL, bookData)
      .subscribe((res) => {
        //TODO: Show message response with message service
        this.getBooks();
      });
  }

  getBookCategories() {
    return this.http
      .get<{ message: string; categories: [] }>(`${this.BASE_URL}/categories`)
      .subscribe((res) => {
        this.categorySubject.next(res.categories);
      });
  }

  getBookCategoriesFromService() {
    return this.categories;
  }

  updateBook(book: Book) {
    //if new image uploaded
    if (typeof book.image.url === 'object') {
      const bookData = new FormData();
      bookData.append('id', book._id as string);
      bookData.append('name', book.name);
      bookData.append('author', book.author);
      bookData.append('category', book.category);
      bookData.append('availability', book.availability);
      bookData.append('type', book.type);
      bookData.append('image', book.image.url, book.name);
      bookData.append('description', book.description);
      bookData.append('addedBy', book.addedBy as string);
      this.http
        .put<{ message: string }>(`${this.BASE_URL}/${book._id}`, bookData)
        .subscribe((responseData) => {
          this.getBooks();
        });
    }
    //send regular json
    else {
      this.http
        .put<{ message: string; book: Book }>(
          `${this.BASE_URL}/${book._id}`,
          book,
          this.httpOptions
        )
        .subscribe((responseData) => {
          this.getBooks();
        });
    }
  }

  searchBooks(term: string): Observable<Book[]> {
    if (!term.trim()) {
      // if not search term, return empty book array.
      return of([]);
    }
    return this.http.get<Book[]>(`${this.BASE_URL}/search?name=${term}`).pipe(
      tap((x) => {
        x.length
          ? this.log(`Found books matching term "${term}"`, 'success')
          : this.log(`no books matching "${term}"`, 'danger');
      }),
      catchError(this.handleError('searchBooks', []))
    );
  }

  getBooks(): void {
    this.http
      .get<{ message: string; books: Book[] }>(
        this.BASE_URL +
          `?category=${this.category}&type=${this.type}&currentPage=${this.currentPage}&resultsCount=${this.resultsCount}`
      )
      .subscribe((res) => {
        this.subject.next(res.books);
      });
    catchError(this.handleError<Book[]>('getBooks', []));
  }

  deleteBook(id: string): Observable<any> {
    const url = `${this.BASE_URL}/${id}`;
    console.log(url);
    return this.http.delete<{ message: string }>(url, this.httpOptions).pipe(
      tap((_) => {
        this.log(`deleted book id=${id}`, 'danger');
      }),
      catchError(
        this.handleError<{ message: string }>('deleteHero', {
          message: 'Could not find book for deletion',
        })
      )
    );
  }

  getBook(id: string): Observable<{ message: string; book: Book }> {
    const url = `${this.BASE_URL}/${id}`;
    return this.http.get<{ message: string; book: Book }>(url);
    // catchError(this.handleError<{ message: string; book: Book }>("getBook",{message: ""; book: []}))
  }
}
