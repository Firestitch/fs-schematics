import { Component, Inject } from '@angular/core';
import { FsMessage } from '@firestitch/message';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { <%= classify(service) %>Service } from '<%= servicePath %>';

@Component({
  selector: 'app-<%=dasherize(name)%>-create',
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component {
  public <%= pluralModel %>: any = {};

  constructor(private dialogRef: MatDialogRef<<%= classify(name) %>Component>,
              private fsMessage: FsMessage,
              private <%= camelize(service) %>Service: <%= classify(service) %>Service,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.<%= pluralModel %> = Object.assign({}, data.<%= pluralModel %>);
  }

  public save() {
    this.<%= camelize(service) %>Service.save(this.<%= pluralModel %>)
      .subscribe(<%= pluralModel %> => {
        Object.assign(this.data.<%= pluralModel %>, <%= pluralModel %>);
        this.dialogRef.close();
        this.fsMessage.success('Saved Changes');
      });
  }
}
