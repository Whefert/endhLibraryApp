import { Injectable } from '@angular/core';
import { Review } from './review';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, Observable, of, Subject } from 'rxjs';
import { MessageService } from 'src/app/messages/service/message.service';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  private reviewURL = 'http://localhost:3000/api/review';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private log(message: string, type: string) {
    this.messageService.add(message, type);
  }

  private reviewSubject = new Subject<Review[]>();

  //it is ok to share this to other parts of the app
  getReviewSubListener() {
    return this.reviewSubject.asObservable();
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`, 'danger');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // ################ Logic starts here

  getReviewsForBook(bookId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.reviewURL}/${bookId}`).pipe(
      tap((x) => {
        x.length;
        // ? this.log(`Found ${x} reviews"`, 'warning')
        // : this.log('no reviews found', 'warning');
      }),
      catchError(this.handleError('getBooks', []))
    );
  }

  updateReviews(bookId: string): void {
    this.getReviewsForBook(bookId).subscribe((reviews) =>
      this.reviewSubject.next(reviews)
    );
  }

  addReview({ body, bookId, rating, author }: any) {
    this.http
      .post<{ message: string }>(`${this.reviewURL}`, {
        body,
        bookId,
        rating,
        author,
      })
      .subscribe((res) => {
        console.log(res);
      });
    this.updateReviews(bookId);
  }

  deleteReview(reviewId: string): void {
    this.http
      .delete<Review[]>(`${this.reviewURL}/delete/${reviewId}`)
      .subscribe();
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}
}
