import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

// import { RouteObserver } from '@firestitch/core';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NavService } from '@app/core';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {

  public links = [];
  // public data: any;

  private _destroy$ = new Subject();
  // private _routeObserver = new RouteObserver(this._route, 'data');

  constructor(
    private _navService: NavService,
    private _router: Router,
    private _cdRef: ChangeDetectorRef,
    // private _route: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._setTitle();

        this._cdRef.markForCheck();
      });

    // this._routeObserver.observer$
    //   .pipe(
    //     takeUntil(this._destroy$),
    //   )
    //   .subscribe((data) => {
    //     this.data = data;
    //     this._setTitle();
    //   });

    this.links = [
      {
        label: 'Path A',
        path: 'patha',
      },
      {
        label: 'Path B',
        path: 'pathb',
      },
    ];
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setTitle(): void {
    this._navService.setTitle('Title');
    // if (this.data) {
    //   this._navService.setTitle('Title', this.data.name);
    // }
  }

}
