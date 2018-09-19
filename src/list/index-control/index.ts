import {
  apply,
  branchAndMerge,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree,
  url,
  template,
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';


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

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function create(options: any): Rule {

  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    options.module = `${options.path}/${options.module}`;

    const templateSource = apply(url('./files'), [
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('path', `${options.path}${options.subdirectory}` )},
      move(`${options.path}${options.subdirectory}`)
    ]);

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
      ]))
    ]);

    return rule(tree, _context);
  };
}
