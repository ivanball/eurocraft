import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Dealer } from "../models/dealer";
import { DataSourceParameters } from "../../shared/datasource.parameters";
import { BusinessEntity } from "../models/businessentity";

@Injectable({
  providedIn: "root"
})
export class DealerService {
  private baseUrl: string = environment.baseUrl + "/Dealers";

  constructor(private http: HttpClient) {}

  getDealers(): Observable<Dealer[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getDealers: ' + JSON.stringify(data))),
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

  getDealers2(
    dealerDataSourceParameters: DataSourceParameters
  ): Observable<Dealer[]> {
    var filters = dealerDataSourceParameters.filters;
    var sortColumn = dealerDataSourceParameters.sortColumn
      ? dealerDataSourceParameters.sortColumn
      : "DealerName"; // default Column for sorting
    var sortDirection = dealerDataSourceParameters.sortDirection
      ? dealerDataSourceParameters.sortDirection
      : "";
    var pageIndex = dealerDataSourceParameters.pageIndex
      ? dealerDataSourceParameters.pageIndex
      : 0;
    var pageSize = dealerDataSourceParameters.pageSize
      ? dealerDataSourceParameters.pageSize
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
      //        tap(data => console.log('getDealers: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getDealer(id: number): Observable<Dealer> {
    if (id === 0) {
      return of(this.initializeDealer());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<Dealer>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getDealer: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createDealer(dealer: Dealer): Observable<Dealer> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(this.baseUrl, dealer, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('createDealer: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  updateDealer(dealer: Dealer): Observable<Dealer> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${dealer.BusinessEntityId})`;
    return this.http.put(url, dealer, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateDealer: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteDealer(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteDealer: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveDealer(dealer: Dealer): Observable<Dealer> {
    if (dealer.BusinessEntityId === 0) {
      return this.createDealer(dealer);
    }
    return this.updateDealer(dealer);
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

  initializeDealer(): Dealer {
    return {
      BusinessEntityId: 0,
      ParentBusinessEntityId: null,
      DealerName: "",
      DealerTypeId: null,
      AccountNumber: "",
      Website: "",
      IsTaxExempt: "N",
      PaymentTerms: "",
      PricingLevel: null,
      CreditAmount: null,
      BusinessEntity: new BusinessEntity(),
      PhoneNumber: null,
      AddressCity: null
    };
  }
}
