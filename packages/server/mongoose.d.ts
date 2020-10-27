declare module 'mongoose' {
  interface PaginateOptions {
    projection?: Record<string, any>;
  }

  type MongooseFuzzySearchingField<T = any> =
    | keyof T
    | {
        name: keyof T;
        minSize?: number;
        weight?: number;
        prefixOnly?: boolean;
        escapeSpecialCharacters?: boolean;
        keys?: (string | number)[];
      };

  interface MongooseFuzzySearchingMiddlewares<T = unknown> {
    preSave(this: Query<T>): void;
    preInsertMany(this: Query<T>): Promise<void>;
    preUpdate(this: Query<T>): Promise<void>;
    preUpdateOne(): Promise<void>;
    preFindOneAndUpdate(this: Query<T>): Promise<void>;
    preUpdateMany(this: Query<T>): Promise<void>;
  }

  interface MongooseFuzzySearchingOptions<T extends Record<string, unknown>> {
    fields?: MongooseFuzzySearchingField<T>[];
    middlewares?: MongooseFuzzySearchingMiddlewares<T>;
  }

  interface MongooseFuzzySearchingParams {
    query: string;
    minSize?: string;
    prefixOnly?: boolean;
    exact?: boolean;
  }

  interface Model<T extends Document> {
    fuzzySearch(query: string | MongooseFuzzySearchingParams): Promise<T[]>;
  }
}

declare module 'mongoose-fuzzy-searching';

declare module 'mongoose-fuzzy-searching/helpers' {
  export function nGrams(
    query: string,
    escapeSpecialCharacters: boolean,
    defaultNgamMinSize: number,
    checkPrefixOnly: boolean
  ): string[];
}
