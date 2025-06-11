import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  links: {
    current_page: number;
    last_page: number;
  };
  from: number;
  to: number;
  total: number;
}

const Pagination: React.FC<PaginationProps> = ({ links, from, to, total }) => {
  if (total <= 0) {
    return null;
  }
  
  // Generate page links
  const pageLinks = [];
  for (let i = 1; i <= links.last_page; i++) {
    pageLinks.push(
      <Link
        key={i}
        href={route('tasks.index', { page: i })}
        className={`${
          i === links.current_page
            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600 dark:bg-indigo-900 dark:border-indigo-500 dark:text-indigo-300'
            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
        } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
      >
        {i}
      </Link>
    );
  }

  return (
    <div className="mt-8 flex items-center justify-between">
      <div className="flex-1 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing <span className="font-medium">{from}</span> to{' '}
            <span className="font-medium">{to}</span> of{' '}
            <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Link
              href={links.current_page !== 1 ? route('tasks.index', { page: links.current_page - 1 }) : '#'}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 ${
                links.current_page === 1 
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-5 w-5" />
            </Link>
            
            {pageLinks}
            
            <Link
              href={links.current_page !== links.last_page ? route('tasks.index', { page: links.current_page + 1 }) : '#'}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 ${
                links.current_page === links.last_page 
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;