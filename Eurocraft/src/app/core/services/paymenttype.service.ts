import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { PaymentType } from "../models/paymenttype";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class PaymentTypeService {
  private baseUrl: string = environment.baseUrl + "/PaymentTypes";

  constructor(private http: HttpClient) {}

  getPaymentTypes(): Observable<PaymentType[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getPaymentTypes: ' + JSON.stringify(data))),
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

  getPaymentTypes2(
    paymentTypeDataSourceParameters: DataSourceParameters
  ): Observable<PaymentType[]> {
    var filters = paymentTypeDataSourceParameters.filters;
    var sortColumn = paymentTypeDataSourceParameters.sortColumn
      ? paymentTypeDataSourceParameters.sortColumn
      : "PaymentTypeName"; // default Column for sorting
    var sortDirection = paymentTypeDataSourceParameters.sortDirection
      ? paymentTypeDataSourceParameters.sortDirection
      : "";
    var pageIndex = paymentTypeDataSourceParameters.pageIndex
      ? paymentTypeDataSourceParameters.pageIndex
      : 0;
    var pageSize = paymentTypeDataSourceParameters.pageSize
      ? paymentTypeDataSourceParameters.pageSize
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
      //        tap(data => console.log('getPaymentTypes: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getPaymentType(id: number): Observable<PaymentType> {
    if (id === 0) {
      return of(this.initializePaymentType());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<PaymentType>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getPaymentType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createPaymentType(paymentType: PaymentType): Observable<PaymentType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, paymentType, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createPaymentType: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updatePaymentType(paymentType: PaymentType): Observable<PaymentType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${paymentType.PaymentTypeId})`;
    return this.http.put(url, paymentType, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updatePaymentType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deletePaymentType(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deletePaymentType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  savePaymentType(paymentType: PaymentType): Observable<PaymentType> {
    if (paymentType.PaymentTypeId === 0) {
      return this.createPaymentType(paymentType);
    }
    return this.updatePaymentType(paymentType);
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

  initializePaymentType(): PaymentType {
    return {
      PaymentTypeId: 0,
      PaymentTypeName: ""
    };
  }
}
