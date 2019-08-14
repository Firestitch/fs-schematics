import {
  apply,
  branchAndMerge,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import {
  addResolveDeclarationToNgModule,
  addResolverToRouting,
  updateIndexFile
} from '../../utils/ng-module-utils';
import { buildRelativePath } from '../../schematics-angular-utils/find-module';
import { ExpansionType } from '../../utils/models/expansion-type';
import { getWorkspace } from '../../utils/get-workspace';

export function create(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const resolveFolder = '/shared/resolves';
    const workspace = getWorkspace(tree);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    options.path = options.path + resolveFolder;
    options.routingModule = options.module.replace('.module.ts', '-routing.module.ts');
    options.relativeServicePath = buildRelativePathForService(options);

    const isIndexFileExists = tree.exists(`${options.path}/index.ts`);

    const templateSource = apply(url('./files'), [
      isIndexFileExists ? filter((path) => path.indexOf('index.ts') === -1) : noop(),
      template({
        ...strings,
        ...options
      }),
      () => {
        console.debug('path', options.path)
      },
      move(options.path)
    ]);

    const isRoutingExists = tree.exists(options.routingModule);

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addResolveDeclarationToNgModule(options),
        isRoutingExists ? addResolverToRouting(options) : noop(),
        isIndexFileExists ? updateIndexFile(options, ExpansionType.Resolve) : noop(),
      ]))
    ]);

    return rule(tree, _context);
  };
}

function buildRelativePathForService(options) {
  const resolverFile = `${options.path}/${dasherize(options.name)}.resolve.ts`;
  const serviceFile = `${options.servicePath}/${options.service}.service.ts`;

  return buildRelativePath(resolverFile, serviceFile).replace('.ts', '');
}
