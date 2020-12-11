import { JSONParse } from './JSONParse';

export interface IStorage<T> {
  key: string;
  get(): T;
  get<K extends keyof T>(key: K): T[K];
  get<K extends keyof T>(key?: K): T | T[K];
  set<K extends keyof T>(key: K, value: T[K]): void;
  remove: <K extends keyof T = any>(key: K) => void;
}

const memoryStorage = (() => {
  const store: Record<string, any> = {};
  const storage: IStorage<Record<string, any>> = {
    key: 'memory',
    get(key?: string) {
      if (typeof key === 'undefined') {
        return store;
      }
      return store[key];
    },
    set(key, value) {
      store[key] = value;
    },
    remove(key) {
      delete store[key];
    }
  };
  return storage;
})();

function createStorageFromWebStorage(webStorage: globalThis.Storage) {
  return <T extends {}>(key: string, defaultValue: T): IStorage<T> => {
    let value = defaultValue;
    return {
      key,
      get: <K extends keyof T>(prop?: K) => {
        value = JSONParse<T>(webStorage.getItem(key) || '', value);
        if (typeof prop !== 'undefined') {
          return value[prop];
        }
        return value as T;
      },
      set: (prop, newValue) => {
        value[prop] = newValue;
        webStorage.setItem(key, JSON.stringify(value));
      },
      remove: prop => {
        delete value[prop];
        webStorage.setItem(key, JSON.stringify(value));
      }
    };
  };
}

function wrapStorage(storage: IStorage<Record<string, any>>) {
  return <T extends {}>(key: string, defaultValue: T): IStorage<T> => {
    let value = defaultValue;
    return {
      key,
      get: <K extends keyof T>(prop?: K) => {
        value = storage.get(key);
        if (typeof prop !== 'undefined') {
          return value[prop];
        }
        return value as T;
      },
      set: (prop, newValue) => {
        value[prop] = newValue;
        storage.set(key, value);
      },
      remove: prop => {
        delete value[prop];
        storage.set(key, JSON.stringify(value));
      }
    };
  };
}

export function storageSupport() {
  const mod = 'TEST_STORAGE';
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    }
  } catch (e) {}

  return false;
}

export const createLocalStorage = <T extends {}>(
  key: string,
  defaultValue: T
) =>
  storageSupport()
    ? createStorageFromWebStorage(localStorage)(key, defaultValue)
    : (memoryStorage as IStorage<T>);

export const createSessionStorage = <T extends {}>(
  key: string,
  defaultValue: T
) =>
  storageSupport()
    ? createStorageFromWebStorage(sessionStorage)(key, defaultValue)
    : (memoryStorage as IStorage<T>);

const createTaisiusyutStorage = wrapStorage(
  createLocalStorage('taisiusyut', {} as Record<string, any>)
);

export const createAdminStorage: <T>(
  key: string,
  defaultValue: T
) => IStorage<T> = wrapStorage(
  createTaisiusyutStorage('admin', {} as Record<string, any>)
);
