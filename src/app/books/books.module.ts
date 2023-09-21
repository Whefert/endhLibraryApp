import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookCreateComponent } from './book-create/book-create.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { FilterComponent } from './filter/filter.component';
import { HomeComponent } from '../home/home.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ReservationComponent } from './reservation/reservation.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaginationComponent } from './pagination/pagination.component';

@NgModule({
  declarations: [
    BookListComponent,
    BookSearchComponent,
    BookDetailsComponent,
    BookCreateComponent,
    FilterComponent,
    ReservationComponent,
    ReviewsComponent,
    DashboardComponent,
    HomeComponent,
    PaginationComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class BooksModule {}
