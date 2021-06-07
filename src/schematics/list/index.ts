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
import { WorkspaceDefinition } from '@angular-devkit/core/src/workspace';
import {
  addDeclarationToNgModule,
  addDeclarationToRoutingModule, addModuleDeclarationToNgModule, importModulesToNgModule,
  updateIndexFile
} from '../../utils/ng-module-utils';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { ExpansionType } from '../../utils/models/expansion-type';
import { buildRelativePathForService, getComponentPath } from '../../utils/build-correct-path';
import { ListOptions } from './schema';
import { Config } from './config';
import { getServiceClassName } from '../../utils/get-service-class-name';
import { addDeclarationToModule } from '../../utils/ast-utils';


export function getWorkspacePath(host: Tree): string {
  const possibleFiles = ['/angular.json', '/.angular.json'];
  return possibleFiles.filter(path => host.exists(path))[0];
}

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
export function create(options: ListOptions): Rule {
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
    config.titledCreateComponent = config.titledCreateComponent || false;

    config.type = config.routableComponent === 'true' || config.routableComponent === true
      ? 'view'
      : 'component';

    config.componentPath = getComponentPath(options.path, options.routableComponent);

    config.serviceName = getServiceClassName(tree, config.servicePath + '/' + config.service) || '';

    config.relativeServicePath = buildRelativePathForService(config);

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
      includedModuleExports: config.includedModuleExports,
      singleModel: config.singleModel,
      pluralModel: config.pluralModel,
      secondLevel: true,
      titledComponent: config.titledCreateComponent,
      nestedPath: config.nestedPath,
      routableCreateComponent: config.routableCreateComponent,
    };


    switch (config.mode) {
      case 'full': {
        extrenalSchematics.push(
          schematic(
            'create-edit-page',
            childSchematicOptions
          )
        );
      } break;

      case 'dialog': {
        extrenalSchematics.push(
          schematic(
            'create-edit-dialog',
            childSchematicOptions
          )
        );
      } break;

      case 'dialog-create-page-edit': {
        extrenalSchematics.push(
          schematic(
            'create-edit-page',
            {
              ...childSchematicOptions,
              routableComponent: true,
              routableCreateComponent: true,
            }
          ),
          schematic(
            'create-edit-dialog',
            {
              ...childSchematicOptions,
              ...{ name: `${childSchematicOptions.name}-create` },
            }
          )
        );
      } break;
    }
    const isRoutingExists = tree.exists(config.routingModule);

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(config, config.includedModuleExports),
        importModulesToNgModule(config, [
          ['MatCardModule', '@angular/material/card'],
          ['FsListModule', '@firestitch/list'],
        ]),
        isRoutingExists && config.type === 'view' ? addDeclarationToRoutingModule(config) : noop(),
        updateIndexFile(config, ExpansionType.Component),
        ...extrenalSchematics,
      ])),
    ]);

    return rule(tree, _context);
  };
}

