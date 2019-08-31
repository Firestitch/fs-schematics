import { Schema } from './schema';

export interface Config extends Schema {
  project?: string;
  enums: any;
  componentPath: string;
  enumName?: string;
  relativeEnumPath: string;
}
