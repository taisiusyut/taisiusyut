declare module 'mongoose' {
  interface PaginateOptions {
    projection?: Record<string, any>;
  }

  // eslint-disable-next-line
  interface Model<T extends Document> {
    toJSON(): Record<string, unknown>;
  }

  interface SchemaType {
    discriminator<U extends Document>(name: string, schema: Schema): Model<U>;
  }
}
