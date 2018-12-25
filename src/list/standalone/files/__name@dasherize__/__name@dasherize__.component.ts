import { Component, OnInit, ViewChild } from '@angular/core';<% if (mode === 'full') { %>
import { Router, ActivatedRoute } from '@angular/router';<% } %>

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { FsNavService } from '@firestitch/nav';

import { <%= classify(service) %>Service } from '<%= relativeServicePath %>';



@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  @ViewChild('<%=classify(name)%>List')

  public list: FsListComponent;
  public config: FsListConfig;

  constructor(private <%= camelize(service) %>Service: <%= classify(service) %>Service,
              private fsNavService: FsNavService, <% if (mode === 'full') { %>
              private route: ActivatedRoute,
              private router: Router,<% } %>
  ) {}

  public ngOnInit() {
    this.setTitle();

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
          click: (event) => {<% if (mode === 'full') { %>
            this.router.navigate(['../<%= dasherize(singleName) %>'], { relativeTo: this.route }); <% } if (mode === 'dialog') { %>
            this.openDialog({})<%}%>
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this.<%= camelize(service) %>Service.delete(data);
          },
          remove: {
            title: 'Confirm',
            template: 'Are you sure you would like to delete this record?',
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
        reload: true,
        click: (row) => {
          return this.<%= camelize(service) %>Service.put({id: row.id, state: 'active'})
        }
      }
    };
  }

  private setTitle() {
    this.fsNavService.setTitle('<%= capitalize(name) %>');
  }

}
