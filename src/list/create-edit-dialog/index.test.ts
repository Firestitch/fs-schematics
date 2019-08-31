import assert from 'assert';
import * as path from 'path';
import { describe, before } from 'mocha';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import {
  Schema as ApplicationOptions,
  Style
} from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { dasherize } from '@angular-devkit/core/src/utils/strings';


const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '7.0.0'
};

const appOptions: ApplicationOptions = {
  name: 'application',
  inlineStyle: false,
  inlineTemplate: false,
  routing: false,
  style: Style.Css,
  skipTests: true,
  skipPackageJson: false
};

const defaultOptions = {
  skipInstall: false
};

const BASE_PATH = '/projects/application';

const optionsForComponent = {
  path: BASE_PATH + '/src/app',
  module: BASE_PATH + '/src/app/' + 'app.module.ts',
  type: 'component',
  // parentName: 'list',
  name: 'create-list',
  service: 'test.service.ts',
  servicePath: BASE_PATH + '/src/app/services',
  singleModel: 'model',
  pluralModel: 'models',
  secondLevel: true,
  mode: 'dialog'
};

const optionsForService = {
  path: BASE_PATH + '/src/app',
  module: 'app.module.ts',
  name: 'test',
  subdirectory: '/services',
  pluralName: 'tests',
  menuService: true,
};

const collectionPath = path.join(__dirname, '../../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);
// const version = packageJson.version;

let appTree: UnitTestTree;

describe('Schematic: List with Create dialog', () => {
  before(async () => {
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions
      )
      .toPromise();
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        appTree
      )
      .toPromise();

    appTree = await runner
      .runSchematicAsync(
        'service',
        optionsForService,
        appTree
      )
      .toPromise();

    appTree = await runner
      .runSchematicAsync('create-edit-dialog', optionsForComponent, appTree)
      .toPromise();
  });

  it('has mat dialog ref', async () => {
    const content = appTree.readContent(BASE_PATH + '/src/app/components/create-list/create-list.component.ts');

    assert(content.indexOf('MatDialogRef') > -1);
  });
});
