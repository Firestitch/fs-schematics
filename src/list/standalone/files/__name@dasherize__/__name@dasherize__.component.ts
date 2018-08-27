import { Component, OnInit, ViewChild } from '@angular/core';
import { FsListComponent, FsListConfig } from '@firestitch/list';
import { of } from 'rxjs';

<% if (dialog) { %>
import { <%= classify(singleName) %>Component } from '<%=dasherize(name)%>/<%=dasherize(name)%>.component.ts';
<% } %>

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
})
export class <%= classify(name) %>Component implements OnInit {

  @ViewChild('<%=dasherize(name)%>Table')
  public table: FsListComponent;

  public config: FsListConfig;

  public ngOnInit() {

    this.config = {
      heading: '<%= classify(name) %>',
      fetch: (query) => {
        return of({
          data: [
            {
              id: 1,
              name: 'Name'
            }
          ]
        });
      }
    };
  }
  <% if (dialog) { %>
  public open(<%= classify(singleName) %>) {
    const dialogRef = this.dialog.open(<%= classify(singleName) %>Component, {
      width: '700px',
      data: { data: <%= classify(singleName) %> }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  <% } %>
}
