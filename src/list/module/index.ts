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
  noop
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { addModuleDeclarationToNgModule } from '../../utils/ng-module-utils';
import { getWorkspace } from '../../utils/get-workspace';


// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function create(options: any): Rule {

  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    const level = options.path.split('/')
      .filter((val) => !!val).length;

    const pathParts = options.path.split('/');

    const newPath = pathParts
      .slice(2, pathParts.length - 1)
      .reduce((acc, part) => {
        acc.push(part);
        return acc;
      }, []);

    options.path = [
      'src',
      ...pathParts.slice(0, 2),
      ...newPath,
    ]
      .filter((part) => !!part)
      .join('/');

    const templateSource = apply(url('./files'), [
      options.routing ? noop() : filter(path => !path.endsWith('-routing.module.ts')),
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
        // addModuleDeclarationToNgModule(options),
      ]))
    ]);

    return rule(tree, _context);
  };
}
