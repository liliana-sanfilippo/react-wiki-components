export type CellValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | React.ReactElement;

export type TableRow = Record<string, CellValue>;

