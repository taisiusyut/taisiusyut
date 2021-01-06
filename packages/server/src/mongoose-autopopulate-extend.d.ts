declare module 'mongoose' {
  export interface AutopopulateOpts extends Partial<ModelPopulateOptions> {
    maxDepth?: number;
  }

  export type AutopopulateOptsFn = () => AutopopulateOpts;

  interface SchemaTypeOpts {
    autopopulate?: boolean | AutopopulateOpts | AutopopulateOptsFn;
  }
}
