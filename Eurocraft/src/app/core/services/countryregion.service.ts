import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { CountryRegion } from "../models/countryregion";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class CountryRegionService {
  private baseUrl: string = environment.baseUrl + "/CountryRegions";

  constructor(private http: HttpClient) {}

  getCountryRegions(): Observable<CountryRegion[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getCountryRegions: ' + JSON.stringify(data))),
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

  getCountryRegions2(
    countryRegionDataSourceParameters: DataSourceParameters
  ): Observable<CountryRegion[]> {
    var filters = countryRegionDataSourceParameters.filters;
    var sortColumn = countryRegionDataSourceParameters.sortColumn
      ? countryRegionDataSourceParameters.sortColumn
      : "CountryRegionName"; // default Column for sorting
    var sortDirection = countryRegionDataSourceParameters.sortDirection
      ? countryRegionDataSourceParameters.sortDirection
      : "";
    var pageIndex = countryRegionDataSourceParameters.pageIndex
      ? countryRegionDataSourceParameters.pageIndex
      : 0;
    var pageSize = countryRegionDataSourceParameters.pageSize
      ? countryRegionDataSourceParameters.pageSize
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
      //        tap(data => console.log('getCountryRegions: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getCountryRegion(id: number): Observable<CountryRegion> {
    if (id === 0) {
      return of(this.initializeCountryRegion());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<CountryRegion>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getCountryRegion: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createCountryRegion(countryRegion: CountryRegion): Observable<CountryRegion> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, countryRegion, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createCountryRegion: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateCountryRegion(countryRegion: CountryRegion): Observable<CountryRegion> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${countryRegion.CountryRegionId})`;
    return this.http.put(url, countryRegion, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateCountryRegion: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteCountryRegion(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteCountryRegion: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveCountryRegion(countryRegion: CountryRegion): Observable<CountryRegion> {
    if (countryRegion.CountryRegionId === 0) {
      return this.createCountryRegion(countryRegion);
    }
    return this.updateCountryRegion(countryRegion);
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

  initializeCountryRegion(): CountryRegion {
    return {
      CountryRegionId: 0,
      CountryRegionCode: "",
      CountryRegionName: ""
    };
  }
}
