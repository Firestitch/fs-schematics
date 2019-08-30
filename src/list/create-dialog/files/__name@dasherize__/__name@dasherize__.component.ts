import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FsMessage } from '@firestitch/message';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';

@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  public <%= camelize(singleModel) %> = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _dialogRef: MatDialogRef<<%= classify(name) %>Component>,
    private _message: FsMessage,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
  ) {}

  public ngOnInit() {
    if (this.data.<%= camelize(singleModel) %>.id) {
      this._<%= camelize(serviceName) %>.get(this.data.<%= camelize(singleModel) %>.id)
        .subscribe((response) => {
          this.<%= camelize(singleModel) %> = response;
        });
    } else {
      this.<%= camelize(singleModel) %> = Object.assign({}, this.data.<%= camelize(singleModel) %>);
    }
  }

  public save() {
    this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .subscribe(<%= camelize(singleModel) %> => {
        this._message.success('Saved Changes');
        this._dialogRef.close(<%= camelize(singleModel) %>);
      });
  }
}
