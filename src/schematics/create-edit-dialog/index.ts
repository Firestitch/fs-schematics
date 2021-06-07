import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  url,
  template,
  Rule,
  SchematicContext,
  Tree, noop,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';

import {
  addDeclarationToNgModule,
  addDialogToParentComponent, importModulesToNgModule,
  updateIndexFile,
} from '../../utils/ng-module-utils';

import { findModuleFromOptions } from '../../utils/find-module';

import {ExpansionType} from '../../utils/models/expansion-type';

import {
  buildRelativePathForService,
  getComponentPath,
} from '../../utils/build-correct-path';
import { getWorkspace } from '../../utils/get-workspace';
import { getServiceClassName } from '../../utils/get-service-class-name';
import { addResolverSchematic } from '../../utils/add-resolver-schematic';
import { startCase } from 'lodash';


function filterTemplates(options: any): Rule {
  /*if (!options.menuService) {
    return filter(path => !path.match(/\.service\.ts$/) && !path.match(/-item\.ts$/) && !path.match(/\.bak$/));
  }*/
  if (!options.create) {
    return filter(path => !path.match(/\.bak$/) && !path.match(/create\/.+\.(ts|html)$/));
  }

  if (!options.edit) {
    return filter(path => !path.match(/\.bak$/) && !path.match(/edit\/.+\.(ts|html)$/));
  }

  return filter(path => !path.match(/\.bak$/));
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function create(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);

    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    options.startCase = startCase;
    options.module = findModuleFromOptions(tree, options, true);
    options.routingModule = options.module.replace('.module.ts', '-routing.module.ts');

    options.componentPath = getComponentPath(options.path, options.routableCreateComponent);

    // if (options.parentName) {
    //   options.componentPath = `${options.componentPath}/${options.parentName}`;
    // }

    if (!options.serviceName) {
      options.serviceName = getServiceClassName(tree, options.servicePath + '/' + options.service);
    }

    if (!options.relativeServicePath) {
      options.relativeServicePath = buildRelativePathForService(options);
    }


    // When we are do generate Component name for insert into module declaration
    // we must do it without parent component name
    // but in case of route we must have this parameter for related route matching
    const customOptions = Object.assign({}, options);
    delete customOptions.parentName;

    const templateSource = apply(url('./files'), [
      filterTemplates(options),
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('Move to path', options.componentPath )},
      move(options.componentPath)
    ]);

    const addToParent = options.parentName && options.parentType && options.parentType !== 'none';
    const routable = options.routableCreateComponent === 'true' || options.routableCreateComponent === true;

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(customOptions, !!options.includedModuleExports),
        importModulesToNgModule(customOptions, [
          ['FormsModule', '@angular/forms'],
          ['MatDialogModule', '@angular/material/dialog'],
          ['FlexLayoutModule', '@angular/flex-layout'],
          ['MatButtonModule', '@angular/material/button'],
          ['FsListModule', '@firestitch/list'],
          ['FsDialogModule', '@firestitch/dialog'],
          ['FsFormModule', '@firestitch/form'],
          ['FsSkeletonModule', '@firestitch/skeleton'],
        ]),
        addToParent ? addDialogToParentComponent(options) : noop(),
        updateIndexFile(options, ExpansionType.Component),
        routable ? addResolverSchematic(options) : noop(),
      ]))
    ]);

    return rule(tree, _context);
  };
}

