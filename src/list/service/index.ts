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
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { addProviderToNgModule } from '../../utils/ng-module-utils';

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
    const serviceRe = /\.service\.ts$/;
    const subDir: DirEntry | null = tree.getDir(`${options.path}${options.subdirectory}`);

    const workspace = getWorkspace(tree);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    options.module = `${options.path}/${options.module}`;
    options.path = `${options.path}${options.subdirectory}`;

    const templateSource = apply(url('./files'), [
      filterTemplates(options),
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('path', subDir.path )},
      move(subDir.path)
    ]);

    const extrenalSchematics: any = [];

    tree
      .getDir(subDir.path)
      .visit(filePath => {
        if (filePath.indexOf('index.ts') > -1) {
          tree.delete(`${subDir.path}/index.ts`);
        }
      });

    const files = subDir.subfiles.filter(p => serviceRe.test(p)) || [];
    files.push((`${options.name}.service.ts` as any));

    const childSchematicOptions = {
      project: options.project,
      path: options.path,
      module: options.module,
      subdirectory: options.subdirectory,
      files
    };

    extrenalSchematics.push(
      externalSchematic(
        '@firestitch/schematics',
        'index-control',
        childSchematicOptions
      )
    );

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        ...extrenalSchematics,
        addProviderToNgModule(options),
      ]))
    ]);

    return rule(tree, _context);
  };
}
