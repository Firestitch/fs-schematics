/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as ts from 'typescript';
import { Change, InsertChange } from './change';
import { ModuleOptions } from './find-module';
/**
 * Add Import `import { symbolName } from fileName` if the import doesn't exit
 * already. Assumes fileToEdit can be resolved and accessed.
 * @param fileToEdit (file we want to add import to)
 * @param symbolName (item to import)
 * @param fileName (path to the file)
 * @param isDefault (if true, import follows style for importing default exports)
 * @param existingChagnes
 * @return Change
 */
export declare function insertImport(source: ts.SourceFile, fileToEdit: string, symbolName: string, fileName: string, isDefault?: boolean, existingChagnes?: InsertChange[]): Change;
/**
 *
 * @param obj
 * @param url
 * @param componentName
 * @param {boolean} check
 * @returns {boolean}
 */
export declare function checkIfRouteExists(obj: any, url: any, componentName: any, check?: boolean): boolean;
export declare function addRouteModuleToModuleImports(source: any, ngModulePath: any): any;
export declare function addRoutesArrayDeclaration(source: ts.SourceFile, ngModulePath: string, componentName: string, importPath: string | null, options: ModuleOptions): any;
export declare function addRouteToExistingRoutes(source: ts.SourceFile, routesArrayNode: any, ngModulePath: string, componentName: string, importPath: string | null, options: ModuleOptions): any;
