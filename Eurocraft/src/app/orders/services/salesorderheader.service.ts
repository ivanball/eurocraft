import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { SalesOrderHeader } from "../models/salesorderheader";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class SalesOrderHeaderService {
  private baseUrl: string = environment.baseUrl + "/SalesOrderHeaders";

  constructor(private http: HttpClient) {}

  getSalesOrderHeaders(): Observable<SalesOrderHeader[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getSalesOrderHeaders: ' + JSON.stringify(data))),
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

  getSalesOrderHeaders2(
    salesOrderHeaderDataSourceParameters: DataSourceParameters
  ): Observable<SalesOrderHeader[]> {
    var filters = salesOrderHeaderDataSourceParameters.filters;
    var sortColumn = salesOrderHeaderDataSourceParameters.sortColumn
      ? salesOrderHeaderDataSourceParameters.sortColumn
      : "SalesOrderNo"; // default Column for sorting
    var sortDirection = salesOrderHeaderDataSourceParameters.sortDirection
      ? salesOrderHeaderDataSourceParameters.sortDirection
      : "";
    var pageIndex = salesOrderHeaderDataSourceParameters.pageIndex
      ? salesOrderHeaderDataSourceParameters.pageIndex
      : 0;
    var pageSize = salesOrderHeaderDataSourceParameters.pageSize
      ? salesOrderHeaderDataSourceParameters.pageSize
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
      //        tap(data => console.log('getSalesOrderHeaders: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getSalesOrderHeader(id: number): Observable<SalesOrderHeader> {
    if (id === 0) {
      return of(this.initializeSalesOrderHeader());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<SalesOrderHeader>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getSalesOrderHeader: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createSalesOrderHeader(
    salesOrderHeader: SalesOrderHeader
  ): Observable<SalesOrderHeader> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, salesOrderHeader, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createSalesOrderHeader: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateSalesOrderHeader(
    salesOrderHeader: SalesOrderHeader
  ): Observable<SalesOrderHeader> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${salesOrderHeader.SalesOrderId})`;
    return this.http.put(url, salesOrderHeader, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateSalesOrderHeader: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteSalesOrderHeader(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteSalesOrderHeader: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveSalesOrderHeader(
    salesOrderHeader: SalesOrderHeader
  ): Observable<SalesOrderHeader> {
    if (salesOrderHeader.SalesOrderId === 0) {
      return this.createSalesOrderHeader(salesOrderHeader);
    }
    return this.updateSalesOrderHeader(salesOrderHeader);
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

  initializeSalesOrderHeader(): SalesOrderHeader {
    return {
      SalesOrderId: 0,
      RevisionNumber: 0,
      SalesOrderNo: "",
      OrderDate: new Date(),
      DueDate: new Date(),
      ShipDate: null,
      Status: 0,
      DealerId: 0,
      SalesPersonId: null,
      BillToAddressId: null,
      ShipToAddressId: null,
      ShipMethodId: null,
      SubTotal: 0,
      TaxAmt: 0,
      Freight: 0,
      TotalDue: 0,
      Comment: "",

      DealerName: ""
    };
  }
}
