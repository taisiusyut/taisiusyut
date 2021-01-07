import { JSONParse } from './JSONParse';

export interface IStorage<T> {
  key: string;
  get(): T;
  get<K extends keyof T>(prop: K, fallback: T[K]): T[K];
  get<K extends keyof T>(prop?: K): T | T[K];
  set<K extends keyof T>(prop: K, value: T[K]): void;
  save(value: T): void;
  remove: <K extends keyof T = any>(key: K) => void;
  clear: () => void;
}

function createMemoryStorage<T extends {}>(
  key: string,
  defaultValue: T
): IStorage<T> {
  let value = JSON.parse(JSON.stringify(defaultValue)) as T;
  return {
    key,
    get: <K extends keyof T>(prop?: K, fallback?: T[K]) => {
      if (typeof prop === 'undefined') {
        return value;
      }

      if (isObject(value)) {
        return (value[prop] as any) ?? fallback;
      }

      throw new Error(`value is not an object`);
    },
    set(key, newValue) {
      value[key] = newValue;
    },
    save(newValue) {
      value = newValue;
    },
    remove(key) {
      delete value[key];
    },
    clear: () => void 0
  };
}

function isObject(payload: unknown): payload is Record<string, unknown> {
  return typeof payload === 'object' && payload !== null;
}

function createStorageFromWebStorage(webStorage: globalThis.Storage) {
  return <T>(key: string, defaultValue: T): IStorage<T> => {
    let value = JSONParse<T>(webStorage.getItem(key) || '', defaultValue);
    return {
      key,
      get: <K extends keyof T>(prop?: K, fallback?: T[K]) => {
        if (typeof prop === 'undefined') {
          return value;
        }

        if (isObject(value)) {
          return (value[prop] as any) ?? fallback;
        }

        throw new Error(`value is not an object`);
      },
      set: (prop, newValue) => {
        value[prop] = newValue;
        webStorage.setItem(key, JSON.stringify(value));
      },
      save(newValue) {
        value = newValue;
        webStorage.setItem(key, JSON.stringify(value));
      },
      remove: prop => {
        delete value[prop];
        webStorage.setItem(key, JSON.stringify(value));
      },
      clear: () => {
        webStorage.removeItem(key);
      }
    };
  };
}

function createStorageFromStorage(storage: IStorage<Record<string, any>>) {
  return <T>(key: string, defaultValue: T): IStorage<T> => {
    let value = (storage.get(key) ||
      JSON.parse(JSON.stringify(defaultValue))) as T;
    return {
      key,
      get: <K extends keyof T>(prop?: K, fallback?: T[K]) => {
        if (typeof prop === 'undefined') {
          return value as T;
        }

        if (isObject(value)) {
          return (value[prop] as any) ?? fallback;
        }

        throw new Error(`value is not an object`);
      },
      set: (prop, newValue) => {
        value[prop] = newValue;
        storage.set(key, value);
      },
      save(newValue) {
        value = newValue;
        storage.set(key, value);
      },
      remove: prop => {
        delete value[prop];
        storage.set(key, value);
      },
      clear: () => {
        storage.remove(key);
      }
    };
  };
}

export function storageSupport() {
  const key = 'TEST_STORAGE';
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, key);
      localStorage.removeItem(key);
      return true;
    }
  } catch (e) {}

  return false;
}

export const createLocalStorage = storageSupport()
  ? createStorageFromWebStorage(localStorage)
  : createMemoryStorage;

export const createSessionStorage = storageSupport()
  ? createStorageFromWebStorage(sessionStorage)
  : createMemoryStorage;

const createTaisiusyutStorage = createStorageFromStorage(
  createLocalStorage('taisiusyut', {} as Record<string, any>)
);

export const createAdminStorage = createStorageFromStorage(
  createTaisiusyutStorage('admin', {} as Record<string, any>)
);

// admin
export const createChapterSotrage = createStorageFromStorage(
  createAdminStorage('chapter', {} as Record<string, any>)
);

export const createClientStorage = createStorageFromStorage(
  createTaisiusyutStorage('client', {} as Record<string, any>)
);

export const lastVisitStorage = createClientStorage(
  'lasvisit',
  {} as Record<string, number>
);
