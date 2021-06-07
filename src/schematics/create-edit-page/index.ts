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
  SchematicsException,
  Tree,
  noop,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import {
  addDeclarationToNgModule,
  addDeclarationToRoutingModule,
  importModulesToNgModule,
  updateIndexFile
} from '../../utils/ng-module-utils';
import { findModuleFromOptions } from '../../utils/find-module';
import { ExpansionType } from '../../utils/models/expansion-type';
import {
  buildRelativePathForService,
  getComponentPath,
} from '../../utils/build-correct-path';
import { getWorkspacePath } from '../../utils/get-workspace-path';
import { getServiceClassName } from '../../utils/get-service-class-name';
import { addResolverSchematic } from '../../utils/add-resolver-schematic';


export function getWorkspace(host: Tree): WorkspaceDefinition {
  const path = getWorkspacePath(host);
  const configBuffer = host.read(path);
  if (configBuffer === null) {
    throw new SchematicsException(`Could not find (${path})`);
  }
  const config = configBuffer.toString();

  return JSON.parse(config);
}

function filterTemplates(options: any): Rule {
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

    options.module = findModuleFromOptions(tree, options, true);
    options.routingModule = options.module.replace('.module.ts', '-routing.module.ts');
    options.isRouting = tree.exists(options.routingModule);

    options.type = options.routableComponent === 'true' || options.routableComponent === true
      ? 'view'
      : 'component';

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

    const templateSource = apply(url('./files'), [
      filterTemplates(options),
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('path', options.componentPath )},
      move(options.componentPath)
    ]);

    const routable = options.routableCreateComponent === 'true' || options.routableCreateComponent === true;

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(options, !!options.includedModuleExports),
        importModulesToNgModule(options, [
          ['FormsModule', '@angular/forms'],
          ['MatCardModule', '@angular/material/card'],
          ['MatButtonModule', '@angular/material/button'],
          ['MatInputModule', '@angular/material/input'],
          ['FsFormModule', '@firestitch/form'],
          ['FsSkeletonModule', '@firestitch/skeleton'],
          ['FlexLayoutModule', '@angular/flex-layout'],
        ]),
        options.isRouting && options.type === 'view' ? addDeclarationToRoutingModule(options) : noop(),
        updateIndexFile(options, ExpansionType.Component),
        routable ? addResolverSchematic(options) : noop(),
      ]))
    ]);


    return rule(tree, _context);
  };
}
