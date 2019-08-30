import * as ts from 'typescript';
import { Change, InsertChange } from '../schematics-angular-utils/change';
export declare function insertExport(source: ts.SourceFile, fileToEdit: string, symbolName: string, fileName: string, isDefault?: boolean, existingChanges?: InsertChange[]): Change;
