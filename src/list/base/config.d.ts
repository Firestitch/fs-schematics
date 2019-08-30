import { Schema } from './schema';

export interface Config extends Schema {
  dialog?: boolean;
  componentPath?: string;
  project?: string;
  type?: string;
  routingModule?: string;
  routableComponent?: boolean | string;
}
