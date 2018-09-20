import { Component, OnInit, ViewChild } from '@angular/core';
import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';
<% if (mode === 'dialog') { %>import { MatDialog } from '@angular/material';<% } %>
<% if (mode === 'dialog') { %>
import { <%= classify(singleName) %>Component } from './<%=dasherize(singleName)%>';
<% } %>
import { <%= classify(service) %>} from '<%= servicePath %>';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
})
export class <%= classify(name) %>Component implements OnInit {

  @ViewChild('<%=classify(name)%>Table')
  public table: FsListComponent;

  public config: FsListConfig;

  constructor(private _service: <%= classify(service) %>,
  <% if (mode === 'dialog') {%>private _dialog: MatDialog, <% } %>
              private _fsPrompt: FsPrompt) {}

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
      actions: [
        {
          click: (filters, event) => {
            console.log('created');
          },
          label: 'Create <%= capitalize(name) %>'
        }
      ],
      rowActions: [
        {
          click: (data) => {
            this._fsPrompt.confirm({
              title: 'Confirm',
              template: 'Are you sure you would like to delete?'
            }).subscribe(() => {
              return this._service.delete(data)
                .subscribe(() => {
                  this.table.reload();
                });
            });
          },
          menu: true,
          label: 'Remove'
        }
      ],
      fetch: (query) => {
        return this._service.gets(query, { key: null })
          .map(response => ({ data: response.<%= name %>, paging: response.paging }));
      },
      restore: {
        query: {state: 'deleted'},
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        click: (row, event) => {
          return this._service.put({id: row.id, state: 'active'})
            .subscribe(() => {
              this.table.reload();
            });
        }
      }
    };
  }
}
