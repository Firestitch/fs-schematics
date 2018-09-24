import { NgModule } from '@angular/core';

import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';

@NgModule({
  imports: [<%= classify(name) %>RoutingModule],
  declarations: []
})
export class <%= classify(name) %>Module { }
