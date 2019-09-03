import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavService } from '@app/core';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {

  public links = [];
  private _destroy$ = new Subject();
  constructor(private _navService: NavService,
              private _router: Router) {

    this._router.events
    .pipe(
      takeUntil(this._destroy$),
      filter(event => event instanceof NavigationEnd)
    )
    .subscribe(() => this._setTitle());
  }

  public ngOnInit() {
    this.links = [
      {
        path: 'patha',
        label: 'Path A'
      },
      {
        path: 'pathb',
        label: 'Path B'
      }
    ];
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _setTitle() {
    this._navService.setTitle('Title');
  }
}