import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ProductSubcategory } from "../models/productsubcategory";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class ProductSubcategoryService {
  private baseUrl: string = environment.baseUrl + "/ProductSubcategories";

  constructor(private http: HttpClient) {}

  getProductSubcategories(): Observable<ProductSubcategory[]> {
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

  getProductSubcategories2(
    productSubcategoryDataSourceParameters: DataSourceParameters
  ): Observable<ProductSubcategory[]> {
    var filters = productSubcategoryDataSourceParameters.filters;
    var sortColumn = productSubcategoryDataSourceParameters.sortColumn
      ? productSubcategoryDataSourceParameters.sortColumn
      : "ProductSubcategoryName"; // default Column for sorting
    var sortDirection = productSubcategoryDataSourceParameters.sortDirection
      ? productSubcategoryDataSourceParameters.sortDirection
      : "";
    var pageIndex = productSubcategoryDataSourceParameters.pageIndex
      ? productSubcategoryDataSourceParameters.pageIndex
      : 0;
    var pageSize = productSubcategoryDataSourceParameters.pageSize
      ? productSubcategoryDataSourceParameters.pageSize
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
      //        tap(data => console.log('getProductSubcategories: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getProductSubcategory(id: number): Observable<ProductSubcategory> {
    if (id === 0) {
      return of(this.initializeProductSubcategory());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<ProductSubcategory>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getProductSubcategory: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createProductSubcategory(
    productSubcategory: ProductSubcategory
  ): Observable<ProductSubcategory> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, productSubcategory, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createProductSubcategory: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateProductSubcategory(
    productSubcategory: ProductSubcategory
  ): Observable<ProductSubcategory> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${productSubcategory.ProductSubcategoryId})`;
    return this.http
      .put(url, productSubcategory, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('updateProductSubcategory: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  deleteProductSubcategory(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteProductSubcategory: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveProductSubcategory(
    productSubcategory: ProductSubcategory
  ): Observable<ProductSubcategory> {
    if (productSubcategory.ProductSubcategoryId === 0) {
      return this.createProductSubcategory(productSubcategory);
    }
    return this.updateProductSubcategory(productSubcategory);
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

  initializeProductSubcategory(): ProductSubcategory {
    return {
      ProductSubcategoryId: 0,
      ProductSubcategoryName: "",
      ProductCategoryId: null
    };
  }
}
