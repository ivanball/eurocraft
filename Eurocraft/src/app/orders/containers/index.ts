import { SalesOrderListComponent } from './salesorder-list/salesorder-list.component';
import { SalesOrderDialogComponent } from './salesorder-dialog/salesorder-dialog.component';
import { SalesOrderDetailListComponent } from './salesorderdetail-list/salesorderdetail-list.component';
import { SalesOrderDetailDialogComponent } from './salesorderdetail-dialog/salesorderdetail-dialog.component';

export const containers: any[] = [
    SalesOrderListComponent,
    SalesOrderDialogComponent,
    SalesOrderDetailListComponent,
    SalesOrderDetailDialogComponent
];

export * from './salesorder-list/salesorder-list.component';
export * from './salesorder-dialog/salesorder-dialog.component';
export * from './salesorderdetail-list/salesorderdetail-list.component';
export * from './salesorderdetail-dialog/salesorderdetail-dialog.component';
