import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { FsNavService } from '@firestitch/nav';
import { RouteObserver } from '@firestitch/core';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';

@Component({
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {

  public <%= camelize(singleModel) %>: any = null;
  public routeObserver = new RouteObserver(this._route, '<%= dasherize(name) %>');

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _<%= camelize(serviceName) %>: <%= classify(serviceName) %>,
    private _message: FsMessage,
    private _navService: FsNavService,
  ) {}

  public ngOnInit() {
    this.routeObserver
      .subscribe(<%= camelize(singleModel) %> => {
        this.<%= camelize(singleModel) %> = <%= camelize(singleModel) %> || {};
        this.setTitle();
      });
  }

  public save() {
    this._<%= camelize(serviceName) %>.save(this.<%= camelize(singleModel) %>)
      .subscribe(<%= camelize(singleModel) %> => {
        this._message.success('Saved Changes');
        if (!this.<%= camelize(singleModel) %>.id) {
          this._router.navigate([<%= camelize(singleModel)%>.id], { relativeTo: this._route });
        }
    })
  }

  private setTitle() {
    this._navService.setTitle(this.<%= camelize(singleModel) %>.id ? 'Edit <%= capitalize(singleModel)%>' : 'Create <%= capitalize(singleModel)%>');
  }
}
