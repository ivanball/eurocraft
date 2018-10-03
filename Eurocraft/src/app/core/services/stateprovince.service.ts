import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { StateProvince } from "../models/stateprovince";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class StateProvinceService {
  private baseUrl: string = environment.baseUrl + "/StateProvinces";

  constructor(private http: HttpClient) {}

  getStateProvinces(): Observable<StateProvince[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getStateProvinces: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  concatQueryStringParameters(qsp1, qsp2: string): string {
    if (qsp1) {
      return qsp1 + "&" + qsp2;
    } else {
      return "?" + qsp2;
    }
  }

  getStateProvinces2(
    stateProvinceDataSourceParameters: DataSourceParameters
  ): Observable<StateProvince[]> {
    var filters = stateProvinceDataSourceParameters.filters;
    var sortColumn = stateProvinceDataSourceParameters.sortColumn
      ? stateProvinceDataSourceParameters.sortColumn
      : "StateProvinceName"; // default Column for sorting
    var sortDirection = stateProvinceDataSourceParameters.sortDirection
      ? stateProvinceDataSourceParameters.sortDirection
      : "";
    var pageIndex = stateProvinceDataSourceParameters.pageIndex
      ? stateProvinceDataSourceParameters.pageIndex
      : 0;
    var pageSize = stateProvinceDataSourceParameters.pageSize
      ? stateProvinceDataSourceParameters.pageSize
      : 5;

    var queryStringParameters = null;

    // include count of total rows
    queryStringParameters = this.concatQueryStringParameters(
      queryStringParameters,
      "$count=true"
    );

    // order by
    if (sortColumn && sortDirection) {
      queryStringParameters = this.concatQueryStringParameters(
        queryStringParameters,
        "$orderby=" + sortColumn
      );
      queryStringParameters = queryStringParameters + " " + sortDirection;
    }

    // paging
    queryStringParameters = this.concatQueryStringParameters(
      queryStringParameters,
      "$top=" + pageSize
    );
    queryStringParameters = this.concatQueryStringParameters(
      queryStringParameters,
      "$skip=" + pageIndex * pageSize
    );

    // filter
    var filterQueryString: string = "";
    for (let i in filters) {
      if (filters[i].FilterValue != "") {
        if (filterQueryString == "") {
          filterQueryString =
            "(contains(tolower(" +
            filters[i].ColumnName +
            "),'" +
            filters[i].FilterValue.toLowerCase() +
            "'))";
        } else {
          filterQueryString =
            filterQueryString +
            " and (contains(tolower(" +
            filters[i].ColumnName +
            "),'" +
            filters[i].FilterValue.toLowerCase() +
            "'))";
        }
      }
    }
    if (filterQueryString != "") {
      queryStringParameters = this.concatQueryStringParameters(
        queryStringParameters,
        "$filter=" + filterQueryString
      );
    }

    return this.http.get(this.baseUrl + queryStringParameters).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getStateProvinces: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getStateProvince(id: number): Observable<StateProvince> {
    if (id === 0) {
      return of(this.initializeStateProvince());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<StateProvince>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getStateProvince: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createStateProvince(stateProvince: StateProvince): Observable<StateProvince> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, stateProvince, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createStateProvince: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateStateProvince(stateProvince: StateProvince): Observable<StateProvince> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${stateProvince.StateProvinceId})`;
    return this.http.put(url, stateProvince, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateStateProvince: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteStateProvince(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteStateProvince: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveStateProvince(stateProvince: StateProvince): Observable<StateProvince> {
    if (stateProvince.StateProvinceId === 0) {
      return this.createStateProvince(stateProvince);
    }
    return this.updateStateProvince(stateProvince);
  }

  private extractData(response: Response) {
    //    console.log('extractData: ', response);
    return response || {};
  }

  private handleError(errorResponse: HttpErrorResponse): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(errorResponse);
    var errorMessage = errorResponse.message;
    if (errorResponse.error && errorResponse.error.value) {
      errorMessage =
        errorResponse.error.value + " (" + errorResponse.message + ").";
    }
    return throwError(errorMessage || "Server error");
  }

  initializeStateProvince(): StateProvince {
    return {
      StateProvinceId: 0,
      StateProvinceCode: "",
      StateProvinceName: "",
      CountryRegionId: null,
      CountryRegionName: ""
    };
  }
}
