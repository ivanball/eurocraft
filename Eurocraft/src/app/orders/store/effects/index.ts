import { SalesOrderDetailEffects } from './salesorderdetail.effects';
import { SalesOrderHeaderEffects } from './salesorderheader.effects';

export const effects: any[] = [
    SalesOrderDetailEffects, 
    SalesOrderHeaderEffects
];

export * from './salesorderdetail.effects';
export * from './salesorderheader.effects';