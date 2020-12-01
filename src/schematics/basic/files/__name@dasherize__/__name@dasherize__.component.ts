import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({<%if(type==='component'){%>
  selector: 'app-<%=dasherize(name)%>',<%}%>
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component {

  constructor(private _cdRef: ChangeDetectorRef) {

  }
}
