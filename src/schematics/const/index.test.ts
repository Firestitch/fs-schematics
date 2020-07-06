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


const workspaceOptions: WorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '7.0.0'
};

const BASE_PATH = '/projects/application';

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

const constOptions = {
  ...defaultOptions,
  path: '/projects/application/src/app',
  module: 'app.module.ts',
  name: 'test-const',
  keys: 'Active,Passive,Native',
  values: 'active,passive,native',
  enumPath: '/projects/application/src/app/enums/test.enum.ts',
  enumName: 'TestEnum'
};

const collectionPath = path.join(__dirname, '../../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);
// const version = packageJson.version;

let appTree: UnitTestTree;

describe('Schematic: Const', () => {
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
  });

  it('should create const', async () => {
    const tree = await runner
      .runSchematicAsync('const', constOptions, appTree)
      .toPromise();

    assert(tree.files.includes('/projects/application/src/app/consts/test-const.const.ts'));
  });

  it('file should contain const declaration', async () => {
    const content = appTree.readContent('/projects/application/src/app/consts/test-const.const.ts');

    assert(content.indexOf('export const TestConst') > -1);
  });

  it('const should contain correct content', async () => {
    const content = appTree.readContent('/projects/application/src/app/consts/test-const.const.ts');

    assert(
      content.indexOf("{ name: 'active', value: TestEnum.Active }") > -1 &&
      content.indexOf("{ name: 'passive', value: TestEnum.Passive }") > -1
    );
  });

});
