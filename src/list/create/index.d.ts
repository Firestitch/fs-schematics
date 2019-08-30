import { Rule, Tree } from '@angular-devkit/schematics';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
export declare function getWorkspace(host: Tree): WorkspaceSchema;
export declare function createOrEdit(options: any): Rule;
