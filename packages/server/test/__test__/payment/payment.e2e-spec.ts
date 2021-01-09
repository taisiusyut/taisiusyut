import { testGetPayments } from './get-payments';
import { testCreatePayment } from './create-payment';
import { testUpdatePayment } from './update-payment';

describe('PaymentController (e2e)', () => {
  describe('(GET) Get Payments', testGetPayments);
  describe('(POST) Create Payment', testCreatePayment);
  describe('(PATCH) Update Payment', testUpdatePayment);
});
