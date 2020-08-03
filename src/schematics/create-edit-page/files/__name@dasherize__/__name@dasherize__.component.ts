import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';<% if(titledCreateComponent) { %>
import { FsNavService } from '@firestitch/nav';<% } %>
import { RouteObserver } from '@firestitch/core';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {

  public <%= camelize(singleModel) %>: any = null;

  private _routeObserver = new RouteObserver(this._route, '<%= camelize(singleModel) %>');
  private _destroy$ = new Subject();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
    private _message: FsMessage,<% if(titledCreateComponent) { %>
    private _navService: FsNavService,<% } %>
  ) {}

  public ngOnInit() {
    this._routeObserver
      .observer$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(response => {
        this.<%= camelize(singleModel) %> = response || {};<% if(titledCreateComponent) { %>
        this._setTitle();<% } %>
      });
  }

  public save = () => {
    return this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .pipe(
        tap(
          response => {
            this._message.success('Saved Changes');
            if (this.<%= camelize(singleModel) %>.id) {
              this._routeObserver.next({
                ...this.<%= camelize(singleModel) %>,
                ...response,
              });
            } else {
              this._router.navigate(['../', response.id], { relativeTo: this._route });
            }
          })
      );
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
<% if(titledCreateComponent) { %>
  private _setTitle() {
    this._navService.setTitle(this.<%= camelize(singleModel) %>.id ? 'Edit <%= capitalize(singleModel)%>' : 'Create <%= capitalize(singleModel)%>');
  }<% } %>

}
