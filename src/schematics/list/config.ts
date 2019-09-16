import { ListOptions } from './schema';

export interface Config extends ListOptions {
  dialog?: boolean;
  componentPath?: string;
  project?: string;
  type?: string;
  routingModule?: string;
  relativeServicePath?: string;
  service?: string;
  serviceName?: string;
  nestedPath?: string;
  titledCreateComponent?: boolean;
  includedModuleExports?: boolean;
}
