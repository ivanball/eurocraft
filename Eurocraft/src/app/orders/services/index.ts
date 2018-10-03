import { SalesOrderDetailService } from './salesorderdetail.service';
import { SalesOrderHeaderService } from './salesorderheader.service';

export const services: any[] = [
    SalesOrderDetailService,
    SalesOrderHeaderService
];

export * from './salesorderdetail.service';
export * from './salesorderheader.service';
