import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { AddressType } from "../models/addresstype";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class AddressTypeService {
  private baseUrl: string = environment.baseUrl + "/AddressTypes";

  constructor(private http: HttpClient) {}

  getAddressTypes(): Observable<AddressType[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getAddressTypes: ' + JSON.stringify(data))),
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

  getAddressTypes2(
    addressTypeDataSourceParameters: DataSourceParameters
  ): Observable<AddressType[]> {
    var filters = addressTypeDataSourceParameters.filters;
    var sortColumn = addressTypeDataSourceParameters.sortColumn
      ? addressTypeDataSourceParameters.sortColumn
      : "AddressTypeName"; // default Column for sorting
    var sortDirection = addressTypeDataSourceParameters.sortDirection
      ? addressTypeDataSourceParameters.sortDirection
      : "";
    var pageIndex = addressTypeDataSourceParameters.pageIndex
      ? addressTypeDataSourceParameters.pageIndex
      : 0;
    var pageSize = addressTypeDataSourceParameters.pageSize
      ? addressTypeDataSourceParameters.pageSize
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
      //        tap(data => console.log('getAddressTypes: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getAddressType(id: number): Observable<AddressType> {
    if (id === 0) {
      return of(this.initializeAddressType());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<AddressType>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getAddressType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createAddressType(addressType: AddressType): Observable<AddressType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, addressType, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createAddressType: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateAddressType(addressType: AddressType): Observable<AddressType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${addressType.AddressTypeId})`;
    return this.http.put(url, addressType, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateAddressType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteAddressType(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteAddressType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveAddressType(addressType: AddressType): Observable<AddressType> {
    if (addressType.AddressTypeId === 0) {
      return this.createAddressType(addressType);
    }
    return this.updateAddressType(addressType);
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

  initializeAddressType(): AddressType {
    return {
      AddressTypeId: 0,
      AddressTypeName: ""
    };
  }
}
