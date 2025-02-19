// components/ui/data-table.tsx
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  data: T[];
  columns: {
    key: string;
    title: string;
    render?: (item: T) => React.ReactNode;
  }[];
  actions?: (item: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({ data, columns, actions, className }: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto rounded-lg border border-secondary-200", className)}>
      <table className="w-full text-sm">
        <thead className="bg-secondary-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-4 py-3 text-left font-medium text-secondary-700"
              >
                {column.title}
              </th>
            ))}
            {actions && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-200 bg-white">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-secondary-50">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-secondary-900">
                  {column.render
                    ? column.render(item)
                    // @ts-ignore
                    : item[column.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right">{actions(item)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}