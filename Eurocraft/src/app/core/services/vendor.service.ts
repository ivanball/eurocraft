import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { Vendor } from "../models/vendor";
import { DataSourceParameters } from "../../shared/datasource.parameters";
import { BusinessEntity } from "../models/businessentity";

@Injectable({
  providedIn: "root"
})
export class VendorService {
  private baseUrl: string = environment.baseUrl + "/Vendors";

  constructor(private http: HttpClient) {}

  getVendors(): Observable<Vendor[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getVendors: ' + JSON.stringify(data))),
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

  getVendors2(
    vendorDataSourceParameters: DataSourceParameters
  ): Observable<Vendor[]> {
    var filters = vendorDataSourceParameters.filters;
    var sortColumn = vendorDataSourceParameters.sortColumn
      ? vendorDataSourceParameters.sortColumn
      : "VendorName"; // default Column for sorting
    var sortDirection = vendorDataSourceParameters.sortDirection
      ? vendorDataSourceParameters.sortDirection
      : "";
    var pageIndex = vendorDataSourceParameters.pageIndex
      ? vendorDataSourceParameters.pageIndex
      : 0;
    var pageSize = vendorDataSourceParameters.pageSize
      ? vendorDataSourceParameters.pageSize
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
      //        tap(data => console.log('getVendors: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getVendor(id: number): Observable<Vendor> {
    if (id === 0) {
      return of(this.initializeVendor());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<Vendor>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getVendor: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createVendor(vendor: Vendor): Observable<Vendor> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http.post(this.baseUrl, vendor, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('createVendor: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  updateVendor(vendor: Vendor): Observable<Vendor> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${vendor.BusinessEntityId})`;
    return this.http.put(url, vendor, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateVendor: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteVendor(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteVendor: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveVendor(vendor: Vendor): Observable<Vendor> {
    if (vendor.BusinessEntityId === 0) {
      return this.createVendor(vendor);
    }
    return this.updateVendor(vendor);
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

  initializeVendor(): Vendor {
    return {
      BusinessEntityId: 0,
      VendorName: "",
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
