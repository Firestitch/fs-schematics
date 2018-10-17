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
  noop
} from '@angular-devkit/schematics';
import {strings} from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { addResolveDeclarationToNgModule, addResolverToRouting, updateIndexFile } from '../../utils/ng-module-utils';
import {buildRelativePath} from '../../schematics-angular-utils/find-module';
import {dasherize} from '@angular-devkit/core/src/utils/strings';
import {ExpansionType} from '../../utils/models/expansion-type';

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
      () => { console.debug('path', options.path )},
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
  const serviceFile =  `${options.servicePath}/${options.service}.service.ts`;

  return buildRelativePath(resolverFile, serviceFile).replace('.ts', '');
}
