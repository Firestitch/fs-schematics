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
  externalSchematic
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { WorkspaceSchema } from '@angular-devkit/core/src/workspace';
import { parseName } from '../utils/parse-name';
import { addDeclarationToNgModule, addDeclarationToRoutingModule } from '../utils/ng-module-utils';
import {
  findAllModules,
  findModuleFromOptions,
  findRoutingModuleFromOptions
} from '../schematics-angular-utils/find-module';
import { findModule } from '../schematics-angular-utils/find-module';
import { findAllServices } from '../utils/find-service';


export function getWorkspacePath(host: Tree): string {
  const possibleFiles = [ '/angular.json', '/.angular.json', '/angular-cli.json', '/.angular-cli.json' ];
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
export function list(options: any): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspace = getWorkspace(tree);

    if (!options.project) {
      options.project = Object.keys(workspace.projects)[0];
    }
    const project = workspace.projects[options.project];


    if (options.path === undefined) {
      const projectDirName = project.projectType === 'application' ? 'app' : 'lib';
      options.path = `${project.root}/src/${projectDirName}`;
    }

    console.log(JSON.stringify(findAllServices(tree, options.path)));
    return tree;
  };
}