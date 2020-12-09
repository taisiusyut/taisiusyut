declare module 'mongoose' {
  export interface AutopopulateOpts {
    select?: any;
    maxDepth?: number;
  }

  export type AutopopulateOptsFn = () => AutopopulateOpts;

  interface SchemaTypeOpts {
    autopopulate?: boolean | AutopopulateOpts | AutopopulateOptsFn;
  }
}
