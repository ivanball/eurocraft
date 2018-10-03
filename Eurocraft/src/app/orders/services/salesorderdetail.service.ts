import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { SalesOrderDetail } from "../models/salesorderdetail";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class SalesOrderDetailService {
  private baseUrl: string = environment.baseUrl + "/SalesOrderDetails";

  constructor(private http: HttpClient) {}

  getSalesOrderDetails(): Observable<SalesOrderDetail[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getSalesOrderDetails: ' + JSON.stringify(data))),
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

  getSalesOrderDetails2(
    salesOrderDetailDataSourceParameters: DataSourceParameters
  ): Observable<SalesOrderDetail[]> {
    var filters = salesOrderDetailDataSourceParameters.filters;
    var sortColumn = salesOrderDetailDataSourceParameters.sortColumn
      ? salesOrderDetailDataSourceParameters.sortColumn
      : "SalesOrderDetailId"; // default Column for sorting
    var sortDirection = salesOrderDetailDataSourceParameters.sortDirection
      ? salesOrderDetailDataSourceParameters.sortDirection
      : "";
    var pageIndex = salesOrderDetailDataSourceParameters.pageIndex
      ? salesOrderDetailDataSourceParameters.pageIndex
      : 0;
    var pageSize = salesOrderDetailDataSourceParameters.pageSize
      ? salesOrderDetailDataSourceParameters.pageSize
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
      //        tap(data => console.log('getSalesOrderDetails: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getSalesOrderDetail(id: number): Observable<SalesOrderDetail> {
    if (id === 0) {
      return of(this.initializeSalesOrderDetail());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<SalesOrderDetail>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getSalesOrderDetail: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createSalesOrderDetail(
    salesOrderDetail: SalesOrderDetail
  ): Observable<SalesOrderDetail> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, salesOrderDetail, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createSalesOrderDetail: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateSalesOrderDetail(
    salesOrderDetail: SalesOrderDetail
  ): Observable<SalesOrderDetail> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${salesOrderDetail.SalesOrderDetailId})`;
    return this.http.put(url, salesOrderDetail, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateSalesOrderDetail: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteSalesOrderDetail(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteSalesOrderDetail: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveSalesOrderDetail(
    salesOrderDetail: SalesOrderDetail
  ): Observable<SalesOrderDetail> {
    if (salesOrderDetail.SalesOrderDetailId === 0) {
      return this.createSalesOrderDetail(salesOrderDetail);
    }
    return this.updateSalesOrderDetail(salesOrderDetail);
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

  initializeSalesOrderDetail(): SalesOrderDetail {
    return {
      SalesOrderDetailId: 0,
      SalesOrderId: 0,
      OrderQty: 0,
      ProductId: 0,
      HorizontalSize: null,
      VerticalSize: null,
      UnitMeasureId: null,
      UnitPrice: 0,
      UnitPriceDiscount: 0,
      LineTotal: 0,
      Glazing: "",
      HandleColor: "",
      Color: "",
      CarrierTrackingNumber: "",

      ProductName: ""
    };
  }
}
