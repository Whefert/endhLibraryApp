import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Book } from 'src/app/books/model/book';
import { Review } from './review';
import { AuthService } from '../../auth/auth.service';
import { BookService } from '../service/book.service';
import { ReviewService } from './review.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MessageService } from 'src/app/messages/service/message.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css', './starability.css'],
})
export class ReviewsComponent implements OnInit, OnDestroy {
  constructor(
    private authService: AuthService,
    private reviewService: ReviewService,
    private messageService: MessageService
  ) {}

  @Input() bookId?: string;
  @Input() userId?: string;
  @Input() isAuthenticated?: boolean = false;

  authListenerSubs?: Subscription;

  reviewSubscription?: Subscription;

  reviews?: Review[];

  addReview(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (form.control.get('body')?.value === '') {
      this.messageService.add(
        'Review body cannot be empty. Please try again',
        'warning'
      );
      return;
    }

    if (form.control.get('rating')?.value === '') {
      form.control.patchValue({ rating: 3 });
    }
    this.reviewService.addReview({
      body: form.control.get('body')?.value,
      bookId: this.bookId,
      rating: form.control.get('rating')?.value,
      author: this.userId,
    });
    this.reviewService.updateReviews(this.bookId as string);
  }

  deleteReview(reviewId: string): void {
    this.reviewService.deleteReview(reviewId);
    this.reviewService.updateReviews(this.bookId as string);
    this.messageService.add('Review deleted successfully', 'success');
  }

  ngOnInit(): void {
    this.reviewSubscription = this.reviewService
      .getReviewSubListener()
      .subscribe((result) => {
        this.reviews = result;
      });
    this.reviewService.updateReviews(this.bookId as string);
  }

  ngOnDestroy(): void {
    this.authListenerSubs?.unsubscribe();
    this.reviewSubscription?.unsubscribe();
  }
}
