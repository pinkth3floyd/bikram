'use client';

import * as React from 'react';
import Link from 'next/link';
import { HiChevronRight } from 'react-icons/hi';
import { cn } from '@/app/core/ui/elements/ClassnameUtil';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <HiChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
            )}
            <li className="flex items-center">
              <Link
                href={item.href}
                className={cn(
                  'text-sm font-medium hover:text-blue-600 transition-colors',
                  index === items.length - 1
                    ? 'text-slate-700'
                    : 'text-slate-500'
                )}
              >
                {item.label}
              </Link>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
} 