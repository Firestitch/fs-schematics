import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component {

  constructor(@Inject(MAT_DIALOG_DATA) private _data: any,
              private _dialogRef: MatDialogRef<<%= classify(name) %>Component>) {}

  public save = () => {
    return of(true)
    .pipe(
      tap(response => {
        this._dialogRef.close(response);
      })
    )
  }
}
