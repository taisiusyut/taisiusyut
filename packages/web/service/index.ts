import { api } from '@taisiusyut/common/service';
import { isHeadless } from '@/utils/isHeadless';
import { ValidationHeader } from '@/constants';

let headLess: boolean | null = null;

api.interceptors.request.use(config => {
  if (headLess === null) {
    headLess = !!isHeadless();
  }
  if (headLess === true) {
    throw new Error(`headless browser`);
  }
  return config;
});

api.interceptors.request.use(config => {
  config.headers = {
    ...config.headers,
    [ValidationHeader]:
      process.env.NEXT_PUBLIC_VALIDATION_HEADER || ValidationHeader
  };
  return config;
});

export * from '@taisiusyut/common/service';
