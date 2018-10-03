import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { PhoneNumberType } from "../models/phonenumbertype";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class PhoneNumberTypeService {
  private baseUrl: string = environment.baseUrl + "/PhoneNumberTypes";

  constructor(private http: HttpClient) {}

  getPhoneNumberTypes(): Observable<PhoneNumberType[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getPhoneNumberTypes: ' + JSON.stringify(data))),
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

  getPhoneNumberTypes2(
    phoneNumberTypeDataSourceParameters: DataSourceParameters
  ): Observable<PhoneNumberType[]> {
    var filters = phoneNumberTypeDataSourceParameters.filters;
    var sortColumn = phoneNumberTypeDataSourceParameters.sortColumn
      ? phoneNumberTypeDataSourceParameters.sortColumn
      : "PhoneNumberTypeName"; // default Column for sorting
    var sortDirection = phoneNumberTypeDataSourceParameters.sortDirection
      ? phoneNumberTypeDataSourceParameters.sortDirection
      : "";
    var pageIndex = phoneNumberTypeDataSourceParameters.pageIndex
      ? phoneNumberTypeDataSourceParameters.pageIndex
      : 0;
    var pageSize = phoneNumberTypeDataSourceParameters.pageSize
      ? phoneNumberTypeDataSourceParameters.pageSize
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
      //        tap(data => console.log('getPhoneNumberTypes: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getPhoneNumberType(id: number): Observable<PhoneNumberType> {
    if (id === 0) {
      return of(this.initializePhoneNumberType());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<PhoneNumberType>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getPhoneNumberType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createPhoneNumberType(
    phoneNumberType: PhoneNumberType
  ): Observable<PhoneNumberType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, phoneNumberType, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createPhoneNumberType: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updatePhoneNumberType(
    phoneNumberType: PhoneNumberType
  ): Observable<PhoneNumberType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${phoneNumberType.PhoneNumberTypeId})`;
    return this.http.put(url, phoneNumberType, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updatePhoneNumberType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deletePhoneNumberType(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deletePhoneNumberType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  savePhoneNumberType(
    phoneNumberType: PhoneNumberType
  ): Observable<PhoneNumberType> {
    if (phoneNumberType.PhoneNumberTypeId === 0) {
      return this.createPhoneNumberType(phoneNumberType);
    }
    return this.updatePhoneNumberType(phoneNumberType);
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

  initializePhoneNumberType(): PhoneNumberType {
    return {
      PhoneNumberTypeId: 0,
      PhoneNumberTypeName: ""
    };
  }
}
