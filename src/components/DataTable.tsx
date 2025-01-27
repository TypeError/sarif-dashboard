"use client";

import * as React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  Eye,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  SarifLog,
  Result,
  ReportingDescriptor,
  MultiformatMessageString,
} from "@/types/sarif";
import { Button } from "@/components/ui/button";
import { GeistMono } from "geist/font/mono";

/** Extend your local ReportingDescriptor so we can safely use `helpUri`. */
interface ExtendedReportingDescriptor extends ReportingDescriptor {
  helpUri?: string;
}

/**
 * Convert a `string | MultiformatMessageString | undefined` into a plain string.
 */
function toSafeString(
  input: string | MultiformatMessageString | undefined
): string {
  if (!input) return "";
  if (typeof input === "string") return input;
  return input.text ?? "";
}

/**
 * A cell that truncates text to `maxLength` by default,
 * toggling expanded/collapsed with a chevron button.
 */
function ChevronTruncatedCell({
  text,
  maxLength = 80,
}: {
  text: string;
  maxLength?: number;
}) {
  const [expanded, setExpanded] = React.useState(false);

  if (!text) {
    return <span className="text-sm text-muted-foreground">No content</span>;
  }

  const isTooLong = text.length > maxLength;
  const displayed = expanded
    ? text
    : text.slice(0, maxLength) + (isTooLong ? "…" : "");

  return (
    <div className="whitespace-pre-wrap text-sm">
      {displayed}
      {isTooLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-2 text-blue-500 inline-flex items-center gap-1"
        >
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      )}
    </div>
  );
}

interface DataTableProps {
  sarif: SarifLog;
}

export function DataTable({ sarif }: DataTableProps) {
  const [expandedRows, setExpandedRows] = React.useState<
    Record<string, boolean>
  >({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);

  /**
   * By default, hide columns that can be “noisy”: Tags, Description, and Help.
   * The user can toggle these on from the “Columns” popover.
   */
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      tags: false,
      description: false,
      help: false,
    });

  // Flatten all results across runs, merging fields from the rule if available
  const data: Result[] = React.useMemo(() => {
    return sarif.runs.flatMap((run) => {
      // Create a map of ruleId -> ExtendedReportingDescriptor for quick lookups
      const ruleMap = new Map<string, ExtendedReportingDescriptor>();
      (run.tool.driver.rules ?? []).forEach((rule) => {
        ruleMap.set(rule.id, rule as ExtendedReportingDescriptor);
      });

      return (run.results || []).map((result) => {
        const matchedRule = result.ruleId
          ? ruleMap.get(result.ruleId)
          : undefined;

        // Determine severity from the result level or fallback to rule default
        const severity =
          result.level?.toLowerCase() ||
          matchedRule?.defaultConfiguration?.level?.toLowerCase() ||
          "unknown";

        // Merge tags from either the result or the rule
        const resultTags = (result.properties?.tags as string[]) || [];
        const ruleTags = (matchedRule?.properties?.tags as string[]) || [];
        const allTags = resultTags.length ? resultTags : ruleTags;

        // Help URI might be on the result or the extended rule
        const helpUri = result.helpUri || matchedRule?.helpUri || "No URI";

        // Combine help from result or rule
        const resultHelpString = toSafeString(result.help);
        const ruleHelpString = matchedRule
          ? toSafeString(matchedRule.help)
          : "";
        const help = resultHelpString || ruleHelpString || "No Help Available";

        // shortDescription from the result or the rule
        const shortDescFromResult = toSafeString(result.shortDescription);
        const shortDescFromRule = matchedRule
          ? toSafeString(matchedRule.shortDescription)
          : "";
        const shortDescription =
          shortDescFromResult ||
          shortDescFromRule ||
          "No description available.";

        // fullDescription from the result or the rule
        const fullDescFromResult = toSafeString(result.fullDescription);
        const fullDescFromRule = matchedRule
          ? toSafeString(matchedRule.fullDescription)
          : "";
        const fullDescription =
          fullDescFromResult || fullDescFromRule || "No additional details.";

        // main message
        const messageText = toSafeString(result.message?.text);

        return {
          ...result,
          severity: severity.charAt(0).toUpperCase() + severity.slice(1), // e.g. "warning" => "Warning"
          tags: allTags,
          helpUri,
          help,
          shortDescription,
          fullDescription,
          messageText,
        };
      });
    });
  }, [sarif]);

  // Define columns. Some are hidden by default (via `columnVisibility`).
  const columns = React.useMemo<ColumnDef<Result>[]>(
    () => [
      {
        accessorFn: (row) =>
          row.locations?.[0]?.physicalLocation?.artifactLocation?.uri ||
          "Unknown",
        id: "fileName",
        header: "File Name",
        cell: ({ getValue }) => {
          const fileName = getValue<string>();
          return <span className={`${GeistMono.variable}`}>{fileName}</span>;
        },
      },
      {
        accessorFn: (row) =>
          row.locations?.[0]?.physicalLocation?.region?.startLine || "N/A",
        id: "line",
        header: "Line",
        cell: ({ getValue }) => <span>{getValue<number>() || "N/A"}</span>,
      },
      {
        accessorKey: "ruleId",
        header: "Rule ID",
        cell: ({ getValue }) => {
          const ruleId = getValue<string>();
          return ruleId || "N/A";
        },
      },
      {
        accessorKey: "severity",
        header: "Severity",
        cell: ({ getValue }) => {
          const severity = getValue<string>();
          const severityClasses: Record<string, string> = {
            Error: "bg-red-800/20 text-red-600",
            Warning: "bg-yellow-800/20 text-yellow-600",
            Note: "bg-blue-800/20 text-blue-600",
            Unknown: "bg-gray-800/20 text-gray-600",
          };
          return (
            <Badge
              variant="outline"
              className={
                severityClasses[severity] || "bg-gray-800/20 text-gray-600"
              }
            >
              {severity}
            </Badge>
          );
        },
      },
      {
        // The main message from the result, truncated
        accessorKey: "messageText",
        header: "Message",
        cell: ({ getValue }) => {
          const text = getValue<string>();
          return <ChevronTruncatedCell text={text} maxLength={80} />;
        },
      },
      {
        // shortDescription + fullDescription toggled
        accessorFn: (row) => row.shortDescription,
        id: "description",
        header: "Description",
        cell: ({ row }) => {
          const shortDescString = toSafeString(row.original.shortDescription);
          const fullDescString = toSafeString(row.original.fullDescription);
          const rowId = row.id;
          const isExpanded = !!expandedRows[rowId];

          return (
            <div className="flex flex-col space-y-2">
              {/* Short description row */}
              <div className="flex items-center justify-between">
                <span
                  className="line-clamp-1 text-sm text-foreground"
                  title={shortDescString}
                >
                  {shortDescString}
                </span>
                <button
                  onClick={() =>
                    setExpandedRows((prev) => ({
                      ...prev,
                      [rowId]: !isExpanded,
                    }))
                  }
                  className="h-6 w-6 flex items-center justify-center transition-colors hover:text-foreground"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* fullDescription appears only if expanded */}
              {isExpanded && (
                <div className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                  {fullDescString}
                </div>
              )}
            </div>
          );
        },
      },
      {
        // Styled tags with smaller text, pill-like
        accessorKey: "tags",
        header: "Tags",
        cell: ({ getValue }) => {
          const tags = getValue<string[]>();
          if (!tags.length) {
            return (
              <span className="text-sm text-muted-foreground">No Tags</span>
            );
          }
          return (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-block bg-gray-700 text-xs px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          );
        },
      },
      {
        // The help text with help URI included
        accessorKey: "help",
        header: "Help",
        cell: ({ row }) => {
          const helpText = toSafeString(row.original.help);
          const helpUri = row.original.helpUri;

          return (
            <div className="text-sm space-y-1">
              <ChevronTruncatedCell text={helpText} maxLength={80} />
              {helpUri !== "No URI" && (
                <div>
                  <a
                    href={helpUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    Documentation
                  </a>
                </div>
              )}
            </div>
          );
        },
      },
    ],
    [expandedRows]
  );

  // Build the table instance using Tanstack's React Table
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, sorting, columnVisibility },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Card>
      {/* Header with title, column toggles, and search */}
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-lg font-semibold">
          List of Findings
        </CardTitle>
        <div className="flex items-center gap-4">
          {/* Popover for toggling columns */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2">
                <Eye className="h-4 w-4" /> Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="bg-gray-900 text-gray-200 border border-gray-600 shadow-lg rounded-md p-4 w-48"
              side="bottom"
              align="start"
            >
              {table.getAllLeafColumns().map((column) => (
                <div key={column.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`column-${column.id}`}
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(Boolean(value))
                    }
                  />
                  <label
                    htmlFor={`column-${column.id}`}
                    className="text-sm font-medium"
                  >
                    {column.columnDef.header as string}
                  </label>
                </div>
              ))}
            </PopoverContent>
          </Popover>

          {/* Global search input */}
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </CardHeader>

      {/* Table content */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="table-auto w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    return (
                      <TableHead
                        key={header.id}
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        className={`sticky top-0 z-10 bg-inherit ${
                          canSort ? "cursor-pointer" : ""
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {/* Sort icons */}
                          {canSort && (
                            <span>
                              {header.column.getIsSorted() === "asc" ? (
                                <ArrowUp className="h-4 w-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ArrowDown className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
                            </span>
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={
                      row.index % 2 === 0 ? "bg-gray-800/50" : "bg-gray-900/50"
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="hover:bg-gray-700/60">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-4"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-between px-4 py-3">
            <div className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
