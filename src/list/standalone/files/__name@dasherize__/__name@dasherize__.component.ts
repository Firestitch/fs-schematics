import { Component, OnInit, ViewChild } from '@angular/core';<% if (mode === 'full') { %>
import { Router, ActivatedRoute } from '@angular/router';<% } %>

import { map } from 'rxjs/operators';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';
import { FsNavService } from '@firestitch/nav';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';



@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {
  @ViewChild('<%=classify(name)%>List')
  public <%=camelize(name)%>List: FsListComponent;

  public config: FsListConfig;

  constructor(private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
              private _navService: FsNavService,<% if (mode === 'full') { %>
              private _route: ActivatedRoute,
              private _router: Router,<% } %>
  ) {}

  public ngOnInit() {
    this.setTitle();

    this.config = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        }
      ],
      actions: [
        {
          label: 'Create <%= capitalize(singleModel) %>',
          click: (event) => {<% if (mode === 'full') { %>
            this._router.navigate(['../<%= dasherize(singleName) %>'], { relativeTo: this._route });<%} if (mode === 'dialog') {%>
            this.openDialog({})<%}%>
          }
        }
      ],
      rowActions: [
        {
          click: data => {
            return this._<%= camelize(serviceName) %>.delete(data);
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
        return this._<%= camelize(serviceName) %>.gets(query, { key: null })
          .pipe(
            map(response => ({ data: response.<%= pluralModel %>, paging: response.paging }))
          );
      },
      restore: {
        query: {state: 'deleted'},
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._<%= camelize(serviceName) %>.put({id: row.id, state: 'active'})
        }
      }
    };
  }

  private setTitle() {
    this._navService.setTitle('<%= capitalize(name) %>');
  }

}
