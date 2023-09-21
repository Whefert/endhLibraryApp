export interface Reservation {
  book: { name: string };
  reservedBy: { name: string };
  approvalStatus: boolean;
  reserveDate: Date;
  returnDate: Date;
}
