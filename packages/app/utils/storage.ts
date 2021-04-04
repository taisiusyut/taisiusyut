import AsyncStorage from '@react-native-async-storage/async-storage';
import { JSONParse } from '@taisiusyut/common/utils/JSONParse';

export interface IStorage<T> {
  key: string;
  get(): Promise<T>;
  get<K extends keyof T>(prop: K, fallback: T[K]): Promise<T[K]>;
  get<K extends keyof T>(
    prop: K
  ): Promise<T[K] extends undefined ? T[K] | undefined : T[K]>;
  get<K extends keyof T>(prop?: K): Promise<T | T[K]>;
  set<K extends keyof T>(prop: K, value: T[K]): Promise<void>;
  remove: <K extends keyof T = any>(key: K) => Promise<void>;
  clear: () => Promise<void>;
}

function isObject(payload: unknown): payload is Record<string, unknown> {
  return typeof payload === 'object' && payload !== null;
}

export function createStorage<T>(key: string, defaultValue: T): IStorage<T> {
  return {
    key,
    async get<K extends keyof T>(prop?: K, fallback?: T[K]) {
      const raw = await AsyncStorage.getItem(key);
      const value = JSONParse<T>(raw || '', defaultValue);

      if (typeof prop === 'undefined') {
        return value as T;
      }

      if (isObject(value)) {
        return (value[prop] as any) ?? fallback;
      }

      throw new Error(`value is not an object`);
    },
    async set(prop, newValue) {
      AsyncStorage.mergeItem(key, JSON.stringify({ [prop]: newValue }));
    },
    async remove(prop) {
      const value = await this.get();
      delete value[prop];
      AsyncStorage.setItem(key, JSON.stringify(value));
    },
    async clear() {
      AsyncStorage.removeItem(key);
    }
  };
}
