import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { FsMessage } from '@firestitch/message';

import { Subject, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component implements OnInit, OnDestroy {

  public <%= camelize(singleModel) %> = null;

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: any,
    private _dialogRef: MatDialogRef<<%= classify(name) %>Component>,
    private _message: FsMessage,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    of(this._data.<%= camelize(singleModel) %>)
      .pipe(
        switchMap((<%= camelize(singleModel) %>) => {
          return <%= camelize(singleModel) %>.id
            ? this._<%= camelize(serviceName) %>.get(this._data.<%= camelize(singleModel) %>.id)
            : of(<%= camelize(singleModel) %>);
        }),
        takeUntil(this._destroy$),
      )
      .subscribe((<%= camelize(singleModel) %>) => {
        this.<%= camelize(singleModel) %> = { ...<%= camelize(singleModel) %> };
        this._cdRef.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public save = () => {
    return this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .pipe(
        tap((<%= camelize(singleModel) %>) => {
          this._message.success('Saved Changes');
          this._dialogRef.close(<%= camelize(singleModel) %>);
        }),
      );
  };

}
