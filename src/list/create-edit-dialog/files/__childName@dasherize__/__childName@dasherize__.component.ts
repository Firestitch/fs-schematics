import { Component } from '@angular/core';

@Component({
  selector: 'app-<%=dasherize(name)%>-create',
  templateUrl: './<%=dasherize(childName)%>.component.html'
})
export class <%= classify(name) %>Component {

  public save() {

  }
}
