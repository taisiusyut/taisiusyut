import { Insertion, Pagination } from './';

export enum PaymentType {
  Book = 1,
  Chapter
}

export enum PaymentStatus {
  Pending = 1,
  Success,
  Faulure,
  Refund
}

export interface Schema$BookPayment {
  book: string;
  type: PaymentType.Book;
}

export interface Schema$ChapterPayment {
  book: string;
  chapter: string;
  type: PaymentType.Chapter;
}

export type Schema$PaymentDetails = Schema$BookPayment | Schema$ChapterPayment;

export type InsertedPaymentDetails = Insertion<Schema$PaymentDetails>;

export interface Schema$Payment {
  id: string;
  price: number;
  user: string;
  status: PaymentStatus;
  details: Schema$PaymentDetails;
}

export interface Param$CreatePayment {
  id: string;
  price: number;
  user: string;
  details: Schema$PaymentDetails;
}

export interface Param$UpdatePayment {
  status?: PaymentStatus;
}

export interface Param$GetPayments extends Pagination {
  user?: string;
  type?: PaymentType;
  book?: string;
  status?: PaymentStatus;
}
