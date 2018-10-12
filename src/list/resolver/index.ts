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
  externalSchematic,
  DirEntry
} from '@angular-devkit/schematics';
import {strings} from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import {addResolverToNgModule} from '../../utils/ng-module-utils';
import {buildRelativePath} from '../../schematics-angular-utils/find-module';
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
  if (!options.menuService) {
    return filter(path => !path.match(/\.service\.ts$/) && !path.match(/\.bak$/));
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

    options.routingModule = options.module.replace('.module.ts', '-routing.module.ts');
    options.relativeServicePath = buildRelativePathForService(options);
    options.path = `${options.path}/shared/resolves/`;

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('path', options.path )},
      move(options.path)
    ]);


    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addResolverToNgModule(options),
      ]))
    ]);

    return rule(tree, _context);
  };
}

function buildRelativePathForService(options) {
  const resolverFile = `${options.path}/shared/resolves/${dasherize(options.name)}.resolve.ts`;
  const serviceFile =  `${options.servicePath}/${options.service}`;

  return buildRelativePath(resolverFile, serviceFile).replace('.ts', '');
}
