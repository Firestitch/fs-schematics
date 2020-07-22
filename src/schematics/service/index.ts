import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  Rule,
  SchematicContext,
  Tree,
  url,
  template,
  DirEntry, noop
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { addServiceProviderToNgModule, updateIndexFile} from '../../utils/ng-module-utils';
import { ExpansionType } from '../../utils/models/expansion-type';
import { getWorkspace } from '../../utils/get-workspace';
import { camelCase } from 'lodash';


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
    options.componentPath = `${options.path}${options.subdirectory}`;
    const subDir: DirEntry | null = tree.getDir(options.componentPath);
    const indexFileExists = tree.exists(`${subDir.path}/index.ts`);

    const workspace = getWorkspace(tree);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    options.lowercasePluralName = options.pluralName.toLowerCase();
    options.camelCaseName = camelCase(options.name);
    options.plualCamelCaseName = camelCase(options.pluralName);
    options.module = `${options.path}/${options.module}`;
    options.path = `${options.path}${options.subdirectory}`;

    if (options.subdirectory === '/services') {
      options.type = 'service';
    } else {
      options.type = 'data';
    }

    const templateSource = apply(url('./files'), [
      filterTemplates(options),
      indexFileExists ? filter(path => path.indexOf('index.ts') === -1) : noop(),
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('path', subDir.path )},
      move(subDir.path)
    ]);

    const expansionType = options.type === 'service' ? ExpansionType.Service : ExpansionType.Data;

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        options.type === 'service' ? addServiceProviderToNgModule(options) : noop(),
        indexFileExists ? updateIndexFile(options, expansionType) : noop(),
      ]))
    ]);

    return rule(tree, _context);
  };
}
