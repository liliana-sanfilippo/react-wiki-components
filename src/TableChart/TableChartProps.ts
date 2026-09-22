import {TableHeader} from "./TableHeader";
import {CellValue, TableRow} from "./definitions";
import {TableColumn} from "./TableColumn";

export interface TableChartProps {
    headers?: TableHeader[];
    rows?: CellValue[][];
    headerPosition?: "top" | "left";

    columns?: TableColumn[];
    data?: TableRow[];

    title?: React.ReactNode;
    subtitle?: string;
    footer?: React.ReactNode;
    className?: string;
    tableClassName?: string;
    headerClassName?: string;
    rowClassName?: string | ((row: TableRow, index: number) => string);
    alternateRowColors?: boolean;
    bordered?: boolean;
    compact?: boolean;
    striped?: boolean;
    hover?: boolean;
    sortable?: boolean;
    initialSortColumn?: string;
    initialSortDirection?: "asc" | "desc";
    emptyMessage?: string;
    onRowClick?: (row: TableRow | CellValue[], index: number) => void;
    maxHeight?: string;
    maxTableHeight?: string;
    stickyHeader?: boolean;
    caption?: string;
    responsive?: boolean;

    rowHeaderTitle?: string;
    mainColumnHeader?: string;
    subColumnHeader?: string;
    columnHeaderLabels?: string[];
    rowHeaderWidth?: string;
}
