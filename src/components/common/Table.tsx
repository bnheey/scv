/* eslint-disable @typescript-eslint/no-explicit-any */
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import React, { useState } from "react";
import Text from "./Text";
import clsx from "clsx";

interface TableProps {
  data: Array<{ [key: string]: any }>;
  columns: Array<{ key: string; label: string }>;
  height?: string | number;
}

const Table = ({ data, columns, height }: TableProps) => {
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
    const tbodyElement = document.getElementsByTagName("tbody")[0];
    tbodyElement.scrollTo({
      top: 0,
      behavior: "smooth",
    });

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

  return (
    <table className="w-full min-w-full border-collapse">
      <thead className="sticky top-0 table w-full bg-white border-t border-b border-gray-200 ">
        <tr>
          {columns.map((column, index) => (
            <th
              key={column.key}
              onClick={() => requestSort(column.key)}
              className="bg-white cursor-pointer"
            >
              <Text
                type={"normalMediumBlack"}
                className={clsx(
                  "flex items-center gap-1 text-left px-[18px] py-[6px] m-[2px] rounded-sm",
                  (!sortConfig?.key && index === 0) ||
                    sortConfig?.key === column.key
                    ? "bg-gray-100"
                    : "bg-white"
                )}
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
      <tbody
        className="block overflow-scroll bg-white divide-ydivide-gray-200"
        style={{ maxHeight: height }}
      >
        {sortedData.map((item, index) => (
          <tr key={index} className="table w-full table-fixed">
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-2 whitespace-nowrap">
                <Text type="normalBlack" className="text-left">
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
