import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { BookCreateComponent } from './books/book-create/book-create.component';
import { VerificationComponent } from './auth/verification/verification.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'books', component: BookListComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'book/new',
    component: BookCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'book/:id/edit',
    component: BookCreateComponent,
    pathMatch: 'full',
    canActivate: [AuthGuard],
  },
  { path: 'user/verify/:token', component: VerificationComponent },
  { path: 'book/:id', component: BookDetailsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
