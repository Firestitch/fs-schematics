import { Component, OnInit, ViewChild } from '@angular/core';
<% if (mode === 'full') { %> import { Router } from '@angular/router'; <% } %>

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsPrompt } from '@firestitch/prompt';
import { FsNavRouteHandleService } from '@firestitch/nav';


import { <%= classify(service) %>Service } from '<%= servicePath %>';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  @ViewChild('<%=classify(name)%>Table')
  public table: FsListComponent;

  public config: FsListConfig;

  constructor(private <%= camelize(service) %>Service: <%= classify(service) %>Service,
              private navRouteHandleService: FsNavRouteHandleService,
              private router: Router,
              private fsPrompt: FsPrompt) {}

  public ngOnInit() {
    this.navRouteHandleService.setTitle('<%= capitalize(name) %>');

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: 'text',
          label: 'Search'
        }
      ],
      actions: [
        {
          label: 'Create <%= capitalize(singleModel) %>',
          click: (filters, event) => {
            <% if (mode === 'dialog ') { %> this.openDialog(); <% } %>
            <% if (mode === 'full') { %> this.router.navigateByUrl('/<%= dasherize(singleName) %>') <% } %>
          }
        }
      ],
      rowActions: [
        {
          click: (data) => {
            this.fsPrompt.confirm({
              title: 'Confirm',
              template: 'Are you sure you would like to delete this record?'
            }).subscribe(() => {
              return this.<%= camelize(service) %>Service.delete(data)
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
        return this.<%= camelize(service) %>Service.gets(query, { key: null })
          .map(response => ({ data: response.<%= pluralModel %>, paging: response.paging }));
      },
      restore: {
        query: {state: 'deleted'},
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        click: (row, event) => {
          return this.<%= camelize(service) %>Service.put({id: row.id, state: 'active'})
            .subscribe(() => {
              this.table.reload();
            });
        }
      }
    };
  }

}
