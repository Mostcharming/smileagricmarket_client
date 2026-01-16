'use client'

import React from 'react';

export interface Column<T> {
  header: string;
  key: keyof T | string;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  className?: string;
}

const Table = <T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  className = '',
}: TableProps<T>) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-sm text-left border-collapse">
        <thead className="text-xs text-gray-500 bg-gray-50 border-y border-gray-100">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-6 py-4 font-medium"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`bg-white hover:bg-gray-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-gray-700">
                    {column.render
                      ? column.render(item)
                      : (item[column.key as keyof T] as unknown as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-gray-400"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
