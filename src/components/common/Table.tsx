/* eslint-disable @typescript-eslint/no-explicit-any */
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import React, { useState } from "react";
import Text from "./Text";
import clsx from "clsx";

interface TableProps {
  data: Array<{
    [key: string]: {
      data: string | number | boolean;
      cell?: React.ReactNode;
    };
  }>;
  columns: Array<{
    key: string;
    label: string;
    sort?: boolean;
    width?: number;
  }>;
  defaultSortKey?: string;
  defaultSort?: "asc" | "desc";
  height?: string | number;
}

const Table = ({
  data,
  columns,
  height,
  defaultSortKey,
  defaultSort,
}: TableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>({
    key: defaultSortKey || columns[0].key,
    direction: defaultSort || "asc",
  });

  const getSortedData = React.useMemo(() => {
    const fixedData = data.filter((item) => item.isFixed.data);
    const sortableData = data.filter((item) => !item.isFixed.data);

    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key].data < b[sortConfig.key].data) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key].data > b[sortConfig.key].data) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return [...fixedData, ...sortableData];
  }, [data, sortConfig]);

  const handleSort = (key: string) => {
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
              onClick={() => {
                if (column.sort) handleSort(column.key);
              }}
              className="bg-white cursor-pointer"
              style={{ width: column.width ? `${column.width}px` : "" }}
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
                {column.sort &&
                  (sortConfig?.key === column.key ? (
                    sortConfig.direction === "asc" ? (
                      <CaretUp size={16} weight="fill" />
                    ) : (
                      <CaretDown size={16} weight="fill" />
                    )
                  ) : (
                    <CaretDown size={16} weight="fill" />
                  ))}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody
        className="block overflow-scroll bg-white divide-ydivide-gray-200"
        style={{ maxHeight: height }}
      >
        {getSortedData.map((item, index) => (
          <tr key={index} className="table w-full table-fixed">
            {columns.map((column) => (
              <td
                key={column.key}
                className="px-4 py-2 whitespace-nowrap"
                style={{ width: column.width ? `${column.width}px` : "" }}
              >
                {item[column.key].cell ? (
                  item[column.key].cell
                ) : (
                  <Text type="normalBlack" className="text-left">
                    {item[column.key].data}
                  </Text>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
