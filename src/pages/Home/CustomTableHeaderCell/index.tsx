import React, { FC, ReactNode, useState } from 'react';
import { SortTypes } from '../../../types';

type RowType = 'name' | 'price' | 'order';

interface CustomTableHeaderCellProps {
  handleSort: () => void;
  rowId: RowType;
  sortType: SortTypes;
  children: ReactNode;
  centered?: boolean;
}

const CustomTableHeaderCell: FC<CustomTableHeaderCellProps> = ({
  handleSort,
  rowId,
  sortType,
  children,
  centered = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const isThisRowSorted = sortType.includes(rowId);

  return (
    <th
      className={`cursor-pointer ${centered ? 'text-center' : ''} relative`}
      onClick={handleSort}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span>{children}</span>
      <span className="h-6 w-6 absolute">
        {(() => {
          if (isThisRowSorted) {
            if (sortType.includes('asc')) {
              return (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    isHovered ? 'text-gray-800' : 'text-gray-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 13l-5 5m0 0l-5-5m5 5V6"
                  />
                </svg>
              );
            }
            return (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  isHovered ? 'text-gray-800' : 'text-gray-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11l5-5m0 0l5 5m-5-5v12"
                />
              </svg>
            );
          }
          if (isHovered) {
            return (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 13l-5 5m0 0l-5-5m5 5V6"
                />
              </svg>
            );
          }
          return '';
        })()}
      </span>
    </th>
  );
};

export default CustomTableHeaderCell;
