import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ProductUse } from "../models/productuse";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class ProductUseService {
  private baseUrl: string = environment.baseUrl + "/ProductUses";

  constructor(private http: HttpClient) {}

  getProductUses(): Observable<ProductUse[]> {
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

  getProductUses2(
    productUseDataSourceParameters: DataSourceParameters
  ): Observable<ProductUse[]> {
    var filters = productUseDataSourceParameters.filters;
    var sortColumn = productUseDataSourceParameters.sortColumn
      ? productUseDataSourceParameters.sortColumn
      : "ProductUseName"; // default Column for sorting
    var sortDirection = productUseDataSourceParameters.sortDirection
      ? productUseDataSourceParameters.sortDirection
      : "";
    var pageIndex = productUseDataSourceParameters.pageIndex
      ? productUseDataSourceParameters.pageIndex
      : 0;
    var pageSize = productUseDataSourceParameters.pageSize
      ? productUseDataSourceParameters.pageSize
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
      //        tap(data => console.log('getProductUses: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getProductUse(id: number): Observable<ProductUse> {
    if (id === 0) {
      return of(this.initializeProductUse());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<ProductUse>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getProductUse: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createProductUse(productUse: ProductUse): Observable<ProductUse> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Use",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, productUse, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createProductUse: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateProductUse(productUse: ProductUse): Observable<ProductUse> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Use",
      "application/json"
    );
    const url = `${this.baseUrl}(${productUse.ProductUseId})`;
    return this.http.put(url, productUse, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateProductUse: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteProductUse(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Use",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteProductUse: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveProductUse(productUse: ProductUse): Observable<ProductUse> {
    if (productUse.ProductUseId === 0) {
      return this.createProductUse(productUse);
    }
    return this.updateProductUse(productUse);
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

  initializeProductUse(): ProductUse {
    return {
      ProductUseId: 0,
      ProductUseName: ""
    };
  }
}
