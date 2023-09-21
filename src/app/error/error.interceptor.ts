import { Injectable } from '@angular/core';
import { MessageService } from '../messages/service/message.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private messageService: MessageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occured!';
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        console.log(error);
        this.messageService.add(`${errorMessage}`, 'danger');
        return throwError(() => new Error(error.error.error.message));
      })
    );
  }
}
