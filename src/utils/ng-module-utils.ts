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
import {normalize, strings} from '@angular-devkit/core';

const { dasherize, classify } = strings;

// Referencing forked and copied private APIs
import { ModuleOptions, buildRelativePath } from '../schematics-angular-utils/find-module';
import {
  addDeclarationToModule, addDialogToComponentMetadata, addEntryComponentToModule,
  addExportToModule, addSymbolToNgModuleRoutingMetadata, addProviderToModule, addImportToModule
} from '../schematics-angular-utils/ast-utils';
import { InsertChange } from '../schematics-angular-utils/change';
import { OptionsInterface } from './interfaces/';
import {insertImport} from '../schematics-angular-utils/route-utils';

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

export function addModuleDeclarationToNgModule(options: ModuleOptions): Rule {
  return (host: Tree) => {
    addModuleDeclaration(host, options);
    return host;
  }
}

export function addEntryComponentDeclarationToNgModule(options: ModuleOptions, exports: boolean): Rule {
  return (host: Tree) => {
    addEntryComponentDeclaration(host, options);
    return host;
  };
}

export function addDeclarationToRoutingModule(options: ModuleOptions): Rule {
  return (host: Tree) => {
    addRoutingDeclaration(host, options);
    return host;
  };
}

export function addProviderToNgModule(options: OptionsInterface): Rule {
  return (host: Tree) => {
    addServiceDeclaration(host, options);
    return host;
  }
}

export function addDialogToParentComponent(options: ModuleOptions): Rule {
  return (host: Tree) => {
    addDialogToComponent(host, options);
    return host;
  };
}

export function addResolverToNgModule(options: ModuleOptions): Rule {
  return (host: Tree) => {
    addResolverDeclaration(host, options);
    return host;
  }
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

function createServiceToModuleContext(host: Tree, options: OptionsInterface): AddToModuleContext {
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
    .getDir(`${options.path}`)
    .visit(filePath => {
      if (filePath.indexOf('index.ts') > -1) {
        const fileContent = host.read(filePath);
        if (fileContent && fileContent.indexOf(`${stringUtils.dasherize(options.name)}.service`)) {
          hasIndexExportsFile = true
        }
      }
    });

  let componentPath;
  // @todo !!!
  // if (hasIndexExportsFile) {
    componentPath = `${options.path}/`;
  // } else {
  //   componentPath = `${options.path}${options.subdirectory}/`
  //     + stringUtils.dasherize(options.name)
  //     + '.service';
  // }

  result.relativePath = buildRelativePath(`${options.module}`, componentPath);
  result.classifiedName = stringUtils.classify(`${options.name}Service`);

  return result;
}

function createResolverToModuleContext(host: Tree, options: ModuleOptions) {
  if (!options.routingModule) {
    throw new SchematicsException(`RoutingModule not found.`);
  }

  const result = new AddToModuleContext();

  const text = host.read(options.routingModule);

  if (text === null) {
    throw new SchematicsException(`File ${options.routingModule} does not exist!`);
  }
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(options.routingModule, sourceText, ts.ScriptTarget.Latest, true);

  const resolverPath = options.path + stringUtils.dasherize(options.name) + '.resolve';
  result.relativePath = buildRelativePath(options.module || '', resolverPath);
  result.classifiedName = stringUtils.classify(`${options.name}Resolve`);
  return result;
}

function readTest(host: Tree, options: ModuleOptions) {
  if (!options.routingModule) {
    throw new SchematicsException(`RoutingModule not found.`);
  }

  const result = new AddToModuleContext();

  const text = host.read(options.routingModule);

  if (text === null) {
    throw new SchematicsException(`File ${options.routingModule} does not exist!`);
  }
  const sourceText = text.toString('utf-8');
  result.source = ts.createSourceFile(options.routingModule, sourceText, ts.ScriptTarget.Latest, true);

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



  result.relativePath = buildRelativePath(options.module || '', componentPath);
  result.classifiedName = stringUtils.classify(`${options.name}Component`);
  // if (options.secondLevel && !options.dialog) {
  //   result.classifiedName = stringUtils.classify(`${options.name} ${(options.parentName || '')}Component`);
  // } else {
  //   result.classifiedName = stringUtils.classify(`${options.name}Component`);
  // }

  return result;
}

function createAddSecondLevelToModuleContext(host: Tree, options: ModuleOptions): AddToModuleContext {
  const result = createAddToModuleContext(host, options);

  result.classifiedName = stringUtils.classify(`${options.name} Component`);

  return result;

}

function addDeclaration(host: Tree, options: ModuleOptions) {
  const context = !options.secondLevel
    ? createAddToModuleContext(host, options)
    : createAddSecondLevelToModuleContext(host, options);

  const modulePath = options.module || '';

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

function addEntryComponentDeclaration(host: Tree, options: ModuleOptions) {
  const context = !options.secondLevel
    ? createAddToModuleContext(host, options)
    : createAddSecondLevelToModuleContext(host, options);

  const modulePath = options.module || '';

  const declarationChanges = addEntryComponentToModule(
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

function addServiceDeclaration(host: Tree, options: OptionsInterface) {
  const context = createServiceToModuleContext(host, options);
  const modulePath = options.module || '';

  const declarationChanges = addProviderToModule(
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

function addResolverDeclaration(host: Tree, options: OptionsInterface) {
  const context = createResolverToModuleContext(host, options);

  const routingModulePath = options.routingModule || '';

  const declarationChanges = [insertImport(
    context.source,
    routingModulePath,
    context.classifiedName,
    context.relativePath,
    false
  )];

  if (routingModulePath) {
    const declarationRecorder = host.beginUpdate(routingModulePath);
    for (const change of declarationChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);
  }
}

function addModuleDeclaration(host: Tree, options: ModuleOptions) {
  const modulePath = options.path + '/' + options.module;

  const text = host.read(modulePath);
  if (text === null) {
    throw new SchematicsException(`File ${modulePath} does not exist.`);
  }
  const sourceText = text.toString('utf-8');
  const source = ts.createSourceFile(modulePath, sourceText, ts.ScriptTarget.Latest, true);

  const importModulePath = normalize(
    `/${options.path}/`
    + strings.dasherize(options.name) + '/'
    + strings.dasherize(options.name)
    + '.module',
  );

  const relativePath = buildRelativePath(modulePath, importModulePath);
  const changes = addImportToModule(source,
    modulePath,
    strings.classify(`${options.name}Module`),
    relativePath);

  const recorder = host.beginUpdate(modulePath);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      recorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(recorder);
}

function addDialogToComponent(host: Tree, options: ModuleOptions) {
  const componentFullPath = `${options.path}/${options.parentName}.component.ts`;

  const text = host.read(componentFullPath);

  if (text === null) {
    throw new SchematicsException(`File ${componentFullPath} does not exist!`);
  }
  const sourceText = text.toString('utf-8');
  const source = ts.createSourceFile(componentFullPath, sourceText, ts.ScriptTarget.Latest, true);


  const changes = addDialogToComponentMetadata(
    source,
    componentFullPath,
    options.parentName || '',
    options.singleName || options.name || '');

  const declarationRecorder = host.beginUpdate(componentFullPath);
  for (const change of changes) {
    if (change instanceof InsertChange) {
      declarationRecorder.insertLeft(change.pos, change.toAdd);
    }
  }
  host.commitUpdate(declarationRecorder);
}

function addRoutingDeclaration(host: Tree, options: ModuleOptions) {
  const context = readTest(host, options);

  const routingChanges = addSymbolToNgModuleRoutingMetadata(
    context.source,
    options.routingModule || '',
    context.classifiedName,
    context.relativePath,
    options
  );

  if (options.routingModule) {
    const declarationRecorder = host.beginUpdate(options.routingModule);
    for (const change of routingChanges) {
      if (change instanceof InsertChange) {
        declarationRecorder.insertLeft(change.pos, change.toAdd);
      }
    }
    host.commitUpdate(declarationRecorder);
  }
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

