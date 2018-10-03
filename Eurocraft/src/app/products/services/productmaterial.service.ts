import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { ProductMaterial } from "../models/productmaterial";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class ProductMaterialService {
  private baseUrl: string = environment.baseUrl + "/ProductMaterials";

  constructor(private http: HttpClient) {}

  getProductMaterials(): Observable<ProductMaterial[]> {
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

  getProductMaterials2(
    productMaterialDataSourceParameters: DataSourceParameters
  ): Observable<ProductMaterial[]> {
    var filters = productMaterialDataSourceParameters.filters;
    var sortColumn = productMaterialDataSourceParameters.sortColumn
      ? productMaterialDataSourceParameters.sortColumn
      : "ProductMaterialName"; // default Column for sorting
    var sortDirection = productMaterialDataSourceParameters.sortDirection
      ? productMaterialDataSourceParameters.sortDirection
      : "";
    var pageIndex = productMaterialDataSourceParameters.pageIndex
      ? productMaterialDataSourceParameters.pageIndex
      : 0;
    var pageSize = productMaterialDataSourceParameters.pageSize
      ? productMaterialDataSourceParameters.pageSize
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
      //        tap(data => console.log('getProductMaterials: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getProductMaterial(id: number): Observable<ProductMaterial> {
    if (id === 0) {
      return of(this.initializeProductMaterial());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<ProductMaterial>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getProductMaterial: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createProductMaterial(
    productMaterial: ProductMaterial
  ): Observable<ProductMaterial> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, productMaterial, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createProductMaterial: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateProductMaterial(
    productMaterial: ProductMaterial
  ): Observable<ProductMaterial> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${productMaterial.ProductMaterialId})`;
    return this.http.put(url, productMaterial, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateProductMaterial: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteProductMaterial(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteProductMaterial: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveProductMaterial(
    productMaterial: ProductMaterial
  ): Observable<ProductMaterial> {
    if (productMaterial.ProductMaterialId === 0) {
      return this.createProductMaterial(productMaterial);
    }
    return this.updateProductMaterial(productMaterial);
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

  initializeProductMaterial(): ProductMaterial {
    return {
      ProductMaterialId: 0,
      ProductMaterialName: ""
    };
  }
}
