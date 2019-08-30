import { Tree } from '@angular-devkit/schematics';
/**
 * Build right services's path for correct component
 * @param options
 * @returns {string}
 */
export declare function buildRelativePathForService(options: any): string;
/**
 * Build right services's path for correct component
 * @param options
 * @returns {string}
 */
export declare function buildRelativePathForEnum(options: any): string;
/**
 * Get index.ts file position for component
 * It can be module's root or /components folder (if it exists)
 * @param {Tree} tree
 * @param options
 * @returns {{path}}
 */
export declare function getRootPath(tree: Tree, options: any): {
    path: string;
};
/**
 * Get current component's location (include nestedPath)
 * @param path
 * @param routable
 * @returns {{path}}
 */
export declare function getComponentPath(path: string, routable: string | boolean): string;
