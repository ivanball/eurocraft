import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ProductCategory } from "../models/productcategory";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class ProductCategoryService {
  private baseUrl: string = environment.baseUrl + "/ProductCategories";

  constructor(private http: HttpClient) {}

  getProductCategories(): Observable<ProductCategory[]> {
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

  getProductCategories2(
    productCategoryDataSourceParameters: DataSourceParameters
  ): Observable<ProductCategory[]> {
    var filters = productCategoryDataSourceParameters.filters;
    var sortColumn = productCategoryDataSourceParameters.sortColumn
      ? productCategoryDataSourceParameters.sortColumn
      : "ProductCategoryName"; // default Column for sorting
    var sortDirection = productCategoryDataSourceParameters.sortDirection
      ? productCategoryDataSourceParameters.sortDirection
      : "";
    var pageIndex = productCategoryDataSourceParameters.pageIndex
      ? productCategoryDataSourceParameters.pageIndex
      : 0;
    var pageSize = productCategoryDataSourceParameters.pageSize
      ? productCategoryDataSourceParameters.pageSize
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
      //        tap(data => console.log('getProductCategories: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getProductCategory(id: number): Observable<ProductCategory> {
    if (id === 0) {
      return of(this.initializeProductCategory());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<ProductCategory>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getProductCategory: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createProductCategory(
    productCategory: ProductCategory
  ): Observable<ProductCategory> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, productCategory, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createProductCategory: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateProductCategory(
    productCategory: ProductCategory
  ): Observable<ProductCategory> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${productCategory.ProductCategoryId})`;
    return this.http.put(url, productCategory, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateProductCategory: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteProductCategory(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteProductCategory: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveProductCategory(
    productCategory: ProductCategory
  ): Observable<ProductCategory> {
    if (productCategory.ProductCategoryId === 0) {
      return this.createProductCategory(productCategory);
    }
    return this.updateProductCategory(productCategory);
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

  initializeProductCategory(): ProductCategory {
    return {
      ProductCategoryId: 0,
      ProductCategoryName: "",
      ProductMaterialId: null,
      ProductMaterialName: null,
      ProductModelId: null,
      ProductModelName: null,
      ProductTypeId: null,
      ProductTypeName: null,
      ProductUseId: null,
      ProductUseName: null
    };
  }
}
