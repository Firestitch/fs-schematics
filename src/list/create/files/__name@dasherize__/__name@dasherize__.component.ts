import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { FsNavRouteHandleService } from '@firestitch/nav';
import { RouteObserver } from '@firestitch/core';

import { <%= classify(service) %>Service } from '<%= relativeServicePath %>';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {

  public <%= camelize(singleModel) %>: any = {};
  public routeObserver = new RouteObserver(this.route);

  constructor(private route: ActivatedRoute,
              private router: Router,
              private <%= camelize(service) %>Service: <%= classify(service) %>Service,
              private fsMessage: FsMessage,
              private navRouteHandleService: FsNavRouteHandleService) {

  }

  public ngOnInit() {
    this.routeObserver
      .subscribe(<%= camelize(singleModel) %> => {
        this.<%= camelize(singleModel) %> = <%= camelize(singleModel) %> || {};
        this.navRouteHandleService.setTitle(this.<%= camelize(singleModel) %>.id ? 'Edit <%= capitalize(singleModel)%>' : 'Create <%= capitalize(singleModel)%>');
      }, '<%= camelize(singleModel) %>');
  }

  public save() {
    this.<%= camelize(service) %>Service.save(this.<%= camelize(singleModel) %>)
      .subscribe(<%= camelize(singleModel) %> => {
        this.fsMessage.success('Saved Changes');
        if (!this.<%= camelize(singleModel) %>.id) {
          this.router.navigate([<%= camelize(singleModel)%>.id], { relativeTo: this.route });
        }
    })
  }
}
