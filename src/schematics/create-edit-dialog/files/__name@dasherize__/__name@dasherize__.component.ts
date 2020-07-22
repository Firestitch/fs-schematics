import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';

import { FsMessage } from '@firestitch/message';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
})
export class <%= classify(name) %>Component implements OnInit {

  public <%= underscore(singleModel) %> = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<<%= classify(name) %>Component>,
    private _message: FsMessage,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
  ) {}

  public ngOnInit(): void {
    if (this._data.<%= underscore(singleModel) %>.id) {
      this._<%= camelize(serviceName) %>.get(this._data.<%= underscore(singleModel) %>.id)
        .subscribe((response) => {
          this.<%= underscore(singleModel) %> = response;
        });
    } else {
      this.<%= underscore(singleModel) %> = { ...this._data.<%= underscore(singleModel) %> };
    }
  }

  public save = () => {
    return this._<%= camelize(serviceName) %>.save(this.<%= underscore(singleModel) %>)
      .pipe(
        tap(
          (response) => {
            this._message.success('Saved Changes');
            this._dialogRef.close(response);
          }),
      );
  }
}
