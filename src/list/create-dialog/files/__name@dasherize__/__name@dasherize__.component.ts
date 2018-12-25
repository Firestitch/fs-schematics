import { Component, Inject, OnInit } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { of } from 'rxjs';

import { FsMessage } from '@firestitch/message';

import { <%= classify(service) %>Service } from '<%= relativeServicePath %>';

@Component({
  selector: 'app-<%=dasherize(name)%>-create',
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  public <%= camelize(singleModel) %> = {};

  constructor(private dialogRef: MatDialogRef<<%= classify(name) %>Component>,
              private fsMessage: FsMessage,
              private <%= camelize(service) %>Service: <%= classify(service) %>Service,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  public ngOnInit() {
    (this.data.<%= camelize(singleModel) %>.id ?  this.<%= camelize(service) %>Service.get(this.data.<%= camelize(singleModel) %>.id) : of(this.data.<%= camelize(singleModel) %>))
      .subscribe(response => this.<%= camelize(singleModel) %> = Object.assign({}, this.<%= camelize(service) %>Service.create(response)));
  }

  public save() {
    this.<%= camelize(service) %>Service.save(this.<%= camelize(singleModel) %>)
      .subscribe(<%= camelize(singleModel) %> => {
        this.fsMessage.success('Saved Changes');
        this.dialogRef.close();
    });
  }
}
