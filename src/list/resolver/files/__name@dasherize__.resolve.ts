import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { RouteSubject } from '@firestitch/core';

import { <%= classify(serviceName) %> } from '<%= relativeServicePath %>';


@Injectable()
export class <%= classify(name) %>Resolve implements Resolve<any> {

  constructor(private _<%= camelize(serviceName)%>: <%= classify(serviceName) %>) {}

  public resolve(route: ActivatedRouteSnapshot) {
    const routeSubject = new RouteSubject();

    if (!route.params.<%= name %>_id) {
      return routeSubject.next({});
    }

    const query = {};
    return routeSubject.observe(this._<%= camelize(serviceName) %>.get(route.params.<%= name %>_id, query));
  }
}


