import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FsMessage } from '@firestitch/message';
import { FsNavRouteHandleService } from '@firestitch/nav';

import { <%= classify(service) %>Service } from '<%= servicePath %>';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component implements OnInit {

  public <%= camelize(singleModel) %> = {};

  constructor(private route: ActivatedRoute,
              private <%= camelize(service) %>Service: <%= classify(service) %>Service,
              private fsMessage: FsMessage,
              private navRouteHandleService: FsNavRouteHandleService) {

  }

  public ngOnInit() {

    this.route.params.subscribe(params => {

      new Promise((resolve) => {
        if (!params.<%= camelize(singleModel) %>_id) {
          return resolve();
        }

        this.<%= camelize(service) %>Service.get(params.<%= camelize(singleModel) %>_id)
          .subscribe(<%= camelize(singleModel) %> => {
            resolve(<%= camelize(singleModel) %>);
          });

      }).then((<%= camelize(singleModel) %>) => {
        this.<%= camelize(singleModel) %> = <%= camelize(singleModel) %> || {};
        this.navRouteHandleService.setTitle(this.<%= camelize(singleModel) %>.id ? 'Edit <%= capitalize(name)%>' : 'Create <%= capitalize(name)%>');
      });
    });
  }

  public save() {
    this.<%= camelize(service) %>Service.save(this.<%= camelize(singleModel) %>)
      .subscribe(response => {
        this.fsMessage.success('Saved Changes');
    })
  }
}
