import { NgModule } from '@angular/core';<% if (routing) { %>

import { <%= classify(name) %>RoutingModule } from './<%= dasherize(name) %>-routing.module';<% } %>


@NgModule({
  imports: [
    <% if (routing) { %><%= classify(name) %>RoutingModule,<% } %>
  ],
  declarations: [
  ],
})
export class <%= classify(name) %>Module { }
