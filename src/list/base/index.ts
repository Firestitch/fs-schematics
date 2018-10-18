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
  template, noop,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { addDeclarationToNgModule, addDeclarationToRoutingModule, updateIndexFile } from '../../utils/ng-module-utils';
import { ExpansionType } from '../../utils/models/expansion-type';


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
export function base(options: any): Rule {
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

    const componentPosition = getComponentPosition(tree, options);
    const indexFileExists = tree.exists(`${options.path}/index.ts`);
    options.path = componentPosition.path;

    const templateSource = apply(url('./files'), [
      filterTemplates(options),
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('path', options.path )},
      move(options.path)
    ]);

    const isRoutingExists = tree.exists(options.routingModule);
    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(options, false),
        isRoutingExists ? addDeclarationToRoutingModule(options) : noop(),
        indexFileExists ? updateIndexFile(options, ExpansionType.Component) : noop(),
      ]))
    ]);

    return rule(tree, _context);
  };
}

function getComponentPosition(tree: Tree, options): { path: string } {
  const dir = tree.getDir(`${options.path}`);
  const isComponentFolderExists = (dir.subdirs as string[]).indexOf('components') !== -1;

  const path = options.path + ( isComponentFolderExists ? '/components' : '');

  return { path };
}
