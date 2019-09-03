export interface ListOptions {
  name: string;
  create: boolean;
  edit: boolean;
  ordering: boolean;
  dialog?: boolean;
  module?: string;
  mode?: string;
  path?: string;
  singleModel?: string;
  pluralModel?: string;
  servicePath?: string;
  singleName?: string;
  routableComponent?: string | boolean;
  routableCreateComponent?: string | boolean
  titledComponent?: boolean;
}
