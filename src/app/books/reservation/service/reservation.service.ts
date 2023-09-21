import { Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs';
import { MessageService } from 'src/app/messages/service/message.service';
import { Reservation } from '../model/reservation';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private reservationURL = environment.apiUrl + '/reservations';

  private reservationSubject = new Subject<Reservation[]>();

  private log(message: string, type: string) {
    this.messageService.add(message, type);
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

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  getReservations(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.reservationURL);
  }

  getResSubListener() {
    return this.reservationSubject.asObservable();
  }

  getReservationsByBookId(bookId: string): void {
    this.http
      .get<Reservation[]>(`${this.reservationURL}/${bookId}`)
      .subscribe((reservations) => {
        this.reservationSubject.next(reservations);
      });
  }

  addReservation({ book, reservedBy }: any) {
    this.http
      .post<{ message: string }>(this.reservationURL, {
        book,
      })
      .subscribe((result) => {
        this.log(result.message, 'success');
        console.log('RESULT FROM SEARCH', result);
      });
    catchError(
      this.handleError('addReservation', {
        message: 'Reservation failed. You can only reserve 5 books per day',
      })
    );
  }

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}
}
