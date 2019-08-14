import { buildRelativePath } from '../schematics-angular-utils/find-module';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { Tree } from '@angular-devkit/schematics';

/**
 * Build right services's path for correct component
 * @param options
 * @returns {string}
 */
export function buildRelativePathForService(options): string {
  return buildRelativePath(
    `${options.componentPath}/${dasherize(options.name)}/${dasherize(options.name)}.component.ts`,
    `${options.servicePath}/${options.service}`
  ).replace('.ts', '');
}

/**
 * Get index.ts file position for component
 * It can be module's root or /components folder (if it exists)
 * @param {Tree} tree
 * @param options
 * @returns {{path}}
 */
export function getRootPath(tree: Tree, options): { path: string } {
  const dir = tree.getDir(`${options.path}`);

  if (options.type && options.type === 'view') {
    const isViewsFolderExists = (dir.subdirs as string[]).indexOf('views') !== -1;
    const path = options.path + ( isViewsFolderExists ? '/views' : '');

    return { path };
  } else {
    const isComponentFolderExists = (dir.subdirs as string[]).indexOf('components') !== -1;
    const path = options.path + ( isComponentFolderExists ? '/components' : '');

    return { path };
  }
}

/**
 * Get current component's location (include nestedPath)
 * @param {Tree} tree
 * @param options
 * @returns {{path}}
 */
export function getComponentPath(tree: Tree, options): { path: string } {
  const dir = tree.getDir(`${options.path}`);
  let path = options.path;

  if (options.type && options.type === 'view') {
    path += '/views';
  } else {
    path += '/components';
  }

  return { path };
}
