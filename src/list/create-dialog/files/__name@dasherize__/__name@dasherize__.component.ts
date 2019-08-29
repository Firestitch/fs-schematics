import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { of } from 'rxjs';

import { FsMessage } from '@firestitch/message';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';

@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  public <%= camelize(singleModel) %> = null;

  constructor(private _dialogRef: MatDialogRef<<%= classify(name) %>Component>,
              private _message: FsMessage,
              private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  public ngOnInit() {
    (this.data.<%= camelize(singleModel) %>.id ?  this._<%= camelize(serviceName) %>.get(this.data.<%= camelize(singleModel) %>.id) : of(this.data.<%= camelize(singleModel) %>))
      .subscribe(response => this.<%= camelize(singleModel) %> = Object.assign({}, this._<%= camelize(serviceName) %>.create(response)));
  }

  public save() {
    this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .subscribe(<%= camelize(singleModel) %> => {
        this._message.success('Saved Changes');
        this._dialogRef.close();
    });
  }
}
