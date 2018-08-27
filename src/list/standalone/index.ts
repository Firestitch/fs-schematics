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
  externalSchematic
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { parseName } from '../../utils/parse-name';
import { addDeclarationToNgModule, addDeclarationToRoutingModule } from '../../utils/ng-module-utils';
import {
  findModuleFromOptions,
  findRoutingModuleFromOptions
} from '../../schematics-angular-utils/find-module';


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

    options.routingModule = options.module.replace('.module.ts', '-routing.module.ts');

    options.module = `${options.path}/${options.module}`;
    options.routingModule = `${options.path}/${options.routingModule}`;

    // const parsedPath = parseName(options.path, options.name);
    // options.name = parsedPath.name;
    // options.path = parsedPath.path;

    options.create = options.create || false;
    options.edit = options.edit || false;

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

    const createOptions = {
      project: options.project,
      path: `${options.path}/${options.name}`,
      module: options.module,
      parentName: options.name,
      secondLevel: true
    };

    if (options.edit || options.create) {

      if (options.create && !options.dialog) {
        extrenalSchematics.push(
          externalSchematic('@firestitch/schematics', 'list-create-edit', Object.assign({
            childName: 'create',
            }, createOptions)
          )
        )
      }

      if (options.edit && !options.dialog) {
        extrenalSchematics.push(
          externalSchematic('@firestitch/schematics', 'list-create-edit', Object.assign({
              childName: 'edit',
            }, createOptions)
          )
        );
      }
    }

    if (options.dialog && options.singleName) {
      extrenalSchematics.push(
        externalSchematic('@firestitch/schematics', 'list-create-edit-dialog', Object.assign({
            childName: options.singleName,
          }, createOptions)
        )
      );
    }

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(options, false),
        addDeclarationToRoutingModule(options),
        ...extrenalSchematics,
      ]))
    ]);


    return rule(tree, _context);
  };
}
