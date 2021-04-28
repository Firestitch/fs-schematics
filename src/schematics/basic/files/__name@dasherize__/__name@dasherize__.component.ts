import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,<% if(titledComponent) { %>
  OnInit,<% } %>
} from '@angular/core';<% if(titledComponent) { %>

import { FsNavService } from '@firestitch/nav';<% } %>


@Component({<%if(type==='component'){%>
  selector: 'app-<%=dasherize(name)%>',<%}%>
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class <%= classify(name) %>Component<% if (titledComponent) { %> implements OnInit <%}%>{

  constructor(
    private _cdRef: ChangeDetectorRef,<% if (titledComponent) { %>
    private _navService: FsNavService,<% } %>
  ) {

  }
<% if (titledComponent) { %>
  public ngOnInit(): void {
    this._setTitle();
  }

  private _setTitle(): void {
    this._navService.setTitle('<%= capitalize(name) %>');
  }<% } %>

}
