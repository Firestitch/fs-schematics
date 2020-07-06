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

const enumOptions = {
  ...defaultOptions,
  path: '/projects/application/src/app',
  module: 'app.module.ts',
  name: 'test',
  keys: 'Active,Passive,Native',
  values: 'active,passive,native'
};

const collectionPath = path.join(__dirname, '../../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);
// const version = packageJson.version;

let appTree: UnitTestTree;

describe('Schematic: Enum', () => {
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

  it('should create enum', async () => {
    const tree = await runner
      .runSchematicAsync('enum', enumOptions, appTree)
      .toPromise();

    assert(tree.files.includes('/projects/application/src/app/enums/test.enum.ts'));
  });

  it('enum should contain enum declaration', async () => {
    const content = appTree.readContent('/projects/application/src/app/enums/test.enum.ts');

    assert(content.indexOf('export enum Test {') > -1);
  });

  it('enum should contain correct content', async () => {
    const content = appTree.readContent('/projects/application/src/app/enums/test.enum.ts');

    assert(content.indexOf("Active = 'active'") > -1 && content.indexOf("Native = 'native'") > -1);
  });

});
