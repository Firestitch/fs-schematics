import { Component, Inject } from '@angular/core';
import { FsMessage } from '@firestitch/message';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { <%= classify(service) %>} from '<%= servicePath %>';

@Component({
  selector: 'app-<%=dasherize(name)%>-create',
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component {
  public <%= name %>: any = {};

  constructor(private _dialogRef: MatDialogRef<<%= classify(name) %>Component>,
              private _fsMessage: FsMessage,
              private _service: <%= classify(service) %>
              @Inject(MAT_DIALOG_DATA) public data) {
    this.<%= name %> = Object.assign({}, data.<%= name %>);
  }

  public save() {
    this._service.save(this.<%= name %>)
      .subscribe(<%= name %> => {
        Object.assign(this.data.<%= name %>, <%= name %>);
        this._dialogRef.close();
        this._fsMessage.success('Saved Changes');
      });
  }
}
