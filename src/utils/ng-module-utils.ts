// Option A: Directly referencing the private APIs
// import { ModuleOptions, buildRelativePath } from "@schematics/angular/utility/find-module";
// import { Rule, Tree, SchematicsException } from "@angular-devkit/schematics";
// import { dasherize, classify } from "@angular-devkit/core";
// import { addDeclarationToModule, addExportToModule } from "@schematics/angular/utility/ast-utils";
// import { InsertChange } from "@schematics/angular/utility/change";
// Option B: Using a fork of the private APIs b/c they can change
import { Rule, Tree, SchematicsException } from '@angular-devkit/schematics';
import { AddToModuleContext } from './add-to-module-context';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';

const { dasherize, classify } = strings;

// Referencing forked and copied private APIs
import { ModuleOptions, buildRelativePath } from '../schematics-angular-utils/find-module';
import { addDeclarationToModule, addExportToModule } from '../schematics-angular-utils/ast-utils';
import { InsertChange } from '../schematics-angular-utils/change';

const stringUtils = { dasherize, classify };

export function addDeclarationToNgModule(options: ModuleOptions, exports: boolean): Rule {
  return (host: Tree) => {
    addDeclaration(host, options);
    if (exports) {
      addExport(host, options);
    }
    return host;
  };
}

function createAddToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {

  const result = new AddToModuleContext();

  if (!options.module) {
    throw new SchematicsException(`Module not found.`);
  }

  const text = host.read(options.module);

  if (text === null) {
    throw new SchematicsException(`File ${options.module} does not exist!`);
  }
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(options.module, sourceText, ts.ScriptTarget.Latest, true);

  let hasIndexExportsFile = false;

  host
    .getDir(`${options.path}/` + stringUtils.dasherize(options.name))
    .visit(filePath => {
      if (filePath.indexOf('index.ts') > -1) {
        const fileContent = host.read(filePath);

        if (fileContent && fileContent.indexOf(`${stringUtils.dasherize(options.name)}.component`)) {
          hasIndexExportsFile = true
        }
      }
    });

  let componentPath;

  if (hasIndexExportsFile) {
    componentPath = `${options.path}/`
      + stringUtils.dasherize(options.name);
  } else {
    componentPath = `${options.path}/`
      + stringUtils.dasherize(options.name) + '/'
      + stringUtils.dasherize(options.name)
      + '.component';
  }



  result.relativePath = buildRelativePath(options.module, componentPath);
  result.classifiedName = stringUtils.classify(`${options.name}Component`);

  return result;
}

function createAddSecondLevelToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {
  const result = createAddToModuleContext(host, options);

  result.classifiedName = stringUtils.classify(`${options.name} ${(options.parentName || '')}Component`);

  return result;

}

function addDeclaration(host: Tree, options: ModuleOptions) {

  // console.log('host', host);
  // console.log('options', options);
  const context = !options.secondLevel
    ? createAddToModuleContext(host, options)
    : createAddSecondLevelToModuleContext(host, options);
  // console.log('context', context);
  const modulePath = options.module || '';

  // console.log('source', context.source);
  // console.log('modulePath', modulePath);
  // console.log('context.classifiedName', context.classifiedName);
  // console.log('context.relativePath', context.relativePath);

  const declarationChanges = addDeclarationToModule(
    context.source,
    modulePath,
    context.classifiedName,
    context.relativePath
  );

  const declarationRecorder = host.beginUpdate(modulePath);
  for (const change of declarationChanges) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
}

function addExport(host: Tree, options: ModuleOptions) {
  const context = createAddToModuleContext(host, options);
  const modulePath = options.module || '';

  const exportChanges = addExportToModule(context.source,
    modulePath,
    context.classifiedName,
    context.relativePath);

  const exportRecorder = host.beginUpdate(modulePath);

  for (const change of exportChanges) {
    if (change instanceof InsertChange) {
      exportRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(exportRecorder);
}
