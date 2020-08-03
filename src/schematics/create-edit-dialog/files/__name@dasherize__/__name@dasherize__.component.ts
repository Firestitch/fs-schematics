import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { tap } from 'rxjs/operators';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
})
export class <%= classify(name) %>Component implements OnInit {

  public <%= camelize(singleModel) %> = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<<%= classify(name) %>Component>,
    private _message: FsMessage,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
  ) {}

  public ngOnInit(): void {
    if (this._data.<%= camelize(singleModel) %>.id) {
      this._<%= camelize(serviceName) %>.get(this._data.<%= camelize(singleModel) %>.id)
        .subscribe((response) => {
          this.<%= camelize(singleModel) %> = response;
        });
    } else {
      this.<%= camelize(singleModel) %> = { ...this._data.<%= camelize(singleModel) %> };
    }
  }

  public save = () => {
    return this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .pipe(
        tap(
          (response) => {
            this._message.success('Saved Changes');
            this._dialogRef.close(response);
          }),
      );
  }

}
