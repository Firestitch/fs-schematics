import { Component } from '@angular/core';

@Component({<%if(type==='component'){%>
  selector: 'app-<%=dasherize(name)%>',<%}%>
  templateUrl: './<%=dasherize(name)%>.component.html',
  styleUrls: ['./<%=dasherize(name)%>.component.scss']
})
export class <%= classify(name) %>Component {

}
