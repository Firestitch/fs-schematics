import { Component, OnInit, ViewChild } from '@angular/core';
import { FsListComponent, FsListConfig } from '@firestitch/list';
<% if (dialog) { %>import { MatDialog } from '@angular/material';<% } %>
import { of } from 'rxjs';
<% if (dialog) { %>
import { <%= classify(singleName) %>Component } from './<%=dasherize(singleName)%>';
<% } %>

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
})
export class <%= classify(name) %>Component implements OnInit {

  @ViewChild('<%=classify(name)%>Table')
  public table: FsListComponent;

  public config: FsListConfig;

  <% if (dialog) {%>
  constructor(private _dialog: MatDialog,) {
  }
  <% } %>

  public ngOnInit() {

    this.config = {
      heading: '<%= classify(name) %>',
      filters: [
        {
          name: 'keyword',
          type: 'text',
          label: 'Search'
        }
      ],
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
  <% if (dialog){%>
  public open(<%= camelize(singleName) %>) {
    const dialogRef = this._dialog.open(<%= classify(singleName) %>Component, {
      width: '700px',
      data: { data: <%= camelize(singleName) %> }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  <% } %>
}
