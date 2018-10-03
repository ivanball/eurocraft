import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { UnitMeasure } from "../models/unitmeasure";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class UnitMeasureService {
  private baseUrl: string = environment.baseUrl + "/UnitMeasures";

  constructor(private http: HttpClient) {}

  getUnitMeasures(): Observable<UnitMeasure[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getProducts: ' + JSON.stringify(data))),
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

  getUnitMeasures2(
    unitMeasureDataSourceParameters: DataSourceParameters
  ): Observable<UnitMeasure[]> {
    var filters = unitMeasureDataSourceParameters.filters;
    var sortColumn = unitMeasureDataSourceParameters.sortColumn
      ? unitMeasureDataSourceParameters.sortColumn
      : "UnitMeasureName"; // default Column for sorting
    var sortDirection = unitMeasureDataSourceParameters.sortDirection
      ? unitMeasureDataSourceParameters.sortDirection
      : "";
    var pageIndex = unitMeasureDataSourceParameters.pageIndex
      ? unitMeasureDataSourceParameters.pageIndex
      : 0;
    var pageSize = unitMeasureDataSourceParameters.pageSize
      ? unitMeasureDataSourceParameters.pageSize
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
      //        tap(data => console.log('getUnitMeasures: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getUnitMeasure(id: number): Observable<UnitMeasure> {
    if (id === 0) {
      return of(this.initializeUnitMeasure());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<UnitMeasure>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getUnitMeasure: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createUnitMeasure(unitMeasure: UnitMeasure): Observable<UnitMeasure> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, unitMeasure, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createUnitMeasure: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateUnitMeasure(unitMeasure: UnitMeasure): Observable<UnitMeasure> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${unitMeasure.UnitMeasureId})`;
    return this.http.put(url, unitMeasure, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateUnitMeasure: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteUnitMeasure(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteUnitMeasure: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveUnitMeasure(unitMeasure: UnitMeasure): Observable<UnitMeasure> {
    if (unitMeasure.UnitMeasureId === 0) {
      return this.createUnitMeasure(unitMeasure);
    }
    return this.updateUnitMeasure(unitMeasure);
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

  initializeUnitMeasure(): UnitMeasure {
    return {
      UnitMeasureId: 0,
      UnitMeasureCode: "",
      UnitMeasureName: ""
    };
  }
}
