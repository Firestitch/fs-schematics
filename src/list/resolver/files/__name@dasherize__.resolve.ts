import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { RouteSubject } from '@firestitch/core';

import { <%= classify(service) %>Service } from '<%= relativeServicePath %>';


@Injectable()
export class <%= classify(name) %>Resolve implements Resolve<any> {

  constructor(private <%= camelize(service) %>Service: <%= classify(service) %>Service,) {}

  public resolve(route: ActivatedRouteSnapshot) {
    const routeSubject = new RouteSubject();
    if (!route.params.id) {
      return routeSubject.next({});
    }
    return routeSubject.observe(this.<%= camelize(service) %>Service.get(route.params.id));
  }
}
