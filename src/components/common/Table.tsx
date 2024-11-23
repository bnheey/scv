/* eslint-disable @typescript-eslint/no-explicit-any */
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import React, { useState } from "react";
import Text from "./Text";
import clsx from "clsx";

interface TableProps {
  data: Array<{ [key: string]: any }>;
  columns: Array<{ key: string; label: string }>;
}

const Table = ({ data, columns }: TableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const sortedData = React.useMemo(() => {
    const sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };
  console.log(sortConfig?.key);

  return (
    <table className="min-w-full">
      <thead>
        <tr className="sticky top-0">
          {columns.map((column, index) => (
            <th
              key={column.key}
              onClick={() => requestSort(column.key)}
              className={clsx(
                "px-5 py-2 cursor-pointer",
                (!sortConfig?.key && index === 0) ||
                  sortConfig?.key === column.key
                  ? "bg-scv-pink"
                  : "bg-gray-200"
              )}
            >
              <Text
                type={
                  (!sortConfig?.key && index === 0) ||
                  sortConfig?.key === column.key
                    ? "normalMediumWhite"
                    : "normalMediumBlack"
                }
                className={clsx("flex items-center gap-1 text-left")}
              >
                {column.label}
                {sortConfig?.key === column.key ? (
                  sortConfig.direction === "asc" ? (
                    <CaretUp size={16} weight="fill" />
                  ) : (
                    <CaretDown size={16} weight="fill" />
                  )
                ) : (
                  <CaretDown size={16} weight="fill" />
                )}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {sortedData.map((item, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-2 whitespace-nowrap">
                <Text type="normalBlack" className="text-left ">
                  {item[column.key]}
                </Text>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
