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
  schematic,
} from '@angular-devkit/schematics';
import { strings} from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { addDeclarationToNgModule, addDeclarationToRoutingModule, updateIndexFile } from '../../utils/ng-module-utils';
import { findModuleFromOptions } from '../../schematics-angular-utils/find-module';
import { ExpansionType } from '../../utils/models/expansion-type';
import {
  buildRelativePathForService,
  getComponentPath,
} from '../../utils/build-correct-path';
import { getWorkspacePath } from '../../utils/get-workspace-path';
import { getServiceClassName } from '../../utils/get-service-class-name';


export function getWorkspace(host: Tree): WorkspaceSchema {
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
export function createOrEdit(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    options.module = findModuleFromOptions(tree, options, true);
    options.routingModule = options.module.replace('.module.ts', '-routing.module.ts');
    options.isRouting = tree.exists(options.routingModule);

    options.componentPath = getComponentPath(tree, options).path;

    if (options.parentName) {
      options.componentPath = `${options.componentPath}/${options.parentName}`;
    }

    if (!options.serviceName) {
      options.serviceName = getServiceClassName(tree, options.servicePath + '/' + options.service);
    }

    if (!options.relativeServicePath) {
      options.relativeServicePath = buildRelativePathForService(options);
      options.service = options.service.replace('.service.ts', '');
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

    const externalSchematics: any = [];

    const childSchematicOptions = {
      project: options.project,
      path: options.path,
      module: options.module,
      name: options.name,
      service: options.service,
      servicePath: options.servicePath,
    };


    if (options.isRouting) {
      // externalSchematics.push(
      //   schematic(
      //     'resolver',
      //     childSchematicOptions
      //   )
      // );
    }

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(options, false),
        options.isRouting ? addDeclarationToRoutingModule(options) : noop(),
        updateIndexFile(options, ExpansionType.Component),
        ...externalSchematics,
      ]))
    ]);


    return rule(tree, _context);
  };
}
