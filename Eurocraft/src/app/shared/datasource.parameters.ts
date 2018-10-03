export class FilteredColumn {
    ColumnName: string;
    FilterValue: string;
}

export class DataSourceParameters {
    sortColumn: string;
    sortDirection: string;
    pageIndex: number;
    pageSize: number;
    filters: FilteredColumn[];

    constructor(
        sortColumn: string,
        sortDirection: string,
        pageIndex: number,
        pageSize: number,
        filters: FilteredColumn[]) {
        this.sortColumn = sortColumn;
        this.sortDirection = sortDirection;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.filters = filters;
    }
}
