import React from 'react';
        import { Button } from './Button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './Select';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className = '',
}: PaginationProps) {
  const pageSizeOptions = [10, 20, 30, 50];

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span>Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(parseInt(value))}
        >
          <SelectTrigger className="w-[70px] h-8 bg-gray-100 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-400 focus:border-blue-400">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className='bg-white border border-gray-200 shadow-md'>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-4 text-gray-700">
          {`${(currentPage - 1) * pageSize + 1}-${Math.min(
            currentPage * pageSize,
            totalItems
          )} of ${totalItems}`}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 p-0 rounded-md ${
                currentPage === page
                  ? "bg-slate-300 text-gray-800 border border-slate-400 hover:bg-slate-400"
                  : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
              }`}
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100"
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
} 