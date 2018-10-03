import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ProductType } from "../models/producttype";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class ProductTypeService {
  private baseUrl: string = environment.baseUrl + "/ProductTypes";

  constructor(private http: HttpClient) {}

  getProductTypes(): Observable<ProductType[]> {
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

  getProductTypes2(
    productTypeDataSourceParameters: DataSourceParameters
  ): Observable<ProductType[]> {
    var filters = productTypeDataSourceParameters.filters;
    var sortColumn = productTypeDataSourceParameters.sortColumn
      ? productTypeDataSourceParameters.sortColumn
      : "ProductTypeName"; // default Column for sorting
    var sortDirection = productTypeDataSourceParameters.sortDirection
      ? productTypeDataSourceParameters.sortDirection
      : "";
    var pageIndex = productTypeDataSourceParameters.pageIndex
      ? productTypeDataSourceParameters.pageIndex
      : 0;
    var pageSize = productTypeDataSourceParameters.pageSize
      ? productTypeDataSourceParameters.pageSize
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
      //        tap(data => console.log('getProductTypes: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getProductType(id: number): Observable<ProductType> {
    if (id === 0) {
      return of(this.initializeProductType());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<ProductType>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getProductType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createProductType(productType: ProductType): Observable<ProductType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, productType, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createProductType: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateProductType(productType: ProductType): Observable<ProductType> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${productType.ProductTypeId})`;
    return this.http.put(url, productType, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateProductType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteProductType(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteProductType: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveProductType(productType: ProductType): Observable<ProductType> {
    if (productType.ProductTypeId === 0) {
      return this.createProductType(productType);
    }
    return this.updateProductType(productType);
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

  initializeProductType(): ProductType {
    return {
      ProductTypeId: 0,
      ProductTypeName: ""
    };
  }
}
