import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';<% if(titledComponent) { %>
import { FsNavService } from '@firestitch/nav';<% } %>
import { RouteObserver } from '@firestitch/core';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {

  public <%= camelize(singleModel) %>: any = null;

  private _routeObserver = new RouteObserver(this._route, '<%= camelize(singleModel) %>');
  private _destroy$ = new Subject();

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _cdRef: ChangeDetectorRef,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
    private _message: FsMessage,<% if(titledComponent) { %>
    private _navService: FsNavService,<% } %>
  ) {}

  public ngOnInit(): void {
    this._routeObserver
      .observer$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((response) => {
        this.<%= camelize(singleModel) %> = response || {};<% if(titledComponent) { %>
        this._setTitle();<% } %>

        this._cdRef.markForCheck();
      });
  }

  public save = () => {
    return this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .pipe(
        tap((response) => {
          this._message.success('Saved Changes');
          if (this.<%= camelize(singleModel) %>.id) {
            this._routeObserver.next({
              ...this.<%= camelize(singleModel) %>,
              ...response,
            });
          } else {
            this._router.navigate(['../', response.id], { relativeTo: this._route });
          }
        }),
      );
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
<% if(titledComponent) { %>
  private _setTitle(): void {
    if (this.<%= camelize(singleModel) %>.id) {
      this._navService.setTitle(this.<%= camelize(singleModel) %>.name, '<%= capitalize(singleModel)%>');
    } else {

    }
    this._navService.setTitle('Create <%= capitalize(singleModel)%>');
  }<% } %>

}
