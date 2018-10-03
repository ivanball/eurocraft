import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { map, tap, catchError } from "rxjs/operators";

import { environment } from "../../../environments/environment";
import { BillOfMaterial } from "../models/billofmaterial";
import { DataSourceParameters } from "../../shared/datasource.parameters";

@Injectable({
  providedIn: "root"
})
export class BillOfMaterialService {
  private baseUrl: string = environment.baseUrl + "/BillOfMaterials";

  constructor(private http: HttpClient) {}

  getBillOfMaterials(): Observable<BillOfMaterial[]> {
    return this.http.get<any>(this.baseUrl + "?$count=true").pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getBillOfMaterials: ' + JSON.stringify(data))),
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

  getBillOfMaterials2(
    billOfMaterialDataSourceParameters: DataSourceParameters
  ): Observable<BillOfMaterial[]> {
    var filters = billOfMaterialDataSourceParameters.filters;
    var sortColumn = billOfMaterialDataSourceParameters.sortColumn
      ? billOfMaterialDataSourceParameters.sortColumn
      : "ProductAssemblyName"; // default Column for sorting
    var sortDirection = billOfMaterialDataSourceParameters.sortDirection
      ? billOfMaterialDataSourceParameters.sortDirection
      : "";
    var pageIndex = billOfMaterialDataSourceParameters.pageIndex
      ? billOfMaterialDataSourceParameters.pageIndex
      : 0;
    var pageSize = billOfMaterialDataSourceParameters.pageSize
      ? billOfMaterialDataSourceParameters.pageSize
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
      //        tap(data => console.log('getBillOfMaterials: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  getBillOfMaterial(id: number): Observable<BillOfMaterial> {
    if (id === 0) {
      return of(this.initializeBillOfMaterial());
    }
    const url = `${this.baseUrl}(${id})`;
    return this.http.get<BillOfMaterial>(url).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('getBillOfMaterial: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  createBillOfMaterial(
    billOfMaterial: BillOfMaterial
  ): Observable<BillOfMaterial> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    return this.http
      .post(this.baseUrl, billOfMaterial, { headers: httpHeaders })
      .pipe(
        map((res: Response) => this.extractData(res)),
        //        tap(data => console.log('createBillOfMaterial: ' + JSON.stringify(data))),
        catchError(this.handleError)
      );
  }

  updateBillOfMaterial(
    billOfMaterial: BillOfMaterial
  ): Observable<BillOfMaterial> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${billOfMaterial.BillOfMaterialsId})`;
    return this.http.put(url, billOfMaterial, { headers: httpHeaders }).pipe(
      map((res: Response) => this.extractData(res)),
      //        tap(data => console.log('updateBillOfMaterial: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  deleteBillOfMaterial(id: number): Observable<Response> {
    const httpHeaders = new HttpHeaders().set(
      "Content-Type",
      "application/json"
    );
    const url = `${this.baseUrl}(${id})`;
    return this.http.delete(url, { headers: httpHeaders }).pipe(
      //        tap(data => console.log('deleteBillOfMaterial: ' + JSON.stringify(data))),
      catchError(this.handleError)
    );
  }

  saveBillOfMaterial(
    billOfMaterial: BillOfMaterial
  ): Observable<BillOfMaterial> {
    if (billOfMaterial.BillOfMaterialsId === 0) {
      return this.createBillOfMaterial(billOfMaterial);
    }
    return this.updateBillOfMaterial(billOfMaterial);
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

  initializeBillOfMaterial(): BillOfMaterial {
    return {
      BillOfMaterialsId: 0,
      ProductAssemblyId: null,
      ProductAssemblyName: null,
      ComponentId: null,
      ComponentName: null,
      HorizontalQuantity: null,
      HorizontalFormula: null,
      VerticalQuantity: null,
      VerticalFormula: null,
      UnitMeasureId: null,
      UnitMeasureName: null
    };
  }
}
