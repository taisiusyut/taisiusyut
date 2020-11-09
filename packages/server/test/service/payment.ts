import { CreatePaymentDto, UpdatePaymentDto } from '@/modules/payment/dto';
import { routes } from '@/constants/routes';
import qs from 'qs';

export { CreatePaymentDto, UpdatePaymentDto };

type CreatePayload = Partial<CreatePaymentDto> &
  Pick<CreatePaymentDto, 'details'>;

export const createPaymentDto = (
  payload: CreatePayload | Record<string, unknown>
) => {
  return {
    price: 1,
    ...payload
  } as CreatePaymentDto;
};

export function createPayment(token: string, dto: CreatePayload) {
  return request
    .post(routes.create_payment)
    .set('Authorization', `bearer ${token}`)
    .send(createPaymentDto(dto));
}

export function getPayments(token: string, query: Record<string, any> = {}) {
  return request
    .get(routes.get_payments)
    .set('Authorization', `bearer ${token}`)
    .query(qs.stringify(query));
}

export function updatePayment(
  token: string,
  id: string,
  changes: UpdatePaymentDto | Record<string, unknown>
) {
  return request
    .patch(routes.update_payment.generatePath({ id }))
    .set('Authorization', `bearer ${token}`)
    .send(changes || {});
}
