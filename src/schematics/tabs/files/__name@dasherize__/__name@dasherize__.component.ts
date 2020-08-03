import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { NavService } from '@app/core';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {

  public links = [];
  private _destroy$ = new Subject();

  constructor(
    private _navService: NavService,
    private _router: Router,
  ) {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this._destroy$),
      )
      .subscribe(() => this._setTitle());
  }

  public ngOnInit(): void {
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
  }

}
