import * as ts from 'typescript';
import { Change, InsertChange, NoopChange } from '../schematics-angular-utils/change';
import { findNodes, insertAfterLastOccurrence } from '../schematics-angular-utils/ast-utils';

export function insertExport(source: ts.SourceFile, fileToEdit: string, symbolName: string,
                             fileName: string, isDefault = false, existingChanges: InsertChange[] = []): Change {

  const rootNode = source;
  const allExports = findNodes(rootNode, ts.SyntaxKind.ExportDeclaration);
  let prevImports: any;

  existingChanges.some((change, index) => {
    const text = change.toAdd;
    if (text && text.indexOf('export') > -1
      && text.indexOf('*') === -1
      && text.indexOf(fileName) > -1
    ) {
      const importsArray = text.match(/{(.*)}/im);

      if (importsArray) {
        importsArray.shift();
        prevImports = {};
        prevImports.text = importsArray[0].trim();
        prevImports.coma = (prevImports.text.lastIndexOf(',') === prevImports.text.length - 1) ? '' : ',';
      }

      existingChanges.splice(index, 1);

      return true;
    } else {
      return false;
    }
  });

  // get nodes that map to import statements from the file fileName
  const relevantImports = allExports.filter(node => {
    // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
    const importFiles = node.getChildren()
      .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
      .map(n => (n as ts.StringLiteral).text);

    return importFiles.filter(file => file === fileName).length === 1;
  });

  if (relevantImports.length > 0) {
    let importsAsterisk = false;
    // imports from import file
    const imports: ts.Node[] = [];
    relevantImports.forEach(n => {
      Array.prototype.push.apply(imports, findNodes(n, ts.SyntaxKind.Identifier));
      if (findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
        importsAsterisk = true;
      }
    });

    // if imports * from fileName, don't add symbolName
    if (importsAsterisk) {
      return new NoopChange();
    }

    const importTextNodes = imports.filter(n => (n as ts.Identifier).text === symbolName);

    // insert import if it's not there
    if (importTextNodes.length === 0) {
      const fallbackPos =
        findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
        findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();

      let insertText = `, ${symbolName}`;

      if (prevImports) {
        insertText = `, ${prevImports.text}${prevImports.coma} ${symbolName}`
      }

      return insertAfterLastOccurrence(imports, insertText, fileToEdit, fallbackPos);
    }

    return new NoopChange();
  }

  // no such import declaration exists
  const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral)
    .filter((n: ts.StringLiteral) => n.text === 'use strict');
  let fallbackPos = 0;
  if (useStrict.length > 0) {
    fallbackPos = useStrict[0].end;
  }
  const open = isDefault ? '' : '{ ';
  const close = isDefault ? '' : ' }';
  // if there are no imports or 'use strict' statement, insert import at beginning of file
  const insertAtBeginning = allExports.length === 0 && useStrict.length === 0;
  const separator = insertAtBeginning ? '' : ';\n';

  let toInsert = `${separator}export *` +
    ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;

  if (prevImports) {
    toInsert = `${separator}export ${open}${prevImports.text}${prevImports.coma} ${symbolName}${close}` +
      ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;
  }

  if (insertAtBeginning) {
    return new InsertChange(fileToEdit, 0, toInsert);
  }

  return insertAfterLastOccurrence(
    allExports,
    toInsert,
    fileToEdit,
    fallbackPos,
    ts.SyntaxKind.StringLiteral,
  );
}
