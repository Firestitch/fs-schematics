/*
import {
  Rule,
  SchematicContext,
  Tree,
} from '@angular-devkit/schematics';
import { findAllServices } from '../utils/find-service';
import { getWorkspace } from '../utils/get-workspace';

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
*/
