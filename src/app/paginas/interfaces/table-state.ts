export interface TableState {
  filter: string;
  sortColumn: string;
  sortDirection: 'asc' | 'desc' | '';
  pageIndex: number;
  pageSize: number;
}