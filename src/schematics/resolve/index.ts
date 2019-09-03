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
  template,
  Tree,
  url
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import {
  addResolveDeclarationToNgModule,
  addResolverToRouting,
  updateIndexFile
} from '../../utils/ng-module-utils';
import { buildRelativePath } from '../../utils/find-module';
import { ExpansionType } from '../../utils/models/expansion-type';
import { getWorkspace } from '../../utils/get-workspace';
import { getServiceClassName } from '../../utils/get-service-class-name';

export function create(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const resolveFolder = '/resolves';
    const workspace = getWorkspace(tree);
    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }

    options.componentPath = options.path + resolveFolder;
    options.routingModule = options.module.replace('.module.ts', '-routing.module.ts');
    options.relativeServicePath = buildRelativePathForService(options);
    options.serviceName = getServiceClassName(
      tree,
      options.servicePath + '/' + options.service
    ) || '';

    const isResolverExists = tree.exists(`${options.componentPath}/${options.name}.resolve.ts`);

    if (isResolverExists) {
      return noop();
    }

    const isIndexFileExists = tree.exists(`${options.componentPath}/index.ts`);

    const templateSource = apply(url('./files'), [
      isIndexFileExists ? filter((path) => path.indexOf('index.ts') === -1) : noop(),
      template({
        ...strings,
        ...options
      }),
      () => {
        console.debug('path', options.componentPath)
      },
      move(options.componentPath)
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
  const resolverFile = `${options.componentPath}/${dasherize(options.name)}.resolve.ts`;
  const serviceFile = `${options.servicePath}/${options.service}`;

  return buildRelativePath(resolverFile, serviceFile).replace('.ts', '');
}
