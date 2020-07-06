import { Component, OnInit, ViewChild } from '@angular/core';<% if (mode === 'full') { %>
import { Router, ActivatedRoute } from '@angular/router';<% } %>

import { map } from 'rxjs/operators';

import { FsListComponent, FsListConfig } from '@firestitch/list';
import { ItemType } from '@firestitch/filter';<% if (titledCreateComponent) { %>
import { FsNavService } from '@firestitch/nav';
<% } %>
import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {

  @ViewChild(FsListComponent)
  private _listComponent: FsListComponent;

  public listConfig: FsListConfig;

  constructor(
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,<% if (titledCreateComponent) { %>
    private _navService: FsNavService,<% } %><% if (mode === 'full') { %>
    private _route: ActivatedRoute,
    private _router: Router,<% } %>
  ) {}

  public ngOnInit() {<% if (titledCreateComponent) { %>
    this._setTitle();
<% } %>
    this.listConfig = {
      filters: [
        {
          name: 'keyword',
          type: ItemType.Keyword,
          label: 'Search'
        }
      ],
      actions: [
        {
          label: 'Create',
          click: (event) => {<% if (mode === 'full') { %>
            this._router.navigate(['create'], { relativeTo: this._route });<%} if (mode === 'dialog') {%>
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
          label: 'Delete'
        }
      ],
      fetch: (query) => {
        return this._<%= camelize(serviceName) %>.gets(query, { key: null })
          .pipe(
            map((response: any) => ({ data: response.<%= pluralModel %>, paging: response.paging }))
          );
      },
      restore: {
        query: { state: 'deleted' },
        filterLabel: 'Show Deleted',
        menuLabel: 'Restore',
        reload: true,
        click: (row) => {
          return this._<%= camelize(serviceName) %>.put({ id: row.id, state: 'active' })
        }
      }
    };
  }<% if (titledCreateComponent) { %>

  private _setTitle() {
    this._navService.setTitle('<%= capitalize(name) %>');
  }<% } %>
}
