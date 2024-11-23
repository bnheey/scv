// sort 기능이 있는 테이블 컴포넌트
import React, { ReactNode } from "react";
import clsx from "clsx";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

interface TableSortProps {
  children: ReactNode;
  sortKey: string;
  sortDirection: string;
  onClick: (sortKey: string) => void;
}

const Table = ({ children, className }: TableProps) => {
  return <table className={clsx("w-full", className)}>{children}</table>;
};

const TableHeader = ({ children, className }: TableHeaderProps) => {
  return <thead className={clsx(className)}>{children}</thead>;
};

const TableBody = ({ children, className }: TableBodyProps) => {
  return <tbody className={clsx(className)}>{children}</tbody>;
};

const TableRow = ({ children, className }: TableRowProps) => {
  return <tr className={clsx(className)}>{children}</tr>;
};

const TableCell = ({ children, className }: TableCellProps) => {
  return <td className={clsx("px-4 py-2", className)}>{children}</td>;
};

const TableSort = ({
  children,
  sortKey,
  sortDirection,
  onClick,
}: TableSortProps) => {
  return (
    <th className="cursor-pointer" onClick={() => onClick(sortKey)}>
      <div className="flex items-center">
        {children}
        {sortDirection === "ASC" ? "▲" : "▼"}
      </div>
    </th>
  );
};

export { Table, TableHeader, TableBody, TableRow, TableCell, TableSort };
