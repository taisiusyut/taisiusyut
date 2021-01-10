import router from 'next/router';
import qs from 'querystring';

function createSetSearchParam() {
  return function setSearchParam<T extends Record<string, unknown>>(
    payload: Partial<T> | ((params: Partial<T>) => Partial<T>)
  ) {
    const newState =
      typeof payload === 'function'
        ? payload(qs.parse(router.asPath.split('?')[1]) as T)
        : payload;

    // remove value equals to undefined and ''
    for (const key in newState) {
      if (typeof newState[key] === 'undefined' || newState[key] === '') {
        delete newState[key];
      }
    }

    router.push(
      {
        pathname: router.asPath.split('?')[0], // seems require for dynamic route
        search: decodeURIComponent(
          qs.stringify(newState as qs.ParsedUrlQueryInput)
        )
      },
      undefined,
      { shallow: true }
    );
  };
}

export const setSearchParam = createSetSearchParam();
export const clearSearchParam = () => router.push({ search: '' });
