import { NgModule } from '@angular/core';<% if (routing) { %>
import { SharedModule } from '@app/shared';

import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';<% } %>


@NgModule({
  imports: [
    SharedModule,
    <% if (routing) { %><%= classify(name) %>RoutingModule,<% } %>
  ],
  declarations: [
  ]
})
export class <%= classify(name) %>Module { }
