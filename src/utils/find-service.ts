import { DirEntry, Tree } from '@angular-devkit/schematics';
import { findAllModules } from '../schematics-angular-utils/find-module';

export function findAllServices(host: Tree, generateDir: string) {
  const modules = findAllModules(host, generateDir);
  let services: any[] = [];

  modules.forEach((module) => {
    const group: { module: string, services: any[] } = { module: module.moduleName, services: [] };
    const dir: DirEntry | null = host.getDir(module.modulePath);

    if (dir.subdirs) {
      dir.subdirs.forEach((subDir) => {
        group.services.push(...findServices(host, `${module.modulePath}/${subDir}`));
      })
    }

    if (group.services.length) {
      services.push(group);
    }
  });

  return services;

}

function findServices(host: Tree, path: string, services: any = []) {
  const dir: DirEntry | null = host.getDir(path);
  const serviceRe = /\.service\.ts$/;
  const moduleRe = /\.module\.ts$/;
  const routingModuleRe = /-routing\.module\.ts/;

  if (dir.subdirs) {
    dir.subdirs.forEach((subDir) => {
      services.push(...findServices(host, `${path}/${subDir}`, services));
    })
  }

  const moduleMatches = dir.subfiles.filter(p => moduleRe.test(p) && !routingModuleRe.test(p));
  if (moduleMatches.length) {
    return [];
  }

  const matches = dir.subfiles.filter(p => serviceRe.test(p));

  if (matches.length) {
    return [
      ...services,
      ...matches.reduce((acc: any, match) => {
        const serviceInfo = {
          singularName: match,
          servicePath: path,
        };
        acc.push(serviceInfo);

        return acc;
      }, [])
    ]
  }

  return services;
}