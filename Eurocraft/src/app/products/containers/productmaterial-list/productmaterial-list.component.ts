import { Component, OnInit, NgZone, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

import { Store, select } from '@ngrx/store';
import * as reducers from '../../store/reducers';
import * as selectors from '../../store/selectors';
import * as productMaterialActions from '../../store/actions/productmaterial.actions';

import { Observable, fromEvent, merge } from 'rxjs';
import { takeWhile, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ProductMaterial } from '../../models/productmaterial';
import { ProductMaterialDialogComponent } from '../productmaterial-dialog/productmaterial-dialog.component';
import { ProductMaterialsDataSource } from "../../services/productmaterial.datasource";
import { DataSourceParameters, FilteredColumn } from '../../../shared/datasource.parameters';

const SMALL_WIDTH_BREAKPOINT = 1000;
const columnDefinitions = [
  { columnName: 'ProductMaterialName', showInSmallScreen: true },
  { columnName: 'ActionUpdate', showInSmallScreen: true },
  { columnName: 'ActionDelete', showInSmallScreen: true }
];

@Component({
  selector: 'app-productmaterial-list',
  templateUrl: './productmaterial-list.component.html',
  styleUrls: ['./productmaterial-list.component.scss']
})
export class ProductMaterialListComponent implements OnInit, OnDestroy {
  pageTitle = 'Product Materials';
  errorMessage$: Observable<string>;
  loading$: Observable<boolean>;
  componentActive: boolean = true;
  currentProductMaterial: ProductMaterial | null;
  dataSource: ProductMaterialsDataSource;
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
    // .subscribe((coreState: ProductMaterialsState) => console.log(coreState));

    // this.store.select<any>((state: any) => state) // the complete state this time!!!
    // .subscribe((completeState: any) => console.log(completeState));

    // Do NOT subscribe here because it used an async pipe
    this.errorMessage$ = this.store.pipe(select(selectors.getProductMaterialError));
    this.loading$ = this.store.pipe(select(selectors.getProductMaterialLoading));

    //this.currentProductMaterial$ = this.store.select(fromProductMaterial.getCurrentProductMaterial);

    this.dataSource = new ProductMaterialsDataSource(this.store);

    this.store.dispatch(new productMaterialActions.LoadProductMaterial());

    this.store.pipe(
      select(selectors.getCurrentProductMaterial),
      takeWhile(() => this.componentActive)
    ).subscribe(
      currentProductMaterial => this.currentProductMaterial = currentProductMaterial
    );

    this.store.pipe(
      select(selectors.getProductMaterialCount),
      takeWhile(() => this.componentActive)
    ).subscribe((productMaterialsCount: number) => {
      this.paginator.length = productMaterialsCount;
    }
    );

    this.store.pipe(
      select(selectors.getProductMaterialDataSourceParameters),
      takeWhile(() => this.componentActive)
    ).subscribe((productMaterialDataSourceParameters: DataSourceParameters) => {
      this.paginator.pageIndex = productMaterialDataSourceParameters.pageIndex;
      this.paginator.pageSize = productMaterialDataSourceParameters.pageSize;
      this.filters = productMaterialDataSourceParameters.filters;
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
          this.loadProductMaterials();
        })
      )
      .subscribe();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadProductMaterials())
      )
      .subscribe();
  }

  loadProductMaterials(): void {
    var _filters: FilteredColumn[] = [];
    for (let columnName of this.getDisplayedColumns()) {
      if (columnName.indexOf('Action') < 0) {
        var filteredColumn = new FilteredColumn();
        filteredColumn.ColumnName = columnName;
        filteredColumn.FilterValue = ((document.getElementById(columnName + "Search") as HTMLInputElement).value);
        _filters.push(filteredColumn);
      }
    }

    this.store.dispatch(new productMaterialActions.SetProductMaterialDataSourceParameters(new DataSourceParameters(
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize,
      _filters)));
  }

  openProductMaterialDialog(): void {
    let dialogRef = this.dialog.open(ProductMaterialDialogComponent, {
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
        this.openSnackBar("ProductMaterial saved", "")
          .onAction().subscribe(() => {
            //            this.router.navigate(['/productMaterials', result.ProductMaterialId]);
          });
      }
    });
  }

  newProductMaterial(): void {
    this.store.dispatch(new productMaterialActions.InitializeCurrentProductMaterial());

    this.openProductMaterialDialog();
  }

  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  productMaterialSelected(productMaterial: ProductMaterial): void {
    this.store.dispatch(new productMaterialActions.SetCurrentProductMaterial(productMaterial));
  }

  updateProductMaterial(productMaterial: ProductMaterial): void {
    this.productMaterialSelected(productMaterial);

    this.openProductMaterialDialog();
  }

  deleteProductMaterial(productMaterial: ProductMaterial): void {
    this.productMaterialSelected(productMaterial);
    if (this.currentProductMaterial && this.currentProductMaterial.ProductMaterialId) {
      if (confirm(`Really delete the product material: ${this.currentProductMaterial.ProductMaterialName}?`)) {
        this.store.dispatch(new productMaterialActions.DeleteProductMaterial(this.currentProductMaterial.ProductMaterialId));
      }
    }
  }

}
