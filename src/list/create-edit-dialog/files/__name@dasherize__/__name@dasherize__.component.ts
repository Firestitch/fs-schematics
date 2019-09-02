import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { FsMessage } from '@firestitch/message';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';

@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  public <%= underscore(singleModel) %> = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _dialogRef: MatDialogRef<<%= classify(name) %>Component>,
    private _message: FsMessage,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
  ) {}

  public ngOnInit() {
    if (this.data.<%= underscore(singleModel) %>.id) {
      this._<%= underscore(serviceName) %>.get(this.data.<%= underscore(singleModel) %>.id)
        .subscribe((response) => {
          this.<%= underscore(singleModel) %> = response;
        });
    } else {
      this.<%= underscore(singleModel) %> = Object.assign({}, this.data.<%= underscore(singleModel) %>);
    }
  }

  public save() {
    this._<%= camelize(serviceName) %>.save(this.<%= underscore(singleModel) %>)
      .subscribe(response => {
        this._message.success('Saved Changes');
        this._dialogRef.close(response);
      });
  }
}
