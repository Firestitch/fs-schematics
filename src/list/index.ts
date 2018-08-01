import {
  apply, branchAndMerge, chain, filter, mergeWith,
  move,
  Rule,
  SchematicContext,
  SchematicsException,
  Tree, url, template, externalSchematic
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { parseName } from '../utils/parse-name';
import { ListOptions } from './schema';
import { addDeclarationToNgModule } from '../utils/ng-module-utils';
import { findModuleFromOptions } from '../schematics-angular-utils/find-module';


export function getWorkspacePath(host: Tree): string {
  const possibleFiles = [ '/angular.json', '/.angular.json' ];
  const path = possibleFiles.filter(path => host.exists(path))[0];

  return path;
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
    console.log('root options? ', options);

    const workspace = getWorkspace(tree);

    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }
    const project = workspace.projects[options.project];

    if (options.path === undefined) {
      const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
      options.path = `/${project.root}/src/${projectDirName}`;
    }

    options.module = findModuleFromOptions(tree, options);

    const parsedPath = parseName(options.path, options.name);
    options.name = parsedPath.name;
    options.path = parsedPath.path;

    // console.log('options', options);

    const templateSource = apply(url('./files'), [
      filterTemplates(options),
      template({
        ...strings,
        ...options
      }),
      () => { console.debug('path', parsedPath.path )},
      move(parsedPath.path)
    ]);

    // console.log('templ', templateSource);

    const extrenalSchematics: any = [];

    if (options.edit || options.create) {
      const createOptions = {
        project: options.project,
        path: `${options.path}/${options.name}`,
        module: options.module,
        parentName: options.name,
        secondLevel: true
      };

      if (options.create) {
        extrenalSchematics.push(
          externalSchematic('list', 'create', Object.assign({
            childName: 'create',
            }, createOptions)
          )
        )
      }

      if (options.edit) {
        extrenalSchematics.push(
          externalSchematic('list', 'create', Object.assign({
              childName: 'edit',
            }, createOptions)
          )
        );
      }
    }

    console.log('external che', extrenalSchematics, options);

    const rule = chain([
      branchAndMerge(chain([
        mergeWith(templateSource),
        addDeclarationToNgModule(options, false),
        ...extrenalSchematics
      ]))
    ]);


    return rule(tree, _context);
  };
}
