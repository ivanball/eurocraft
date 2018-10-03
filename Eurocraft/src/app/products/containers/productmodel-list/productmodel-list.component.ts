import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productModelActions from '../../store/actions/productmodel.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductModel } from '../../models/productmodel';
import { ProductModelDialogComponent } from '../productmodel-dialog/productmodel-dialog.component';
import { ProductModelsDataSource } from "../../services/productmodel.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'ProductModelName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-productmodel-list',
  templateUrl: './productmodel-list.component.html',
  styleUrls: ['./productmodel-list.component.scss']
})
export class ProductModelListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product Models';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentProductModel: ProductModel | null;
  dataSource: ProductModelsDataSource;
  filters: FilteredColumn[] = [];

  private mediaMatcher: MediaQueryList =
    matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  constructor(
    zone: NgZone,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<reducers.State>) {
    this.mediaMatcher.addListener(mql =>
      zone.run(() => this.mediaMatcher = mql));
  }

  isScreenSmall(): boolean {
    return this.mediaMatcher.matches;
  }

  getDisplayedColumns(): string[] {
    return columnDefinitions
      .filter(cd => !this.isScreenSmall() || cd.showInSmallScreen)
      .map(cd => cd.columnName);
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  onRowClicked(row) {
    //    console.log('Row clicked: ', row);
  }

  ngOnInit() {
    // this.store.pipe(select<any>('core'))
    // .subscribe((coreState: ProductModelsState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getProductModelError));
    this.loading$ = this.store.pipe(select(selectors.getProductModelLoading));

    //this.currentProductModel$ = this.store.select(fromProductModel.getCurrentProductModel);

    this.dataSource = new ProductModelsDataSource(this.store);

    this.store.dispatch(new productModelActions.LoadProductModel());

    this.store.pipe(
      select(selectors.getCurrentProductModel),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductModel => this.currentProductModel = currentProductModel
    );

    this.store.pipe(
      select(selectors.getProductModelCount),
      takeWhile(() => this.componentActive)
    ).subscribe((productModelsCount: number) => {
      this.paginator.length = productModelsCount;
    }
    );

    this.store.pipe(
      select(selectors.getProductModelDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((productModelDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = productModelDataSourceParameters.pageIndex;
      this.paginator.pageSize = productModelDataSourceParameters.pageSize;
      this.filters = productModelDataSourceParameters.filters;
    }
    );
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

  ngAfterViewInit() {
    for (let column of this.filters) {
      var prevFilterValue = ((document.getElementById(column.ColumnName + "Search") as HTMLInputElement).value);
      if (column.FilterValue != prevFilterValue) {
        (document.getElementById(column.ColumnName + "Search") as HTMLInputElement).value = column.FilterValue;
      }
    }

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    const searchInputs = document.getElementsByClassName('searchInput');
    fromEvent(searchInputs, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadProductModels();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadProductModels())
      )
      .subscribe();
  }

  loadProductModels(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new productModelActions.SetProductModelDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openProductModelDialog(): void {
    let dialogRef = this.dialog.open(ProductModelDialogComponent, {
      width: '450px',
      autoFocus: true,
      disableClose: true,
      data: {
        id: "6"
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed', result);

      if (result) {
        this.openSnackBar("ProductModel saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/productModels', result.ProductModelId]);
          });
      }
    });
  }

  newProductModel(): void {
    this.store.dispatch(new productModelActions.InitializeCurrentProductModel());

    this.openProductModelDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  productModelSelected(productModel: ProductModel): void {
    this.store.dispatch(new productModelActions.SetCurrentProductModel(productModel));
  }

  updateProductModel(productModel: ProductModel): void {
    this.productModelSelected(productModel);

    this.openProductModelDialog();
  }

  deleteProductModel(productModel: ProductModel): void {
    this.productModelSelected(productModel);
    if (this.currentProductModel && this.currentProductModel.ProductModelId) {
      if (confirm(`Really delete the product model: ${this.currentProductModel.ProductModelName}?`)) {
        this.store.dispatch(new productModelActions.DeleteProductModel(this.currentProductModel.ProductModelId));
      }
    }
  }

}
