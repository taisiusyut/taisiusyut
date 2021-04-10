import { AxiosResponse, AxiosError } from 'axios';

export interface ApiErrorValue {
  statusCode: number;
  message: string | string[];
  error?: string;
}

interface CloudinaryError {
  error: { message: string };
}

export interface ApiError extends Omit<AxiosError, 'response'> {
  response?: AxiosResponse<ApiErrorValue | CloudinaryError | string>;
}

export function getErrorMessage(error: ApiError): string {
  if (error.response) {
    const { data } = error.response;
    if (typeof data === 'string') {
      return error.response.statusText;
    }

    if ('message' in data) {
      const { message } = data;
      return Array.isArray(message) ? message[0] : message;
    }

    if (data.error.message) {
      return data.error.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'Unknown';
}
