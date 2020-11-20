import { JSONParse } from './JSONParse';

export interface IStorage<T> {
  key: string;
  get(): T;
  save(value: T): void;
  removeItem: () => void;
}

type WebStorage = Pick<
  globalThis.Storage,
  'getItem' | 'setItem' | 'removeItem'
>;

function createStorage<T>(storage: WebStorage) {
  return (key: string, defaultValue: T) => {
    let value = defaultValue;
    return {
      storage,
      key,
      get: () => {
        value = JSONParse<T>(storage.getItem(key) || '', value);
        return value;
      },
      save: (newValue: T) => {
        value = newValue;
        storage.setItem(key, JSON.stringify(newValue));
      },
      removeItem: () => {
        storage.removeItem(key);
      }
    };
  };
}

export function mockStorage(key: string, storage: WebStorage): WebStorage {
  const baseStorage = createStorage<Record<string, unknown>>(storage)(key, {});
  return {
    getItem: key => JSON.stringify(baseStorage.get()[key]),
    setItem: (key, value) =>
      baseStorage.save({ ...baseStorage.get(), [key]: JSONParse(value, null) }),
    removeItem: key => {
      const state = baseStorage.get();
      delete state[key];
      baseStorage.save(state);
    }
  };
}

export function storageSupport() {
  const mod = 'FULLSTACK_TEST_STORAGE';
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    }
  } catch (e) {}

  return false;
}

const memoryStorage = ((): WebStorage => {
  const store: Record<string, string | null> = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: key => {
      delete store[key];
    }
  };
})();

export const createLocalStorage: <T>(
  key: string,
  defaultValue: T
) => IStorage<T> = createStorage(
  storageSupport() ? localStorage : memoryStorage
);

export const createSessionStorage: <T>(
  key: string,
  defaultValue: T
) => IStorage<T> = createStorage(
  storageSupport() ? sessionStorage : memoryStorage
);

export const storage = storageSupport()
  ? mockStorage('taisiusyut', localStorage)
  : memoryStorage;

const _adminStorage = mockStorage('taisiusyut/admin', storage);
export const createAdminStorage: <T>(
  key: string,
  defaultValue: T
) => IStorage<T> = createStorage(_adminStorage);

const _chapterStorage = mockStorage('chapters', _adminStorage);
export const createChapterSotrage: <T>(
  key: string,
  defaultValue: T
) => IStorage<T> = createStorage(_chapterStorage);
