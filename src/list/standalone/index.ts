import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  schematic,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import {
  addDeclarationToNgModule,
  addDeclarationToRoutingModule,
  updateIndexFile
} from '../../utils/ng-module-utils';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { ExpansionType } from '../../utils/models/expansion-type';
import { buildRelativePathForService, getComponentPath } from '../../utils/build-correct-path';
import { ListOptions } from './schema';
import { Config } from './config';
import { getServiceClassName } from '../../utils/get-service-class-name';


export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  return possibleFiles.filter(path => host.exists(path))[0];
}

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
export function list(options: ListOptions): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    const config: Config = { ...options };

    if (!config.project) {
      config.project = Object.keys(workspace.projects)[0];
    }

    config.routingModule = config.module.replace('.module.ts', '-routing.module.ts');

    if (config.dialog === void 0) {
      config.dialog = false;
    }

    config.module = `${config.path}/${config.module}`;
    config.routingModule = `${config.path}/${config.routingModule}`;
    config.mode = config.mode || null;

    config.create = config.create || false;
    config.edit = config.edit || false;

    config.componentPath = getComponentPath(tree, config).path;

    config.serviceName = getServiceClassName(tree, config.servicePath + '/' + config.service) || '';

    config.relativeServicePath = buildRelativePathForService(config);
    config.service = config.service.replace('.service.ts', '');

    const templateSource = apply(url('./files'), [
      filterTemplates(config),
      template({
        ...strings,
        ...config
      }),
      () => {
        console.debug('path', config.componentPath)
      },
      move(config.componentPath)
    ]);

    const extrenalSchematics: any = [];

    const childSchematicOptions = {
      project: config.project,
      path: config.path,
      module: config.module,
      mode: config.mode,
      name: config.singleName,
      parentType: config.type,
      service: config.service,
      servicePath: config.servicePath,
      serviceName: config.serviceName,
      parentName: dasherize(config.name),
      relativeServicePath: config.relativeServicePath,
      singleModel: config.singleModel,
      pluralModel: config.pluralModel,
      secondLevel: true,
      nestedPath: config.nestedPath,
    };


    if (config.mode === 'full') {
      extrenalSchematics.push(
        schematic(
          'list-create',
          childSchematicOptions
        )
      )
    } else if (config.mode === 'dialog') {
      extrenalSchematics.push(
        schematic(
          'list-create-dialog',
          childSchematicOptions
        ));
    }

    const isRoutingExists = tree.exists(config.routingModule);
    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(config, false),
        isRoutingExists && config.type === 'view' ? addDeclarationToRoutingModule(config) : noop(),
        updateIndexFile(config, ExpansionType.Component),
        ...extrenalSchematics,
      ])),
    ]);

    return rule(tree, _context);
  };
}

