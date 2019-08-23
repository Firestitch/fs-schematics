import { ModuleOptions } from '../../schematics-angular-utils/find-module';

export interface OptionsInterface extends ModuleOptions {
  subdirectory?: string;
  singleModel?: string;
  type?: string;
}
