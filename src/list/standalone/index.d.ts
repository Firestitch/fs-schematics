import { Rule, Tree } from '@angular-devkit/schematics';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { ListOptions } from './schema';
export declare function getWorkspacePath(host: Tree): string;
export declare function getWorkspace(host: Tree): WorkspaceSchema;
export declare function list(options: ListOptions): Rule;
