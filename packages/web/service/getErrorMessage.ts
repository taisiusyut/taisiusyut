import { AxiosResponse, AxiosError } from 'axios';

export interface ApiErrorValue {
  statusCode: number;
  message: string | string[];
  error?: string;
}

export interface ApiError extends Omit<AxiosError, 'response'> {
  response?: AxiosResponse<ApiErrorValue | string>;
}

export function getErrorMessage(error: ApiError): string {
  if (error.response) {
    const { data } = error.response;
    if (typeof data === 'string') {
      return error.response.statusText;
    }
    const { message } = data;
    return Array.isArray(message) ? message[0] : message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown';
}
