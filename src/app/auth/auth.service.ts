import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './models/user';
import { AuthData } from './models/auth-data';
import { Observable, Subject, of } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from '../messages/service/message.service';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_URL: string = environment.apiUrl + '/user';
  httpOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  private token?: string | null;
  private authStatusListener = new Subject<boolean>();
  private userInfoListener = new Subject<AuthData>();
  private isAuthenticated: boolean = false;
  private tokenTimer?: any;
  private user?: AuthData = { name: '', userRole: 'user' };
  private log(message: string, type: string) {
    this.messageService.add(message, type);
  }

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
      // this.log(`${operation} failed: ${error.message}`, 'warning');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getuserListener() {
    return this.userInfoListener.asObservable();
  }

  getauthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId(): string {
    return localStorage.getItem('userId') as string;
  }

  getUserRole(): string {
    if (this.user) {
      return this.user.userRole as string;
    }
    return '';
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getToken() {
    return this.token;
  }

  createUser(user: User) {
    this.http.post(`${this.BASE_URL}/signup`, user).subscribe({
      next: (res) => {
        this.router.navigate(['/dashboard']);
        this.messageService.add(
          'Please check your email to verify your account',
          'success'
        );
      },
      error: (error) => {
        this.authStatusListener.next(false);
      },
    });
  }

  verifyUser(
    token: string
  ): Observable<{ message: string; verified: boolean }> {
    return this.http
      .get<{ message: string; verified: boolean }>(
        `${this.BASE_URL}/verify/${token}`
      )
      .pipe(
        catchError(
          this.handleError('verifyUser', {
            message: 'Unable to verify user',
            verified: false,
          })
        )
      );
  }

  login({ email, password }: any) {
    this.http
      .post<{
        token: string;
        expiresIn: number;
        name: string;
        userRole: string;
      }>(`${this.BASE_URL}/login`, { email, password })
      .subscribe({
        next: (response) => {
          //get token from the response
          // const token = response.token;
          // save response token to local variable
          this.token = response.token;
          if (this.token) {
            const expiresInDuration = response.expiresIn;
            //set timer to logout after token expiration (1 hour)
            this.setAuthTimer(expiresInDuration);
            //update authentication status
            this.authStatusListener.next(true);
            this.userInfoListener.next({
              name: response.name,
              userRole: response.userRole,
            });
            this.isAuthenticated = true;
            //calculate expiration day/time for auth token in local storage
            const now = new Date();
            const expirationDate = new Date(
              //TODO: check that this calculation is working right
              now.getTime() + expiresInDuration * 1000
            );
            //update local storage with the auth token and it's expiration date
            //create a new user
            this.user = {
              name: response.name,
              userRole: response.userRole,
            };
            this.saveAuthData(
              this.token,
              expirationDate,
              this.user.name as string,
              this.user.userRole as string
            );
            //redirect to dashboard
            this.router.navigate(['/dashboard']);
            this.messageService.add('login successful', 'success');
          }
        },
        error: (error: any) => {
          this.authStatusListener.next(false);
        },
      });
  }

  autoAuthUser() {
    //check if the user has been flagged as authorized from previous session on site
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    //compare token expiration date with current date to see if the token is still valid
    const now = new Date();
    const expiresIn = authInformation!.expirationDate.getTime() - now.getTime();
    //if the token is valid, authenticate the user
    if (expiresIn > 0) {
      this.token = authInformation?.token;
      if (this.user) {
        this.user.userRole = authInformation.userRole as string;
        this.user.name = authInformation.name as string;
        this.userInfoListener.next({
          name: authInformation.name as string,
          userRole: authInformation.userRole as string,
        });
      }
      this.isAuthenticated = true;
      this.authStatusListener.next(true);
    }
    //reset the auth timer function to logout the user after the token expires
    this.setAuthTimer(expiresIn / 1000);
  }
  logout() {
    this.token = null;
    this.authStatusListener.next(false);
    this.isAuthenticated = false;
    clearTimeout(this.tokenTimer);
    this.user!.name = '';
    this.clearAuthData();
    this.router.navigate(['/dashboard']);
  }
  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    name: string,
    userRole: string
  ) {
    localStorage.setItem('token', token);
    //TODO: store user object in local storage instead of id and username separately
    localStorage.setItem('name', name);
    localStorage.setItem('userRole', userRole);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    //TODO: store user object in local storage instead of id and username separately
    localStorage.removeItem('name');
    localStorage.removeItem('userRole');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userRole = localStorage.getItem('userRole');
    //TODO: store user object in local storage instead of id and username separately
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    if (!token || !expirationDate) {
      return;
    }

    return {
      token,
      expirationDate: new Date(expirationDate),
      userId,
      name,
      userRole,
    };
  }
  constructor(
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) {}
}
