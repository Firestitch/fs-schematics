/*
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

const optionsForComponent = {
  ...defaultOptions,
  path: '/projects/application/src/app',
  module: 'app.module.ts',
  routableComponent: false,
  name: 'test',
};

const optionsForView = {
  ...defaultOptions,
  path: '/projects/application/src/app',
  module: 'app.module.ts',
  routableComponent: true,
  name: 'test',
};

const collectionPath = path.join(__dirname, '../../collection.json');
const runner = new SchematicTestRunner('schematics', collectionPath);
// const version = packageJson.version;

let appTree: UnitTestTree;

describe('Schematic: Base', () => {
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

  it('should create base component', async () => {
    const tree = await runner
      .runSchematicAsync('base', optionsForComponent, appTree)
      .toPromise();

    assert(tree.files.includes('/projects/application/src/app/components/test/test.component.ts'));
  });

  it('should create base view', async () => {
    const tree = await runner
      .runSchematicAsync('base', optionsForView, appTree)
      .toPromise();

    assert(tree.files.includes('/projects/application/src/app/views/test/test.component.ts'));
  });

});
*/
