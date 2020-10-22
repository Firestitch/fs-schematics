import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable(<% if (type === 'data'){ %>{
  providedIn: 'root',
}<% } %>)
export class <%= classify(name) %><% if (type === 'service'){ %>Service<%} else {%>Data<%}%><T = any> {

  constructor(private _api: FsApi) {}

  public get(id: number, query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.get(
      `<%= lowercasePluralName %>/${id}`,
      query,
      {
        key: '<%= camelCaseName %>',
        ...config,
      },
    );
  }

  public gets<any>(query: any = {}, config: RequestConfig = {}): Observable<T> {
    return this._api.request(
      'GET',
      '<%= lowercasePluralName %>',
      query,
      {
        key: '<%= plualCamelCaseName %>',
        ...config,
      },
    );
  }

  public put(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.put(
      `<%= lowercasePluralName %>/${data.id}`,
      data,
      {
        key: '<%= camelCaseName %>',
        ...config,
      },
    );
  }

  public post(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.post(
      '<%= lowercasePluralName %>',
      data,
      {
        key: '<%= camelCaseName %>',
        ...config,
      },
    );
  }

  public delete(data: any, config: RequestConfig = {}): Observable<T> {
    return this._api.delete(
      `<%= lowercasePluralName %>/${data.id}`,
      data,
      {
        key: '<%= camelCaseName %>',
        ...config,
      },
    );
  }

  public save(data: any): Observable<T> {
    return (data.id)
      ? this.put(data)
      : this.post(data);
  }

}
