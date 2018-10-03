import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { DealerType } from "../models/dealertype";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class DealerTypeService {
  private baseUrl: string = environment.baseUrl + "/DealerTypes";

  constructor(private http: HttpClient) {}

  getDealerTypes(): Observable<DealerType[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getDealerTypes: ' + JSON.stringify(data))),
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

  getDealerTypes2(
    dealerTypeDataSourceParameters: DataSourceParameters
  ): Observable<DealerType[]> {
    var filters = dealerTypeDataSourceParameters.filters;
    var sortColumn = dealerTypeDataSourceParameters.sortColumn
      ? dealerTypeDataSourceParameters.sortColumn
      : "DealerTypeName"; // default Column for sorting
    var sortDirection = dealerTypeDataSourceParameters.sortDirection
      ? dealerTypeDataSourceParameters.sortDirection
      : "";
    var pageIndex = dealerTypeDataSourceParameters.pageIndex
      ? dealerTypeDataSourceParameters.pageIndex
      : 0;
    var pageSize = dealerTypeDataSourceParameters.pageSize
      ? dealerTypeDataSourceParameters.pageSize
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
      //        tap(data => console.log('getDealerTypes: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getDealerType(id: number): Observable<DealerType> {
    if (id === 0) {
      return of(this.initializeDealerType());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<DealerType>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getDealerType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createDealerType(dealerType: DealerType): Observable<DealerType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, dealerType, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createDealerType: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateDealerType(dealerType: DealerType): Observable<DealerType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${dealerType.DealerTypeId})`;
    return this.http.put(url, dealerType, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateDealerType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteDealerType(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteDealerType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveDealerType(dealerType: DealerType): Observable<DealerType> {
    if (dealerType.DealerTypeId === 0) {
      return this.createDealerType(dealerType);
    }
    return this.updateDealerType(dealerType);
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

  initializeDealerType(): DealerType {
    return {
      DealerTypeId: 0,
      DealerTypeName: ""
    };
  }
}
