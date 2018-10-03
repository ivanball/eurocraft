import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ProductModel } from "../models/productmodel";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class ProductModelService {
  private baseUrl: string = environment.baseUrl + "/ProductModels";

  constructor(private http: HttpClient) {}

  getProductModels(): Observable<ProductModel[]> {
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

  getProductModels2(
    productModelDataSourceParameters: DataSourceParameters
  ): Observable<ProductModel[]> {
    var filters = productModelDataSourceParameters.filters;
    var sortColumn = productModelDataSourceParameters.sortColumn
      ? productModelDataSourceParameters.sortColumn
      : "ProductModelName"; // default Column for sorting
    var sortDirection = productModelDataSourceParameters.sortDirection
      ? productModelDataSourceParameters.sortDirection
      : "";
    var pageIndex = productModelDataSourceParameters.pageIndex
      ? productModelDataSourceParameters.pageIndex
      : 0;
    var pageSize = productModelDataSourceParameters.pageSize
      ? productModelDataSourceParameters.pageSize
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
      //        tap(data => console.log('getProductModels: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getProductModel(id: number): Observable<ProductModel> {
    if (id === 0) {
      return of(this.initializeProductModel());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<ProductModel>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getProductModel: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createProductModel(productModel: ProductModel): Observable<ProductModel> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, productModel, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createProductModel: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateProductModel(productModel: ProductModel): Observable<ProductModel> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${productModel.ProductModelId})`;
    return this.http.put(url, productModel, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateProductModel: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteProductModel(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteProductModel: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveProductModel(productModel: ProductModel): Observable<ProductModel> {
    if (productModel.ProductModelId === 0) {
      return this.createProductModel(productModel);
    }
    return this.updateProductModel(productModel);
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

  initializeProductModel(): ProductModel {
    return {
      ProductModelId: 0,
      ProductModelName: ""
    };
  }
}
