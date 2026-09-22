import {CellValue} from "./definitions";

export interface TableColumn {
    key: string;
    header: string;
    width?: string;
    align?: "left" | "center" | "right";
    format?: (value: CellValue) => React.ReactNode;
    sortable?: boolean;
    headerClassName?: string;
    cellClassName?: string;
}