import { Component, Inject, OnInit } from '@angular/core';
import { FsMessage } from '@firestitch/message';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { <%= classify(service) %>Service } from '<%= relativeServicePath %>';

@Component({
  selector: 'app-<%=dasherize(name)%>-create',
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Dialog implements OnInit {

  constructor(private dialogRef: MatDialogRef<<%= classify(name) %>Component>,
              private fsMessage: FsMessage,
              private <%= camelize(service) %>Service: <%= classify(service) %>Service,
              @Inject(MAT_DIALOG_DATA) public data) {
  }

  public ngOnInit() {
    new Promise((resolve) => {
      if (!this.data.id) {
        return resolve();
      }

      this.<%= camelize(service) %>Service.get(this.data.id)
        .subscribe(<%= camelize(singleModel) %> => {
        resolve(<%= camelize(singleModel) %>);
      });

    }).then((<%= camelize(singleModel) %>) => {
      this.data = <%= camelize(singleModel) %> || {};
    });
  }

  public save() {
    this.<%= camelize(service) %>Service.save(this.data)
      .subscribe(<%= camelize(singleModel) %> => {
      this.fsMessage.success('Saved Changes');
      this.dialogRef.close();
    });
  }
}
