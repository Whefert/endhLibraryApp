export interface Review {
  _id: string;
  body: string;
  bookId: string;
  rating: number;
  author: { _id: string; name: string };
}
