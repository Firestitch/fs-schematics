import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';<% if(titledCreateComponent) { %>
import { FsNavService } from '@firestitch/nav';<% } %>
import { RouteObserver } from '@firestitch/core';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';

@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {

  public <%= underscore(singleModel) %>: any = null;
  public routeObserver = new RouteObserver(this._route, '<%= underscore(singleModel) %>');

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
    private _message: FsMessage,<% if(titledCreateComponent) { %>
    private _navService: FsNavService,<% } %>
  ) {}

  public ngOnInit() {
    this.routeObserver
      .subscribe(response => {
        this.<%= underscore(singleModel) %> = response || {};<% if(titledCreateComponent) { %>
        this._setTitle();<% } %>
      });
  }

  public save() {
    this._<%= camelize(serviceName) %>.save(this.<%= underscore(singleModel) %>)
      .subscribe(response => {
        this._message.success('Saved Changes');
        if (!this.<%= underscore(singleModel) %>.id) {
          this._router.navigate(['../', response.id], { relativeTo: this._route });
        }
    })
  }
<% if(titledCreateComponent) { %>
  private _setTitle() {
    this._navService.setTitle(this.<%= underscore(singleModel) %>.id ? 'Edit <%= capitalize(singleModel)%>' : 'Create <%= capitalize(singleModel)%>');
  }<% } %>
}