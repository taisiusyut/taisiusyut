import { testCreatePayment } from './create-payment';
import { testUpdatePayment } from './update-payment';
import { testGetPayments } from './get-payments';

describe('PaymentController (e2e)', () => {
  describe('(POST) Create Payment', testCreatePayment);
  describe('(PTCH) Update Payment', testUpdatePayment);
  describe('(GET)  Get Payments', testGetPayments);
});
