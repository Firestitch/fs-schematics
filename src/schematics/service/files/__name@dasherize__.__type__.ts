import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsApi } from '@firestitch/api';


@Injectable(<% if (type === 'data'){ %>{
  providedIn: 'root'
}<% } %>)
export class <%= classify(name) %><% if (type === 'service'){ %>Service<%} else {%>Data<%}%> {
  constructor(private _api: FsApi) {}

  public get(id, query = {}): Observable<any> {
    return this._api.get(`<%= lowercasePluralName %>/${id}`, query, { key: '<%= snakeCaseName %>' });
  }

  public gets(data = {}, config = {}): Observable<any> {
    return this._api.request('GET', `<%= lowercasePluralName %>`, data, Object.assign({ key: '<%= plualSnakeCaseName %>' }, config));
  }

  public put(data, config = {}): Observable<any> {
    return this._api.put(`<%= lowercasePluralName %>/${data.id}`, data, Object.assign({ key: '<%= snakeCaseName %>' }, config));
  }

  public post(data): Observable<any> {
    return this._api.post(`<%= lowercasePluralName %>`, data, { key: '<%= snakeCaseName %>' });
  }

  public delete(data): Observable<any> {
    return this._api.delete(`<%= lowercasePluralName %>/${data.id}`, data, { key: '<%= snakeCaseName %>' });
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }
}
