import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
  template,
  externalSchematic, noop
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { parseName } from '../../utils/parse-name';
import { addDeclarationToNgModule, addDeclarationToRoutingModule } from '../../utils/ng-module-utils';
import {
  buildRelativePath,
  findModuleFromOptions,
  findRoutingModuleFromOptions
} from '../../schematics-angular-utils/find-module';
import {dasherize} from '@angular-devkit/core/src/utils/strings';


export function getWorkspacePath(host: Tree): string {
  const possibleFiles = [ '/angular.json', '/.angular.json' ];
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
export function list(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    if (options.dialog === void 0) {
      options.dialog = false;
    }

    options.routingModule = options.module.replace('.module.ts', '-routing.module.ts');

    options.module = `${options.path}/${options.module}`;
    options.routingModule = `${options.path}/${options.routingModule}`;
    options.mode = options.mode || false;
    // const parsedPath = parseName(options.path, options.name);
    // options.name = parsedPath.name;
    // options.path = parsedPath.path;
    options.create = options.create || false;
    options.edit = options.edit || false;

    options.servicePath = buildRelativePathForService(options);
    options.service = options.service.replace('.ts', '').replace('.', '-');

    const templateSource = apply(url('./files'), [
      filterTemplates(options),
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('path', options.path )},
      move(options.path)
    ]);

    const extrenalSchematics: any = [];

    const childSchematicOptions = {
      project: options.project,
      path: `${options.path}/${options.name}`,
      module: options.module,
      mode: options.mode,
      name: options.singleName,
      parentName: options.name,
      service: options.service,
      servicePath: '../' + options.servicePath,
      secondLevel: true,
    };

    if (options.mode === 'full') {
      extrenalSchematics.push(
        externalSchematic(
          '@firestitch/schematics',
          'list-create',
          childSchematicOptions
        )
      )
    } else if (options.mode === 'dialog') {
      extrenalSchematics.push(
        externalSchematic(
          '@firestitch/schematics',
          'list-create-dialog',
          childSchematicOptions
        ));
    }

    const isRoutingExists = tree.exists(options.routingModule);
    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(options, false),
        isRoutingExists ? addDeclarationToRoutingModule(options) : noop(),
        ...extrenalSchematics,
      ]))
    ]);

    return rule(tree, _context);
  };
}

function buildRelativePathForService(options) {
  return buildRelativePath(
    `${options.path}/${dasherize(options.name)}/${dasherize(options.name)}.component.ts`,
    `${options.servicePath}/${options.service}`
  ).replace('.ts', '');
}
