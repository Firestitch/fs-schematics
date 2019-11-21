import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FsApi, RequestConfig } from '@firestitch/api';


@Injectable(<% if (type === 'data'){ %>{
  providedIn: 'root'
}<% } %>)
export class <%= classify(name) %><% if (type === 'service'){ %>Service<%} else {%>Data<%}%> {
  constructor(private _api: FsApi) {}

  public get(id, query = {}, config: RequestConfig = {}): Observable<any> {
    return this._api.get(`<%= lowercasePluralName %>/${id}`, query, Object.assign({ key: '<%= snakeCaseName %>' }, config));
  }

  public gets(data = {}, config: RequestConfig = {}): Observable<any> {
    return this._api.request('GET', `<%= lowercasePluralName %>`, data, Object.assign({ key: '<%= plualSnakeCaseName %>' }, config));
  }

  public put(data, config: RequestConfig = {}): Observable<any> {
    return this._api.put(`<%= lowercasePluralName %>/${data.id}`, data, Object.assign({ key: '<%= snakeCaseName %>' }, config));
  }

  public post(data, config: RequestConfig = {}): Observable<any> {
    return this._api.post(`<%= lowercasePluralName %>`, data, Object.assign({ key: '<%= snakeCaseName %>' }, config));
  }

  public delete(data, config: RequestConfig = {}): Observable<any> {
    return this._api.delete(`<%= lowercasePluralName %>/${data.id}`, data, Object.assign({ key: '<%= snakeCaseName %>' }, config));
  }

  public save(data): Observable<any> {
    if (data.id) {
      return this.put(data);
    }
    return this.post(data);
  }
}
