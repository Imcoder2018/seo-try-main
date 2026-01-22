"use client";

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  Eye,
  Edit3,
  RefreshCw,
  ExternalLink,
  FileText,
  BookOpen,
  ShoppingBag,
  Globe,
  Search,
} from "lucide-react";

interface PageData {
  url: string;
  type: string;
  title?: string;
  wordCount: number;
  mainTopic?: string;
  writingStyle?: {
    tone: string;
    formality: string;
  };
  keywords?: string[];
}

interface PagesTableProps {
  pages: PageData[];
  onView: (page: PageData) => void;
  onOptimize: (page: PageData) => void;
  onRewrite: (page: PageData) => void;
}

const columnHelper = createColumnHelper<PageData>();

const getDensityBars = (wordCount: number) => {
  if (wordCount >= 2000) return { level: 3, color: "bg-green-500", label: "High" };
  if (wordCount >= 800) return { level: 2, color: "bg-blue-500", label: "Medium" };
  return { level: 1, color: "bg-amber-500", label: "Low" };
};

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "service":
      return FileText;
    case "blog":
      return BookOpen;
    case "product":
      return ShoppingBag;
    default:
      return Globe;
  }
};

const getTypeColor = (type: string) => {
  switch (type.toLowerCase()) {
    case "service":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    case "blog":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    case "product":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
  }
};

export default function PagesTable({
  pages,
  onView,
  onOptimize,
  onRewrite,
}: PagesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: "Page",
        cell: (info) => {
          const page = info.row.original;
          const TypeIcon = getTypeIcon(page.type);
          return (
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeColor(
                  page.type
                )}`}
              >
                <TypeIcon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-medium text-slate-900 dark:text-slate-100 truncate max-w-xs">
                  {info.getValue() || page.url.split("/").pop() || "Untitled"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                  {page.url}
                </p>
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("type", {
        header: "Type",
        cell: (info) => {
          const type = info.getValue();
          return (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(
                type
              )}`}
            >
              {type}
            </span>
          );
        },
      }),
      columnHelper.accessor("wordCount", {
        header: "Density",
        cell: (info) => {
          const wordCount = info.getValue();
          const density = getDensityBars(wordCount);
          return (
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[1, 2, 3].map((bar) => (
                  <div
                    key={bar}
                    className={`w-1.5 rounded-full transition-all ${
                      bar <= density.level
                        ? `${density.color} h-4`
                        : "bg-slate-200 dark:bg-slate-700 h-3"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {wordCount.toLocaleString()}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("mainTopic", {
        header: "Topic",
        cell: (info) => (
          <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-xs block">
            {info.getValue() || "-"}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => {
          const page = info.row.original;
          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onView(page)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={() => onOptimize(page)}
                className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"
                title="Optimize"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRewrite(page)}
                className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded transition-colors"
                title="Rewrite"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <a
                href={page.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded transition-colors"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          );
        },
      }),
    ],
    [onView, onOptimize, onRewrite]
  );

  const table = useReactTable({
    data: pages,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search pages..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 text-sm"
            />
          </div>
          <select
            value={(columnFilters.find((f) => f.id === "type")?.value as string) ?? ""}
            onChange={(e) =>
              setColumnFilters(
                e.target.value
                  ? [{ id: "type", value: e.target.value }]
                  : []
              )
            }
            className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 text-sm"
          >
            <option value="">All Types</option>
            <option value="service">Service</option>
            <option value="blog">Blog</option>
            <option value="product">Product</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center gap-2 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none hover:text-slate-700 dark:hover:text-slate-200"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: <ChevronUp className="w-4 h-4" />,
                          desc: <ChevronDown className="w-4 h-4" />,
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {table.getRowModel().rows.length} of {pages.length} pages
        </p>
      </div>
    </div>
  );
}
