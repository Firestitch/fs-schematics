import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';


@Injectable()
export class <%= classify(name) %><% if (type === 'service'){ %>Service<%} else {%>Data<%}%> {
  constructor(private _api: FsApi) {
  }

  public get(<%= name %>_id, query = {}): Observable<any> {
      return this._api.get(`<%= lowercasePluralName %>/${<%= name %>_id}`, query, { key: '<%= snakeCaseName %>' });
  }

  public gets(data = {}, config = {}): Observable<any> {
      return this._api.request('GET', '<%= lowercasePluralName %>', data, Object.assign({ key: '<%= plualSnakeCaseName %>' }, config));
  }

  public put(<%= name %>, config = {}): Observable<any> {
      return this._api.put(`<%= lowercasePluralName %>/${<%= name %>.id}`, <%= name %>, Object.assign({ key: '<%= snakeCaseName %>' }, config));
  }

  public post(<%= name %>): Observable<any> {
      return this._api.post('<%= lowercasePluralName %>', <%= name %>, { key: '<%= snakeCaseName %>' });
  }

  public delete(<%= name %>): Observable<any> {
      return this._api.delete(`<%= lowercasePluralName %>/${<%= name %>.id}`, <%= name %>, { key: '<%= snakeCaseName %>' });
  }

  public save(data): Observable<any> {
      if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }

}
