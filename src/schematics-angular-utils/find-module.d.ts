/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Path } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
export interface ModuleOptions {
    module?: string;
    routingModule?: string;
    name: string;
    parentName?: string;
    flat?: boolean;
    path?: string;
    skipImport?: boolean;
    secondLevel?: boolean;
    childRoute?: boolean;
    dialog?: boolean;
    mode?: string;
    singleName?: string;
    componentPath?: string;
    parentType?: string;
}
/**
 * Find the module referred by a set of options passed to the schematics.
 */
export declare function findModuleFromOptions(host: Tree, options: ModuleOptions, flag?: boolean): Path | undefined;
/**
 * Find the module referred by a set of options passed to the schematics.
 */
export declare function findRoutingModuleFromOptions(host: Tree, options: ModuleOptions, flag?: boolean): Path | undefined;
/**
 * Function to find the "closest" module to a generated file's path.
 */
export declare function findModule(host: Tree, generateDir: string): Path;
export declare function findAllModules(host: Tree, generateDir: string): any;
/**
 * Build a relative path from one file path to another file path.
 */
export declare function buildRelativePath(from: string, to: string): string;
