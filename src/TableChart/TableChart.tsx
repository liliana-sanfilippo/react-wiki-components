import {Fragment, JSX, useMemo, useState} from "react";
import {TableChartProps} from "./TableChartProps";
import {CellValue, TableRow} from "./definitions";
import {TableColumn} from "./TableColumn";


const TableChart: React.FC<TableChartProps> = ({
                                                   headers,
                                                   rows,
                                                   headerPosition = "top",
                                                   columns: propColumns,
                                                   data: propData,
                                                   title,
                                                   subtitle,
                                                   footer,
                                                   className = "",
                                                   tableClassName = "",
                                                   headerClassName = "",
                                                   rowClassName = "",
                                                   alternateRowColors = true,
                                                   bordered = false,
                                                   compact = false,
                                                   striped = false,
                                                   hover = false,
                                                   sortable = true,
                                                   initialSortColumn,
                                                   initialSortDirection = "asc",
                                                   emptyMessage = "No data available",
                                                   onRowClick,
                                                   maxHeight,
                                                   maxTableHeight = "700px",
                                                   stickyHeader = false,
                                                   caption,
                                                   responsive = true,
                                                   rowHeaderTitle = "",
                                                   mainColumnHeader = "",
                                                   subColumnHeader = "",
                                                   columnHeaderLabels = [],
                                                   rowHeaderWidth = "120px",
                                               }) => {
    const renderTextWithFormatting = (text: CellValue): React.ReactNode => {
        if (typeof text !== "string") {
            return text;
        }


        // Handle line breaks first
        if (text.includes("\\n")) {
            const lines: string[] = text.split("\\n");
            return lines.map((line: string, index: number) => (
                <Fragment key={index}>
                    {index > 0 && <br/>}
                    {renderTextWithFormatting(line)}
                </Fragment>
            ));
        }

        if (text.includes("**")) {
            const boldMatch = text.match(/\*\*([^*]+)\*\*/);
            if (boldMatch) {
                return (
                    <strong style={{color: "#f6ae2d", fontWeight: "bold"}}>
                        {boldMatch[1]}
                    </strong>
                );
            }
        }

        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const elements: (string | JSX.Element)[] = [];
        let lastIndex: number = 0;
        let match;
        let elementKey: number = 0;

        while ((match = linkRegex.exec(text)) !== null) {
            const [fullMatch, linkText, url] = match;
            const beforeLink = text.slice(lastIndex, match.index);

            if (beforeLink) {
                elements.push(...renderFormattedText(beforeLink, elementKey++));
            }

            const isExternal: boolean = url.startsWith("http") || url.startsWith("//");
            const linkElement = (
                <a
                    key={`table-link-${elementKey++}`}
                    href={url}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="table-link"
                >
                    {renderFormattedText(linkText, elementKey++)}
                </a>
            );
            elements.push(linkElement);

            lastIndex = match.index + fullMatch.length;
        }

        const remainingAfterLinks: string = text.slice(lastIndex);
        if (remainingAfterLinks) {
            elements.push(...renderFormattedText(remainingAfterLinks, elementKey++));
        }

        if (elements.length === 0) {
            return renderFormattedText(text, 0);
        }

        return elements;
    };

    const renderFormattedText = (text: string, startKey: number = 0) => {
        // Handle line breaks first
        if (text.includes("\\n")) {
            const lines: string[] = text.split("\\n");
            return lines.map((line: string, index: number) => (
                <Fragment key={`line-${startKey}-${index}`}>
                    {index > 0 && <br/>}
                    {renderFormattedTextLine(line, startKey, index)}
                </Fragment>
            ));
        }

        return renderFormattedTextLine(text, startKey, 0);
    };

    const renderFormattedTextLine = (
        text: string,
        startKey: number = 0,
        lineIndex: number = 0
    ) => {
        // Updated regex to properly capture subscript and superscript sequences
        const formatRegex = /(\*\*[^*]+\*\*|__[^_]+__|\\l[^\s\\]*|\\s[^\s\\]*)/g;
        const parts = text.split(formatRegex);

        return parts.map((part, index) => {
            // Check if this part is bold (wrapped in **)
            if (part.startsWith("**") && part.endsWith("**")) {
                const boldText = part.slice(2, -2);
                // Recursively process bold content for nested formatting
                return (
                    <strong
                        key={`bold-${startKey}-${lineIndex}-${index}`}
                        style={{color: "#f6ae2d", fontWeight: "bold"}}
                    >
                        {renderFormattedTextLine(boldText, startKey + 1000, lineIndex)}
                    </strong>
                );
            }
            // Check if this part is italic (wrapped in __)
            else if (part.startsWith("__") && part.endsWith("__")) {
                const italicText = part.slice(2, -2);
                return (
                    <em key={`italic-${startKey}-${lineIndex}-${index}`}>
                        {renderFormattedTextLine(italicText, startKey + 2000, lineIndex)}
                    </em>
                );
            } else if (part.startsWith("\\l")) {
                const subscriptText = part.slice(2);
                return (
                    <sub key={`subscript-${startKey}-${lineIndex}-${index}`}>
                        {subscriptText}
                    </sub>
                );
            } else if (part.startsWith("\\s")) {
                const superscriptText = part.slice(2);
                return (
                    <sup key={`superscript-${startKey}-${lineIndex}-${index}`}>
                        {superscriptText}
                    </sup>
                );
            }
            return part;
        });
    };

    const {columns, data} = useMemo<{
        columns: TableColumn[];
        data: TableRow[];
    }>(() => {
        if (headers && rows) {
            if (headerPosition === "left") {
                const maxDataCols = Math.max(...rows.map((row) => row.length));

                const transformedColumns: TableColumn[] = [
                    {
                        key: "row_header",
                        header: "",
                        align: "left" as const,
                        format: (value: CellValue) => renderTextWithFormatting(value),
                        sortable: false,
                        headerClassName: "row-header-column",
                        cellClassName: "row-header-cell",
                    },
                    ...Array.from({length: maxDataCols}, (_, colIndex) => ({
                        key: `data_col_${colIndex}`,
                        header: "",
                        align: "left" as const,
                        format: (value: CellValue) => renderTextWithFormatting(value),
                        sortable: sortable,
                    })),
                ];

                const transformedData = headers.map((header, headerIndex) => {
                    const dataRow: TableRow = {};
                    dataRow["row_header"] = header.header;

                    if (rows[headerIndex]) {
                        rows[headerIndex].forEach((cell, cellIndex) => {
                            dataRow[`data_col_${cellIndex}`] = cell;
                        });
                    }

                    return dataRow;
                });

                return {columns: transformedColumns, data: transformedData};
            } else {
                const transformedColumns: TableColumn[] = headers.map((header, index) => ({
                    key: `col_${index}`,
                    header: header.header,
                    align: header.align ?? "left",
                    width: header.width,
                    format: renderTextWithFormatting,
                    sortable: sortable,
                }));

                const transformedData = rows.map((row) => {
                    const dataRow: TableRow = {};
                    row.forEach((cell, cellIndex) => {
                        dataRow[`col_${cellIndex}`] = cell;
                    });
                    return dataRow;
                });

                return {columns: transformedColumns, data: transformedData};

            }
        }

        const enhancedColumns: TableColumn[] = (propColumns || []).map((column) => ({
            ...column,
            format: column.format ?? renderTextWithFormatting,
        }));

        return {columns: enhancedColumns, data: propData || []};
    }, [headers, rows, headerPosition, propColumns, propData, sortable]);

    const [sortConfig, setSortConfig] = useState<{
        key: string | null;
        direction: "asc" | "desc";
    }>({
        key: initialSortColumn || null,
        direction: initialSortDirection,
    });

    const isComplexTable = rowHeaderTitle || mainColumnHeader || subColumnHeader;

    const handleHeaderClick = (column: TableColumn) => {
        if (!sortable || column.sortable === false) return;

        setSortConfig({
            key: column.key,
            direction:
                sortConfig.key === column.key && sortConfig.direction === "asc"
                    ? "desc"
                    : "asc",
        });
    };

    const handleComplexHeaderClick = (columnIndex: number) => {
        if (!sortable) return;

        setSortConfig({
            key: columnIndex.toString(),
            direction:
                sortConfig.key === columnIndex.toString() &&
                sortConfig.direction === "asc"
                    ? "desc"
                    : "asc",
        });
    };

    const renderNode = (node: React.ReactNode): React.ReactNode =>
        typeof node === "string" ? renderTextWithFormatting(node) : node;

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key!];
            const bValue = b[sortConfig.key!];

            if (aValue === bValue) return 0;
            if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
            if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                return sortConfig.direction === "asc"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            return sortConfig.direction === "asc"
                ? aValue < bValue ? -1 : 1
                : aValue < bValue ? 1 : -1;
        });
    }, [data, sortConfig]);

    const sortedRows = useMemo(() => {
        if (!sortConfig.key || !rows) return rows || [];

        const columnIndex = parseInt(sortConfig.key);
        return [...rows].sort((a, b) => {
            const aValue = a[columnIndex];
            const bValue = b[columnIndex];

            if (aValue === bValue) return 0;
            if (aValue == null) return sortConfig.direction === "asc" ? -1 : 1;
            if (bValue == null) return sortConfig.direction === "asc" ? 1 : -1;

            if (typeof aValue === "string" && typeof bValue === "string") {
                const cleanA = aValue.replace(/\*\*/g, "").replace("-", "");
                const cleanB = bValue.replace(/\*\*/g, "").replace("-", "");

                const numA = parseFloat(cleanA);
                const numB = parseFloat(cleanB);

                if (!isNaN(numA) && !isNaN(numB)) {
                    return sortConfig.direction === "asc" ? numA - numB : numB - numA;
                }

                return sortConfig.direction === "asc"
                    ? cleanA.localeCompare(cleanB)
                    : cleanB.localeCompare(cleanA);
            }

            return sortConfig.direction === "asc"
                ? aValue < bValue ? -1 : 1
                : aValue < bValue ? 1 : -1;
        });
    }, [rows, sortConfig]);

    const getSortIndicator = (column: TableColumn) => {
        if (!sortable || column.sortable === false) return null;

        if (sortConfig.key !== column.key) {
            return <span className="sort-indicator">⇕</span>;
        }

        return sortConfig.direction === "asc" ? (
            <span className="sort-indicator">↑</span>
        ) : (
            <span className="sort-indicator">↓</span>
        );
    };

    const getComplexSortIndicator = (columnIndex: number) => {
        if (!sortable) return null;

        if (sortConfig.key !== columnIndex.toString()) {
            return (
                <span
                    style={{marginLeft: "0.25rem", fontSize: "0.8rem", color: "#888"}}
                >
        ⇕
        </span>
            );
        }

        return sortConfig.direction === "asc" ? (
            <span
                style={{marginLeft: "0.25rem", fontSize: "0.8rem", color: "#888"}}
            >
    ↑
      </span>
        ) : (
            <span
                style={{marginLeft: "0.25rem", fontSize: "0.8rem", color: "#888"}}
            >
    ↓
      </span>
        );
    };

    const getRowClass = (row: TableRow, index: number): string => {
        if (typeof rowClassName === "function") {
            return rowClassName(row, index);
        }
        return rowClassName;
    };

    if (!headers || !rows || rows.length === 0) {
        return (
            <div className="table-chart-container">
                {title && <h3 className="table-title">{title}</h3>}
                <div className="table-wrapper">
                    <table className="table-chart">
                        <tbody>
                        <tr>
                            <td
                                style={{
                                    textAlign: "center",
                                    padding: "2rem",
                                    color: "#888",
                                }}
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    if (isComplexTable) {
        const dataColumnCount =
            columnHeaderLabels.length || (rows[0] ? rows[0].length : 0);

        const complexTableStyle = {
            width: "100%",
            borderCollapse: "collapse" as const,
        };

        const tableWrapperStyle = {
            maxHeight: maxTableHeight,
            overflowY: "auto" as const,
            overflowX: "auto" as const,
            position: "relative" as const,
        };

        const rowHeaderStyle = {
            textAlign: "center" as const,
            position: "sticky" as const,
            left: 0,
            zIndex: 11,
            minWidth: rowHeaderWidth,
            maxWidth: rowHeaderWidth,
        };

        const mainHeaderStyle = {
            textAlign: "center" as const,
            position: "sticky" as const,
            top: 0,
            zIndex: 10,
        };

        const subHeaderStyle = {
            textAlign: "center" as const,
            position: "sticky" as const,
            top: mainColumnHeader && columnHeaderLabels.length > 0 ? "40px" : "0px",
            zIndex: 8,
        };

        const columnHeaderStyle = {
            textAlign: "center" as const,
            position: "sticky" as const,
            top: mainColumnHeader ? "40px" : "0px",
            zIndex: 9,
            cursor: sortable ? "pointer" : "default",
        };

        const dataRowHeaderStyle = {
            textAlign: "center" as const,
            position: "sticky" as const,
            left: 0,
            zIndex: 4,
            minWidth: rowHeaderWidth,
            maxWidth: rowHeaderWidth,
        };

        const dataCellStyle = {
            textAlign: "center" as const
        };

        return (
            <div
                className="table-chart-container"
                style={{margin: "1rem 0", width: "100%"}}
            >
                {title && <h3 className="table-title">{title}</h3>}
                {subtitle && <p className="table-subtitle">{subtitle}</p>}

                <div style={tableWrapperStyle}>
                    <table style={complexTableStyle}>
                        <thead>
                        {/* Main header row */}
                        {(rowHeaderTitle || mainColumnHeader) && (
                            <tr>
                                {rowHeaderTitle && (
                                    <th style={rowHeaderStyle} rowSpan={3}>
                                        {rowHeaderTitle}
                                    </th>
                                )}
                                {mainColumnHeader && (
                                    <th style={mainHeaderStyle} colSpan={dataColumnCount}>
                                        {mainColumnHeader}
                                    </th>
                                )}
                            </tr>
                        )}

                        {columnHeaderLabels.length > 0 && (
                            <tr>
                                {columnHeaderLabels.map((label, index) => (
                                    <th
                                        key={index}
                                        style={columnHeaderStyle}
                                        onClick={() => handleComplexHeaderClick(index)}
                                    >
                                        {label}
                                        {getComplexSortIndicator(index)}
                                    </th>
                                ))}
                            </tr>
                        )}

                        {subColumnHeader && (
                            <tr>
                                <th style={subHeaderStyle} colSpan={dataColumnCount}>
                                    {subColumnHeader}
                                </th>
                            </tr>
                        )}
                        </thead>

                        <tbody>
                        {sortedRows.map((row, rowIndex: number) => {
                            const rowHeaderValue =
                                headers[rowIndex]?.header || `Row ${rowIndex + 1}`;

                            return (
                                <tr
                                    key={rowIndex}
                                    onClick={
                                        onRowClick
                                            ? () => onRowClick(
                                                Object.fromEntries(
                                                    row.map((cell, i) => [`col_${i}`, cell])
                                                ),
                                                rowIndex
                                            )
                                            : undefined
                                    }
                                    style={{
                                        cursor: onRowClick ? "pointer" : "default",
                                    }}
                                    className={hover ? "hover-row" : ""}
                                >
                                    {/* Row header cell */}
                                    <td style={dataRowHeaderStyle}>{rowHeaderValue}</td>

                                    {/* Data cells */}
                                    {row.map((cell, cellIndex) => (
                                        <td
                                            key={`${rowIndex}-${cellIndex}`}
                                            style={{
                                                ...dataCellStyle,
                                                ...(striped && rowIndex % 2 === 1
                                                    ? {backgroundColor: "#f9f9f9"}
                                                    : {}),
                                                ...(alternateRowColors && rowIndex % 2 === 1
                                                    ? {backgroundColor: "#f9f9f9"}
                                                    : {}),
                                            }}
                                            title={String(cell)}
                                        >
                                            {renderTextWithFormatting(cell)}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>

                {footer && <div className="table-footer">{renderNode(footer)}</div>}
            </div>
        );
    } else {
        const tableClasses: string = [
            "table-chart",
            tableClassName,
            bordered ? "bordered" : "",
            compact ? "compact" : "",
            striped ? "striped" : "",
            hover ? "hover" : "",
            stickyHeader ? "sticky-header" : "",
        ]
            .filter(Boolean)
            .join(" ");

        const containerClasses: string = [
            "table-chart-container",
            className,
            responsive ? "responsive" : "",
            headerPosition === "left" ? "row-headers" : "",
        ]
            .filter(Boolean)
            .join(" ");

        return (
            <div className={containerClasses}>
                {title && (
                    <h3 className="table-title">
                        {typeof title === "string" ? title : title}
                    </h3>
                )}
                {subtitle && <p className="table-subtitle">{subtitle}</p>}

                <div
                    className="table-wrapper"
                    style={maxHeight ? {maxHeight} : undefined}
                >
                    <div
                        className={`table-container ${
                            headerPosition === "left" ? "row-headers" : ""
                        }`}
                        style={{
                            maxHeight: maxTableHeight,
                            overflowY: "auto",
                            overflowX: "auto",
                            position: "relative",
                        }}
                    >
                        <table
                            className={tableClasses}
                            style={{
                                width: "100%",
                                borderCollapse: "separate",
                                borderSpacing: 0,
                            }}
                        >
                            {caption && <caption>{caption}</caption>}
                            {headerPosition !== "left" && (
                                <thead
                                    className={headerClassName}
                                    style={{
                                        position: "sticky",
                                        top: 0,
                                        zIndex: 10,
                                    }}
                                >
                                <tr>
                                    {columns.map((column: TableColumn) => (
                                        <th
                                            key={column.key}
                                            className={column.headerClassName}
                                            style={{
                                                width: column.width,
                                                minWidth: column.width || "100px",
                                                textAlign: column.align,
                                                cursor:
                                                    sortable && column.sortable !== false
                                                        ? "pointer"
                                                        : "default",
                                                position: "sticky",
                                                top: 0,
                                                whiteSpace: "wrap",
                                                overflow: "hidden",
                                            }}
                                            onClick={() => handleHeaderClick(column)}
                                        >
                                            {column.header}
                                            {getSortIndicator(column)}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                            )}
                            <tbody>
                            {sortedData.length > 0 ? (
                                sortedData.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={`${
                                            alternateRowColors && rowIndex % 2 === 1
                                                ? "alternate"
                                                : ""
                                        } ${getRowClass(row, rowIndex)}`}
                                        onClick={
                                            onRowClick ? () => onRowClick(row, rowIndex) : undefined
                                        }
                                        style={{cursor: onRowClick ? "pointer" : "default"}}
                                    >
                                        {columns.map((column: TableColumn) => {
                                            const cellValue = row[column.key];
                                            return (
                                                <td
                                                    key={`${rowIndex}-${column.key}`}
                                                    className={column.cellClassName}
                                                    style={{
                                                        textAlign: column.align,
                                                        minWidth: column.width || "100px",
                                                        whiteSpace: "wrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        maxWidth: column.width || "200px",
                                                    }}
                                                    title={cellValue == null ? undefined : String(cellValue)}
                                                >
                                                    {column.format
                                                        ? column.format(cellValue)
                                                        : renderTextWithFormatting(cellValue)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            ) : (
                                <tr className="empty-row">
                                    <td colSpan={columns.length}>{emptyMessage}</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {footer && <div className="table-footer">{renderNode(footer)}</div>}
            </div>
        );
    }
};

export default TableChart;
