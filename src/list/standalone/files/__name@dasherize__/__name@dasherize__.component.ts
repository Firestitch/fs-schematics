import { Component, OnInit, ViewChild } from '@angular/core';
import { FsListComponent, FsListConfig } from '@firestitch/list';
import { of } from 'rxjs';

@Component({
  selector: 'app-<%=dasherize(name)%>',
  templateUrl: './<%=dasherize(name)%>.component.html',
})
export class <%= classify(name) %>Component implements OnInit {

  @ViewChild('<%=classify(name)%>Table')
  public table: FsListComponent;

  public config: FsListConfig;

  public ngOnInit() {

    this.config = {
      heading: '<%= classify(name) %>',
      filters: [
        {
          name: 'keyword',
          type: 'text',
          label: 'Search'
        }
      ],
      fetch: (query) => {
        return of({
          data: [
            {
              id: 1,
              name: 'Name'
            }
          ]
        });
      }
    };
  }
}
