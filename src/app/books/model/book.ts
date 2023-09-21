export interface Book {
  _id: string | null;
  name: string;
  author: string;
  category: string;
  availability: string;
  type: string;
  image: { url: string; filename: string };
  description: string;
  addedBy: string | null;
}
